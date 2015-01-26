/**
 * Created by shirkan on 1/20/15.
 */

import entities.Entity as Entity;
import entities.EntityPool as EntityPool;
import ui.ImageView as ImageView;

const BODY_X = 0;
const BODY_Y = 45;
const BODY_WIDTH = 95;
const BODY_HEIGHT = 80;
const HEAD_X = 20;
const HEAD_Y = 5;
const HEAD_WIDTH = 30;
const HEAD_HEIGHT = 40;

//  Setting w,h to avoid image hitbounds auto-config
var enemyConfig = {
	zIndex: PiuPiuConsts.enemyZIndex,
	hitBounds: {
		w: 1
	},
	image: res.Enemy_png
};

var headConfig = {
	zIndex: PiuPiuConsts.enemyZIndex,
	hitBounds: {
		x: HEAD_X,
		y: HEAD_Y,
		w: HEAD_WIDTH ,
		h: HEAD_HEIGHT
	}
};

var bodyConfig = {
	zIndex: PiuPiuConsts.enemyZIndex,
	hitBounds: {
		x: BODY_X,
		y: BODY_Y,
		w: BODY_WIDTH ,
		h: BODY_HEIGHT
	}
};

var EnemyHead = Class(Entity, function() {
	var sup = Entity.prototype;

	this.name = "EnemyHead";
	this.viewClass = null;

	this.reset = function(x, y, config) {
		config.hitBounds = headConfig.hitBounds;
		sup.reset.call(this, x + HEAD_X, y + HEAD_Y, config);
	};

	this.update = function(dt, player) {
		sup.update.call(this, dt);

		this.x = player.x + HEAD_X;
		this.y = player.y + HEAD_Y;
	};

	this.showHitBounds = function (view) {
		this.view = view;
		sup.showHitBounds.call(this);
	}
});

var EnemyBody = Class(Entity, function() {
	var sup = Entity.prototype;

	this.name = "EnemyBody";
	this.viewClass = null;

	this.reset = function(x, y, config) {
		config.hitBounds = bodyConfig.hitBounds;
		sup.reset.call(this, x + BODY_X, y + BODY_Y, config);
	};

	this.update = function(dt, player) {
		sup.update.call(this, dt);

		this.x = player.x + BODY_X;
		this.y = player.y + BODY_Y;
	};

	this.showHitBounds = function (view) {
		this.view = view;
		sup.showHitBounds.call(this);
	}
});

var Enemy = Class(Entity, function() {
	var sup = Entity.prototype;
	this.name = "Enemy";
	this.viewClass = ImageView;

	this.init = function(opts) {
		opts = merge(opts, enemyConfig);
		sup.init.call(this, opts);

		this.head = new EnemyHead(opts);
		this.body = new EnemyBody(opts);
	};

	this.reset = function(x, y, config) {
		sup.reset.call(this, x, y, config);

		this.head.reset(x, y, config);
		this.body.reset(x, y, config);
	};

	this.update = function(dt) {
		sup.update.call(this, dt);
		this.head.update(dt, this);
		this.body.update(dt, this);
	};

	this.collidesWith = function(entity) {
		var headShot = this.head.collidesWith(entity);
		var bodyShot = this.body.collidesWith(entity);

		if (headShot || bodyShot) {
			if (entity.name == "Bullet") {
				if (headShot) {
					LOG("COLLIDED HEADSHOT!")
					this.hitType = hitType.BulletEnemyHead;
					return true;
				}
				if (bodyShot) {
					LOG("COLLIDED BODYSHOT!")
					this.hitType = hitType.BulletEnemy;
					return true;
				}
			} else if (entity.name == "Player" ) {
				this.hitType = hitType.EnemyPlayer;
				return true;
			}
		}
	};

	this.showHitBounds = function () {
		sup.showHitBounds.call(this);
		this.head.showHitBounds(this.view);
		this.body.showHitBounds(this.view);
	}
});

exports = Class(EntityPool, function() {
	var sup = EntityPool.prototype;

	this.init = function(opts) {
		opts.ctor = Enemy;
		sup.init.call(this, opts);
	};

	this.reset = function() {
		sup.reset.call(this);
	};

	this.update = function(dt) {
		sup.update.call(this, dt);
	};

	this.spawnEnemy = function(x, y, speed) {
		x = x || PiuPiuGlobals.winSize.width;
		y = y || randomNumber(0, PiuPiuGlobals.winSize.height);
		speed = speed || randomNumber(0.3, 1);
		var vx = PiuPiuGlobals.currentUpdateRate * speed * (PiuPiuGlobals.sourcePoint.x - x) / PiuPiuConsts.framesPerSeconds;
		var vy = PiuPiuGlobals.currentUpdateRate * speed * (PiuPiuGlobals.sourcePoint.y - y) / PiuPiuConsts.framesPerSeconds;
		var opts = merge({vx: vx, vy: vy}, enemyConfig);
		var enemy = this.obtain(x, y, opts);
		enemy.showHitBounds();
	};
});