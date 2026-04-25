<script lang="ts">
    import { Motor } from "./motor.svelte";

    let { motor }: { motor: Motor } = $props();
</script>

<div id="motor-propertie-container">
    <div id="display-container"></div>
    <div id="faults-container">
        <div id="faults"></div>
        <div id="sticky-faults"></div>
        <button id="clear-sticky-faults-button">clear</button>
    </div>

    <div id="properties-container">
        <h1 id="motor-name">{motor.displayText}</h1>
        <h2 id="motor-id">{motor.id}</h2>
        <h3 id="motor-speed">{motor.speed}</h3>

        <input
            id="speed-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            bind:value={motor.speed}
        />

        <input
            id="disabled-checkbox"
            type="checkbox"
            bind:value={motor.disabled}
        />

        {#if motor.type == "sparkmax"}
            <select
                name="motor-type"
                id="motor-type"
                bind:value={motor.brushless}
            >
                <option value="brushed">brushed</option>
                <option value="brushless">brushless</option>
            </select>
        {/if}

        <button id="back-button" onclick={() => {}}>Back</button>
    </div>
</div>
