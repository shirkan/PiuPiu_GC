/**
 * Created by shirkan on 1/20/15.
 */
import entities.Entity as Entity;
import entities.EntityPool as EntityPool;
import ui.View as View;
import ui.SpriteView as SpriteView;

import src.game.Hand as Hand;

//  Player animation

/** @const */ var PLAYER_WIDTH = PiuPiuConsts.playerWidth;
/** @const */ var PLAYER_HEIGHT = PiuPiuConsts.playerHeight;
/** @const */ var PLAYER_SPEED = PiuPiuConsts.playerAnimationSpeed;
/** @const */ var PLAYER_X_OFFSET = 0.3;

var PlayerAnim = Class(SpriteView, function(supr) {
	this.init = function (opts) {
		this.name = "AnimPlayer";

		var shoesColor = "black";
		var url = res.Player_anim + shoesColor + "/player";
		var x = opts.x ? opts.x - (PLAYER_X_OFFSET * PLAYER_WIDTH) : -PLAYER_X_OFFSET * PLAYER_WIDTH;

		opts = merge(opts, {
			zIndex: PiuPiuConsts.playerZIndex,
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

	this.runWithRotatableHands = function () {
		this.startAnimation("run-nohands", {loop: true});
	};

	this.setSpeedSlow = function () {
		this.setFramerate(PLAYER_SPEED / 2);
	};

	this.setSpeedNormal = function () {
		this.setFramerate(PLAYER_SPEED);
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
	},
	x: 0,
	y: (PiuPiuGlobals.winSize.height - PiuPiuConsts.playerHeight) / 2
};

var Player = Class(Entity, function() {
	var sup = Entity.prototype;
	this.viewClass = View;
	this.name = "Player";

	this.init = function(opts) {
		opts = merge(opts, playerConfig);
		sup.init.call(this, opts);
		sup.reset.call(this, playerConfig.x, playerConfig.y, playerConfig);

		this.player = new PlayerAnim({parent: this.view});
		this.player.runWithRotatableHands();

		PiuPiuGlobals.handsAnchor = makePoint(this.player.style.x + (PiuPiuConsts.playerWidth * 0.52),
			this.player.style.y + (PiuPiuConsts.playerHeight * 0.36));
		this.leftHand = new Hand({parent: this.view, type: 'left', x: this.player.style.x, y: this.player.style.y});
		this.rightHand = new Hand({parent: this.view, type: 'right', x: this.player.style.x, y: this.player.style.y});

		//  fix hands anchor to have a general x & y
		PiuPiuGlobals.handsAnchor.y += (PiuPiuGlobals.winSize.height - PiuPiuConsts.playerHeight) / 2;

		this.stand();
		//this.showHitBounds();
	};

	//  Player
	this.stand = function() {
		//  Eliminate rotating hands
		this.handsHide();
		this.player.stand();
	};

	this.runWithRotatableHands = function () {
		//  Display rotating hands
		this.handsShow();
		this.handsSetNormal();
		this.player.runWithRotatableHands();
	};

	this.setSpeedSlow = function () {
		this.player.setSpeedSlow();
		this.leftHand.setSpeedSlow();
		this.rightHand.setSpeedSlow();
	};

	this.setSpeedNormal = function () {
		this.player.setSpeedNormal();
		this.leftHand.setSpeedNormal();
		this.rightHand.setSpeedNormal();
	};

	//  Hands
	this.handsShow = function () {
		this.leftHand.show();
		this.rightHand.show();
	};

	this.handsHide = function () {
		this.leftHand.hide();
		this.rightHand.hide();
	};

	this.handsSetNormal = function() {
		var currentFrame = this.player._currentFrame;
		this.leftHand.setNormal(currentFrame);
		this.rightHand.setNormal(currentFrame);
	};

	this.handsSetCaptain = function() {
		var currentFrame = this.player._currentFrame;
		this.leftHand.setCaptain(currentFrame);
		this.rightHand.setCaptain(currentFrame);
	};

	this.handsSetMachineGun = function() {
		var currentFrame = this.player._currentFrame;
		this.leftHand.setMachineGun(currentFrame);
		this.rightHand.setMachineGun(currentFrame);
	};

	this.handsSetMachineGunCaptain = function() {
		var currentFrame = this.player._currentFrame;
		this.leftHand.setMachineGunCaptain(currentFrame);
		this.rightHand.setMachineGunCaptain(currentFrame);
	};

	this.rotateHands = function (angle) {
		this.leftHand.rotateHand(angle);
		this.rightHand.rotateHand(angle);
	};
});

exports = Class(EntityPool, function() {
	var sup = EntityPool.prototype;

	this.init = function(opts) {
		opts.ctor = Player;
		sup.init.call(this, opts);
	};

	this.reset = function() {
		sup.reset.call(this);
	};

	this.update = function(dt) {
		sup.update.call(this, dt);
	};

	this.spawnPlayer = function(x, y, opts) {
		var player = this.obtain(x, y, opts);
		return player;
	};
});