// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use portable_pty::{native_pty_system, CommandBuilder, PtyPair, PtySize};
use std::{
    io::{BufRead, BufReader, Read, Write},
    process::exit,
    sync::Arc,
    thread,
};

use tauri::{async_runtime::Mutex as AsyncMutex, State};

struct AppState {
    pty_pair: Arc<AsyncMutex<PtyPair>>,
    writer: Arc<AsyncMutex<Box<dyn Write + Send>>>,
    reader: Arc<AsyncMutex<BufReader<Box<dyn Read + Send>>>>,
}

#[tauri::command]
async fn async_create_shell(state: State<'_, AppState>) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    let mut cmd = CommandBuilder::new("powershell.exe");

    #[cfg(not(target_os = "windows"))]
    let mut cmd = CommandBuilder::new("bash");

    // Add the $TERM env variable for compatibility
    #[cfg(target_os = "windows")]
    cmd.env("TERM", "cygwin");

    #[cfg(not(target_os = "windows"))]
    cmd.env("TERM", "xterm-256color");

    let mut child = state
        .pty_pair
        .lock()
        .await
        .slave
        .spawn_command(cmd)
        .map_err(|err| err.to_string())?;

    thread::spawn(move || {
        let status = child.wait().unwrap();
        exit(status.exit_code() as i32);
    });

    Ok(())
}

#[tauri::command]
async fn async_write_to_pty(data: String, state: State<'_, AppState>) -> Result<(), String> {
    state
        .writer
        .lock()
        .await
        .write_all(data.as_bytes())
        .map_err(|err| err.to_string())
}

#[tauri::command]
async fn async_read_from_pty(state: State<'_, AppState>) -> Result<String, String> {
    let mut reader = state.reader.lock().await;
    let mut buffer = String::new();

    reader
        .read_line(&mut buffer)
        .map_err(|err| err.to_string())?;

    Ok(buffer)
}

#[tauri::command]
async fn async_resize_pty(rows: u16, cols: u16, state: State<'_, AppState>) -> Result<(), String> {
    state
        .pty_pair
        .lock()
        .await
        .master
        .resize(PtySize {
            rows,
            cols,
            ..Default::default()
        })
        .map_err(|err| err.to_string())
}

fn main() {
    let pty_system = native_pty_system();

    let pty_pair = pty_system
        .openpty(PtySize {
            rows: 24,
            cols: 80,
            pixel_width: 0,
            pixel_height: 0,
        })
        .unwrap();

    let reader = pty_pair.master.try_clone_reader().unwrap();
    let writer = pty_pair.master.take_writer().unwrap();

    tauri::Builder::default()
        .manage(AppState {
            pty_pair: Arc::new(AsyncMutex::new(pty_pair)),
            writer: Arc::new(AsyncMutex::new(writer)),
            reader: Arc::new(AsyncMutex::new(BufReader::new(reader))),
        })
        .invoke_handler(tauri::generate_handler![
            async_create_shell,
            async_write_to_pty,
            async_read_from_pty,
            async_resize_pty
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
