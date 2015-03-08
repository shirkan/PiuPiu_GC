/**
 * Created by shirkan on 1/26/15.
 */

import ui.ImageView as ImageView;
import ui.TextView as TextView;

/** @const */ var yGap = 10;
/** @const */ var startY = 100;
/** @const */ var widthRatio = 0.8;

exports = Class(ImageView, function (supr) {
	this.init = function (opts) {
		this.name = "StatisticsView";
		opts = merge(opts, {
			x: 0,
			y: 0,
			image: PiuPiuGlobals.commonGrassMap
		});
		supr(this, 'init', [opts]);

		var keys = [
			"Total bullets fired",
			"Total hits",
			"Hit rate",
			"Total enemies killed",
			"Total head shots",
			"Total power ups",
			"Total points",
			"High score"
		];

		this.keyText = {};
		this.valueText = {};

		for (var i=0; i< keys.length; i++) {
			var y = startY + i * (PiuPiuConsts.fontSizeNormal + yGap );
			var color = (i%2) ? "blue" : "yellow";
			var strokeColor = (i%2) ? "yellow" : "blue";

			this.keyText[i] = new TextView({
				superview: this,
				fontFamily : PiuPiuConsts.fontName,
				size: PiuPiuConsts.fontSizeNormal,
				text: keys[i],
				color: color,
				strokeColor: strokeColor,
				strokeWidth: PiuPiuConsts.fontStrokeSize,
				width: PiuPiuGlobals.winSize.width,
				height: PiuPiuConsts.fontSizeNormal,
				horizontalAlign: 'left',
				x: PiuPiuGlobals.winSize.width * 0.1,
				y: y
			});

			this.valueText[i] = new TextView({
				superview: this,
				fontFamily : PiuPiuConsts.fontName,
				size: PiuPiuConsts.fontSizeNormal,
				color: color,
				strokeColor: strokeColor,
				strokeWidth: PiuPiuConsts.fontStrokeSize,
				width: PiuPiuGlobals.winSize.width,
				height: PiuPiuConsts.fontSizeNormal,
				horizontalAlign: 'left',
				x: PiuPiuGlobals.winSize.width * 0.8,
				y: y
			});
		}
	};

	this.build = function() {
		//  Build statistics
		var totalHitsValue = PiuPiuGlobals.totalEnemyKilled + PiuPiuGlobals.totalPowerUps;
		var actualHitRate = (PiuPiuGlobals.totalBulletsFired ? (totalHitsValue / PiuPiuGlobals.totalBulletsFired * 100).toFixed(0) : 0)
		actualHitRate += "%";

		var values = [
			PiuPiuGlobals.totalBulletsFired,
			totalHitsValue,
			actualHitRate,
			PiuPiuGlobals.totalEnemyKilled,
			PiuPiuGlobals.totalHeadShots,
			PiuPiuGlobals.totalPowerUps,
			PiuPiuGlobals.totalPoints,
			PiuPiuGlobals["highScores." + PiuPiuConsts.worlds[PiuPiuGlobals.currentWorld]]
		];

		for (var i=0; i< values.length; i++) {
			this.valueText[i].setText(values[i]);
		}

		this.on('InputSelect', function () {
			GC.app.emit("stats:end");
		})
	};

});
