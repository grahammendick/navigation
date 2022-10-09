#include "NVNavigationBarShadowNode.h"
#include <react/renderer/core/LayoutContext.h>

namespace facebook {
namespace react {

extern const char NVNavigationBarComponentName[] = "NVNavigationBar";

void NVNavigationBarShadowNode::setImageManager(const SharedImageManager &imageManager) {
  ensureUnsealed();
  imageManager_ = imageManager;
}

void NVNavigationBarShadowNode::updateStateIfNeeded() {
  const auto &newImageSource = getImageSource();

  auto const &currentState = getStateData();

  auto imageSource = currentState.getImageSource();

  bool anyChanged = newImageSource != imageSource;

  if (!anyChanged) {
    return;
  }

  ensureUnsealed();

  auto state = NVNavigationBarState{
      newImageSource,
      imageManager_->requestImage(newImageSource, getSurfaceId()),
    };
  setStateData(std::move(state));
}

ImageSource NVNavigationBarShadowNode::getImageSource() const {
  return getConcreteProps().backImage;
}

#pragma mark - LayoutableShadowNode

Size NVNavigationBarShadowNode::measureContent(
    LayoutContext const &layoutContext,
    LayoutConstraints const &layoutConstraints) const {
  return {};
}

void NVNavigationBarShadowNode::layout(LayoutContext layoutContext) {
  updateStateIfNeeded();
  ConcreteViewShadowNode::layout(layoutContext);
}

} // namespace react
} // namespace facebook