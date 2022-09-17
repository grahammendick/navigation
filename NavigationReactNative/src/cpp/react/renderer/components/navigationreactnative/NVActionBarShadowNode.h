#pragma once

#include "NVActionBarState.h"
#include "EventEmitters.h"
#include "Props.h"
#include <react/renderer/components/view/ConcreteViewShadowNode.h>

namespace facebook {
namespace react {

JSI_EXPORT extern const char NVActionBarComponentName[];

class JSI_EXPORT NVActionBarShadowNode final : public ConcreteViewShadowNode<
                                          NVActionBarComponentName,
                                          NVActionBarProps,
                                          NVActionBarEventEmitter,
                                          NVActionBarState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;

  static ShadowNodeTraits BaseTraits() {
    auto traits = ConcreteViewShadowNode::BaseTraits();
    traits.set(ShadowNodeTraits::Trait::RootNodeKind);
    return traits;
  }
};

} // namespace react
} // namespace facebook