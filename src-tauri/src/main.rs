// // Prevents additional console window on Windows in release, DO NOT REMOVE!!
// #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// fn main() {
//     app_lib::run();
// }

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! This is from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
