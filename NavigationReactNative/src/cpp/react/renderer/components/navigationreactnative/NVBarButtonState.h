#pragma once

#ifdef ANDROID
#include <folly/dynamic.h>
#include <react/renderer/mapbuffer/MapBuffer.h>
#include <react/renderer/mapbuffer/MapBufferBuilder.h>
#endif

#include <react/renderer/imagemanager/primitives.h>

namespace facebook {
namespace react {

class NVBarButtonState final {
 public:
  NVBarButtonState() = default;

  void setImageLoader(std::weak_ptr<void> imageLoader);
  std::weak_ptr<void> getImageLoader() const noexcept;  

#ifdef ANDROID
  NVBarButtonState(NVBarButtonState const &previousState, folly::dynamic data){};

  folly::dynamic getDynamic() const {
    return {};
  };
  MapBuffer getMapBuffer() const {
    return MapBufferBuilder::EMPTY();
  };
#endif

 private:
  std::weak_ptr<void> imageLoader_;
};

} // namespace react
} // namespace facebook