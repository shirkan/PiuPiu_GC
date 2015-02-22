/**
 * Created by shirkan on 2/5/15.
 */

import ui.ImageView as ImageView;
import ui.MaskedImageView as MaskedImageView;
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

		this.Y_PADDING = 3;
		this.X_PADDING = 20;
		this.PLACE_IMAGE_SIZE = 40;
		this.NAME_WIDTH = 750;
		this.SCORE_WIDTH = 310;

		//  Title
		this.title = new TextView({
			superview: this,
			fontFamily : PiuPiuConsts.fontName,
			size: PiuPiuConsts.fontSizeBig,
			text: PiuPiuConsts.worlds[0],
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
			text: "General",
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
			y: this.Y_PADDING + PiuPiuConsts.fontSizeBig,
			opacity : 0.5
		});

		//  Build leaderboard
		this.build();

		this.on('InputSelect', function () {
			GC.app.emit("leaderboard:end");
		});
	};

	this.refreshLeaderboard = function () {
		//var entriesToLoad = Math.min(PiuPiuGlobals.leaderboard.length, PiuPiuConsts.FBleaderboardShowTop);
		var world = PiuPiuConsts.worlds[PiuPiuGlobals.currentWorld];
		var entriesToLoad = PiuPiuGlobals.leaderboard[world].scores.length;

		for (i = 0; i < entriesToLoad; i++) {
			var uid = PiuPiuGlobals.leaderboard[world].scores[i];
			var picture = PiuPiuGlobals.UIDtoData[uid].picture;
			var name = PiuPiuGlobals.UIDtoData[uid].name;
			var score = PiuPiuGlobals.leaderboard[world][uid].score;

			this.FplaceImages[i].style.visible = true;
			this.FFBprofilePictures[i].setImage(picture);
			this.FFBprofilePictures[i].style.visible = true;
			this.Fnames[i].setText(name);
			this.Fnames[i].style.visible = true;
			this.Fscores[i].setText(score);
			this.Fscores[i].style.visible = true;
		}

		for (i = entriesToLoad; i < PiuPiuConsts.FBleaderboardShowTop; i++) {
			this.FplaceImages[i].style.visible = false;
			this.FFBprofilePictures[i].style.visible = false;
			this.Fnames[i].style.visible = false;
			this.Fscores[i].style.visible = false;
		}
	};

	this.build = function() {
		//  Build everyone

		//  Build friends
		var startX = this.X_PADDING;
		var startY = 2 * this.Y_PADDING + PiuPiuConsts.fontSizeBig + PiuPiuConsts.fontSizeNormal;

		this.FplaceImages = {};
		this.FFBImages = {};
		this.FFBprofilePictures = {};
		this.Fnames = {};
		this.Fscores = {};

		var rowHeight = PiuPiuConsts.FBpictureSize;

		for (var i=0; i < PiuPiuConsts.FBleaderboardShowTop; i++) {
			var y = startY + i * (rowHeight + this.Y_PADDING);
			var x = startX;
			var color = (i%2) ? "blue" : "yellow";
			var strokeColor = (i%2) ? "yellow" : "blue";
			var placeImage = eval("res.place" + (i+1) + "_png");

			this.FplaceImages[i] = new ImageView({
				superview : this,
				width : this.PLACE_IMAGE_SIZE,
				height : this.PLACE_IMAGE_SIZE,
				x: x,
				y: y + (rowHeight - this.PLACE_IMAGE_SIZE) / 2,
				image: placeImage
			});

			x += this.PLACE_IMAGE_SIZE + this.X_PADDING;

			this.FFBprofilePictures[i] = new MaskedImageView ({
				superview : this,
				mask: res.stencil_png,
				width : PiuPiuConsts.FBpictureSize,
				height : PiuPiuConsts.FBpictureSize,
				x: x,
				y: y
			});

			x += PiuPiuConsts.FBpictureSize + this.X_PADDING;

			this.Fnames[i] = new TextView({
				superview: this,
				fontFamily : PiuPiuConsts.fontName,
				size: PiuPiuConsts.fontSizeNormal,
				color: color,
				strokeColor: strokeColor,
				strokeWidth: PiuPiuConsts.fontStrokeSize,
				width: this.NAME_WIDTH,
				height: PiuPiuConsts.fontSizeNormal,
				horizontalAlign: 'left',
				x: x,
				y: y + (rowHeight - PiuPiuConsts.fontSizeNormal) / 2
			});

			x += this.NAME_WIDTH + this.X_PADDING;

			this.Fscores[i] = new TextView({
				superview: this,
				fontFamily : PiuPiuConsts.fontName,
				size: PiuPiuConsts.fontSizeNormal,
				color: color,
				strokeColor: strokeColor,
				strokeWidth: PiuPiuConsts.fontStrokeSize,
				width: this.SCORE_WIDTH,
				height: PiuPiuConsts.fontSizeNormal,
				horizontalAlign: 'right',
				x: x,
				y: y + (rowHeight - PiuPiuConsts.fontSizeNormal) / 2
			});
		}
	};

});
