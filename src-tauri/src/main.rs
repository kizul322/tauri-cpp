// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri_cpp_lib::run()
    //tauri_cpp_lib::invoke_cpp("Hello\0".as_bytes().to_vec());
}
