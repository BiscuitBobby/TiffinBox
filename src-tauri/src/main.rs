// // Prevents additional console window on Windows in release, DO NOT REMOVE!!
// #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde_json::{json, Value};
use std::process::{Command, Stdio};
use std::str;
use std::io::{BufRead, BufReader};
use std::collections::HashMap;
use std::path::Path;
use shellexpand;
use std::fs;
use dirs;


// --- Start Distro --- //
#[tauri::command]
fn start_container(container_name: &str) -> Result<(), String> {
    let containers = list_containers()?;

    if let Some(container) = containers.as_array().and_then(|arr| {
        arr.iter().find(|c| c["NAME"] == container_name)
    }) {
        let status = container["STATUS"].as_str().unwrap_or("");

        if status.contains("Exited") {
            println!("Container '{}' is exited. Starting...", container_name);
            println!("Starting container: {}", container_name);

            let mut child = Command::new("distrobox")
                .arg("enter")
                .arg(container_name)
                .stdout(Stdio::piped()) // Store stdout in case it's needed
                .stderr(Stdio::piped())
                .spawn()
                .map_err(|e| format!("Failed to execute command: {}", e))?;
    
            let stderr = child.stderr.take().ok_or("Failed to capture stderr")?;
            let stderr_reader = BufReader::new(stderr);
    
            for line in stderr_reader.lines() {
                let line = line.map_err(|e| format!("Error reading stderr: {}", e))?;
                eprintln!("[stderr] {}", line);
    
                if line.contains("Container Setup Complete!") {
                    println!("Started container");
                    return Ok(());
                }
            }
    
            return Err("Container setup message not found.".to_string())
        } else {
            println!("Container '{}' is already running.", container_name);
            return Ok(());
        }
    }

    Err(format!("Container '{}' not found.", container_name))
}

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
