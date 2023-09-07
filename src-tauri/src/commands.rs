use std::env;
use std::process::Command;
use directories::{BaseDirs };
use std::path::{Path};
use std::fs;

fn get_app_dir () -> String {
  let dir = BaseDirs::new().unwrap();

  let base_path = Path::new(dir.data_local_dir());
  let app_path = base_path.join("LeStudioApp");

  let path = app_path.to_str().unwrap_or("");

  return path.to_string();
}

fn get_config_path () -> String {
  let app_dir = get_app_dir();
  let base_path = Path::new(app_dir.as_str());
  let binding = base_path.join("config.json");
  let path = binding.to_str().unwrap_or("");

  return path.to_string();
}

#[tauri::command]
pub fn get_system() -> String {
  env::consts::OS.to_string()
}

#[tauri::command]
pub fn get_music_content() -> String {
  //TODO add path from EXE

  if get_system().eq("windows") {
    let output = Command::new("echo")
        .arg("'toto'")
        .output()
        .expect("failed to execute process");

    return String::from_utf8(output.stdout).unwrap_or("{}".to_string());
  }

  return String::from("{}");
}

#[tauri::command]
pub fn get_config() -> String {
  let content = fs::read_to_string(get_config_path()).unwrap_or("{}".to_string());

  return content;
}

#[tauri::command]
pub fn set_config(content: String) {
  if let Err(_metadata) = fs::metadata(get_app_dir()) {
    fs::create_dir_all(get_app_dir()).unwrap();
  }

  fs::write(get_config_path(), content).unwrap();
}
