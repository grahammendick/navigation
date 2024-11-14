#pragma once

#include "NVTabNavigationShadowNode.h"
#include <react/renderer/core/ConcreteComponentDescriptor.h>

namespace facebook {
namespace react {

class NVTabNavigationComponentDescriptor final
    : public ConcreteComponentDescriptor<NVTabNavigationShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode& shadowNode) const override {
    auto& screenShadowNode =
        static_cast<NVTabNavigationShadowNode&>(shadowNode);

    auto& layoutableShadowNode =
        dynamic_cast<YogaLayoutableShadowNode&>(screenShadowNode);

    auto state =
        std::static_pointer_cast<const NVTabNavigationShadowNode::ConcreteState>(
            shadowNode.getState());
    auto stateData = state->getData();

    if (stateData.frameSize.width != 0 && stateData.frameSize.height != 0) {
      layoutableShadowNode.setSize(
          Size{stateData.frameSize.width, stateData.frameSize.height});
    }

    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace react
} // namespace facebook