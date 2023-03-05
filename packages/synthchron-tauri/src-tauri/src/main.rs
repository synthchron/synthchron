#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::fs::File;
use std::io::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct GraphStatus {
    status: bool,
    message: String,
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn ping() -> bool {
    return true;
}

#[tauri::command]
fn export(name: &str, model: &str) -> GraphStatus {
    let mut file = match File::create(format!("{}.yml", name)) {
        Ok(file) => file,
        Err(err) => return GraphStatus {
            status: false,
            message: err.to_string()
        }
    };

    match file.write_all(model.as_bytes()) {
        Ok(_) => GraphStatus {
            status: true,
            message: "File has been written to".to_string()
        },
        Err(err) => GraphStatus {
            status: false,
            message: err.to_string()
        }
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            export,
            ping
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
