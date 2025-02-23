// // Prevents additional console window on Windows in release, DO NOT REMOVE!!
// #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use dirs;
use lazy_static::lazy_static;
use serde_json::{json, Value};
use shellexpand;
use std::collections::{HashMap, HashSet};
use std::error::Error;
use std::fs;
use std::fs::File;
use std::io::{BufRead, BufReader};
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::str;
use std::sync::Mutex;
use std::time::{Duration, Instant};

mod toolbox;

// --- Get Icon List --- //
lazy_static! {
    static ref ICON_CACHE: Mutex<(HashMap<String, Option<String>>, Instant)> =
        Mutex::new((HashMap::new(), Instant::now()));
}

fn copy_icon_to_assets(icon_path: &str) -> Result<String, String> {
    let assets_dir = PathBuf::from("src/assets");
    if !assets_dir.exists() {
        fs::create_dir_all(&assets_dir).map_err(|e| e.to_string())?;
    }

    let icon_path_buf = PathBuf::from(icon_path);
    if let Some(file_name) = icon_path_buf.file_name() {
        let new_path = assets_dir.join(file_name);
        fs::copy(&icon_path_buf, &new_path).map_err(|e| e.to_string())?;
        return Ok(new_path.to_string_lossy().to_string());
    }
    Err("Failed to determine icon file name".to_string())
}

