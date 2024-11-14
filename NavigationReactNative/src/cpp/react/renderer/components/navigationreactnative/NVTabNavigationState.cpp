#include "NVTabNavigationState.h"

namespace facebook {
namespace react {

#ifdef ANDROID
folly::dynamic NVTabNavigationState::getDynamic() const {
  return folly::dynamic::object("frameWidth", frameSize.width)(
      "frameHeight", frameSize.height);
}
#endif

} // namespace react
} // namespace facebook