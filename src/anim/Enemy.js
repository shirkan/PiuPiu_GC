/**
 * Created by shirkan on 1/26/15.
 */

import ui.ImageView as ImageView;

const ENEMY_WIDTH = 80;
const ENEMY_HEIGHT = 200;

exports = Class(ImageView, function(supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			width: ENEMY_WIDTH,
			height: ENEMY_HEIGHT,
			image: res.Enemy_new_png
		});

		supr(this, 'init', [opts]);
	};
});