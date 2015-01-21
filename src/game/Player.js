/**
 * Created by shirkan on 1/20/15.
 */
import entities.Entity as Entity;
import ui.ImageView as ImageView;

var playerConfig = {
	name : "Player",
	image: res.Player_png,
	isAnchored: true,
	hitBounds: {
		x: PiuPiuConsts.playerWidth / 4,
		y: PiuPiuConsts.playerHeight / 4,
		w: PiuPiuConsts.playerWidth / 2,
		h: PiuPiuConsts.playerHeight / 2
	}
};

exports = Class(Entity, function() {
	var sup = Entity.prototype;
	this.viewClass = ImageView;

	this.init = function(opts) {
		opts = merge(opts, playerConfig);
		sup.init.call(this, opts);
		sup.reset.call(this, 0, (PiuPiuGlobals.winSize.height - PiuPiuConsts.playerHeight) / 2, playerConfig);
		this.showHitBounds();
	};
});