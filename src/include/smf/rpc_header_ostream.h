// Copyright (c) 2018 Alexander Gallego. All rights reserved.
//
#pragma once

#include "smf/rpc_generated.h"

#include <fmt/ostream.h>  // IWYU pragma: keep

#include <bitset>
#include <iostream>

namespace std {
inline ostream &
operator<<(ostream &o, const ::smf::rpc::header &h) {
  o << "rpc::header={compression:"
    << ::smf::rpc::EnumNamecompression_flags(h.compression())
    << ", header_bit_flags:"
    << std::bitset<8>(static_cast<uint8_t>(h.bitflags()))
    << ", session:" << h.session() << ", size:" << h.size()
    << ", checksum:" << h.checksum() << ", meta:" << h.meta() << "}";
  return o;
}
}  // namespace std

template <>
struct fmt::formatter<::smf::rpc::header> : ostream_formatter {};
