#include <napi.h>
#include <boost/multiprecision/gmp.hpp>

using namespace Napi;
using namespace boost::multiprecision;

void mpzIntToNapiString(const Env& env, const mpz_int& mpzInt, std::string& str) {
  str = mpzInt.str();
}

Value CallEmitFibo(const CallbackInfo& info) {
  Env env = info.Env();

  if (info.Length() < 2) {
    throw TypeError::New(env, "Expected two arguments");
  } else if (!info[0].IsNumber()) {
    throw TypeError::New(env, "Expected first arg to be number");
  } else if (!info[1].IsFunction()) {
    throw TypeError::New(env, "Expected second arg to be function");
  }

  const Function& emit = info[1].As<Function>();
  int count = info[0].As<Number>().ToNumber().Int32Value();

  emit.Call({String::New(env, "start")});

  mpz_int tmp, a = 0, b = 1;
  std::string str;

  for (int i = 0; i < count; i++) {
    tmp = a;
    a = b;
    b = tmp + a;
    mpzIntToNapiString(env, a, str);
    emit.Call({String::New(env, "data"), String::New(env, std::move(str))});
  }
  emit.Call({String::New(env, "end")});
  return String::New(env, "OK");
}

Object Init(Env env, Object exports) {
  exports.Set(String::New(env, "callEmitFibo"),
              Function::New(env, CallEmitFibo));

  return exports;
}

NODE_API_MODULE(addons, Init)