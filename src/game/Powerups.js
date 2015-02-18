/**
 * Created by shirkan on 1/21/15.
 */

import entities.Entity as Entity;
import entities.EntityPool as EntityPool;
import ui.ImageView as ImageView;
import animate;

/** @const */ var POWERUP_WIDTH = 50;
/** @const */ var POWERUP_HEIGHT = 50;

var PowerupConfig = {
	zIndex: PiuPiuConsts.powerupZIndex,
	width: POWERUP_WIDTH,
	height: POWERUP_HEIGHT,
	hitBounds: {
		x: 0,
		y: 0,
		w: POWERUP_WIDTH,
		h: POWERUP_HEIGHT
	},
	autoSize: true,
	anchorX: POWERUP_WIDTH / 2,
	anchorY: POWERUP_HEIGHT / 2,
	powerups: {
		machineGun : {
			name: "MachineGun",
			image: res.PowerupMachineGun_png,
			callback: "this.machineGunStart()"
		},
		oneUp : {
			name: "1Up",
			image: res.Powerup1Up_png,
			callback: "this.addLife()"
		},
		captain: {
			name: "Captain",
			image: res.PowerupCaptain_png,
			callback: "this.captainStart()"
		},
		stopwatch : {
			name: "Stopwatch",
			image: res.PowerupStopwatch_png,
			callback: "this.stopwatchStart()"
		}
	}
};

var Powerup = Class(Entity, function() {
	var sup = Entity.prototype;
	this.name = "Powerup";
	this.viewClass = ImageView;

	this.ANIMATION_TIME = 700;
	this.MAX_SCALE = 1;
	this.MIN_SCALE = 0.1

	this.init = function(opts) {
		opts = merge(opts, PowerupConfig);
		sup.init.call(this, opts);
	};

	this.resetObject = function (type) {
		var data = PowerupConfig.powerups[type];
		this.setData(data);
		this.view.setImage(data.image);
		this.view.style.scale = this.MIN_SCALE;
		this.name = data.name;
		this.start();
	};

	this.update = function(dt) {
		sup.update.call(this, dt);
	};

	this.setData = function ( data ) {
		this.data = data;
	};

	this.getData = function () {
		return (this.data ? this.data : null);
	};

	this.start = function () {
		this.scheduler = setTimeout(this.animateOut.bind(this), PiuPiuConsts.powerupPeriod);
		this.shootable = true;
		this.animateIn();
	};

	this.collidesWith = function(entity) {
		if (!this.shootable) {
			return false;
		}

		if (sup.collidesWith.call(this, entity)) {
			this.shootable = false;
			return true;
		}

		return false;
	};

	this.animateIn = function () {
		animate(this.view).clear().
			now({scale: this.MAX_SCALE}, this.ANIMATION_TIME, animate.easeInOutElastic);
	};

	this.animateOut = function () {
		this.shootable = false;
		animate(this.view).clear().
			now({scale: this.MIN_SCALE}, this.ANIMATION_TIME, animate.linear).
			then(this.release.bind(this));
	};

	this.release = function () {
		clearTimeout(this.scheduler);
		sup.release.call(this);
	};
});

exports = Class(EntityPool, function() {
	var sup = EntityPool.prototype;

	this.init = function(opts) {
		opts.ctor = Powerup;
		sup.init.call(this, opts);
	};

	this.reset = function() {
		sup.reset.call(this);
	};

	this.update = function(dt) {
		sup.update.call(this, dt);
	};

	this.spawnPowerup = function(type, opts) {
		//  Check if type exists
		if (PiuPiuConsts.powerupTypes.indexOf(type) == -1) {
			type = PiuPiuConsts.powerupTypes[randomNumber(0, PiuPiuConsts.powerupTypes.length, true)];
		}
		var opts = merge(opts, PowerupConfig);

		opts.x = opts.x || randomNumber(PiuPiuGlobals.winSize.width / 2, PiuPiuGlobals.winSize.width - POWERUP_WIDTH, false);
		opts.y = opts.y || randomNumber(0, PiuPiuGlobals.winSize.height - POWERUP_HEIGHT, false);
		opts.vx = -3;

		var powerup = this.obtain(opts.x, opts.y, opts);
		powerup.resetObject(type);
		//powerup.showHitBounds();

		return powerup;
	};
});