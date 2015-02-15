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

		this.levelType = new TextView({
			name: "levelType",
			superview: this,
			fontFamily : PiuPiuConsts.fontName,
			size: PiuPiuConsts.fontSizeNormal,
			strokeWidth: PiuPiuConsts.fontStrokeSize,
			color: 'blue',
			strokeColor: 'yellow',
			horizontalAlign: 'center',
			width: PiuPiuGlobals.winSize.width,
			height: PiuPiuConsts.fontSizeNormal,
			zIndex: PiuPiuConsts.statusZIndex,
			x: 0,
			y: PiuPiuConsts.fontSizeBig * 1.5
		});
		this.levelType.hide();

		this.hintText = new TextView({
			name: "hintText",
			superview: this,
			fontFamily : PiuPiuConsts.fontName,
			size: PiuPiuConsts.fontSizeNormal,
			strokeWidth: PiuPiuConsts.fontStrokeSize,
			wrap: true,
			color: 'yellow',
			strokeColor: 'blue',
			horizontalAlign: 'center',
			verticalAlign: 'top',
			width: PiuPiuGlobals.winSize.width,
			height: PiuPiuConsts.fontSizeNormal * 3,
			zIndex: PiuPiuConsts.statusZIndex,
			x: 0,
			y: PiuPiuConsts.fontSizeBig * 1.5 + PiuPiuConsts.fontSizeNormal
		});
		this.hintText.hide();
	};

	this.show = function () {
		supr(this, 'show');
		/** @const */ var SHOW_TYPE_TEXT_TIMEOUT = 750;
		/** @const */ var SHOW_HINT_TEXT_TIMEOUT = 1500;

		this.levelHeader.setText("Level " + PiuPiuGlobals.currentLevel);
		this.levelHeader.show();

		this.levelType.setText(levelType.text[PiuPiuLevelSettings.levelType]);
		this.levelType.hide();

		this.hintText.setText(PiuPiuLevelSettings.hint);
		this.hintText.hide();

		this.timerType = setTimeout(bind(this, function () { this.levelType.show();}), SHOW_TYPE_TEXT_TIMEOUT);
		this.timerHint = setTimeout(bind(this, function () { this.hintText.show();}), SHOW_HINT_TEXT_TIMEOUT);
	};

	this.reset = function () {
		this.levelHeader.hide();
		this.hintText.hide();
		clearTimeout(this.timerType);
		clearTimeout(this.timerHint);
	};
});