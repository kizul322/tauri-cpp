

#include "TauriCpp.hpp"

#include <functional>
#include <iostream>
#include <span>

#include "action/File.hpp"
#include "invoker/Invoke.hpp"

using namespace TauriCpp::Action;
using namespace TauriCpp::Invoker;

Responce InvokeCpp(const unsigned char* data, std::size_t len) {
  std::string_view funcname(reinterpret_cast<const char*>(data));
  std::span<const unsigned char> span_data(data + funcname.length() + 1,
                                           len - funcname.length() - 1);

  try {
    if (funcname == "Read") {
      return Invoke(std::function(Read), span_data);
    }
    if (funcname == "FileSize") {
      return Invoke(std::function(FileSize), span_data);
    }
    std::cerr << "function not found: " << funcname << std::endl;

  } catch (BadConvertionArguments&) {
    std::cout << "convert argument error!!" << std::endl;
  }

  return {nullptr, 0};
}

void FreeResponcePtr(const std::uint8_t* ptr) {
  delete[] ptr;
}
