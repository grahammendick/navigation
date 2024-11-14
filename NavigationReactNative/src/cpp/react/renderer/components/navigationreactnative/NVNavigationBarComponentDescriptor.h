#pragma once

#include "NVNavigationBarShadowNode.h"
#include <react/renderer/core/ConcreteComponentDescriptor.h>

namespace facebook {
namespace react {

class NVNavigationBarComponentDescriptor final
    : public ConcreteComponentDescriptor<NVNavigationBarShadowNode> {
 public:
    NVNavigationBarComponentDescriptor(ComponentDescriptorParameters const &parameters)
      : ConcreteComponentDescriptor(parameters),
        imageManager_(std::make_shared<ImageManager>(contextContainer_)){}

  void adopt(ShadowNode& shadowNode) const override {
    ConcreteComponentDescriptor::adopt(shadowNode);

    auto &screenShadowNode =
        static_cast<NVNavigationBarShadowNode&>(shadowNode);
    auto& layoutableShadowNode =
        dynamic_cast<YogaLayoutableShadowNode&>(screenShadowNode);

    screenShadowNode.setImageManager(imageManager_);

    auto state =
        std::static_pointer_cast<const NVNavigationBarShadowNode::ConcreteState>(
            shadowNode.getState());
    auto stateData = state->getData();

    if (stateData.frameSize.width != 0 && stateData.frameSize.height != 0) {
      layoutableShadowNode.setSize(
          Size{stateData.frameSize.width, stateData.frameSize.height});
    }
  }

 private:
  const SharedImageManager imageManager_;
};

} // namespace react
} // namespace facebook