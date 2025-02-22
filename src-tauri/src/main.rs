// // Prevents additional console window on Windows in release, DO NOT REMOVE!!
// #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde_json::{json, Value};
use std::process::{Command, Stdio};
use std::io::{BufRead, BufReader};
use std::collections::HashMap;
use std::path::Path;
use shellexpand;
use std::str;
use std::fs;
use dirs;

mod toolbox;

// --- Get Icon List --- //
fn find_distrobox_icons() -> HashMap<String, Option<String>> {
    let mut icons: HashMap<String, Option<String>> = HashMap::new();

    let output = Command::new("distrobox-list")
        .arg("--no-color")
        .output()
        .expect("Failed to execute distrobox-list");

    let stdout = String::from_utf8_lossy(&output.stdout);
    let containers: Vec<&str> = stdout.lines().skip(1) // Skip the header
        .map(|line| line.split('|').nth(1).unwrap_or("").trim()) // Extract the container name
        .collect();

    //todo: optimize this
    for container in &containers {
        icons.insert(container.to_string(), None);
        let desktop_dir = dirs::home_dir().unwrap().join(".local/share/applications");

        if let Ok(entries) = fs::read_dir(&desktop_dir) {
            for entry in entries.flatten() {
                let path = entry.path();
                if path.extension().and_then(|ext| ext.to_str()) == Some("desktop") {
                    if let Ok(content) = fs::read_to_string(&path) {
                        for line in content.lines() {
                            if line.starts_with("Icon=") {
                                let icon_path = line.trim_start_matches("Icon=");
                                let icon_path_resolved = shellexpand::tilde(icon_path).to_string();

                                if Path::new(&icon_path_resolved).exists() {
                                    icons.insert(container.to_string(), Some(icon_path_resolved.clone()));
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    icons
}


// --- Get Distrobox List --- //
#[tauri::command]
fn list_containers() -> Result<Value, String> {
    let output = Command::new("distrobox")
        .arg("list")
        .output()
        .map_err(|e| format!("Failed to execute command: {}", e))?;

    if !output.status.success() {
        return Err(format!(
            "Command failed with status: {}",
            output.status
        ));
    }

    let stdout = str::from_utf8(&output.stdout)
        .map_err(|e| format!("Failed to read output: {}", e))?;

    let lines: Vec<&str> = stdout.lines().collect();

    if lines.len() < 2 {
        return Err("No valid containers found".to_string());
    }

    let mut containers = Vec::new();
    let icons = find_distrobox_icons();

    for line in lines.iter().skip(1) {
        let parts: Vec<&str> = line.split('|').map(|s| s.trim()).collect();
        if parts.len() == 4 {
            let container_name = parts[1].to_string();
            let icon = icons.get(&container_name).cloned().unwrap_or(None);

            let container = json!({
                "ID": parts[0],
                "NAME": container_name,
                "STATUS": parts[2],
                "IMAGE": parts[3],
                "ICON": icon
            });

            containers.push(container);
        }
    }

    Ok(json!(containers))
}


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
fn distro_images() -> Value {
    toolbox::get_toolbox_json()
}


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
