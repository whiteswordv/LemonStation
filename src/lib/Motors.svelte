<script lang="ts">
    import { Motor } from "./motor.svelte";
    import MotorTile from "./MotorTile.svelte";

    let selectedMotor: Motor | null = $state(null);
</script>

<div id="tile-grid">
    {#each Motor.motors as motor (motor.id)}
        <MotorTile {motor} onPressed={() => (selectedMotor = motor)} />
    {/each}
</div>
