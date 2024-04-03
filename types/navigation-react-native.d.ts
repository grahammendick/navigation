import { Component, Context, ReactNode, ReactElement } from 'react';
import { BackHandler, ImageRequireSource, ImageURISource, NativeSyntheticEvent, StyleProp, ViewStyle, TransformsStyle, ColorValue } from 'react-native';
import { Crumb, State, StateContext } from 'navigation';

declare global {
    interface Location {}
}

type TranslateAnimation = {
    type: 'translate',
    duration?: number,
    fromX?: number | string,
    toX?: number | string,
    startX?: number | string,
    fromY?: number | string,
    toY?: number | string,
    startY?: number | string,
};

type ScaleAnimation = {
    type: 'scale',
    duration?: number,
    fromX?: number | string,
    toX?: number | string,
    startX?: number | string,
    fromY?: number | string,
    toY?: number | string,
    startY?: number | string,
    pivotX?: number | string,
    pivotY?: number | string
};

type AlphaAnimation = {
    type: 'alpha',
    duration?: number,
    from?: number,
    to?: number,
    start?: number,
};

type RotateAnimation = {
    type: 'rotate',
    duration?: number,
    from?: number,
    to?: number,
    start?: number,
    pivotX?: number | string,
    pivotY?: number | string
};

type Animation = TranslateAnimation | ScaleAnimation | AlphaAnimation | RotateAnimation;

type Transition = { type: 'sharedAxis', axis?: 'x' | 'y' | 'z' } | { type: 'elevationScale' | 'fade' | 'fadeThrough' | 'hold' } | Animation | Animation[] | { duration?: number, items: Animation[] };

