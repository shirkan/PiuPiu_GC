/**
 * Created by shirkan on 1/26/15.
 */

import ui.SpriteView as SpriteView;

const ENEMY_RUNNING_WIDTH = 250;
const ENEMY_RUNNING_HEIGHT = 240;
const ENEMY_STAND_WIDTH = ENEMY_RUNNING_WIDTH;
const ENEMY_STAND_HEIGHT = ENEMY_RUNNING_HEIGHT;
const ENEMY_DEAD_WIDTH = ENEMY_RUNNING_WIDTH;
const ENEMY_DEAD_HEIGHT = ENEMY_RUNNING_HEIGHT;
const ENEMY_HEADSHOT_WIDTH = ENEMY_RUNNING_WIDTH;
const ENEMY_HEADSHOT_HEIGHT = ENEMY_RUNNING_HEIGHT;

exports = Class(SpriteView, function(supr) {
	this.init = function (opts) {
		this.name = "AnimEnemy";
		opts = merge(opts, {
			width: ENEMY_RUNNING_WIDTH,
			height: ENEMY_RUNNING_HEIGHT,
			url: res.Enemy_anim,
			frameRate: 25,
			defaultAnimation: "stand"
		});

		supr(this, 'init', [opts]);
		this.stand();
	};

	this.run = function () {
		this.style.width = ENEMY_RUNNING_WIDTH;
		this.style.height = ENEMY_RUNNING_HEIGHT;
		this.startAnimation("run", {loop: true});
	};

	this.stand = function () {
		this.style.width = ENEMY_STAND_WIDTH;
		this.style.height = ENEMY_STAND_HEIGHT;
		this.startAnimation("stand", {loop: true});
	};

	this.dead = function () {
		this.style.width = ENEMY_DEAD_WIDTH;
		this.style.height = ENEMY_DEAD_HEIGHT;
		this.startAnimation("dead", {loop: true});
	};

	this.headshot = function () {
		this.style.width = ENEMY_HEADSHOT_WIDTH;
		this.style.height = ENEMY_HEADSHOT_HEIGHT;
		this.startAnimation("headshot", {loop: true});
	};
});