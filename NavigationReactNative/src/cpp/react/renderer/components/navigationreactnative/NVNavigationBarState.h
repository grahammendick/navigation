#pragma once

#ifdef ANDROID
#include <folly/dynamic.h>
#include <react/renderer/mapbuffer/MapBuffer.h>
#include <react/renderer/mapbuffer/MapBufferBuilder.h>
#endif

#include <react/renderer/imagemanager/ImageRequest.h>
#include <react/renderer/imagemanager/primitives.h>

namespace facebook {
namespace react {

class NVNavigationBarState final {
 public:
  NVNavigationBarState(
      ImageSource const &imageSource,
      ImageRequest imageRequest)
      : imageSource_(imageSource),
        imageRequest_(
            std::make_shared<ImageRequest>(std::move(imageRequest))){};

  NVNavigationBarState() = default;

  ImageSource getImageSource() const;
  ImageRequest const &getImageRequest() const;

#ifdef ANDROID
  NVNavigationBarState(NVNavigationBarState const &previousState, folly::dynamic data){};

  folly::dynamic getDynamic() const {
    return {};
  };
  MapBuffer getMapBuffer() const {
    return MapBufferBuilder::EMPTY();
  };
#endif

 private:
  ImageSource imageSource_;
  std::shared_ptr<ImageRequest> imageRequest_;
};

} // namespace react
} // namespace facebook