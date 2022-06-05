'use strict'

import { join } from 'path';
import { menubar } from 'menubar';
import { app, protocol, Menu, Tray, BrowserWindow, ipcMain } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import { autoUpdater } from 'electron-updater';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Tray instance
let tray;

ipcMain.on('timer:started', (event, args) => {
    tray.setImage(join(__static, 'IconTemplatePlay.png'));
});

ipcMain.on('timer:stopped', (event, args) => {
    tray.setImage(join(__static, 'IconTemplate.png'));
});

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } }
]);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }

    if (! process.env.WEBPACK_DEV_SERVER_URL) {
        createProtocol('app')
    }

    tray = new Tray(join(__static, isDevelopment ? 'IconTemplate-Dev.png' : 'IconTemplate.png'));
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Quit', type: 'radio' },
    ]);
    tray.setToolTip('Minuteur');

    const bar = menubar({
        index: process.env.WEBPACK_DEV_SERVER_URL
            ? process.env.WEBPACK_DEV_SERVER_URL
            : 'app://./index.html',

        browserWindow: {
            alwaysOnTop: isDevelopment,
            webPreferences: {
                nodeIntegration: true,
            }
        },

        tray: tray,
        // icon: join(__static, isDevelopment ? 'IconTemplate-Dev.png' : 'IconTemplate.png'),
    });

    let win;
    function createTimerWindow () {
        win = new BrowserWindow({
            alwaysOnTop: true,
            width: 200,
            height: 90,
            minWidth: 100,
            minHeight: 90,
            autoHideMenuBar: true,
            show: false,
            titleBarStyle: 'default',
            webPreferences: {
                nodeIntegration: true,
                webSecurity: false,
            },
        });

        win.once('ready-to-show', () => {
            win.show();

            if (! win.isDestroyed()) {
                setTimeout(() => {
                    win.webContents.send('current-timer:loaded');
                }, 1000);
            }
        })

        if (process.env.WEBPACK_DEV_SERVER_URL) {
            win.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}`);
        } else {
            // win.loadFile('app://./index.html');
            win.loadURL(`app://./index.html`);
            // win.loadURL('file://./index.html#/current');

        }
    }

    createTimerWindow();

    ipcMain.on('sessions:changed', (event, args) => {
        if (! win.isDestroyed()) {
            win.webContents.send('sessions:changed', args);
        }
    });

    ipcMain.on('current-timer:sessions:changed', (event, args) => {
        bar.showWindow();
        bar.window.webContents.send('sessions:changed', args);
    });

    ipcMain.on('timer-window:open', (event, args) => {
        if (win.isDestroyed()) {
            createTimerWindow();
        }

        win.show();
    });

    mb.on('ready', () => {
        mb.showWindow();

        if (! process.env.WEBPACK_DEV_SERVER_URL) {
            autoUpdater.checkForUpdatesAndNotify();
        }
    });
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}
