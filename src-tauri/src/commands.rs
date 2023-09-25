use std::env;
use std::process::Command;
use serde::Deserialize;
use std::fs;
use reqwest;

use crate::{filepath::{get_music_exe_path, get_config_path, get_app_dir, get_game_list_path, get_local_game_list_path}, process_list::{get_local_games_list, GameIGDB}};


/**
 * UTILS
 */

#[tauri::command]
pub async fn get_system() -> String {
  env::consts::OS.to_string()
}


/**
 * CONFIG
 */

#[derive(Debug, Deserialize)]
struct Config {
    token: Option<String>,
    isAutoStartActivated: Option<bool>,
    notFoundAction: Option<String>,
}


pub async fn get_token() -> Result<String, ()>{
  let config_string = get_config().await;

  let parsed_config: Result<Config, _> = serde_json::from_str(&config_string);

  match parsed_config {
      Ok(config) => {
        if let Some(token) = config.token {
          return Ok(token);
        }else {
          return Err(())
        }
      },
      Err(_) => Err(()),
  }
}

pub async fn get_default_action() -> Result<String, ()>{
  let config_string = get_config().await;

  let parsed_config: Result<Config, _> = serde_json::from_str(&config_string);

  match parsed_config {
      Ok(config) => {
        if let Some(default_action) = config.notFoundAction {
          return Ok(default_action);
        }else {
          return Err(())
        }
      },
      Err(_) => Err(()),
  }
}

pub async fn get_autostart_enabled() -> Result<bool, ()>{
  let config_string = get_config().await;

  let parsed_config: Result<Config, _> = serde_json::from_str(&config_string);

  match parsed_config {
    Ok(config) => {
      if let Some(isAutoStartActivated) = config.isAutoStartActivated {
        return Ok(isAutoStartActivated);
      }else {
        return Err(())
      }
    },
    Err(_) => Err(()),
  }
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

#[tauri::command]
pub async fn refresh_autostart_rust(app_handle: tauri::AppHandle) {
  let autostart = get_autostart_enabled().await.ok().unwrap_or(false);

  app_handle.tray_handle().get_item("auto_start").set_selected(autostart).expect("");
}

#[tauri::command]
pub async fn get_version() -> String {
  const VERSION: &str = env!("CARGO_PKG_VERSION");
  return VERSION.to_string();
}

/**
 * GAME LIST DOWNLOAD
 */

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

  let body = reqwest::get(url).await;

  if body.is_err() {
    return Err(());
  }

  let body_result = body.unwrap().text().await.unwrap();

  // Send an HTTP GET request to the URL

  if let Err(_metadata) = fs::metadata(get_app_dir()) {
    fs::create_dir_all(get_app_dir());
  }

  fs::write(get_game_list_path(), body_result);

  return Ok("ok".to_string());
}


#[tauri::command]
pub async fn add_game_to_list(content: String) {
  let mut list = get_local_games_list().await;

  let parsed_game: Result<GameIGDB, _> = serde_json::from_str(&content);

  if let Ok(game) = &parsed_game {
    list.push(game.to_owned());

    let dataToWrite = serde_json::to_string(&list).unwrap();

    if let Err(_metadata) = fs::metadata(get_app_dir()) {
      fs::create_dir_all(get_app_dir()).unwrap();
    }

    fs::write(get_local_game_list_path(), dataToWrite).unwrap();
  }
}
