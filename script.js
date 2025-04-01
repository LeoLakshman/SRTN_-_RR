let jobs = [];
const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F67280', '#C06C84'];

function addJob(arrivalTime = 0.0, burstTime = 0.0) {
    const newJob = {
        id: jobs.length + 1,
        arrivalTime: parseFloat(arrivalTime),
        burstTime: parseFloat(burstTime),
        remainingTime: parseFloat(burstTime),
        startTime: -1.0,
        endTime: 0.0,
        turnaroundTime: 0.0,
        lastExecutionTime: -1.0
    };
    jobs.push(newJob);
    updateJobTable();
}

function removeLastJob() {
    if (jobs.length > 0) {
        jobs.pop();
        updateJobTable();
    }
}

function updateJobTable() {
    const tableBody = document.querySelector("#jobTable tbody");
    tableBody.innerHTML = '';
    jobs.forEach((job, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = 
            `<td>J${job.id}</td>
            <td><input type="number" class="form-control" step="0.1" value="${job.arrivalTime}" min="0" onchange="updateJobProperty(${index}, 'arrivalTime', this.value)"></td>
            <td><input type="number" class="form-control" step="0.1" value="${job.burstTime}" min="0.1" onchange="updateJobProperty(${index}, 'burstTime', this.value)"></td>
            <td>${job.startTime === -1 ? '-' : job.startTime.toFixed(1)}</td>
            <td>${job.endTime.toFixed(1)}</td>
            <td>${job.turnaroundTime.toFixed(1)}</td>`;
    });
}

function updateJobProperty(index, property, value) {
    jobs[index][property] = parseFloat(value);
    if (property === 'burstTime') {
        jobs[index].remainingTime = parseFloat(value);
    }
}

function calculateSRTN() {
    const cpuCount = parseInt(document.getElementById("cpuCount").value);
    const timeQuantum = parseFloat(document.getElementById("timeQuantum").value);

    // Validate burst times
    if (jobs.some(job => job.burstTime <= 0)) {
        alert("Burst time for all jobs must be greater than 0.");
        return;
    }

    // Reset job states
    jobs.forEach(job => {
        job.remainingTime = job.burstTime;
        job.startTime = -1.0;
        job.endTime = 0.0;
        job.turnaroundTime = 0.0;
        job.lastExecutionTime = -1.0;
    });

    let currentTime = 0.0;
    let completedJobs = 0;
    let runningJobs = new Array(cpuCount).fill(null);
    let jobHistory = [];
    let jobQueueHistory = [];

    while (completedJobs < jobs.length) {
        let availableJobs = jobs.filter(job =>
            job.arrivalTime <= currentTime &&
            job.remainingTime > 0
        ).sort((a, b) => a.remainingTime - b.remainingTime || a.arrivalTime - b.arrivalTime);

        if (Math.abs(currentTime % timeQuantum) < 0.0001) {
            jobQueueHistory.push({
                time: currentTime,
                jobs: availableJobs.filter(job =>
                    !runningJobs.some(rj => rj && rj.id === job.id)
                ).map(job => ({
                    id: job.id,
                    remainingTime: job.remainingTime
                }))
            });

            runningJobs = runningJobs.map(() => null);
            for (let i = 0; i < Math.min(cpuCount, availableJobs.length); i++) {
                let job = availableJobs[i];
                if (job.startTime === -1) {
                    job.startTime = currentTime;
                }
                runningJobs[i] = { id: job.id, allocatedTime: 0.0 };
            }
        }

        for (let i = 0; i < cpuCount; i++) {
            if (runningJobs[i] !== null) {
                let runningJob = runningJobs[i];
                let job = jobs.find(j => j.id === runningJob.id);
                const executionTime = Math.min(timeQuantum, job.remainingTime);

                job.remainingTime -= executionTime;
                runningJob.allocatedTime += executionTime;

                jobHistory.push({
                    jobId: job.id,
                    cpuId: i,
                    startTime: currentTime,
                    endTime: currentTime + executionTime
                });

                if (job.remainingTime <= 0.0001) {
                    job.endTime = currentTime + executionTime;
                    job.turnaroundTime = job.endTime - job.arrivalTime;
                    completedJobs++;
                    runningJobs[i] = null;
                }
            } else {
                jobHistory.push({
                    jobId: 'idle',
                    cpuId: i,
                    startTime: currentTime,
                    endTime: currentTime + timeQuantum
                });
            }
        }

        currentTime += timeQuantum;
    }

    updateJobTable();
    calculateAverageTurnaroundTime();
    drawGanttChart(jobHistory, jobQueueHistory);
}

