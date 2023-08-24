#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::thread;
use tauri::Manager;
mod commands;

fn main() {
  tauri::Builder::default()
  .setup(move |app: &mut tauri::App| {

    let window = app.get_window("main").unwrap();

    thread::spawn(move || {
      lestudio_app::periodically_send_process_list(&window);
    });

    Ok(())
  })
    .invoke_handler(tauri::generate_handler![commands::get_system, commands::get_music_content])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
