/**
 * Created by shirkan on 1/20/15.
 */

import entities.Entity as Entity;
import entities.EntityPool as EntityPool;
import ui.ImageView as ImageView;

const ENEMY_WIDTH = 95;
const ENEMY_HEIGHT = 125;
var enemyConfig = {
	zIndex: 45,
	isCircle: false,
	hitBounds: {
		x: 0,
		y: 0,
		w: ENEMY_WIDTH ,
		h: ENEMY_HEIGHT
	},
	image: res.Enemy_png
};

var Enemy = Class(Entity, function() {
	var sup = Entity.prototype;
	this.name = "Enemy";
	this.viewClass = ImageView;

	this.init = function(opts) {
		//opts = merge(opts, bulletConfig);
		sup.init.call(this, opts);
	};

	this.update = function(dt) {
		sup.update.call(this, dt);
		//var b = this.viewBounds;
		//if (this.y >= PiuPiuGlobals.winSize.height ||
		//	this.y <= 0 ||
		//	this.x >= PiuPiuGlobals.winSize.width) {
		//	this.release();
		//}
	};
});

exports = Class(EntityPool, function() {
	var sup = EntityPool.prototype;
	//var SPAWN_COOLDOWN = config.bullets.spawnCooldown;

	this.init = function(opts) {
		//this.spawnCooldown = 0;
		opts.ctor = Enemy;
		sup.init.call(this, opts);
	};

	//this.reset = function() {
	//	this.spawnCooldown = SPAWN_COOLDOWN;
	//	sup.reset.call(this);
	//};
	//
	this.update = function(dt) {
		sup.update.call(this, dt);
	};

	this.spawnEnemy = function(x, y) {
		var vx = PiuPiuGlobals.currentUpdateRate * (PiuPiuGlobals.sourcePoint.x - x) / PiuPiuConsts.framesPerSeconds;
		var vy = PiuPiuGlobals.currentUpdateRate * (PiuPiuGlobals.sourcePoint.y - y) / PiuPiuConsts.framesPerSeconds;
		var opts = merge({vx: vx, vy: vy}, enemyConfig);
		var enemy = this.obtain(x, y, opts);
		enemy.showHitBounds();
	};
});