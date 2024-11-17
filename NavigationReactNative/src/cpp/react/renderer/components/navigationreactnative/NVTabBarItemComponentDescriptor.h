#pragma once

#include "NVTabBarItemShadowNode.h"
#include <react/renderer/core/ConcreteComponentDescriptor.h>

namespace facebook {
namespace react {

class NVTabBarItemComponentDescriptor final
    : public ConcreteComponentDescriptor<NVTabBarItemShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode& shadowNode) const override {
    ConcreteComponentDescriptor::adopt(shadowNode);

#if !defined(ANDROID)
    auto &tabBarItemShadowNode =
        static_cast<NVTabBarItemShadowNode&>(shadowNode);

    std::weak_ptr<void> imageLoader =
        contextContainer_->at<std::shared_ptr<void>>("RCTImageLoader");
    tabBarItemShadowNode.setImageLoader(imageLoader);
#endif
  }
};

} // namespace react
} // namespace facebook