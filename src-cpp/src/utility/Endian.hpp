#ifndef ENDIAN_HPP
#define ENDIAN_HPP

#include <algorithm>
#include <array>
#include <climits>
#include <concepts>
#include <span>

template <std::integral T>
T ReadLittleEndianValue(std::span<const unsigned char> data,
                        std::size_t length) {
  const std::size_t n = std::min(length, sizeof(T));
  T result = 0;
  for (std::size_t i = 0; i < n; ++i) {
    result |= static_cast<T>(data[i]) << i * CHAR_BIT;
  }
  return result;
}

template <std::integral T>
std::array<std::uint8_t, sizeof(T)> WriteLittleEndianValue(T value) {
  std::array<std::uint8_t, sizeof(T)> result;
  for (std::size_t i = 0; i < sizeof(T); ++i) {
    result[i] = static_cast<std::uint8_t>(value >> i * CHAR_BIT);
  }
  return result;
}

#endif
