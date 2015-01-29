/**
 * Created by shirkan on 1/26/15.
 */

import ui.ImageView as ImageView;

const PLAYER_WIDTH = 200;
const PLAYER_HEIGHT = 125;

exports = Class(ImageView, function(supr) {
	this.init = function (opts) {
		this.name = "AnimGoal";
		opts = merge(opts, {
			width: PLAYER_WIDTH,
			height: PLAYER_HEIGHT,
			image: res.Goal_png
		});

		supr(this, 'init', [opts]);
	};
});
