/**
 * Created by shirkan on 1/18/15.
 */

import ui.View;
import ui.TextView;
//import src.anim.SplashAnim as SplashAnim;

exports = Class(ui.View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0,
			width: PiuPiuGlobals.winSize.width,
			height: PiuPiuGlobals.winSize.height
		});

		supr(this, 'init', [opts]);

		this.build();
	};

	this.build = function() {
		var title = new ui.TextView({
			superview: this,
			x: 0,
			y: 0,
			anchorX: PiuPiuGlobals.winSize.width /2,
			anchorY: PiuPiuGlobals.winSize.height /2,
			text: "Meganeev\nStudios",
			wrap: true,
			size: PiuPiuConsts.fontSizeBig,
			fontFamily : PiuPiuConsts.fontName,
			color: "#ffffff",
			layout: "box",
			verticalAlign: 'middle',
			horizontalAlign: 'center'
		});

		//var anim = new SplashAnim();
	};
});
