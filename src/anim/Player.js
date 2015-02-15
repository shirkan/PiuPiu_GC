/**
 * Created by shirkan on 1/26/15.
 */

import ui.SpriteView as SpriteView;

/** @const */ var PLAYER_WIDTH = 240;
/** @const */ var PLAYER_HEIGHT = 170;
/** @const */ var PLAYER_SPEED = 15;
/** @const */ var PLAYER_X_OFFSET = 0.3;

exports = Class(SpriteView, function(supr) {
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

	this.run = function () {
		this.startAnimation("run-nohands", {loop: true});
	};
});