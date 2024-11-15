#pragma once

#include "NVTabBarItemState.h"
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/components/navigationreactnative/EventEmitters.h>
#include <react/renderer/components/navigationreactnative/Props.h>
#include <react/renderer/imagemanager/ImageManager.h>

namespace facebook {
namespace react {

JSI_EXPORT extern const char NVTabBarItemComponentName[];

class JSI_EXPORT NVTabBarItemShadowNode final: public ConcreteViewShadowNode<
  NVTabBarItemComponentName,
  NVTabBarItemProps,
  NVTabBarItemEventEmitter,
  NVTabBarItemState
> {

public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
  using StateData = ConcreteViewShadowNode::ConcreteStateData;

  void setImageLoader(std::weak_ptr<void> imageLoader);

  StateData &getStateDataMutable();

};

} // namespace react
} // namespace facebook