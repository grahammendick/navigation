#include "NVTabBarItemShadowNode.h"
#include <react/renderer/core/LayoutContext.h>

namespace facebook {
namespace react {

extern const char NVTabBarItemComponentName[] = "NVTabBarItem";

void NVTabBarItemShadowNode::setImageLoader(
    std::weak_ptr<void> imageLoader) {
  getStateDataMutable().setImageLoader(imageLoader);
}

NVTabBarItemShadowNode::StateData &
NVTabBarItemShadowNode::getStateDataMutable() {
  ensureUnsealed();
  return const_cast<NVTabBarItemShadowNode::StateData &>(
      getStateData());
}

} // namespace react
} // namespace facebook