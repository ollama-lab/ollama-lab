pub struct AddrState(pub String);

#[tauri::command]
pub fn get_addr(state: tauri::State<AddrState>) -> String {
    state.0.clone()
}
