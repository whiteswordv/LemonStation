export const localhost = "http://127.0.0.1:5000";

import { app, BrowserWindow } from 'electron';


function createWindow() {

    const win = new BrowserWindow({
        width: 600,
        height: 600,
        autoHideMenuBar: true,
        fullscreen: false,
    });

    win.loadFile("src/index.html");

}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
}); 