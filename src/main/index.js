import './db.js';
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import db from './db.js';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    title: "Inventory Manager", // Added title here
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// --- DATABASE COMMUNICATION (IPC) START ---

// 1. Get all stock data from the database
ipcMain.handle('get-stock', () => {
  return db.prepare('SELECT * FROM stock').all();
});

// 2. Subtract sold quantity from a specific bangle
ipcMain.handle('record-sale', (event, { id, size, qty }) => {
  const stmt = db.prepare('UPDATE stock SET quantity = quantity - ? WHERE id = ? AND size = ?');
  return stmt.run(qty, id, size);
});

// 3. Add new stock (Initial entry or restock) AND Update Price
ipcMain.handle('update-stock', (event, { id, size, qty, price }) => {
  // If user entered a price (greater than 0), update both Quantity and Price
  if (price > 0) {
    const stmt = db.prepare('UPDATE stock SET quantity = quantity + ?, price = ? WHERE id = ? AND size = ?');
    return stmt.run(qty, price, id, size);
  } else {
    // If no price entered, just update Quantity (keep old price)
    const stmt = db.prepare('UPDATE stock SET quantity = quantity + ? WHERE id = ? AND size = ?');
    return stmt.run(qty, id, size);
  }
});

// --- DATABASE COMMUNICATION (IPC) END ---

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})