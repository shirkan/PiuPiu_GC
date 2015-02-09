/**
 * Created by shirkan on 1/21/15.
 */

import ui.View as View;
import ui.ImageView as ImageView;
import ui.TextView as TextView;
import animate;

/** @const */ var LIFE_WIDTH = 40;
/** @const */ var LIFE_HEIGHT = 60;
/** @const */ var positiveSentences = ["YEAH!!!", "You are the man!", "Beat'em all!", "This is how it should be done!", "MASTER!",
	"They keep underestimating you!", "Way to go man!", "Ay Caramba!", "SWEET!", "KABOOM!"];

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

		//  Prepare header message
		this.headerMessage = new TextView({
			name: "headerMessage",
			superview: this,
			fontFamily : PiuPiuConsts.fontName,
			size: PiuPiuConsts.fontSizeStatus,
			text: "",
			color: "yellow",
			strokeColor: "blue",
			strokeWidth: PiuPiuConsts.fontStrokeSizeStatus,
			horizontalAlign: 'center',
			width: PiuPiuGlobals.winSize.width,
			height: PiuPiuConsts.fontSizeStatus,
			zIndex: PiuPiuConsts.statusZIndex,
			opacity : 0,
			x: 0,
			y: (LIFE_HEIGHT  - PiuPiuConsts.fontSizeStatus) / 2
		});

		//  Prepare game over message
		this.gameOverMessage = new TextView({
			name: "gameOverMessage",
			superview: this,
			fontFamily : PiuPiuConsts.fontName,
			size: PiuPiuConsts.fontSizeBig,
			strokeWidth: PiuPiuConsts.fontStrokeSize,
			text: "Game Over",
			color: 'red',
			strokeColor: 'white',
			horizontalAlign: 'center',
			width: PiuPiuGlobals.winSize.width,
			height: PiuPiuConsts.fontSizeBig,
			anchorX: PiuPiuGlobals.winSize.width / 2,
			anchorY: PiuPiuConsts.fontSizeBig / 2,
			zIndex: PiuPiuConsts.statusZIndex,
			x: 0,
			y: (PiuPiuGlobals.winSize.height  - PiuPiuConsts.fontSizeBig) / 2
		});
		this.gameOverMessage.hide();
		this.gameOverAnimationScheduler = null;

		//  Prepare level completed message
		this.levelCompletedMessage = new TextView({
			name: "levelCompletedMessage",
			superview: this,
			fontFamily : PiuPiuConsts.fontName,
			size: PiuPiuConsts.fontSizeBig,
			strokeWidth: PiuPiuConsts.fontStrokeSize,
			text: "Level Completed!",
			color: 'yellow',
			strokeColor: 'blue',
			horizontalAlign: 'center',
			width: PiuPiuGlobals.winSize.width,
			height: PiuPiuConsts.fontSizeBig,
			zIndex: PiuPiuConsts.statusZIndex,
			x: 0,
			y: PiuPiuGlobals.winSize.height / 2 - PiuPiuConsts.fontSizeBig
		});
		this.levelCompletedMessage.hide();

		//  Prepare positive sentence message
		this.positiveMessage = new TextView({
			name: "positiveMessage",
			superview: this,
			fontFamily : PiuPiuConsts.fontName,
			size: PiuPiuConsts.fontSizeNormal,
			strokeWidth: PiuPiuConsts.fontStrokeSize,
			color: 'yellow',
			strokeColor: 'blue',
			horizontalAlign: 'center',
			width: PiuPiuGlobals.winSize.width,
			height: PiuPiuConsts.fontSizeNormal,
			zIndex: PiuPiuConsts.statusZIndex,
			x: 0,
			y: (PiuPiuGlobals.winSize.height + PiuPiuConsts.fontSizeNormal) / 2
		});
		this.positiveMessage.hide();

		//  register for touch on screen to eliminate messages
		this.on('removeMessages', bind(this, function () {
			clearInterval(this.gameOverAnimationScheduler);
			this.gameOverMessage.hide();
			this.positiveMessage.hide();
			this.levelCompletedMessage.hide();
			this.headerMessage.style.opacity = 0;
		}));
	};

	this.updateScore = function (score) {
		this.scoreText.setText("Score: " + score);
	};

	this.updateLives = function (lives) {
		this.livesText.setText("x" + lives);
	};

	this.displayHeaderMessage = function (msg) {
		this.headerMessage.setText(msg);
		this.headerMessage.style.opacity = 1;
		animate(this.headerMessage).now({opacity : 0}, 2000);
	};

	this.displayGameOver = function () {
		this.gameOverMessage.show();

		//  Animate end game
		var animateEndGame = bind(this, function () {
			animate(this.gameOverMessage).now({scale : 2}, 1000).then({scale : 1}, 1000);
		});
		animateEndGame();
		this.gameOverAnimationScheduler = setInterval(animateEndGame, 2000);
	};

	this.displayLevelCompleted = function () {
		this.levelCompletedMessage.show();
		this.positiveMessage.setText(positiveSentences[randomNumber(0, positiveSentences.length, true)]);
		setTimeout(bind(this, function () {this.positiveMessage.show()}), 2000);
	};
});