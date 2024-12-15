#ifndef FILE_HPP
#define FILE_HPP

#include <cstddef>
#include <string>

#include "Responce.hpp"

namespace TauriCpp::Action {
Responce Read(std::string filepath, std::size_t offset, std::size_t size);
Responce FileSize(std::string filepath);

}  // namespace TauriCpp::Action

#endif
