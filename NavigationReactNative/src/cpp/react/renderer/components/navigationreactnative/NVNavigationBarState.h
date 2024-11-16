#pragma once

#ifdef ANDROID
#include <folly/dynamic.h>
#include <react/renderer/mapbuffer/MapBuffer.h>
#include <react/renderer/mapbuffer/MapBufferBuilder.h>
#endif

#include <react/renderer/graphics/Float.h>
#include <react/renderer/core/graphicsConversions.h>
#include <react/renderer/imagemanager/primitives.h>

namespace facebook {
namespace react {

class JSI_EXPORT NVNavigationBarState final {
 public:
  NVNavigationBarState() = default;

  void setImageLoader(std::weak_ptr<void> imageLoader);
  std::weak_ptr<void> getImageLoader() const noexcept;  
  const Size frameSize{};

#ifdef ANDROID
  NVNavigationBarState(
      NVNavigationBarState const &previousState,
      folly::dynamic data)
      : frameSize(Size{
            (Float)data["frameWidth"].getDouble(),
            (Float)data["frameHeight"].getDouble()}){};


  folly::dynamic getDynamic() const;
  MapBuffer getMapBuffer() const {
    return MapBufferBuilder::EMPTY();
  };
#endif

 private:
  std::weak_ptr<void> imageLoader_;
};

} // namespace react
} // namespace facebook