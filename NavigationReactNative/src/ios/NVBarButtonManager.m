#import "NVBarButtonManager.h"
#import "NVBarButtonView.h"

#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@implementation RCTConvert (UIBarButtonSystemItem)

RCT_ENUM_CONVERTER(UIBarButtonSystemItem, (@{
    @"done": @(UIBarButtonSystemItemDone),
    @"cancel": @(UIBarButtonSystemItemCancel),
    @"edit": @(UIBarButtonSystemItemEdit),
    @"save": @(UIBarButtonSystemItemSave),
    @"add": @(UIBarButtonSystemItemAdd),
    @"flexible-space": @(UIBarButtonSystemItemFlexibleSpace),
    @"fixed-space": @(UIBarButtonSystemItemFixedSpace),
    @"compose": @(UIBarButtonSystemItemCompose),
    @"reply": @(UIBarButtonSystemItemReply),
    @"action": @(UIBarButtonSystemItemAction),
    @"organize": @(UIBarButtonSystemItemOrganize),
    @"bookmarks": @(UIBarButtonSystemItemBookmarks),
    @"search": @(UIBarButtonSystemItemSearch),
    @"refresh": @(UIBarButtonSystemItemRefresh),
    @"stop": @(UIBarButtonSystemItemStop),
    @"camera": @(UIBarButtonSystemItemCamera),
    @"trash": @(UIBarButtonSystemItemTrash),
    @"play": @(UIBarButtonSystemItemPlay),
    @"pause": @(UIBarButtonSystemItemPause),
    @"rewind": @(UIBarButtonSystemItemRewind),
    @"fast-forward": @(UIBarButtonSystemItemFastForward),
    @"undo": @(UIBarButtonSystemItemUndo),
    @"redo": @(UIBarButtonSystemItemRedo)
}), NSNotFound, integerValue);

@end

@implementation NVBarButtonManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVBarButtonView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(title, NSString)
RCT_EXPORT_VIEW_PROPERTY(image, UIImage)
RCT_EXPORT_VIEW_PROPERTY(systemItem, UIBarButtonSystemItem)
RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)

@end
