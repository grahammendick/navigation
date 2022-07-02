#include "NVBarButtonState.h"

namespace facebook {
namespace react {

ImageSource NVBarButtonState::getImageSource() const {
  return imageSource_;
}

ImageRequest const &NVBarButtonState::getImageRequest() const {
  return *imageRequest_;
}

} // namespace react
} // namespace facebook