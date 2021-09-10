// Defines the entry point for the console application.

#ifdef _MSC_VER
#include <windows.h>
#endif
#include "./TinyEXIF/TinyEXIF.h"
#include <iostream> // std::cout
#include <fstream>  // std::ifstream
#include <vector>   // std::vector
#include <iomanip>  // std::setprecision
#include <napi.h>


static Napi::Value getEXIF(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    Napi::String _path = info[0].As<Napi::String>();
    std::string path = _path.Utf8Value().c_str();
    std::ifstream stream(path, std::ios::binary);
    TinyEXIF::EXIFInfo imageEXIF(stream);
    stream.close();
    return Napi::Number::New(env, imageEXIF.ImageWidth);
}

static Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports["getEXIF"] = Napi::Function::New(env, getEXIF);
  return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
