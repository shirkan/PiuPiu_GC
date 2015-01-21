/**
 * Created by shirkan on 1/20/15.
 */
import ui.SpriteView as SpriteView;
import entities.Entity as Entity;

const HANDS_WIDTH = 80;
const HANDS_HEIGHT = 40;
var handsConfig = {
	isAnchored: true,
	width: HANDS_WIDTH,
	height: HANDS_HEIGHT,
	anchorY : HANDS_HEIGHT / 2,
	autoStart: true,
	autoSize: true,
	sheetData: {
		url: res.Hands_png,
		width: HANDS_WIDTH,
		height: HANDS_HEIGHT,
		startX: 0,
		startY: 0,
		anims: {
			normal: [0,0],
			captain: [1,0],
			machineGun: [2,0],
			machineGunCaptain: [3,0]
		}
	}
};

exports = Class(Entity, function() {
	var sup = Entity.prototype;
	this.name = "Hands";
	this.viewClass = SpriteView;

	this.init = function(opts) {
		opts = merge(opts, handsConfig);
		sup.init.call(this, opts);
		sup.reset.call(this, PiuPiuGlobals.handsAnchor.x, PiuPiuGlobals.handsAnchor.y, handsConfig);
		this.setNormal();
	};

	this.setNormal = function() {
		this.view.startAnimation("normal");
	};
	this.setCaptain = function() {
		this.view.startAnimation("captain");
	};
	this.setMachineGun = function() {
		this.view.startAnimation("machineGun");
	};
	this.setMachineGunCaptain = function() {
		this.view.startAnimation("machineGunCaptain");
	};
	this.rotateHands = function (angle) {
		this.view.style.r = angle;
	};
});
