{
  "targets": [
    {
      "target_name": "api",
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "sources": [
        "addon.api/api.cpp",
        "addon.api/tinyxml2/tinyxml2.cpp",
        "addon.api/TinyEXIF/TinyEXIF.cpp"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
    }
  ]
}
