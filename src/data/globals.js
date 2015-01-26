/**
 * Created by shirkan on 1/17/15.
 */

import src.data.resources;

exports
{
    console.log("loading globals");

    if(typeof TagOfLayer == "undefined") {
        TagOfLayer = {};
        TagOfLayer.Background = 0;
        TagOfLayer.Game = 1;
        TagOfLayer.Status = 2;
        TagOfLayer.Achievements = 3;
    };

    if(typeof hitType == "undefined") {
        hitType = {};
        hitType.NoHit = 0;
        hitType.BulletEnemy = 1;
        hitType.BulletEnemyHead = 2;
        hitType.EnemyPlayer = 3;
        hitType.BulletPowerUp = 4;
    };

    if(typeof SpriteTag == "undefined") {
        SpriteTag = {};
        SpriteTag.Player = 0;
        SpriteTag.Bullet = 1;
        SpriteTag.Enemy = 2;
        SpriteTag.EnemyHead = 3;

        SpriteTag.MinPowerup = 4;
    };

    if(typeof GameStates == "undefined") {
        GameStates = {};
        GameStates.Menu = 0;
        GameStates.Intro = 1;
        GameStates.Playing = 2;
        GameStates.GameOver = 3;
        GameStates.CutScene = 4;
        GameStates.LevelCompleted = 5;
        GameStates.Leaderboard = 6;
        GameStates.SplashScreen = 7;
    }

    if(typeof levelType == "undefined") {
        levelType = {};
        levelType.EliminateAllEnemies = 0x0;
        levelType.Survival = 0x1;
        levelType.ShootPowerups = 0x2;
        levelType.TargetScore = 0x4;
        levelType.IntroducingNewThing = 0x8;
    }

    if (typeof PiuPiuConsts == "undefined") {
        PiuPiuConsts = {};

        //  Splash screen
        PiuPiuConsts.splashScreenTimeOut = 7000;

        //  Styles
        //PiuPiuConsts.fontName = res.arcadepi_font;
        PiuPiuConsts.fontName = "Arcadepix";
        PiuPiuConsts.fontSizeBig = 72;
        PiuPiuConsts.fontSizeNormal = 48;
        PiuPiuConsts.fontSizeSmall = 28;
        PiuPiuConsts.fontSizeStatus = 32;

        PiuPiuConsts.fontStrokeSize = 8;
        PiuPiuConsts.fontStrokeSizeSmall = 4;
        PiuPiuConsts.fontStrokeSizeStatus = 6;

        //  Music
        PiuPiuConsts.musicFiles = [res.music_arsenal1, res.music_athletico1, res.music_barca1, res.music_barca2, res.music_barca3,
            res.music_bayern1, res.music_boca1, res.music_boca2, res.music_chelsea1, res.music_chelsea2, res.music_dortmund1,
            res.music_hapoel1, res.music_juve1, res.music_juve2, res.music_liverpool1, res.music_liverpool2, res.music_maccabi1,
            res.music_maccabi2, res.music_mancity1, res.music_manutd1, res.music_manutd2, res.music_manutd3, res.music_milan1,
            res.music_olympiakos1, res.music_pana1, res.music_paok1, res.music_psg1, res.music_realmadrid1, res.music_realmadrid2,
            res.music_realmadrid3];
        PiuPiuConsts.musicVolume = 0.5;

        //  Gameplay consts
        PiuPiuConsts.pointsPerEnemyKill = 7;
        PiuPiuConsts.pointsPerEnemyHeadShot = 10;
        PiuPiuConsts.pointsNormalMultiplier = 1;
        PiuPiuConsts.normalUpdateRate = 1;
        PiuPiuConsts.gameZIndex = 1;
        PiuPiuConsts.canContinueToNextSceneTimeOut = 2000;

        //  Status view
        PiuPiuConsts.statusZIndex = 10;

        //  Bullet
        PiuPiuConsts.framesPerSeconds = 1000;
        PiuPiuConsts.bulletZIndex = 5;

        //  Enemy
        PiuPiuConsts.enemyMoveToPoint = (30,240);
        PiuPiuConsts.enemyHeadRadius = 10;
        PiuPiuConsts.enemyHeadOffset = (-6,22);
        PiuPiuConsts.enemyZIndex = 3;
        PiuPiuConsts.enemyWidth = 95;
        PiuPiuConsts.enemyHeight= 125;

        //  Player
        PiuPiuConsts.handsLength = 83;
        PiuPiuConsts.livesOnGameStart = 2;
        PiuPiuConsts.maxLives = 5;
        PiuPiuConsts.playerWidth = 71;
        PiuPiuConsts.playerHeight= 235;

        //  Powerups
        PiuPiuConsts.powerupRadius = 7;
        PiuPiuConsts.powerupCenterPoint = (0,0);
        PiuPiuConsts.powerupPeriod = 3000;
        PiuPiuConsts.powerupLocalZIndex = 1;
        PiuPiuConsts.powerupTypes = ["machineGun", "oneUp", "captain", "stopwatch"];
        PiuPiuConsts.powerupMachineGunPeriod = 10000;
        PiuPiuConsts.powerupCaptainPeriod = 20000;
        PiuPiuConsts.powerupCaptainMultiplier = 2;
        PiuPiuConsts.powerupStopwatchPeriod = 10000;
        PiuPiuConsts.powerupStopwatchUpdateRate = 0.5;
        PiuPiuConsts.powerupZIndex = 2;

        //  Facebook
        PiuPiuConsts.FB_appid = "331202163734875";
        PiuPiuConsts.FBpermissionsNeeded = ["public_profile", "user_activities", "user_about_me", "user_friends", "publish_actions"];
        PiuPiuConsts.FBwaitForResultsInSeconds = 11;
        PiuPiuConsts.FBleaderboardShowTop = 7;
        PiuPiuConsts.FBpictureSize = 80;
        PiuPiuConsts.FBpictureScale = 0.5;
    }

    if (typeof PiuPiuGlobals == "undefined") {
        PiuPiuGlobals = {};

        //  Application vars
        PiuPiuGlobals.winSize = {};
        PiuPiuGlobals.scenes = [];
        //  Calculate hands anchor later, when screen size is defined
        PiuPiuGlobals.handsAnchor = [];
        PiuPiuConsts.sourcePoint = [];

        //  Music
        PiuPiuGlobals.currentMusicFile = "";

        //  Game vars
        PiuPiuGlobals.livesLeft = 0;
        PiuPiuGlobals.currentScore = 0;
        PiuPiuGlobals.currentPointsMultiplier = 1;
        PiuPiuGlobals.currentUpdateRate = PiuPiuConsts.normalUpdateRate;
        PiuPiuGlobals.highScore = 0;
        PiuPiuGlobals.gameState = GameStates.Menu;
        PiuPiuGlobals.currentLevel = 0;
        PiuPiuGlobals.commonGrassMap = "";
        PiuPiuGlobals.soundEnabled = 1;

        //  Stats vars
        PiuPiuGlobals.statsNames = ["totalBulletsFired", "totalPowerUps", "totalEnemyKilled", "totalHeadShots", "totalPoints"];
        for (i in PiuPiuGlobals.statsNames) {
            eval("PiuPiuGlobals." + PiuPiuGlobals.statsNames[i] + " = 0");
        }

        //  Facebook
        PiuPiuGlobals.FBpermissionsMissing = PiuPiuConsts.FBpermissionsNeeded;
        PiuPiuGlobals.FBpermissionsGranted = [];
        PiuPiuGlobals.FBallScoresData = null;
        PiuPiuGlobals.FBplayerScoreData = null;
    }

    if (typeof PiuPiuLevelSettings == "undefined") {
        PiuPiuLevelSettings = {};

        //  Level vars
        PiuPiuLevelSettings.levelType = 0;
        PiuPiuLevelSettings.totalEnemiesToSpawn = 0;
        PiuPiuLevelSettings.enemiesVanished = 0;
        PiuPiuLevelSettings.specialNotations = [];
        PiuPiuLevelSettings.enemiesSpawnInterval = 0;
        PiuPiuLevelSettings.enemiesSpawnIntervalMin = 0;
        PiuPiuLevelSettings.enemiesSpawnIntervalMax = 0;
        PiuPiuLevelSettings.enemiesSpawnIntervalType = "";
        PiuPiuLevelSettings.hint = "";
    }

    if (typeof PiuPiuLevels == "undefined") {
        PiuPiuLevels = {};
    }
}