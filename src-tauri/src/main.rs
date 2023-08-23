#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::thread;

use lestudio_app::periodically_send_process_list;
use tauri::Manager;

fn main() {
  tauri::Builder::default()
  .setup(move |app: &mut tauri::App| {

    let window = app.get_window("main").unwrap();

    thread::spawn(move || {
      periodically_send_process_list(&window);
    });

    Ok(())
  })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
