/**
 * Created by shirkan on 2/15/15.
 */

import ui.View as View;
import ui.ImageView as ImageView;
import ui.TextView as TextView;
import animate;

import src.game.Players as Players;
import src.game.Enemies as Enemies;
import src.game.Powerups as Powerups;

/** @const */ var yGap = 10;
/** @const */ var PADDING = 5;
/** @const */ var FONT_WIDTH = 32;
/** @const */ var IMAGE_SIZE = 64;
/** @const */ var startY = 100;
/** @const */ var widthRatio = 0.8;

/** @const */ var ENTER_TIME = 750;
/** @const */ var TAP_TIME = 750;
/** @const */ var WAIT_TIME = 1000;

exports = Class(ImageView, function (supr) {
	this.init = function (opts) {
		this.name = "Instructions";
		opts = merge(opts, {
			x: 0,
			y: 0,
			image: PiuPiuGlobals.commonGrassMap
		});
		supr(this, 'init', [opts]);

		this.title = new TextView({
			superview: this,
			fontFamily : PiuPiuConsts.fontName,
			size: PiuPiuConsts.fontSizeBig,
			text: "Instructions",
			color: 'yellow',
			strokeColor: 'blue',
			strokeWidth: PiuPiuConsts.fontStrokeSize,
			width: PiuPiuGlobals.winSize.width,
			height: PiuPiuConsts.fontSizeBig,
			horizontalAlign: 'center',
			x: 0,
			y: PADDING
		});

		this.bg = new View({
			superview: this,
			x: PiuPiuGlobals.winSize.width * 0.05,
			y: PiuPiuGlobals.winSize.height * 0.1,
			width: PiuPiuGlobals.winSize.width * 0.9,
			height: PiuPiuGlobals.winSize.height * 0.8,
			backgroundColor: 'black',
			opacity: 0.5
		});

		this.texts = {
			text : [
				"Shoot down enemies by tapping on the screen",
				"Headshots worth more points",
				"Shoot powerups to gain special modes:"
			],
			y: [PiuPiuGlobals.winSize.height * 0.12,
				PiuPiuGlobals.winSize.height * 0.528,
				PiuPiuGlobals.winSize.height * 0.12
			]
		};

		this.textViews = [];

		for (var i=0; i< this.texts.text.length; i++) {

			this.textViews[i] = new TextView({
				name: "textView" + i,
				superview: this,
				fontFamily : PiuPiuConsts.fontName,
				size: PiuPiuConsts.fontSizeNormal,
				text: this.texts.text[i],
				color: 'yellow',
				strokeColor: 'blue',
				strokeWidth: PiuPiuConsts.fontStrokeSize,
				width: PiuPiuGlobals.winSize.width * 0.86,
				height: PiuPiuConsts.fontSizeNormal * 2,
				horizontalAlign: 'center',
				verticalAlign: 'top',
				wrap: true,
				x: PiuPiuGlobals.winSize.width * 0.07,
				y: this.texts.y[i]
			});
		}

		//  characters positions P1, P2, E1, E2
		this.characters = {
			x: [-PiuPiuConsts.playerWidth,
				-PiuPiuConsts.playerWidth,
				PiuPiuGlobals.winSize.width,
				PiuPiuGlobals.winSize.width
			],
			y:[ PiuPiuGlobals.winSize.height * 0.3,
				PiuPiuGlobals.winSize.height * 0.652,
				PiuPiuGlobals.winSize.height * 0.222,
				PiuPiuGlobals.winSize.height * 0.583
			]
		};

		this.players = new Players({ parent: this });
		this.player1 = this.players.spawnPlayer();
		this.player1.runWithRotatableHands();
		this.player1.handsSetNormal();

		this.player2 = this.players.spawnPlayer();
		this.player2.runWithRotatableHands();
		this.player2.handsSetNormal();

		this.enemies = new Enemies({ parent: this });
		this.enemy1 = this.enemies.spawnEnemy(this);
		this.enemy2 = this.enemies.spawnEnemy(this);

		//  Powerups
		this.powerups = new Powerups({ parent: this });
		this.powerup1 = this.powerups.spawnPowerup();
		this.powerup2 = this.powerups.spawnPowerup();
		this.powerup3 = this.powerups.spawnPowerup();
		this.powerup4 = this.powerups.spawnPowerup();

		//  Finger
		this.finger = new ImageView({
			superview: this,
			image: res.Finger_png,
			finger: res.Finger_png,
			finger_tap: res.Finger_tap_png,
			width: IMAGE_SIZE,
			height: IMAGE_SIZE,
			zIndex: 10,
			x: PiuPiuGlobals.winSize.width * 0.78125
		});
		this.finger.hide();

		//  Next button
		this.nextText = "Next >";
		this.startText = "Start";
		this.nextButton = new TextView({
			superview: this,
			fontFamily : PiuPiuConsts.fontName,
			size: PiuPiuConsts.fontSizeNormal,
			text: this.nextText,
			color: 'yellow',
			strokeColor: 'blue',
			strokeWidth: PiuPiuConsts.fontStrokeSize,
			width: this.nextText.length * FONT_WIDTH,
			height: PiuPiuConsts.fontSizeNormal,
			x: PiuPiuGlobals.winSize.width * 0.99 - this.nextText.length * FONT_WIDTH,
			y: (PiuPiuGlobals.winSize.height * 0.99) - PiuPiuConsts.fontSizeNormal
		});
		this.nextButton.on('InputSelect', this.onNext.bind(this));

		//  Dismiss button
		this.dismissText = "Dismiss forever";
		this.dismissButton = new TextView({
			superview: this,
			fontFamily : PiuPiuConsts.fontName,
			size: PiuPiuConsts.fontSizeNormal,
			text: this.dismissText,
			color: 'yellow',
			strokeColor: 'blue',
			strokeWidth: PiuPiuConsts.fontStrokeSize,
			width: this.dismissText.length * FONT_WIDTH,
			height: PiuPiuConsts.fontSizeNormal,
			x: PiuPiuGlobals.winSize.width * 0.01,
			y: (PiuPiuGlobals.winSize.height * 0.99) - PiuPiuConsts.fontSizeNormal
		});
		this.dismissButton.on('InputSelect', this.onDismiss.bind(this));
	};

	this.reset = function () {
		//  Set state to 0 (first screen)
		this.currentState = 0;

		animate(this.player1).clear();
		animate(this.player2).clear();
		animate(this.enemy1).clear();
		animate(this.enemy2).clear();

		this.enemy1.view.style.r = 0;
		this.enemy2.view.style.r = 0;

		this.switchScreen();
	};

	this.switchScreen = function () {
		//  change button and view state
		switch (this.currentState) {
			case 0:
			{
				this.textViews[0].show();
				this.textViews[1].hide();
				this.textViews[2].hide();
				
				//  p1
				this.player1.view.style.x = this.characters.x[0];
				this.player1.view.style.y = this.characters.y[0];
				this.player1.view.show();

				//  p2
				this.player2.view.style.x = this.characters.x[1];
				this.player2.view.style.y = this.characters.y[1];
				this.player2.view.show();

				//  e1
				this.enemy1.view.style.x = this.characters.x[2];
				this.enemy1.view.style.y = this.characters.y[2];
				this.enemy1.view.show();
				
				//  e2
				this.enemy2.view.style.x = this.characters.x[3];
				this.enemy2.view.style.y = this.characters.y[3];
				this.enemy2.view.show();

				var text = this.startText;
			}
			case 1:
			{
				var text = this.nextText;
			}
		}

		this.nextButton.setText(text);
		this.nextButton.style.x = PiuPiuGlobals.winSize.width * 0.99 - text.length * FONT_WIDTH;
		this.nextButton.style.width = text.length * FONT_WIDTH;
	};

	//  Animations

	this.startAnimation = function () {
		animate(this.player1.view).clear().
			now({x : PiuPiuGlobals.winSize.width * 0.1}, ENTER_TIME, animate.linear);

		animate(this.enemy1.view).clear().
			wait(ENTER_TIME).
			then({x : PiuPiuGlobals.winSize.width * 0.9 - PiuPiuConsts.enemyWidth}, ENTER_TIME, animate.linear).
			wait(1500).
			then(bind(this, function () {
				this.enemy1.view.hide();
			}));

		animate(this.finger).clear().
			wait(ENTER_TIME * 2).
			then(bind(this, function () {
				this.finger.style.y = PiuPiuGlobals.winSize.height * 0.4;
				this.finger.show();
			})).
			wait(WAIT_TIME).
			then(bind(this, function () {
				this.finger.setImage(this.finger._opts.finger_tap);
			})).
			wait(TAP_TIME).
			then(bind(this, function () {
				this.finger.setImage(this.finger._opts.finger);
			})).
			wait(WAIT_TIME).
			then(bind(this, function () {
				this.finger.hide();
			})).
			wait(ENTER_TIME).
			then(bind(this, function() {
				this.finger.style.y = PiuPiuGlobals.winSize.height * 0.638;
				this.finger.show();
			})).
			wait(WAIT_TIME).
			then(bind(this, function () {
				this.finger.setImage(this.finger._opts.finger_tap);
			})).
			wait(TAP_TIME).
			then(bind(this, function () {
				this.finger.setImage(this.finger._opts.finger);
			})).
			wait(WAIT_TIME).
			then(bind(this, function () {
				this.finger.hide();
			}));

		animate(this).clear().
			wait(ENTER_TIME * 2 + WAIT_TIME + TAP_TIME).
			then(bind(this, function () {
				this.textViews[1].show();
			}));

		animate(this.player2.view).clear().
			wait(ENTER_TIME * 2 + WAIT_TIME + TAP_TIME).
			then({x : PiuPiuGlobals.winSize.width * 0.1}, ENTER_TIME, animate.linear);

		animate(this.enemy2.view).clear().
			wait(ENTER_TIME * 3 + WAIT_TIME + TAP_TIME).
			then({x : PiuPiuGlobals.winSize.width * 0.9 - PiuPiuConsts.enemyWidth}, ENTER_TIME, animate.linear).
			wait(1500).
			then(bind(this, function () {
				this.enemy2.view.hide();
			}));
	};


	//  Handlers

	this.onNext = function () {
		this.endInstructions();
		return;
		if (this.currentState == 0) {
			//screen 0, change to next screen
			this.currentState = 1;
			this.switchScreen();
		} else if (this.currentState == 1) {
			this.endInstructions();
		}
	};

	this.onDismiss = function () {
		PiuPiuGlobals.showInstructions = false;
		saveData("showInstructions", PiuPiuGlobals.showInstructions);
		this.endInstructions();
	};

	this.endInstructions = function () {
		GC.app.emit('instructions:end');
	};
});
