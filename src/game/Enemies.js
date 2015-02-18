/**
 * Created by shirkan on 1/20/15.
 */

import entities.Entity as Entity;
import entities.EntityPool as EntityPool;
import ui.View as View;
import src.anim.Enemy as EnemyAnim;

import animate;

/** @const */ var BODY_X = 125;
/** @const */ var BODY_Y = 60;
/** @const */ var BODY_WIDTH = 50;
/** @const */ var BODY_HEIGHT = 144;
/** @const */ var HEAD_X = 125;
/** @const */ var HEAD_Y = 25;
/** @const */ var HEAD_WIDTH = 25;
/** @const */ var HEAD_HEIGHT = 35;

//  Setting w,h to avoid image hitbounds auto-config
var enemyConfig = {
	zIndex: PiuPiuConsts.enemyZIndex,
	hitBounds: {
		w: 1
	}
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
		sup.reset.call(this, x, y, config);
	};

	this.update = function(dt, player) {
		sup.update.call(this, dt);

		this.x = player.x;
		this.y = player.y;
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
		sup.reset.call(this, x, y, config);
	};

	this.update = function(dt, player) {
		sup.update.call(this, dt);

		this.x = player.x;
		this.y = player.y;
	};

	this.showHitBounds = function (view) {
		this.view = view;
		sup.showHitBounds.call(this);
	}
});

var Enemy = Class(Entity, function() {
	var sup = Entity.prototype;
	this.name = "Enemy";
	this.viewClass = View;

	this.init = function(opts) {
		opts = merge(opts, enemyConfig);
		sup.init.call(this, opts);

		this.head = new EnemyHead(opts);
		this.body = new EnemyBody(opts);
		this.anim = new EnemyAnim({parent: this.view});
	};

	this.reset = function(x, y, config) {
		sup.reset.call(this, x, y, config);
		animate(this.view).clear();
		this.view.style.r = 0;

		this.anim.run();

		this.head.reset(x, y, config);
		this.body.reset(x, y, config);
	};

	this.update = function(dt) {
		//if (this.updatable) {
			sup.update.call(this, dt);
			this.head.update(dt, this);
			this.body.update(dt, this);
		//}
	};

	this.collidesWith = function(entity) {
		if (!this.shotsLeft) {
			return false;
		}

		var headShot = this.head.collidesWith(entity);
		var bodyShot = this.body.collidesWith(entity);

		if (headShot || bodyShot) {
			this.shotsLeft--;
			if (entity.name == "Bullet") {
				if (headShot) {
					this.hitType = hitType.BulletEnemyHead;
					return true;
				}
				if (bodyShot) {
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
		this.head.showHitBounds(this.view);
		this.body.showHitBounds(this.view);
	};

	this.animateDeath = function () {
		this.vx = this.vy = this.ax = this.ay = 0;
		this.anim.dead();
		this.deathAnimation1();
	};

	this.animateHeadshot = function () {
		this.vx = this.vy = this.ax = this.ay = 0;
		this.anim.headshot();
		this.deathAnimation1();
	};

	this.deathAnimation1 = function() {
		animate(this.view).now({r:Math.PI/2}, 500, animate.linear).
			then({r: Math.PI * 1.5}, 500, animate.linear);
		animate(this).now({x: this.x + 300, y: this.y - 100}, 250, animate.linear).
			then({y: PiuPiuGlobals.winSize.height + this.anim.style.height}, (PiuPiuGlobals.winSize.height - this.y), animate.linear).
			then(bind(this, function() {
				this.release();
				this.target.emit('enemyDied');
			}));
	};
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

	this.spawnEnemy = function(target, x, y, speed) {
		x = x || PiuPiuGlobals.winSize.width;
		y = y || randomNumber(0, PiuPiuGlobals.winSize.height);
		speed = speed || randomNumber(0.3, 1);
		var vx = PiuPiuGlobals.currentUpdateRate * speed * (PiuPiuGlobals.sourcePoint.x - x) / PiuPiuConsts.framesPerSeconds;
		var vy = PiuPiuGlobals.currentUpdateRate * speed * (PiuPiuGlobals.sourcePoint.y - y) / PiuPiuConsts.framesPerSeconds;
		var opts = merge({vx: vx, vy: vy}, enemyConfig);
		var enemy = this.obtain(x, y, opts);
		enemy.target = target;
		enemy.shotsLeft = 1;
		//enemy.showHitBounds();

		return enemy;
	};
});