<script lang="ts">
    import type { Motor } from "./motor.svelte";

    const { motor, onPressed }: { motor: Motor; onPressed: () => void } =
        $props();
</script>

<button id="tile-container" onclick={onPressed}>
    <img id="motor-img" src={motor.imagePath} alt="" />
    <h2 id="motor-id">Id: {motor.id}</h2>
    <h3 id="motor-name">{motor.displayText}</h3>
</button>

<style>
</style>
