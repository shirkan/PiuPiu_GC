/**
 * Created by shirkan on 12/31/14.
 */

import facebook as FB;

FB.onReady.run(function () {
    FB.init({
        appId: CONFIG.modules.facebook.facebookAppID,
        displayName: CONFIG.modules.facebook.facebookDisplayName,
    });
});

// ***** Facebook utilities *****
exports
{
    FBfirstTime = function () {
        return FBlogin(this, function () {
            LOG("FBfirstTime: success!");
            PiuPiuGlobals.FBdidEverAccessed = true;
            saveData("FBdidEverAccessed", true);
        });
    };

    FBstatusChange = function (response, target, success_callback, error_callback) {
        if (response.status === 'connected') {
            LOG("FBstatusChange: connected! invoking " + success_callback);
            target && success_callback && success_callback.call(target);
            return true;
        } else {
            LOG("FBstatusChange: not connected! invoking " + error_callback);
            target && error_callback && error_callback.call(target);
            return false;
        }
    };

    FBinit = function () {
        //  Check that the user has granted accessed before
        if (!PiuPiuGlobals.FBdidEverAccessed) {
            LOG("FBinit: user never logged in before.");
            return false;
        }

        LOG("FBinit: logged in before, trying to login now.");
        if (FBisLoggedIn()) {
            LOG("FBinit: logged in!");
        } else {
            LOG("FBinit: not logged in!");
            //  Try to get access token
            if (!FBlogin()) {
                LOG("FBinit: could not login in... giving up");
                return false;
            }
        }
        FBgetScore();
        FBonLoginUpdates();
        return true;
    };

    FBlogin = function (target, success_callback, error_callback) {
        var res = false;
        LOG("FBlogin: asking for the following permissions: " + PiuPiuConsts.FBpermissionsNeeded);
        FB.login(bind(this, function (success) {
            if (success) {
                res = true;
                target && success_callback && success_callback.call(target);
            } else {
                target && error_callback && error_callback.call(target);
            }
        }, {scope: PiuPiuConsts.FBpermissionsNeeded}));

        return res;
    };

    FBisLoggedIn = function ( target, loggedInCallback, notLoggedInCallback) {
        var res = false;
        FB.getLoginStatus(bind(this, function (response) {
            res = FBstatusChange(response, target, loggedInCallback, notLoggedInCallback)
        }));

        return res;
    };


    //  OLD LEGACY CODE

    //FBlogin = function (target, success_callback, error_callback) {
    //    LOG("FBlogin: asking for the following permissions: " + PiuPiuConsts.FBpermissionsNeeded);
    //    FB.login(PiuPiuConsts.FBpermissionsNeeded, function(code, response){
    //        if(code == plugin.FacebookAgent.CODE_SUCCEED){
    //            LOG("FBlogin: login succeeded");
    //            var allowedPermissions = response["permissions"];
    //            var str = "";
    //            for (var i = 0; i < allowedPermissions.length; ++i) {
    //                str += allowedPermissions[i] + " ";
    //            }
    //            LOG("FBlogin Permissions: " + str);
    //            PiuPiuGlobals.FBpermissionsGranted = allowedPermissions;
    //
    //            FBonLoginUpdates();
    //
    //            if (success_callback) { success_callback.call(target) }
    //        } else {
    //            LOG("FBlogin Login failed, error #" + code + ": " + JSON.stringify(response));
    //            if (error_callback) { error_callback.call(target) }
    //        }
    //    });
    //};
    //
    //FBonLoginUpdates = function () {
    //
    //    LOG("FBonLoginUpdates Has all permission?: " + FBcheckPermissions());
    //
    //    LOG("FBonLoginUpdates Getting score");
    //    FBgetScore();
    //
    //    LOG("FBonLoginUpdates Getting all scores");
    //    FBgetAllScores();
    //}
    //
    //FBlogout = function () {
    //    if (FBisLoggedIn()) {
    //        FB.logout();
    //    }
    //    LOG("FBlogout Facebook logged out. IsloggedIn? " + FBisLoggedIn());
    //}
    //
    //
    //
    //FBcheckPermissions = function () {
    //    PiuPiuGlobals.FBpermissionsMissing = [];
    //    for (var i = 0; i < PiuPiuConsts.FBpermissionsNeeded.length; ++i) {
    //        if (PiuPiuGlobals.FBpermissionsGranted.indexOf(PiuPiuConsts.FBpermissionsNeeded[i]) == -1) {
    //            LOG("FBcheckPermissions Missing permission: " + PiuPiuConsts.FBpermissionsNeeded[i]);
    //            PiuPiuGlobals.FBpermissionsMissing.push(PiuPiuConsts.FBpermissionsNeeded[i]);
    //            //PiuPiuGlobals.FBhaveAllPermissions = false;
    //        }
    //    }
    //
    //    return (PiuPiuGlobals.FBpermissionsMissing.length == 0);
    //}
    //
    //FBpostScore = function ( score ) {
    //    if (!FBisLoggedIn()) {
    //        return false;
    //    }
    //
    //    var updateHighScore = function () {
    //        if (!isNumber(PiuPiuGlobals.FBplayerScoreData.score)){
    //            LOG("PiuPiuGlobals.FBplayerScoreData.score is not a number " + PiuPiuGlobals.FBplayerScoreData.score);
    //            return;
    //        }
    //        LOG("FB: " + PiuPiuGlobals.FBplayerScoreData.score + " < local: "+ PiuPiuGlobals.highScore);
    //        if (PiuPiuGlobals.FBplayerScoreData.score < PiuPiuGlobals.highScore) {
    //            LOG("Updated high score!");
    //            FBpostHighScore();
    //        } else {
    //            LOG("High score wasn't updated");
    //        }
    //
    //    };
    //
    //    //  We need to get high score from server and add the points of the last game.
    //    //  By doing this, we are aligned on all platforms and not only on local device :)
    //    var updateTotalScore = function ( score ) {
    //        FBpostTotalScore( parseInt(score) + parseInt(PiuPiuGlobals.FBplayerScoreData.totalscore))
    //    }
    //
    //    FBgetScore(this, function() { updateHighScore()});
    //}
    //
    //FBpostHighScore = function () {
    //    FB.api("/me/scores", "POST", {"score" : PiuPiuGlobals.highScore}, function (type, response) {
    //        if (type == plugin.FacebookAgent.CODE_SUCCEED) {
    //            LOG("FBpostHighScore: " + JSON.stringify(response));
    //        } else {
    //            LOG("FBpostHighScore: Graph API request failed, error #" + type + ": " + JSON.stringify(response));
    //        }
    //    });
    //    return true;
    //}
    //
    //FBgetScore = function ( target, success_callback, error_callback) {
    //    if (!FBisLoggedIn()) {
    //        return false;
    //    }
    //    PiuPiuGlobals.FBplayerScoreData = null;
    //    FB.api("/me/scores", "GET", function (type, response) {
    //        if (type == plugin.FacebookAgent.CODE_SUCCEED) {
    //            LOG("FBgetScore: " + JSON.stringify(response));
    //            PiuPiuGlobals.FBplayerScoreData = response.data[0];
    //
    //            //  Check if score exists
    //            if (!PiuPiuGlobals.FBplayerScoreData.score) {
    //                PiuPiuGlobals.FBplayerScoreData.score = 0;
    //            }
    //
    //            ////  Check if need to update local high score
    //            //if (PiuPiuGlobals.FBplayerScoreData.score > PiuPiuGlobals.highScore) {
    //            //    PiuPiuGlobals.highScore = PiuPiuGlobals.FBplayerScoreData.score;
    //            //    localStorage.setItem("highScore", PiuPiuGlobals.highScore);
    //            //}
    //            if (success_callback) { success_callback.call(target) }
    //        } else {
    //            LOG("FBgetScore: Graph API request failed, error #" + type + ": " + JSON.stringify(response));
    //            if (error_callback) { error_callback.call(target) }
    //        }
    //    });
    //}
    //
    //FBgetAllScores = function ( target, success_callback, error_callback ) {
    //    if (!FBisLoggedIn()) {
    //        return false;
    //    }
    //
    //    PiuPiuGlobals.FBallScoresData = null;
    //
    //    FB.api("/" + PiuPiuConsts.FB_appid+ "/scores", "GET", function (type, response) {
    //        if (type == plugin.FacebookAgent.CODE_SUCCEED) {
    //            PiuPiuGlobals.FBallScoresData = response.data;
    //            LOG("FBgetAllScores: " + JSON.stringify(PiuPiuGlobals.FBallScoresData));
    //            if (success_callback) { success_callback.call(target) }
    //        } else {
    //            LOG("FBgetAllScores: Graph API request failed, error #" + type + ": " + JSON.stringify(response));
    //            if (error_callback) { error_callback.call(target) }
    //        }
    //    });
    //}
    //
    //FBdeleteAll = function () {
    //    if (!FBisLoggedIn()) {
    //        return false;
    //    }
    //    FB.api("/" + PiuPiuConsts.FB_appid+ "/scores", "DELETE", function (type, response) {
    //        if (type == plugin.FacebookAgent.CODE_SUCCEED) {
    //            PiuPiuGlobals.FBallScoresData = null;
    //            LOG("FBdeleteAll: " + JSON.stringify(response));
    //        } else {
    //            LOG("FBdeleteAll: Graph API request failed, error #" + type + ": " + JSON.stringify(response));
    //        }
    //    });
    //}
    //
    //FBdeleteMe = function () {
    //    if (!FBisLoggedIn()) {
    //        return false;
    //    }
    //    FB.api("/me/scores", "DELETE", function (type, response) {
    //        if (type == plugin.FacebookAgent.CODE_SUCCEED) {
    //            PiuPiuGlobals.FBallScoresData = null;
    //            LOG("FBdeleteMe: " + JSON.stringify(response));
    //        } else {
    //            LOG("FBdeleteMe: Graph API request failed, error #" + type + ": " + JSON.stringify(response));
    //        }
    //    });
    //}
    //
    //FBgetPicture = function ( userid, target, cb ) {
    //    if (!FBisLoggedIn()) {
    //        return false;
    //    }
    //
    //    FB.api("/" + userid + "/picture", "GET",
    //        {"type" : "normal", "height" : PiuPiuConsts.FBpictureSize, "width" : PiuPiuConsts.FBpictureSize}, function (type, response) {
    //            if (type == plugin.FacebookAgent.CODE_SUCCEED) {
    //                LOG("FBgetPicture: " + JSON.stringify(response));
    //                if (cb) { cb.call(target, userid, response.data.url) }
    //            } else {
    //                LOG("FBgetPicture: Graph API request failed, error #" + type + ": " + JSON.stringify(response));
    //            }
    //        });
    //}
}
