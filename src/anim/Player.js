/**
 * Created by shirkan on 1/26/15.
 */

import ui.ImageView as ImageView;

/** @const */ var PLAYER_WIDTH = 57;
/** @const */ var PLAYER_HEIGHT = 170;

exports = Class(ImageView, function(supr) {
	this.init = function (opts) {
		this.name = "AnimPlayer";
		opts = merge(opts, {
			width: PLAYER_WIDTH,
			height: PLAYER_HEIGHT,
			image: res.Player_new_png
		});

		supr(this, 'init', [opts]);
	};
});