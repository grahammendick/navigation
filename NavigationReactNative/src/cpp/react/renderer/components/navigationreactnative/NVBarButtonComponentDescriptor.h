#pragma once

#include "NVBarButtonShadowNode.h"
#include <react/renderer/core/ConcreteComponentDescriptor.h>

namespace facebook {
namespace react {

class NVBarButtonComponentDescriptor final
    : public ConcreteComponentDescriptor<NVBarButtonShadowNode> {
 public:
    using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode& shadowNode) const override {
    ConcreteComponentDescriptor::adopt(shadowNode);

#if !defined(ANDROID)
    auto &barButtonShadowNode =
        static_cast<NVBarButtonShadowNode&>(shadowNode);

    std::weak_ptr<void> imageLoader =
        contextContainer_->at<std::shared_ptr<void>>("RCTImageLoader");
    barButtonShadowNode.setImageLoader(imageLoader);
#endif
  }
};

} // namespace react
} // namespace facebook