/**
 * Created by shirkan on 1/20/15.
 */

import entities.Entity as Entity;
import entities.EntityPool as EntityPool;
import ui.ImageView as ImageView;

const BULLET_WIDTH = 10;
const BULLET_HEIGHT = 4;
var bulletConfig = {
	zIndex: PiuPiuConsts.bulletZIndex,
	width: BULLET_WIDTH,
	height: BULLET_HEIGHT,
	hitBounds: {
		x: 0,
		y: 0,
		w: BULLET_WIDTH,
		h: BULLET_HEIGHT
	},
	autoSize: true,
	image: res.Bullet_png
};

var Bullet = Class(Entity, function() {
	var sup = Entity.prototype;
	this.name = "Bullet";
	this.viewClass = ImageView;

	this.init = function(opts) {
		//opts = merge(opts, bulletConfig);
		sup.init.call(this, opts);
	};

	this.update = function(dt) {
		sup.update.call(this, dt);
		//var b = this.viewBounds;
		if (this.y >= PiuPiuGlobals.winSize.height ||
			this.y <= 0 ||
			this.x >= PiuPiuGlobals.winSize.width) {
			this.release();
		}
	};
});

exports = Class(EntityPool, function() {
	var sup = EntityPool.prototype;

	this.init = function(opts) {
		opts.ctor = Bullet;
		sup.init.call(this, opts);
	};

	this.reset = function() {
		sup.reset.call(this);
	};

	this.update = function(dt) {
		sup.update.call(this, dt);
	};

	this.spawnBullet = function(bulletStartPoint, bulletPathLengths, endAngle) {
		var vx = PiuPiuGlobals.currentUpdateRate * bulletPathLengths.x / PiuPiuConsts.framesPerSeconds;
		var vy = PiuPiuGlobals.currentUpdateRate * bulletPathLengths.y / PiuPiuConsts.framesPerSeconds;
		LOG("velocity x: " + vx + " y: " + vy);

		var opts = merge({vx: vx, vy: vy}, bulletConfig);
		var bullet = this.obtain(bulletStartPoint.x, bulletStartPoint.y, opts);
		bullet.view.style.r = endAngle;
		//bullet.showHitBounds();
	};
});