type SFSymbols = 
"square.and.arrow.up" |
"square.and.arrow.up.fill" |
"square.and.arrow.up.circle" |
"square.and.arrow.up.circle.fill" |
"square.and.arrow.up.badge.clock" |
"square.and.arrow.up.badge.clock.fill" |
"square.and.arrow.up.trianglebadge.exclamationmark" |
"square.and.arrow.down" |
"square.and.arrow.down.fill" |
"square.and.arrow.up.on.square" |
"square.and.arrow.up.on.square.fill" |
"square.and.arrow.down.on.square" |
"square.and.arrow.down.on.square.fill" |
"rectangle.portrait.and.arrow.right" |
"rectangle.portrait.and.arrow.right.fill" |
"rectangle.portrait.and.arrow.forward" |
"rectangle.portrait.and.arrow.forward.fill" |
"pencil" |
"pencil.circle" |
"pencil.circle.fill" |
"pencil.slash" |
"pencil.line" |
"eraser" |
"eraser.fill" |
"eraser.line.dashed" |
"eraser.line.dashed.fill" |
"square.and.pencil" |
"square.and.pencil.circle" |
"square.and.pencil.circle.fill" |
"rectangle.and.pencil.and.ellipsis" |
"scribble" |
"scribble.variable" |
"pencil.and.scribble" |
"highlighter" |
"pencil.and.outline" |
"pencil.tip" |
"pencil.tip.crop.circle" |
"pencil.tip.crop.circle.fill" |
"pencil.tip.crop.circle.badge.plus" |
"pencil.tip.crop.circle.badge.plus.fill" |
"pencil.tip.crop.circle.badge.minus" |
"pencil.tip.crop.circle.badge.minus.fill" |
"pencil.tip.crop.circle.badge.arrow.forward" |
"pencil.tip.crop.circle.badge.arrow.forward.fill" |
"lasso" |
"lasso.badge.sparkles" |
"trash" |
"trash.fill" |
"trash.circle" |
"trash.circle.fill" |
"trash.square" |
"trash.square.fill" |
"trash.slash" |
"trash.slash.fill" |
"trash.slash.circle" |
"trash.slash.circle.fill" |
"trash.slash.square" |
"trash.slash.square.fill" |
"arrow.up.trash" |
"arrow.up.trash.fill" |
"folder" |
"folder.fill" |
"folder.circle" |
"folder.circle.fill" |
"folder.badge.plus" |
"folder.fill.badge.plus" |
"folder.badge.minus" |
"folder.fill.badge.minus" |
"folder.badge.questionmark" |
"folder.fill.badge.questionmark" |
"folder.badge.person.crop" |
"folder.fill.badge.person.crop" |
"square.grid.3x1.folder.badge.plus" |
"square.grid.3x1.folder.fill.badge.plus" |
"folder.badge.gearshape" |
"folder.fill.badge.gearshape" |
"plus.rectangle.on.folder" |
"plus.rectangle.on.folder.fill" |
"questionmark.folder" |
"questionmark.folder.fill" |
"paperplane" |
"paperplane.fill" |
"paperplane.circle" |
"paperplane.circle.fill" |
"tray" |
"tray.fill" |
"tray.circle" |
"tray.circle.fill" |
"tray.full" |
"tray.full.fill" |
"tray.and.arrow.up" |
"tray.and.arrow.up.fill" |
"tray.and.arrow.down" |
"tray.and.arrow.down.fill" |
"tray.2" |
"tray.2.fill" |
"externaldrive" |
"externaldrive.fill" |
"externaldrive.badge.plus" |
"externaldrive.fill.badge.plus" |
"externaldrive.badge.minus" |
"externaldrive.fill.badge.minus" |
"externaldrive.badge.checkmark" |
"externaldrive.fill.badge.checkmark" |
"externaldrive.badge.xmark" |
"externaldrive.fill.badge.xmark" |
"externaldrive.badge.questionmark" |
"externaldrive.fill.badge.questionmark" |
"externaldrive.badge.exclamationmark" |
"externaldrive.fill.badge.exclamationmark" |
"externaldrive.badge.person.crop" |
"externaldrive.fill.badge.person.crop" |
"externaldrive.badge.wifi" |
"externaldrive.fill.badge.wifi" |
"externaldrive.badge.icloud" |
"externaldrive.fill.badge.icloud" |
"externaldrive.trianglebadge.exclamationmark" |
"externaldrive.fill.trianglebadge.exclamationmark" |
"externaldrive.badge.timemachine" |
"externaldrive.fill.badge.timemachine" |
"internaldrive" |
"internaldrive.fill" |
"opticaldiscdrive" |
"opticaldiscdrive.fill" |
"externaldrive.connected.to.line.below" |
"externaldrive.connected.to.line.below.fill" |
"archivebox" |
"archivebox.fill" |
"archivebox.circle" |
"archivebox.circle.fill" |
"xmark.bin" |
"xmark.bin.fill" |
"xmark.bin.circle" |
"xmark.bin.circle.fill" |
"arrow.up.bin" |
"arrow.up.bin.fill" |
"doc" |
"doc.fill" |
"doc.circle" |
"doc.circle.fill" |
"doc.badge.plus" |
"doc.fill.badge.plus" |
"doc.badge.arrow.up" |
"doc.badge.arrow.up.fill" |
"doc.badge.ellipsis" |
"doc.fill.badge.ellipsis" |
"doc.badge.clock" |
"doc.badge.clock.fill" |
"doc.badge.gearshape" |
"doc.badge.gearshape.fill" |
"lock.doc" |
"lock.doc.fill" |
"arrow.up.doc" |
"arrow.up.doc.fill" |
"arrow.down.doc" |
"arrow.down.doc.fill" |
"doc.text" |
"doc.text.fill" |
"doc.zipper" |
"doc.on.doc" |
"doc.on.doc.fill" |
"doc.on.clipboard" |
"doc.on.clipboard.fill" |
"arrow.right.doc.on.clipboard" |
"arrow.up.doc.on.clipboard" |
"arrow.triangle.2.circlepath.doc.on.clipboard" |
"clipboard" |
"clipboard.fill" |
"list.bullet.clipboard" |
"list.bullet.clipboard.fill" |
"list.clipboard" |
"list.clipboard.fill" |
"pencil.and.list.clipboard" |
"doc.richtext" |
"doc.richtext.fill" |
"doc.plaintext" |
"doc.plaintext.fill" |
"doc.append" |
"doc.append.fill" |
"doc.text.below.ecg" |
"doc.text.below.ecg.fill" |
"doc.questionmark" |
"doc.questionmark.fill" |
"chart.bar.doc.horizontal" |
"chart.bar.doc.horizontal.fill" |
"book.pages" |
"book.pages.fill" |
"list.bullet.rectangle.portrait" |
"list.bullet.rectangle.portrait.fill" |
"doc.text.magnifyingglass" |
"list.bullet.rectangle" |
"list.bullet.rectangle.fill" |
"list.dash.header.rectangle" |
"apple.terminal" |
"apple.terminal.fill" |
"apple.terminal.on.rectangle" |
"apple.terminal.on.rectangle.fill" |
"note" |
"note.text" |
"note.text.badge.plus" |
"calendar" |
"calendar.circle" |
"calendar.circle.fill" |
"calendar.badge.plus" |
"calendar.badge.minus" |
"calendar.badge.clock" |
"calendar.badge.exclamationmark" |
"calendar.badge.checkmark" |
"calendar.day.timeline.left" |
"calendar.day.timeline.right" |
"calendar.day.timeline.leading" |
"calendar.day.timeline.trailing" |
"arrowshape.left" |
"arrowshape.left.fill" |
"arrowshape.left.circle" |
"arrowshape.left.circle.fill" |
"arrowshape.backward" |
"arrowshape.backward.fill" |
"arrowshape.backward.circle" |
"arrowshape.backward.circle.fill" |
"arrowshape.right" |
"arrowshape.right.fill" |
"arrowshape.right.circle" |
"arrowshape.right.circle.fill" |
"arrowshape.forward" |
"arrowshape.forward.fill" |
"arrowshape.forward.circle" |
"arrowshape.forward.circle.fill" |
"arrowshape.up" |
"arrowshape.up.fill" |
"arrowshape.up.circle" |
"arrowshape.up.circle.fill" |
"arrowshape.down" |
"arrowshape.down.fill" |
"arrowshape.down.circle" |
"arrowshape.down.circle.fill" |
"arrowshape.left.arrowshape.right" |
"arrowshape.left.arrowshape.right.fill" |
"arrowshape.turn.up.left" |
"arrowshape.turn.up.left.fill" |
"arrowshape.turn.up.left.circle" |
"arrowshape.turn.up.left.circle.fill" |
"arrowshape.turn.up.backward" |
"arrowshape.turn.up.backward.fill" |
"arrowshape.turn.up.backward.circle" |
"arrowshape.turn.up.backward.circle.fill" |
"arrowshape.turn.up.backward.badge.clock" |
"arrowshape.turn.up.backward.badge.clock.fill" |
"arrowshape.turn.up.right" |
"arrowshape.turn.up.right.fill" |
"arrowshape.turn.up.right.circle" |
"arrowshape.turn.up.right.circle.fill" |
"arrowshape.turn.up.forward" |
"arrowshape.turn.up.forward.fill" |
"arrowshape.turn.up.forward.circle" |
"arrowshape.turn.up.forward.circle.fill" |
"arrowshape.turn.up.left.2" |
"arrowshape.turn.up.left.2.fill" |
"arrowshape.turn.up.left.2.circle" |
"arrowshape.turn.up.left.2.circle.fill" |
"arrowshape.turn.up.backward.2" |
"arrowshape.turn.up.backward.2.fill" |
"arrowshape.turn.up.backward.2.circle" |
"arrowshape.turn.up.backward.2.circle.fill" |
"arrowshape.zigzag.right" |
"arrowshape.zigzag.right.fill" |
"arrowshape.zigzag.forward" |
"arrowshape.zigzag.forward.fill" |
"arrowshape.bounce.right" |
"arrowshape.bounce.right.fill" |
"arrowshape.bounce.forward" |
"arrowshape.bounce.forward.fill" |
"book" |
"book.fill" |
"book.circle" |
"book.circle.fill" |
"books.vertical" |
"books.vertical.fill" |
"books.vertical.circle" |
"books.vertical.circle.fill" |
"book.closed" |
"book.closed.fill" |
"book.closed.circle" |
"book.closed.circle.fill" |
"character.book.closed" |
"character.book.closed.fill" |
"text.book.closed" |
"text.book.closed.fill" |
"menucard" |
"menucard.fill" |
"greetingcard" |
"greetingcard.fill" |
"magazine" |
"magazine.fill" |
"newspaper" |
"newspaper.fill" |
"newspaper.circle" |
"newspaper.circle.fill" |
"doc.text.image" |
"doc.text.image.fill" |
"bookmark" |
"bookmark.fill" |
"bookmark.circle" |
"bookmark.circle.fill" |
"bookmark.square" |
"bookmark.square.fill" |
"bookmark.slash" |
"bookmark.slash.fill" |
"graduationcap" |
"graduationcap.fill" |
"graduationcap.circle" |
"graduationcap.circle.fill" |
"pencil.and.ruler" |
"pencil.and.ruler.fill" |
"ruler" |
"ruler.fill" |
"backpack" |
"backpack.fill" |
"backpack.circle" |
"backpack.circle.fill" |
"studentdesk" |
"paperclip" |
"paperclip.circle" |
"paperclip.circle.fill" |
"paperclip.badge.ellipsis" |
"rectangle.and.paperclip" |
"rectangle.dashed.and.paperclip" |
"link" |
"link.circle" |
"link.circle.fill" |
"link.badge.plus" |
"personalhotspot" |
"personalhotspot.circle" |
"personalhotspot.circle.fill" |
"person" |
"person.fill" |
"person.circle" |
"person.circle.fill" |
"person.slash" |
"person.slash.fill" |
"person.fill.turn.right" |
"person.fill.turn.down" |
"person.fill.turn.left" |
"person.fill.checkmark" |
"person.fill.xmark" |
"person.fill.questionmark" |
"person.badge.plus" |
"person.fill.badge.plus" |
"person.badge.minus" |
"person.fill.badge.minus" |
"person.badge.clock" |
"person.badge.clock.fill" |
"person.badge.shield.checkmark" |
"person.badge.shield.checkmark.fill" |
"person.badge.key" |
"person.badge.key.fill" |
"person.2.badge.key" |
"person.2.badge.key.fill" |
"shareplay" |
"shareplay.slash" |
"rectangle.inset.filled.and.person.filled" |
"rectangle.inset.filled.badge.record" |
"rectangle.inset.filled.and.cursorarrow" |
"shared.with.you" |
"shared.with.you.circle" |
"shared.with.you.circle.fill" |
"shared.with.you.slash" |
"person.and.arrow.left.and.arrow.right" |
"person.fill.and.arrow.left.and.arrow.right" |
"person.2" |
"person.2.fill" |
"person.2.circle" |
"person.2.circle.fill" |
"person.2.slash" |
"person.2.slash.fill" |
"person.2.gobackward" |
"person.2.badge.gearshape" |
"person.2.badge.gearshape.fill" |
"person.wave.2" |
"person.wave.2.fill" |
"person.2.wave.2" |
"person.2.wave.2.fill" |
"person.line.dotted.person" |
"person.line.dotted.person.fill" |
"person.3" |
"person.3.fill" |
"person.3.sequence" |
"person.3.sequence.fill" |
"lanyardcard" |
"lanyardcard.fill" |
"person.crop.circle" |
"person.crop.circle.fill" |
"person.crop.circle.badge.plus" |
"person.crop.circle.fill.badge.plus" |
"person.crop.circle.badge.minus" |
"person.crop.circle.fill.badge.minus" |
"person.crop.circle.badge.checkmark" |
"person.crop.circle.fill.badge.checkmark" |
"person.crop.circle.badge.xmark" |
"person.crop.circle.fill.badge.xmark" |
"person.crop.circle.badge.questionmark" |
"person.crop.circle.badge.questionmark.fill" |
"person.crop.circle.badge.exclamationmark" |
"person.crop.circle.badge.exclamationmark.fill" |
"person.crop.circle.badge.moon" |
"person.crop.circle.badge.moon.fill" |
"person.crop.circle.badge.clock" |
"person.crop.circle.badge.clock.fill" |
"person.crop.circle.badge" |
"person.crop.circle.badge.fill" |
"person.crop.circle.dashed" |
"person.crop.circle.dashed.circle" |
"person.crop.circle.dashed.circle.fill" |
"person.crop.square" |
"person.crop.square.fill" |
"person.crop.square.badge.camera" |
"person.crop.square.badge.camera.fill" |
"person.crop.square.badge.video" |
"person.crop.square.badge.video.fill" |
"person.crop.artframe" |
"photo.artframe" |
"photo.artframe.circle" |
"photo.artframe.circle.fill" |
"person.bust" |
"person.bust.fill" |
"person.bust.circle" |
"person.bust.circle.fill" |
"person.crop.rectangle.stack" |
"person.crop.rectangle.stack.fill" |
"person.2.crop.square.stack" |
"person.2.crop.square.stack.fill" |
"person.crop.rectangle" |
"person.crop.rectangle.fill" |
"person.crop.rectangle.badge.plus" |
"person.crop.rectangle.badge.plus.fill" |
"arrow.up.and.person.rectangle.portrait" |
"arrow.up.and.person.rectangle.turn.right" |
"arrow.up.and.person.rectangle.turn.left" |
"person.crop.square.filled.and.at.rectangle" |
"person.crop.square.filled.and.at.rectangle.fill" |
"square.and.at.rectangle" |
"square.and.at.rectangle.fill" |
"person.text.rectangle" |
"person.text.rectangle.fill" |
"rectangle.checkered" |
"person.and.background.dotted" |
"person.and.background.striped.horizontal" |
"figure.stand" |
"figure.stand.line.dotted.figure.stand" |
"figure.dress.line.vertical.figure" |
"figure.arms.open" |
"figure.2.arms.open" |
"figure.2.and.child.holdinghands" |
"figure.and.child.holdinghands" |
"figure" |
"accessibility" |
"accessibility.fill" |
"voiceover" |
"accessibility.badge.arrow.up.right" |
"figure.2" |
"figure.2.circle" |
"figure.2.circle.fill" |
"figure.walk" |
"figure.walk.circle" |
"figure.walk.circle.fill" |
"figure.walk.diamond" |
"figure.walk.diamond.fill" |
"figure.walk.arrival" |
"figure.walk.departure" |
"figure.walk.motion" |
"figure.walk.motion.trianglebadge.exclamationmark" |
"figure.wave" |
"figure.wave.circle" |
"figure.wave.circle.fill" |
"figure.fall" |
"figure.fall.circle" |
"figure.fall.circle.fill" |
"figure.run" |
"figure.run.circle" |
"figure.run.circle.fill" |
"figure.run.square.stack" |
"figure.run.square.stack.fill" |
"figure.roll" |
"figure.roll.runningpace" |
"figure.american.football" |
"figure.archery" |
"figure.australian.football" |
"figure.badminton" |
"figure.barre" |
"figure.baseball" |
"figure.basketball" |
"figure.bowling" |
"figure.boxing" |
"figure.climbing" |
"figure.cooldown" |
"figure.core.training" |
"figure.cricket" |
"figure.skiing.crosscountry" |
"figure.cross.training" |
"figure.curling" |
"figure.dance" |
"figure.disc.sports" |
"figure.skiing.downhill" |
"figure.elliptical" |
"figure.equestrian.sports" |
"figure.fencing" |
"figure.fishing" |
"figure.flexibility" |
"figure.strengthtraining.functional" |
"figure.golf" |
"figure.gymnastics" |
"figure.hand.cycling" |
"figure.handball" |
"figure.highintensity.intervaltraining" |
"figure.hiking" |
"figure.hockey" |
"figure.hunting" |
"figure.indoor.cycle" |
"figure.jumprope" |
"figure.kickboxing" |
"figure.lacrosse" |
"figure.martial.arts" |
"figure.mind.and.body" |
"figure.mixed.cardio" |
"figure.open.water.swim" |
"figure.outdoor.cycle" |
"oar.2.crossed" |
"figure.pickleball" |
"figure.pilates" |
"figure.play" |
"figure.pool.swim" |
"figure.racquetball" |
"figure.rolling" |
"figure.rower" |
"figure.rugby" |
"figure.sailing" |
"figure.skating" |
"figure.snowboarding" |
"figure.soccer" |
"figure.socialdance" |
"figure.softball" |
"figure.squash" |
"figure.stair.stepper" |
"figure.stairs" |
"figure.step.training" |
"figure.surfing" |
"figure.table.tennis" |
"figure.taichi" |
"figure.tennis" |
"figure.track.and.field" |
"figure.strengthtraining.traditional" |
"figure.volleyball" |
"figure.water.fitness" |
"figure.waterpolo" |
"figure.wrestling" |
"figure.yoga" |
"baseball.diamond.bases" |
"dumbbell" |
"dumbbell.fill" |
"sportscourt" |
"sportscourt.fill" |
"sportscourt.circle" |
"sportscourt.circle.fill" |
"lane" |
"1.lane" |
"2.lane" |
"3.lane" |
"4.lane" |
"5.lane" |
"6.lane" |
"7.lane" |
"8.lane" |
"9.lane" |
"10.lane" |
"11.lane" |
"12.lane" |
"soccerball" |
"soccerball.inverse" |
"soccerball.circle" |
"soccerball.circle.inverse" |
"soccerball.circle.fill" |
"soccerball.circle.fill.inverse" |
"baseball" |
"baseball.fill" |
"baseball.circle" |
"baseball.circle.fill" |
"basketball" |
"basketball.fill" |
"basketball.circle" |
"basketball.circle.fill" |
"football" |
"football.fill" |
"football.circle" |
"football.circle.fill" |
"tennis.racket" |
"tennis.racket.circle" |
"tennis.racket.circle.fill" |
"hockey.puck" |
"hockey.puck.fill" |
"hockey.puck.circle" |
"hockey.puck.circle.fill" |
"cricket.ball" |
"cricket.ball.fill" |
"cricket.ball.circle" |
"cricket.ball.circle.fill" |
"tennisball" |
"tennisball.fill" |
"tennisball.circle" |
"tennisball.circle.fill" |
"volleyball" |
"volleyball.fill" |
"volleyball.circle" |
"volleyball.circle.fill" |
"skateboard" |
"skateboard.fill" |
"skis" |
"skis.fill" |
"snowboard" |
"snowboard.fill" |
"surfboard" |
"surfboard.fill" |
"gym.bag" |
"gym.bag.fill" |
"rosette" |
"trophy" |
"trophy.fill" |
"trophy.circle" |
"trophy.circle.fill" |
"medal" |
"medal.fill" |
"command" |
"command.circle" |
"command.circle.fill" |
"command.square" |
"command.square.fill" |
"space" |
"option" |
"alt" |
"control" |
"projective" |
"chevron.left.to.line" |
"chevron.right.to.line" |
"chevron.backward.to.line" |
"chevron.forward.to.line" |
"escape" |
"restart" |
"restart.circle" |
"restart.circle.fill" |
"sleep" |
"sleep.circle" |
"sleep.circle.fill" |
"wake" |
"wake.circle" |
"wake.circle.fill" |
"fn" |
"light.min" |
"light.max" |
"power" |
"power.circle" |
"power.circle.fill" |
"power.dotted" |
"togglepower" |
"poweron" |
"poweroff" |
"powersleep" |
"directcurrent" |
"alternatingcurrent" |
"clear" |
"clear.fill" |
"delete.left" |
"delete.left.fill" |
"delete.backward" |
"delete.backward.fill" |
"delete.right" |
"delete.right.fill" |
"delete.forward" |
"delete.forward.fill" |
"shift" |
"shift.fill" |
"capslock" |
"capslock.fill" |
"eject" |
"eject.fill" |
"eject.circle" |
"eject.circle.fill" |
"mount" |
"mount.fill" |
"rays" |
"cursorarrow.rays" |
"slowmo" |
"timelapse" |
"cursorarrow" |
"cursorarrow.square" |
"cursorarrow.square.fill" |
"cursorarrow.slash" |
"cursorarrow.slash.square" |
"cursorarrow.slash.square.fill" |
"cursorarrow.motionlines" |
"cursorarrow.motionlines.click" |
"cursorarrow.click.badge.clock" |
"cursorarrow.and.square.on.square.dashed" |
"rectangle.on.rectangle.badge.gearshape" |
"cursorarrow.click" |
"cursorarrow.click.2" |
"contextualmenu.and.cursorarrow" |
"filemenu.and.cursorarrow" |
"dots.and.line.vertical.and.cursorarrow.rectangle" |
"filemenu.and.selection" |
"dot.circle.and.hand.point.up.left.fill" |
"dot.circle.and.cursorarrow" |
"keyboard" |
"keyboard.fill" |
"keyboard.badge.ellipsis" |
"keyboard.badge.ellipsis.fill" |
"keyboard.badge.eye" |
"keyboard.badge.eye.fill" |
"keyboard.chevron.compact.down" |
"keyboard.chevron.compact.down.fill" |
"keyboard.chevron.compact.left" |
"keyboard.chevron.compact.left.fill" |
"keyboard.onehanded.left" |
"keyboard.onehanded.left.fill" |
"keyboard.onehanded.right" |
"keyboard.onehanded.right.fill" |
"peacesign" |
"globe" |
"globe.badge.chevron.backward" |
"network" |
"network.slash" |
"network.badge.shield.half.filled" |
"globe.americas" |
"globe.americas.fill" |
"globe.europe.africa" |
"globe.europe.africa.fill" |
"globe.asia.australia" |
"globe.asia.australia.fill" |
"globe.central.south.asia" |
"globe.central.south.asia.fill" |
"sun.min" |
"sun.min.fill" |
"sun.max" |
"sun.max.fill" |
"sun.max.circle" |
"sun.max.circle.fill" |
"sun.max.trianglebadge.exclamationmark" |
"sun.max.trianglebadge.exclamationmark.fill" |
"sunrise" |
"sunrise.fill" |
"sunrise.circle" |
"sunrise.circle.fill" |
"sunset" |
"sunset.fill" |
"sunset.circle" |
"sunset.circle.fill" |
"sun.horizon" |
"sun.horizon.fill" |
"sun.horizon.circle" |
"sun.horizon.circle.fill" |
"sun.dust" |
"sun.dust.fill" |
"sun.dust.circle" |
"sun.dust.circle.fill" |
"sun.haze" |
"sun.haze.fill" |
"sun.haze.circle" |
"sun.haze.circle.fill" |
"sun.rain" |
"sun.rain.fill" |
"sun.rain.circle" |
"sun.rain.circle.fill" |
"sun.snow" |
"sun.snow.fill" |
"sun.snow.circle" |
"sun.snow.circle.fill" |
"moonphase.new.moon" |
"moonphase.waxing.crescent" |
"moonphase.first.quarter" |
"moonphase.waxing.gibbous" |
"moonphase.full.moon" |
"moonphase.waning.gibbous" |
"moonphase.last.quarter" |
"moonphase.waning.crescent" |
"moonphase.new.moon.inverse" |
"moonphase.waxing.crescent.inverse" |
"moonphase.first.quarter.inverse" |
"moonphase.waxing.gibbous.inverse" |
"moonphase.full.moon.inverse" |
"moonphase.waning.gibbous.inverse" |
"moonphase.last.quarter.inverse" |
"moonphase.waning.crescent.inverse" |
"zzz" |
"moon" |
"moon.fill" |
"moon.circle" |
"moon.circle.fill" |
"moonrise" |
"moonrise.fill" |
"moonrise.circle" |
"moonrise.circle.fill" |
"moonset" |
"moonset.fill" |
"moonset.circle" |
"moonset.circle.fill" |
"moon.dust" |
"moon.dust.fill" |
"moon.dust.circle" |
"moon.dust.circle.fill" |
"moon.haze" |
"moon.haze.fill" |
"moon.haze.circle" |
"moon.haze.circle.fill" |
"moon.zzz" |
"moon.zzz.fill" |
"sparkle" |
"sparkles" |
"moon.stars" |
"moon.stars.fill" |
"moon.stars.circle" |
"moon.stars.circle.fill" |
"cloud" |
"cloud.fill" |
"cloud.circle" |
"cloud.circle.fill" |
"cloud.drizzle" |
"cloud.drizzle.fill" |
"cloud.drizzle.circle" |
"cloud.drizzle.circle.fill" |
"cloud.rain" |
"cloud.rain.fill" |
"cloud.rain.circle" |
"cloud.rain.circle.fill" |
"cloud.heavyrain" |
"cloud.heavyrain.fill" |
"cloud.heavyrain.circle" |
"cloud.heavyrain.circle.fill" |
"cloud.fog" |
"cloud.fog.fill" |
"cloud.fog.circle" |
"cloud.fog.circle.fill" |
"cloud.hail" |
"cloud.hail.fill" |
"cloud.hail.circle" |
"cloud.hail.circle.fill" |
"cloud.snow" |
"cloud.snow.fill" |
"cloud.snow.circle" |
"cloud.snow.circle.fill" |
"cloud.sleet" |
"cloud.sleet.fill" |
"cloud.sleet.circle" |
"cloud.sleet.circle.fill" |
"cloud.bolt" |
"cloud.bolt.fill" |
"cloud.bolt.circle" |
"cloud.bolt.circle.fill" |
"cloud.bolt.rain" |
"cloud.bolt.rain.fill" |
"cloud.bolt.rain.circle" |
"cloud.bolt.rain.circle.fill" |
"cloud.sun" |
"cloud.sun.fill" |
"cloud.sun.circle" |
"cloud.sun.circle.fill" |
"cloud.sun.rain" |
"cloud.sun.rain.fill" |
"cloud.sun.rain.circle" |
"cloud.sun.rain.circle.fill" |
"cloud.sun.bolt" |
"cloud.sun.bolt.fill" |
"cloud.sun.bolt.circle" |
"cloud.sun.bolt.circle.fill" |
"cloud.moon" |
"cloud.moon.fill" |
"cloud.moon.circle" |
"cloud.moon.circle.fill" |
"cloud.moon.rain" |
"cloud.moon.rain.fill" |
"cloud.moon.rain.circle" |
"cloud.moon.rain.circle.fill" |
"cloud.moon.bolt" |
"cloud.moon.bolt.fill" |
"cloud.moon.bolt.circle" |
"cloud.moon.bolt.circle.fill" |
"smoke" |
"smoke.fill" |
"smoke.circle" |
"smoke.circle.fill" |
"wind" |
"wind.circle" |
"wind.circle.fill" |
"wind.snow" |
"wind.snow.circle" |
"wind.snow.circle.fill" |
"snowflake" |
"snowflake.circle" |
"snowflake.circle.fill" |
"snowflake.slash" |
"tornado" |
"tornado.circle" |
"tornado.circle.fill" |
"tropicalstorm" |
"tropicalstorm.circle" |
"tropicalstorm.circle.fill" |
"hurricane" |
"hurricane.circle" |
"hurricane.circle.fill" |
"thermometer.sun" |
"thermometer.sun.fill" |
"thermometer.sun.circle" |
"thermometer.sun.circle.fill" |
"thermometer.snowflake" |
"thermometer.snowflake.circle" |
"thermometer.snowflake.circle.fill" |
"thermometer.variable.and.figure" |
"thermometer.variable.and.figure.circle" |
"thermometer.variable.and.figure.circle.fill" |
"thermometer.low" |
"thermometer.medium" |
"thermometer.high" |
"thermometer.medium.slash" |
"aqi.low" |
"aqi.medium" |
"aqi.high" |
"humidity" |
"humidity.fill" |
"rainbow" |
"cloud.rainbow.half" |
"cloud.rainbow.half.fill" |
"water.waves" |
"water.waves.slash" |
"water.waves.and.arrow.up" |
"water.waves.and.arrow.down" |
"water.waves.and.arrow.down.trianglebadge.exclamationmark" |
"drop" |
"drop.fill" |
"drop.circle" |
"drop.circle.fill" |
"drop.degreesign" |
"drop.degreesign.fill" |
"drop.degreesign.slash" |
"drop.degreesign.slash.fill" |
"drop.triangle" |
"drop.triangle.fill" |
"flame" |
"flame.fill" |
"flame.circle" |
"flame.circle.fill" |
"beach.umbrella" |
"beach.umbrella.fill" |
"umbrella" |
"umbrella.fill" |
"umbrella.percent" |
"umbrella.percent.fill" |
"play" |
"play.fill" |
"play.circle" |
"play.circle.fill" |
"play.square" |
"play.square.fill" |
"play.rectangle" |
"play.rectangle.fill" |
"play.square.stack" |
"play.square.stack.fill" |
"play.slash" |
"play.slash.fill" |
"pause" |
"pause.fill" |
"pause.circle" |
"pause.circle.fill" |
"pause.rectangle" |
"pause.rectangle.fill" |
"stop" |
"stop.fill" |
"stop.circle" |
"stop.circle.fill" |
"record.circle" |
"record.circle.fill" |
"playpause" |
"playpause.fill" |
"playpause.circle" |
"playpause.circle.fill" |
"backward" |
"backward.fill" |
"backward.circle" |
"backward.circle.fill" |
"forward" |
"forward.fill" |
"forward.circle" |
"forward.circle.fill" |
"backward.end" |
"backward.end.fill" |
"backward.end.circle" |
"backward.end.circle.fill" |
"forward.end" |
"forward.end.fill" |
"forward.end.circle" |
"forward.end.circle.fill" |
"backward.end.alt" |
"backward.end.alt.fill" |
"forward.end.alt" |
"forward.end.alt.fill" |
"backward.frame" |
"backward.frame.fill" |
"forward.frame" |
"forward.frame.fill" |
"memories" |
"memories.badge.plus" |
"memories.badge.minus" |
"shuffle" |
"shuffle.circle" |
"shuffle.circle.fill" |
"repeat" |
"repeat.circle" |
"repeat.circle.fill" |
"repeat.1" |
"repeat.1.circle" |
"repeat.1.circle.fill" |
"infinity" |
"infinity.circle" |
"infinity.circle.fill" |
"sos" |
"sos.circle" |
"sos.circle.fill" |
"megaphone" |
"megaphone.fill" |
"speaker" |
"speaker.fill" |
"speaker.circle" |
"speaker.circle.fill" |
"speaker.square" |
"speaker.square.fill" |
"speaker.plus" |
"speaker.plus.fill" |
"speaker.minus" |
"speaker.minus.fill" |
"speaker.slash" |
"speaker.slash.fill" |
"speaker.slash.circle" |
"speaker.slash.circle.fill" |
"speaker.zzz" |
"speaker.zzz.fill" |
"speaker.wave.1" |
"speaker.wave.1.fill" |
"speaker.wave.2" |
"speaker.wave.2.fill" |
"speaker.wave.2.circle" |
"speaker.wave.2.circle.fill" |
"speaker.wave.3" |
"speaker.wave.3.fill" |
"speaker.badge.exclamationmark" |
"speaker.badge.exclamationmark.fill" |
"badge.plus.radiowaves.right" |
"badge.plus.radiowaves.forward" |
"music.note" |
"music.note.list" |
"music.quarternote.3" |
"music.mic" |
"music.mic.circle" |
"music.mic.circle.fill" |
"arrow.rectanglepath" |
"checkmark.gobackward" |
"goforward" |
"gobackward" |
"goforward.5" |
"gobackward.5" |
"goforward.10" |
"gobackward.10" |
"goforward.15" |
"gobackward.15" |
"goforward.30" |
"gobackward.30" |
"goforward.45" |
"gobackward.45" |
"goforward.60" |
"gobackward.60" |
"goforward.75" |
"gobackward.75" |
"goforward.90" |
"gobackward.90" |
"goforward.plus" |
"gobackward.minus" |
"swift" |
"swiftdata" |
"magnifyingglass" |
"magnifyingglass.circle" |
"magnifyingglass.circle.fill" |
"plus.magnifyingglass" |
"minus.magnifyingglass" |
"exclamationmark.magnifyingglass" |
"1.magnifyingglass" |
"arrow.up.left.and.down.right.magnifyingglass" |
"text.magnifyingglass" |
"sparkle.magnifyingglass" |
"location.magnifyingglass" |
"loupe" |
"mic" |
"mic.fill" |
"mic.circle" |
"mic.circle.fill" |
"mic.square" |
"mic.square.fill" |
"mic.slash" |
"mic.slash.fill" |
"mic.slash.circle" |
"mic.slash.circle.fill" |
"mic.badge.plus" |
"mic.fill.badge.plus" |
"mic.badge.xmark" |
"mic.fill.badge.xmark" |
"mic.and.signal.meter" |
"mic.and.signal.meter.fill" |
"line.diagonal" |
"line.diagonal.arrow" |
"righttriangle" |
"righttriangle.fill" |
"righttriangle.split.diagonal" |
"righttriangle.split.diagonal.fill" |
"drop.halffull" |
"swirl.circle.righthalf.filled" |
"swirl.circle.righthalf.filled.inverse" |
"circle.lefthalf.filled.righthalf.striped.horizontal" |
"circle.lefthalf.filled.righthalf.striped.horizontal.inverse" |
"circle.lefthalf.striped.horizontal" |
"circle.lefthalf.striped.horizontal.inverse" |
"circle.dotted.circle" |
"circle.dotted.circle.fill" |
"circle.bottomrighthalf.checkered" |
"lightspectrum.horizontal" |
"circle" |
"circle.fill" |
"circle.slash" |
"circle.slash.fill" |
"circle.badge.plus" |
"circle.badge.plus.fill" |
"circle.badge.minus" |
"circle.badge.minus.fill" |
"circle.badge.checkmark" |
"circle.badge.checkmark.fill" |
"circle.badge.xmark" |
"circle.badge.xmark.fill" |
"circle.badge.questionmark" |
"circle.badge.questionmark.fill" |
"circle.badge.exclamationmark" |
"circle.badge.exclamationmark.fill" |
"circle.lefthalf.filled" |
"circle.lefthalf.filled.inverse" |
"circle.righthalf.filled" |
"circle.righthalf.filled.inverse" |
"circle.tophalf.filled" |
"circle.tophalf.filled.inverse" |
"circle.bottomhalf.filled" |
"circle.bottomhalf.filled.inverse" |
"circle.inset.filled" |
"smallcircle.filled.circle" |
"smallcircle.filled.circle.fill" |
"smallcircle.circle" |
"smallcircle.circle.fill" |
"target" |
"circle.dotted" |
"circle.dashed" |
"circle.dashed.inset.filled" |
"circlebadge" |
"circlebadge.fill" |
"circlebadge.2" |
"circlebadge.2.fill" |
"circle.grid.2x1" |
"circle.grid.2x1.fill" |
"circle.grid.2x1.left.filled" |
"circle.grid.2x1.right.filled" |
"circle.grid.2x2" |
"circle.grid.2x2.fill" |
"circle.grid.3x3" |
"circle.grid.3x3.fill" |
"circle.grid.3x3.circle" |
"circle.grid.3x3.circle.fill" |
"circle.hexagonpath" |
"circle.hexagonpath.fill" |
"circle.hexagongrid" |
"circle.hexagongrid.fill" |
"circle.hexagongrid.circle" |
"circle.hexagongrid.circle.fill" |
"placeholdertext.fill" |
"square" |
"square.fill" |
"square.slash" |
"square.slash.fill" |
"square.lefthalf.filled" |
"square.righthalf.filled" |
"square.tophalf.filled" |
"square.bottomhalf.filled" |
"square.inset.filled" |
"square.split.2x1" |
"square.split.2x1.fill" |
"square.split.1x2" |
"square.split.1x2.fill" |
"square.split.2x2" |
"square.split.2x2.fill" |
"square.split.diagonal.2x2" |
"square.split.diagonal.2x2.fill" |
"square.split.diagonal" |
"square.split.diagonal.fill" |
"square.topthird.inset.filled" |
"square.bottomthird.inset.filled" |
"square.leftthird.inset.filled" |
"square.rightthird.inset.filled" |
"square.leadingthird.inset.filled" |
"square.trailingthird.inset.filled" |
"square.dotted" |
"square.dashed" |
"square.dashed.inset.filled" |
"plus.square.dashed" |
"questionmark.square.dashed" |
"dot.square" |
"dot.square.fill" |
"circle.square" |
"circle.square.fill" |
"square.on.square" |
"square.fill.on.square.fill" |
"square.on.square.badge.person.crop" |
"square.on.square.badge.person.crop.fill" |
"square.filled.on.square" |
"hand.raised.square.on.square" |
"hand.raised.square.on.square.fill" |
"star.square.on.square" |
"star.square.on.square.fill" |
"sparkles.square.filled.on.square" |
"square.on.square.dashed" |
"square.on.square.intersection.dashed" |
"plus.square.on.square" |
"plus.square.fill.on.square.fill" |
"square.on.circle" |
"square.fill.on.circle.fill" |
"r.square.on.square" |
"r.square.on.square.fill" |
"j.square.on.square" |
"j.square.on.square.fill" |
"h.square.on.square" |
"h.square.on.square.fill" |
"square.stack" |
"square.stack.fill" |
"square.grid.3x3" |
"square.grid.3x3.fill" |
"square.grid.3x3.topleft.filled" |
"square.grid.3x3.topmiddle.filled" |
"square.grid.3x3.topright.filled" |
"square.grid.3x3.middleleft.filled" |
"square.grid.3x3.middle.filled" |
"square.grid.3x3.middleright.filled" |
"square.grid.3x3.bottomleft.filled" |
"square.grid.3x3.bottommiddle.filled" |
"square.grid.3x3.bottomright.filled" |
"square.grid.3x1.below.line.grid.1x2" |
"square.grid.3x1.below.line.grid.1x2.fill" |
"square.grid.4x3.fill" |
"squareshape" |
"squareshape.fill" |
"dot.squareshape" |
"dot.squareshape.fill" |
"squareshape.dotted.squareshape" |
"squareshape.squareshape.dotted" |
"app" |
"app.fill" |
"plus.app" |
"plus.app.fill" |
"arrow.down.app" |
"arrow.down.app.fill" |
"arrow.up.forward.app" |
"arrow.up.forward.app.fill" |
"xmark.app" |
"xmark.app.fill" |
"questionmark.app" |
"questionmark.app.fill" |
"app.badge" |
"app.badge.fill" |
"app.badge.checkmark" |
"app.badge.checkmark.fill" |
"app.dashed" |
"questionmark.app.dashed" |
"lock.app.dashed" |
"appclip" |
"app.gift" |
"app.gift.fill" |
"rectangle" |
"rectangle.fill" |
"rectangle.slash" |
"rectangle.slash.fill" |
"rectangle.lefthalf.filled" |
"rectangle.righthalf.filled" |
"rectangle.leadinghalf.filled" |
"rectangle.trailinghalf.filled" |
"rectangle.tophalf.filled" |
"rectangle.bottomhalf.filled" |
"rectangle.split.2x1" |
"rectangle.split.2x1.fill" |
"rectangle.split.2x1.slash" |
"rectangle.split.2x1.slash.fill" |
"rectangle.split.1x2" |
"rectangle.split.1x2.fill" |
"rectangle.split.3x1" |
"rectangle.split.3x1.fill" |
"rectangle.split.2x2" |
"rectangle.split.2x2.fill" |
"tablecells" |
"tablecells.fill" |
"tablecells.badge.ellipsis" |
"tablecells.fill.badge.ellipsis" |
"rectangle.split.3x3" |
"rectangle.split.3x3.fill" |
"rectangle.inset.filled" |
"rectangle.tophalf.inset.filled" |
"rectangle.bottomhalf.inset.filled" |
"rectangle.lefthalf.inset.filled" |
"rectangle.righthalf.inset.filled" |
"rectangle.leadinghalf.inset.filled" |
"rectangle.trailinghalf.inset.filled" |
"rectangle.lefthalf.inset.filled.arrow.left" |
"rectangle.righthalf.inset.filled.arrow.right" |
"rectangle.leadinghalf.inset.filled.arrow.leading" |
"rectangle.trailinghalf.inset.filled.arrow.trailing" |
"rectangle.topthird.inset.filled" |
"rectangle.bottomthird.inset.filled" |
"rectangle.leftthird.inset.filled" |
"rectangle.rightthird.inset.filled" |
"rectangle.leadingthird.inset.filled" |
"rectangle.trailingthird.inset.filled" |
"rectangle.center.inset.filled" |
"rectangle.center.inset.filled.badge.plus" |
"rectangle.inset.topleft.filled" |
"rectangle.inset.topright.filled" |
"rectangle.inset.topleading.filled" |
"rectangle.inset.toptrailing.filled" |
"rectangle.inset.bottomleft.filled" |
"rectangle.inset.bottomright.filled" |
"rectangle.inset.bottomleading.filled" |
"rectangle.inset.bottomtrailing.filled" |
"appwindow.swipe.rectangle" |
"arrow.down.left.topright.rectangle" |
"arrow.down.left.topright.rectangle.fill" |
"arrow.down.backward.toptrailing.rectangle" |
"arrow.down.backward.toptrailing.rectangle.fill" |
"arrow.up.left.bottomright.rectangle" |
"arrow.up.left.bottomright.rectangle.fill" |
"arrow.up.backward.bottomtrailing.rectangle" |
"arrow.up.backward.bottomtrailing.rectangle.fill" |
"arrow.up.right.bottomleft.rectangle" |
"arrow.up.right.bottomleft.rectangle.fill" |
"arrow.up.forward.bottomleading.rectangle" |
"arrow.up.forward.bottomleading.rectangle.fill" |
"arrow.down.right.topleft.rectangle" |
"arrow.down.right.topleft.rectangle.fill" |
"arrow.down.forward.topleading.rectangle" |
"arrow.down.forward.topleading.rectangle.fill" |
"rectangle.on.rectangle" |
"rectangle.fill.on.rectangle.fill" |
"rectangle.on.rectangle.circle" |
"rectangle.on.rectangle.circle.fill" |
"rectangle.on.rectangle.square" |
"rectangle.on.rectangle.square.fill" |
"rectangle.inset.filled.on.rectangle" |
"rectangle.on.rectangle.slash" |
"rectangle.on.rectangle.slash.fill" |
"rectangle.on.rectangle.slash.circle" |
"rectangle.on.rectangle.slash.circle.fill" |
"play.rectangle.on.rectangle" |
"play.rectangle.on.rectangle.fill" |
"play.rectangle.on.rectangle.circle" |
"play.rectangle.on.rectangle.circle.fill" |
"plus.rectangle.on.rectangle" |
"plus.rectangle.fill.on.rectangle.fill" |
"rectangle.3.group" |
"rectangle.3.group.fill" |
"square.grid.2x2" |
"square.grid.2x2.fill" |
"rectangle.grid.2x2" |
"rectangle.grid.2x2.fill" |
"square.grid.3x2" |
"square.grid.3x2.fill" |
"rectangle.grid.3x2" |
"rectangle.grid.3x2.fill" |
"rectangle.grid.1x2" |
"rectangle.grid.1x2.fill" |
"rectangle.portrait" |
"rectangle.portrait.fill" |
"rectangle.portrait.slash" |
"rectangle.portrait.slash.fill" |
"rectangle.portrait.lefthalf.filled" |
"rectangle.portrait.righthalf.filled" |
"rectangle.portrait.tophalf.filled" |
"rectangle.portrait.bottomhalf.filled" |
"rectangle.portrait.inset.filled" |
"rectangle.portrait.tophalf.inset.filled" |
"rectangle.portrait.bottomhalf.inset.filled" |
"rectangle.portrait.lefthalf.inset.filled" |
"rectangle.portrait.righthalf.inset.filled" |
"rectangle.portrait.leadinghalf.inset.filled" |
"rectangle.portrait.trailinghalf.inset.filled" |
"rectangle.portrait.topthird.inset.filled" |
"rectangle.portrait.bottomthird.inset.filled" |
"rectangle.portrait.leftthird.inset.filled" |
"rectangle.portrait.rightthird.inset.filled" |
"rectangle.portrait.leadingthird.inset.filled" |
"rectangle.portrait.trailingthird.inset.filled" |
"rectangle.portrait.center.inset.filled" |
"rectangle.portrait.topleft.inset.filled" |
"rectangle.portrait.topright.inset.filled" |
"rectangle.portrait.topleading.inset.filled" |
"rectangle.portrait.toptrailing.inset.filled" |
"rectangle.portrait.bottomleft.inset.filled" |
"rectangle.portrait.bottomright.inset.filled" |
"rectangle.portrait.bottomleading.inset.filled" |
"rectangle.portrait.bottomtrailing.inset.filled" |
"rectangle.portrait.on.rectangle.portrait" |
"rectangle.portrait.on.rectangle.portrait.fill" |
"rectangle.portrait.on.rectangle.portrait.slash" |
"rectangle.portrait.on.rectangle.portrait.slash.fill" |
"rectangle.portrait.on.rectangle.portrait.angled" |
"rectangle.portrait.on.rectangle.portrait.angled.fill" |
"rectangle.portrait.split.2x1" |
"rectangle.portrait.split.2x1.fill" |
"rectangle.portrait.split.2x1.slash" |
"rectangle.portrait.split.2x1.slash.fill" |
"capsule" |
"capsule.fill" |
"capsule.lefthalf.filled" |
"capsule.righthalf.filled" |
"capsule.tophalf.filled" |
"capsule.bottomhalf.filled" |
"capsule.inset.filled" |
"capsule.portrait" |
"capsule.portrait.fill" |
"capsule.portrait.lefthalf.filled" |
"capsule.portrait.righthalf.filled" |
"capsule.portrait.tophalf.filled" |
"capsule.portrait.bottomhalf.filled" |
"capsule.portrait.inset.filled" |
"oval" |
"oval.fill" |
"oval.lefthalf.filled" |
"oval.righthalf.filled" |
"oval.tophalf.filled" |
"oval.bottomhalf.filled" |
"oval.inset.filled" |
"oval.portrait" |
"oval.portrait.fill" |
"oval.portrait.lefthalf.filled" |
"oval.portrait.righthalf.filled" |
"oval.portrait.tophalf.filled" |
"oval.portrait.bottomhalf.filled" |
"oval.portrait.inset.filled" |
"triangle" |
"triangle.fill" |
"triangle.lefthalf.filled" |
"triangle.righthalf.filled" |
"triangle.tophalf.filled" |
"triangle.bottomhalf.filled" |
"triangle.inset.filled" |
"exclamationmark.triangle" |
"exclamationmark.triangle.fill" |
"triangleshape" |
"triangleshape.fill" |
"diamond" |
"diamond.fill" |
"diamond.circle" |
"diamond.circle.fill" |
"diamond.lefthalf.filled" |
"diamond.righthalf.filled" |
"diamond.tophalf.filled" |
"diamond.bottomhalf.filled" |
"diamond.inset.filled" |
"octagon" |
"octagon.fill" |
"octagon.lefthalf.filled" |
"octagon.righthalf.filled" |
"octagon.tophalf.filled" |
"octagon.bottomhalf.filled" |
"hexagon" |
"hexagon.fill" |
"hexagon.lefthalf.filled" |
"hexagon.righthalf.filled" |
"hexagon.tophalf.filled" |
"hexagon.bottomhalf.filled" |
"pentagon" |
"pentagon.fill" |
"pentagon.lefthalf.filled" |
"pentagon.righthalf.filled" |
"pentagon.tophalf.filled" |
"pentagon.bottomhalf.filled" |
"seal" |
"seal.fill" |
"checkmark.seal" |
"checkmark.seal.fill" |
"xmark.seal" |
"xmark.seal.fill" |
"heart" |
"heart.fill" |
"heart.circle" |
"heart.circle.fill" |
"heart.square" |
"heart.square.fill" |
"heart.rectangle" |
"heart.rectangle.fill" |
"heart.slash" |
"heart.slash.fill" |
"heart.slash.circle" |
"heart.slash.circle.fill" |
"bolt.heart" |
"bolt.heart.fill" |
"arrow.up.heart" |
"arrow.up.heart.fill" |
"arrow.down.heart" |
"arrow.down.heart.fill" |
"arrow.clockwise.heart" |
"arrow.clockwise.heart.fill" |
"fleuron" |
"fleuron.fill" |
"suit.heart" |
"suit.heart.fill" |
"suit.club" |
"suit.club.fill" |
"suit.diamond" |
"suit.diamond.fill" |
"suit.spade" |
"suit.spade.fill" |
"star" |
"star.fill" |
"star.leadinghalf.filled" |
"star.slash" |
"star.slash.fill" |
"star.circle" |
"star.circle.fill" |
"star.square" |
"star.square.fill" |
"line.horizontal.star.fill.line.horizontal" |
"rhombus" |
"rhombus.fill" |
"shield" |
"shield.fill" |
"shield.lefthalf.filled" |
"shield.lefthalf.filled.badge.checkmark" |
"shield.lefthalf.filled.trianglebadge.exclamationmark" |
"shield.righthalf.filled" |
"shield.slash" |
"shield.slash.fill" |
"shield.lefthalf.filled.slash" |
"shield.checkered" |
"staroflife.shield" |
"staroflife.shield.fill" |
"firewall" |
"firewall.fill" |
"flag" |
"flag.fill" |
"flag.circle" |
"flag.circle.fill" |
"flag.square" |
"flag.square.fill" |
"flag.slash" |
"flag.slash.fill" |
"flag.slash.circle" |
"flag.slash.circle.fill" |
"flag.badge.ellipsis" |
"flag.badge.ellipsis.fill" |
"flag.checkered" |
"flag.checkered.circle" |
"flag.checkered.circle.fill" |
"flag.2.crossed" |
"flag.2.crossed.fill" |
"flag.2.crossed.circle" |
"flag.2.crossed.circle.fill" |
"flag.filled.and.flag.crossed" |
"flag.and.flag.filled.crossed" |
"flag.checkered.2.crossed" |
"location" |
"location.fill" |
"location.circle" |
"location.circle.fill" |
"location.square" |
"location.square.fill" |
"location.slash" |
"location.slash.fill" |
"location.slash.circle" |
"location.slash.circle.fill" |
"location.north" |
"location.north.fill" |
"location.north.circle" |
"location.north.circle.fill" |
"location.north.line" |
"location.north.line.fill" |
"bell" |
"bell.fill" |
"bell.circle" |
"bell.circle.fill" |
"bell.square" |
"bell.square.fill" |
"bell.slash" |
"bell.slash.fill" |
"bell.slash.circle" |
"bell.slash.circle.fill" |
"bell.badge.waveform" |
"bell.badge.waveform.fill" |
"bell.badge" |
"bell.badge.fill" |
"bell.badge.circle" |
"bell.badge.circle.fill" |
"bell.badge.slash" |
"bell.badge.slash.fill" |
"bell.and.waves.left.and.right" |
"bell.and.waves.left.and.right.fill" |
"tag" |
"tag.fill" |
"tag.circle" |
"tag.circle.fill" |
"tag.square" |
"tag.square.fill" |
"tag.slash" |
"tag.slash.fill" |
"bolt" |
"bolt.fill" |
"bolt.circle" |
"bolt.circle.fill" |
"bolt.square" |
"bolt.square.fill" |
"bolt.shield" |
"bolt.shield.fill" |
"bolt.slash" |
"bolt.slash.fill" |
"bolt.slash.circle" |
"bolt.slash.circle.fill" |
"bolt.badge.clock" |
"bolt.badge.clock.fill" |
"bolt.badge.automatic" |
"bolt.badge.automatic.fill" |
"bolt.badge.checkmark" |
"bolt.badge.checkmark.fill" |
"bolt.badge.xmark" |
"bolt.badge.xmark.fill" |
"bolt.trianglebadge.exclamationmark" |
"bolt.trianglebadge.exclamationmark.fill" |
"bolt.ring.closed" |
"bolt.horizontal" |
"bolt.horizontal.fill" |
"bolt.horizontal.circle" |
"bolt.horizontal.circle.fill" |
"icloud" |
"icloud.fill" |
"icloud.circle" |
"icloud.circle.fill" |
"icloud.square" |
"icloud.square.fill" |
"icloud.slash" |
"icloud.slash.fill" |
"exclamationmark.icloud" |
"exclamationmark.icloud.fill" |
"checkmark.icloud" |
"checkmark.icloud.fill" |
"xmark.icloud" |
"xmark.icloud.fill" |
"link.icloud" |
"link.icloud.fill" |
"bolt.horizontal.icloud" |
"bolt.horizontal.icloud.fill" |
"person.icloud" |
"person.icloud.fill" |
"lock.icloud" |
"lock.icloud.fill" |
"key.icloud" |
"key.icloud.fill" |
"arrow.clockwise.icloud" |
"arrow.clockwise.icloud.fill" |
"arrow.counterclockwise.icloud" |
"arrow.counterclockwise.icloud.fill" |
"arrow.triangle.2.circlepath.icloud" |
"arrow.triangle.2.circlepath.icloud.fill" |
"icloud.and.arrow.down" |
"icloud.and.arrow.down.fill" |
"icloud.and.arrow.up" |
"icloud.and.arrow.up.fill" |
"x.squareroot" |
"flashlight.off.fill" |
"flashlight.off.circle" |
"flashlight.off.circle.fill" |
"flashlight.on.fill" |
"flashlight.on.circle" |
"flashlight.on.circle.fill" |
"flashlight.slash" |
"flashlight.slash.circle" |
"flashlight.slash.circle.fill" |
"camera" |
"camera.fill" |
"camera.circle" |
"camera.circle.fill" |
"camera.shutter.button" |
"camera.shutter.button.fill" |
"camera.badge.clock" |
"camera.badge.clock.fill" |
"camera.badge.ellipsis" |
"camera.badge.ellipsis.fill" |
"arrow.triangle.2.circlepath.camera" |
"arrow.triangle.2.circlepath.camera.fill" |
"camera.on.rectangle" |
"camera.on.rectangle.fill" |
"message" |
"message.fill" |
"message.circle" |
"message.circle.fill" |
"message.badge" |
"message.badge.filled.fill" |
"message.badge.circle" |
"message.badge.circle.fill" |
"message.badge.fill" |
"message.badge.waveform" |
"message.badge.waveform.fill" |
"checkmark.message" |
"checkmark.message.fill" |
"arrow.up.message" |
"arrow.up.message.fill" |
"arrow.down.message" |
"arrow.down.message.fill" |
"plus.message" |
"plus.message.fill" |
"ellipsis.message" |
"ellipsis.message.fill" |
"bubble" |
"bubble.fill" |
"bubble.circle" |
"bubble.circle.fill" |
"bubble.right" |
"bubble.right.fill" |
"bubble.right.circle" |
"bubble.right.circle.fill" |
"bubble.left" |
"bubble.left.fill" |
"bubble.left.circle" |
"bubble.left.circle.fill" |
"exclamationmark.bubble" |
"exclamationmark.bubble.fill" |
"exclamationmark.bubble.circle" |
"exclamationmark.bubble.circle.fill" |
"quote.opening" |
"quote.closing" |
"quote.bubble" |
"quote.bubble.fill" |
"star.bubble" |
"star.bubble.fill" |
"character.bubble" |
"character.bubble.fill" |
"text.bubble" |
"text.bubble.fill" |
"captions.bubble" |
"captions.bubble.fill" |
"info.bubble" |
"info.bubble.fill" |
"questionmark.bubble" |
"questionmark.bubble.fill" |
"plus.bubble" |
"plus.bubble.fill" |
"checkmark.bubble" |
"checkmark.bubble.fill" |
"rectangle.3.group.bubble" |
"rectangle.3.group.bubble.fill" |
"ellipsis.bubble" |
"ellipsis.bubble.fill" |
"ellipsis.vertical.bubble" |
"ellipsis.vertical.bubble.fill" |
"phone.bubble" |
"phone.bubble.fill" |
"video.bubble" |
"video.bubble.fill" |
"speaker.wave.2.bubble" |
"speaker.wave.2.bubble.fill" |
"person.bubble" |
"person.bubble.fill" |
"bubble.middle.bottom" |
"bubble.middle.bottom.fill" |
"bubble.middle.top" |
"bubble.middle.top.fill" |
"bubble.left.and.bubble.right" |
"bubble.left.and.bubble.right.fill" |
"bubble.left.and.exclamationmark.bubble.right" |
"bubble.left.and.exclamationmark.bubble.right.fill" |
"bubble.left.and.text.bubble.right" |
"bubble.left.and.text.bubble.right.fill" |
"phone" |
"phone.fill" |
"phone.circle" |
"phone.circle.fill" |
"phone.badge.plus" |
"phone.fill.badge.plus" |
"phone.badge.checkmark" |
"phone.fill.badge.checkmark" |
"phone.connection" |
"phone.connection.fill" |
"phone.badge.waveform" |
"phone.badge.waveform.fill" |
"phone.arrow.up.right" |
"phone.arrow.up.right.fill" |
"phone.arrow.up.right.circle" |
"phone.arrow.up.right.circle.fill" |
"phone.arrow.down.left" |
"phone.arrow.down.left.fill" |
"phone.arrow.right" |
"phone.arrow.right.fill" |
"phone.down" |
"phone.down.fill" |
"phone.down.circle" |
"phone.down.circle.fill" |
"phone.down.waves.left.and.right" |
"teletype" |
"teletype.circle" |
"teletype.circle.fill" |
"teletype.answer" |
"teletype.answer.circle" |
"teletype.answer.circle.fill" |
"video" |
"video.fill" |
"video.circle" |
"video.circle.fill" |
"video.square" |
"video.square.fill" |
"video.slash" |
"video.slash.fill" |
"video.slash.circle" |
"video.slash.circle.fill" |
"video.badge.plus" |
"video.fill.badge.plus" |
"video.badge.checkmark" |
"video.fill.badge.checkmark" |
"video.badge.ellipsis" |
"video.fill.badge.ellipsis" |
"video.badge.waveform" |
"video.badge.waveform.fill" |
"arrow.up.right.video" |
"arrow.up.right.video.fill" |
"arrow.down.left.video" |
"arrow.down.left.video.fill" |
"questionmark.video" |
"questionmark.video.fill" |
"deskview" |
"deskview.fill" |
"field.of.view.ultrawide" |
"field.of.view.ultrawide.fill" |
"field.of.view.wide" |
"field.of.view.wide.fill" |
"envelope" |
"envelope.fill" |
"envelope.circle" |
"envelope.circle.fill" |
"envelope.arrow.triangle.branch" |
"envelope.arrow.triangle.branch.fill" |
"envelope.open" |
"envelope.open.fill" |
"envelope.open.badge.clock" |
"envelope.badge" |
"envelope.badge.fill" |
"envelope.badge.person.crop" |
"envelope.badge.person.crop.fill" |
"envelope.badge.shield.half.filled" |
"envelope.badge.shield.half.filled.fill" |
"mail.stack" |
"mail.stack.fill" |
"mail" |
"mail.fill" |
"mail.and.text.magnifyingglass" |
"rectangle.and.text.magnifyingglass" |
"arrow.up.right.and.arrow.down.left.rectangle" |
"arrow.up.right.and.arrow.down.left.rectangle.fill" |
"gear" |
"gear.circle" |
"gear.circle.fill" |
"gear.badge.checkmark" |
"gear.badge.xmark" |
"gear.badge.questionmark" |
"gear.badge" |
"gearshape" |
"gearshape.fill" |
"gearshape.circle" |
"gearshape.circle.fill" |
"gearshape.2" |
"gearshape.2.fill" |
"signature" |
"line.3.crossed.swirl.circle" |
"line.3.crossed.swirl.circle.fill" |
"scissors" |
"scissors.circle" |
"scissors.circle.fill" |
"scissors.badge.ellipsis" |
"ellipsis" |
"ellipsis.circle" |
"ellipsis.circle.fill" |
"ellipsis.rectangle" |
"ellipsis.rectangle.fill" |
"bag" |
"bag.fill" |
"bag.circle" |
"bag.circle.fill" |
"bag.badge.plus" |
"bag.fill.badge.plus" |
"bag.badge.minus" |
"bag.fill.badge.minus" |
"bag.badge.questionmark" |
"bag.fill.badge.questionmark" |
"cart" |
"cart.fill" |
"cart.circle" |
"cart.circle.fill" |
"cart.badge.plus" |
"cart.fill.badge.plus" |
"cart.badge.minus" |
"cart.fill.badge.minus" |
"cart.badge.questionmark" |
"cart.fill.badge.questionmark" |
"basket" |
"basket.fill" |
"creditcard" |
"creditcard.fill" |
"creditcard.circle" |
"creditcard.circle.fill" |
"creditcard.and.123" |
"creditcard.trianglebadge.exclamationmark" |
"creditcard.trianglebadge.exclamationmark.fill" |
"giftcard" |
"giftcard.fill" |
"wallet.pass" |
"wallet.pass.fill" |
"wand.and.rays" |
"wand.and.rays.inverse" |
"wand.and.stars" |
"wand.and.stars.inverse" |
"crop" |
"crop.rotate" |
"rectangle.portrait.rotate" |
"rectangle.landscape.rotate" |
"dial.low" |
"dial.low.fill" |
"dial.medium" |
"dial.medium.fill" |
"dial.high" |
"dial.high.fill" |
"gyroscope" |
"nosign" |
"nosign.app" |
"nosign.app.fill" |
"gauge.with.dots.needle.bottom.0percent" |
"gauge.with.dots.needle.bottom.50percent" |
"gauge.with.dots.needle.bottom.50percent.badge.plus" |
"gauge.with.dots.needle.bottom.50percent.badge.minus" |
"gauge.with.dots.needle.bottom.100percent" |
"gauge.with.dots.needle.0percent" |
"gauge.with.dots.needle.33percent" |
"gauge.with.dots.needle.50percent" |
"gauge.with.dots.needle.67percent" |
"gauge.with.dots.needle.100percent" |
"barometer" |
"metronome" |
"metronome.fill" |
"amplifier" |
"dice" |
"dice.fill" |
"die.face.1" |
"die.face.1.fill" |
"die.face.2" |
"die.face.2.fill" |
"die.face.3" |
"die.face.3.fill" |
"die.face.4" |
"die.face.4.fill" |
"die.face.5" |
"die.face.5.fill" |
"die.face.6" |
"die.face.6.fill" |
"square.grid.3x3.square" |
"pianokeys" |
"pianokeys.inverse" |
"tuningfork" |
"paintbrush" |
"paintbrush.fill" |
"paintbrush.pointed" |
"paintbrush.pointed.fill" |
"level" |
"level.fill" |
"lines.measurement.horizontal" |
"lines.measurement.vertical" |
"wrench.adjustable" |
"wrench.adjustable.fill" |
"hammer" |
"hammer.fill" |
"hammer.circle" |
"hammer.circle.fill" |
"screwdriver" |
"screwdriver.fill" |
"eyedropper" |
"eyedropper.halffull" |
"eyedropper.full" |
"wrench.and.screwdriver" |
"wrench.and.screwdriver.fill" |
"applescript" |
"applescript.fill" |
"scroll" |
"scroll.fill" |
"stethoscope" |
"stethoscope.circle" |
"stethoscope.circle.fill" |
"printer" |
"printer.fill" |
"printer.filled.and.paper" |
"printer.dotmatrix" |
"printer.dotmatrix.fill" |
"printer.dotmatrix.filled.and.paper" |
"scanner" |
"scanner.fill" |
"faxmachine" |
"faxmachine.fill" |
"handbag" |
"handbag.fill" |
"handbag.circle" |
"handbag.circle.fill" |
"briefcase" |
"briefcase.fill" |
"briefcase.circle" |
"briefcase.circle.fill" |
"case" |
"case.fill" |
"latch.2.case" |
"latch.2.case.fill" |
"cross.case" |
"cross.case.fill" |
"cross.case.circle" |
"cross.case.circle.fill" |
"suitcase" |
"suitcase.fill" |
"suitcase.cart" |
"suitcase.cart.fill" |
"suitcase.rolling" |
"suitcase.rolling.fill" |
"theatermasks" |
"theatermasks.fill" |
"theatermasks.circle" |
"theatermasks.circle.fill" |
"theatermask.and.paintbrush" |
"theatermask.and.paintbrush.fill" |
"puzzlepiece.extension" |
"puzzlepiece.extension.fill" |
"puzzlepiece" |
"puzzlepiece.fill" |
"homekit" |
"house" |
"house.fill" |
"house.circle" |
"house.circle.fill" |
"music.note.house" |
"music.note.house.fill" |
"play.house" |
"play.house.fill" |
"storefront" |
"storefront.fill" |
"storefront.circle" |
"storefront.circle.fill" |
"building.columns" |
"building.columns.fill" |
"building.columns.circle" |
"building.columns.circle.fill" |
"lightbulb" |
"lightbulb.fill" |
"lightbulb.circle" |
"lightbulb.circle.fill" |
"lightbulb.slash" |
"lightbulb.slash.fill" |
"lightbulb.min" |
"lightbulb.min.fill" |
"lightbulb.max" |
"lightbulb.max.fill" |
"lightbulb.min.badge.exclamationmark" |
"lightbulb.min.badge.exclamationmark.fill" |
"lightbulb.2" |
"lightbulb.2.fill" |
"lightbulb.led" |
"lightbulb.led.fill" |
"lightbulb.led.wide" |
"lightbulb.led.wide.fill" |
"fan.oscillation" |
"fan.oscillation.fill" |
"fan" |
"fan.fill" |
"fan.slash" |
"fan.slash.fill" |
"fan.badge.automatic" |
"fan.badge.automatic.fill" |
"fan.desk" |
"fan.desk.fill" |
"fan.floor" |
"fan.floor.fill" |
"fan.ceiling" |
"fan.ceiling.fill" |
"fan.and.light.ceiling" |
"fan.and.light.ceiling.fill" |
"lamp.desk" |
"lamp.desk.fill" |
"lamp.table" |
"lamp.table.fill" |
"lamp.floor" |
"lamp.floor.fill" |
"lamp.ceiling" |
"lamp.ceiling.fill" |
"lamp.ceiling.inverse" |
"light.recessed" |
"light.recessed.fill" |
"light.recessed.inverse" |
"light.recessed.3" |
"light.recessed.3.fill" |
"light.recessed.3.inverse" |
"light.panel" |
"light.panel.fill" |
"light.cylindrical.ceiling" |
"light.cylindrical.ceiling.fill" |
"light.cylindrical.ceiling.inverse" |
"light.strip.2" |
"light.strip.2.fill" |
"light.ribbon" |
"light.ribbon.fill" |
"chandelier" |
"chandelier.fill" |
"lightswitch.on" |
"lightswitch.on.fill" |
"lightswitch.on.square" |
"lightswitch.on.square.fill" |
"lightswitch.off" |
"lightswitch.off.fill" |
"lightswitch.off.square" |
"lightswitch.off.square.fill" |
"button.programmable" |
"button.programmable.square" |
"button.programmable.square.fill" |
"switch.programmable" |
"switch.programmable.fill" |
"switch.programmable.square" |
"switch.programmable.square.fill" |
"poweroutlet.type.a" |
"poweroutlet.type.a.fill" |
"poweroutlet.type.a.square" |
"poweroutlet.type.a.square.fill" |
"poweroutlet.type.b" |
"poweroutlet.type.b.fill" |
"poweroutlet.type.b.square" |
"poweroutlet.type.b.square.fill" |
"poweroutlet.type.c" |
"poweroutlet.type.c.fill" |
"poweroutlet.type.c.square" |
"poweroutlet.type.c.square.fill" |
"poweroutlet.type.d" |
"poweroutlet.type.d.fill" |
"poweroutlet.type.d.square" |
"poweroutlet.type.d.square.fill" |
"poweroutlet.type.e" |
"poweroutlet.type.e.fill" |
"poweroutlet.type.e.square" |
"poweroutlet.type.e.square.fill" |
"poweroutlet.type.f" |
"poweroutlet.type.f.fill" |
"poweroutlet.type.f.square" |
"poweroutlet.type.f.square.fill" |
"poweroutlet.type.g" |
"poweroutlet.type.g.fill" |
"poweroutlet.type.g.square" |
"poweroutlet.type.g.square.fill" |
"poweroutlet.type.h" |
"poweroutlet.type.h.fill" |
"poweroutlet.type.h.square" |
"poweroutlet.type.h.square.fill" |
"poweroutlet.type.i" |
"poweroutlet.type.i.fill" |
"poweroutlet.type.i.square" |
"poweroutlet.type.i.square.fill" |
"poweroutlet.type.j" |
"poweroutlet.type.j.fill" |
"poweroutlet.type.j.square" |
"poweroutlet.type.j.square.fill" |
"poweroutlet.type.k" |
"poweroutlet.type.k.fill" |
"poweroutlet.type.k.square" |
"poweroutlet.type.k.square.fill" |
"poweroutlet.type.l" |
"poweroutlet.type.l.fill" |
"poweroutlet.type.l.square" |
"poweroutlet.type.l.square.fill" |
"poweroutlet.type.m" |
"poweroutlet.type.m.fill" |
"poweroutlet.type.m.square" |
"poweroutlet.type.m.square.fill" |
"poweroutlet.type.n" |
"poweroutlet.type.n.fill" |
"poweroutlet.type.n.square" |
"poweroutlet.type.n.square.fill" |
"poweroutlet.type.o" |
"poweroutlet.type.o.fill" |
"poweroutlet.type.o.square" |
"poweroutlet.type.o.square.fill" |
"poweroutlet.strip" |
"poweroutlet.strip.fill" |
"powerplug" |
"powerplug.fill" |
"powercord" |
"powercord.fill" |
"light.beacon.min" |
"light.beacon.min.fill" |
"light.beacon.max" |
"light.beacon.max.fill" |
"web.camera" |
"web.camera.fill" |
"video.doorbell" |
"video.doorbell.fill" |
"entry.lever.keypad" |
"entry.lever.keypad.fill" |
"entry.lever.keypad.trianglebadge.exclamationmark" |
"entry.lever.keypad.trianglebadge.exclamationmark.fill" |
"door.left.hand.open" |
"door.left.hand.closed" |
"door.right.hand.open" |
"door.right.hand.closed" |
"door.sliding.left.hand.open" |
"door.sliding.left.hand.closed" |
"door.sliding.right.hand.open" |
"door.sliding.right.hand.closed" |
"door.garage.open" |
"door.garage.closed" |
"door.garage.open.trianglebadge.exclamationmark" |
"door.garage.closed.trianglebadge.exclamationmark" |
"door.garage.double.bay.open" |
"door.garage.double.bay.closed" |
"door.garage.double.bay.open.trianglebadge.exclamationmark" |
"door.garage.double.bay.closed.trianglebadge.exclamationmark" |
"door.french.open" |
"door.french.closed" |
"pedestrian.gate.closed" |
"pedestrian.gate.open" |
"window.vertical.open" |
"window.vertical.closed" |
"window.horizontal" |
"window.horizontal.closed" |
"window.ceiling" |
"window.ceiling.closed" |
"window.casement" |
"window.casement.closed" |
"window.awning" |
"window.awning.closed" |
"blinds.vertical.open" |
"blinds.vertical.closed" |
"blinds.horizontal.open" |
"blinds.horizontal.closed" |
"window.shade.open" |
"window.shade.closed" |
"roller.shade.open" |
"roller.shade.closed" |
"roman.shade.open" |
"roman.shade.closed" |
"curtains.open" |
"curtains.closed" |
"air.purifier" |
"air.purifier.fill" |
"dehumidifier" |
"dehumidifier.fill" |
"humidifier" |
"humidifier.fill" |
"humidifier.and.droplets" |
"humidifier.and.droplets.fill" |
"heater.vertical" |
"heater.vertical.fill" |
"air.conditioner.vertical" |
"air.conditioner.vertical.fill" |
"air.conditioner.horizontal" |
"air.conditioner.horizontal.fill" |
"sprinkler" |
"sprinkler.fill" |
"sprinkler.and.droplets" |
"sprinkler.and.droplets.fill" |
"spigot" |
"spigot.fill" |
"drop.keypad.rectangle" |
"drop.keypad.rectangle.fill" |
"shower.sidejet" |
"shower.sidejet.fill" |
"shower" |
"shower.fill" |
"shower.handheld" |
"shower.handheld.fill" |
"bathtub" |
"bathtub.fill" |
"contact.sensor" |
"contact.sensor.fill" |
"sensor" |
"sensor.fill" |
"carbon.monoxide.cloud" |
"carbon.monoxide.cloud.fill" |
"carbon.dioxide.cloud" |
"carbon.dioxide.cloud.fill" |
"pipe.and.drop" |
"pipe.and.drop.fill" |
"hifireceiver" |
"hifireceiver.fill" |
"videoprojector" |
"videoprojector.fill" |
"wifi.router" |
"wifi.router.fill" |
"party.popper" |
"party.popper.fill" |
"balloon" |
"balloon.fill" |
"balloon.2" |
"balloon.2.fill" |
"laser.burst" |
"fireworks" |
"frying.pan" |
"frying.pan.fill" |
"popcorn" |
"popcorn.fill" |
"popcorn.circle" |
"popcorn.circle.fill" |
"bed.double" |
"bed.double.fill" |
"bed.double.circle" |
"bed.double.circle.fill" |
"sofa" |
"sofa.fill" |
"chair.lounge" |
"chair.lounge.fill" |
"chair" |
"chair.fill" |
"table.furniture" |
"table.furniture.fill" |
"cabinet" |
"cabinet.fill" |
"fireplace" |
"fireplace.fill" |
"washer" |
"washer.fill" |
"washer.circle" |
"washer.circle.fill" |
"dryer" |
"dryer.fill" |
"dryer.circle" |
"dryer.circle.fill" |
"dishwasher" |
"dishwasher.fill" |
"dishwasher.circle" |
"dishwasher.circle.fill" |
"oven" |
"oven.fill" |
"stove" |
"stove.fill" |
"cooktop" |
"cooktop.fill" |
"microwave" |
"microwave.fill" |
"refrigerator" |
"refrigerator.fill" |
"sink" |
"sink.fill" |
"toilet" |
"toilet.fill" |
"toilet.circle" |
"toilet.circle.fill" |
"stairs" |
"tent" |
"tent.fill" |
"tent.circle" |
"tent.circle.fill" |
"tent.2" |
"tent.2.fill" |
"tent.2.circle" |
"tent.2.circle.fill" |
"house.lodge" |
"house.lodge.fill" |
"house.lodge.circle" |
"house.lodge.circle.fill" |
"house.and.flag" |
"house.and.flag.fill" |
"house.and.flag.circle" |
"house.and.flag.circle.fill" |
"signpost.left" |
"signpost.left.fill" |
"signpost.left.circle" |
"signpost.left.circle.fill" |
"signpost.right" |
"signpost.right.fill" |
"signpost.right.circle" |
"signpost.right.circle.fill" |
"signpost.right.and.left" |
"signpost.right.and.left.fill" |
"signpost.right.and.left.circle" |
"signpost.right.and.left.circle.fill" |
"signpost.and.arrowtriangle.up" |
"signpost.and.arrowtriangle.up.fill" |
"signpost.and.arrowtriangle.up.circle" |
"signpost.and.arrowtriangle.up.circle.fill" |
"mountain.2" |
"mountain.2.fill" |
"mountain.2.circle" |
"mountain.2.circle.fill" |
"square.split.bottomrightquarter" |
"square.split.bottomrightquarter.fill" |
"building" |
"building.fill" |
"building.2" |
"building.2.fill" |
"building.2.crop.circle" |
"building.2.crop.circle.fill" |
"lock" |
"lock.fill" |
"lock.circle" |
"lock.circle.fill" |
"lock.square" |
"lock.square.fill" |
"lock.circle.dotted" |
"lock.square.stack" |
"lock.square.stack.fill" |
"lock.rectangle" |
"lock.rectangle.fill" |
"lock.rectangle.stack" |
"lock.rectangle.stack.fill" |
"lock.rectangle.on.rectangle" |
"lock.rectangle.on.rectangle.fill" |
"lock.shield" |
"lock.shield.fill" |
"lock.slash" |
"lock.slash.fill" |
"lock.trianglebadge.exclamationmark" |
"lock.trianglebadge.exclamationmark.fill" |
"exclamationmark.lock" |
"exclamationmark.lock.fill" |
"lock.badge.clock" |
"lock.badge.clock.fill" |
"lock.open" |
"lock.open.fill" |
"lock.open.trianglebadge.exclamationmark" |
"lock.open.trianglebadge.exclamationmark.fill" |
"lock.rotation" |
"lock.open.rotation" |
"key" |
"key.fill" |
"key.slash" |
"key.slash.fill" |
"key.radiowaves.forward" |
"key.radiowaves.forward.fill" |
"key.radiowaves.forward.slash" |
"key.radiowaves.forward.slash.fill" |
"key.horizontal" |
"key.horizontal.fill" |
"questionmark.key.filled" |
"wifi" |
"wifi.circle" |
"wifi.circle.fill" |
"wifi.square" |
"wifi.square.fill" |
"wifi.slash" |
"wifi.exclamationmark" |
"wifi.exclamationmark.circle" |
"wifi.exclamationmark.circle.fill" |
"pin" |
"pin.fill" |
"pin.circle" |
"pin.circle.fill" |
"pin.square" |
"pin.square.fill" |
"pin.slash" |
"pin.slash.fill" |
"mappin" |
"mappin.circle" |
"mappin.circle.fill" |
"mappin.square" |
"mappin.square.fill" |
"mappin.slash" |
"mappin.slash.circle" |
"mappin.slash.circle.fill" |
"mappin.and.ellipse" |
"mappin.and.ellipse.circle" |
"mappin.and.ellipse.circle.fill" |
"map" |
"map.fill" |
"map.circle" |
"map.circle.fill" |
"safari" |
"safari.fill" |
"move.3d" |
"scale.3d" |
"rotate.3d" |
"rotate.3d.fill" |
"rotate.3d.circle" |
"rotate.3d.circle.fill" |
"torus" |
"rotate.left" |
"rotate.left.fill" |
"rotate.right" |
"rotate.right.fill" |
"selection.pin.in.out" |
"faceid" |
"cpu" |
"cpu.fill" |
"memorychip" |
"memorychip.fill" |
"opticaldisc" |
"opticaldisc.fill" |
"sensor.tag.radiowaves.forward" |
"sensor.tag.radiowaves.forward.fill" |
"airtag.radiowaves.forward" |
"airtag.radiowaves.forward.fill" |
"airtag" |
"airtag.fill" |
"display" |
"play.display" |
"lock.display" |
"lock.open.display" |
"display.and.arrow.down" |
"dot.scope.display" |
"display.trianglebadge.exclamationmark" |
"display.2" |
"desktopcomputer" |
"play.desktopcomputer" |
"lock.desktopcomputer" |
"lock.open.desktopcomputer" |
"desktopcomputer.and.arrow.down" |
"desktopcomputer.trianglebadge.exclamationmark" |
"pc" |
"macpro.gen1" |
"macpro.gen1.fill" |
"macpro.gen2" |
"macpro.gen2.fill" |
"macpro.gen3" |
"macpro.gen3.fill" |
"macpro.gen3.server" |
"server.rack" |
"xserve" |
"xserve.raid" |
"laptopcomputer" |
"laptopcomputer.slash" |
"play.laptopcomputer" |
"lock.laptopcomputer" |
"lock.open.laptopcomputer" |
"laptopcomputer.and.arrow.down" |
"laptopcomputer.trianglebadge.exclamationmark" |
"dot.scope.laptopcomputer" |
"macbook.gen1" |
"macbook.gen2" |
"macbook" |
"macbook.and.iphone" |
"macbook.and.ipad" |
"macmini" |
"macmini.fill" |
"macstudio" |
"macstudio.fill" |
"airport.express" |
"airport.extreme" |
"airport.extreme.tower" |
"ipod" |
"ipodshuffle.gen1" |
"ipodshuffle.gen2" |
"ipodshuffle.gen3" |
"ipodshuffle.gen4" |
"ipodtouch" |
"ipodtouch.slash" |
"ipodtouch.landscape" |
"flipphone" |
"candybarphone" |
"iphone.gen1" |
"iphone.gen1.circle" |
"iphone.gen1.circle.fill" |
"iphone.gen1.landscape" |
"iphone.gen1.radiowaves.left.and.right" |
"iphone.gen1.radiowaves.left.and.right.circle" |
"iphone.gen1.radiowaves.left.and.right.circle.fill" |
"iphone.gen1.slash" |
"iphone.gen1.slash.circle" |
"iphone.gen1.slash.circle.fill" |
"iphone.gen1.badge.play" |
"iphone.gen2" |
"iphone.gen2.circle" |
"iphone.gen2.circle.fill" |
"iphone.gen2.landscape" |
"iphone.gen2.radiowaves.left.and.right" |
"iphone.gen2.radiowaves.left.and.right.circle" |
"iphone.gen2.radiowaves.left.and.right.circle.fill" |
"iphone.gen2.slash" |
"iphone.gen2.slash.circle" |
"iphone.gen2.slash.circle.fill" |
"iphone.gen2.badge.play" |
"iphone.gen3" |
"iphone.gen3.circle" |
"iphone.gen3.circle.fill" |
"iphone.gen3.landscape" |
"iphone.gen3.radiowaves.left.and.right" |
"iphone.gen3.radiowaves.left.and.right.circle" |
"iphone.gen3.radiowaves.left.and.right.circle.fill" |
"iphone.gen3.slash" |
"iphone.gen3.slash.circle" |
"iphone.gen3.slash.circle.fill" |
"iphone.gen3.badge.play" |
"iphone" |
"iphone.circle" |
"iphone.circle.fill" |
"iphone.landscape" |
"iphone.radiowaves.left.and.right" |
"iphone.radiowaves.left.and.right.circle" |
"iphone.radiowaves.left.and.right.circle.fill" |
"iphone.slash" |
"iphone.slash.circle" |
"iphone.slash.circle.fill" |
"iphone.badge.play" |
"iphone.and.arrow.left.and.arrow.right" |
"lock.iphone" |
"lock.open.iphone" |
"iphone.and.arrow.forward" |
"arrow.turn.up.forward.iphone" |
"arrow.turn.up.forward.iphone.fill" |
"iphone.rear.camera" |
"apps.iphone" |
"apps.iphone.badge.plus" |
"apps.iphone.landscape" |
"platter.filled.top.iphone" |
"platter.filled.bottom.iphone" |
"platter.filled.top.and.arrow.up.iphone" |
"platter.filled.bottom.and.arrow.down.iphone" |
"platter.2.filled.iphone" |
"platter.2.filled.iphone.landscape" |
"circle.filled.iphone" |
"circle.filled.iphone.fill" |
"iphone.smartbatterycase.gen2" |
"iphone.smartbatterycase.gen1" |
"ipad.gen1" |
"ipad.gen1.badge.play" |
"ipad.gen1.landscape" |
"ipad.gen1.landscape.badge.play" |
"ipad.gen2" |
"ipad.gen2.badge.play" |
"ipad.gen2.landscape" |
"ipad.gen2.landscape.badge.play" |
"ipad" |
"ipad.badge.play" |
"ipad.landscape" |
"ipad.landscape.badge.play" |
"ipad.and.iphone" |
"ipad.and.iphone.slash" |
"lock.ipad" |
"lock.open.ipad" |
"ipad.and.arrow.forward" |
"ipad.rear.camera" |
"apps.ipad" |
"apps.ipad.landscape" |
"circle.filled.ipad" |
"circle.filled.ipad.fill" |
"circle.filled.ipad.landscape" |
"circle.filled.ipad.landscape.fill" |
"platter.2.filled.ipad" |
"platter.2.filled.ipad.landscape" |
"iphone.case" |
"ipad.case" |
"ipad.case.and.iphone.case" |
"iphone.sizes" |
"ipad.sizes" |
"smartphone" |
"visionpro" |
"visionpro.fill" |
"visionpro.circle" |
"visionpro.circle.fill" |
"visionpro.slash" |
"visionpro.slash.fill" |
"visionpro.slash.circle" |
"visionpro.slash.circle.fill" |
"visionpro.badge.exclamationmark" |
"visionpro.badge.exclamationmark.fill" |
"visionpro.badge.play" |
"visionpro.badge.play.fill" |
"visionpro.and.arrow.forward" |
"visionpro.and.arrow.forward.fill" |
"macbook.and.visionpro" |
"head.profile.arrow.forward.and.visionpro" |
"opticid" |
"opticid.fill" |
"pano.badge.play" |
"pano.badge.play.fill" |
"viewfinder.rectangular" |
"applepencil.gen1" |
"applepencil.gen2" |
"applepencil" |
"applepencil.and.scribble" |
"applepencil.tip" |
"applepencil.adapter.usb.c" |
"applepencil.adapter.usb.c.fill" |
"magicmouse" |
"magicmouse.fill" |
"computermouse" |
"computermouse.fill" |
"watch.analog" |
"applewatch" |
"applewatch.watchface" |
"exclamationmark.applewatch" |
"lock.applewatch" |
"lock.open.applewatch" |
"checkmark.applewatch" |
"arrow.down.applewatch" |
"applewatch.and.arrow.forward" |
"applewatch.radiowaves.left.and.right" |
"applewatch.slash" |
"applewatch.side.right" |
"watchface.applewatch.case" |
"applewatch.case.inset.filled" |
"platter.filled.top.applewatch.case" |
"platter.filled.bottom.applewatch.case" |
"platter.top.applewatch.case" |
"platter.bottom.applewatch.case" |
"arrow.up.and.down.and.sparkles" |
"digitalcrown.arrow.clockwise" |
"digitalcrown.arrow.clockwise.fill" |
"digitalcrown.arrow.counterclockwise" |
"digitalcrown.arrow.counterclockwise.fill" |
"digitalcrown.press" |
"digitalcrown.press.fill" |
"digitalcrown.horizontal.arrow.clockwise" |
"digitalcrown.horizontal.arrow.clockwise.fill" |
"digitalcrown.horizontal.arrow.counterclockwise" |
"digitalcrown.horizontal.arrow.counterclockwise.fill" |
"digitalcrown.horizontal.press" |
"digitalcrown.horizontal.press.fill" |
"button.vertical.right.press" |
"button.vertical.right.press.fill" |
"button.vertical.left.press" |
"button.vertical.left.press.fill" |
"button.horizontal.top.press" |
"button.horizontal.top.press.fill" |
"airpodsmax" |
"beats.headphones" |
"headphones" |
"headphones.circle" |
"headphones.circle.fill" |
"earbuds" |
"earbuds.case" |
"earbuds.case.fill" |
"earpods" |
"airpods" |
"airpod.right" |
"airpod.left" |
"airpods.chargingcase" |
"airpods.chargingcase.fill" |
"airpods.chargingcase.wireless" |
"airpods.chargingcase.wireless.fill" |
"airpodspro" |
"airpodpro.right" |
"airpodpro.left" |
"airpodspro.chargingcase.wireless" |
"airpodspro.chargingcase.wireless.fill" |
"airpodspro.chargingcase.wireless.radiowaves.left.and.right" |
"airpodspro.chargingcase.wireless.radiowaves.left.and.right.fill" |
"airpods.gen3" |
"airpod.gen3.right" |
"airpod.gen3.left" |
"airpods.gen3.chargingcase.wireless" |
"airpods.gen3.chargingcase.wireless.fill" |
"beats.earphones" |
"beats.powerbeatspro" |
"beats.powerbeatspro.right" |
"beats.powerbeatspro.left" |
"beats.powerbeatspro.chargingcase" |
"beats.powerbeatspro.chargingcase.fill" |
"beats.powerbeats" |
"beats.powerbeats.right" |
"beats.powerbeats.left" |
"beats.powerbeats3" |
"beats.powerbeats3.right" |
"beats.powerbeats3.left" |
"beats.studiobuds" |
"beats.studiobud.left" |
"beats.studiobud.right" |
"beats.studiobuds.chargingcase" |
"beats.studiobuds.chargingcase.fill" |
"beats.studiobudsplus" |
"beats.studiobudsplus.left" |
"beats.studiobudsplus.right" |
"beats.studiobudsplus.chargingcase" |
"beats.studiobudsplus.chargingcase.fill" |
"beats.fitpro" |
"beats.fitpro.left" |
"beats.fitpro.right" |
"beats.fitpro.chargingcase" |
"beats.fitpro.chargingcase.fill" |
"homepodmini" |
"homepodmini.fill" |
"homepodmini.2" |
"homepodmini.2.fill" |
"homepod.and.homepodmini" |
"homepod.and.homepodmini.fill" |
"hifispeaker.and.homepodmini" |
"hifispeaker.and.homepodmini.fill" |
"homepod" |
"homepod.fill" |
"homepod.2" |
"homepod.2.fill" |
"hifispeaker.and.homepod" |
"hifispeaker.and.homepod.fill" |
"hifispeaker" |
"hifispeaker.fill" |
"hifispeaker.2" |
"hifispeaker.2.fill" |
"appletv" |
"appletv.fill" |
"homepod.and.appletv" |
"homepod.and.appletv.fill" |
"homepodmini.and.appletv" |
"homepodmini.and.appletv.fill" |
"hifispeaker.and.appletv" |
"hifispeaker.and.appletv.fill" |
"appletvremote.gen1" |
"appletvremote.gen1.fill" |
"appletvremote.gen2" |
"appletvremote.gen2.fill" |
"appletvremote.gen3" |
"appletvremote.gen3.fill" |
"appletvremote.gen4" |
"appletvremote.gen4.fill" |
"av.remote" |
"av.remote.fill" |
"magsafe.batterypack" |
"magsafe.batterypack.fill" |
"mediastick" |
"cable.connector" |
"cable.connector.slash" |
"cable.connector.horizontal" |
"cable.coaxial" |
"tv" |
"tv.fill" |
"tv.slash" |
"tv.slash.fill" |
"tv.inset.filled" |
"tv.circle" |
"tv.circle.fill" |
"sparkles.tv" |
"sparkles.tv.fill" |
"4k.tv" |
"4k.tv.fill" |
"music.note.tv" |
"music.note.tv.fill" |
"play.tv" |
"play.tv.fill" |
"photo.tv" |
"tv.badge.wifi" |
"tv.badge.wifi.fill" |
"tv.and.hifispeaker.fill" |
"tv.and.mediabox" |
"tv.and.mediabox.fill" |
"airplayvideo" |
"airplayvideo.circle" |
"airplayvideo.circle.fill" |
"airplayvideo.badge.exclamationmark" |
"airplayaudio" |
"airplayaudio.circle" |
"airplayaudio.circle.fill" |
"airplayaudio.badge.exclamationmark" |
"radio" |
"radio.fill" |
"shazam.logo" |
"shazam.logo.fill" |
"dot.radiowaves.left.and.right" |
"dot.radiowaves.right" |
"dot.radiowaves.forward" |
"wave.3.left" |
"wave.3.left.circle" |
"wave.3.left.circle.fill" |
"wave.3.backward" |
"wave.3.backward.circle" |
"wave.3.backward.circle.fill" |
"wave.3.right" |
"wave.3.right.circle" |
"wave.3.right.circle.fill" |
"wave.3.forward" |
"wave.3.forward.circle" |
"wave.3.forward.circle.fill" |
"dot.radiowaves.up.forward" |
"antenna.radiowaves.left.and.right" |
"antenna.radiowaves.left.and.right.circle" |
"antenna.radiowaves.left.and.right.circle.fill" |
"antenna.radiowaves.left.and.right.slash" |
"pip" |
"pip.fill" |
"pip.exit" |
"pip.enter" |
"pip.swap" |
"pip.remove" |
"timeline.selection" |
"square.arrowtriangle.4.outward" |
"rectangle.arrowtriangle.2.outward" |
"rectangle.arrowtriangle.2.inward" |
"rectangle.portrait.arrowtriangle.2.outward" |
"rectangle.portrait.arrowtriangle.2.inward" |
"rectangle.2.swap" |
"guitars" |
"guitars.fill" |
"airplane" |
"airplane.circle" |
"airplane.circle.fill" |
"airplane.arrival" |
"airplane.departure" |
"car" |
"car.fill" |
"car.circle" |
"car.circle.fill" |
"car.front.waves.up" |
"car.front.waves.up.fill" |
"car.front.waves.down" |
"car.front.waves.down.fill" |
"car.rear" |
"car.rear.fill" |
"car.rear.waves.up" |
"car.rear.waves.up.fill" |
"car.rear.and.tire.marks" |
"car.rear.and.tire.marks.slash" |
"bolt.car" |
"bolt.car.fill" |
"bolt.car.circle" |
"bolt.car.circle.fill" |
"car.2" |
"car.2.fill" |
"bus" |
"bus.fill" |
"bus.doubledecker" |
"bus.doubledecker.fill" |
"tram" |
"tram.fill" |
"tram.circle" |
"tram.circle.fill" |
"tram.fill.tunnel" |
"cablecar" |
"cablecar.fill" |
"lightrail" |
"lightrail.fill" |
"ferry" |
"ferry.fill" |
"car.ferry" |
"car.ferry.fill" |
"sailboat" |
"sailboat.fill" |
"sailboat.circle" |
"sailboat.circle.fill" |
"train.side.front.car" |
"train.side.middle.car" |
"train.side.rear.car" |
"truck.box" |
"truck.box.fill" |
"truck.box.badge.clock" |
"truck.box.badge.clock.fill" |
"bicycle" |
"bicycle.circle" |
"bicycle.circle.fill" |
"scooter" |
"stroller" |
"stroller.fill" |
"parkingsign" |
"parkingsign.circle" |
"parkingsign.circle.fill" |
"parkingsign.radiowaves.left.and.right" |
"parkingsign.radiowaves.right.and.safetycone" |
"fuelpump" |
"fuelpump.fill" |
"fuelpump.circle" |
"fuelpump.circle.fill" |
"fuelpump.slash" |
"fuelpump.slash.fill" |
"fuelpump.exclamationmark" |
"fuelpump.exclamationmark.fill" |
"fuelpump.arrowtriangle.left" |
"fuelpump.arrowtriangle.left.fill" |
"fuelpump.arrowtriangle.right" |
"fuelpump.arrowtriangle.right.fill" |
"ev.charger" |
"ev.charger.fill" |
"ev.charger.slash" |
"ev.charger.slash.fill" |
"ev.charger.exclamationmark" |
"ev.charger.exclamationmark.fill" |
"ev.charger.arrowtriangle.left" |
"ev.charger.arrowtriangle.left.fill" |
"ev.charger.arrowtriangle.right" |
"ev.charger.arrowtriangle.right.fill" |
"engine.combustion" |
"engine.combustion.fill" |
"engine.combustion.badge.exclamationmark" |
"engine.combustion.badge.exclamationmark.fill" |
"headlight.high.beam" |
"headlight.high.beam.fill" |
"automatic.headlight.high.beam" |
"automatic.headlight.high.beam.fill" |
"headlight.low.beam" |
"headlight.low.beam.fill" |
"automatic.headlight.low.beam" |
"automatic.headlight.low.beam.fill" |
"headlight.fog" |
"headlight.fog.fill" |
"taillight.fog" |
"taillight.fog.fill" |
"headlight.daytime" |
"headlight.daytime.fill" |
"parkinglight" |
"parkinglight.fill" |
"warninglight" |
"warninglight.fill" |
"exclamationmark.warninglight" |
"exclamationmark.warninglight.fill" |
"light.overhead.right" |
"light.overhead.right.fill" |
"light.overhead.left" |
"light.overhead.left.fill" |
"glowplug" |
"tirepressure" |
"exclamationmark.tirepressure" |
"traction.control.tirepressure" |
"traction.control.tirepressure.slash" |
"traction.control.tirepressure.exclamationmark" |
"heat.waves" |
"info.windshield" |
"heat.element.windshield" |
"windshield.front.and.wiper" |
"windshield.front.and.spray" |
"windshield.front.and.wiper.and.spray" |
"windshield.front.and.fluid.and.spray" |
"windshield.front.and.wiper.intermittent" |
"windshield.front.and.wiper.and.drop" |
"windshield.front.and.heat.waves" |
"windshield.front.and.wiper.exclamationmark" |
"windshield.rear.and.wiper" |
"windshield.rear.and.spray" |
"windshield.rear.and.wiper.and.spray" |
"windshield.rear.and.fluid.and.spray" |
"windshield.rear.and.wiper.intermittent" |
"windshield.rear.and.wiper.and.drop" |
"windshield.rear.and.heat.waves" |
"windshield.rear.and.wiper.exclamationmark" |
"mirror.side.left" |
"mirror.side.right" |
"mirror.side.left.and.heat.waves" |
"mirror.side.right.and.heat.waves" |
"mirror.side.left.and.arrow.turn.down.right" |
"mirror.side.right.and.arrow.turn.down.left" |
"brakesignal" |
"exclamationmark.brakesignal" |
"1.brakesignal" |
"2.brakesignal" |
"automatic.brakesignal" |
"parkingsign.brakesignal" |
"parkingsign.brakesignal.slash" |
"abs.brakesignal" |
"abs.brakesignal.slash" |
"hold.brakesignal" |
"thermometer.brakesignal" |
"bolt.brakesignal" |
"hand.raised.brakesignal" |
"hand.raised.brakesignal.slash" |
"retarder.brakesignal" |
"retarder.brakesignal.slash" |
"retarder.brakesignal.and.exclamationmark" |
"fluid.brakesignal" |
"brakesignal.dashed" |
"transmission" |
"exclamationmark.transmission" |
"thermometer.transmission" |
"fluid.transmission" |
"drop.transmission" |
"oilcan" |
"oilcan.fill" |
"figure.seated.seatbelt" |
"figure.seated.seatbelt.and.airbag.on" |
"figure.seated.seatbelt.and.airbag.off" |
"figure.seated.side.airbag.on" |
"figure.seated.side.airbag.off" |
"figure.seated.side.airbag.on.2" |
"figure.seated.side.airbag.off.2" |
"figure.seated.side" |
"figure.seated.side.air.distribution.upper" |
"figure.seated.side.air.distribution.lower" |
"figure.seated.side.air.distribution.middle" |
"figure.seated.side.air.distribution.middle.and.lower" |
"figure.seated.side.air.distribution.upper.angled.and.middle.and.lower.angled" |
"figure.seated.side.air.distribution.upper.angled.and.middle" |
"figure.seated.side.air.distribution.upper.angled.and.lower.angled" |
"figure.seated.side.air.distribution.middle.and.lower.angled" |
"figure.seated.side.windshield.front.and.heat.waves" |
"figure.seated.side.windshield.front.and.heat.waves.air.distribution.upper.and.middle.and.lower" |
"figure.seated.side.windshield.front.and.heat.waves.air.distribution.middle.and.lower" |
"figure.seated.side.windshield.front.and.heat.waves.air.distribution.upper.and.middle" |
"figure.seated.side.windshield.front.and.heat.waves.air.distribution.upper.and.lower" |
"figure.seated.side.windshield.front.and.heat.waves.air.distribution.upper" |
"figure.seated.side.windshield.front.and.heat.waves.air.distribution.lower" |
"figure.seated.side.windshield.front.and.heat.waves.air.distribution.middle" |
"figure.seated.side.automatic" |
"figure.child" |
"figure.child.circle" |
"figure.child.circle.fill" |
"figure.child.and.lock" |
"figure.child.and.lock.fill" |
"figure.child.and.lock.open" |
"figure.child.and.lock.open.fill" |
"hazardsign" |
"hazardsign.fill" |
"yieldsign" |
"yieldsign.fill" |
"wrongwaysign" |
"wrongwaysign.fill" |
"thermometer.and.liquid.waves" |
"steeringwheel" |
"steeringwheel.circle" |
"steeringwheel.circle.fill" |
"steeringwheel.slash" |
"steeringwheel.arrowtriangle.left" |
"steeringwheel.arrowtriangle.right" |
"steeringwheel.and.heat.waves" |
"steeringwheel.exclamationmark" |
"steeringwheel.badge.exclamationmark" |
"steeringwheel.and.key" |
"steeringwheel.and.lock" |
"steeringwheel.and.liquid.wave" |
"parkingsign.steeringwheel" |
"carseat.left" |
"carseat.left.fill" |
"carseat.right" |
"carseat.right.fill" |
"carseat.left.and.heat.waves" |
"carseat.left.and.heat.waves.fill" |
"carseat.right.and.heat.waves" |
"carseat.right.and.heat.waves.fill" |
"carseat.left.massage" |
"carseat.left.massage.fill" |
"carseat.right.massage" |
"carseat.right.massage.fill" |
"carseat.left.fan" |
"carseat.left.fan.fill" |
"carseat.right.fan" |
"carseat.right.fan.fill" |
"carseat.left.1" |
"carseat.left.1.fill" |
"carseat.right.1" |
"carseat.right.1.fill" |
"carseat.left.2" |
"carseat.left.2.fill" |
"carseat.right.2" |
"carseat.right.2.fill" |
"carseat.left.3" |
"carseat.left.3.fill" |
"carseat.right.3" |
"carseat.right.3.fill" |
"carseat.left.forward.and.backward" |
"carseat.left.forward.and.backward.fill" |
"carseat.right.forward.and.backward" |
"carseat.right.forward.and.backward.fill" |
"carseat.left.backrest.up.and.down" |
"carseat.left.backrest.up.and.down.fill" |
"carseat.right.backrest.up.and.down" |
"carseat.right.backrest.up.and.down.fill" |
"carseat.left.up.and.down" |
"carseat.left.up.and.down.fill" |
"carseat.right.up.and.down" |
"carseat.right.up.and.down.fill" |
"car.side" |
"car.side.fill" |
"car.side.front.open" |
"car.side.front.open.fill" |
"car.side.rear.open" |
"car.side.rear.open.fill" |
"car.side.air.circulate" |
"car.side.air.circulate.fill" |
"car.side.air.fresh" |
"car.side.air.fresh.fill" |
"car.side.and.exclamationmark" |
"car.side.and.exclamationmark.fill" |
"car.side.arrowtriangle.up.arrowtriangle.down" |
"car.side.arrowtriangle.up.arrowtriangle.down.fill" |
"car.side.arrowtriangle.up" |
"car.side.arrowtriangle.up.fill" |
"car.side.arrowtriangle.down" |
"car.side.arrowtriangle.down.fill" |
"car.side.lock" |
"car.side.lock.fill" |
"car.side.lock.open" |
"car.side.lock.open.fill" |
"suv.side" |
"suv.side.fill" |
"suv.side.front.open" |
"suv.side.front.open.fill" |
"suv.side.rear.open" |
"suv.side.rear.open.fill" |
"suv.side.air.circulate" |
"suv.side.air.circulate.fill" |
"suv.side.air.fresh" |
"suv.side.air.fresh.fill" |
"suv.side.and.exclamationmark" |
"suv.side.and.exclamationmark.fill" |
"suv.side.arrowtriangle.up.arrowtriangle.down" |
"suv.side.arrowtriangle.up.arrowtriangle.down.fill" |
"suv.side.arrowtriangle.up" |
"suv.side.arrowtriangle.up.fill" |
"suv.side.arrowtriangle.down" |
"suv.side.arrowtriangle.down.fill" |
"suv.side.lock" |
"suv.side.lock.fill" |
"suv.side.lock.open" |
"suv.side.lock.open.fill" |
"truck.pickup.side" |
"truck.pickup.side.fill" |
"truck.pickup.side.front.open" |
"truck.pickup.side.front.open.fill" |
"truck.pickup.side.air.circulate" |
"truck.pickup.side.air.circulate.fill" |
"truck.pickup.side.air.fresh" |
"truck.pickup.side.air.fresh.fill" |
"truck.pickup.side.and.exclamationmark" |
"truck.pickup.side.and.exclamationmark.fill" |
"truck.pickup.side.arrowtriangle.up.arrowtriangle.down" |
"truck.pickup.side.arrowtriangle.up.arrowtriangle.down.fill" |
"truck.pickup.side.arrowtriangle.up" |
"truck.pickup.side.arrowtriangle.up.fill" |
"truck.pickup.side.arrowtriangle.down" |
"truck.pickup.side.arrowtriangle.down.fill" |
"truck.pickup.side.lock" |
"truck.pickup.side.lock.fill" |
"truck.pickup.side.lock.open" |
"truck.pickup.side.lock.open.fill" |
"car.side.hill.up" |
"car.side.hill.up.fill" |
"suv.side.hill.up" |
"suv.side.hill.up.fill" |
"truck.pickup.side.hill.up" |
"truck.pickup.side.hill.up.fill" |
"car.side.hill.down" |
"car.side.hill.down.fill" |
"suv.side.hill.down" |
"suv.side.hill.down.fill" |
"truck.pickup.side.hill.down" |
"truck.pickup.side.hill.down.fill" |
"car.side.rear.and.collision.and.car.side.front" |
"car.side.rear.and.collision.and.car.side.front.slash" |
"car.side.rear.and.wave.3.and.car.side.front" |
"car.side.rear.and.exclamationmark.and.car.side.front" |
"car.top.door.front.left.open" |
"car.top.door.front.left.open.fill" |
"car.top.door.front.right.open" |
"car.top.door.front.right.open.fill" |
"car.top.door.rear.left.open" |
"car.top.door.rear.left.open.fill" |
"car.top.door.rear.right.open" |
"car.top.door.rear.right.open.fill" |
"car.top.door.front.left.and.front.right.open" |
"car.top.door.front.left.and.front.right.open.fill" |
"car.top.door.rear.left.and.rear.right.open" |
"car.top.door.rear.left.and.rear.right.open.fill" |
"car.top.door.front.left.and.rear.left.open" |
"car.top.door.front.left.and.rear.left.open.fill" |
"car.top.door.front.right.and.rear.right.open" |
"car.top.door.front.right.and.rear.right.open.fill" |
"car.top.door.front.left.and.rear.right.open" |
"car.top.door.front.left.and.rear.right.open.fill" |
"car.top.door.front.right.and.rear.left.open" |
"car.top.door.front.right.and.rear.left.open.fill" |
"car.top.door.front.left.and.front.right.and.rear.left.open" |
"car.top.door.front.left.and.front.right.and.rear.left.open.fill" |
"car.top.door.front.left.and.front.right.and.rear.right.open" |
"car.top.door.front.left.and.front.right.and.rear.right.open.fill" |
"car.top.door.front.left.and.rear.left.and.rear.right.open" |
"car.top.door.front.left.and.rear.left.and.rear.right.open.fill" |
"car.top.door.front.right.and.rear.left.and.rear.right.open" |
"car.top.door.front.right.and.rear.left.and.rear.right.open.fill" |
"car.top.door.front.left.and.front.right.and.rear.left.and.rear.right.open" |
"car.top.door.front.left.and.front.right.and.rear.left.and.rear.right.open.fill" |
"car.top.door.sliding.left.open" |
"car.top.door.sliding.left.open.fill" |
"car.top.door.sliding.right.open" |
"car.top.door.sliding.right.open.fill" |
"car.top.frontleft.arrowtriangle" |
"car.top.frontleft.arrowtriangle.fill" |
"car.top.rearleft.arrowtriangle" |
"car.top.rearleft.arrowtriangle.fill" |
"car.top.frontright.arrowtriangle" |
"car.top.frontright.arrowtriangle.fill" |
"car.top.rearright.arrowtriangle" |
"car.top.rearright.arrowtriangle.fill" |
"car.top.radiowaves.rear.right" |
"car.top.radiowaves.rear.right.fill" |
"car.top.radiowaves.rear.left" |
"car.top.radiowaves.rear.left.fill" |
"car.top.radiowaves.front" |
"car.top.radiowaves.front.fill" |
"car.top.radiowaves.rear" |
"car.top.radiowaves.rear.fill" |
"car.top.radiowaves.rear.left.and.rear.right" |
"car.top.radiowaves.rear.left.and.rear.right.fill" |
"car.top.radiowaves.rear.right.badge.xmark" |
"car.top.radiowaves.rear.right.badge.xmark.fill" |
"car.top.radiowaves.rear.right.badge.exclamationmark" |
"car.top.radiowaves.rear.right.badge.exclamationmark.fill" |
"car.top.lane.dashed.departure.left" |
"car.top.lane.dashed.departure.left.fill" |
"car.top.lane.dashed.departure.right" |
"car.top.lane.dashed.departure.right.fill" |
"car.top.lane.dashed.arrowtriangle.inward" |
"car.top.lane.dashed.arrowtriangle.inward.fill" |
"car.top.lane.dashed.badge.steeringwheel" |
"car.top.lane.dashed.badge.steeringwheel.fill" |
"axle.2" |
"axle.2.front.engaged" |
"axle.2.rear.engaged" |
"axle.2.front.and.rear.engaged" |
"axle.2.front.disengaged" |
"axle.2.rear.disengaged" |
"axle.2.driveshaft.disengaged" |
"axle.2.rear.lock" |
"autostartstop" |
"autostartstop.slash" |
"autostartstop.trianglebadge.exclamationmark" |
"car.window.right" |
"arrowtriangle.up.arrowtriangle.down.window.right" |
"car.window.right.exclamationmark" |
"car.window.right.badge.exclamationmark" |
"car.window.right.xmark" |
"car.window.right.badge.xmark" |
"car.window.left" |
"arrowtriangle.up.arrowtriangle.down.window.left" |
"car.window.left.exclamationmark" |
"car.window.left.badge.exclamationmark" |
"car.window.left.xmark" |
"car.window.left.badge.xmark" |
"batteryblock" |
"batteryblock.fill" |
"batteryblock.slash" |
"batteryblock.slash.fill" |
"minus.plus.batteryblock" |
"minus.plus.batteryblock.fill" |
"minus.plus.batteryblock.slash" |
"minus.plus.batteryblock.slash.fill" |
"minus.plus.and.fluid.batteryblock" |
"minus.plus.batteryblock.exclamationmark" |
"minus.plus.batteryblock.exclamationmark.fill" |
"minus.plus.batteryblock.stack" |
"minus.plus.batteryblock.stack.fill" |
"minus.plus.batteryblock.stack.exclamationmark" |
"minus.plus.batteryblock.stack.exclamationmark.fill" |
"bolt.batteryblock" |
"bolt.batteryblock.fill" |
"road.lanes" |
"road.lanes.curved.left" |
"road.lanes.curved.right" |
"road.lane.arrowtriangle.2.inward" |
"car.rear.road.lane" |
"car.rear.road.lane.dashed" |
"snowflake.road.lane" |
"snowflake.road.lane.dashed" |
"steeringwheel.road.lane" |
"steeringwheel.road.lane.dashed" |
"car.rear.and.collision.road.lane" |
"car.rear.and.collision.road.lane.slash" |
"gauge.open.with.lines.needle.33percent" |
"gauge.open.with.lines.needle.33percent.and.arrowtriangle" |
"gauge.open.with.lines.needle.33percent.and.arrowtriangle.from.0percent.to.50percent" |
"gauge.open.with.lines.needle.67percent.and.arrowtriangle" |
"gauge.open.with.lines.needle.67percent.and.arrowtriangle.and.car" |
"gauge.open.with.lines.needle.84percent.exclamation" |
"book.and.wrench" |
"book.and.wrench.fill" |
"horn" |
"horn.fill" |
"horn.blast" |
"horn.blast.fill" |
"abs" |
"abs.circle" |
"abs.circle.fill" |
"mph" |
"mph.circle" |
"mph.circle.fill" |
"kph" |
"kph.circle" |
"kph.circle.fill" |
"2h" |
"2h.circle" |
"2h.circle.fill" |
"4h" |
"4h.circle" |
"4h.circle.fill" |
"4l" |
"4l.circle" |
"4l.circle.fill" |
"4a" |
"4a.circle" |
"4a.circle.fill" |
"licenseplate" |
"licenseplate.fill" |
"ev.plug.ac.type.1" |
"ev.plug.ac.type.1.fill" |
"ev.plug.ac.type.2" |
"ev.plug.ac.type.2.fill" |
"ev.plug.ac.gb.t" |
"ev.plug.ac.gb.t.fill" |
"ev.plug.dc.ccs1" |
"ev.plug.dc.ccs1.fill" |
"ev.plug.dc.ccs2" |
"ev.plug.dc.ccs2.fill" |
"ev.plug.dc.chademo" |
"ev.plug.dc.chademo.fill" |
"ev.plug.dc.gb.t" |
"ev.plug.dc.gb.t.fill" |
"ev.plug.dc.nacs" |
"ev.plug.dc.nacs.fill" |
"lungs" |
"lungs.fill" |
"allergens" |
"allergens.fill" |
"microbe" |
"microbe.fill" |
"microbe.circle" |
"microbe.circle.fill" |
"bubbles.and.sparkles" |
"bubbles.and.sparkles.fill" |
"medical.thermometer" |
"medical.thermometer.fill" |
"bandage" |
"bandage.fill" |
"syringe" |
"syringe.fill" |
"facemask" |
"facemask.fill" |
"pill" |
"pill.fill" |
"pill.circle" |
"pill.circle.fill" |
"pills" |
"pills.fill" |
"pills.circle" |
"pills.circle.fill" |
"cross" |
"cross.fill" |
"cross.circle" |
"cross.circle.fill" |
"flask" |
"flask.fill" |
"testtube.2" |
"ivfluid.bag" |
"ivfluid.bag.fill" |
"cross.vial" |
"cross.vial.fill" |
"staroflife" |
"staroflife.fill" |
"staroflife.circle" |
"staroflife.circle.fill" |
"heart.text.square" |
"heart.text.square.fill" |
"square.text.square" |
"square.text.square.fill" |
"hare" |
"hare.fill" |
"hare.circle" |
"hare.circle.fill" |
"tortoise" |
"tortoise.fill" |
"tortoise.circle" |
"tortoise.circle.fill" |
"dog" |
"dog.fill" |
"dog.circle" |
"dog.circle.fill" |
"cat" |
"cat.fill" |
"cat.circle" |
"cat.circle.fill" |
"lizard" |
"lizard.fill" |
"lizard.circle" |
"lizard.circle.fill" |
"bird" |
"bird.fill" |
"bird.circle" |
"bird.circle.fill" |
"ant" |
"ant.fill" |
"ant.circle" |
"ant.circle.fill" |
"ladybug" |
"ladybug.fill" |
"ladybug.circle" |
"ladybug.circle.fill" |
"fish" |
"fish.fill" |
"fish.circle" |
"fish.circle.fill" |
"pawprint" |
"pawprint.fill" |
"pawprint.circle" |
"pawprint.circle.fill" |
"teddybear" |
"teddybear.fill" |
"leaf" |
"leaf.fill" |
"leaf.circle" |
"leaf.circle.fill" |
"leaf.arrow.triangle.circlepath" |
"laurel.leading" |
"laurel.trailing" |
"camera.macro" |
"camera.macro.circle" |
"camera.macro.circle.fill" |
"tree" |
"tree.fill" |
"tree.circle" |
"tree.circle.fill" |
"hanger" |
"crown" |
"crown.fill" |
"tshirt" |
"tshirt.fill" |
"tshirt.circle" |
"tshirt.circle.fill" |
"shoe" |
"shoe.fill" |
"shoe.circle" |
"shoe.circle.fill" |
"shoe.2" |
"shoe.2.fill" |
"shoeprints.fill" |
"film" |
"film.fill" |
"film.circle" |
"film.circle.fill" |
"film.stack" |
"film.stack.fill" |
"movieclapper" |
"movieclapper.fill" |
"ticket" |
"ticket.fill" |
"face.smiling" |
"face.smiling.inverse" |
"face.dashed" |
"face.dashed.fill" |
"eye" |
"eye.fill" |
"eye.circle" |
"eye.circle.fill" |
"eye.square" |
"eye.square.fill" |
"eye.slash" |
"eye.slash.fill" |
"eye.slash.circle" |
"eye.slash.circle.fill" |
"eye.trianglebadge.exclamationmark" |
"eye.trianglebadge.exclamationmark.fill" |
"eyes" |
"eyes.inverse" |
"eyebrow" |
"nose" |
"nose.fill" |
"comb" |
"comb.fill" |
"mustache" |
"mustache.fill" |
"mouth" |
"mouth.fill" |
"eyeglasses" |
"eyeglasses.slash" |
"sunglasses" |
"sunglasses.fill" |
"brain.head.profile" |
"brain.head.profile.fill" |
"brain.filled.head.profile" |
"brain" |
"brain.fill" |
"ear" |
"ear.fill" |
"ear.badge.checkmark" |
"ear.trianglebadge.exclamationmark" |
"ear.badge.waveform" |
"hearingdevice.ear" |
"hearingdevice.ear.fill" |
"hearingdevice.and.signal.meter" |
"hearingdevice.and.signal.meter.fill" |
"hand.raised" |
"hand.raised.fill" |
"hand.raised.circle" |
"hand.raised.circle.fill" |
"hand.raised.square" |
"hand.raised.square.fill" |
"hand.raised.app" |
"hand.raised.app.fill" |
"hand.raised.slash" |
"hand.raised.slash.fill" |
"hand.raised.fingers.spread" |
"hand.raised.fingers.spread.fill" |
"hand.thumbsup" |
"hand.thumbsup.fill" |
"hand.thumbsup.circle" |
"hand.thumbsup.circle.fill" |
"hand.thumbsdown" |
"hand.thumbsdown.fill" |
"hand.thumbsdown.circle" |
"hand.thumbsdown.circle.fill" |
"hand.point.up.left" |
"hand.point.up.left.fill" |
"hand.draw" |
"hand.draw.fill" |
"hand.tap" |
"hand.tap.fill" |
"hand.point.up.left.and.text" |
"hand.point.up.left.and.text.fill" |
"rectangle.and.hand.point.up.left" |
"rectangle.and.hand.point.up.left.fill" |
"rectangle.filled.and.hand.point.up.left" |
"rectangle.and.hand.point.up.left.filled" |
"hand.point.left" |
"hand.point.left.fill" |
"hand.point.right" |
"hand.point.right.fill" |
"hand.point.up" |
"hand.point.up.fill" |
"hand.point.up.braille" |
"hand.point.up.braille.fill" |
"hand.point.down" |
"hand.point.down.fill" |
"hand.wave" |
"hand.wave.fill" |
"hands.clap" |
"hands.clap.fill" |
"hands.and.sparkles" |
"hands.and.sparkles.fill" |
"qrcode" |
"barcode" |
"viewfinder" |
"viewfinder.circle" |
"viewfinder.circle.fill" |
"barcode.viewfinder" |
"qrcode.viewfinder" |
"plus.viewfinder" |
"camera.viewfinder" |
"doc.viewfinder" |
"doc.viewfinder.fill" |
"location.viewfinder" |
"location.fill.viewfinder" |
"person.fill.viewfinder" |
"ellipsis.viewfinder" |
"text.viewfinder" |
"dot.viewfinder" |
"dot.circle.viewfinder" |
"key.viewfinder" |
"creditcard.viewfinder" |
"vial.viewfinder" |
"viewfinder.trianglebadge.exclamationmark" |
"photo" |
"photo.fill" |
"photo.circle" |
"photo.circle.fill" |
"photo.badge.plus" |
"photo.badge.plus.fill" |
"photo.badge.arrow.down" |
"photo.badge.arrow.down.fill" |
"photo.badge.checkmark" |
"photo.badge.checkmark.fill" |
"text.below.photo" |
"text.below.photo.fill" |
"camera.metering.center.weighted.average" |
"camera.metering.center.weighted" |
"camera.metering.matrix" |
"camera.metering.multispot" |
"camera.metering.none" |
"camera.metering.partial" |
"camera.metering.spot" |
"camera.metering.unknown" |
"camera.aperture" |
"circle.filled.pattern.diagonalline.rectangle" |
"circle.rectangle.filled.pattern.diagonalline" |
"circle.dashed.rectangle" |
"circle.rectangle.dashed" |
"rectangle.dashed" |
"rectangle.dashed.badge.record" |
"square.badge.plus" |
"square.badge.plus.fill" |
"rectangle.portrait.badge.plus" |
"rectangle.portrait.badge.plus.fill" |
"rectangle.badge.plus" |
"rectangle.fill.badge.plus" |
"rectangle.badge.minus" |
"rectangle.fill.badge.minus" |
"rectangle.badge.checkmark" |
"rectangle.fill.badge.checkmark" |
"rectangle.badge.xmark" |
"rectangle.fill.badge.xmark" |
"rectangle.badge.person.crop" |
"rectangle.fill.badge.person.crop" |
"photo.on.rectangle" |
"photo.fill.on.rectangle.fill" |
"rectangle.on.rectangle.angled" |
"rectangle.fill.on.rectangle.angled.fill" |
"photo.on.rectangle.angled" |
"rectangle.stack" |
"rectangle.stack.fill" |
"photo.stack" |
"photo.stack.fill" |
"sparkles.rectangle.stack" |
"sparkles.rectangle.stack.fill" |
"checkmark.rectangle.stack" |
"checkmark.rectangle.stack.fill" |
"rectangle.stack.badge.plus" |
"rectangle.stack.fill.badge.plus" |
"rectangle.stack.badge.minus" |
"rectangle.stack.fill.badge.minus" |
"rectangle.stack.badge.person.crop" |
"rectangle.stack.badge.person.crop.fill" |
"rectangle.stack.badge.play" |
"rectangle.stack.badge.play.fill" |
"sidebar.left" |
"sidebar.right" |
"sidebar.leading" |
"sidebar.trailing" |
"sidebar.squares.left" |
"sidebar.squares.right" |
"sidebar.squares.leading" |
"sidebar.squares.trailing" |
"squares.below.rectangle" |
"squares.leading.rectangle" |
"squares.leading.rectangle.fill" |
"macwindow" |
"macwindow.badge.plus" |
"macwindow.and.cursorarrow" |
"slider.horizontal.2.rectangle.and.arrow.triangle.2.circlepath" |
"dock.rectangle" |
"dock.arrow.up.rectangle" |
"dock.arrow.down.rectangle" |
"menubar.rectangle" |
"menubar.dock.rectangle" |
"menubar.dock.rectangle.badge.record" |
"menubar.arrow.up.rectangle" |
"menubar.arrow.down.rectangle" |
"macwindow.on.rectangle" |
"text.and.command.macwindow" |
"keyboard.macwindow" |
"uiwindow.split.2x1" |
"mosaic" |
"mosaic.fill" |
"square.on.square.squareshape.controlhandles" |
"squareshape.controlhandles.on.squareshape.controlhandles" |
"pano" |
"pano.fill" |
"square.and.line.vertical.and.square" |
"square.fill.and.line.vertical.and.square.fill" |
"square.filled.and.line.vertical.and.square" |
"square.and.line.vertical.and.square.filled" |
"rectangle.connected.to.line.below" |
"flowchart" |
"flowchart.fill" |
"align.horizontal.left" |
"align.horizontal.left.fill" |
"align.horizontal.center" |
"align.horizontal.center.fill" |
"align.horizontal.right" |
"align.horizontal.right.fill" |
"align.vertical.top" |
"align.vertical.top.fill" |
"align.vertical.center" |
"align.vertical.center.fill" |
"align.vertical.bottom" |
"align.vertical.bottom.fill" |
"distribute.vertical.top" |
"distribute.vertical.top.fill" |
"distribute.vertical.center" |
"distribute.vertical.center.fill" |
"distribute.vertical.bottom" |
"distribute.vertical.bottom.fill" |
"distribute.horizontal.left" |
"distribute.horizontal.left.fill" |
"distribute.horizontal.center" |
"distribute.horizontal.center.fill" |
"distribute.horizontal.right" |
"distribute.horizontal.right.fill" |
"switch.2" |
"app.connected.to.app.below.fill" |
"point.topleft.down.to.point.bottomright.curvepath" |
"point.topleft.down.to.point.bottomright.curvepath.fill" |
"point.topleft.down.to.point.bottomright.filled.curvepath" |
"point.topleft.filled.down.to.point.bottomright.curvepath" |
"point.bottomleft.forward.to.point.topright.scurvepath" |
"point.bottomleft.forward.to.point.topright.scurvepath.fill" |
"point.bottomleft.forward.to.point.topright.filled.scurvepath" |
"point.bottomleft.filled.forward.to.point.topright.scurvepath" |
"point.bottomleft.forward.to.arrowtriangle.uturn.scurvepath" |
"point.bottomleft.forward.to.arrowtriangle.uturn.scurvepath.fill" |
"point.forward.to.point.capsulepath" |
"point.forward.to.point.capsulepath.fill" |
"lineweight" |
"slider.horizontal.3" |
"slider.horizontal.2.square.on.square" |
"slider.horizontal.2.square" |
"slider.horizontal.2.square.badge.arrow.down" |
"slider.horizontal.2.gobackward" |
"slider.horizontal.below.rectangle" |
"slider.horizontal.below.square.filled.and.square" |
"slider.horizontal.below.square.and.square.filled" |
"slider.horizontal.below.sun.max" |
"slider.vertical.3" |
"cube" |
"cube.fill" |
"cube.transparent" |
"cube.transparent.fill" |
"shippingbox" |
"shippingbox.fill" |
"shippingbox.circle" |
"shippingbox.circle.fill" |
"shippingbox.and.arrow.backward" |
"shippingbox.and.arrow.backward.fill" |
"arkit" |
"arkit.badge.xmark" |
"cone" |
"cone.fill" |
"pyramid" |
"pyramid.fill" |
"square.stack.3d.down.right" |
"square.stack.3d.down.right.fill" |
"square.stack.3d.down.forward" |
"square.stack.3d.down.forward.fill" |
"square.stack.3d.up" |
"square.stack.3d.up.fill" |
"square.stack.3d.up.badge.automatic" |
"square.stack.3d.up.badge.automatic.fill" |
"square.stack.3d.up.trianglebadge.exclamationmark" |
"square.stack.3d.up.trianglebadge.exclamationmark.fill" |
"square.stack.3d.up.slash" |
"square.stack.3d.up.slash.fill" |
"square.stack.3d.forward.dottedline" |
"square.stack.3d.forward.dottedline.fill" |
"livephoto" |
"livephoto.slash" |
"livephoto.badge.automatic" |
"livephoto.play" |
"f.cursive" |
"f.cursive.circle" |
"f.cursive.circle.fill" |
"scope" |
"dot.scope" |
"helm" |
"clock" |
"clock.fill" |
"clock.circle" |
"clock.circle.fill" |
"clock.badge" |
"clock.badge.fill" |
"clock.badge.checkmark" |
"clock.badge.checkmark.fill" |
"clock.badge.xmark" |
"clock.badge.xmark.fill" |
"clock.badge.questionmark" |
"clock.badge.questionmark.fill" |
"clock.badge.exclamationmark" |
"clock.badge.exclamationmark.fill" |
"deskclock" |
"deskclock.fill" |
"alarm" |
"alarm.fill" |
"alarm.waves.left.and.right" |
"alarm.waves.left.and.right.fill" |
"stopwatch" |
"stopwatch.fill" |
"chart.xyaxis.line" |
"gauge.with.needle" |
"gauge.with.needle.fill" |
"timer" |
"timer.circle" |
"timer.circle.fill" |
"timer.square" |
"arrow.circlepath" |
"clock.arrow.circlepath" |
"exclamationmark.arrow.circlepath" |
"clock.arrow.2.circlepath" |
"arcade.stick.console" |
"arcade.stick.console.fill" |
"arcade.stick" |
"arcade.stick.and.arrow.left.and.arrow.right" |
"arcade.stick.and.arrow.left" |
"arcade.stick.and.arrow.right" |
"arcade.stick.and.arrow.up.and.arrow.down" |
"arcade.stick.and.arrow.up" |
"arcade.stick.and.arrow.down" |
"gamecontroller" |
"gamecontroller.fill" |
"l.joystick" |
"l.joystick.fill" |
"r.joystick" |
"r.joystick.fill" |
"l.joystick.press.down" |
"l.joystick.press.down.fill" |
"r.joystick.press.down" |
"r.joystick.press.down.fill" |
"l.joystick.tilt.left" |
"l.joystick.tilt.left.fill" |
"l.joystick.tilt.right" |
"l.joystick.tilt.right.fill" |
"l.joystick.tilt.up" |
"l.joystick.tilt.up.fill" |
"l.joystick.tilt.down" |
"l.joystick.tilt.down.fill" |
"r.joystick.tilt.left" |
"r.joystick.tilt.left.fill" |
"r.joystick.tilt.right" |
"r.joystick.tilt.right.fill" |
"r.joystick.tilt.up" |
"r.joystick.tilt.up.fill" |
"r.joystick.tilt.down" |
"r.joystick.tilt.down.fill" |
"circle.grid.cross" |
"circle.grid.cross.fill" |
"circle.grid.cross.left.filled" |
"circle.grid.cross.up.filled" |
"circle.grid.cross.right.filled" |
"circle.grid.cross.down.filled" |
"dpad" |
"dpad.fill" |
"dpad.left.filled" |
"dpad.up.filled" |
"dpad.right.filled" |
"dpad.down.filled" |
"arrowkeys" |
"arrowkeys.fill" |
"arrowkeys.up.filled" |
"arrowkeys.down.filled" |
"arrowkeys.left.filled" |
"arrowkeys.right.filled" |
"circle.circle" |
"circle.circle.fill" |
"square.circle" |
"square.circle.fill" |
"triangle.circle" |
"triangle.circle.fill" |
"paddleshifter.left" |
"paddleshifter.left.fill" |
"paddleshifter.right" |
"paddleshifter.right.fill" |
"l1.circle" |
"l1.circle.fill" |
"lb.circle" |
"lb.circle.fill" |
"l2.circle" |
"l2.circle.fill" |
"lt.circle" |
"lt.circle.fill" |
"r1.circle" |
"r1.circle.fill" |
"rb.circle" |
"rb.circle.fill" |
"r2.circle" |
"r2.circle.fill" |
"rt.circle" |
"rt.circle.fill" |
"button.horizontal" |
"button.horizontal.fill" |
"l4.button.horizontal" |
"l4.button.horizontal.fill" |
"r4.button.horizontal" |
"r4.button.horizontal.fill" |
"lm.button.horizontal" |
"lm.button.horizontal.fill" |
"rm.button.horizontal" |
"rm.button.horizontal.fill" |
"m1.button.horizontal" |
"m1.button.horizontal.fill" |
"m2.button.horizontal" |
"m2.button.horizontal.fill" |
"m3.button.horizontal" |
"m3.button.horizontal.fill" |
"m4.button.horizontal" |
"m4.button.horizontal.fill" |
"p1.button.horizontal" |
"p1.button.horizontal.fill" |
"p2.button.horizontal" |
"p2.button.horizontal.fill" |
"p3.button.horizontal" |
"p3.button.horizontal.fill" |
"p4.button.horizontal" |
"p4.button.horizontal.fill" |
"button.roundedtop.horizontal" |
"button.roundedtop.horizontal.fill" |
"l2.button.roundedtop.horizontal" |
"l2.button.roundedtop.horizontal.fill" |
"r2.button.roundedtop.horizontal" |
"r2.button.roundedtop.horizontal.fill" |
"lt.button.roundedtop.horizontal" |
"lt.button.roundedtop.horizontal.fill" |
"rt.button.roundedtop.horizontal" |
"rt.button.roundedtop.horizontal.fill" |
"zl.button.roundedtop.horizontal" |
"zl.button.roundedtop.horizontal.fill" |
"zr.button.roundedtop.horizontal" |
"zr.button.roundedtop.horizontal.fill" |
"button.roundedbottom.horizontal" |
"button.roundedbottom.horizontal.fill" |
"l.button.roundedbottom.horizontal" |
"l.button.roundedbottom.horizontal.fill" |
"l1.button.roundedbottom.horizontal" |
"l1.button.roundedbottom.horizontal.fill" |
"r.button.roundedbottom.horizontal" |
"r.button.roundedbottom.horizontal.fill" |
"r1.button.roundedbottom.horizontal" |
"r1.button.roundedbottom.horizontal.fill" |
"lb.button.roundedbottom.horizontal" |
"lb.button.roundedbottom.horizontal.fill" |
"rb.button.roundedbottom.horizontal" |
"rb.button.roundedbottom.horizontal.fill" |
"button.angledtop.vertical.left" |
"button.angledtop.vertical.left.fill" |
"l2.button.angledtop.vertical.left" |
"l2.button.angledtop.vertical.left.fill" |
"rectangle.on.rectangle.button.angledtop.vertical.left" |
"rectangle.on.rectangle.button.angledtop.vertical.left.fill" |
"button.angledtop.vertical.right" |
"button.angledtop.vertical.right.fill" |
"r2.button.angledtop.vertical.right" |
"r2.button.angledtop.vertical.right.fill" |
"line.3.horizontal.button.angledtop.vertical.right" |
"line.3.horizontal.button.angledtop.vertical.right.fill" |
"button.angledbottom.horizontal.left" |
"button.angledbottom.horizontal.left.fill" |
"l3.button.angledbottom.horizontal.left" |
"l3.button.angledbottom.horizontal.left.fill" |
"lsb.button.angledbottom.horizontal.left" |
"lsb.button.angledbottom.horizontal.left.fill" |
"button.angledbottom.horizontal.right" |
"button.angledbottom.horizontal.right.fill" |
"r3.button.angledbottom.horizontal.right" |
"r3.button.angledbottom.horizontal.right.fill" |
"rsb.button.angledbottom.horizontal.right" |
"rsb.button.angledbottom.horizontal.right.fill" |
"pedal.accelerator" |
"pedal.accelerator.fill" |
"pedal.brake" |
"pedal.brake.fill" |
"pedal.clutch" |
"pedal.clutch.fill" |
"gearshift.layout.sixspeed" |
"playstation.logo" |
"xbox.logo" |
"paintpalette" |
"paintpalette.fill" |
"swatchpalette" |
"swatchpalette.fill" |
"cup.and.saucer" |
"cup.and.saucer.fill" |
"mug" |
"mug.fill" |
"takeoutbag.and.cup.and.straw" |
"takeoutbag.and.cup.and.straw.fill" |
"wineglass" |
"wineglass.fill" |
"waterbottle" |
"waterbottle.fill" |
"birthday.cake" |
"birthday.cake.fill" |
"carrot" |
"carrot.fill" |
"fork.knife" |
"fork.knife.circle" |
"fork.knife.circle.fill" |
"rectangle.compress.vertical" |
"rectangle.expand.vertical" |
"rectangle.and.arrow.up.right.and.arrow.down.left" |
"rectangle.and.arrow.up.right.and.arrow.down.left.slash" |
"square.2.layers.3d" |
"square.2.layers.3d.fill" |
"square.2.layers.3d.top.filled" |
"square.2.layers.3d.bottom.filled" |
"square.3.layers.3d.down.right" |
"square.3.layers.3d.down.right.slash" |
"square.3.layers.3d.down.left" |
"square.3.layers.3d.down.left.slash" |
"square.3.layers.3d.down.forward" |
"square.3.layers.3d.down.backward" |
"square.3.layers.3d" |
"square.3.layers.3d.slash" |
"square.3.layers.3d.top.filled" |
"square.3.layers.3d.middle.filled" |
"square.3.layers.3d.bottom.filled" |
"circle.dotted.and.circle" |
"cylinder" |
"cylinder.fill" |
"cylinder.split.1x2" |
"cylinder.split.1x2.fill" |
"chart.bar" |
"chart.bar.fill" |
"cellularbars" |
"chart.pie" |
"chart.pie.fill" |
"chart.bar.xaxis" |
"chart.bar.xaxis.ascending" |
"chart.bar.xaxis.ascending.badge.clock" |
"chart.line.uptrend.xyaxis" |
"chart.line.uptrend.xyaxis.circle" |
"chart.line.uptrend.xyaxis.circle.fill" |
"chart.line.downtrend.xyaxis" |
"chart.line.downtrend.xyaxis.circle" |
"chart.line.downtrend.xyaxis.circle.fill" |
"chart.line.flattrend.xyaxis" |
"chart.line.flattrend.xyaxis.circle" |
"chart.line.flattrend.xyaxis.circle.fill" |
"chart.dots.scatter" |
"dot.squareshape.split.2x2" |
"squareshape.dotted.split.2x2" |
"squareshape.split.2x2.dotted" |
"squareshape.split.2x2" |
"squareshape.split.3x3" |
"burst" |
"burst.fill" |
"waveform.path.ecg" |
"waveform.path.ecg.rectangle" |
"waveform.path.ecg.rectangle.fill" |
"waveform.path" |
"waveform.path.badge.plus" |
"waveform.path.badge.minus" |
"point.3.connected.trianglepath.dotted" |
"point.3.filled.connected.trianglepath.dotted" |
"waveform" |
"waveform.circle" |
"waveform.circle.fill" |
"waveform.slash" |
"waveform.badge.plus" |
"waveform.badge.minus" |
"waveform.badge.exclamationmark" |
"waveform.badge.magnifyingglass" |
"waveform.and.person.filled" |
"waveform.badge.mic" |
"simcard" |
"simcard.fill" |
"simcard.2" |
"simcard.2.fill" |
"sdcard" |
"sdcard.fill" |
"esim" |
"esim.fill" |
"touchid" |
"bonjour" |
"atom" |
"scalemass" |
"scalemass.fill" |
"angle" |
"compass.drawing" |
"globe.desk" |
"globe.desk.fill" |
"fossil.shell" |
"fossil.shell.fill" |
"gift" |
"gift.fill" |
"gift.circle" |
"gift.circle.fill" |
"hourglass" |
"hourglass.circle" |
"hourglass.circle.fill" |
"hourglass.badge.plus" |
"hourglass.and.lock" |
"hourglass.bottomhalf.filled" |
"hourglass.tophalf.filled" |
"banknote" |
"banknote.fill" |
"dollarsign.arrow.circlepath" |
"centsign.arrow.circlepath" |
"yensign.arrow.circlepath" |
"sterlingsign.arrow.circlepath" |
"francsign.arrow.circlepath" |
"florinsign.arrow.circlepath" |
"turkishlirasign.arrow.circlepath" |
"rublesign.arrow.circlepath" |
"eurosign.arrow.circlepath" |
"dongsign.arrow.circlepath" |
"indianrupeesign.arrow.circlepath" |
"tengesign.arrow.circlepath" |
"pesetasign.arrow.circlepath" |
"pesosign.arrow.circlepath" |
"kipsign.arrow.circlepath" |
"wonsign.arrow.circlepath" |
"lirasign.arrow.circlepath" |
"australsign.arrow.circlepath" |
"hryvniasign.arrow.circlepath" |
"nairasign.arrow.circlepath" |
"guaranisign.arrow.circlepath" |
"coloncurrencysign.arrow.circlepath" |
"cedisign.arrow.circlepath" |
"cruzeirosign.arrow.circlepath" |
"tugriksign.arrow.circlepath" |
"millsign.arrow.circlepath" |
"shekelsign.arrow.circlepath" |
"manatsign.arrow.circlepath" |
"rupeesign.arrow.circlepath" |
"bahtsign.arrow.circlepath" |
"larisign.arrow.circlepath" |
"bitcoinsign.arrow.circlepath" |
"brazilianrealsign.arrow.circlepath" |
"chineseyuanrenminbisign.arrow.circlepath" |
"polishzlotysign.arrow.circlepath" |
"norwegiankronesign.arrow.circlepath" |
"swedishkronasign.arrow.circlepath" |
"danishkronesign.arrow.circlepath" |
"eurozonesign.arrow.circlepath" |
"australiandollarsign.arrow.circlepath" |
"purchased" |
"purchased.circle" |
"purchased.circle.fill" |
"perspective" |
"circle.and.line.horizontal" |
"circle.and.line.horizontal.fill" |
"trapezoid.and.line.vertical" |
"trapezoid.and.line.vertical.fill" |
"trapezoid.and.line.horizontal" |
"trapezoid.and.line.horizontal.fill" |
"aspectratio" |
"aspectratio.fill" |
"camera.filters" |
"square.resize.up" |
"square.resize.down" |
"square.resize" |
"rectangle.ratio.3.to.4" |
"rectangle.ratio.3.to.4.fill" |
"rectangle.ratio.4.to.3" |
"rectangle.ratio.4.to.3.fill" |
"rectangle.ratio.9.to.16" |
"rectangle.ratio.9.to.16.fill" |
"rectangle.ratio.16.to.9" |
"rectangle.ratio.16.to.9.fill" |
"skew" |
"arrow.left.and.right.righttriangle.left.righttriangle.right" |
"arrow.left.and.right.righttriangle.left.righttriangle.right.fill" |
"arrow.up.and.down.righttriangle.up.righttriangle.down" |
"arrow.up.and.down.righttriangle.up.righttriangle.down.fill" |
"arrowtriangle.left.and.line.vertical.and.arrowtriangle.right" |
"arrowtriangle.left.and.line.vertical.and.arrowtriangle.right.fill" |
"arrowtriangle.right.and.line.vertical.and.arrowtriangle.left" |
"arrowtriangle.right.and.line.vertical.and.arrowtriangle.left.fill" |
"grid" |
"grid.circle" |
"grid.circle.fill" |
"burn" |
"lifepreserver" |
"lifepreserver.fill" |
"dot.arrowtriangles.up.right.down.left.circle" |
"recordingtape" |
"recordingtape.circle" |
"recordingtape.circle.fill" |
"binoculars" |
"binoculars.fill" |
"binoculars.circle" |
"binoculars.circle.fill" |
"battery.100percent" |
"battery.100percent.circle" |
"battery.100percent.circle.fill" |
"battery.75percent" |
"battery.50percent" |
"battery.25percent" |
"battery.0percent" |
"battery.100percent.bolt" |
"fibrechannel" |
"checklist.unchecked" |
"checklist" |
"checklist.checked" |
"square.fill.text.grid.1x2" |
"list.bullet" |
"list.bullet.circle" |
"list.bullet.circle.fill" |
"list.dash" |
"list.triangle" |
"list.bullet.indent" |
"list.number" |
"list.star" |
"increase.indent" |
"decrease.indent" |
"decrease.quotelevel" |
"increase.quotelevel" |
"quotelevel" |
"list.bullet.below.rectangle" |
"text.badge.plus" |
"text.badge.minus" |
"text.badge.checkmark" |
"text.badge.xmark" |
"text.badge.star" |
"text.insert" |
"text.append" |
"text.line.first.and.arrowtriangle.forward" |
"text.line.last.and.arrowtriangle.forward" |
"text.quote" |
"text.alignleft" |
"text.aligncenter" |
"text.alignright" |
"text.justify" |
"text.justify.left" |
"text.justify.right" |
"text.justify.leading" |
"text.justify.trailing" |
"text.redaction" |
"text.word.spacing" |
"arrow.up.and.down.text.horizontal" |
"arrow.left.and.right.text.vertical" |
"list.and.film" |
"line.3.horizontal" |
"line.3.horizontal.decrease" |
"line.3.horizontal.decrease.circle" |
"line.3.horizontal.decrease.circle.fill" |
"line.3.horizontal.circle" |
"line.3.horizontal.circle.fill" |
"line.2.horizontal.decrease.circle" |
"line.2.horizontal.decrease.circle.fill" |
"character" |
"textformat.size.smaller" |
"textformat.size.larger" |
"textformat.size" |
"textformat" |
"textformat.alt" |
"textformat.superscript" |
"textformat.subscript" |
"abc" |
"textformat.abc" |
"textformat.abc.dottedunderline" |
"kashida.arabic" |
"bold" |
"italic" |
"underline" |
"strikethrough" |
"shadow" |
"bold.italic.underline" |
"bold.underline" |
"view.2d" |
"view.3d" |
"character.cursor.ibeam" |
"fx" |
"k" |
"sum" |
"percent" |
"function" |
"textformat.123" |
"123.rectangle" |
"123.rectangle.fill" |
"textformat.12" |
"character.textbox" |
"numbersign" |
"character.sutton" |
"character.duployan" |
"character.phonetic" |
"character.magnify" |
"paragraphsign" |
"info" |
"info.circle" |
"info.circle.fill" |
"info.square" |
"info.square.fill" |
"at" |
"at.circle" |
"at.circle.fill" |
"at.badge.plus" |
"at.badge.minus" |
"questionmark" |
"exclamationmark.questionmark" |
"questionmark.circle" |
"questionmark.circle.fill" |
"questionmark.square" |
"questionmark.square.fill" |
"questionmark.diamond" |
"questionmark.diamond.fill" |
"exclamationmark" |
"exclamationmark.2" |
"exclamationmark.3" |
"exclamationmark.circle" |
"exclamationmark.circle.fill" |
"exclamationmark.square" |
"exclamationmark.square.fill" |
"exclamationmark.octagon" |
"exclamationmark.octagon.fill" |
"exclamationmark.shield" |
"exclamationmark.shield.fill" |
"plus" |
"plus.circle" |
"plus.circle.fill" |
"plus.square" |
"plus.square.fill" |
"plus.rectangle" |
"plus.rectangle.fill" |
"plus.rectangle.portrait" |
"plus.rectangle.portrait.fill" |
"plus.diamond" |
"plus.diamond.fill" |
"minus" |
"minus.circle" |
"minus.circle.fill" |
"minus.square" |
"minus.square.fill" |
"minus.rectangle" |
"minus.rectangle.fill" |
"minus.rectangle.portrait" |
"minus.rectangle.portrait.fill" |
"minus.diamond" |
"minus.diamond.fill" |
"plusminus" |
"plusminus.circle" |
"plusminus.circle.fill" |
"plus.forwardslash.minus" |
"minus.forwardslash.plus" |
"multiply" |
"multiply.circle" |
"multiply.circle.fill" |
"multiply.square" |
"multiply.square.fill" |
"divide" |
"divide.circle" |
"divide.circle.fill" |
"divide.square" |
"divide.square.fill" |
"equal" |
"equal.circle" |
"equal.circle.fill" |
"equal.square" |
"equal.square.fill" |
"lessthan" |
"lessthan.circle" |
"lessthan.circle.fill" |
"lessthan.square" |
"lessthan.square.fill" |
"greaterthan" |
"greaterthan.circle" |
"greaterthan.circle.fill" |
"greaterthan.square" |
"greaterthan.square.fill" |
"chevron.left.forwardslash.chevron.right" |
"parentheses" |
"curlybraces" |
"curlybraces.square" |
"curlybraces.square.fill" |
"ellipsis.curlybraces" |
"number" |
"number.circle" |
"number.circle.fill" |
"number.square" |
"number.square.fill" |
"xmark" |
"xmark.circle" |
"xmark.circle.fill" |
"xmark.square" |
"xmark.square.fill" |
"xmark.rectangle" |
"xmark.rectangle.fill" |
"xmark.rectangle.portrait" |
"xmark.rectangle.portrait.fill" |
"xmark.diamond" |
"xmark.diamond.fill" |
"xmark.shield" |
"xmark.shield.fill" |
"xmark.octagon" |
"xmark.octagon.fill" |
"checkmark" |
"checkmark.circle" |
"checkmark.circle.fill" |
"checkmark.circle.badge.questionmark" |
"checkmark.circle.badge.questionmark.fill" |
"checkmark.circle.badge.xmark" |
"checkmark.circle.badge.xmark.fill" |
"checkmark.circle.trianglebadge.exclamationmark" |
"checkmark.square" |
"checkmark.square.fill" |
"checkmark.rectangle" |
"checkmark.rectangle.fill" |
"checkmark.rectangle.portrait" |
"checkmark.rectangle.portrait.fill" |
"checkmark.diamond" |
"checkmark.diamond.fill" |
"checkmark.shield" |
"checkmark.shield.fill" |
"chevron.left" |
"chevron.left.circle" |
"chevron.left.circle.fill" |
"chevron.left.square" |
"chevron.left.square.fill" |
"chevron.backward" |
"chevron.backward.circle" |
"chevron.backward.circle.fill" |
"chevron.backward.square" |
"chevron.backward.square.fill" |
"chevron.right" |
"chevron.right.circle" |
"chevron.right.circle.fill" |
"chevron.right.square" |
"chevron.right.square.fill" |
"chevron.forward" |
"chevron.forward.circle" |
"chevron.forward.circle.fill" |
"chevron.forward.square" |
"chevron.forward.square.fill" |
"chevron.left.2" |
"chevron.backward.2" |
"chevron.right.2" |
"chevron.forward.2" |
"chevron.up" |
"chevron.up.circle" |
"chevron.up.circle.fill" |
"chevron.up.square" |
"chevron.up.square.fill" |
"chevron.down" |
"chevron.down.circle" |
"chevron.down.circle.fill" |
"chevron.down.square" |
"chevron.down.square.fill" |
"chevron.up.chevron.down" |
"chevron.compact.up" |
"chevron.compact.down" |
"chevron.compact.left" |
"chevron.compact.right" |
"chevron.compact.backward" |
"chevron.compact.forward" |
"arrow.left" |
"arrow.left.circle" |
"arrow.left.circle.fill" |
"arrow.left.square" |
"arrow.left.square.fill" |
"arrow.backward" |
"arrow.backward.circle" |
"arrow.backward.circle.fill" |
"arrow.backward.square" |
"arrow.backward.square.fill" |
"arrow.right" |
"arrow.right.circle" |
"arrow.right.circle.fill" |
"arrow.right.square" |
"arrow.right.square.fill" |
"arrow.forward" |
"arrow.forward.circle" |
"arrow.forward.circle.fill" |
"arrow.forward.square" |
"arrow.forward.square.fill" |
"arrow.up" |
"arrow.up.circle" |
"arrow.up.circle.fill" |
"arrow.up.square" |
"arrow.up.square.fill" |
"arrow.up.circle.badge.clock" |
"arrow.down" |
"arrow.down.circle" |
"arrow.down.circle.fill" |
"arrow.down.circle.dotted" |
"arrow.down.square" |
"arrow.down.square.fill" |
"arrow.up.left" |
"arrow.up.left.circle" |
"arrow.up.left.circle.fill" |
"arrow.up.left.square" |
"arrow.up.left.square.fill" |
"arrow.up.backward" |
"arrow.up.backward.circle" |
"arrow.up.backward.circle.fill" |
"arrow.up.backward.square" |
"arrow.up.backward.square.fill" |
"arrow.up.right" |
"arrow.up.right.circle" |
"arrow.up.right.circle.fill" |
"arrow.up.right.square" |
"arrow.up.right.square.fill" |
"arrow.up.forward" |
"arrow.up.forward.circle" |
"arrow.up.forward.circle.fill" |
"arrow.up.forward.square" |
"arrow.up.forward.square.fill" |
"arrow.down.left" |
"arrow.down.left.circle" |
"arrow.down.left.circle.fill" |
"arrow.down.left.square" |
"arrow.down.left.square.fill" |
"arrow.down.backward" |
"arrow.down.backward.circle" |
"arrow.down.backward.circle.fill" |
"arrow.down.backward.square" |
"arrow.down.backward.square.fill" |
"arrow.down.right" |
"arrow.down.right.circle" |
"arrow.down.right.circle.fill" |
"arrow.down.right.square" |
"arrow.down.right.square.fill" |
"arrow.down.forward" |
"arrow.down.forward.circle" |
"arrow.down.forward.circle.fill" |
"arrow.down.forward.square" |
"arrow.down.forward.square.fill" |
"arrow.left.arrow.right" |
"arrow.left.arrow.right.circle" |
"arrow.left.arrow.right.circle.fill" |
"arrow.left.arrow.right.square" |
"arrow.left.arrow.right.square.fill" |
"arrow.up.arrow.down" |
"arrow.up.arrow.down.circle" |
"arrow.up.arrow.down.circle.fill" |
"arrow.up.arrow.down.square" |
"arrow.up.arrow.down.square.fill" |
"arrow.down.left.arrow.up.right" |
"arrow.down.left.arrow.up.right.circle" |
"arrow.down.left.arrow.up.right.circle.fill" |
"arrow.down.left.arrow.up.right.square" |
"arrow.down.left.arrow.up.right.square.fill" |
"arrow.up.left.arrow.down.right" |
"arrow.up.left.arrow.down.right.circle" |
"arrow.up.left.arrow.down.right.circle.fill" |
"arrow.up.left.arrow.down.right.square" |
"arrow.up.left.arrow.down.right.square.fill" |
"arrow.turn.down.left" |
"arrow.turn.up.left" |
"arrow.turn.down.right" |
"arrow.turn.up.right" |
"arrow.turn.right.up" |
"arrow.turn.left.up" |
"arrow.turn.right.down" |
"arrow.turn.left.down" |
"arrow.uturn.left" |
"arrow.uturn.left.circle" |
"arrow.uturn.left.circle.fill" |
"arrow.uturn.left.circle.badge.ellipsis" |
"arrow.uturn.left.square" |
"arrow.uturn.left.square.fill" |
"arrow.uturn.backward" |
"arrow.uturn.backward.circle" |
"arrow.uturn.backward.circle.fill" |
"arrow.uturn.backward.circle.badge.ellipsis" |
"arrow.uturn.backward.square" |
"arrow.uturn.backward.square.fill" |
"arrow.uturn.right" |
"arrow.uturn.right.circle" |
"arrow.uturn.right.circle.fill" |
"arrow.uturn.right.square" |
"arrow.uturn.right.square.fill" |
"arrow.uturn.forward" |
"arrow.uturn.forward.circle" |
"arrow.uturn.forward.circle.fill" |
"arrow.uturn.forward.square" |
"arrow.uturn.forward.square.fill" |
"arrow.uturn.up" |
"arrow.uturn.up.circle" |
"arrow.uturn.up.circle.fill" |
"arrow.uturn.up.square" |
"arrow.uturn.up.square.fill" |
"arrow.uturn.down" |
"arrow.uturn.down.circle" |
"arrow.uturn.down.circle.fill" |
"arrow.uturn.down.square" |
"arrow.uturn.down.square.fill" |
"arrow.up.and.down.and.arrow.left.and.right" |
"arrow.up.left.and.down.right.and.arrow.up.right.and.down.left" |
"arrow.left.and.right" |
"arrow.left.and.right.circle" |
"arrow.left.and.right.circle.fill" |
"arrow.left.and.right.square" |
"arrow.left.and.right.square.fill" |
"arrow.up.and.down" |
"arrow.up.and.down.circle" |
"arrow.up.and.down.circle.fill" |
"arrow.up.and.down.square" |
"arrow.up.and.down.square.fill" |
"arrow.up.to.line" |
"arrow.up.to.line.compact" |
"arrow.up.to.line.circle" |
"arrow.up.to.line.circle.fill" |
"arrow.up.to.line.square" |
"arrow.up.to.line.square.fill" |
"arrow.down.to.line" |
"arrow.down.to.line.compact" |
"arrow.down.to.line.circle" |
"arrow.down.to.line.circle.fill" |
"arrow.down.to.line.square" |
"arrow.down.to.line.square.fill" |
"arrow.left.to.line" |
"arrow.left.to.line.compact" |
"arrow.left.to.line.circle" |
"arrow.left.to.line.circle.fill" |
"arrow.left.to.line.square" |
"arrow.left.to.line.square.fill" |
"arrow.backward.to.line" |
"arrow.backward.to.line.circle" |
"arrow.backward.to.line.circle.fill" |
"arrow.backward.to.line.square" |
"arrow.backward.to.line.square.fill" |
"arrow.right.to.line" |
"arrow.right.to.line.compact" |
"arrow.right.to.line.circle" |
"arrow.right.to.line.circle.fill" |
"arrow.right.to.line.square" |
"arrow.right.to.line.square.fill" |
"arrow.forward.to.line" |
"arrow.forward.to.line.circle" |
"arrow.forward.to.line.circle.fill" |
"arrow.forward.to.line.square" |
"arrow.forward.to.line.square.fill" |
"arrow.left.and.line.vertical.and.arrow.right" |
"arrow.right.and.line.vertical.and.arrow.left" |
"arrow.down.and.line.horizontal.and.arrow.up" |
"arrow.up.and.line.horizontal.and.arrow.down" |
"arrow.clockwise" |
"arrow.clockwise.circle" |
"arrow.clockwise.circle.fill" |
"arrow.clockwise.square" |
"arrow.clockwise.square.fill" |
"arrow.counterclockwise" |
"arrow.counterclockwise.circle" |
"arrow.counterclockwise.circle.fill" |
"arrow.counterclockwise.square" |
"arrow.counterclockwise.square.fill" |
"arrow.up.left.and.arrow.down.right" |
"arrow.up.left.and.arrow.down.right.circle" |
"arrow.up.left.and.arrow.down.right.circle.fill" |
"arrow.up.left.and.arrow.down.right.square" |
"arrow.up.left.and.arrow.down.right.square.fill" |
"arrow.up.backward.and.arrow.down.forward" |
"arrow.up.backward.and.arrow.down.forward.circle" |
"arrow.up.backward.and.arrow.down.forward.circle.fill" |
"arrow.up.backward.and.arrow.down.forward.square" |
"arrow.up.backward.and.arrow.down.forward.square.fill" |
"arrow.down.left.and.arrow.up.right" |
"arrow.down.left.and.arrow.up.right.circle" |
"arrow.down.left.and.arrow.up.right.circle.fill" |
"arrow.down.left.and.arrow.up.right.square" |
"arrow.down.left.and.arrow.up.right.square.fill" |
"arrow.down.backward.and.arrow.up.forward" |
"arrow.down.backward.and.arrow.up.forward.circle" |
"arrow.down.backward.and.arrow.up.forward.circle.fill" |
"arrow.down.backward.and.arrow.up.forward.square" |
"arrow.down.backward.and.arrow.up.forward.square.fill" |
"arrow.down.right.and.arrow.up.left" |
"arrow.down.right.and.arrow.up.left.circle" |
"arrow.down.right.and.arrow.up.left.circle.fill" |
"arrow.down.right.and.arrow.up.left.square" |
"arrow.down.right.and.arrow.up.left.square.fill" |
"arrow.down.forward.and.arrow.up.backward" |
"arrow.down.forward.and.arrow.up.backward.circle" |
"arrow.down.forward.and.arrow.up.backward.circle.fill" |
"arrow.down.forward.and.arrow.up.backward.square" |
"arrow.down.forward.and.arrow.up.backward.square.fill" |
"arrow.up.right.and.arrow.down.left" |
"arrow.up.right.and.arrow.down.left.circle" |
"arrow.up.right.and.arrow.down.left.circle.fill" |
"arrow.up.right.and.arrow.down.left.square" |
"arrow.up.right.and.arrow.down.left.square.fill" |
"arrow.up.forward.and.arrow.down.backward" |
"arrow.up.forward.and.arrow.down.backward.circle" |
"arrow.up.forward.and.arrow.down.backward.circle.fill" |
"arrow.up.forward.and.arrow.down.backward.square" |
"arrow.up.forward.and.arrow.down.backward.square.fill" |
"return" |
"return.left" |
"return.right" |
"arrow.2.squarepath" |
"arrow.triangle.2.circlepath" |
"arrow.triangle.2.circlepath.circle" |
"arrow.triangle.2.circlepath.circle.fill" |
"exclamationmark.arrow.triangle.2.circlepath" |
"gearshape.arrow.triangle.2.circlepath" |
"arrow.triangle.capsulepath" |
"arrow.3.trianglepath" |
"arrow.triangle.turn.up.right.diamond" |
"arrow.triangle.turn.up.right.diamond.fill" |
"arrow.triangle.turn.up.right.circle" |
"arrow.triangle.turn.up.right.circle.fill" |
"arrow.triangle.merge" |
"arrow.triangle.swap" |
"arrow.triangle.branch" |
"arrow.triangle.pull" |
"arrowtriangle.left" |
"arrowtriangle.left.fill" |
"arrowtriangle.left.circle" |
"arrowtriangle.left.circle.fill" |
"arrowtriangle.left.square" |
"arrowtriangle.left.square.fill" |
"arrowtriangle.backward" |
"arrowtriangle.backward.fill" |
"arrowtriangle.backward.circle" |
"arrowtriangle.backward.circle.fill" |
"arrowtriangle.backward.square" |
"arrowtriangle.backward.square.fill" |
"arrowtriangle.right" |
"arrowtriangle.right.fill" |
"arrowtriangle.right.circle" |
"arrowtriangle.right.circle.fill" |
"arrowtriangle.right.square" |
"arrowtriangle.right.square.fill" |
"arrowtriangle.forward" |
"arrowtriangle.forward.fill" |
"arrowtriangle.forward.circle" |
"arrowtriangle.forward.circle.fill" |
"arrowtriangle.forward.square" |
"arrowtriangle.forward.square.fill" |
"arrowtriangle.up" |
"arrowtriangle.up.fill" |
"arrowtriangle.up.circle" |
"arrowtriangle.up.circle.fill" |
"arrowtriangle.up.square" |
"arrowtriangle.up.square.fill" |
"arrowtriangle.down" |
"arrowtriangle.down.fill" |
"arrowtriangle.down.circle" |
"arrowtriangle.down.circle.fill" |
"arrowtriangle.down.square" |
"arrowtriangle.down.square.fill" |
"slash.circle" |
"slash.circle.fill" |
"asterisk" |
"asterisk.circle" |
"asterisk.circle.fill" |
"left" |
"left.circle" |
"left.circle.fill" |
"right" |
"right.circle" |
"right.circle.fill" |
"a.circle" |
"a.circle.fill" |
"a.square" |
"a.square.fill" |
"b.circle" |
"b.circle.fill" |
"b.square" |
"b.square.fill" |
"c.circle" |
"c.circle.fill" |
"c.square" |
"c.square.fill" |
"d.circle" |
"d.circle.fill" |
"d.square" |
"d.square.fill" |
"e.circle" |
"e.circle.fill" |
"e.square" |
"e.square.fill" |
"f.circle" |
"f.circle.fill" |
"f.square" |
"f.square.fill" |
"g.circle" |
"g.circle.fill" |
"g.square" |
"g.square.fill" |
"h.circle" |
"h.circle.fill" |
"h.square" |
"h.square.fill" |
"i.circle" |
"i.circle.fill" |
"i.square" |
"i.square.fill" |
"j.circle" |
"j.circle.fill" |
"j.square" |
"j.square.fill" |
"k.circle" |
"k.circle.fill" |
"k.square" |
"k.square.fill" |
"l.circle" |
"l.circle.fill" |
"l.square" |
"l.square.fill" |
"m.circle" |
"m.circle.fill" |
"m.square" |
"m.square.fill" |
"n.circle" |
"n.circle.fill" |
"n.square" |
"n.square.fill" |
"o.circle" |
"o.circle.fill" |
"o.square" |
"o.square.fill" |
"p.circle" |
"p.circle.fill" |
"p.square" |
"p.square.fill" |
"q.circle" |
"q.circle.fill" |
"q.square" |
"q.square.fill" |
"r.circle" |
"r.circle.fill" |
"r.square" |
"r.square.fill" |
"s.circle" |
"s.circle.fill" |
"s.square" |
"s.square.fill" |
"t.circle" |
"t.circle.fill" |
"t.square" |
"t.square.fill" |
"u.circle" |
"u.circle.fill" |
"u.square" |
"u.square.fill" |
"v.circle" |
"v.circle.fill" |
"v.square" |
"v.square.fill" |
"w.circle" |
"w.circle.fill" |
"w.square" |
"w.square.fill" |
"x.circle" |
"x.circle.fill" |
"x.square" |
"x.square.fill" |
"y.circle" |
"y.circle.fill" |
"y.square" |
"y.square.fill" |
"z.circle" |
"z.circle.fill" |
"z.square" |
"z.square.fill" |
"dollarsign" |
"dollarsign.circle" |
"dollarsign.circle.fill" |
"dollarsign.square" |
"dollarsign.square.fill" |
"centsign" |
"centsign.circle" |
"centsign.circle.fill" |
"centsign.square" |
"centsign.square.fill" |
"yensign" |
"yensign.circle" |
"yensign.circle.fill" |
"yensign.square" |
"yensign.square.fill" |
"sterlingsign" |
"sterlingsign.circle" |
"sterlingsign.circle.fill" |
"sterlingsign.square" |
"sterlingsign.square.fill" |
"francsign" |
"francsign.circle" |
"francsign.circle.fill" |
"francsign.square" |
"francsign.square.fill" |
"florinsign" |
"florinsign.circle" |
"florinsign.circle.fill" |
"florinsign.square" |
"florinsign.square.fill" |
"turkishlirasign" |
"turkishlirasign.circle" |
"turkishlirasign.circle.fill" |
"turkishlirasign.square" |
"turkishlirasign.square.fill" |
"rublesign" |
"rublesign.circle" |
"rublesign.circle.fill" |
"rublesign.square" |
"rublesign.square.fill" |
"eurosign" |
"eurosign.circle" |
"eurosign.circle.fill" |
"eurosign.square" |
"eurosign.square.fill" |
"dongsign" |
"dongsign.circle" |
"dongsign.circle.fill" |
"dongsign.square" |
"dongsign.square.fill" |
"indianrupeesign" |
"indianrupeesign.circle" |
"indianrupeesign.circle.fill" |
"indianrupeesign.square" |
"indianrupeesign.square.fill" |
"tengesign" |
"tengesign.circle" |
"tengesign.circle.fill" |
"tengesign.square" |
"tengesign.square.fill" |
"pesetasign" |
"pesetasign.circle" |
"pesetasign.circle.fill" |
"pesetasign.square" |
"pesetasign.square.fill" |
"pesosign" |
"pesosign.circle" |
"pesosign.circle.fill" |
"pesosign.square" |
"pesosign.square.fill" |
"kipsign" |
"kipsign.circle" |
"kipsign.circle.fill" |
"kipsign.square" |
"kipsign.square.fill" |
"wonsign" |
"wonsign.circle" |
"wonsign.circle.fill" |
"wonsign.square" |
"wonsign.square.fill" |
"lirasign" |
"lirasign.circle" |
"lirasign.circle.fill" |
"lirasign.square" |
"lirasign.square.fill" |
"australsign" |
"australsign.circle" |
"australsign.circle.fill" |
"australsign.square" |
"australsign.square.fill" |
"hryvniasign" |
"hryvniasign.circle" |
"hryvniasign.circle.fill" |
"hryvniasign.square" |
"hryvniasign.square.fill" |
"nairasign" |
"nairasign.circle" |
"nairasign.circle.fill" |
"nairasign.square" |
"nairasign.square.fill" |
"guaranisign" |
"guaranisign.circle" |
"guaranisign.circle.fill" |
"guaranisign.square" |
"guaranisign.square.fill" |
"coloncurrencysign" |
"coloncurrencysign.circle" |
"coloncurrencysign.circle.fill" |
"coloncurrencysign.square" |
"coloncurrencysign.square.fill" |
"cedisign" |
"cedisign.circle" |
"cedisign.circle.fill" |
"cedisign.square" |
"cedisign.square.fill" |
"cruzeirosign" |
"cruzeirosign.circle" |
"cruzeirosign.circle.fill" |
"cruzeirosign.square" |
"cruzeirosign.square.fill" |
"tugriksign" |
"tugriksign.circle" |
"tugriksign.circle.fill" |
"tugriksign.square" |
"tugriksign.square.fill" |
"millsign" |
"millsign.circle" |
"millsign.circle.fill" |
"millsign.square" |
"millsign.square.fill" |
"shekelsign" |
"shekelsign.circle" |
"shekelsign.circle.fill" |
"shekelsign.square" |
"shekelsign.square.fill" |
"manatsign" |
"manatsign.circle" |
"manatsign.circle.fill" |
"manatsign.square" |
"manatsign.square.fill" |
"rupeesign" |
"rupeesign.circle" |
"rupeesign.circle.fill" |
"rupeesign.square" |
"rupeesign.square.fill" |
"bahtsign" |
"bahtsign.circle" |
"bahtsign.circle.fill" |
"bahtsign.square" |
"bahtsign.square.fill" |
"larisign" |
"larisign.circle" |
"larisign.circle.fill" |
"larisign.square" |
"larisign.square.fill" |
"bitcoinsign" |
"bitcoinsign.circle" |
"bitcoinsign.circle.fill" |
"bitcoinsign.square" |
"bitcoinsign.square.fill" |
"australiandollarsign" |
"australiandollarsign.circle" |
"australiandollarsign.circle.fill" |
"australiandollarsign.square" |
"australiandollarsign.square.fill" |
"polishzlotysign" |
"polishzlotysign.circle" |
"polishzlotysign.circle.fill" |
"polishzlotysign.square" |
"polishzlotysign.square.fill" |
"norwegiankronesign" |
"norwegiankronesign.circle" |
"norwegiankronesign.circle.fill" |
"norwegiankronesign.square" |
"norwegiankronesign.square.fill" |
"swedishkronasign" |
"swedishkronasign.circle" |
"swedishkronasign.circle.fill" |
"swedishkronasign.square" |
"swedishkronasign.square.fill" |
"danishkronesign" |
"danishkronesign.circle" |
"danishkronesign.circle.fill" |
"danishkronesign.square" |
"danishkronesign.square.fill" |
"eurozonesign" |
"eurozonesign.circle" |
"eurozonesign.circle.fill" |
"eurozonesign.square" |
"eurozonesign.square.fill" |
"brazilianrealsign" |
"brazilianrealsign.circle" |
"brazilianrealsign.circle.fill" |
"brazilianrealsign.square" |
"brazilianrealsign.square.fill" |
"chineseyuanrenminbisign" |
"chineseyuanrenminbisign.circle" |
"chineseyuanrenminbisign.circle.fill" |
"chineseyuanrenminbisign.square" |
"chineseyuanrenminbisign.square.fill" |
"0.circle" |
"0.circle.fill" |
"0.square" |
"0.square.fill" |
"1.circle" |
"1.circle.fill" |
"1.square" |
"1.square.fill" |
"2.circle" |
"2.circle.fill" |
"2.square" |
"2.square.fill" |
"3.circle" |
"3.circle.fill" |
"3.square" |
"3.square.fill" |
"4.circle" |
"4.circle.fill" |
"4.square" |
"4.square.fill" |
"4.alt.circle" |
"4.alt.circle.fill" |
"4.alt.square" |
"4.alt.square.fill" |
"5.circle" |
"5.circle.fill" |
"5.square" |
"5.square.fill" |
"6.circle" |
"6.circle.fill" |
"6.square" |
"6.square.fill" |
"6.alt.circle" |
"6.alt.circle.fill" |
"6.alt.square" |
"6.alt.square.fill" |
"7.circle" |
"7.circle.fill" |
"7.square" |
"7.square.fill" |
"8.circle" |
"8.circle.fill" |
"8.square" |
"8.square.fill" |
"9.circle" |
"9.circle.fill" |
"9.square" |
"9.square.fill" |
"9.alt.circle" |
"9.alt.circle.fill" |
"9.alt.square" |
"9.alt.square.fill" |
"00.circle" |
"00.circle.fill" |
"00.square" |
"00.square.fill" |
"01.circle" |
"01.circle.fill" |
"01.square" |
"01.square.fill" |
"02.circle" |
"02.circle.fill" |
"02.square" |
"02.square.fill" |
"03.circle" |
"03.circle.fill" |
"03.square" |
"03.square.fill" |
"04.circle" |
"04.circle.fill" |
"04.square" |
"04.square.fill" |
"05.circle" |
"05.circle.fill" |
"05.square" |
"05.square.fill" |
"06.circle" |
"06.circle.fill" |
"06.square" |
"06.square.fill" |
"07.circle" |
"07.circle.fill" |
"07.square" |
"07.square.fill" |
"08.circle" |
"08.circle.fill" |
"08.square" |
"08.square.fill" |
"09.circle" |
"09.circle.fill" |
"09.square" |
"09.square.fill" |
"10.circle" |
"10.circle.fill" |
"10.square" |
"10.square.fill" |
"11.circle" |
"11.circle.fill" |
"11.square" |
"11.square.fill" |
"12.circle" |
"12.circle.fill" |
"12.square" |
"12.square.fill" |
"13.circle" |
"13.circle.fill" |
"13.square" |
"13.square.fill" |
"14.circle" |
"14.circle.fill" |
"14.square" |
"14.square.fill" |
"15.circle" |
"15.circle.fill" |
"15.square" |
"15.square.fill" |
"16.circle" |
"16.circle.fill" |
"16.square" |
"16.square.fill" |
"17.circle" |
"17.circle.fill" |
"17.square" |
"17.square.fill" |
"18.circle" |
"18.circle.fill" |
"18.square" |
"18.square.fill" |
"19.circle" |
"19.circle.fill" |
"19.square" |
"19.square.fill" |
"20.circle" |
"20.circle.fill" |
"20.square" |
"20.square.fill" |
"21.circle" |
"21.circle.fill" |
"21.square" |
"21.square.fill" |
"22.circle" |
"22.circle.fill" |
"22.square" |
"22.square.fill" |
"23.circle" |
"23.circle.fill" |
"23.square" |
"23.square.fill" |
"24.circle" |
"24.circle.fill" |
"24.square" |
"24.square.fill" |
"25.circle" |
"25.circle.fill" |
"25.square" |
"25.square.fill" |
"26.circle" |
"26.circle.fill" |
"26.square" |
"26.square.fill" |
"27.circle" |
"27.circle.fill" |
"27.square" |
"27.square.fill" |
"28.circle" |
"28.circle.fill" |
"28.square" |
"28.square.fill" |
"29.circle" |
"29.circle.fill" |
"29.square" |
"29.square.fill" |
"30.circle" |
"30.circle.fill" |
"30.square" |
"30.square.fill" |
"31.circle" |
"31.circle.fill" |
"31.square" |
"31.square.fill" |
"32.circle" |
"32.circle.fill" |
"32.square" |
"32.square.fill" |
"33.circle" |
"33.circle.fill" |
"33.square" |
"33.square.fill" |
"34.circle" |
"34.circle.fill" |
"34.square" |
"34.square.fill" |
"35.circle" |
"35.circle.fill" |
"35.square" |
"35.square.fill" |
"36.circle" |
"36.circle.fill" |
"36.square" |
"36.square.fill" |
"37.circle" |
"37.circle.fill" |
"37.square" |
"37.square.fill" |
"38.circle" |
"38.circle.fill" |
"38.square" |
"38.square.fill" |
"39.circle" |
"39.circle.fill" |
"39.square" |
"39.square.fill" |
"40.circle" |
"40.circle.fill" |
"40.square" |
"40.square.fill" |
"41.circle" |
"41.circle.fill" |
"41.square" |
"41.square.fill" |
"42.circle" |
"42.circle.fill" |
"42.square" |
"42.square.fill" |
"43.circle" |
"43.circle.fill" |
"43.square" |
"43.square.fill" |
"44.circle" |
"44.circle.fill" |
"44.square" |
"44.square.fill" |
"45.circle" |
"45.circle.fill" |
"45.square" |
"45.square.fill" |
"46.circle" |
"46.circle.fill" |
"46.square" |
"46.square.fill" |
"47.circle" |
"47.circle.fill" |
"47.square" |
"47.square.fill" |
"48.circle" |
"48.circle.fill" |
"48.square" |
"48.square.fill" |
"49.circle" |
"49.circle.fill" |
"49.square" |
"49.square.fill" |
"50.circle" |
"50.circle.fill" |
"50.square" |
"50.square.fill" |
"apple.logo";

