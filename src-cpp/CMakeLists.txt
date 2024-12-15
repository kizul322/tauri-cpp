cmake_minimum_required(VERSION 3.10)

project(tauri-cpp)

if(CMAKE_CXX_COMPILER_FRONTEND_VARIANT STREQUAL "GNU")
    set(CMAKE_CXX_STANDARD 23)
    set(CMAKE_CXX_FLAGS_DEBUG "-O0 -g3 -Wall")
    #set(CMAKE_CXX_FLAGS_DEBUG "-O0 -g3 -Wall -fsanitize=undefined,address,leak")
    set(CMAKE_CXX_FLAGS_RELEASE "-O3")
elseif(CMAKE_CXX_COMPILER_FRONTEND_VARIANT STREQUAL "MSVC")
    set(CMAKE_CXX_STANDARD 23)
    set(CMAKE_CXX_FLAGS_DEBUG "/Od /Zi /MD")
    set(CMAKE_CXX_FLAGS_RELEASE "/O2 /MD")
endif()

# とりあえず、ここで適当にすべて対象としてしまう（subdirに分割しない）
file(GLOB_RECURSE source ./src/*.cpp ./src/**/*.cpp)

if("${MODE}" STREQUAL "TEST")
    enable_testing()
    include(GoogleTest)
    find_package(GTest REQUIRED)

    file(GLOB_RECURSE source_test ./test/*.cpp ./test/**/*.cpp)
    
    add_executable(tauri-cpp ${source} ${source_test})
    target_link_libraries(tauri-cpp GTest::GTest GTest::Main gmock)

    gtest_discover_tests(tauri-cpp)
else()
    add_library(tauri-cpp STATIC ${source})
endif()

target_include_directories(tauri-cpp PRIVATE ./src)