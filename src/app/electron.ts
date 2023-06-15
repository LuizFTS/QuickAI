import {IpcMain} from 'electron'
let ipcRenderer: any;
if (window.process && window.process.type === 'renderer') {
  const electron = window.require('electron');
  ipcRenderer = electron.ipcRenderer;
}

export const sendIpcRendererEvent = (channel: string, ...args: any[]): void => {
  if (ipcRenderer) {
    ipcRenderer.send(channel, ...args);
  }
};

export const onIpcRendererEvent = (
  channel: string,
  listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
): void => {
  if (ipcRenderer) {
    ipcRenderer.on(channel, listener);
  }
};

export const removeIpcRendererEvent = (channel: string, listener: (...args: any[]) => void): void => {
  if (ipcRenderer) {
    ipcRenderer.removeListener(channel, listener);
  }
};