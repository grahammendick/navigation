#pragma once

#include "NVNavigationBarState.h"
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/components/navigationreactnative/EventEmitters.h>
#include <react/renderer/components/navigationreactnative/Props.h>
#include <react/renderer/imagemanager/ImageManager.h>

namespace facebook {
namespace react {

JSI_EXPORT extern const char NVNavigationBarComponentName[];

class JSI_EXPORT NVNavigationBarShadowNode final: public ConcreteViewShadowNode<
  NVNavigationBarComponentName,
  NVNavigationBarProps,
  NVNavigationBarEventEmitter,
  NVNavigationBarState
> {

public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;

  static ShadowNodeTraits BaseTraits() {
    auto traits = ConcreteViewShadowNode::BaseTraits();
    traits.set(ShadowNodeTraits::Trait::RootNodeKind);
    return traits;
  }

  void setImageManager(const SharedImageManager &imageManager);

  static NVNavigationBarState initialStateData(
                                           Props::Shared const &props,
                                           ShadowNodeFamily::Shared const &family,
                                           ComponentDescriptor const &componentDescriptor) {
    auto imageSource = ImageSource{ImageSource::Type::Invalid};
    return {
      imageSource,
      {imageSource, nullptr, {}}};
  }

#pragma mark - LayoutableShadowNode

  Size measureContent(
                      LayoutContext const &layoutContext,
                      LayoutConstraints const &layoutConstraints) const override;
  void layout(LayoutContext layoutContext) override;

private:
  void updateStateIfNeeded();

  ImageSource getImageSource() const;

  SharedImageManager imageManager_;
};

} // namespace react
} // namespace facebook