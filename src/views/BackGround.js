/**
 * Created by shirkan on 1/19/15.
 */

import ui.View as View;
import ui.ImageView as ImageView;
import parallax.Parallax as Parallax;

var config = [
	{
		id: "bg",
		zIndex: 0,
		yMultiplier: 0,
		yCanSpawn: false,
		yCanRelease: false,
		x: 0,
		y: 0,
		pieceOptions: [
			{
				id: "BG-Grass-1",
				image: res.BG_grass1_png
			}
		]
	}
];

exports = Class(View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			width: PiuPiuGlobals.winSize.width,
			height: PiuPiuGlobals.winSize.height,
			x: 0,
			y: 0,
			image: PiuPiuGlobals.commonGrassMap
		});

		supr(this, 'init', [opts]);

		this.parallax = new Parallax({parent: this});
		this.parallax.reset(config);

		this.xPos = 0;
		this.yPos = 0;

		//this.build();
		//this._createMainMenu();
	};

	this.reset = function () {
		var map = randomMap();
		config[0].pieceOptions[0].id = baseName(map);
		config[0].pieceOptions[0].image = map;
		this.parallax.reset(config);
	};

	this.update = function (x, y) {
		this.xPos = (this.xPos + x) % PiuPiuGlobals.winSize.width;
		this.yPos = (this.yPos + y) % PiuPiuGlobals.winSize.height;
		this.parallax.update(this.xPos, this.yPos);
	};

	this.changeBG = function () {};
});