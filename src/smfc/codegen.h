// Copyright (c) 2016 Alexander Gallego. All rights reserved.
//
#pragma once

#include "language.h"

#include <flatbuffers/flatbuffers.h>
#include <flatbuffers/idl.h>

#include <memory>
#include <optional>
#include <string>
#include <vector>

namespace smf_gen {

class codegen {
 public:
  using status = std::optional<std::string>;

  codegen(std::string ifname, std::string output_dir,
          std::vector<std::string> include_dirs, std::vector<language> langs);
  ~codegen() = default;

  status gen();
  status parse();
  std::size_t service_count() const;

  const std::string input_filename;
  const std::string output_dir;
  const std::vector<language> languages;

 private:
  std::vector<std::string> include_dirs_;
  flatbuffers::IDLOptions opts_;
  std::unique_ptr<flatbuffers::Parser> parser_;
  bool parsed_ = false;
};

}  // namespace smf_gen
