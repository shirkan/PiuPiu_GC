/**
 * Created by shirkan on 1/26/15.
 */

import ui.ImageView as ImageView;

const BULLET_WIDTH = 10;
const BULLET_HEIGHT = 4;

exports = Class(ImageView, function(supr) {
	this.init = function (opts) {
		this.name = "AnimBullet";
		opts = merge(opts, {
			width: BULLET_WIDTH,
			height: BULLET_HEIGHT,
			image: res.Bullet_png
		});

		supr(this, 'init', [opts]);
	};
});