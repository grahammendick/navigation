#pragma once

#include "NVTabBarItemShadowNode.h"
#include <react/renderer/core/ConcreteComponentDescriptor.h>

namespace facebook {
namespace react {

class NVTabBarItemComponentDescriptor final
    : public ConcreteComponentDescriptor<NVTabBarItemShadowNode> {
 public:
    NVTabBarItemComponentDescriptor(ComponentDescriptorParameters const &parameters)
      : ConcreteComponentDescriptor(parameters),
        imageManager_(std::make_shared<ImageManager>(contextContainer_)){}

  void adopt(ShadowNode& shadowNode) const override {
    ConcreteComponentDescriptor::adopt(shadowNode);

    auto &tabBarItemShadowNode =
        static_cast<NVTabBarItemShadowNode&>(shadowNode);

    std::weak_ptr<void> imageLoader =
        contextContainer_->at<std::shared_ptr<void>>("RCTImageLoader");
    tabBarItemShadowNode.setImageLoader(imageLoader);    
  }

 private:
  const SharedImageManager imageManager_;
};

} // namespace react
} // namespace facebook