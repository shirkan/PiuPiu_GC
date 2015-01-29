/**
 * Created by shirkan on 1/27/15.
 */

import ui.TextView as TextView;
import ui.View as View;

exports = Class(View, function(supr) {
	this.init = function (opts) {
		supr(this, 'init', [opts]);

		this.levelHeader = new TextView({
			name: "levelHeader",
			superview: this,
			fontFamily : PiuPiuConsts.fontName,
			size: PiuPiuConsts.fontSizeBig,
			strokeWidth: PiuPiuConsts.fontStrokeSize,
			text: "Level " + PiuPiuGlobals.currentLevel,
			color: 'yellow',
			strokeColor: 'blue',
			horizontalAlign: 'center',
			width: PiuPiuGlobals.winSize.width,
			height: PiuPiuConsts.fontSizeBig,
			zIndex: PiuPiuConsts.statusZIndex,
			x: 0,
			y: PiuPiuConsts.fontSizeBig / 2
		});
		this.levelHeader.hide();

		this.hintText = new TextView({
			name: "hintText",
			superview: this,
			fontFamily : PiuPiuConsts.fontName,
			size: PiuPiuConsts.fontSizeNormal,
			strokeWidth: PiuPiuConsts.fontStrokeSize,
			text: PiuPiuLevelSettings.hint,
			wrap: true,
			color: 'yellow',
			strokeColor: 'blue',
			horizontalAlign: 'center',
			verticalAlign: 'top',
			width: PiuPiuGlobals.winSize.width,
			height: PiuPiuConsts.fontSizeNormal * 3,
			zIndex: PiuPiuConsts.statusZIndex,
			x: 0,
			y: PiuPiuConsts.fontSizeBig * 1.5
		});
		this.hintText.hide();
	};

	this.show = function () {
		supr(this, 'show');
		const SHOW_HINT_TEXT_TIMEOUT = 1000;

		this.levelHeader.setText("Level " + PiuPiuGlobals.currentLevel);
		this.levelHeader.show();

		this.hintText.setText(PiuPiuLevelSettings.hint);
		this.hintText.hide();

		this.timer = setTimeout(bind(this, function () { this.hintText.show();}), SHOW_HINT_TEXT_TIMEOUT);
	};

	this.reset = function () {
		this.levelHeader.hide();
		this.hintText.hide();
		clearTimeout(this.timer);
	};
});