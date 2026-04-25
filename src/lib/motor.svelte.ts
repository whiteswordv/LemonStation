import { NetworkTables, NetworkTablesTopic, NetworkTablesTypeInfos } from "ntcore-ts-client";

const tableHostName = "LemonBox"
export const ntcore: NetworkTables = NetworkTables.getInstanceByTeam(308);

export class Motor {

    private speedTopic: NetworkTablesTopic<number>;
    private ampsTopic: NetworkTablesTopic<number>;
    private voltageTopic: NetworkTablesTopic<number>;

    private brushlessTopic: NetworkTablesTopic<boolean>;
    private typeTopic: NetworkTablesTopic<string>;
    private faultsTopic: NetworkTablesTopic<string>;
    private stickyFaultsTopic: NetworkTablesTopic<string>;

    private _speed: number = $state(0);
    private _amps: number = $state(0);
    private _voltage: number = $state(0);

    private _disabled: boolean = $state(true);
    private _brushless: boolean = $state(true);

    private _faults: string = $state("");
    private _stickyFaults: string = $state("");

    constructor(public readonly id: number) {

        this.speedTopic = ntcore.createTopic(`${tableHostName}/${id}/speed`, NetworkTablesTypeInfos.kDouble);
        this.ampsTopic = ntcore.createTopic(`${tableHostName}/${id}/amps`, NetworkTablesTypeInfos.kDouble);
        this.voltageTopic = ntcore.createTopic(`${tableHostName}/${id}/voltage`, NetworkTablesTypeInfos.kDouble);

        this.brushlessTopic = ntcore.createTopic(`${tableHostName}/${id}/brushless`, NetworkTablesTypeInfos.kBoolean);

        this.typeTopic = ntcore.createTopic(`${tableHostName}/${id}/type`, NetworkTablesTypeInfos.kString);
        this.faultsTopic = ntcore.createTopic(`${tableHostName}/${id}/faults`, NetworkTablesTypeInfos.kString);
        this.stickyFaultsTopic = ntcore.createTopic(`${tableHostName}/${id}/stickyFaults`, NetworkTablesTypeInfos.kString);

        this.disabled = true;
        this.brushless = true;

        this.faultsTopic.subscribe(value => this._faults = value || "");
        this.stickyFaultsTopic.subscribe(value => this._stickyFaults = value || "");

        this.brushlessTopic.subscribe(value => this._brushless = value || true);

        this.ampsTopic.subscribe(value => this._amps = value || 0);
        this.voltageTopic.subscribe(value => this._voltage = value || 0);

    }

    public set speed(speed: number) {
        this._speed = speed;
        this.speedTopic.setValue(this._disabled ? 0 : this._speed);
    }

    public get speed(): number {
        return this._speed;
    }

    public set disabled(disabled: boolean) {
        this._disabled = disabled;
        this.speedTopic.setValue(this._disabled ? 0 : this._speed);
    }

    public get disabled(): boolean {
        return this._disabled || true;
    }

    public get type(): string {
        return this.typeTopic.getValue() || "Unknown";
    }

    public get faults(): string {
        return this.faultsTopic.getValue() || "Unknown";
    }

    public get stickyFaults(): string {
        return this.stickyFaultsTopic.getValue() || "Unknown";
    }

    public get amps(): number {
        return this.ampsTopic.getValue() || 0;
    }

    public get voltage(): number {
        return this.voltageTopic.getValue() || 0;
    }

    public get brushless(): boolean {
        this._brushless = this.brushlessTopic.getValue() || true;
        return this._brushless;
    }

    public set brushless(brushless: boolean) {
        this._brushless = brushless
        this.brushlessTopic.setValue(this._brushless);
    }

    public get displayText() {
        switch (this.type) {
            case "sparkmax":
                return "SPARK MAX";
            case "talonfx":
                return "TalonFX";
            default:
                return "Unknown";
        }
    }

    public get imagePath() {
        switch (this.type) {
            case "sparkmax":
                return "imgs/sparkmax.png";
            case "talonfx":
                return "imgs/krakenX60.png";
            default:
                return "imgs/placeHolder.png";
        }
    }

    private static activeMotorIDs: number[] = [];
    private static activeMotors: Motor[] = [];

    public static get motors(): Motor[] {
        return this.activeMotors;
    }

    private static activeMotorTopic: NetworkTablesTopic<number[]> = ntcore.createTopic(`${tableHostName}/activeMotors`, NetworkTablesTypeInfos.kIntegerArray);

    public static init() {
        this.activeMotorTopic.subscribe(value => {
            this.activeMotorIDs = value || [];
            this.activeMotors = this.activeMotorIDs.map(id => new Motor(id));
        });
    }
}

Motor.init();

