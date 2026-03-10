package frc.robot.subsystems;

import java.util.EnumSet;

import com.ctre.phoenix6.configs.CurrentLimitsConfigs;
import com.ctre.phoenix6.configs.FeedbackConfigs;
import com.ctre.phoenix6.configs.MotorOutputConfigs;
import com.ctre.phoenix6.configs.TalonFXConfiguration;
import com.ctre.phoenix6.hardware.TalonFX;
import com.ctre.phoenix6.signals.FeedbackSensorSourceValue;
import com.ctre.phoenix6.signals.InvertedValue;
import com.ctre.phoenix6.signals.NeutralModeValue;
import com.revrobotics.PersistMode;
import com.revrobotics.ResetMode;
import com.revrobotics.spark.SparkMax;
import com.revrobotics.spark.SparkLowLevel.MotorType;
import com.revrobotics.spark.config.SparkMaxConfig;
import com.revrobotics.spark.config.SparkBaseConfig.IdleMode;

import edu.wpi.first.networktables.BooleanEntry;
import edu.wpi.first.networktables.DoubleEntry;
import edu.wpi.first.networktables.NetworkTable;
import edu.wpi.first.networktables.NetworkTableInstance;
import edu.wpi.first.networktables.StringEntry;
import edu.wpi.first.networktables.NetworkTableEvent.Kind;
import edu.wpi.first.wpilibj2.command.Command;
import edu.wpi.first.wpilibj2.command.SubsystemBase;

public class Motor extends SubsystemBase {

    private final Integer m_id;

    private NetworkTable m_motorTable;
    private NetworkTable m_motor;

    private StringEntry m_typeEntry;
    private DoubleEntry m_speedEntry;
    private BooleanEntry m_brushlessEntry;
    private StringEntry m_motorFaults;

    private SparkMax m_sparkMax;
    private TalonFX m_talonFX;

    public Motor(Integer id) {
        m_id = id;

        NetworkTableInstance inst = NetworkTableInstance.getDefault();
        m_motorTable = inst.getTable("LemonStation");
        m_motor = m_motorTable.getSubTable(id.toString());

        m_typeEntry = m_motor.getStringTopic("type").getEntry("unknown");
        m_speedEntry = m_motor.getDoubleTopic("speed").getEntry(0);
        m_brushlessEntry = m_motor.getBooleanTopic("brushless").getEntry(false);
        m_motorFaults = m_motor.getStringTopic("faults").getEntry("");
    }

    @Override
    public void periodic() {

        try (SparkMax sparkMax = new SparkMax(m_id,
                m_brushlessEntry.get() ? MotorType.kBrushless : MotorType.kBrushed)) {
            if (sparkMax.getFirmwareVersion() != 0) {
                m_typeEntry.set("sparkmax");
                m_motorFaults.set(sparkMax.getFaults().toString());

                if (m_typeEntry.get() != "sparkmax")
                    constructSpark(m_id);

                return;
            }
        }

        try (TalonFX talonFX = new TalonFX(m_id)) {
            if (talonFX.isConnected()) {
                m_typeEntry.set(talonFX.getDescription());
                m_motorFaults.set(talonFX.getFaultField().toString());
                m_typeEntry.set("falcon500");

                if (m_typeEntry.get() != "falcon500")
                    constructorTalon(m_id);

                return;
            }
        }

        m_typeEntry.set("unknown");

    }

    private void constructSpark(int id) {
        SparkMaxConfig config = new SparkMaxConfig();

        // config
        config
                .inverted(false)
                .idleMode(IdleMode.kCoast)
                .smartCurrentLimit(0);

        m_motorTable.addListener("brushless", EnumSet.of(Kind.kValueAll), (table, key, event) -> {
            MotorType type = m_brushlessEntry.get(false) ? MotorType.kBrushless : MotorType.kBrushed;
            m_sparkMax = new SparkMax(m_id, type);
        });

        m_motorTable.addListener("speed", EnumSet.of(Kind.kValueAll), (table, key, event) -> {
            m_sparkMax.set(m_speedEntry.get());
        });

        m_sparkMax.configure(config, ResetMode.kResetSafeParameters, PersistMode.kPersistParameters);

    }

    private void constructorTalon(int id) {
        TalonFXConfiguration config = new TalonFXConfiguration();

        m_talonFX = new TalonFX(id);

        // configuration
        config.withMotorOutput(
                new MotorOutputConfigs()
                        .withInverted(InvertedValue.Clockwise_Positive)
                        .withNeutralMode(NeutralModeValue.Coast))
                .withCurrentLimits(
                        new CurrentLimitsConfigs()
                                .withStatorCurrentLimit(75)
                                .withSupplyCurrentLimit(120))
                .withFeedback(
                        new FeedbackConfigs()
                                .withFeedbackSensorSource(FeedbackSensorSourceValue.RotorSensor)
                                .withRotorToSensorRatio(1.0)
                                .withSensorToMechanismRatio(1.0));

        m_talonFX.getConfigurator().apply(config);

        m_motorTable.addListener("speed", EnumSet.of(Kind.kValueAll), (table, key, event) -> {
            m_talonFX.set(m_speedEntry.get());
        });

    }

}
