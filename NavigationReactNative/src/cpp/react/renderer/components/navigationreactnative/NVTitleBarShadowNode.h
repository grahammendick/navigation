#pragma once

#include "NVTitleBarState.h"
#include <react/renderer/components/navigationreactnative/EventEmitters.h>
#include <react/renderer/components/navigationreactnative/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>

namespace facebook {
namespace react {

JSI_EXPORT extern const char NVTitleBarComponentName[];

class JSI_EXPORT NVTitleBarShadowNode final : public ConcreteViewShadowNode<
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