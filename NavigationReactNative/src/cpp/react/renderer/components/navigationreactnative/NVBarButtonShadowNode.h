#pragma once

#include "NVBarButtonState.h"
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/components/navigationreactnative/EventEmitters.h>
#include <react/renderer/components/navigationreactnative/Props.h>

namespace facebook {
namespace react {

JSI_EXPORT extern const char NVBarButtonComponentName[];

class JSI_EXPORT NVBarButtonShadowNode final: public ConcreteViewShadowNode<
  NVBarButtonComponentName,
  NVBarButtonProps,
  NVBarButtonEventEmitter,
  NVBarButtonState
> {

public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
  using StateData = ConcreteViewShadowNode::ConcreteStateData;

  void setImageLoader(std::weak_ptr<void> imageLoader);

  StateData &getStateDataMutable();

};

} // namespace react
} // namespace facebook