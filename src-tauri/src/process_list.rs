use procfs::process;

pub fn get_process_list() -> String{
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
