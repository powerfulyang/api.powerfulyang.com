#include <napi.h>


static Napi::Value hello(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    Napi::String name = info[0].As<Napi::String>();
    return Napi::String::New(env, "Hello " + name.Utf8Value() + "!");
}

static Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports["hello"] = Napi::Function::New(env, hello);
  return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
