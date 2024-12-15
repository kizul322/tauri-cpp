#ifndef INVOKE_HPP
#define INVOKE_HPP

#include <algorithm>
#include <concepts>
#include <functional>
#include <span>
#include <string>
#include <tuple>

#include "Responce.hpp"
#include "utility/Endian.hpp"

namespace TauriCpp::Invoker {

struct BadConvertionArguments : public std::exception {};

template <std::same_as<std::string> T>
static std::string Convert(std::span<const unsigned char>& data) {
  auto data_len = ReadLittleEndianValue<uint32_t>(data, data.size());
  data = data.subspan(4);

  std::string result{reinterpret_cast<const char*>(data.data()), data_len};
  data = data.subspan(data_len);
  return result;
}

template <std::integral T>
static T Convert(std::span<const unsigned char>& data) {
  const auto data_len = ReadLittleEndianValue<uint32_t>(data, data.size());
  if (data.size() < data_len) {
    throw BadConvertionArguments{};
  }
  data = data.subspan(4);

  const auto result = ReadLittleEndianValue<std::uint64_t>(data, data_len);
  data = data.subspan(data_len);

  return result;
}

template <typename... Args>
static Responce Invoke(std::function<Responce(Args...)> f,
                       std::span<const unsigned char> data) {
  std::tuple args = {Convert<Args>(data)...};
  return std::apply(f, args);
}

}  // namespace TauriCpp::Invoker

#endif
