#pragma once

#include "NVDialogState.h"
#include <react/renderer/components/navigationreactnative/EventEmitters.h>
#include <react/renderer/components/navigationreactnative/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>

namespace facebook {
namespace react {

JSI_EXPORT extern const char NVDialogComponentName[];

class JSI_EXPORT NVDialogShadowNode final : public ConcreteViewShadowNode<
                                          NVDialogComponentName,
                                          NVDialogProps,
                                          NVDialogEventEmitter,
                                          NVDialogState> {
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