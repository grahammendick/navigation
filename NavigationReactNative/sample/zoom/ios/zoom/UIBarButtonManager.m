@implementation UIBarButtonManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [[UIBarButtonHostView alloc] init];
}

@end