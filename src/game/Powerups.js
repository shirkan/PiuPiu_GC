/**
 * Created by shirkan on 1/21/15.
 */

import entities.Entity as Entity;
import entities.EntityPool as EntityPool;
import ui.ImageView as ImageView;

const POWERUP_WIDTH = 20;
const POWERUP_HEIGHT = 20;

var machineGun = {
	name: "MachineGun",
	image: res.PowerupMachineGun_png,
	callback: "this.machineGunStart()"
};

var oneUp = {
	name: "1Up",
	image: res.Powerup1Up_png,
	callback: "this.addLife()"
};

var captain = {
	name: "Captain",
	image: res.PowerupCaptain_png,
	callback: "this.captainStart()"
};

var stopwatch = {
	name: "Stopwatch",
	image: res.PowerupStopwatch_png,
	callback: "this.stopwatchStart()"
};

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
	period: PiuPiuConsts.powerupPeriod
};

var Powerup = Class(Entity, function() {
	var sup = Entity.prototype;
	this.name = "Powerup";
	this.viewClass = ImageView;

	this.init = function(opts) {
		opts = merge(opts, PowerupConfig);
		sup.init.call(this, opts);
	};

	this.resetObject = function (data) {
		this.setData(data);
		this.view.setImage(data.image);
		this.name = data.name;
		this.start();
	};

	this.update = function(dt) {
		sup.update.call(this, dt);
	};
	this.setData = function ( data ) {
		this.data = data;
	}
	this.getData = function () {
		return (this.data ? this.data : null);
	}
	this.start = function () {
		setTimeout(this.release, this.period);
	}
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
			LOG("powerup doesn't exist, invoking random powerup " + type);
		}
		var opts = merge(opts, PowerupConfig);

		opts.x = opts.x || randomNumber(PiuPiuGlobals.winSize.width / 2, PiuPiuGlobals.winSize.width - POWERUP_WIDTH, false);
		opts.y = opts.y || randomNumber(0, PiuPiuGlobals.winSize.height - POWERUP_HEIGHT, false);

		var powerup = this.obtain(opts.x, opts.y, opts);
		eval("powerup.resetObject(" + type+ ")");
		powerup.showHitBounds();
	};
});