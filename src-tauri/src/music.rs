
use crate::commands::{self, get_token, get_system};
use reqwest;
use std::{fs, process::Command, collections::HashMap};
use std::fs::File;
use std::io::Write;
use crate::filepath::{get_app_dir, get_music_exe_path};
use std::os::windows::process::CommandExt;

const MUSIC_CHANNEL: &str = "music";

#[derive(Clone, serde::Serialize)]
struct Payload {
  message: String,
}

/**
 * CONFIG
 */

 #[derive(Debug, serde::Deserialize)]
 struct MusicData {
     currentSongTitle: String,
     currentSongAuthor: String,
     currentSongAlbum: String,
     currentSongImage: String,
     currentSongIsPlaying: bool
 }


pub async fn update_music_exe() {
  if get_system().await.ne("windows") {
    return;
  }

  if let Err(_metadata) = fs::metadata(get_app_dir()) {
    fs::create_dir_all(get_app_dir()).unwrap();
  }

  let url = "https://github.com/qlaffont/LeStudioCurrentSongWINCLI/releases/latest/download/LeStudioCurrentSongCLI.exe";

  // Send an HTTP GET request to the URL
  let body = reqwest::get(url).await.unwrap().bytes().await.unwrap();

  //fs::write(get_music_exe_path(), body);
  let mut file = File::create(get_music_exe_path()).unwrap();
  // Write a slice of bytes to the file
  file.write_all(body.as_ref()).unwrap();
}

pub async fn get_music_content() -> String {
  if get_system().await.eq("windows") {
    let mut command = Command::new(get_music_exe_path());

    const DETACHED_PROCESS: u32 = 0x08000000;
    command.creation_flags(DETACHED_PROCESS);

    let output = command
        .output()
        .expect("null");

    return String::from_utf8(output.stdout).unwrap_or("null".to_string());
  }

  return String::from("null");
}

pub async fn periodically_send_process_music(window: &tauri::Window) {

  update_music_exe().await;

  let mut song_data: String = "trying to update".to_string();

  loop {
    let music_content: String = get_music_content().await;

    if music_content.ne(&song_data) {
      if let Some(token) = (get_token().await).ok(){
        song_data = music_content.clone();

        // Update DB if token is provided
        let url: String = "https://api.lestudio.qlaffont.com/users/current-song?id=".to_string() + &token;

        let parsed_musiq_data: Result<MusicData, _> = serde_json::from_str(&music_content);

        if let Ok(data) = &parsed_musiq_data {
          let mut map = HashMap::new();
          map.insert("currentSongTitle", data.currentSongTitle.clone());
          map.insert("currentSongAuthor", data.currentSongAuthor.clone());
          map.insert("currentSongAlbum", data.currentSongAlbum.clone());
          map.insert("currentSongImage", data.currentSongImage.clone());
          map.insert("currentSongIsPlaying", if data.currentSongIsPlaying == true { "true".to_string() } else { "false".to_string() });

          // Send an HTTP GET request to the URL
          let client = reqwest::Client::new();
          client.patch(url).json(&map).send().await.unwrap();
        }
      }
    }

    window.emit(MUSIC_CHANNEL, Payload { message: music_content }).unwrap();


    // Sleep for a certain duration before the next iteration
    std::thread::sleep(std::time::Duration::from_secs(5));
  }
}