export interface SFSymbolURISource extends Omit<ImageURISource, "uri"> {
    /**
     * The SF Symbol to use as image
     * @platform ios
     */
    uri: SFSymbols;
}

/**
 * Defines the Navigation Stack Props contract
 */
export interface NavigationStackProps {
    /**
     * The link to navigate to when Scenes in the stack are unregistered
     */
    stackInvalidatedLink?: string;
     /**
     * The Scene's title
     */
    title?: (state: State, data: any) => string;
    /**
     * The Scene's to and from crumb trail style
     * @platform android
     */
    crumbStyle?: ((from: boolean, state: State, data: any, crumbs: Crumb[], nextState?: State, nextData?: any) => string | Transition) | Transition;
    /**
     * The Scene's to and from unmount style
     */
    unmountStyle?: ((from: boolean, state: State, data: any, crumbs: Crumb[]) => string | Transition) | Transition;
    /**
     * Indicates whether the Scene should display the tab bar
     * @platform ios
     */
    hidesTabBar?: (state: State, data: any, crumbs: Crumb[]) => boolean;
    /**
     * The Scene's shared element
     * @platform android
     */
    sharedElement?: (state: State, data: any, crumbs: Crumb[]) => string;
    /**
     * The Scene's shared elements
     * @platform android
     */
    sharedElements?: (state: State, data: any, crumbs: Crumb[]) => string | string[];
    /**
     * The color of the Scene's background
     */
    backgroundColor?: (state: State, data: any, crumbs: Crumb[]) => ColorValue;
    /**
     * The color of the background behind the Scenes
     * @platform android
     */
    underlayColor?: ColorValue | ((state: State, data: any, crumbs: Crumb[]) => ColorValue);
    /**
     * The Scene's orientation
     * @platform android
     */
    landscape?: (state: State, data: any, crumbs: Crumb[]) => boolean;
    /**
     * Renders the Scene for the State and data
     */
    renderScene?: (state: State, data: any) => ReactNode;
    /**
     * The Scenes
     */
    children?: any;
}

