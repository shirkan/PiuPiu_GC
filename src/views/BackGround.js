/**
 * Created by shirkan on 1/19/15.
 */

import ui.ImageView as ImageView;
import src.views.BackGround as Background;

exports = Class(ImageView, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0,
			image: PiuPiuGlobals.commonGrassMap
		});

		supr(this, 'init', [opts]);

		this.build();
		//this._createMainMenu();
	};

	this.changeBG = function () {};
});