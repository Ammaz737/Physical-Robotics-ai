---
sidebar_position: 2
---

# NVIDIA Isaac ROS: GPU-Accelerated AI for Robotics

For developers working with NVIDIA Jetson hardware, **NVIDIA Isaac ROS** provides a collection of hardware-accelerated packages for the Robot Operating System (ROS) 2. These packages are optimized to take advantage of the powerful NVIDIA Jetson platform, enabling high-performance AI inference, computer vision, and perception tasks directly on the edge.

## Why Isaac ROS on Jetson?

When running on a resource-constrained device like a Jetson Nano, you cannot use high-fidelity simulators like Isaac Sim. Instead, you leverage Isaac ROS to run your AI models directly on the hardware, interacting with the real world.

*   **Optimized for Jetson**: Isaac ROS is specifically designed and optimized for the Jetson platform, ensuring you get the most performance out of your hardware.
*   **GPU-Accelerated Packages**: Leverages the GPU on the Jetson for tasks like AI inference, image processing, and depth perception.
*   **ROS 2 Integration**: Seamlessly integrates with your existing ROS 2 projects.

## Common Isaac ROS Packages

*   **`isaac_ros_image_proc`**: Hardware-accelerated image processing functions.
*   **`isaac_ros_apriltag`**: GPU-accelerated AprilTag detection for robotics applications.
*   **`isaac_ros_dnn_inference`**: A package for running deep neural network (DNN) models for tasks like object detection and segmentation.
*   **`isaac_ros_visual_slam`**: A GPU-accelerated Visual SLAM package.

By using Isaac ROS, you can build powerful and efficient AI-powered robots on the Jetson platform.
