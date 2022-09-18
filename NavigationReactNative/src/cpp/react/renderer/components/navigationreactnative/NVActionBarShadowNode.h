#pragma once

#include "NVActionBarState.h"
#include <react/renderer/components/navigationreactnative/EventEmitters.h>
#include <react/renderer/components/navigationreactnative/Props.h>
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