import {setupChat} from "./renderer";
import {ipcRenderer} from "electron";

ipcRenderer.on('window-loaded', () => {
    setupChat();
});