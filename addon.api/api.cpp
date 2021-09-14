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

using namespace Napi;


Array vectorToNapiArray(std::vector<uint16_t> arr, Env env){
    Array array = Array::New(env);
    int i = 0;
    for (uint16_t val: arr){
        array[i] = val;
        i++;
    }
    return array;
}


static Napi::Value getEXIF(const Napi::CallbackInfo& info) {
    Env env = info.Env();
    String _path = info[0].As<String>();
    std::string path = _path.Utf8Value().c_str();
    std::ifstream stream(path, std::ios::binary);
    TinyEXIF::EXIFInfo imageEXIF(stream);
    stream.close();
    Napi::Object o = Napi::Object::New(env);
    o.Set("ImageWidth",imageEXIF.ImageWidth);
    o.Set("ImageHeight",imageEXIF.ImageHeight);
    o.Set("RelatedImageWidth",imageEXIF.RelatedImageWidth);
    o.Set("RelatedImageHeight",imageEXIF.RelatedImageHeight);
    o.Set("ImageDescription",imageEXIF.ImageDescription);
    o.Set("Make",imageEXIF.Make);
    o.Set("Model",imageEXIF.Model);
    o.Set("SerialNumber",imageEXIF.SerialNumber);
    o.Set("Orientation",imageEXIF.Orientation);
    o.Set("XResolution",imageEXIF.XResolution);
    o.Set("YResolution",imageEXIF.YResolution);
    o.Set("ResolutionUnit",imageEXIF.ResolutionUnit);
    o.Set("BitsPerSample",imageEXIF.BitsPerSample);
    o.Set("Software",imageEXIF.Software);
    o.Set("DateTime",imageEXIF.DateTime);
    o.Set("DateTimeOriginal",imageEXIF.DateTimeOriginal);
    o.Set("DateTimeDigitized",imageEXIF.DateTimeDigitized);
    o.Set("SubSecTimeOriginal",imageEXIF.SubSecTimeOriginal);
    o.Set("ExposureTime",imageEXIF.ExposureTime);
    o.Set("Copyright",imageEXIF.Copyright);
    o.Set("FNumber",imageEXIF.FNumber);
    o.Set("ExposureProgram",imageEXIF.ExposureProgram);
    o.Set("ISOSpeedRatings",imageEXIF.ISOSpeedRatings);
    o.Set("ShutterSpeedValue",imageEXIF.ShutterSpeedValue);
    o.Set("ApertureValue",imageEXIF.ApertureValue);
    o.Set("BrightnessValue",imageEXIF.BrightnessValue);
    o.Set("ExposureBiasValue",imageEXIF.ExposureBiasValue);
    o.Set("SubjectDistance",imageEXIF.SubjectDistance);
    o.Set("FocalLength",imageEXIF.FocalLength);
    o.Set("Flash",imageEXIF.Flash);
    o.Set("SubjectArea",vectorToNapiArray(imageEXIF.SubjectArea,env));
    o.Set("MeteringMode",imageEXIF.MeteringMode);
    o.Set("LightSource",imageEXIF.LightSource);
    o.Set("ProjectionType",imageEXIF.ProjectionType);
    Object Calibration = Object::New(env);
    Calibration.Set("FocalLength",imageEXIF.Calibration.FocalLength);
    Calibration.Set("OpticalCenterX",imageEXIF.Calibration.OpticalCenterX);
    Calibration.Set("OpticalCenterY",imageEXIF.Calibration.OpticalCenterY);
    o.Set("Calibration",Calibration);
    Object LensInfo = Object::New(env);
    LensInfo.Set("FStopMin",imageEXIF.LensInfo.FStopMin);
    LensInfo.Set("FStopMax",imageEXIF.LensInfo.FStopMax);
    LensInfo.Set("FocalLengthMin",imageEXIF.LensInfo.FocalLengthMin);
    LensInfo.Set("FocalLengthMax",imageEXIF.LensInfo.FocalLengthMax);
    LensInfo.Set("DigitalZoomRatio",imageEXIF.LensInfo.DigitalZoomRatio);
    LensInfo.Set("FocalLengthIn35mm",imageEXIF.LensInfo.FocalLengthIn35mm);
    LensInfo.Set("FocalPlaneXResolution",imageEXIF.LensInfo.FocalPlaneXResolution);
    LensInfo.Set("FocalPlaneYResolution",imageEXIF.LensInfo.FocalPlaneYResolution);
    LensInfo.Set("FocalPlaneResolutionUnit",imageEXIF.LensInfo.FocalPlaneResolutionUnit);
    LensInfo.Set("Make",imageEXIF.LensInfo.Make);
    LensInfo.Set("Model",imageEXIF.LensInfo.Model);
    o.Set("LensInfo",LensInfo);
    Object GeoLocation = Object::New(env);
    GeoLocation.Set("Latitude",imageEXIF.GeoLocation.Latitude);
    GeoLocation.Set("Longitude",imageEXIF.GeoLocation.Longitude);
    GeoLocation.Set("Altitude",imageEXIF.GeoLocation.Altitude);
    GeoLocation.Set("AltitudeRef",imageEXIF.GeoLocation.AltitudeRef);
    GeoLocation.Set("RelativeAltitude",imageEXIF.GeoLocation.RelativeAltitude);
    GeoLocation.Set("RollDegree",imageEXIF.GeoLocation.RollDegree);
    GeoLocation.Set("PitchDegree",imageEXIF.GeoLocation.PitchDegree);
    GeoLocation.Set("YawDegree",imageEXIF.GeoLocation.YawDegree);
    GeoLocation.Set("SpeedX",imageEXIF.GeoLocation.SpeedX);
    GeoLocation.Set("SpeedY",imageEXIF.GeoLocation.SpeedY);
    GeoLocation.Set("SpeedZ",imageEXIF.GeoLocation.SpeedZ);
    GeoLocation.Set("AccuracyXY",imageEXIF.GeoLocation.AccuracyXY);
    GeoLocation.Set("AccuracyZ",imageEXIF.GeoLocation.AccuracyZ);
    GeoLocation.Set("GPSDOP",imageEXIF.GeoLocation.GPSDOP);
    GeoLocation.Set("GPSDifferential",imageEXIF.GeoLocation.GPSDifferential);
    GeoLocation.Set("GPSMapDatum",imageEXIF.GeoLocation.GPSMapDatum);
    GeoLocation.Set("GPSTimeStamp",imageEXIF.GeoLocation.GPSTimeStamp);
    GeoLocation.Set("GPSDateStamp",imageEXIF.GeoLocation.GPSDateStamp);
    o.Set("GeoLocation",GeoLocation);
    Object GPano = Object::New(env);
    GPano.Set("PosePitchDegrees",imageEXIF.GPano.PosePitchDegrees);
    GPano.Set("PoseRollDegrees",imageEXIF.GPano.PoseRollDegrees);
    o.Set("GPano",GPano);
    return o;
}

static Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports["getEXIF"] = Napi::Function::New(env, getEXIF);
  return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