fn find_distrobox_icons() -> Result<HashMap<String, Option<String>>, String> {
    let mut icons = HashMap::new();

    let desktop_dir = dirs::home_dir()
        .ok_or("Could not find home directory")?
        .join(".local/share/applications");

    if let Ok(entries) = std::fs::read_dir(&desktop_dir) {
        let desktop_files: Vec<_> = entries
            .filter_map(Result::ok)
            .filter(|entry| {
                entry
                    .path()
                    .extension()
                    .and_then(|ext| ext.to_str())
                    .map_or(false, |ext| ext == "desktop")
            })
            .collect();

        let output = Command::new("distrobox-list")
            .arg("--no-color")
            .output()
            .map_err(|e| e.to_string())?;

        let stdout = String::from_utf8(output.stdout).map_err(|e| e.to_string())?;

        for line in stdout.lines().skip(1) {
            if let Some(container) = line
                .split('|')
                .nth(1)
                .map(str::trim)
                .filter(|s| !s.is_empty())
            {
                icons.insert(container.to_string(), None);

                for entry in &desktop_files {
                    if let Ok(file) = File::open(entry.path()) {
                        let reader = BufReader::new(file);

                        for line in reader.lines().flatten() {
                            if line.starts_with("Icon=") {
                                let icon_path = line.trim_start_matches("Icon=");
                                let icon_path_resolved = shellexpand::tilde(icon_path).to_string();

                                if Path::new(&icon_path_resolved).exists() {
                                    // if let Ok(new_location) =
                                    //     copy_icon_to_assets(&icon_path_resolved)
                                    // {
                                    //     icons.insert(container.to_string(), Some(new_location));
                                    // }
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    Ok(icons)
}

fn get_cached_icons() -> Result<HashMap<String, Option<String>>, String> {
    let mut cache = ICON_CACHE.lock().map_err(|e| e.to_string())?;
    let now = Instant::now();

    if now.duration_since(cache.1) > Duration::from_secs(30000) {
        *cache = (find_distrobox_icons()?, now);
    }

    Ok(cache.0.clone())
}

// fn get_cached_icons() -> Result<HashMap<String, Option<String>>, String> {
//     let mut cache = ICON_CACHE.lock().map_err(|e| e.to_string())?;
//     let now = Instant::now();

//     // Refresh cache if older than 5 minutes
//     if now.duration_since(cache.1) > Duration::from_secs(300) {
//         *cache = (find_distrobox_icons()?, now);
//     }

//     Ok(cache.0.clone())
// }

// --- Get Distrobox List --- //
#[tauri::command]
fn list_containers() -> Result<Value, String> {
    let icons = get_cached_icons()?;

    let output = Command::new("distrobox")
        .arg("list")
        .output()
        .map_err(|e| format!("Failed to execute command: {}", e))?;

    if !output.status.success() {
        return Err(format!("Command failed with status: {}", output.status));
    }

    let stdout =
        String::from_utf8(output.stdout).map_err(|e| format!("Failed to read output: {}", e))?;

    let mut containers = Vec::new();

    for line in stdout.lines().skip(1) {
        let parts: Vec<&str> = line.split('|').map(str::trim).collect();
        if parts.len() == 4 {
            let container_name = parts[1].to_string();
            let icon = icons.get(&container_name).cloned().unwrap_or(None);

            containers.push(json!({
                "ID": parts[0],
                "NAME": container_name,
                "STATUS": parts[2],
                "IMAGE": parts[3],
                "ICON": icon
            }));
        }
    }

    Ok(json!(containers))
}

// --- Start Distro --- //
#[tauri::command]
fn start_container(container_name: &str) -> Result<(), String> {
    let containers = list_containers()?;

    if let Some(container) = containers
        .as_array()
        .and_then(|arr| arr.iter().find(|c| c["NAME"] == container_name))
    {
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

            return Err("Container setup message not found.".to_string());
        } else {
            println!("Container '{}' is already running.", container_name);
            return Ok(());
        }
    }

    Err(format!("Container '{}' not found.", container_name))
}

// --- Remove Distro --- //
#[tauri::command]
fn remove_container(container: &str) {
    let output = Command::new("distrobox")
        .arg("rm")
        .arg(container)
        .arg("--force")
        .output();

    match output {
        Ok(output) if output.status.success() => {
            println!("'{}' removed successfully.", container);
        }
        Ok(output) => {
            eprintln!(
                "Can't remove '{}': {}",
                container,
                String::from_utf8_lossy(&output.stderr)
            );
        }
        Err(e) => {
            eprintln!("Failed to execute process: {}", e);
        }
    }
}

// --- Stop Distro --- //
#[tauri::command]
fn stop_container(container: &str) {
    let output = Command::new("sh")
        .arg("-c")
        .arg(format!("echo 'y' | distrobox stop {}", container))
        .output();

    match output {
        Ok(output) if output.status.success() => {
            println!("'{}' stopped successfully.", container);
        }
        Ok(output) => {
            eprintln!(
                "Can't stop '{}':\nSTDOUT: {}\nSTDERR: {}",
                container,
                String::from_utf8_lossy(&output.stdout),
                String::from_utf8_lossy(&output.stderr)
            );
        }
        Err(e) => {
            eprintln!("Failed to execute process: {}", e);
        }
    }
}

// --- Create Distro --- //
#[tauri::command]
fn create_container(container: &str, image: &str) {
    let output = Command::new("distrobox")
        .arg("create")
        .arg("--name")
        .arg(container)
        .arg("--image")
        .arg(image)
        .arg("--pull")
        .output();

    match output {
        Ok(output) if output.status.success() => {
            println!(
                "Container '{}' created successfully with image '{}'.",
                container, image
            );
        }
        Ok(output) => {
            eprintln!(
                "Can't create '{}': {}",
                container,
                String::from_utf8_lossy(&output.stderr)
            );
        }
        Err(e) => {
            eprintln!("Failed to execute process: {}", e);
        }
    }
}

fn detect_container_runtime() -> Option<String> {
    let runtimes = ["podman", "docker", "lilypod"];

    for runtime in runtimes.iter() {
        if let Ok(output) = Command::new(runtime).arg("--version").output() {
            if output.status.success() {
                return Some(runtime.to_string());
            }
        }
    }

    None // No container runtime found
}

/// Lists containers using the detected runtime
fn list_all_containers() -> Result<Vec<Value>, Box<dyn Error>> {
    let runtime = detect_container_runtime().ok_or("No container runtime detected")?;

    let output = Command::new(runtime)
        .args(&["ps", "-a", "--format", "json"])
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .output()?;

    let stdout = String::from_utf8_lossy(&output.stdout).to_string();

    if stdout.is_empty() {
        Ok(vec![])
    } else {
        serde_json::from_str(&stdout).map_err(|e| Box::new(e) as Box<dyn Error>)
    }
}

// --- Get status of a container --- //
#[tauri::command]
fn get_container_status(container_id: &str) -> Result<Value, String> {
    let runtime = detect_container_runtime().ok_or("No container runtime detected".to_string())?;
    let containers = list_all_containers().map_err(|e| e.to_string())?;

    // Map container IDs to their JSON info
    let container_map: HashMap<String, Value> = containers
        .into_iter()
        .filter_map(|container| {
            let id = container["Id"].as_str()?;
            Some((id[..12].to_string(), container))
        })
        .collect();

    if !container_map.contains_key(container_id) {
        return Ok(json!({
            "error": format!("Container '{}' not found.", container_id)
        }));
    }

    let output = Command::new(&runtime)
        .args(&["stats", "--no-stream", "--format", "json", container_id])
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        let stdout = String::from_utf8_lossy(&output.stdout);
        let stats: Value = serde_json::from_str(&stdout).map_err(|e| e.to_string())?;
        match stats {
            Value::Array(mut arr) if !arr.is_empty() => Ok(arr.remove(0)),
            Value::Object(_) => Ok(stats),
            _ => Ok(json!({ "error": "Unexpected stats format" })),
        }
    } else {
        Err(format!(
            "Failed to retrieve stats for '{}': {}",
            container_id,
            String::from_utf8_lossy(&output.stderr)
        ))
    }
}

// --- Get status of all containers --- //
#[tauri::command]
fn get_all_containers_status() -> Result<Vec<Value>, String> {
    let distrobox_ids = list_containers().map_err(|e| e.to_string())?;
    let containers = list_all_containers().map_err(|e| e.to_string())?;

    let distrobox_ids: HashSet<String> = match distrobox_ids.as_array() {
        Some(array) => array
            .iter()
            .filter_map(|id| id.as_str().map(String::from)) // Convert JSON strings to Rust strings
            .collect(),
        None => return Err("Invalid format for distrobox container IDs".to_string()),
    };

    let container_dict: HashMap<String, Value> = containers
        .into_iter()
        .filter_map(|container| {
            let id = container["Id"].as_str()?;
            Some((id[..12].to_string(), container))
        })
        .collect();

    let matching_ids: HashSet<_> = distrobox_ids
        .into_iter()
        .filter(|id| container_dict.contains_key(id))
        .collect();

    if matching_ids.is_empty() {
        return Ok(vec![json!({"error": "No matching containers found."})]);
    }

    let mut container_statuses = Vec::new();

    for container_id in matching_ids {
        match get_container_status(&container_id) {
            Ok(status) => container_statuses.push(json!({ "id": container_id, "status": status })),
            Err(_) => container_statuses
                .push(json!({ "id": container_id, "error": "Failed to retrieve status" })),
        }
    }

    Ok(container_statuses)
}

// --- Get supported images --- //
#[tauri::command]
fn distro_images() -> Value {
    toolbox::get_toolbox_json()
}

// --- Check if installed --- //
#[tauri::command]
fn check_distrobox() -> bool {
    let paths = [
        "/bin/distrobox",
        "/sbin/distrobox",
        "/usr/bin/distrobox",
        "/usr/sbin/distrobox",
        "/usr/local/bin/distrobox",
        "/usr/local/sbin/distrobox",
    ];

    for path in paths.iter() {
        if Path::new(path).exists() {
            return true;
        }
    }

    false
}

fn main() {
    {
        // init cached icons
        let mut cache = ICON_CACHE.lock().map_err(|e| e.to_string()).unwrap();
        let now = Instant::now();
        *cache = (find_distrobox_icons().unwrap(), now);
    }
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            check_distrobox,
            list_containers,
            start_container,
            stop_container,
            remove_container,
            create_container,
            get_container_status,
            get_all_containers_status,
            distro_images
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
