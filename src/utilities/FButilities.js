/**
 * Created by shirkan on 12/31/14.
 */

import facebook as FB;

// ***** Facebook utilities *****
exports
{
    FBfirstTime = function (target, success_callback, error_callback) {
        LOG("FBfirstTime: trying to connect");
        return FBlogin(this, function () {
            LOG("FBfirstTime: success!");
            PiuPiuGlobals.FBdidEverAccessed = true;
            saveData("FBdidEverAccessed", PiuPiuGlobals.FBdidEverAccessed);
            target && success_callback && success_callback.call(target);
        }, error_callback);
    };

    FBstatusChange = function (response, target, success_callback, error_callback) {
        if (!response || response.status != "connected") {
            LOG("FBstatusChange: not connected!");
            PiuPiuGlobals.FBisConnected = false;
            //  falsifying did Ever connect, to prevent user nagging
            PiuPiuGlobals.FBdidEverAccessed = false;
            saveData("FBdidEverAccessed", PiuPiuGlobals.FBdidEverAccessed);
            target && error_callback && error_callback.call(target);
        } else {
            LOG("FBstatusChange: connected!");
            PiuPiuGlobals.FBisConnected = true;
            target && success_callback && success_callback.call(target);
        }
    };

    FBinit = function () {
        //  Check that the user has granted accessed before
        if (!PiuPiuGlobals.FBdidEverAccessed) {
            LOG("FBinit: user never logged in before.");
        }
        LOG("FBinit: checking is logged in");
        return FBisLoggedIn(this, FBonLoginUpdates, null, true); //force check is logged in
    };

    FBlogin = function (target, success_callback, error_callback) {
        LOG("FBlogin: asking for the following permissions: " + PiuPiuConsts.FBpermissionsNeeded);
        FB.login(function (response) {
            if (!response || !response.status || response.status != "connected") {
                LOG("FBlogin: response error " + JSON.stringify(response));
                PiuPiuGlobals.FBisConnected = false;
                target && error_callback && error_callback.call(target);
            } else {
                PiuPiuGlobals.FBisConnected = true;
                FBonLoginUpdates();
                target && success_callback && success_callback.call(target);
            }
        });
    };

    //  Generally force should be disabled. special case is on startup when we want to check if we are already logged in
    FBisLoggedIn = function ( target, loggedInCallback, notLoggedInCallback, force) {
        if (!PiuPiuGlobals.FBisConnected && !force) {
            LOG("FBisLoggedIn: FB is not connected");
            target && notLoggedInCallback && notLoggedInCallback.call(target);
            return;
        }

        FB.getLoginStatus(bind(this, function (response) {
            LOG("FBisLoggedIn: received info regarding status");
            FBstatusChange(response, target, loggedInCallback, notLoggedInCallback)
        }));
    };

    FBonLoginUpdates = function () {
        if (!PiuPiuGlobals.FBisConnected) {
            LOG("FBonLoginUpdates: FB is not connected");
            return;
        }

        LOG("FBonLoginUpdates Getting score");
        FBgetScore(this, handleHighScore);

        //  Since this is the last operation we are doing here, tell application FB is logged-in in case any other
        // things need to be done.
        LOG("FBonLoginUpdates Getting all scores");
        FBgetAllScores(this, function () {
            GC.app.emit("facebook:loggedin");
        });
    };

    FBgetScore = function (target, success_callback, error_callback) {
        if (!PiuPiuGlobals.FBisConnected) {
            LOG("FBgetScore: FB is not connected");
            target && error_callback && error_callback.call(target);
            return;
        }

        PiuPiuGlobals.FBdata = null;
        FB.api("/me/scores", 'GET', function (response) {
            if (!response || response.error) {
                LOG("FBgetScore: response error " + JSON.stringify(response));
                target && error_callback && error_callback.call(target);
            } else {
                LOG("FBgetScore: " + JSON.stringify(response));
                PiuPiuGlobals.FBdata = response.data[0];

                //  Check if score exists
                if (!PiuPiuGlobals.FBdata.score) {
                    PiuPiuGlobals.FBdata.score = 0;
                }

                target && success_callback && success_callback.call(target);
            }
        });
    };

    FBgetAllScores = function ( target, success_callback, error_callback ) {
        PiuPiuGlobals.FBallScoresData = null;

        if (!PiuPiuGlobals.FBisConnected) {
            LOG("FBgetAllScores: FB is not connected");
            target && error_callback && error_callback.call(target);
            return;
        }

        FB.api("/" + PiuPiuConsts.FB_appid + "/scores", "GET", function (response) {
            if (!response || response.error) {
                LOG("FBgetAllScores: response error " + JSON.stringify(response));
                target && error_callback && error_callback.call(target);
            } else {
                PiuPiuGlobals.FBallScoresData = response.data;
                LOG("FBgetAllScores: " + JSON.stringify(PiuPiuGlobals.FBallScoresData));
                target && success_callback && success_callback.call(target);
            }
        });
    };

    FBgetPicture = function (userid, target, cb ) {
        if (!PiuPiuGlobals.FBisConnected) {
            LOG("FBgetPicture: FB is not connected");
            return;
        }

        FB.api("/" + userid + "/picture", "GET",
            {"type" : "normal", "height" : PiuPiuConsts.FBpictureSize.toString(),
            "width" : PiuPiuConsts.FBpictureSize.toString(), "redirect": false.toString()}, function (response) {
                if (response && !response.error) {
                    LOG("FBgetPicture: " + JSON.stringify(response));
                    if (cb) { cb.call(target, userid, response.data.url) }
                } else {
                    LOG("FBgetPicture: Graph API request failed: " + JSON.stringify(response));
                }
            });
    };

    FBpostHighScore = function (score) {
        if (!PiuPiuGlobals.FBisConnected) {
            LOG("FBpostHighScore: FB is not connected");
            return;
        }

        FB.api("/me/scores", "POST", {"score" : score.toString()}, function (response) {
            if (response) {
                LOG("FBpostHighScore succeed: " + JSON.stringify(response));
                //  Invoke FBgetScore to verify written data and update local variable
                FBgetScore();
            } else {
                LOG("FBpostHighScore failed: Graph API request failed, error #" + type + ": " + JSON.stringify(response));
            }
        });
    };
}

FB.onReady.run(function () {
    FB.init({
        appId: CONFIG.modules.facebook.facebookAppID,
        displayName: CONFIG.modules.facebook.facebookDisplayName,
    });
    FBinit();
});