#pragma once

#include "NVNavigationBarState.h"
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/components/navigationreactnative/EventEmitters.h>
#include <react/renderer/components/navigationreactnative/Props.h>

namespace facebook {
namespace react {

JSI_EXPORT extern const char NVNavigationBarComponentName[];

class JSI_EXPORT NVNavigationBarShadowNode final: public ConcreteViewShadowNode<
  NVNavigationBarComponentName,
  NVNavigationBarProps,
  NVNavigationBarEventEmitter,
  NVNavigationBarState
> {

public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
  using StateData = ConcreteViewShadowNode::ConcreteStateData;

  static ShadowNodeTraits BaseTraits() {
    auto traits = ConcreteViewShadowNode::BaseTraits();
    traits.set(ShadowNodeTraits::Trait::RootNodeKind);
    return traits;
  }

  void setImageLoader(std::weak_ptr<void> imageLoader);

  StateData &getStateDataMutable();

};

} // namespace react
} // namespace facebook