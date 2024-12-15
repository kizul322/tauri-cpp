#[cxx::bridge]
mod ffi {
    struct Responce {
        result: *const u8,
        size: usize,
    }
    unsafe extern "C++" {
        type Responce;
        include!("src/TauriCpp.hpp");

        unsafe fn InvokeCpp(data: *const u8, size: usize) -> Responce;
        unsafe fn FreeResponcePtr(data: *const u8);
    }
}

#[tauri::command]
fn invoke_cpp(data: Vec<u8>) -> Option<Vec<u8>> {
    unsafe {
        let res = ffi::InvokeCpp(data.as_ptr(), data.len());
        if res.result == std::ptr::null() {
            return None;
        }
        let result = std::slice::from_raw_parts(res.result, res.size).to_vec();
        ffi::FreeResponcePtr(res.result);

        Some(result)
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![invoke_cpp])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