function calculateRoundRobin() {
    const cpuCount = parseInt(document.getElementById("cpuCount").value);
    const timeQuantum = parseFloat(document.getElementById("timeQuantum").value);

    // Validate burst times
    if (jobs.some(job => job.burstTime <= 0)) {
        alert("Burst time for all jobs must be greater than 0.");
        return;
    }

    // Reset job states
    jobs.forEach(job => {
        job.remainingTime = job.burstTime;
        job.startTime = -1.0;
        job.endTime = 0.0;
        job.turnaroundTime = 0.0;
        job.lastExecutionTime = -1.0;
    });

    let currentTime = 0.0;
    let completedJobs = 0;
    let runningJobs = new Array(cpuCount).fill(null);
    let jobQueue = [];
    let jobHistory = [];
    let jobQueueHistory = [];

    while (completedJobs < jobs.length) {
        jobs.forEach(job => {
            if (Math.abs(job.arrivalTime - currentTime) < 0.0001 && !jobQueue.includes(job) && job.remainingTime > 0) {
                jobQueue.push(job);
            }
        });

        if (Math.abs(currentTime % timeQuantum) < 0.0001) {
            runningJobs.forEach((runningJob, index) => {
                if (runningJob !== null) {
                    let job = jobs.find(j => j.id === runningJob.id);
                    if (job.remainingTime > 0) {
                        jobQueue.push(job);
                    }
                    runningJobs[index] = null;
                }
            });

            jobQueueHistory.push({
                time: currentTime,
                jobs: jobQueue.map(job => ({
                    id: job.id,
                    remainingTime: job.remainingTime
                }))
            });

            for (let i = 0; i < cpuCount && jobQueue.length > 0; i++) {
                if (runningJobs[i] === null) {
                    let job = jobQueue.shift();
                    if (job.startTime === -1) {
                        job.startTime = currentTime;
                    }
                    runningJobs[i] = { id: job.id, allocatedTime: 0.0 };
                }
            }
        }

        for (let i = 0; i < cpuCount; i++) {
            if (runningJobs[i] !== null) {
                let runningJob = runningJobs[i];
                let job = jobs.find(j => j.id === runningJob.id);
                const executionTime = Math.min(timeQuantum, job.remainingTime);

                job.remainingTime -= executionTime;
                runningJob.allocatedTime += executionTime;

                jobHistory.push({
                    jobId: job.id,
                    cpuId: i,
                    startTime: currentTime,
                    endTime: currentTime + executionTime
                });

                if (job.remainingTime <= 0.0001) {
                    job.endTime = currentTime + executionTime;
                    job.turnaroundTime = job.endTime - job.arrivalTime;
                    completedJobs++;
                    runningJobs[i] = null;
                }
            } else {
                jobHistory.push({
                    jobId: 'idle',
                    cpuId: i,
                    startTime: currentTime,
                    endTime: currentTime + timeQuantum
                });
            }
        }

        currentTime += timeQuantum;
    }

    updateJobTable();
    calculateAverageTurnaroundTime();
    drawGanttChart(jobHistory, jobQueueHistory);
}

function calculateAverageTurnaroundTime() {
    const turnaroundTimes = jobs.map(job => job.turnaroundTime);
    const totalTurnaroundTime = turnaroundTimes.reduce((sum, time) => sum + time, 0.0);
    const averageTurnaroundTime = totalTurnaroundTime / jobs.length;

    const calculation = turnaroundTimes.map(t => t.toFixed(1)).join(' + ');
    const result = averageTurnaroundTime.toFixed(2);

    document.getElementById("averageTurnaroundTime").innerHTML = `
        Average Turnaround Time: (${calculation}) / ${jobs.length} = <b>${result}</b>
    `;
}

