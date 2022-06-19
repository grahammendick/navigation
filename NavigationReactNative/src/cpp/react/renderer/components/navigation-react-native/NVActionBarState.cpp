#include "NVActionBarState.h"

namespace facebook {
namespace react {

#ifdef ANDROID
folly::dynamic NVActionBarState::getDynamic() const {
  return folly::dynamic::object("frameWidth", frameSize.width)(
      "frameHeight", frameSize.height);
}
#endif

} // namespace react
} // namespace facebook