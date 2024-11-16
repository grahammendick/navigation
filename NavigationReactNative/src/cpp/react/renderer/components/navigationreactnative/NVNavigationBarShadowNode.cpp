#include "NVNavigationBarShadowNode.h"
#include <react/renderer/core/LayoutContext.h>

namespace facebook {
namespace react {

extern const char NVNavigationBarComponentName[] = "NVNavigationBar";

void NVNavigationBarShadowNode::setImageLoader(
    std::weak_ptr<void> imageLoader) {
  getStateDataMutable().setImageLoader(imageLoader);
}

NVNavigationBarShadowNode::StateData &
NVNavigationBarShadowNode::getStateDataMutable() {
  ensureUnsealed();
  return const_cast<NVNavigationBarShadowNode::StateData &>(
      getStateData());
}

} // namespace react
} // namespace facebook