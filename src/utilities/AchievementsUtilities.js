/**
 * Created by shirkan on 1/8/15.
 */

import src.data.globals;

exports
{
    if(typeof PiuPiuAchievements == "undefined") {
        PiuPiuAchievements = {};
        PiuPiuAchievements.firestarter = {  "status": 0,
            "cond"  : "PiuPiuGlobals.totalEnemyKilled > 0",
            "sprite": null,
            "text"  : '"Firestarter" achievement unlocked!'
        };
    };

    //  Check status
    isAchieved = function ( key ) {
        return (PiuPiuAchievements[key].status);
    }

    //  Check if condition exists now
    hasAchievementCompleted = function (key) {
        return (eval(PiuPiuAchievements[key].cond));
    }

    checkAllAchievements = function () {
        var result = [];
        for (var key in PiuPiuAchievements) {
            if (hasAchievementCompleted(key)) {
                result.push(key);
            }
        }

        return result;
    }
}
