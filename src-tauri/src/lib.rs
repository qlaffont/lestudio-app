
mod process_list;

const PROCESS_LIST_CHANNEL: &str = "process-list";

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct Payload {
  message: String,
}

pub fn periodically_send_process_list(window: &tauri::Window) {
  loop {
    let processes_string: String = process_list::get_process_list();

    window.emit(PROCESS_LIST_CHANNEL, Payload { message: processes_string }).unwrap();

    // Sleep for a certain duration before the next iteration
    std::thread::sleep(std::time::Duration::from_secs(5));
  }
}
