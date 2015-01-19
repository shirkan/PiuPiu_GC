/**
 * Created by shirkan on 1/19/15.
 */

import ui.ImageView as ImageView;
import ui.TextView as TextView;
import ui.View;
import animate;

exports = Class(ImageView, function (supr) {
	this.init = function (opts) {
		var map = randomMap();

		opts = merge(opts, {
			x: 0,
			y: 0,
			image: map
		});

		supr(this, 'init', [opts]);

		this.build();
	};

	this.build = function () {

	};
});