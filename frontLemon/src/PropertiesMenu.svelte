<div id="motor-propertie-container">
    <div id="display-container"></div>
    <div id="faults-container">
        <div id="faults"></div>
        <div id="sticky-faults"></div>
        <button id="clear-sticky-faults-button">clear</button>
    </div>
    <div id="addon-properties-container">
        <select name="motor-type" id="motor-type">
            <option value="brushed">brushed</option>
            <option value="brushless"></option>
        </select>
    </div>

    <div id="properties-container">
        <h1 id="motor-name">motor name</h1>
        <h2 id="motor-id">motor id</h2>
        <h3 id="motor-speed">motor speed</h3>

        <input
            id="speed-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value="0"
        />

        <input id="inverted-checkbox" type="checkbox" />

        <button id="back-button">Back</button>
    </div>

    <script src="motorPropertiesMenu.ts"></script>
</div>
