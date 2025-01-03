// Copyright 2019 SMF Authors
//

#include "python_generator.h"

#include "absl/log/log.h"

#include <memory>
#include <string>

namespace smf_gen {

namespace {
static inline std::string
python_public_name(std::string s) {
  s[0] = std::toupper(s[0]);
  return s;
}

static void
print_client_method(smf_printer &printer, const smf_method *method) {
  std::map<std::string, std::string> vars;
  vars["MethodName"] = python_public_name(method->name());
  vars["MethodID"] = std::to_string(method->method_id());
  vars["ServiceID"] = std::to_string(method->service_id());
  vars["OutType"] = method->output_type_name(language::python);
  vars["RequestID"] =
    std::to_string(method->service_id() ^ method->method_id());

  printer.print(vars, "async def $MethodName$(self, x):\n");
  printer.indent();
  printer.print(vars, "# request id = $ServiceID$ ^ $MethodID$\n");
  printer.print(vars, "buf, status = await self._conn.call(x, $RequestID$)\n");
  printer.print(vars,
                "return $OutType$.GetRootAsPutResponse(buf, 0), status\n");
  printer.outdent();
}

static void
print_client(smf_printer &printer, const smf_service *service) {
  VLOG(1) << "print_client";
  std::map<std::string, std::string> vars;

  vars["InterfaceName"] = python_public_name(service->name());
  vars["ClientName"] = vars["InterfaceName"] + "Client";
  vars["ServiceID"] = std::to_string(service->service_id());

  printer.print(vars, "class $ClientName$:\n");
  printer.indent();
  printer.print("def __init__(self, conn):\n");
  printer.indent();
  printer.print("self._conn = conn\n\n");
  printer.outdent();
  printer.outdent();

  for (auto i = 0u; i < service->methods().size(); i++) {
    auto &method = service->methods()[i];
    printer.indent();
    print_client_method(printer, method.get());
    printer.outdent();
    if ((i + 1) < service->methods().size()) { printer.print("\n"); }
  }
}
}  // namespace

void
python_generator::generate_header_prologue() {
  VLOG(1) << "generate_header_prologue";
  std::map<std::string, std::string> vars;
  vars["filename"] = input_filename;
  printer_.print("# Generated by smfc.\n");
  printer_.print("# Any local changes WILL BE LOST.\n");
  printer_.print(vars, "# source: $filename$\n\n");
}

void
python_generator::generate_header_includes() {
  VLOG(1) << "generate_header_includes";

  std::set<std::string> imports;
  for (auto &service : services()) {
    for (auto &method : service->methods()) {
      auto type = method->output_type_name(language::python);
      auto point = type.rfind(".");
      LOG_IF(FATAL, point == std::string::npos) << "Invalid type";
      imports.insert(type.substr(0, point));
    }
  }

  for (auto &import : imports) {
    printer_.print("import ");
    printer_.print(import.c_str());
    printer_.print("\n");
  }
  printer_.print("\n");
}

void
python_generator::generate_header_services() {
  VLOG(1) << "Generating (" << services().size() << ") services";
  for (auto &srv : services()) {
    print_client(printer_, srv.get());
  }
}

}  // namespace smf_gen
