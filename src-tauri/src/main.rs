#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::thread;
use tauri::{Event, LogicalSize, Manager, RunEvent, Size, UserAttentionType};
mod commands;
mod filepath;
#[cfg_attr(target_os = "windows", path = "music.rs")]
#[cfg_attr(not(target_os = "windows"), path = "music_other.rs")]
mod music;
mod process_list;
use async_std::task;
use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};
use tauri_plugin_autostart::MacosLauncher;

fn main() {
    let mut is_autostart_enabled = false;

    task::block_on(async {
        is_autostart_enabled = commands::get_autostart_enabled().await.unwrap_or(false);
    });

    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let hide = CustomMenuItem::new(
        "hide".to_string(),
        if is_autostart_enabled == true {
            "Show"
        } else {
            "Hide"
        },
    );
    let mut auto_start = CustomMenuItem::new("auto_start".to_string(), "Start on boot");

    if is_autostart_enabled == true {
        auto_start = auto_start.selected();
    }

    let tray_menu = SystemTrayMenu::new()
        .add_item(hide)
        .add_item(auto_start)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);

    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            let window = app.get_window("main").unwrap();
            window.set_focus();
            window.request_user_attention(Some(UserAttentionType::Informational));
        }))
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec![]),
        ))
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .system_tray(system_tray)
        .setup(move |app: &mut tauri::App| {
            let window = app.get_window("main").unwrap();

            window.set_min_size(Some(Size::Logical(LogicalSize {
                width: 200.0,
                height: 200.0,
            })));

            // println!("Local folder : {}", get_app_dir());

            window.set_maximizable(false);

            if is_autostart_enabled {
                window.hide();
            }

            thread::spawn(move || {
                task::block_on(async {
                    process_list::periodically_send_process_list(&window).await;
                });
            });

            let window2 = app.get_window("main").unwrap();

            thread::spawn(move || {
                task::block_on(async {
                    music::periodically_send_process_music(&window2).await;
                });
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_system,
            commands::get_config,
            commands::set_config,
            commands::update_games_list,
            commands::refresh_autostart_rust,
            commands::get_version,
            commands::add_game_to_list,
        ])
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick { .. } => {
                let window = app.get_window("main").unwrap();
                let item_handle = app.tray_handle().get_item("hide");
                if !(window.is_visible().unwrap()) {
                    window.show().unwrap();
                    item_handle.set_title("Hide").unwrap();
                } else {
                    window.hide().unwrap();
                    item_handle.set_title("Show").unwrap();
                }
            }

            SystemTrayEvent::MenuItemClick { id, .. } => {
                let item_handle = app.tray_handle().get_item(&id);
                match id.as_str() {
                    "quit" => {
                        std::process::exit(0);
                    }
                    "hide" => {
                        let window = app.get_window("main").unwrap();
                        if !(window.is_visible().unwrap()) {
                            window.show().unwrap();
                            item_handle.set_title("Hide").unwrap();
                        } else {
                            window.hide().unwrap();
                            item_handle.set_title("Show").unwrap();
                        }
                    }
                    "auto_start" => {
                        let window = app.get_window("main").unwrap();
                        window.emit("toggle_autostart", "").unwrap();
                    }
                    _ => {}
                }
            }
            _ => {}
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|app, event| match event {
            tauri::RunEvent::WindowEvent {
                label,
                event: win_event,
                ..
            } => match win_event {
                tauri::WindowEvent::CloseRequested { api, .. } => {
                    let window = app.get_window(label.as_str()).unwrap();
                    api.prevent_close();
                    let item_handle = app.tray_handle().get_item("hide");
                    if !(window.is_visible().unwrap()) {
                        window.show().unwrap();
                        item_handle.set_title("Hide").unwrap();
                    } else {
                        window.hide().unwrap();
                        item_handle.set_title("Show").unwrap();
                    }
                }
                _ => {}
            },
            _ => {}
        })
}
