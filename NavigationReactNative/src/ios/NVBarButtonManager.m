#import "NVBarButtonManager.h"
#import "NVBarButtonView.h"

#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@implementation RCTConvert (UIBarButtonSystemItem)

RCT_ENUM_CONVERTER(UIBarButtonSystemItem, (@{
    @"done" : @(UIBarButtonSystemItemDone),
    @"cancel" : @(UIBarButtonSystemItemCancel),
    @"edit" : @(UIBarButtonSystemItemEdit),
    @"save" : @(UIBarButtonSystemItemSave),
    @"add" : @(UIBarButtonSystemItemAdd),
    @"compose" : @(UIBarButtonSystemItemCompose),
    @"reply" : @(UIBarButtonSystemItemReply),
    @"action" : @(UIBarButtonSystemItemAction),
    @"organize" : @(UIBarButtonSystemItemOrganize),
    @"bookmarks" : @(UIBarButtonSystemItemBookmarks),
    @"search" : @(UIBarButtonSystemItemSearch),
    @"refresh" : @(UIBarButtonSystemItemRefresh),
    @"stop" : @(UIBarButtonSystemItemStop),
    @"camera" : @(UIBarButtonSystemItemCamera),
    @"trash" : @(UIBarButtonSystemItemTrash),
    @"play" : @(UIBarButtonSystemItemPlay),
    @"pause" : @(UIBarButtonSystemItemPause),
    @"rewind" : @(UIBarButtonSystemItemRewind),
    @"fastForward" : @(UIBarButtonSystemItemFastForward),
    @"undo" : @(UIBarButtonSystemItemUndo),
    @"redo" : @(UIBarButtonSystemItemRedo)
}), UIBarButtonSystemItemDone, integerValue)

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
