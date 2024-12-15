#ifndef RESPONCE_HPP
#define RESPONCE_HPP

#include <cstddef>
#include <cstdint>

struct Responce {
  const std::uint8_t* result;
  std::size_t size;
};

#endif
