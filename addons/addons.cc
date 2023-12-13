// build simple addon
#include <napi.h>

namespace helloFunction {
std::string hello();
Napi::String HelloWrapped(const Napi::CallbackInfo& info);
Napi::Object Init(Napi::Env env, Napi::Object exports);
}  // namespace helloFunction

std::string helloFunction::hello() { return "Hello World"; }

Napi::String helloFunction::HelloWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  Napi::String returnValue = Napi::String::New(env, helloFunction::hello());

  return returnValue;
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("hello", Napi::Function::New(env, helloFunction::HelloWrapped));

  return exports;
}

NODE_API_MODULE(addons, Init)