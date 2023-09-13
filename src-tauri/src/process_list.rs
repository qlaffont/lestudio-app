use sysinfo::{ProcessExt, System, SystemExt};

pub fn get_process_list() -> String {
  // Create a new System object
  let mut system = System::new();

  // Refresh process information
  system.refresh_processes();

  // Iterate through processes and print their names
  system.processes().into_iter().map(|(_, p)| p.name().to_string()).collect::<Vec<String>>().join("|")
}
