/**
 * Created by shirkan on 1/26/15.
 */

import ui.SpriteView as SpriteView;

/** @const */ var ENEMY_RUNNING_WIDTH = 250;
/** @const */ var ENEMY_RUNNING_HEIGHT = 240;
/** @const */ var ENEMY_STAND_WIDTH = ENEMY_RUNNING_WIDTH;
/** @const */ var ENEMY_STAND_HEIGHT = ENEMY_RUNNING_HEIGHT;
/** @const */ var ENEMY_DEAD_WIDTH = ENEMY_RUNNING_WIDTH;
/** @const */ var ENEMY_DEAD_HEIGHT = ENEMY_RUNNING_HEIGHT;
/** @const */ var ENEMY_HEADSHOT_WIDTH = ENEMY_RUNNING_WIDTH;
/** @const */ var ENEMY_HEADSHOT_HEIGHT = ENEMY_RUNNING_HEIGHT;
/** @const */ var ENEMY_SPEED = 25;

exports = Class(SpriteView, function(supr) {
	this.init = function (opts) {
		this.name = "AnimEnemy";

		var color = (opts.color && EnemyColor[opts.color]) ? EnemyColor[opts.color] :
			EnemyColor[EnemyColor.All[randomNumber(0, EnemyColor.All.length, true)]];
		var url = res.Enemy_anim + color + "/enemy";

		opts = merge(opts, {
			width: ENEMY_RUNNING_WIDTH,
			height: ENEMY_RUNNING_HEIGHT,
			url: url,
			frameRate: ENEMY_SPEED,
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