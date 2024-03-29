const { app, BrowserWindow, ipcMain } = require("electron");
const { channels } = require("../src/shared/constants");
const { createServer } = require("../server/server");
const path = require("path");
const url = require("url");

let mainWindow;
let server;

function createWindow() {
  // important for deployment -> delete path "build" 
  // -> https://stackoverflow.com/questions/41130993/electron-not-allowed-to-load-local-resource
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, "../build/index.html"),
      protocol: "file:",
      slashes: true
    });
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });
  mainWindow.loadURL(startUrl);
  mainWindow.on("closed", function() {
    mainWindow = null;
  });
}

app.on("ready", () => {
  server = createServer();
  createWindow();
});

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on(channels.APP_INFO, event => {
  event.sender.send(channels.APP_INFO, {
    appName: app.getName(),
    appVersion: app.getVersion()
  });
});
