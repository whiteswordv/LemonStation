// Copyright (c) FIRST and other WPILib contributors.
// Open Source Software; you can modify and/or share it under the terms of
// the WPILib BSD license file in the root directory of this project.

package frc.robot;

import frc.robot.subsystems.Motor;

public class RobotContainer {
  // The robot's subsystems and commands are defined here...
  private Motor[] motors;

  /**
   * The container for the robot. Contains subsystems, OI devices, and commands.
   */
  public RobotContainer() {

    createMotorList();

  }

  public void createMotorList() {
    motors = new Motor[64];

    for (int i = 0; i < 64; i++) {

      Motor motor = new Motor(i);

      motors[i] = motor;
    }
  }

}
