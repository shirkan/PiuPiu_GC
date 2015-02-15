/**
 * Created by shirkan on 1/20/15.
 */
import entities.Entity as Entity;
import src.game.Hands as Hands;
import ui.View as View;

//  Player animation
import ui.SpriteView as SpriteView;

/** @const */ var PLAYER_WIDTH = 240;
/** @const */ var PLAYER_HEIGHT = 170;
/** @const */ var PLAYER_SPEED = 15;
/** @const */ var PLAYER_X_OFFSET = 0.3;

var PlayerAnim = Class(SpriteView, function(supr) {
	this.init = function (opts) {
		this.name = "AnimPlayer";

		var shoesColor = "black";
		var url = res.Player_anim + shoesColor + "/player";
		var x = opts.x ? opts.x - (PLAYER_X_OFFSET * PLAYER_WIDTH) : -PLAYER_X_OFFSET * PLAYER_WIDTH;

		opts = merge(opts, {
			width: PLAYER_WIDTH,
			height: PLAYER_HEIGHT,
			url: url,
			x: x,
			frameRate: PLAYER_SPEED,
			defaultAnimation: "stand"
		});

		supr(this, 'init', [opts]);
		this.stand();
	};

	this.stand = function () {
		this.startAnimation("stand", {loop: true});
	};

	this.runWithNoHands = function () {
		this.startAnimation("run-nohands", {loop: true});
	};
});

//  Player Entity
var playerConfig = {
	name : "Player",
	isAnchored: true,
	hitBounds: {
		x: PiuPiuConsts.playerWidth * 0.3 * 0.3,
		y: PiuPiuConsts.playerHeight / 4,
		w: PiuPiuConsts.playerWidth * 0.2,
		h: PiuPiuConsts.playerHeight / 2
	}
};

exports = Class(Entity, function() {
	var sup = Entity.prototype;
	this.viewClass = View;
	this.name = "Player";

	this.init = function(opts) {
		opts = merge(opts, playerConfig);
		sup.init.call(this, opts);
		sup.reset.call(this, 0, (PiuPiuGlobals.winSize.height - PiuPiuConsts.playerHeight) / 2, playerConfig);

		this.player = new PlayerAnim({parent: this.view});
		this.player.runWithNoHands();

		PiuPiuGlobals.handsAnchor = makePoint(this.player.style.x + (PiuPiuConsts.playerWidth * 0.52),
			this.player.style.y + (PiuPiuConsts.playerHeight * 0.36));
		this.hands = new Hands({parent:this.view, x:PiuPiuGlobals.handsAnchor.x, y:PiuPiuGlobals.handsAnchor.y});

		//  fix hands anchor to have a general x & y
		PiuPiuGlobals.handsAnchor.y += (PiuPiuGlobals.winSize.height - PiuPiuConsts.playerHeight) / 2;

		//this.showHitBounds();
	};

	//  Player
	this.stand = function() {
		//  Eliminate rotating hands
		this.hands.hide();
		this.player.stand();
	};

	this.runWithNoHands = function () {
		//  Display rotating hands
		this.hands.show();
		this.player.runWithNoHands();
	};

	//  Hands
	this.handsSetNormal = function() {
		this.hands.setNormal();
	};
	this.handsSetCaptain = function() {
		this.hands.setCaptain();
	};
	this.handsSetMachineGun = function() {
		this.hands.setMachineGun();
	};
	this.handsSetMachineGunCaptain = function() {
		this.hands.setMachineGunCaptain();
	};
	this.rotateHands = function (angle) {
		this.hands.rotateHands(angle);
	};
});