

use procfs::process;

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct Payload {
  message: String,
}


const PROCESS_LIST_CHANNEL: &str = "process-list";

fn get_process_list() -> String{
  let processes = process::all_processes().unwrap();

  let processes = processes
    .into_iter()
    .map(|process| {
      let p: process::Process = process.expect("failed to get process");

      if !p.is_alive() {
        return None;
      }

      let stat = p.stat().unwrap();

      return Some(stat.comm);
    })
    .filter_map(|v| v.clone());

  processes.collect::<Vec<String>>().join("|")
}

pub fn periodically_send_process_list(window: &tauri::Window) {
  loop {
    let processes_string: String = get_process_list();

    println!("===DEBUG PROCESS LIST===");
    println!("{}", processes_string);
    println!("======");

    window.emit(PROCESS_LIST_CHANNEL, Payload { message: processes_string }).unwrap();

    // Sleep for a certain duration before the next iteration
    std::thread::sleep(std::time::Duration::from_secs(5));
  }
}
