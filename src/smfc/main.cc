// Copyright (c) 2016 Alexander Gallego. All rights reserved.
//
#include "absl/flags/flag.h"
#include "absl/flags/parse.h"
#include "absl/flags/usage.h"
#include "absl/log/globals.h"
#include "absl/log/initialize.h"
#include "absl/log/log.h"
#include "codegen.h"

#include <boost/algorithm/string.hpp>
#include <boost/filesystem.hpp>
#include <flatbuffers/flatbuffers.h>
#include <flatbuffers/util.h>

#include <memory>
#include <vector>

ABSL_FLAG(std::string, filename, "", "filename to parse");
ABSL_FLAG(std::string, include_dirs, "", "extra include directories");
ABSL_FLAG(std::string, language, "cpp",
          "coma separated list of language to generate: go, cpp");
ABSL_FLAG(std::string, output_path, ".", "output path of the generated files");

namespace {
std::vector<std::string>
split_coma(const std::string &dirs) {
  std::vector<std::string> retval;
  boost::algorithm::split(retval, dirs, boost::is_any_of(","));
  if (retval.empty() && !dirs.empty()) { retval.push_back(dirs); }
  for (auto &s : retval) {
    boost::algorithm::trim(s);
  }
  return retval;
}

std::vector<smf_gen::language>
split_langs(const std::string &lang) {
  // Note: be sure to add the generator in codegen.cc
  std::vector<smf_gen::language> retval;
  auto str_langs = split_coma(lang);
  for (auto &l : str_langs) {
    if (l == "cpp") {
      retval.push_back(smf_gen::language::cpp);
    } else if (l == "go") {
      retval.push_back(smf_gen::language::go);
    } else if (l == "python") {
      retval.push_back(smf_gen::language::python);
    } else {
      LOG(ERROR) << "Skipping unknown language: " << l;
    }
  }
  return retval;
}
}  // namespace

int
main(int argc, char **argv, char **env) {
  absl::SetProgramUsageMessage("Generate smf services");
  absl::ParseCommandLine(argc, argv);
  absl::InitializeLog();
  absl::SetStderrThreshold(absl::LogSeverity::kInfo);

  const auto filename = absl::GetFlag(FLAGS_filename);
  const auto include_dirs = absl::GetFlag(FLAGS_include_dirs);
  const auto language = absl::GetFlag(FLAGS_language);
  auto output_path = absl::GetFlag(FLAGS_output_path);

  // validate flags
  if (filename.empty()) {
    LOG(ERROR) << "No filename to parse";
    return 1;
  }
  if (!boost::filesystem::exists(filename)) {
    LOG(ERROR) << " ` " << filename
               << " ' - does not exists or could not be found";
    return 1;
  }
  if (output_path.empty()) {
    LOG(ERROR) << " ` " << output_path << " ' - empty output path";
    return 1;
  }
  output_path = boost::filesystem::canonical(output_path.c_str()).string();
  if (!boost::filesystem::is_directory(output_path)) {
    LOG(ERROR) << "--output_path specified, but " << output_path
               << " is not a directory";
    return 1;
  }

  auto codegenerator = std::make_unique<smf_gen::codegen>(
    filename, output_path, split_coma(include_dirs), split_langs(language));
  // generate code!
  auto status = codegenerator->parse();
  if (status) {
    LOG(ERROR) << "Failed to parse file: " << status.value();
    return 1;
  }
  if (codegenerator->service_count() == 0) {
    LOG(INFO) << "No services need to be generated";
    // if we return 0, the cmake module cannot detect if we generate a file or
    // not and always calls smfc return 0;
  }
  status = codegenerator->gen();
  if (status) {
    LOG(ERROR) << "Errors generating code: " << *status;
    return 1;
  }
  VLOG(1) << "Success";
  return 0;
}