function drawGanttChart(jobHistory, jobQueueHistory) {
    const ganttChart = document.getElementById("ganttChart");
    ganttChart.innerHTML = '';

    const cpuCount = parseInt(document.getElementById("cpuCount").value);
    const timeQuantum = parseFloat(document.getElementById("timeQuantum").value);
    const maxEndTime = Math.max(...jobHistory.map(entry => entry.endTime));

    for (let i = 0; i < cpuCount; i++) {
        const rowDiv = document.createElement("div");
        rowDiv.className = "cpu-row";
        ganttChart.appendChild(rowDiv);

        let segmentStart = 0;
        const cpuHistory = jobHistory.filter(entry => entry.cpuId === i).sort((a, b) => a.startTime - b.startTime);

        cpuHistory.forEach(entry => {
            let blockStart = entry.startTime;
            let blockEnd = entry.endTime;

            while (blockStart < blockEnd) {
                const drawEnd = Math.min(blockStart + timeQuantum, blockEnd);
                const widthPercentage = ((drawEnd - blockStart) / maxEndTime) * 100;

                if (widthPercentage > 0) {
                    const jobBlock = document.createElement("div");
                    jobBlock.className = "job-block";
                    jobBlock.style.width = `${widthPercentage}%`;

                    if (entry.jobId === 'idle') {
                        jobBlock.classList.add('idle-block');
                    } else {
                        jobBlock.style.backgroundColor = colors[(entry.jobId - 1) % colors.length];
                        jobBlock.textContent = `J${entry.jobId}`;
                    }
                    rowDiv.appendChild(jobBlock);
                }
                blockStart = drawEnd;
            }
        });
    }

    const timeAxisDiv = document.createElement("div");
    timeAxisDiv.className = "time-axis";
    ganttChart.appendChild(timeAxisDiv);

    for (let t = 0; t <= maxEndTime; t += timeQuantum) {
        const markerDiv = document.createElement("div");
        markerDiv.className = "time-marker";
        markerDiv.style.left = `${(t / maxEndTime * 100)}%`;
        markerDiv.textContent = t.toFixed(1);
        timeAxisDiv.appendChild(markerDiv);

        const lineDiv = document.createElement("div");
        lineDiv.className = "dashed-line";
        lineDiv.style.left = `${(t / maxEndTime * 100)}%`;
        ganttChart.appendChild(lineDiv);

        const queueEntry = jobQueueHistory.find(entry => Math.abs(entry.time - t) < 0.0001);
        if (queueEntry) {
            const queueDiv = document.createElement("div");
            queueDiv.className = "queue-container";
            queueDiv.style.left = `${(t / maxEndTime * 100)}%`;
            queueDiv.style.top = `${timeAxisDiv.offsetTop + 60}px`;

            const queueJobsDiv = document.createElement("div");
            queueJobsDiv.className = "queue-jobs";
            if (queueEntry.jobs.length > 0) {
                queueJobsDiv.innerHTML = queueEntry.jobs.map(job =>
                    `J${job.id} = ${job.remainingTime.toFixed(1)}`
                ).join('<br>');
            } else {
                queueJobsDiv.innerHTML = "{ }";
            }
            queueDiv.appendChild(queueJobsDiv);
            ganttChart.appendChild(queueDiv);
        }
    }

    jobs.forEach(job => {
        if (job.arrivalTime > 0 && job.arrivalTime <= maxEndTime) {
            const arrivalNameDiv = document.createElement("div");
            arrivalNameDiv.className = "job-arrival-name";
            arrivalNameDiv.style.left = `${(job.arrivalTime / maxEndTime * 100)}%`;
            arrivalNameDiv.textContent = `J${job.id}`;
            timeAxisDiv.appendChild(arrivalNameDiv);

            const arrivalTimeDiv = document.createElement("div");
            arrivalTimeDiv.className = "job-arrival";
            arrivalTimeDiv.style.left = `${(job.arrivalTime / maxEndTime * 100)}%`;
            arrivalTimeDiv.textContent = job.arrivalTime.toFixed(1);
            timeAxisDiv.appendChild(arrivalTimeDiv);

            const arrivalLineDiv = document.createElement("div");
            arrivalLineDiv.className = "arrival-line";
            arrivalLineDiv.style.left = `${(job.arrivalTime / maxEndTime * 100)}%`;
            ganttChart.appendChild(arrivalLineDiv);
        }
    });

    const containerHeight = ganttChart.offsetHeight + 100;
    document.getElementById('ganttChartContainer').style.height = `${containerHeight}px`;
}

// Initialize with default jobs
addJob(0, 4);   // J1
addJob(0.5, 2); // J2
addJob(1, 6);   // J3
addJob(1, 1.5); // J4
updateJobTable();

// Re-calculate schedules when CPU count or time quantum changes
document.getElementById("cpuCount").addEventListener("change", () => {
    calculateSRTN();
    calculateRoundRobin();
});

document.getElementById("timeQuantum").addEventListener("change", () => {
    calculateSRTN();
    calculateRoundRobin();
});