/**
 * Renders a stack of Scenes
 */
export class NavigationStack extends Component<NavigationStackProps> { }

/**
 * Defines the Scene Props contract
 */
 export interface SceneProps<NavigationInfo extends { [index: string]: any } = any> {
    /**
     * The key of the corresponding State
     */
    stateKey: keyof NavigationInfo & string;
    /**
     * A Scene's to and from crumb trail style
     * @platform android
     */
    crumbStyle?: ((from: boolean, data: any, crumbs: Crumb[], nextState?: State, nextData?: any) => string | Transition) | Transition;
    /**
     * A Scene's to and from unmount style
     */
    unmountStyle?: ((from: boolean, data: any, crumbs: Crumb[]) => string | Transition) | Transition;
    /**
     * Indicates whether a Scene should display the tab bar
     * @platform ios
     */
    hidesTabBar?: boolean | ((data: any, crumbs: Crumb[]) => boolean);
    /**
     * A Scene's shared element
     * @platform android
     */
    sharedElement?: string | ((data: any, crumbs: Crumb[]) => string);
    /**
     * A Scene's shared elements
     * @platform android
     */
    sharedElements?: string | string[] | ((data: any, crumbs: Crumb[]) => string | string[]);
    /**
     * The color of a Scene's background
     */
    backgroundColor?: ColorValue | ((data: any, crumbs: Crumb[]) => ColorValue);
    /**
     * The color of the background behind the Scene
     * @platform android
     */
    underlayColor?: ColorValue | ((data: any, crumbs: Crumb[]) => ColorValue);
    /**
     * A Scene's orientation
     * @platform android
     */
    landscape?: boolean | ((data: any, crumbs: Crumb[]) => boolean);
     /**
     * The Scene content
     */
    children: ReactNode;
}

