import {
    app,
    BrowserWindow as browserWindow,
    ipcMain,
    ipcRenderer,
    shell,
    WebContents as webContents,
    Menu as menu,
    MenuItem as menuItem,
    Tray as tray,
    dialog,
    clipboard,
    nativeImage,
    screen,
    session,
    powerMonitor,
    powerSaveBlocker,
    autoUpdater,
    systemPreferences,
    nativeTheme,
    crashReporter,
    webFrame,
} from 'electron';

export namespace Electron {
    export const App = app;
    export const BrowserWindow = browserWindow;
    export const IpcMain = ipcMain;
    export const IpcRenderer = ipcRenderer;
    export const Shell = shell;
    export type WebContents = webContents;
    export const Menu = menu;
    export const MenuItem = menuItem;
    export const Tray = tray;
    export const Dialog = dialog;
    export const Clipboard = clipboard;
    export const NativeImage = nativeImage;
    export const Screen = screen;
    export const Session = session;
    export const PowerMonitor = powerMonitor;
    export const PowerSaveBlocker = powerSaveBlocker;
    export const AutoUpdater = autoUpdater;
    export const SystemPreferences = systemPreferences;
    export const NativeTheme = nativeTheme;
    export const CrashReporter = crashReporter;
    export const WebFrame = webFrame;

    // by danny bengal
    export type WebviewTag = any
    export type Extension = any
    export type DownloadItem = any
}
