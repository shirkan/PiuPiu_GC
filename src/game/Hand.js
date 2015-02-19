/**
 * Created by shirkan on 1/20/15.
 */
import ui.SpriteView as SpriteView;

/** @const */ var HANDS_WIDTH = PiuPiuConsts.playerWidth;
/** @const */ var HANDS_HEIGHT = PiuPiuConsts.playerHeight;
/** @const */ var HANDS_SPEED = PiuPiuConsts.playerAnimationSpeed;

var leftHandConfig = {
	zIndex: PiuPiuConsts.leftHandZIndex,
	isAnchored: true,
	width: HANDS_WIDTH,
	height: HANDS_HEIGHT,
	anchorX : HANDS_WIDTH * 0.545,
	anchorY : HANDS_HEIGHT * 0.35,
	autoStart: true,
	autoSize: true,
	url: res.Hands_anim + "left",
	frameRate: HANDS_SPEED,
	defaultAnimation: "normal"
};

var rightHandConfig = {
	zIndex: PiuPiuConsts.rightHandZIndex,
	isAnchored: true,
	width: HANDS_WIDTH,
	height: HANDS_HEIGHT,
	anchorX : HANDS_WIDTH * 0.545,
	anchorY : HANDS_HEIGHT * 0.35,
	autoStart: true,
	autoSize: true,
	url: res.Hands_anim + "right",
	frameRate: HANDS_SPEED,
	defaultAnimation: "normal"
};

exports = Class(SpriteView, function(supr) {

	this.init = function (opts) {
		this.name = "Hand";

		if (opts.type == 'left') {
			opts = merge(opts, leftHandConfig);
		} else if (opts.type == 'right') {
			opts = merge(opts, rightHandConfig);
		}

		supr(this, 'init', [opts]);
		this.setNormal();
	};

	this.setNormal = function( startFrame ) {
		this.startAnimation("normal", {loop:true, frame: startFrame});
	};

	this.setCaptain = function( startFrame ) {
		this.startAnimation("captain", {loop:true, frame: startFrame});
	};

	this.setMachineGun = function( startFrame ) {
		this.startAnimation("machineGun", {loop:true, frame: startFrame});
	};

	this.setMachineGunCaptain = function( startFrame ) {
		this.startAnimation("machineGunCaptain", {loop:true, frame: startFrame});
	};

	this.rotateHand = function (angle) {
		this.style.r = angle;
	};

	this.setSpeedSlow = function () {
		this.setFramerate(HANDS_SPEED / 2);
	};

	this.setSpeedNormal = function () {
		this.setFramerate(HANDS_SPEED);
	};
});
