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

  void adopt(ShadowNode::Unshared const &shadowNode) const override {
    ConcreteComponentDescriptor::adopt(shadowNode);

    auto tabBarItemShadowNode =
        std::static_pointer_cast<NVTabBarItemShadowNode>(shadowNode);

    tabBarItemShadowNode->setImageManager(imageManager_);
  }

 private:
  const SharedImageManager imageManager_;
};

} // namespace react
} // namespace facebook