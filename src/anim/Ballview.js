/**
 * Created by shirkan on 2/2/15.
 */

import ui.View as View;

/** @const */ var BALL_WIDTH = 32;
/** @const */ var BALL_HEIGHT = 32;

exports = Class(View, function(supr) {
	this.init = function (opts) {
		this.name = "AnimBall";
		opts = merge(opts, {
			name: "ballView",
			zIndex: PiuPiuConsts.statusZIndex,
			width: BALL_WIDTH,
			height: BALL_HEIGHT
		});

		supr(this, 'init', [opts]);
	};
});