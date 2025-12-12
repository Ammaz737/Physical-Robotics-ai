---
sidebar_position: 1
---

# URDF Creation: Describing Your Robot

Welcome to Module 2! In this module, we'll delve into the world of robot modeling using the Unified Robot Description Format (URDF). URDF is an XML-based file format used in ROS to describe all aspects of a robot, including its visual appearance, collision properties, and inertial characteristics. This description is crucial for both visualization in tools like RViz and for simulation in environments such as Gazebo.

## What is URDF?

URDF defines a robot as a collection of **links** and **joints**:

*   **Links**: Represent the rigid bodies of the robot (e.g., base, arm segments, end-effector). Each link has associated visual, collision, and inertial properties.
*   **Joints**: Connect two links and define their kinematic relationship (e.g., how they can move relative to each other). Joints can be fixed, revolute (rotating), prismatic (sliding), continuous, etc.

By describing your robot in URDF, you provide simulation and visualization tools with the necessary information to accurately represent and interact with your robot.

## Key Elements of a URDF File

A typical URDF file contains a `<robot>` tag as its root, inside which you define your links and joints.

### 1. The `<link>` Element

Each `<link>` element defines a rigid body. It can contain:

*   **`<visual>`**: Describes the graphical properties of the link, suchs as its geometry (e.g., box, cylinder, mesh) and material (color, texture). This is what you see in RViz or Gazebo.
*   **`<collision>`**: Describes the collision properties of the link. This is used by physics engines to detect collisions. It often has a simpler geometry than the visual model for computational efficiency.
*   **`<inertial>`**: Defines the mass, center of mass, and moments of inertia of the link. This is critical for accurate physics simulation.

### 2. The `<joint>` Element

Each `<joint>` element connects a `parent` link to a `child` link. Key attributes and elements include:

*   **`name`**: A unique identifier for the joint.
*   **`type`**: Specifies the type of joint (e.g., `revolute`, `prismatic`, `fixed`).
*   **`<parent>`**: Specifies the `name` of the parent link.
*   **`<child>`**: Specifies the `name` of the child link.
*   **`<origin>`**: Defines the transform from the parent link's frame to the child link's frame (position and orientation).
*   **`<axis>`**: For revolute and prismatic joints, specifies the axis of rotation or translation.
*   **`<limit>`**: Defines the joint's movement limits (upper, lower, velocity, effort).

## Example: A 2-DOF Robotic Arm Segment

Let's consider a simple segment of our 2-DOF robotic arm: a base link connected to a first arm link via a revolute joint.

```xml
<?xml version="1.0"?>
<robot name="simple_arm">

  <link name="base_link">
    <visual>
      <geometry>
        <box size="0.1 0.1 0.1"/>
      </geometry>
      <material name="blue">
        <color rgba="0 0 0.8 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="0.1 0.1 0.1"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="0.1"/>
      <inertia ixx="0.001" ixy="0.0" ixz="0.0" iyy="0.001" iyz="0.0" izz="0.001"/>
    </inertial>
  </link>

  <link name="link1">
    <visual>
      <geometry>
        <cylinder length="0.5" radius="0.02"/>
      </geometry>
      <material name="green">
        <color rgba="0 0.8 0 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <cylinder length="0.5" radius="0.02"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="0.2"/>
      <inertia ixx="0.005" ixy="0.0" ixz="0.0" iyy="0.005" iyz="0.0" izz="0.0001"/>
    </inertial>
  </link>

  <joint name="joint1" type="revolute">
    <parent link="base_link"/>
    <child link="link1"/>
    <origin xyz="0 0 0.05" rpy="0 0 0"/>
    <axis xyz="0 0 1"/>
    <limit lower="-3.14" upper="3.14" effort="100" velocity="100"/>
  </joint>

</robot>
