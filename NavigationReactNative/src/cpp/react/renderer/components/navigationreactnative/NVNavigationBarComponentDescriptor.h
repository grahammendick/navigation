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

  void adopt(ShadowNode::Unshared const &shadowNode) const override {
    ConcreteComponentDescriptor::adopt(shadowNode);

    auto navigationBarShadowNode =
        std::static_pointer_cast<NVNavigationBarShadowNode>(shadowNode);

    navigationBarShadowNode->setImageManager(imageManager_);
  }

 private:
  const SharedImageManager imageManager_;
};

} // namespace react
} // namespace facebook