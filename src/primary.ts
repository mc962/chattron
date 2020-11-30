import {app, BrowserWindow} from 'electron';
import path from "path";

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  // Creates the browser window
  mainWindow = new BrowserWindow({
     width: 0.5,
     height: 0.5,
      webPreferences: {
         devTools: true,
         contextIsolation: true,
         preload: path.join(__dirname, 'preload.js')
      },
      show: false

  });
  // and load the initial/main page of the app.

    mainWindow.loadFile('./views/index.html').then(() => {});
    mainWindow.on('ready-to-show', () => {
       if (mainWindow) {
           mainWindow.show();
           mainWindow.focus();
       }
    });

    mainWindow.webContents.openDevTools();

    mainWindow.webContents.on('dom-ready', () => {
       mainWindow?.webContents.send('window-loaded', '');
    });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
   if (process.platform !== 'darwin') {
       mainWindow = null;
       app.quit();
   }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

