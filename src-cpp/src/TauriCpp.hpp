
#ifndef TAURICPP_HPP
#define TAURICPP_HPP

#include <cstddef>
#include <cstdint>

#include "Responce.hpp"

Responce InvokeCpp(const unsigned char* data, std::size_t len);
void FreeResponcePtr(const std::uint8_t* ptr);

#endif
