#pragma once

#include "NVTitleBarState.h"
#include <react/renderer/components/navigation-react-native/EventEmitters.h>
#include <react/renderer/components/navigation-react-native/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>

namespace facebook {
namespace react {

extern const char NVTitleBarComponentName[];

class NVTitleBarShadowNode final : public ConcreteViewShadowNode<
                                          NVTitleBarComponentName,
                                          NVTitleBarProps,
                                          NVTitleBarEventEmitter,
                                          NVTitleBarState> {
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