/**
 * Configures the Scene for a State
 */
export class Scene<NavigationInfo extends { [index: string]: any } = any> extends Component<SceneProps<NavigationInfo>> {}

/**
 * Defines the Navigation Bar Props contract
 */
export interface NavigationBarProps {
    /**
     * Indicates whether to hide the navigation bar
     */
    hidden?: boolean;
    /**
     * Indicates whether the title should be large
     */
    largeTitle?: boolean;
    /**
     * The title
     */
    title?: string;
    /**
     * The background color of the navigation bar
     */
    barTintColor?: ColorValue | ((standard: boolean) => ColorValue);
    /**
     * The color of foreground elements on the navigation bar
     */
    tintColor?: ColorValue | ((standard: boolean) => ColorValue);
    /**
     * The shadow color of the navigation bar
     */
    shadowColor?: ColorValue;
    /**
     * The color of the title view
     */
    titleColor?: ColorValue | ((standard: boolean) => ColorValue);
    /**
     * Indicates whether to center the title within the navigation bar
     * @platform android
     */
    titleCentered?: boolean;
    /**
     * The title for the back button
     * @platform ios
     */
    backTitle?: string;
    /**
     * The back button image
     * @platform ios
     */
    backImage?: ImageRequireSource | ImageURISource;
    /**
     * The logo
     * @platform android
     */
    logo?: ImageRequireSource | ImageURISource;
    /**
     * The menu overflow image
     * @platform android
     */
    overflowImage?: ImageRequireSource | ImageURISource;
    /**
     * The navigation button image
     * @platform android
     */
    navigationImage?: ImageRequireSource | ImageURISource;
    /**
     * The accessible description of the navigation button
     * @platform android
     */
    navigationAccessibilityLabel?: string;
    /**
     * The title font family
     */
    titleFontFamily?: string | ((standard: boolean) => string);
    /**
     * The title font weight
     */
    titleFontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500'
        | '600' | '700' | '800' | '900' | ((standard: boolean) => 'normal' | 'bold'
        | '100' | '200' | '300' | '400' | '500'| '600' | '700' | '800' | '900');
    /**
     * The title font style
     */
    titleFontStyle?: 'normal' | 'italic' | ((standard: boolean) => 'normal' | 'italic');
    /**
     * The title font size
     */
    titleFontSize?: number | ((standard: boolean) => number);
    /**
     * The back button font family
     * @platform ios
     */
    backFontFamily?: string;
    /**
     * The back button font weight
     * @platform ios
     */
    backFontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500'
        | '600' | '700' | '800' | '900';
    /**
     * The back button font style
     * @platform ios
     */
    backFontStyle?: 'normal' | 'italic';
    /**
     * The back button font size
     * @platform ios
     */
    backFontSize?: number;
    /**
     * Indicates whether to render as a bottom app bar
     * @platform android
     */
    bottomBar?: boolean;
    /**
     * The position of the anchored floating action button
     * @platform android
     */
    fabAlignmentMode?: 'center' | 'end';
    /**
     * The animation that runs when the floating action button changes position
     * @platform android
     */
    fabAnimationMode?: 'slide' | 'scale';
    /**
     * The cradle margin for the floating action button cutout
     * @platform android
     */
    fabCradleMargin?: number;
    /**
     * The rounded corner radius for the floating action button cutout
     * @platform android
     */
    fabCradleRoundedCornerRadius?: number;
    /**
     * The vertical offset for the floating action button cutout
     * @platform android
     */
    fabCradleVerticalOffset?: number;
    /**
     * Indicates whether to hide the bottom navigation bar when scrolling
     * @platform android
     */
    hideOnScroll?: boolean;
    /**
     * The id of the back button in end-to-end tests
     * @platform ios
     */
    backTestID?: string;
    /**
     * The id of the navigation button in end-to-end tests
     * @platform android
     */
    navigationTestID?: string;
    /**
     * The id of the overflow button in end-to-end tests
     * @platform android
     */
    overflowTestID?: string;
    /**
     * Handles navigation button press events
     * @platform android
     */
    onNavigationPress?: () => void;
    /**
     * Handles offset change events
     * @platform android
     */
    onOffsetChanged?: (e: NativeSyntheticEvent<{offset: number}>) => void;
    /**
     * The navigation bar content
     */
    children?: ReactNode;
}

