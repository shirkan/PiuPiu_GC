/**
 * Created by shirkan on 1/26/15.
 */

import ui.SpriteView as SpriteView;

const ENEMY_WIDTH = 250;
const ENEMY_HEIGHT = 240;

exports = Class(SpriteView, function(supr) {
	this.init = function (opts) {
		this.name = "AnimEnemy";
		opts = merge(opts, {
			width: ENEMY_WIDTH,
			height: ENEMY_HEIGHT,
			url: res.Enemy_anim,
			frameRate: 25,
			defaultAnimation: "stand"
		});

		supr(this, 'init', [opts]);
		this.stand();
	};

	this.run = function () {
		this.startAnimation("run", {loop: true});
	};

	this.stand = function () {
		this.startAnimation("stand");
	};
});