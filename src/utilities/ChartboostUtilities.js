/**
 * Created by shirkan on 11/24/14.
 */

if (isRunningOnMobile()) {
    import chartboost;
}

exports
{
    CBinit = function () {

        if (!isRunningOnMobile()) {
            return;
        }

        chartboost.init();

        //  Init interstitials
        CBprepareInterstitial();
        chartboost.on('AdClicked', function () { LOG('user clicked an ad!'); });
        chartboost.on('AdDismissed', function () { LOG('Ad dismissed'); CBprepareInterstitial(); });

        //  Init watch video
        CBprepareVideo();
    };

    //  Interstitial handling
    CBprepareInterstitial = function () {
        LOG("CBprepareInterstitial");
        chartboost.cacheInterstitial();
    };

    CBshowInterstitial = function () {
        LOG("CBshowInterstitial");
        chartboost.showInterstitialIfAvailable();
    };

    CBs = function () {
        LOG("CBshowInterstitial");
        chartboost.showInterstitial();
    };

    //  Video handling
    CBprepareVideo = function () {
        LOG("CBprepareVideo");
        chartboost.cacheRewardedVideo();
    };

    CBshowVideo = function () {
        LOG("CBshowVideo");
        chartboost.showRewardedVideo();
    };

    CBonGameEnd = function() {
        if (!isRunningOnMobile()) {
            return;
        }

        //  20% - just end the game
        //  20% - suggest watching a video for extra life
        //  60% - show Interstitial

        var decision = randomNumber(0,1);

        if (decision <= 0.2) {
            LOG("CBonGameEnd " + decision);
            return;
        } else if (decision <= 0.4) {
            LOG("CBonGameEnd " + decision);
            //  Suggest watching a video
            CBshowInterstitial();
        } else {
            LOG("CBonGameEnd " + decision);
            CBshowInterstitial();
        }
    }
}