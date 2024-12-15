#include "invoker/Invoke.hpp"

#include <functional>
#include <span>
#include <string>
#include <vector>

#include "gtest/gtest.h"

using namespace TauriCpp::Invoker;

TEST(InvokeTest, ReadLittleEndianValue) {
  std::vector<unsigned char> data = {0x01, 0x00, 0x00, 0x00};
  auto result = ReadLittleEndianValue<uint32_t>(data, data.size());
  EXPECT_EQ(result, 1u);
}

TEST(InvokeTest, ConvertString) {
  std::vector<unsigned char> data = {0x05, 0x00, 0x00, 0x00, 'H',
                                     'e',  'l',  'l',  'o'};
  std::span<const unsigned char> span_data(data.data(), data.size());
  auto result = Convert<std::string>(span_data);
  EXPECT_EQ(result, "Hello");
}

TEST(InvokeTest, ConvertIntegral) {
  std::vector<unsigned char> data = {0x01, 0x00, 0x00, 0x00, 0x01};
  std::span<const unsigned char> span_data(data.data(), data.size());
  auto result = Convert<int>(span_data);
  EXPECT_EQ(result, 1);
}

static const std::uint8_t dummy_result = 0;
Responce TestDummy(int _a, std::string _b) {
  return Responce{&dummy_result, 10};
}
TEST(InvokeTest, InvokeFunction) {
  std::vector<unsigned char> data = {0x01, 0x00, 0x00, 0x00, 0x01, 0x05, 0x00,
                                     0x00, 0x00, 'H',  'e',  'l',  'l',  'o'};
  std::span<const unsigned char> span_data(data.data(), data.size());
  auto result = Invoke(std::function(TestDummy), span_data);
  EXPECT_EQ(result.result, &dummy_result);
  EXPECT_EQ(result.size, 10);
}
