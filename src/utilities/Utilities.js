/**
 * Created by shirkan on 11/24/14.
 */

import device;

exports
{
    isNumber = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };

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
    };

    isRunningOnAndroid = function () {
        return device.isAndroid;
    };

    isRunningOniOS = function () {
        return device.isIOS;
    };

    isRunningOnMobile = function () {
        return device.isMobileNative;
    };

    isDebugMode = function () {
        //return cc.game.config["debugMode"];
    };

    LOG = function (str) {
        logger.log(str);
    };

    randomNumber = function (min, max, isRounded) {
        min = min || 0;
        max = max || 0;
        var range = max - min;
        var res = (Math.random() * range + min);
        if (isRounded) {
            res = Math.floor(res);
        }
        return res;
    };

    baseName = function (str){
        var base = new String(str).substring(str.lastIndexOf('/') + 1);
        if(base.lastIndexOf(".") != -1)
            base = base.substring(0, base.lastIndexOf("."));
        return base;
    };
}