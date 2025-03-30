<div align="center">
  <img src="https://raw.githubusercontent.com/leolakshman/SRTN_1/main/assets/logo.png" alt="SRTN and Round Robin Scheduler Logo" width="200">
  <h1>✨ SRTN & Round Robin Job Scheduling Visualizer ✨</h1>
  <p>A captivating web application to simulate and visualize CPU scheduling algorithms.</p>
</div>

---

## 🚀 Dive into CPU Scheduling!

Ever wondered how operating systems manage multiple tasks vying for precious CPU time? This interactive web application brings the power of **Shortest Remaining Time Next (SRTN)** and **Round Robin** scheduling right to your browser! Experiment with different job scenarios, configure your virtual CPUs, and witness these algorithms in action through dynamic visualizations.

## 🌟 Key Features

* **Intuitive Job Input:** Effortlessly add, edit, and remove jobs with their arrival and burst times using a clean, user-friendly table.
* **Flexible CPU Configuration:** Simulate parallel processing by specifying the number of CPUs your system has.
* **Round Robin Control:** Fine-tune the Round Robin algorithm by setting the time quantum, dictating how long each job gets a turn.
* **Algorithm Showdown:** Witness the contrasting behaviors of **SRTN** (prioritizing jobs with the least remaining work) and **Round Robin** (ensuring fair CPU time allocation).
* **Dynamic Gantt Chart:** Observe the CPU timeline unfold with a visually appealing Gantt chart:
    * Clear separation of CPU activity on individual rows.
    * Vibrant color-coding to distinguish between jobs.
    * Visual cues for idle CPU time.
    * Precise markers indicating time quantum boundaries (for Round Robin).
    * Informative vertical lines highlighting job arrival times.
* **Insightful Queue Visualization:** For every time quantum, see the exact state of the ready queue directly within the Gantt chart, helping you understand scheduling decisions.
* **Performance Metrics:** Get a clear picture of scheduling efficiency with the calculated **Average Turnaround Time** displayed prominently.
* **Detailed Job Table:** Review comprehensive information for each job, including its ID, arrival time, burst time, calculated start and end times, and turnaround time.

## 🛠️ How to Get Started

1.  **Open in Your Browser:** Simply open the `index.html` file in your favorite web browser. No installation required!
    [![Open SRTN & Round Robin Scheduler](https://img.shields.io/badge/Open%20Scheduler-blue?style=for-the-badge&logo=html5)](https://leolakshman.github.io/SRTN_1/)
    (Or visit [https://leolakshman.github.io/SRTN_1/](https://leolakshman.github.io/SRTN_1/))
2.  **Configure Your Simulation:**
    * Set the "Number of CPUs" according to your desired simulation environment.
    * For Round Robin simulations, adjust the "Time Quantum" to control the time slice.
3.  **Define Your Workload:**
    * Click "**Add Job**" to introduce new tasks.
    * Enter the "**Arrival Time**" and "**Burst Time**" for each job in the table.
    * Use "**Remove Last Job**" if you need to adjust your job list.
4.  **Run the Simulation:**
    * Click "**Calculate SRTN**" to see the Shortest Remaining Time Next algorithm in action.
    * Click "**Calculate Round Robin**" to visualize the Round Robin scheduling process.
5.  **Analyze the Results:**
    * Examine the updated "**Job Table**" for individual job timelines.
    * Review the "**Average Turnaround Time**" to assess the algorithm's performance.
    * Study the interactive "**Gantt Chart**" to understand CPU utilization and job execution order. Pay close attention to the queue information at each time step!

## 📂 Project Structure

.
├── index.html          # The main HTML file for the user interface
├── script.js           # JavaScript logic for scheduling and visualization
└── styles.css          # CSS for styling the application


## 💻 Built With

* HTML
* CSS
* JavaScript
* [Bootstrap](https://getbootstrap.com/) - For responsive layout and basic styling.

## ✨ Contributing

While this project is currently a personal endeavor, feel free to fork the repository and suggest improvements or report issues. Your feedback is always welcome!

## 🙏 Acknowledgements

* Inspired by the fundamental concepts of operating system CPU scheduling.
* Utilizes the power of web technologies for interactive learning.

---

<p align="center">
  Made with ❤️ by LeoLakshman
</p>

---
