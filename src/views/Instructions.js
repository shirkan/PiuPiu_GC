/**
 * Created by shirkan on 2/15/15.
 */

import ui.View as View;
import ui.ImageView as ImageView;
import ui.TextView as TextView;
import animate;

import src.game.Player as Player;
import src.game.Enemies as Enemies;
import src.game.Powerups as Powerups;
import src.anim.Bullet as Bullet;

/** @const */ var yGap = 10;
/** @const */ var PADDING = 5;
/** @const */ var FONT_WIDTH = 32;
/** @const */ var IMAGE_SIZE = 64;
/** @const */ var startY = 100;
/** @const */ var widthRatio = 0.8;

/** @const */ var ENTER_TIME = 750;
/** @const */ var TAP_TIME = 750;
/** @const */ var WAIT_TIME = 1000;
/** @const */ var BULLET_SPEED = 500;

exports = Class(ImageView, function (supr) {
	this.init = function (opts) {
		this.name = "Instructions";
		opts = merge(opts, {
			x: 0,
			y: 0,
			image: PiuPiuGlobals.commonGrassMap
		});
		supr(this, 'init', [opts]);

		//this.title = new TextView({
		//	superview: this,
		//	fontFamily : PiuPiuConsts.fontName,
		//	size: PiuPiuConsts.fontSizeBig,
		//	text: "Instructions",
		//	color: 'yellow',
		//	strokeColor: 'blue',
		//	strokeWidth: PiuPiuConsts.fontStrokeSize,
		//	width: PiuPiuGlobals.winSize.width,
		//	height: PiuPiuConsts.fontSizeBig,
		//	horizontalAlign: 'center',
		//	x: 0,
		//	y: PADDING
		//});

		//this.bg = new View({
		//	superview: this,
		//	x: PiuPiuGlobals.winSize.width * 0.05,
		//	y: PiuPiuGlobals.winSize.height * 0.1,
		//	width: PiuPiuGlobals.winSize.width * 0.9,
		//	height: PiuPiuGlobals.winSize.height * 0.8,
		//	backgroundColor: 'black',
		//	opacity: 0
		//});

		this.texts = {
			text : [
				"Shoot down enemies by",
				"tapping on the screen",
				"Headshots worth more points",
				"Shoot power ups for special modes:"
			],
			powerups: [
				"Extra life",
				"Captain mode (double points)",
				"Machine gun mode",
				"Bullet-time mode"
			]
		};

		this.textViews = [];

		for (var i=0; i < this.texts.text.length; i++) {

			this.textViews[i] = new TextView({
				name: "textView" + i,
				superview: this,
				fontFamily : PiuPiuConsts.fontName,
				size: PiuPiuConsts.fontSizeInstructions,
				text: this.texts.text[i],
				color: 'yellow',
				strokeColor: 'blue',
				strokeWidth: PiuPiuConsts.fontStrokeSize,
				width: PiuPiuGlobals.winSize.width,
				height: PiuPiuConsts.fontSizeInstructions,
				horizontalAlign: 'center',
				verticalAlign: 'top',
				wrap: true,
				x: 0,
				y: PADDING + PiuPiuGlobals.winSize.height * 0.15
			});
		}
		this.textViews[1].style.y = PADDING + PiuPiuGlobals.winSize.height * 0.15 + PiuPiuConsts.fontSizeInstructions;

		for (var i=0; i < this.texts.powerups.length; i++) {
			var y = PiuPiuGlobals.winSize.height / 3 + (i) * PiuPiuGlobals.winSize.height / 9;
			this.textViews[i + this.texts.text.length] = new TextView({
				name: "textView" + i,
				superview: this,
				fontFamily : PiuPiuConsts.fontName,
				size: PiuPiuConsts.fontSizeNormal,
				text: this.texts.powerups[i],
				color: 'yellow',
				strokeColor: 'blue',
				strokeWidth: PiuPiuConsts.fontStrokeSize,
				width: PiuPiuGlobals.winSize.width * 0.75,
				height: PiuPiuConsts.fontSizeNormal,
				horizontalAlign: 'left',
				verticalAlign: 'top',
				wrap: true,
				x: PiuPiuGlobals.winSize.width * 0.25,
				y: y
			});
		}

		//  characters positions P1, E1
		this.characters = {
			x: [-PiuPiuConsts.playerWidth,
				PiuPiuGlobals.winSize.width,
			],
			y:[ PiuPiuGlobals.winSize.height * 0.652,
				PiuPiuGlobals.winSize.height * 0.583
			]
		};

		this.player1 = new Player({ parent: this });
		//this.player1 = this.players.spawnPlayer();
		this.player1.runWithRotatableHands();
		this.player1.handsSetNormal();

		this.enemies = new Enemies({ parent: this });
		this.enemy1 = this.enemies.spawnEnemy(this);

		//  Powerups
		this.powerups = new Powerups({ parent: this });
		this.powerup1 = this.powerups.spawnPowerup(PiuPiuConsts.powerupTypes[0], {x: PiuPiuGlobals.winSize.width * 0.15, y: this.textViews[4].style.y});
		this.powerup2 = this.powerups.spawnPowerup(PiuPiuConsts.powerupTypes[1], {x: PiuPiuGlobals.winSize.width * 0.15, y: this.textViews[5].style.y});
		this.powerup3 = this.powerups.spawnPowerup(PiuPiuConsts.powerupTypes[2], {x: PiuPiuGlobals.winSize.width * 0.15, y: this.textViews[6].style.y});
		this.powerup4 = this.powerups.spawnPowerup(PiuPiuConsts.powerupTypes[3], {x: PiuPiuGlobals.winSize.width * 0.15, y: this.textViews[7].style.y});

		//  Bullet
		this.bullet = new Bullet({parent: this, zIndex: 2});
		this.bullet.hide();

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
		this.nextButton.on('InputSelect', this.endInstructions.bind(this));

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
		animate(this.enemy1).clear();

		this.enemy1.view.style.r = 0;

		this.switchScreen();
	};

	this.switchScreen = function () {
		//  change button and view state
		switch (this.currentState) {
			case 0:
			{
				this.textViews[0].show();
				this.textViews[1].show();
				this.textViews[2].hide();
				this.textViews[3].hide();
				this.textViews[4].hide();
				this.textViews[5].hide();
				this.textViews[6].hide();
				this.textViews[7].hide();

				this.nextButton.hide();
				this.dismissButton.hide();
				
				//  p1
				this.player1.view.style.x = this.characters.x[0];
				this.player1.view.style.y = this.characters.y[0];
				this.player1.view.show();

				//  e1
				this.enemy1.view.style.x = this.characters.x[1];
				this.enemy1.view.style.y = this.characters.y[1];
				this.enemy1.view.show();

				this.powerup1.view.hide();
				this.powerup2.view.hide();
				this.powerup3.view.hide();
				this.powerup4.view.hide();

				var text = this.startText;
				break;
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
		animate(this).clear().

			//  Part 1 - Shoot enemy
			now(bind(this, function () {
				animate(this.player1.view).clear().
					now({x : PiuPiuGlobals.winSize.width * 0.1}, ENTER_TIME, animate.linear);
				animate(this.enemy1.view).clear().
					then({x : PiuPiuGlobals.winSize.width * 0.9 - PiuPiuConsts.enemyWidth}, ENTER_TIME, animate.linear);
			})).
			wait(ENTER_TIME).
			then(bind(this, function () {
				this.finger.style.y = PiuPiuGlobals.winSize.height * 0.735;
				this.finger.show();
			})).
			wait(WAIT_TIME).
			then(bind(this, function () {
				this.finger.setImage(this.finger._opts.finger_tap);
				this.bullet.style.x = PiuPiuGlobals.winSize.width * 0.215;
				this.bullet.style.y = PiuPiuGlobals.winSize.height * 0.743;
				this.bullet.show();
				playSound("piu");
				animate(this.bullet).clear().
					now({x: this.enemy1.view.style.x + PiuPiuConsts.enemyWidth / 2}, BULLET_SPEED, animate.linear).
					then(bind(this, function (){
						this.bullet.hide();
						this.enemy1.view.hide();
					}));
			})).
			wait(TAP_TIME).
			then(bind(this, function () {
				this.finger.setImage(this.finger._opts.finger);
			})).
			wait(WAIT_TIME).
			then(bind(this, function () {
				this.finger.hide();
				animate(this.player1.view).clear().
					now({x : PiuPiuGlobals.winSize.width}, ENTER_TIME * 2.5, animate.linear);
			})).
			wait(ENTER_TIME * 2.5).

			//  Part 2 - Headshot
			then(bind(this, function () {
				this.player1.view.style.x = this.characters.x[0];
				this.player1.view.style.y = this.characters.y[0];
				this.player1.view.show();

				this.enemy1.view.style.x = this.characters.x[1];
				this.enemy1.view.style.y = this.characters.y[1];
				this.enemy1.view.show();

				this.textViews[0].hide();
				this.textViews[1].hide();
				this.textViews[2].show();
				animate(this.player1.view).clear().
					then({x : PiuPiuGlobals.winSize.width * 0.1}, ENTER_TIME, animate.linear);
				animate(this.enemy1.view).clear().
					then({x : PiuPiuGlobals.winSize.width * 0.9 - PiuPiuConsts.enemyWidth}, ENTER_TIME, animate.linear);
			})).
			wait(WAIT_TIME).
			then(bind(this, function() {
				this.finger.style.y = PiuPiuGlobals.winSize.height * 0.638;
				this.finger.show();
			})).
			wait(TAP_TIME).
			then(bind(this, function () {
				this.finger.setImage(this.finger._opts.finger);
			})).
			wait(WAIT_TIME).
			then(bind(this, function () {
				this.finger.setImage(this.finger._opts.finger_tap);
				this.bullet.style.x = PiuPiuGlobals.winSize.width * 0.215;
				this.bullet.style.y = PiuPiuGlobals.winSize.height * 0.743;
				this.bullet.show();
				playSound("piu");
				animate(this.bullet).clear().
					now({x: this.enemy1.view.style.x + PiuPiuConsts.enemyWidth / 2, y: this.enemy1.view.style.y + PiuPiuConsts.enemyHeight * 0.2}, BULLET_SPEED, animate.linear).
					then(bind(this, function (){
						this.bullet.hide();
						this.enemy1.view.hide();
					}));
			})).
			wait(TAP_TIME).
			then(bind(this, function () {
				this.finger.setImage(this.finger._opts.finger);
			})).
			wait(WAIT_TIME).
			then(bind(this, function () {
				this.finger.hide();
				animate(this.player1.view).clear().
					now({x : PiuPiuGlobals.winSize.width}, ENTER_TIME * 2.5, animate.linear);
			})).
			wait(ENTER_TIME * 2.5).

			//  Part 3 - power ups
			then(bind(this, function () {
				this.textViews[2].hide();
				this.textViews[3].show();
				this.powerup1.view.show();
				this.powerup1.animateIn();
			})).
			wait(this.powerup1.ANIMATION_TIME).
			then(bind(this, function () {
				this.textViews[4].show();
				this.powerup2.view.show();
				this.powerup2.animateIn();
			})).
			wait(this.powerup1.ANIMATION_TIME).
			then(bind(this, function () {
				this.textViews[5].show();
				this.powerup3.view.show();
				this.powerup3.animateIn();
			})).
			wait(this.powerup1.ANIMATION_TIME).
			then(bind(this, function () {
				this.textViews[6].show();
				this.powerup4.view.show();
				this.powerup4.animateIn();
			})).
			wait(this.powerup4.ANIMATION_TIME).
			then(bind(this, function () {
				this.textViews[7].show();
				this.dismissButton.show();
				this.nextButton.show();
			}));
	};


	//  Handlers

	this.onNext = function () {
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
