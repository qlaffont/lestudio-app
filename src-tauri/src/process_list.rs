use std::fs;

use serde::{Serialize, Deserialize};
use sysinfo::{ProcessExt, System, SystemExt};

use crate::{filepath::{get_game_list_path, get_local_game_list_path}, commands::{update_games_list, get_token, get_default_action}, config::get_api_base};

const PROCESS_LIST_CHANNEL: &str = "process-list";
const DETECTED_GAME_CHANNEL: &str = "detected-game";

#[derive(Clone, serde::Serialize)]
struct Payload {
  message: String,
}

#[derive(PartialEq, Clone, Debug, Serialize, Deserialize)]
pub struct GameIGDB {
    processName: String,
    windowTitle: String,
    igdbId: String,
    twitchCategoryId: String
}

pub fn get_process_list() -> String {
  // Create a new System object
  let mut system = System::new();

  // Refresh process information
  system.refresh_processes();

  // Iterate through processes and print their names
  system.processes().into_iter().map(|(_, p)| p.name().to_string()).collect::<Vec<String>>().join("|")
}

pub async fn get_games_list() -> Vec<GameIGDB> {
  let content = fs::read_to_string(get_game_list_path()).unwrap_or("[]".to_string());

  let parsed_data: Vec<GameIGDB> = serde_json::from_str(content.as_str()).unwrap();

  return parsed_data;
}

pub async fn get_local_games_list() -> Vec<GameIGDB> {
  let content = fs::read_to_string(get_local_game_list_path()).unwrap_or("[]".to_string());

  let parsed_data: Vec<GameIGDB> = serde_json::from_str(content.as_str()).unwrap();

  return parsed_data;
}

pub async fn periodically_send_process_list(window: &tauri::Window) {
  update_games_list().await.unwrap_or("".to_string());

  let mut last_detected_process_name: Option<GameIGDB> = None;

  loop {
    let mut game_list = get_local_games_list().await;
    let mut ref_game_list = get_games_list().await;

    game_list.append(&mut ref_game_list);

    let processes_string: String = get_process_list();

      // Split the input string by ","
      let process_clone = processes_string.clone();
      let split_result: Vec<&str> = process_clone.split('|').collect();
      let processes_vec: Vec<String> = split_result.iter().map(|s| s.to_string()).collect();

    window.emit(PROCESS_LIST_CHANNEL, Payload { message: processes_string }).unwrap();

    let mut detected_game: Option<GameIGDB> = None;

    //Try to find if game list constain processName
    for game in &game_list {
      for process in &processes_vec {
        if process.to_lowercase().eq(game.processName.to_lowercase().as_str()) {
          detected_game = Some(game.clone());
          break;
        }
      }

      if detected_game.is_some() {
        break;
      }
    }

    if let Some(game) = &detected_game {
      // println!("detectedGame: {:?}", game);

      window.emit(DETECTED_GAME_CHANNEL, Payload { message: serde_json::to_string(&game).unwrap()}).unwrap();
    }else {
      window.emit(DETECTED_GAME_CHANNEL, Payload { message: "{}".to_string()}).unwrap();
    }

    //If game is not the same update api
    if last_detected_process_name != detected_game {
      last_detected_process_name = detected_game.clone();

      let client = reqwest::Client::new();
      let url: String = get_api_base() + "/twitch/games?twitchCategoryId=";

      let token = get_token().await.unwrap();

      if let Some(game) = &detected_game {
        let new_url = url.to_string() + &game.twitchCategoryId + "&token=" + &token;
        client.post(new_url).send().await;
      }else {
        if let Some(default_action) = (get_default_action().await).ok(){
          if default_action.eq("clear"){
            let new_url = url.to_string() + "undefined" + "&token=" + &token;
            client.post(new_url).send().await;
          }

          if default_action.eq("justchatting"){
            let new_url = url.to_string() + "509658" + "&token=" + &token;
            client.post(new_url).send().await;
          }
        }
      }
    }


    // Sleep for a certain duration before the next iteration
    std::thread::sleep(std::time::Duration::from_secs(5));
  }
}
