#pragma once

#include "NVBottomSheetDialogState.h"
#include <react/renderer/components/navigationreactnative/EventEmitters.h>
#include <react/renderer/components/navigationreactnative/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>

namespace facebook {
namespace react {

JSI_EXPORT extern const char NVBottomSheetDialogComponentName[];

class JSI_EXPORT NVBottomSheetDialogShadowNode final : public ConcreteViewShadowNode<
                                          NVBottomSheetDialogComponentName,
                                          NVBottomSheetDialogProps,
                                          NVBottomSheetDialogEventEmitter,
                                          NVBottomSheetDialogState> {
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