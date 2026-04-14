<script lang="ts">
  export const localhost = "http://127.0.0.1:5000";

  const navContainer = document.getElementById("nav-container");
  const tabContainer = document.getElementById("tab-container");
  const addTabButton = document.getElementById("add-button");

  const warningContainer = document.getElementById("warning-container");

  setInterval(() => {
    // checking if its connected
    fetch(`${localhost}/tableConnected`)
      .then((res) => res.json())
      .then((data) => {
        const connected: boolean = data;
      });
  }, 200);
</script>

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lemon Station</title>
  <link rel="stylesheet" href="style.css" />
</head>

<body>
  <div id="navigation-container">
    <div id="tab-container"></div>
    <button id="add-tab-button">+</button>
  </div>
  <div id="warning-message">
    <p id="warning"></p>
  </div>

  <div class="content"></div>

  <script src="app.ts"></script>
</body>
