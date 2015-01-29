/**
 * Created by shirkan on 1/26/15.
 */

import ui.ImageView as ImageView;

const BALL_WIDTH = 32;
const BALL_HEIGHT = 32;

exports = Class(ImageView, function(supr) {
	this.init = function (opts) {
		this.name = "AnimBall";
		opts = merge(opts, {
			width: BALL_WIDTH,
			height: BALL_HEIGHT,
			image: res.Ball_png
		});

		supr(this, 'init', [opts]);
	};
});