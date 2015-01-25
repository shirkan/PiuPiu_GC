/**
 * Created by shirkan on 1/21/15.
 */

import ui.View as View;
import ui.ImageView as ImageView;
import ui.TextView as TextView;
import animate;

const LIFE_WIDTH = 40;
const LIFE_HEIGHT = 60;

exports = Class(View, function (supr) {
	this.init = function (opts) {
		supr(this, 'init', [opts]);
		this.build();
	};

	this.build = function () {
		//  Add score text on upper right side
		this.scoreText = new TextView({
			name: "scoreText",
			superview: this,
			fontFamily : PiuPiuConsts.fontName,
			size: PiuPiuConsts.fontSizeStatus,
			text: "Score: 0",
			color: "yellow",
			strokeColor: "blue",
			strokeWidth: PiuPiuConsts.fontStrokeSizeStatus,
			horizontalAlign: 'left',
			width: PiuPiuGlobals.winSize.width * 0.2,
			height: PiuPiuConsts.fontSizeStatus,
			zIndex: PiuPiuConsts.statusZIndex,
			x: PiuPiuGlobals.winSize.width * 0.8,
			y: (LIFE_HEIGHT  - PiuPiuConsts.fontSizeStatus) / 2
		});

		//  Add lives on upper left corner
		var livesImage = new ImageView({
			superview : this,
			width : LIFE_WIDTH,
			height : LIFE_HEIGHT,
			image: res.Life_png
		});

		this.livesText = new TextView({
			name: "livesText",
			superview: this,
			fontFamily : PiuPiuConsts.fontName,
			size: PiuPiuConsts.fontSizeStatus,
			text: "x",
			color: "yellow",
			strokeColor: "blue",
			strokeWidth: PiuPiuConsts.fontStrokeSizeStatus,
			horizontalAlign: 'left',
			width: PiuPiuGlobals.winSize.width,
			height: PiuPiuConsts.fontSizeStatus,
			zIndex: PiuPiuConsts.statusZIndex,
			x: LIFE_WIDTH + 10,
			y: (LIFE_HEIGHT  - PiuPiuConsts.fontSizeStatus) / 2
		});
	};

	this.updateScore = function (score) {
		this.scoreText.setText("Score: " + score);
	};

	this.updateLives = function (lives) {
		this.livesText.setText("x" + lives);
	};

	this.displayHeaderMessage = function (msg) {
		var headerMessage = new TextView({
			name: "headerMessage",
			superview: this,
			fontFamily : PiuPiuConsts.fontName,
			size: PiuPiuConsts.fontSizeStatus,
			text: msg,
			color: "yellow",
			strokeColor: "blue",
			strokeWidth: PiuPiuConsts.fontStrokeSizeStatus,
			horizontalAlign: 'center',
			width: PiuPiuGlobals.winSize.width,
			height: PiuPiuConsts.fontSizeStatus,
			zIndex: PiuPiuConsts.statusZIndex,
			opacity : 1,
			x: 0,
			y: (LIFE_HEIGHT  - PiuPiuConsts.fontSizeStatus) / 2
		});
		animate(headerMessage).now({opacity : 0}, 2000);
	};

	this.displayGameOver = function () {

	};

	this.displayLevelCompleted = function () {

	};
});