---
sidebar_position: 2
---

# Lab Setup: Sim Rig vs. Edge Kit

Before we dive deeper into ROS 2, it's crucial to understand the different development and deployment environments you might encounter when working with AI and robotics. This section distinguishes between a "Sim Rig" and an "Edge Kit," and guides you on setting up your lab.

## The Sim Rig: Your Virtual Robotics Lab

A **Sim Rig** refers to a high-performance computer (often a desktop workstation with a powerful GPU) dedicated to running complex simulations. This environment is ideal for:

*   **Rapid Prototyping**: Test algorithms and robot behaviors without physical hardware constraints.
*   **Safety**: Experiment with potentially dangerous scenarios in a virtual environment.
*   **Scalability**: Run multiple simulations in parallel or simulate large-scale robotic systems.
*   **Debugging**: Utilize advanced simulation tools for detailed analysis of robot state and sensor data.

Key components of a typical Sim Rig setup include:

*   **Operating System**: Ubuntu (Linux) is the de facto standard for ROS 2 development.
*   **ROS 2 Installation**: Full desktop installation of ROS 2 (e.g., Humble, Iron, Jazzy).
*   **Simulation Environment**: Tools like Gazebo, NVIDIA Isaac Sim, or Webots for physics-based robot simulation.
*   **Development Tools**: IDEs (e.g., VS Code), compilers, and debugging utilities.
*   **Hardware**: A powerful CPU, ample RAM, and a high-end GPU (especially for NVIDIA Isaac Sim or real-time rendering in Gazebo).

### Setting up Your Sim Rig (Conceptual)

While detailed steps will be provided in a later section, a conceptual overview involves:

1.  Installing Ubuntu.
2.  Installing the appropriate ROS 2 distribution.
3.  Installing a simulation environment (e.g., Gazebo).
4.  Installing development tools and necessary dependencies.

## The Edge Kit: Bringing AI to Physical Robots

An **Edge Kit** refers to a compact, often low-power, embedded computing platform designed to be deployed directly on a physical robot or an "edge" device. These kits are optimized for:

*   **Real-world Deployment**: Running AI models and control algorithms directly on the robot.
*   **Low Latency**: Processing sensor data and issuing commands with minimal delay.
*   **Power Efficiency**: Operating on battery power for extended periods.
*   **Size & Weight Constraints**: Designed to fit within the physical form factor of a robot.

Common examples of Edge Kits include:

*   NVIDIA Jetson series (Nano, Xavier NX, Orin Nano)
*   Raspberry Pi (for simpler applications)
*   Google Coral Edge TPU

### Setting up Your Edge Kit (Conceptual)

Setting up an Edge Kit typically involves:

1.  Flashing a compatible operating system (often a customized Linux distribution) onto the device.
2.  Installing a lightweight version of ROS 2 (e.g., `ros-base` or `ros-core`).
3.  Optimizing AI models for inference on the embedded hardware.
4.  Interfacing with the robot's specific hardware (sensors, actuators).

## Choosing Your Path

Throughout this textbook, we will provide examples and exercises that can be performed on both a Sim Rig and, where applicable, an Edge Kit. For initial learning and experimentation, a Sim Rig is highly recommended due to its ease of setup and powerful debugging capabilities.

This distinction is critical for understanding the practical applications of AI and robotics, from development to deployment. In the next module, we'll dive into practical ROS 2 examples on your chosen setup.