/**
 * Controls the appearance of the UI navigation bar
 */
export class NavigationBar extends Component<NavigationBarProps> { }

/**
 * Defines the Left Bar Props contract
 */
export interface LeftBarProps {
    /**
     * Indicates whether bar buttons display in addition to the back button
     * @platform ios
     */
    supplementBack?: boolean;
    /**
     * The buttons
     */
    children: ReactNode;
}

/**
 * Renders buttons in the left UI bar
 */
export class LeftBar extends Component<LeftBarProps> { }

/**
 * Defines the Right Bar Props contract
 */
export interface RightBarProps {
    /**
     * The buttons
     */
    children: ReactNode;
}

/**
 * Renders buttons in the right UI bar
 */
export class RightBar extends Component<RightBarProps> { }

/**
 * Defines the Title Bar Props contract
 */
export interface TitleBarProps {
    /**
     * The style
     */
    style?: StyleProp<ViewStyle>;
    /**
     * The title view
     */
    children: ReactNode;
}

/**
 * Renders titleView in the UI navigation bar
 */
export class TitleBar extends Component<TitleBarProps> {  }

/**
 * Defines the Bar Button Props contract
 */
export interface BarButtonProps {
    /**
     * The button title
     */
    title?: string;
    /**
     * The button image
     */
    image?: ImageRequireSource | ImageURISource | SFSymbolURISource;
    /**
     * The button system item
     * @platform ios
     */
    systemItem?: 'done' | 'cancel' | 'edit' | 'save' | 'add' | 'flexibleSpace'
        | 'fixedSpace' | 'compose' | 'reply' | 'action' | 'organize'
        | 'bookmarks' | 'search' | 'refresh' | 'stop' | 'camera'
        | 'trash' | 'play' | 'pause' | 'rewind' | 'fastForward';
    /**
     * Determines when this item should appear in the navigation bar
     * @platform android
     */
    show?: 'ifRoom' | 'never' | 'always';
    /**
     * Indicates whether this item opens the search bar
     * @platform android
     */
    search?: boolean;
    /**
     * The button font family
     */
    fontFamily?: string;
    /**
     * The button font weight
     */
    fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500'
        | '600' | '700' | '800' | '900';
    /**
     * The button font style
     */
    fontStyle?: 'normal' | 'italic';
    /**
     * The button font size
     */
    fontSize?: number;
    /**
     * The button title and image color
     */
    tintColor?: ColorValue;
    /**
     * The id of the button in end-to-end tests
     */
    testID?: string;
    /**
     * The custom view size
     * @platform android
     */
    size?: number;
    /**
     * The button view
     */
    children?: ReactNode;
     /**
     * Handles button press events
     */
    onPress?: () => void;
}

