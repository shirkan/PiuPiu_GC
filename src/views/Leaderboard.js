/**
 * Created by shirkan on 2/5/15.
 */

import ui.ImageView as ImageView;
import ui.TextView as TextView;

/** @const */ var yGap = 10;
/** @const */ var startY = 100;
/** @const */ var widthRatio = 0.8;

exports = Class(ImageView, function (supr) {
	this.init = function (opts) {
		this.name = "LeaderboardView";
		opts = merge(opts, {
			x: 0,
			y: 0,
			image: PiuPiuGlobals.commonGrassMap
		});
		supr(this, 'init', [opts]);

		this.Y_PADDING = 5;
		this.X_PADDING = 5;
		this.IMAGE_SIZE = 40;
		this.NAME_WIDTH = 400;
		this.SCORE_WIDTH = 125;

		//  Title
		this.title = new TextView({
			superview: this,
			fontFamily : PiuPiuConsts.fontName,
			size: PiuPiuConsts.fontSizeBig,
			text: "Madrid",
			color: "yellow",
			strokeColor: "blue",
			strokeWidth: PiuPiuConsts.fontStrokeSize,
			width: PiuPiuGlobals.winSize.width,
			height: PiuPiuConsts.fontSizeBig,
			horizontalAlign: 'center',
			x: 0,
			y: this.Y_PADDING
		});

		//  Sub-titles
		this.everyone = new TextView({
			superview: this,
			fontFamily : PiuPiuConsts.fontName,
			size: PiuPiuConsts.fontSizeNormal,
			text: "Everyone",
			color: "blue",
			strokeColor: "yellow",
			strokeWidth: PiuPiuConsts.fontStrokeSize,
			width: PiuPiuGlobals.winSize.width / 2 ,
			height: PiuPiuConsts.fontSizeNormal,
			horizontalAlign: 'center',
			x: 0,
			y: this.Y_PADDING + PiuPiuConsts.fontSizeBig
		});

		this.friends = new TextView({
			superview: this,
			fontFamily : PiuPiuConsts.fontName,
			size: PiuPiuConsts.fontSizeNormal,
			text: "Friends",
			color: "blue",
			strokeColor: "yellow",
			strokeWidth: PiuPiuConsts.fontStrokeSize,
			width: PiuPiuGlobals.winSize.width / 2,
			height: PiuPiuConsts.fontSizeNormal,
			horizontalAlign: 'center',
			x: PiuPiuGlobals.winSize.width / 2,
			y: this.Y_PADDING + PiuPiuConsts.fontSizeBig
		});

		this.on('InputSelect', function () {
			GC.app.emit("leaderboard:end");
		});
	};

	this.getFBImages = function () {
		this.loadDataCounter = Math.min(PiuPiuGlobals.FBallScoresData.length, PiuPiuConsts.FBleaderboardShowTop);
		this.FFBImages = {};
		for (var i=0; i < this.loadDataCounter; i++) {
			FBgetPicture(PiuPiuGlobals.FBallScoresData[i].user.id, this, function (userid, url) {
				this.FFBImages[userid] = url;
			});
		}
	};

	this.build = function() {
		//  Build everyone

		//  Build friends
		var startX = PiuPiuGlobals.winSize.width / 2 + this.X_PADDING;
		var startY = 2 * this.Y_PADDING + PiuPiuConsts.fontSizeBig + PiuPiuConsts.fontSizeNormal;

		this.FplaceImages = {};
		this.FFBprofilePictures = {};
		this.Fnames = {};
		this.Fscores = {};

		for (var i=0; i < this.loadDataCounter; i++) {
			var y = startY + i * (this.IMAGE_SIZE + this.Y_PADDING);
			var x = startX;
			var color = (i%2) ? "blue" : "yellow";
			var strokeColor = (i%2) ? "yellow" : "blue";
			var placeImage = eval("res.place" + (i+1) + "_png");

			this.FplaceImages[i] = new ImageView({
				superview : this,
				width : this.IMAGE_SIZE,
				height : this.IMAGE_SIZE,
				x: x,
				y: y,
				image: placeImage
			});

			x += this.IMAGE_SIZE + this.X_PADDING;

			this.FFBprofilePictures[i] = new ImageView ({
				superview : this,
				width : PiuPiuConsts.FBpictureSize,
				height : PiuPiuConsts.FBpictureSize,
				x: x,
				y: y,
				image: this.FFBImages[PiuPiuGlobals.FBallScoresData[i].user.id]
			});

			x += this.IMAGE_SIZE + this.X_PADDING * 2;

			this.Fnames[i] = new TextView({
				superview: this,
				fontFamily : PiuPiuConsts.fontName,
				size: PiuPiuConsts.fontSizeSmall,
				text: PiuPiuGlobals.FBallScoresData[i].user.name,
				color: color,
				strokeColor: strokeColor,
				strokeWidth: PiuPiuConsts.fontStrokeSize,
				width: this.NAME_WIDTH,
				height: PiuPiuConsts.fontSizeSmall,
				horizontalAlign: 'left',
				x: x,
				y: y + ((this.IMAGE_SIZE - PiuPiuConsts.fontSizeSmall) / 2)
			});

			x += this.NAME_WIDTH + this.X_PADDING * 2;

			this.Fscores[i] = new TextView({
				superview: this,
				fontFamily : PiuPiuConsts.fontName,
				size: PiuPiuConsts.fontSizeSmall,
				text: PiuPiuGlobals.FBallScoresData[i].score,
				color: color,
				strokeColor: strokeColor,
				strokeWidth: PiuPiuConsts.fontStrokeSize,
				width: this.SCORE_WIDTH,
				height: PiuPiuConsts.fontSizeSmall,
				horizontalAlign: 'right',
				x: x,
				y: y + ((this.IMAGE_SIZE - PiuPiuConsts.fontSizeSmall) / 2)
			});
		}
	};

});
