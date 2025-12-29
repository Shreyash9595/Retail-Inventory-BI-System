import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// These are the custom functions React will call
const api = {
  getStock: () => ipcRenderer.invoke('get-stock'),
  recordSale: (data) => ipcRenderer.invoke('record-sale', data),
  updateStock: (data) => ipcRenderer.invoke('update-stock', data)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}