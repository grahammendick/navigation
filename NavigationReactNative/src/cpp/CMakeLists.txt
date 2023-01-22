# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

cmake_minimum_required(VERSION 3.13)
set(CMAKE_VERBOSE_MAKEFILE on)

file(
  GLOB react_codegen_SRCS CONFIGURE_DEPENDS
  *.cpp
  react/renderer/components/navigationreactnative/*.cpp
  ../android/build/generated/source/codegen/jni/react/renderer/components/navigationreactnative/*.cpp
)

add_library(
  react_codegen_navigationreactnative
  SHARED
  ${react_codegen_SRCS}
)

target_include_directories(
  react_codegen_navigationreactnative
  PUBLIC
  .
  react/renderer/components/navigationreactnative
  ../android/build/generated/source/codegen/jni
  ../android/build/generated/source/codegen/jni/react/renderer/components/navigationreactnative
)

target_link_libraries(
  react_codegen_navigationreactnative
  fbjni
  folly_runtime
  glog
  jsi
  react_codegen_rncore
  react_debug
  react_nativemodule_core
  react_render_core
  react_render_mapbuffer
  react_render_imagemanager
  react_render_debug
  react_render_graphics
  rrc_image
  rrc_view
  turbomodulejsijni
  yoga
)

target_compile_options(
  react_codegen_navigationreactnative
  PRIVATE
  -DLOG_TAG=\"ReactNative\"
  -fexceptions
  -frtti
  -std=c++17
  -Wall
)
