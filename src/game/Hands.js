/**
 * Created by shirkan on 1/20/15.
 */
import ui.ImageView as ImageView;
import entities.Entity as Entity;

/** @const */ var HANDS_WIDTH = 83;
/** @const */ var HANDS_HEIGHT = 43;
var handsConfig = {
	isAnchored: true,
	width: HANDS_WIDTH,
	height: HANDS_HEIGHT,
	anchorY : HANDS_HEIGHT / 2,
	autoStart: true,
	autoSize: true,
	anims: {
		normal: {
			x1: 2,
			x2: 85
		},
		captain: {
			x1: 87,
			x2: 168
		},
		machineGun: {
			x1: 169,
			x2: 253
		},
		machineGunCaptain: {
			x1: 254,
			x2: 337
		}
	},
	image: res.Hands_png
};

exports = Class(Entity, function() {
	var sup = Entity.prototype;
	this.name = "Hands";
	this.viewClass = ImageView;

	this.init = function(opts) {
		opts = merge(opts, handsConfig);
		sup.init.call(this, opts);
		sup.reset.call(this, PiuPiuGlobals.handsAnchor.x, PiuPiuGlobals.handsAnchor.y, handsConfig);

		//this.view.getImage().setURL(res.Hands_png);
		this.map = this.view.getImage().getMap();
		this.view._offsetX = this.map.x;
		this.view._offsetY = this.map.y;
		this.view.width = HANDS_WIDTH;

		//this.view._sizeY = 43;
		this.setNormal();
	};

	this.setNormal = function() {
		this.map.width = this.view.width = this.view.style._width = handsConfig.anims.normal.x2 - handsConfig.anims.normal.x1;
		this.map.x = this.view._offsetX + handsConfig.anims.normal.x1
	};
	this.setCaptain = function() {
		//this.view.loadFromSheet("captain");
		this.map.width = this.view.width = this.view.style._width = handsConfig.anims.captain.x2 - handsConfig.anims.captain.x1;
		this.map.x = this.view._offsetX + handsConfig.anims.captain.x1
	};
	this.setMachineGun = function() {
		//this.view.loadFromSheet("machineGun");
		this.map.width = this.view.width = this.view.style._width = handsConfig.anims.machineGun.x2 - handsConfig.anims.machineGun.x1;
		this.map.x = this.view._offsetX + handsConfig.anims.machineGun.x1
	};
	this.setMachineGunCaptain = function() {
		//this.view.loadFromSheet("machineGunCaptain");
		this.map.width = this.view.width = this.view.style._width = handsConfig.anims.machineGunCaptain.x2 - handsConfig.anims.machineGunCaptain.x1;
		this.map.x = this.view._offsetX + handsConfig.anims.machineGunCaptain.x1
	};
	this.rotateHands = function (angle) {
		this.view.style.r = angle;
	};
});
