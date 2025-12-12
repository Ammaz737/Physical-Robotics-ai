---
sidebar_position: 1
---

# Introduction to ROS 2: Nodes and Topics

Welcome to Module 1! In this module, we'll dive into the Robot Operating System 2 (ROS 2), the foundational middleware for building complex robotic applications. Specifically, we'll start with the two most fundamental concepts: **Nodes** and **Topics**.

## What is ROS 2?

ROS 2 is not an operating system in the traditional sense, but rather a set of software libraries, tools, and conventions that aim to simplify the task of creating complex and robust robot behaviors across a wide variety of robotic platforms. It provides a standardized communication infrastructure and a collection of useful tools for managing the entire robot development lifecycle.

## Nodes: The Building Blocks

In ROS 2, a **Node** is essentially an executable process that performs computations. Think of a node as a single, focused program responsible for a specific task within your robotic system. For example:

*   A camera driver node that publishes image data.
*   A motor control node that subscribes to commands and controls the robot's wheels.
*   A sensor fusion node that processes data from multiple sensors.

Each node is designed to be modular and reusable, allowing you to build complex systems by combining many small, single-purpose nodes.

## Topics: The Communication Highways

**Topics** are the primary mechanism for nodes to exchange data in a publish-subscribe messaging pattern. When a node wants to share information, it ** publishes** a message to a topic. Any other node interested in that information can then **subscribe** to that topic to receive the messages.

*   **Publisher**: A node that sends messages to a topic.
*   **Subscriber**: A node that receives messages from a topic.
*   **Message**: The actual data being sent over a topic. Messages have defined data types (e.g., `std_msgs/String`, `sensor_msgs/Image`).

This decoupled communication allows for flexible and scalable robotic architectures, where nodes can be added, removed, or restarted independently without affecting the entire system.

### Example: A Simple ROS 2 Communication

Imagine a robot with a proximity sensor and an LED indicator:

1.  **Sensor Node**: Reads data from the proximity sensor. It **publishes** distance readings to a topic named `/distance_sensor_readings` with a message type of `std_msgs/Float32`.
2.  **LED Control Node**: **Subscribes** to `/distance_sensor_readings`. If the distance is below a certain threshold, it publishes a command to another topic, `/led_status`, to turn the LED red. If safe, it publishes a command to turn it green.

This publish-subscribe model is fundamental to how ROS 2 systems operate, enabling various components of a robot to work together seamlessly.

## Key Takeaways

*   **Nodes** are modular executable processes.
*   **Topics** are named buses over which nodes exchange messages.
*   **Publishers** send messages; **Subscribers** receive them.
*   Messages have defined data types.

In the next section, we'll look at how to set up your development environment to start experimenting with ROS 2 nodes and topics!
