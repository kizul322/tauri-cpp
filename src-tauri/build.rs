use std::env;

fn main() {
    let project_root = env::var("CARGO_MANIFEST_DIR").unwrap();
    let cxx_include_dir = format!("{}/../src-cpp", project_root);

    cxx_build::bridge("src/lib.rs") // returns a cc::Build
        .std("c++11")
        .include(cxx_include_dir)
        .compile("cxxbridge-demo");

    tauri_build::build();

    println!("cargo:rustc-link-lib=tauri-cpp");
    println!("cargo:rustc-link-search=../src-cpp/build_lib");
}
