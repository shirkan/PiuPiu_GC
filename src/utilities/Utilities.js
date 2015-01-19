/**
 * Created by shirkan on 11/24/14.
 */

exports
{
    isNumber = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    isFileExist = function (filename) {
        if (!filename) {
            return false;
        }
        var xhr = new XMLHttpRequest();
        xhr.open('HEAD', filename, false);
        xhr.send();

        if (xhr.status == "404") {
            return false;
        } else {
            return true;
        }
    }

    isRunningOnAndroid = function () {
        //return (cc.sys.platform == cc.sys.ANDROID);
    }

    isRunningOniOS = function () {
        //return (cc.sys.platform == cc.sys.IPAD || cc.sys.platform == cc.sys.IPHONE);
    }

    isRunningOnMobile = function () {
        return (cc.sys.isMobile);
    }

    isDebugMode = function () {
        //return cc.game.config["debugMode"];
    }

    LOG = function (str) {
        logger.log(str);
    }

    randomNumber = function (min, max, isRounded) {
        min = min || 0;
        max = max || 0;
        var range = max - min;
        var res = (Math.random() * range + min);
        if (isRounded) {
            res = Math.floor(res);
        }
        return res;
    }
}