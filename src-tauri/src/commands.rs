use std::env;
use std::process::Command;

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

    return String::from_utf8(output.stdout).unwrap();
  }

  return String::from("");
}
