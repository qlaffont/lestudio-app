use std::env;
use std::process::Command;
use directories::{BaseDirs };
use std::path::{Path};
use std::fs;
use reqwest;

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

fn get_game_list_path () -> String {
  let app_dir = get_app_dir();
  let base_path = Path::new(app_dir.as_str());
  let binding = base_path.join("games.json");
  let path = binding.to_str().unwrap_or("");

  return path.to_string();
}

fn get_music_exe_path () -> String {
  let app_dir = get_app_dir();
  let base_path = Path::new(app_dir.as_str());
  let binding = base_path.join("LeStudioCurrentSongCLI.exe");
  let path = binding.to_str().unwrap_or("");

  return path.to_string();
}

#[tauri::command]
pub async fn get_system() -> String {
  env::consts::OS.to_string()
}

#[tauri::command]
pub async fn update_music_exe() {
  if get_system().await.eq("windows") {
    return;
  }

  if let Err(_metadata) = fs::metadata(get_app_dir()) {
    fs::create_dir_all(get_app_dir()).unwrap();
  }

  let url = "https://github.com/qlaffont/LeStudioCurrentSongWINCLI/releases/latest/download/LeStudioCurrentSongCLI.exe";

  // Send an HTTP GET request to the URL
  let body = reqwest::get(url).await.unwrap().text().await.unwrap();

  fs::write(get_music_exe_path(), body);
}

#[tauri::command]
pub async fn get_music_content() -> String {
  if get_system().await.eq("windows") {
    let output = Command::new(get_music_exe_path())
        .output()
        .expect("{}");

    return String::from_utf8(output.stdout).unwrap_or("{}".to_string());
  }

  return String::from("{}");
}

#[tauri::command]
pub async fn get_config() -> String {
  let content = fs::read_to_string(get_config_path()).unwrap_or("{}".to_string());

  return content;
}

#[tauri::command]
pub async fn set_config(content: String) {
  if let Err(_metadata) = fs::metadata(get_app_dir()) {
    fs::create_dir_all(get_app_dir()).unwrap();
  }

  fs::write(get_config_path(), content).unwrap();
}

async fn get_games_list_download_url() -> Option<String>{
  let base_url = "https://raw.githubusercontent.com/qlaffont/igdb-twitch-process-list/main/";
  let ext = ".json";

  if get_system().await.eq("windows"){
    let url = base_url.to_string() + "win32" + ext;
    return Some(url);
  }

  if get_system().await.eq("linux"){
    let url = base_url.to_string() + "linux" + ext;
    return Some(url);
  }

  if get_system().await.eq("macos"){
    let url = base_url.to_string() + "darwin" + ext;
    return Some(url);
  }

  return None;
}

#[tauri::command]
pub async fn update_games_list() -> Result<String, ()> {

  let url = get_games_list_download_url().await;

  if url.is_none() {
    return Ok("ok".to_string());
  }

  let url = match url {
      Some(s) => s,  // Extract the String from Some
      None => String::new(),  // Handle the None case, provide a default value if needed
  };

  // Send an HTTP GET request to the URL
  let body = reqwest::get(url).await.unwrap().text().await.unwrap();

  if let Err(_metadata) = fs::metadata(get_app_dir()) {
    fs::create_dir_all(get_app_dir());
  }

  fs::write(get_game_list_path(), body);

  return Ok("ok".to_string());
}

#[tauri::command]
pub async fn get_games_list() -> String {
  let content = fs::read_to_string(get_game_list_path()).unwrap_or("{}".to_string());

  return content;
}
