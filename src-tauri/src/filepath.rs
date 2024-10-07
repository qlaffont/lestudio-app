use directories::BaseDirs;
use std::path::Path;

pub fn get_app_dir() -> String {
    let dir = BaseDirs::new().unwrap();

    let base_path = Path::new(dir.data_local_dir());
    let app_path = base_path.join("LeStudioApp");

    let path = app_path.to_str().unwrap_or("");

    return path.to_string();
}

pub fn get_config_path() -> String {
    let app_dir = get_app_dir();
    let base_path = Path::new(app_dir.as_str());
    let binding = base_path.join("config.json");
    let path = binding.to_str().unwrap_or("");

    return path.to_string();
}

pub fn get_game_list_path() -> String {
    let app_dir = get_app_dir();
    let base_path = Path::new(app_dir.as_str());
    let binding = base_path.join("games.json");
    let path = binding.to_str().unwrap_or("");

    return path.to_string();
}

pub fn get_local_game_list_path() -> String {
    let app_dir = get_app_dir();
    let base_path = Path::new(app_dir.as_str());
    let binding = base_path.join("local-games.json");
    let path = binding.to_str().unwrap_or("");

    return path.to_string();
}

pub fn get_music_exe_path() -> String {
    let app_dir = get_app_dir();
    let base_path = Path::new(app_dir.as_str());
    let binding = base_path.join("LeStudioCurrentSongCLI.exe");
    let path = binding.to_str().unwrap_or("");

    return path.to_string();
}