/**
 * Renders a button in the UI bar
 */
export class BarButton extends Component<BarButtonProps> { }

/**
 * Defines the Search Bar Props contract
 */
export interface SearchBarProps {
    /**
     * Indicates whether the search bar takes over the toolbar
     * @platform android
     */
    toolbar?: boolean;
    /**
     * Indicates whether the search is active
     */
    active?: boolean;
    /**
     * Indicates whether to to obscure the underlying content
     * @platform ios
     */
    obscureBackground?: boolean;
    /**
     * Indicates whether to hide the navigation bar
     * @platform ios
     */
    hideNavigationBar?: boolean;
    /**
     * Indicates whether to hide the search bar when scrolling
     * @platform ios
     */
    hideWhenScrolling?: boolean;
    /**
     * The auto-capitalization behavior
     */
    autoCapitalize?: 'none' | 'words' | 'sentences' | 'allCharacters';
    /**
     * Text displayed when search field is empty
     */
    placeholder?: string | ((toolbar: boolean) => string);
    /**
     * The search field text
     */
    text?: string;
    /**
     * The search field font family
     */
    fontFamily?: string;
    /**
     * The search field font weight
     */
    fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500'
        | '600' | '700' | '800' | '900';
    /**
     * The search field font style
     */
    fontStyle?: 'normal' | 'italic';
    /**
     * The search field font size
     */
    fontSize?: number;
    /**
     * The search field background color
     */
    barTintColor?: ColorValue | ((toolbar: boolean) => ColorValue);
    /**
     * The selected scope button
     * @platform ios
     */
    scopeButton?: string;
    /**
     * The scope button titles
     * @platform ios
     */
    scopeButtons?: string[];
    /**
     * The search results
     */
    children: ReactNode;
    /**
     * Handles text change events
     */
    onChangeText?: (text: string) => void;
    /**
     * Handles search press events
     */
    onQuery?: (text: string) => void;
    /**
     * Handles active change events
     */
    onChangeActive?: (active: boolean) => void;
    /**
     * Handles scope button change events
     * @platform ios
     */
    onChangeScopeButton?: (scopeButton: string) => void;
}

