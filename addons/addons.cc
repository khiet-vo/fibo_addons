// build simple addon
#include <napi.h>

using namespace Napi;

Value CallEmitFibo(const CallbackInfo& info) {
  Env env = info.Env();

  if (info.Length() < 2) {
    throw TypeError::New(env, "Expected two arguments");
  } else if (!info[0].IsNumber()) {
    throw TypeError::New(env, "Expected first arg to be number");
  } else if (!info[1].IsFunction()) {
    throw TypeError::New(env, "Expected second arg to be function");
  }

  Function emit = info[1].As<Function>();
  int count = info[0].As<Number>().Int32Value();

  emit.Call({String::New(env, "start")});
  unsigned long long tmp, a = 0, b = 1;
  
  //   int start = clock();
  for (int i = 0; i < count; i++) {
    tmp = a;
    a = b;
    b = tmp + a;
    emit.Call({String::New(env, "data"), String::New(env, std::to_string(a))});
  }
  //   int end = clock();
  //   std::cout << "it took " << end - start << "ticks, or "
  //             << ((float)end - start) / CLOCKS_PER_SEC << "seconds." <<
  //             std::endl;

  emit.Call({String::New(env, "end")});
  return String::New(env, "OK");
}

Object Init(Env env, Object exports) {
  exports.Set(String::New(env, "callEmitFibo"),
              Function::New(env, CallEmitFibo));

  return exports;
}

NODE_API_MODULE(addons, Init)