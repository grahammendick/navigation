#pragma once

#include "NVNavigationBarShadowNode.h"
#include <react/renderer/core/ConcreteComponentDescriptor.h>

namespace facebook {
namespace react {

class NVNavigationBarComponentDescriptor final
    : public ConcreteComponentDescriptor<NVNavigationBarShadowNode> {
 public:
    using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode& shadowNode) const override {
    ConcreteComponentDescriptor::adopt(shadowNode);

    auto &navigationBarShadowNode =
        static_cast<NVNavigationBarShadowNode&>(shadowNode);
    auto& layoutableShadowNode =
        dynamic_cast<YogaLayoutableShadowNode&>(navigationBarShadowNode);

#if !defined(ANDROID)
    std::weak_ptr<void> imageLoader =
        contextContainer_->at<std::shared_ptr<void>>("RCTImageLoader");
    navigationBarShadowNode.setImageLoader(imageLoader);
#endif

    auto state =
        std::static_pointer_cast<const NVNavigationBarShadowNode::ConcreteState>(
            shadowNode.getState());
    auto stateData = state->getData();

    if (stateData.frameSize.width != 0 && stateData.frameSize.height != 0) {
      layoutableShadowNode.setSize(
          Size{stateData.frameSize.width, stateData.frameSize.height});
    }
  }
};

} // namespace react
} // namespace facebook