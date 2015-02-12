/**
 * Created by shirkan on 12/31/14.
 */

import src.data.globals;
import device;
import math.geom.Point as Point;

exports
{
    makePoint = function (x, y) {
        return {"x":x, "y" : y}
    };

    calculateBulletTrigonometry = function ( point ) {
        var bulletEndPoint = {};
        var bulletStartPoint = {};
        var endAngle = 0;
        var bulletPathLengths = {};

        //  Calculating ax+b = 0
        var a = calculateGradientOfLine(point, PiuPiuGlobals.handsAnchor);
        var b = point.y - (a * point.x);

        //  Calculate rotation angle
        //  "a" is the tangent, so the angle should be tan(a
        endAngle = (Math.atan(a)).toFixed(2);

        //  Calculate bullet start point
        bulletStartPoint.x = PiuPiuGlobals.handsAnchor.x + (PiuPiuConsts.handsLength * Math.cos(endAngle));
        bulletStartPoint.y = a * bulletStartPoint.x + b;

        //  Calculating end point
        if (a==0) {
            //  very rare, end point is right ahead after right border
            bulletEndPoint = makePoint(PiuPiuGlobals.winSize.width, point.y);
        } else {
            //  Calculate intersection of ax+b with x=winSize.width
            var xBorderEndX = PiuPiuGlobals.winSize.width;
            var xBorderEndY = a * xBorderEndX + b;

            //  Calculate intersection of ax+b with y=0 or y=winSize.height
            if (a>0) {
                yBorderEndY = PiuPiuGlobals.winSize.height;
            } else {
                yBorderEndY = 0;
            }

            var yBorderEndX = (yBorderEndY - b) / a;

            //  Determine which is closer, using Pitagoras
            var xBorderLength = Math.sqrt(Math.pow(xBorderEndX - bulletStartPoint.x, 2) + Math.pow(xBorderEndY - bulletStartPoint.y, 2));
            var yBorderLength = Math.sqrt(Math.pow(yBorderEndX - bulletStartPoint.x, 2) + Math.pow(yBorderEndY - bulletStartPoint.y, 2));

            if (xBorderLength < yBorderLength) {
                bulletEndPoint = makePoint(xBorderEndX, xBorderEndY);
            } else {
                bulletEndPoint = makePoint(yBorderEndX, yBorderEndY);
            }
        }

        //  Calculate length of X-axis & Y-axis, to determine speed on each axis
        var p = new Point(bulletEndPoint.x - bulletStartPoint.x, bulletEndPoint.y - bulletStartPoint.y);
        //  Need to normalize point so shooting will have same speed
        p.setMagnitude(PiuPiuGlobals.winSize.width);

        bulletPathLengths = makePoint(p.x, p.y);
        p = null;

        return [bulletStartPoint, bulletPathLengths, endAngle];

    };

    calculateDistanceBetween2Points = function ( p1, p2) {
        return Math.sqrt( Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2));
    };

    calculateGradientOfLine = function (p1, p2) {
        var dx = p1.x - p2.x;
        var dy = p1.y - p2.y;
        return (dy / dx);
    };

    sinusSentence = function ( alpha, lineLength ) {
        return lineLength/Math.sin(alpha);
    };

    //  return (a = value of x, b = free value): y = ax + b
    calculateLineFrom2points = function (p1, p2) {
        var a = (p2.y - p1.y) / (p2.x - p1.x);
        var b = (p2.x * p1.y - p1.x * p2.y) / (p2.x - p1.x);
        return (a,b);
    };

    //  p11, p12 are points on line 1, p21, p22 are points on line 2
    calculateAngleBetween2Lines = function (p11, p12, p21, p22) {
        var m1 = calculateGradientOfLine(p11, p12);
        var m2 = calculateGradientOfLine(p21, p22);
        tan = Math.abs((m2 - m1) / (1+ m1 * m2));
        return Math.atan(tan);
    };

    calculateHalfCirclePathFrom2Points = function ( ps, pe, steps, direction, clockwise) {
        if (steps < 3) {
            return;
        }

        direction = (direction ? 1 : -1);
        clockwise = (clockwise ? 1 : -1);

        var points = [];
        var r = calculateDistanceBetween2Points(ps, pe) / 2;
        var beta = Math.atan(calculateGradientOfLine(ps, pe)) * 180 / Math.PI;
        var betaDiagonal = (90 - beta) / 180 * Math.PI ;
        beta = beta / 180 * Math.PI;
        var pm = cc.p((ps.x + pe.x) / 2, (ps.y + pe.y) / 2);

        for (var i=1; i <= (steps) ; i++) {
            var alpha = i/(steps) * Math.PI;

            var rCosAlpha = Math.cos(alpha) * r;
            var rSinAlpha = Math.sin(alpha) * r;

            var xOnLine = clockwise * pm.x - rCosAlpha * Math.cos(beta) * direction;
            var yOnLine = clockwise * pm.y - rCosAlpha * Math.sin(beta) * direction;

            var x = clockwise * xOnLine - rSinAlpha * Math.cos(betaDiagonal) * direction;
            var y = clockwise * yOnLine + rSinAlpha * Math.sin(betaDiagonal) * direction;

            var point = cc.p(x, y);
            points.push(point);
        }

        return points;
    };

    //  TODO: FIX THIS FUNC
    calculateHalfCirclePathFrom3Points = function ( ps, pm, pe, steps, direction, clockwise) {
        if (steps < 3) {
            return;
        }

        direction = (direction ? 1 : -1);
        clockwise = (clockwise ? 1 : -1);

        //  Second attempt
        var points = [];

        //  Find blocking circle radius and rotating angle between two points
        var headAngle = calculateAngleBetween2Lines(ps, pm, pm, pe);
        var r = sinusSentence(headAngle, calculateDistanceBetween2Points(ps, pe))/ 2;
        var rotatingAngle = 360 - 2 * headAngle;

        //  Find blocking circle center point

        for (var i = 0; i<steps; i++) {

        }

        //  First attempt
        var pBetweenSandE = cc.p((ps.x + pe.x) / 2, (ps.y + pe.y) / 2);
        var r1 = calculateDistanceBetween2Points(ps, pe) / 2;
        var r2 = calculateDistanceBetween2Points(pm, pBetweenSandE);
        var minR = Math.min(r1, r2);
        var maxR = Math.max(r1, r2);
        var rangeOfR = maxR - minR;
        var minToMax = (r1 < r2);

        var beta = Math.atan(calculateGradientOfLine(ps, pe)) * 180 / Math.PI;
        var betaDiagonal = (90 - beta) / 180 * Math.PI ;
        beta = beta / 180 * Math.PI;

        var effectivePoints = steps - 1;

        for (var i=0; i <= effectivePoints; i++) {
            var alpha = i / effectivePoints * Math.PI;
            //  Calculate relevant R
            if (minToMax) {
                var r = maxR - (Math.abs(alpha - Math.PI/2) / (Math.PI/2)) * rangeOfR;
            } else {
                //var r = minR + (Math.abs(alpha - Math.PI/2) / (Math.PI/2)) * rangeOfR;
                var r = Math.abs(Math.cos(alpha)) * maxR;
            }

            var rCosAlpha = Math.cos(alpha) * r;
            var rSinAlpha = Math.sin(alpha) * r;

            var xOnLine = clockwise * pBetweenSandE.x - rCosAlpha * Math.cos(beta) * direction;
            var yOnLine = clockwise * pBetweenSandE.y - rCosAlpha * Math.sin(beta) * direction;

            var x = clockwise * xOnLine - rSinAlpha * Math.cos(betaDiagonal) * direction;
            var y = clockwise * yOnLine + rSinAlpha * Math.sin(betaDiagonal) * direction;

            var point = cc.p(x, y);
            LOG(i + " x: "+ x + " y:" + y + " a: " + alpha + " r: " + r + "\nsin: " + Math.sin(alpha)  + " rsina: " + rSinAlpha+ "\ncos: " + Math.cos(alpha)  + " rcosa: " + rCosAlpha);
            points.push(point);
        }

        //points.push(pe);
        return points;
    };

    //  ps - p for start, pe - p for end, pc - p for center
    //  TODO: FIX THIS FUNC
    calculateCircularPathFrom3PointsAndR = function (ps, pe, pc, steps) {
        var direction = clockwise = 1;
        var points = [];

        var rotatingAngle = calculateAngleBetween2Lines(ps, pc, pc, pe);
        var r = calculateDistanceBetween2Points(ps, pc);
        var effectivePoints = steps - 1;

        var beta = Math.atan(calculateGradientOfLine(ps, pc)) * 180 / Math.PI;
        var betaDiagonal = (90 - beta) / 180 * Math.PI ;
        beta = beta / 180 * Math.PI;

        for (var i = 0; i <= effectivePoints; i++ ) {
            var alpha = i/effectivePoints * rotatingAngle;

            var rCosAlpha = Math.cos(alpha) * r;
            var rSinAlpha = Math.sin(alpha) * r;

            var xOnLine = clockwise * pc.x - rCosAlpha * Math.cos(beta) * direction;
            var yOnLine = clockwise * pc.y - rCosAlpha * Math.sin(beta) * direction;

            var x = clockwise * xOnLine - rSinAlpha * Math.cos(betaDiagonal) * direction;
            var y = clockwise * yOnLine + rSinAlpha * Math.sin(betaDiagonal) * direction;

            var point = cc.p(x, y);
            LOG(i + " x: "+ x + " y:" + y + " a: " + alpha + " r: " + r + "\nsin: " + Math.sin(alpha)  + " rsina: " + rSinAlpha+ "\ncos: " + Math.cos(alpha)  + " rcosa: " + rCosAlpha);
            points.push(point);
        }

        return points;
    };

    initGlobals = function () {
        PiuPiuGlobals.currentLevel = 1;
        PiuPiuGlobals.soundEnabled = parseInt(localStorage.soundEnabled);
        if (PiuPiuGlobals.soundEnabled === undefined || isNaN(PiuPiuGlobals.soundEnabled)) {
            localStorage.soundEnabled = PiuPiuGlobals.soundEnabled = 1;
        }

        //  Calculate hands anchor and source point
        PiuPiuGlobals.handsAnchor = makePoint(0.35 * PiuPiuConsts.playerWidth, PiuPiuGlobals.winSize.height / 2 - 0.14 * PiuPiuConsts.playerHeight);
        PiuPiuGlobals.sourcePoint = makePoint(0, (PiuPiuGlobals.winSize.height - PiuPiuConsts.enemyHeight) / 2);
    };

    loadAll = function () {
        PiuPiuGlobals.loadSave.forEach(function (entry) {
            var data = localStorage.getItem(entry);
            if (data !== null) {
                var num = parseInt(data);
                if (!isNaN(num)) {
                    PiuPiuGlobals[entry] = num;
                } else if (typeof data == "string"){
                    if (data == "true") {
                        PiuPiuGlobals[entry] = true;
                    } else if (data == "false") {
                        PiuPiuGlobals[entry] = false;
                    } else {
                        PiuPiuGlobals[entry] = data;
                    }
                }
            }
        });
    };

    saveStats = function () {
        for (var i in PiuPiuGlobals.statsNames) {
            var val = eval("PiuPiuGlobals." + PiuPiuGlobals.statsNames[i]);
            localStorage.setItem(PiuPiuGlobals.statsNames[i], val);
        }
    };

    loadData = function (key) {
        PiuPiuGlobals[key] = localStorage.getItem(key);
        return PiuPiuGlobals[key];
    };

    saveData = function (key, value) {
        localStorage.setItem(key, value);
    };

    handleAllHighScores = function () {
        PiuPiuGlobals.unlockedWorlds.forEach( function (world) {
            ParseLoadMyScore(world);
        });
    };

    handleHighScore = function ( world ) {
        //var currentHighScore = Math.max(PiuPiuGlobals.highScore, PiuPiuGlobals.currentScore);
        var currentHighScore = PiuPiuGlobals.highScore[world];
        var storedHighScore = loadData("highScore") || 0;

        //  We retrieve FB high score on log-in so it should be updated by now.
        //var ParseHighscore = (PiuPiuGlobals.FBdata ? PiuPiuGlobals.FBdata.score : 0);
        var ParseHighscore = 0;

        LOG("handleHighScore: current highscore: " + currentHighScore + " stored: " + storedHighScore + " FB: " + ParseHighscore);

        PiuPiuGlobals.highScore = Math.max(currentHighScore, storedHighScore);

        if (PiuPiuGlobals.highScore > ParseHighscore) {
            ParseSaveScore();
        }

        saveData("highScore", PiuPiuGlobals.highScore);
    };

    updateHighScore = function () {
        var world = PiuPiuConsts.worlds[PiuPiuGlobals.currentWorld];
        LOG("current " + PiuPiuGlobals.currentScore + " saved: " + PiuPiuGlobals["highScores." + world]);
        if (PiuPiuGlobals.currentScore > PiuPiuGlobals["highScores." + world]) {
            PiuPiuGlobals["highScores." + world] = PiuPiuGlobals.currentScore;
            saveData("highScores." + world, PiuPiuGlobals.currentScore);

            //  Since by now highscores DBs are synced, we know we need to update Parse DB as well.
            ParseSaveScore(world);

            //  TODO: Refresh leaderboards
        }
    };

    randomMap = function () {
        var mapNum = randomNumber(1, 10, true);
        return res["BG_grass" + mapNum + "_png"];
    };

    //  Levels load
    loadAllLevels = function () {
        var i = 1;
        var fileName = "resources/levels/level" + i + ".json";
        while (CACHE[fileName]) {
            LOG("loading file " + fileName);
            PiuPiuLevels[i] = {};
            PiuPiuLevels[i] = JSON.parse(CACHE[fileName]);

            //  Check defaults

            //  Type of level
            PiuPiuLevels[i].levelType = PiuPiuLevels[i].levelType || levelType.EliminateAllEnemies;
            //  Enemies to spawn
            PiuPiuLevels[i].totalEnemiesToKill = PiuPiuLevels[i].totalEnemiesToSpawn = PiuPiuLevels[i].totalEnemies;
            PiuPiuLevels[i].enemiesVanished = 0;
            PiuPiuLevels[i].enemiesSpawnInterval = PiuPiuLevels[i].enemiesSpawnInterval || 2;
            PiuPiuLevels[i].enemiesSpawnIntervalMin = PiuPiuLevels[i].enemiesSpawnIntervalMin || 0;
            PiuPiuLevels[i].enemiesSpawnIntervalMax = PiuPiuLevels[i].enemiesSpawnIntervalMax || 0;
            PiuPiuLevels[i].enemiesSpawnIntervalType = PiuPiuLevels[i].enemiesSpawnIntervalType || "constantTempo";

            //  Power ups policy
            PiuPiuLevels[i].powerupsSpawnInterval = PiuPiuLevels[i].powerupsSpawnInterval || 2;
            PiuPiuLevels[i].powerupsSpawnIntervalMin = PiuPiuLevels[i].powerupsSpawnIntervalMin || 0;
            PiuPiuLevels[i].powerupsSpawnIntervalMax = PiuPiuLevels[i].powerupsSpawnIntervalMax || 0;
            PiuPiuLevels[i].powerupsSpawnIntervalType = PiuPiuLevels[i].powerupsSpawnIntervalType || "none";
            PiuPiuLevels[i].powerupsTypes = PiuPiuLevels[i].powerupsTypes || "";

            //  Animation
            PiuPiuLevels[i].animation = PiuPiuLevels[i].animation || "";

            //  Special notations
            PiuPiuLevels[i].specialNotations = PiuPiuLevels[i].specialNotations || [];
            PiuPiuLevels[i].hint = PiuPiuLevels[i].hint || "";

            fileName = "resources/levels/level" + (++i) + ".json";
        }
    };
    loadLevelSettings = function () {
        LOG("loadLevelSettings: loading level " + PiuPiuGlobals.currentLevel);
        PiuPiuLevelSettings = JSON.parse(JSON.stringify(PiuPiuLevels[PiuPiuGlobals.currentLevel]));
    };

    getLevelTypeString = function () {
        switch (PiuPiuLevelSettings.levelType) {
            case levelType.EliminateAllEnemies: {
                return "Eliminate all enemies"
            }
            case levelType.Survival: {
                return "Survive X time"
            }
            case levelType.ShootPowerups: {
                return "Shoot powerups"
            }
            case levelType.TargetScore: {
                return "Achieve X points"
            }
        }
    };

    specialNotationDoesContain = function ( item ) {
        var i = PiuPiuLevelSettings.specialNotations.length;
        while (i--) {
            if (PiuPiuLevelSettings.specialNotations[i] === item) {
                return true;
            }
        }
        return false;
    };
}
