#include "utility/Endian.hpp"

#include <vector>

#include "gtest/gtest.h"

TEST(EndianTest, ReadLittleEndianValueUint16) {
  std::vector<unsigned char> data = {0x34, 0x12};
  auto result = ReadLittleEndianValue<uint16_t>(data, data.size());
  uint16_t expected = 0x1234;
  EXPECT_EQ(result, expected);
}

TEST(EndianTest, ReadLittleEndianValueUint32) {
  std::vector<unsigned char> data = {0x78, 0x56, 0x34, 0x12};
  auto result = ReadLittleEndianValue<uint32_t>(data, data.size());
  uint32_t expected = 0x12345678;
  EXPECT_EQ(result, expected);
}

TEST(EndianTest, ReadLittleEndianValueUint64) {
  std::vector<unsigned char> data = {0xF0, 0xDE, 0xBC, 0x9A,
                                     0x78, 0x56, 0x34, 0x12};
  auto result = ReadLittleEndianValue<uint64_t>(data, data.size());
  uint64_t expected = 0x123456789ABCDEF0;
  EXPECT_EQ(result, expected);
}

TEST(EndianTest, WriteLittleEndianValueUint16) {
  uint16_t value = 0x1234;
  auto result = WriteLittleEndianValue(value);
  std::array<std::uint8_t, sizeof(uint16_t)> expected = {0x34, 0x12};
  EXPECT_EQ(result, expected);
}

TEST(EndianTest, WriteLittleEndianValueUint32) {
  uint32_t value = 0x12345678;
  auto result = WriteLittleEndianValue(value);
  std::array<std::uint8_t, sizeof(uint32_t)> expected = {0x78, 0x56, 0x34,
                                                         0x12};
  EXPECT_EQ(result, expected);
}

TEST(EndianTest, WriteLittleEndianValueUint64) {
  uint64_t value = 0x123456789ABCDEF0;
  auto result = WriteLittleEndianValue(value);
  std::array<std::uint8_t, sizeof(uint64_t)> expected = {
      0xF0, 0xDE, 0xBC, 0x9A, 0x78, 0x56, 0x34, 0x12};
  EXPECT_EQ(result, expected);
}
