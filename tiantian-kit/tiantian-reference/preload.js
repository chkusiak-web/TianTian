const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  load: () => ipcRenderer.invoke('store:load'),
  save: (d) => ipcRenderer.invoke('store:save', d),
  exportData: (d) => ipcRenderer.invoke('store:export', d),
  importData: () => ipcRenderer.invoke('store:import'),
  voices: () => ipcRenderer.invoke('tts:voices'),
  speak: (o) => ipcRenderer.invoke('tts:speak', o),
  stopSpeak: () => ipcRenderer.invoke('tts:stop'),
  micAccess: () => ipcRenderer.invoke('mic:access'),
  setReminder: (r) => ipcRenderer.invoke('reminder:set', r),
  setLogin: (on) => ipcRenderer.invoke('login:set', on),
  aiStatus: (model) => ipcRenderer.invoke('ai:status', model),
  aiChat: (req) => ipcRenderer.invoke('ai:chat', req),
  aiCancel: (id) => ipcRenderer.invoke('ai:cancel', id),
  onAiToken: (cb) => { const f = (e, d) => cb(d); ipcRenderer.on('ai:token', f); return () => ipcRenderer.removeListener('ai:token', f); },
  platform: process.platform
});