/**
 * Renders a search bar in the UI navigation bar
 */
export class SearchBar extends Component<SearchBarProps> { }

/**
 * Defines the Coordinator Layout Props contract
 */
export interface CoordinatorLayoutProps {
    /**
     * The distance the scrolled content overlaps the navigation bar
     */
    overlap?: number;   
    /**
     * The layout content
     */
    children: ReactNode;
}

/**
 * Container that supports collapsing the navigation bar
 * @platform android
 */
export class CoordinatorLayout extends Component<CoordinatorLayoutProps> {}

/**
 * Defines the Collapsing Bar Props contract
 */
export interface CollapsingBarProps {
    /**
     * Indicates the effect used to collapse and expand the title
     */
    titleCollapseMode?: 'fade' | 'scale';
    /**
     * The collapsing bar content
     */
    children?: ReactNode;
}

/**
 * Renders collapsing content inside the navigation bar
 * @platform android
 */
export class CollapsingBar extends Component<CollapsingBarProps> {}

/**
 * Defines the Action Bar Props contract
 */
export interface ActionBarProps {
    /**
     * The action view
     */
    children: ReactNode;
    /**
     * Handles action bar expanded events
     */
    onExpanded?: () => void;
    /**
     * Handles action bar collapsed events
     */
    onCollapsed?: () => void;
}

/**
 * Renders an action bar in the UI navigation bar
 * @platform android
 */
export class ActionBar extends Component<ActionBarProps> {}

/**
 * Defines the Status Bar Props contract
 */
export interface StatusBarProps {
    /**
     * Indicates whether to hide the status bar
     */
    hidden?: boolean;
    /**
     * The color of foreground elements on the status bar
     */
    tintStyle?: 'light' | 'dark';
    /**
     * The background color of the status bar
     * @platform android
     */
    barTintColor?: ColorValue;
}

/**
 * Renders the status bar
 */
export class StatusBar extends Component<StatusBarProps> {}

/**
 * Defines the Shared Element Props contract
 */
export interface SharedElementProps {
    /**
     * The name shared across Scenes by the two elements
     */
    name: string;
    /**
     * The duration of the transition
     */
    duration?: number;
    /**
     * The fade mode used to swap the content of the two elements
     */
    fadeMode?: 'in' | 'out' | 'cross' | 'through';
    /**
     * The style
     */
    style?: StyleProp<ViewStyle>;
    /**
     * The shared content
     */
    children: ReactNode;
}

/**
 * Shares its child UI element between scenes during navigation
 * @platform android
 */
export class SharedElement extends Component<SharedElementProps> {}

/**
 * The context for overriding default hardware back handling
 * @platform android
 */
export var BackHandlerContext: Context<BackHandler>;

/**
 * Defines the Tab Bar Item Props contract
 */
export interface TabBarItemProps {
    /**
     * The tab title
     */
    title?: string;
    /**
     * The tab badge value
     */
    badge?: string | number;
    /**
     * The tab badge background color
     */
    badgeColor?: ColorValue;
    /**
     * The tab image
     */
    image?: ImageRequireSource | ImageURISource | SFSymbolURISource | string;
    /**
     * The tab system item
     * @platform ios
     */
    systemItem?: 'bookmarks' | 'contacts' | 'downloads' | 'favorites'
        | 'featured' | 'history' | 'more' | 'most-recent' | 'most-viewed'
        | 'recents' | 'search' | 'top-rated';
    /**
     * The tab font family
     */
    fontFamily?: string;
    /**
     * The tab font weight
     */
    fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500'
        | '600' | '700' | '800' | '900';
    /**
     * The tab font style
     */
    fontStyle?: 'normal' | 'italic';
    /**
     * The tab font size
     */
    fontSize?: number;
    /**
     * The id of the tab in end-to-end tests
     */
    testID?: string;
    /**
     * The tab content
     */
    children: ReactNode;
    /**
     * Handles button press events
     */
    onPress?: () => void;
}

/**
 * Renders a tab in the tab bar
 */
export class TabBarItem extends Component<TabBarItemProps> {}

/**
 * The context for freezing unvisited tabs
 */
 export var TabBarItemContext: Context<{ onLoad: () => void; }>;

/**
 * Defines the Tab Bar Props contract
 */
export interface TabBarProps {
    /**
     * The background color of the tab bar
     */
    barTintColor?: ColorValue;
    /**
     * The color of the selected content within the tab bar
     */
    selectedTintColor?: ColorValue;
    /**
     * The color of unselected content within the tab bar
     */
    unselectedTintColor?: ColorValue;
    /**
     * The color of the active indicator within the tab bar
     * @platform android
     */
    activeIndicatorColor?: ColorValue;
    /**
     * The ripple color of the tab bar
     * @platform android
     */
    rippleColor?: ColorValue;
    /**
     * The shadow color of the tab bar
     */
    shadowColor?: ColorValue;
    /**
     * Indicates whether the tabs should be at the bottom
     */
    bottomTabs?: boolean;
    /**
     * Indicates whether the tab bar is for top level navigation
     */
    primary?: boolean;
    /**
     * Indicates whether the tab bar can be scrolled horizontally
     * @platform android
     */
    scrollable?: boolean;
    /**
     * Indicates whether to scroll to the top when the tab is reselected
     */
    scrollsToTop?: boolean;
    /**
     * The default selected tab index
     */
    defaultTab?: number;
    /**
     * Indicates how labels should be displayed in the tab bar
     * @platform android
     */
    labelVisibilityMode?: 'auto' | 'labeled' | 'unlabeled' | 'selected';
    /**
     * The selected tab index
     */
    tab?: number;
    /**
     * The tabs
     */
    children: ReactElement<TabBarItem> | ReactElement<TabBarItem>[];
    /**
     * Handles tab change events
     */
    onChangeTab?: (tab: number) => void;
    /**
     * Handles back button press events
     * @platform android
     */
    onPressBack?: () => boolean;
}

/**
 * Renders a tab bar
 */
export class TabBar extends Component<TabBarProps> {}

/**
 * Defines the Bottom Sheet Props contract
 */
export interface BottomSheetProps {
    /**
     * Indicates whether the bottom sheet disables the scene behind
     */
    modal?: boolean;
    /**
     * The height of the bottom sheet when it is collapsed
     */
    peekHeight?: number;
    /**
     * The height of the bottom sheet when it is expanded
     */
    expandedHeight?: number;
    /**
     * The top offset of the bottom sheet when it is expanded
     */
    expandedOffset?: number;
    /**
     * Determines the height of the bottom sheet when it is half expanded
     */
    halfExpandedRatio?: number;
    /**
     * Indicates whether the bottom sheet can hide when it is swiped down
     */
    hideable?: boolean;
    /**
     * Indicates whether swipe down hides the bottom sheet after it is expanded
     */
    skipCollapsed?: boolean;
    /**
     * Indicates whether the bottom sheet can be collapsed/expanded by dragging
     */
    draggable?: boolean;
    /**
     * The default resting state of the bottom sheet
     */
    defaultDetent?: 'hidden' | 'collapsed' | 'halfExpanded' | 'expanded';
    /**
     * The resting state of the bottom sheet
     */
    detent?: 'hidden' | 'collapsed' | 'halfExpanded' | 'expanded';
    /**
     * The bottom sheet content
     */
    children: ReactNode;
    /**
     * Handles the bottom sheet resting state change events
     */
    onChangeDetent?: (detent: 'hidden' | 'collapsed' | 'halfExpanded' | 'expanded') => void;
}

/**
 * Renders a bottom sheet
 */
export class BottomSheet extends Component<BottomSheetProps> {}

/**
 * Defines the Floating Action Button Props contract
 */
export interface FloatingActionButtonProps {
    /**
     * The floating action button image
     */
    image: ImageRequireSource | ImageURISource | string;
    /**
     * The floating action button text
     */
    text?: string;
    /**
     * The view the floating action button is anchored to
     */
    anchor?: number | null | 'navigationBar' | 'bottomNavigationBar' | 'bottomSheet';
    /**
     * The layout position of the floating action button
     */
    gravity?: 'topLeft' | 'topStart' | 'top' | 'topRight' | 'topEnd'
        | 'left' | 'start' | 'center' | 'right' | 'end' | 'bottomLeft'
        | 'bottomStart' | 'bottom' | 'bottomRight' |  'bottomEnd';
    /**
     * The relative position of the floating action button within the anchor
     */
    anchorGravity?: 'topLeft' | 'topStart' | 'top' | 'topRight' | 'topEnd'
        | 'left' | 'start' | 'center' | 'right' | 'end' | 'bottomLeft'
        | 'bottomStart' | 'bottom' | 'bottomRight' |  'bottomEnd';
    /**
     * The size of the floating action button
     */
    size?: number;
    /**
     * The accessible description of the floating action button
     */
    contentDescription?: string;
    /**
     * The ripple color of the floating action button
     */
    rippleColor?: ColorValue;
    /**
     * The id of the floating action button in end-to-end tests
     */
    testID?: string;
     /**
     * The style
     */
    style?: StyleProp<FloatingActionButtonStyle>;
    /**
     * Handles floating action button press events
     */
    onPress?: () => void;
}

/**
 * Defines the Floating Action Button Style Prop contract
 */
export interface FloatingActionButtonStyle extends TransformsStyle {
    backgroundColor?: ColorValue;
    color?: ColorValue;
    margin?: number;
    marginBottom?: number;
    marginEnd?: number;
    marginHorizontal?: number;
    marginLeft?: number;
    marginRight?: number;
    marginStart?: number;
    marginTop?: number;
    opacity?: number;
    elevation?: number;
    fontFamily?: string;
    fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500'
        | '600' | '700' | '800' | '900';
    fontStyle?: 'normal' | 'italic';
    fontSize?: number;
}

/**
 * Renders a floating action button
 * @platform android
 */
export class FloatingActionButton extends Component<FloatingActionButtonProps> {}

/**
 * Defines the Modal Back Handler Props contract
 */
export interface ModalBackHandlerProps {
    children: (handleBack: () => boolean) => ReactNode;
}

/**
 * Handles the hardware back button inside a Modal
 * @platform android
 */
export class ModalBackHandler extends Component<ModalBackHandlerProps> {}

/**
 * Registers callback for when navigating back to this Scene from another
 * @param handler The navigating event handler
 */
export function useNavigating(handler: (data: any, url: string, history: boolean, currentContext: StateContext) => void) : void;

/**
 * Registers callback for when another Scene has navigated to this Scene
 * @param handler The navigated event handler
 */
export function useNavigated(handler: () => void) : void;

/**
 * Registers callback for when this Scene navigates to another Scene
 * @param handler The unloading event handler
 */
export function useUnloading(handler: (state: State, data: any, url: string, history: boolean, crumbs: Crumb[]) => boolean) : void;

/**
 * Registers callback for when this Scene has navigated to another Scene
 * @param handler The unloaded event handler
 */
export function useUnloaded(handler: (state: State, data: any, stateContext: StateContext) => void) : void;
