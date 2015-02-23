/**
 * Created by shirkan on 1/26/15.
 */
import animate;

exports
{
	dissolvePushScenes = function (rootView, toScene, duration, cb) {
		var sceneDuration = duration / 2;
		var fromScene = rootView.getCurrentView();
		toScene.style.opacity = 0;
		animate(fromScene).now({opacity : 0}, sceneDuration).then(function () {
			rootView.push(toScene, true);
			fromScene.style.opacity = 1;
		});

		animate(toScene).wait(sceneDuration).then({opacity : 1}, sceneDuration).
		then(function () {
			if (cb) {
				setTimeout(function () {cb.call(rootView)}, duration);
			}
		});

	};

	dissolvePopScenes = function (rootView, duration, cb) {
		if (rootView.stack.length < 2) {
			return;
		}

		var sceneDuration = duration / 2;
		var fromScene = rootView.getCurrentView();
		var toScene = rootView.stack[rootView.stack.length - 2];
		toScene.style.opacity = 0;
		animate(fromScene).now({opacity : 0}, sceneDuration).then(function () {
			rootView.pop(true);
			fromScene.style.opacity = 1;
		});

		animate(toScene).wait(sceneDuration).then({opacity : 1}, sceneDuration).
		then (function () {
			if (cb) {
				setTimeout(function () {cb.call(rootView)}, duration);
			}
		});
	};
}