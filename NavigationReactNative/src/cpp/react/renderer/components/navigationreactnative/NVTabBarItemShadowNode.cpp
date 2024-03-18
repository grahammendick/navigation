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

  ensureUnsealed();

  if (newImageSource.uri.substr(0,5) != "file:" && newImageSource.uri.substr(0,5) != "http:" && newImageSource.uri.substr(0,6) != "https:") {
      auto state = NVTabBarItemState{
          newImageSource,
        };
      setStateData(std::move(state));
  } else {
      auto state = NVTabBarItemState{
          newImageSource,
          imageManager_->requestImage(newImageSource, getSurfaceId()),
        };
      setStateData(std::move(state));
  }

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