/**
 * Created by shirkan on 12/31/14.
 */

import facebook as FB;
import src.utilities.ParseUtilities;

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
            LOG("FBstatusChange: not connected! response: " + JSON.stringify(response));
            PiuPiuGlobals.FBisConnected = false;
            //  falsifying did Ever connect, to prevent user nagging
            PiuPiuGlobals.FBdidEverAccessed = false;
            saveData("FBdidEverAccessed", PiuPiuGlobals.FBdidEverAccessed);
            target && error_callback && error_callback.call(target);
        } else {
            LOG("FBstatusChange: connected! response: " + JSON.stringify(response));
            PiuPiuGlobals.FBisConnected = true;
            FBgetMyUID(target, success_callback, error_callback);
        }
    };

    FBinit = function () {
        loadData("FBdidEverAccessed");
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
                LOG("FBlogin: response success: " + JSON.stringify(response));
                PiuPiuGlobals.FBisConnected = true;
                FBgetMyUID(this, FBonLoginUpdates);
                target && success_callback && success_callback.call(target);
            }
        }, {scope: "public_profile, user_friends"});
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

        LOG("FBonLoginUpdates Getting my scores");
        //ParseLoadMyScore(PiuPiuConsts.worlds[PiuPiuGlobals.currentWorld], this, handleHighScore);
        //FBgetScore(this, handleHighScore);
        handleAllHighScores();

        //  Since this is the last operation we are doing here, tell application FB is logged-in in case any other
        // things need to be done.
        LOG("FBonLoginUpdates Getting all scores");
        //FBgetAllScores(this, function () {
        ParseLoadAllScores(PiuPiuConsts.worlds[PiuPiuGlobals.currentWorld], this, function () {
            GC.app.emit('onlineData:ready');
        });
    };

    FBgetMyUID = function (target, success_callback, error_callback) {
        FB.api("/me", 'get', function (response) {
            if (!response || response.error) {
                LOG("FBGetMyUID: response error " + JSON.stringify(response));
                target && error_callback && error_callback.call(target);
            } else {
                LOG("FBGetMyUID: " + JSON.stringify(response));
                PiuPiuGlobals.FBmyUID = response.id;
                target && success_callback && success_callback.call(target);
            }
        });
    };

    FBgetPicture = function (uid, cb ) {
        if (!PiuPiuGlobals.FBisConnected) {
            LOG("FBgetPicture: FB is not connected");
            return;
        }

        FB.api("/" + uid + "/picture", "get",
            {"type" : "normal", "height" : PiuPiuConsts.FBpictureSize.toString(),
            "width" : PiuPiuConsts.FBpictureSize.toString(), "redirect": false.toString()}, function (response) {
                if (response && !response.error) {
                    LOG("FBgetPicture: " + JSON.stringify(response));
                    PiuPiuGlobals.UIDtoDataResults.missingPictures--;
                    PiuPiuGlobals.UIDtoData[uid].picture = response.data.url;
                    cb.call(this);
                } else {
                    LOG("FBgetPicture: Graph API request failed: " + JSON.stringify(response));
                }
            });
    };

    FBgetInfoForUID = function (uid, cb) {
        FB.api("/" + uid + "/", "get", function (response) {
            if (response) {
                LOG("FBgetInfoForUID succeed: " + JSON.stringify(response));
                PiuPiuGlobals.UIDtoDataResults.missingNames--;
                PiuPiuGlobals.UIDtoData[uid].name = response.name;
                cb.call(this);
            } else {
                LOG("FBgetInfoForUID failed: Graph API request failed, error: " + JSON.stringify(response));
            }
        });
    };

    FBgetDataForUsers = function (target, cb) {

        //  TODO: I'm not really happy with that solution, need to understand if there is a better solution
        var checkDataCompletion = function () {
            if (PiuPiuGlobals.UIDtoDataResults.missingNames == 0 &&
                PiuPiuGlobals.UIDtoDataResults.missingPictures == 0 ){
                //  All UIDs have names,
                target && cb && cb.call(target);
            }
        };

        PiuPiuGlobals.UIDtoDataResults.missingNames = 0;
        PiuPiuGlobals.UIDtoDataResults.missingPictures = 0;

        for (var uid in PiuPiuGlobals.UIDtoData) {
            if (!PiuPiuGlobals.UIDtoData[uid].name || PiuPiuGlobals.UIDtoData[uid].name == "") {
                PiuPiuGlobals.UIDtoDataResults.missingNames++;
                FBgetInfoForUID(uid, checkDataCompletion);
            }

            if (!PiuPiuGlobals.UIDtoData[uid].picture || PiuPiuGlobals.UIDtoData[uid].picture == "") {
                PiuPiuGlobals.UIDtoDataResults.missingPictures++;
                FBgetPicture(uid, checkDataCompletion);
            }
        }

        checkDataCompletion();
    };



    //  Obsolete functions, maybe we'll use them someday
    FBgetScore = function (target, success_callback, error_callback) {
        if (!PiuPiuGlobals.FBisConnected) {
            LOG("FBgetScore: FB is not connected");
            target && error_callback && error_callback.call(target);
            return;
        }

        PiuPiuGlobals.FBdata = null;
        FB.api("/me/scores", 'get', function (response) {
            if (!response || response.error) {
                LOG("FBgetScore: response error " + JSON.stringify(response));
                target && error_callback && error_callback.call(target);
            } else {
                LOG("FBgetScore: " + JSON.stringify(response));
                PiuPiuGlobals.FBdata = response.data[0];

                //  Check if score exists
                if (!PiuPiuGlobals.FBdata || !PiuPiuGlobals.FBdata.score) {
                    LOG("FBgetScore: something is wrong with FBdata: " + PiuPiuGlobals.FBdata);
                }

                target && success_callback && success_callback.call(target);
            }
        });
    };

    FBgetAllScores = function ( target, success_callback, error_callback ) {
        PiuPiuGlobals.leaderboard = null;

        if (!PiuPiuGlobals.FBisConnected) {
            LOG("FBgetAllScores: FB is not connected");
            target && error_callback && error_callback.call(target);
            return;
        }

        FB.api("/" + PiuPiuConsts.FB_appid + "/scores", "get", function (response) {
            if (!response || response.error) {
                LOG("FBgetAllScores: response error " + JSON.stringify(response));
                target && error_callback && error_callback.call(target);
            } else {
                PiuPiuGlobals.leaderboard = response.data;
                LOG("FBgetAllScores: " + JSON.stringify(PiuPiuGlobals.leaderboard));
                GC.app.emit("scores:loaded");
                target && success_callback && success_callback.call(target);
            }
        });
    };

    FBpostHighScore = function (score) {
        if (!PiuPiuGlobals.FBisConnected) {
            LOG("FBpostHighScore: FB is not connected");
            return;
        }

        FB.api("/me/scores", "post", {"score" : score.toString()}, function (response) {
            if (response) {
                LOG("FBpostHighScore succeed: " + JSON.stringify(response));
                //  Invoke FBgetScore to verify written data and update local variable
                FBgetScore();
            } else {
                LOG("FBpostHighScore failed: Graph API request failed, error: " + JSON.stringify(response));
            }
        });
    };
}

FB.onReady.run(function () {
    FB.init({
        appId: CONFIG.modules.facebook.facebookAppID,
        displayName: CONFIG.modules.facebook.facebookDisplayName,
    });
    ParseInit();
    FBinit();
});