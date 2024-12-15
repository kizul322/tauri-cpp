

#include "action/File.hpp"

#include <cstddef>
#include <cstring>
#include <filesystem>
#include <fstream>
#include <iostream>
#include <string>
#include <system_error>

#include "Responce.hpp"
#include "utility/Endian.hpp"

namespace fs = std::filesystem;

namespace TauriCpp::Action {
Responce Read(std::string filepath, std::size_t offset, std::size_t size) {
  std::ifstream ifs(filepath, std::ios_base::binary);
  if (!ifs) {
    return {nullptr, 0};
  }

  auto* buffer = new std::uint8_t[size];

  ifs.seekg(offset, std::ios_base::beg);
  ifs.read(reinterpret_cast<char*>(buffer), size);

  return {buffer, static_cast<std::size_t>(ifs.gcount())};
}

Responce FileSize(std::string filepath) {
  std::error_code ec;
  if (auto size = fs::file_size(filepath, ec); !ec) {
    const auto result = WriteLittleEndianValue<std::uint64_t>(size);

    auto* result_buffer = new std::uint8_t[result.size()];
    std::memcpy(result_buffer, result.data(), result.size());

    return {result_buffer, sizeof(std::uint64_t)};
  }

  std::cerr << ec.message() << std::endl;
  return {nullptr, 0};
}

}  // namespace TauriCpp::Action
