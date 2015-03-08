/**
 * Created by shirkan on 1/19/15.
 */

import ui.View as View;
import ui.ImageView as ImageView;
import parallax.Parallax as Parallax;
import animate;

var config = [
	{
		id: "bg",
		zIndex: 0,
		yMultiplier: 0,
		yCanSpawn: false,
		yCanRelease: false,
		xGapRange: [-1, -1],
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

		this.parallaxA = new Parallax({parent: this});
		this.parallaxA.reset(config);
		this.parallaxB = new Parallax({parent: this});
		this.parallaxB.reset(config);

		this.parallaxAviewA = this.parallaxA.layerPool._views[0].piecePool._views[0]; //style?
		this.parallaxAviewB = this.parallaxA.layerPool._views[0].piecePool._views[1];
		this.parallaxBviewA = this.parallaxB.layerPool._views[0].piecePool._views[0]; //style?
		this.parallaxBviewB = this.parallaxB.layerPool._views[0].piecePool._views[1];

		this.xPos = 0;
		this.yPos = 0;
		this.TRANSFORM_MAP_TIME = 1000;
	};

	resetMap = function ( parallax ) {
		var map = randomMap();
		config[0].pieceOptions[0].id = baseName(map);
		config[0].pieceOptions[0].image = map;
		parallax.reset(config);
	};

	this.reset = function () {
		resetMap(this.parallaxA);
		resetMap(this.parallaxB);
	};

	this.update = function (x, y) {
		this.xPos = (this.xPos + x) % PiuPiuGlobals.winSize.width;
		this.yPos = (this.yPos + y) % PiuPiuGlobals.winSize.height;
		this.parallaxA.update(this.xPos, this.yPos);
		this.parallaxB.update(this.xPos, this.yPos);
	};

	this.replaceMap = function () {
		if (this.isParallaxAActive) {
			animate(this.parallaxAviewA).clear().now({opacity : 0}, this.TRANSFORM_MAP_TIME, animate.linear);
			animate(this.parallaxAviewB).clear().now({opacity : 0}, this.TRANSFORM_MAP_TIME, animate.linear);
			animate(this.parallaxBviewA).clear().now({opacity : 1}, this.TRANSFORM_MAP_TIME, animate.linear);
			animate(this.parallaxBviewB).clear().now({opacity : 1}, this.TRANSFORM_MAP_TIME, animate.linear);
			this.isParallaxAActive = false;
		} else {
			animate(this.parallaxAviewA).clear().now({opacity : 1}, this.TRANSFORM_MAP_TIME, animate.linear);
			animate(this.parallaxAviewB).clear().now({opacity : 1}, this.TRANSFORM_MAP_TIME, animate.linear);
			animate(this.parallaxBviewA).clear().now({opacity : 0}, this.TRANSFORM_MAP_TIME, animate.linear);
			animate(this.parallaxBviewB).clear().now({opacity : 0}, this.TRANSFORM_MAP_TIME, animate.linear);
			this.isParallaxAActive = true;
		}
	};
});