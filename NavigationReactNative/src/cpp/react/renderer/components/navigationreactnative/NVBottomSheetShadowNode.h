#pragma once

#include "NVBottomSheetState.h"
#include <react/renderer/components/navigationreactnative/EventEmitters.h>
#include <react/renderer/components/navigationreactnative/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>

namespace facebook {
namespace react {

JSI_EXPORT extern const char NVBottomSheetComponentName[];

class JSI_EXPORT NVBottomSheetShadowNode final : public ConcreteViewShadowNode<
                                          NVBottomSheetComponentName,
                                          NVBottomSheetProps,
                                          NVBottomSheetEventEmitter,
                                          NVBottomSheetState> {
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