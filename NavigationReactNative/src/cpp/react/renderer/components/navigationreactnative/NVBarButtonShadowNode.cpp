#include "NVBarButtonShadowNode.h"
#include <react/renderer/core/LayoutContext.h>

namespace facebook {
namespace react {

extern const char NVBarButtonComponentName[] = "NVBarButton";

void NVBarButtonShadowNode::setImageLoader(
    std::weak_ptr<void> imageLoader) {
  getStateDataMutable().setImageLoader(imageLoader);
}

NVBarButtonShadowNode::StateData &
NVBarButtonShadowNode::getStateDataMutable() {
  ensureUnsealed();
  return const_cast<NVBarButtonShadowNode::StateData &>(
      getStateData());
}

} // namespace react
} // namespace facebook