#include "NVTabBarItemShadowNode.h"
#include <react/renderer/core/LayoutContext.h>

namespace facebook {
namespace react {

extern const char NVTabBarItemComponentName[] = "NVTabBarItem";

void NVTabBarItemShadowNode::setImageManager(const SharedImageManager &imageManager) {
  ensureUnsealed();
  imageManager_ = imageManager;
}

void NVTabBarItemShadowNode::updateStateIfNeeded() {
  const auto &newImageSource = getImageSource();

  auto const &currentState = getStateData();

  auto imageSource = currentState.getImageSource();

  bool anyChanged = newImageSource != imageSource;

  if (!anyChanged) {
    return;
  }

  // Now we are about to mutate the Shadow Node.
  ensureUnsealed();

  // It is not possible to copy or move image requests from SliderLocalData,
  // so instead we recreate any image requests (that may already be in-flight?)
  // TODO: check if multiple requests are cached or if it's a net loss
  auto state = NVTabBarItemState{
      newImageSource,
      imageManager_->requestImage(newImageSource, getSurfaceId()),
    };
  setStateData(std::move(state));
}

ImageSource NVTabBarItemShadowNode::getImageSource() const {
  return getConcreteProps().image;
}

#pragma mark - LayoutableShadowNode

Size NVTabBarItemShadowNode::measureContent(
    LayoutContext const &layoutContext,
    LayoutConstraints const &layoutConstraints) const {
  return {};
}

void NVTabBarItemShadowNode::layout(LayoutContext layoutContext) {
  updateStateIfNeeded();
  ConcreteViewShadowNode::layout(layoutContext);
}

} // namespace react
} // namespace facebook