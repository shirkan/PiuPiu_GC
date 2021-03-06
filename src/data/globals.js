/**
 * Created by shirkan on 1/17/15.
 */

import src.data.resources;

exports
{
    if(typeof EnemyColor == "undefined") {
        EnemyColor = {};
        EnemyColor.Blue_Red = "blue_red";
        EnemyColor.Blue_White = "blue_white";
        EnemyColor.Grey_Black = "grey_black";
        EnemyColor.Red_White = "red_white";
        EnemyColor.All = ["Blue_Red", "Blue_White", "Grey_Black", "Red_White"];
    };
    
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
        levelType.text = ["Eliminate all enemies", "Survival", "Shoot # power ups", "Target score", ""];
        levelType.EliminateAllEnemies = 0;
        levelType.Survival = 1;
        levelType.ShootPowerups = 2;
        levelType.TargetScore = 3;
        levelType.IntroducingNewThing = 4;
    }

    if(typeof levelTypeText == "undefined") {
        levelTypeText = {};
        levelTypeText.EliminateAllEnemies = 0;
        levelTypeText.Survival = 1;
        levelTypeText.ShootPowerups = 2;
        levelTypeText.TargetScore = 3;
        levelTypeText.IntroducingNewThing = 4;
    }

    if (typeof PiuPiuConsts == "undefined") {
        PiuPiuConsts = {};

        //  Splash screen
        PiuPiuConsts.splashScreenTimeOut = 10000;

        //  Styles
        //PiuPiuConsts.fontName = res.arcadepi_font;
        PiuPiuConsts.fontName = "ArcadepixRegular";
        if (isRunningOniOS()) {
            PiuPiuConsts.fontName = "Arcadepix";
        }
        PiuPiuConsts.fontSizeBig = 72;
        PiuPiuConsts.fontSizeInstructions = 60;
        PiuPiuConsts.fontSizeNormal = 48;
        PiuPiuConsts.fontSizeSmall = 28;
        PiuPiuConsts.fontSizeStatus = 32;

        PiuPiuConsts.fontStrokeSize = 8;
        PiuPiuConsts.fontStrokeSizeSmall = 4;
        PiuPiuConsts.fontStrokeSizeStatus = 6;

        //  Music
        PiuPiuConsts.musicFiles = ["music_arsenal1", "music_athletico1", "music_barca1", "music_barca2", "music_barca3",
            "music_bayern1", "music_boca1", "music_boca2", "music_chelsea1", "music_chelsea2", "music_dortmund1",
            "music_hapoel1", "music_juve1", "music_juve2", "music_liverpool1", "music_liverpool2", "music_maccabi1",
            "music_maccabi2", "music_mancity1", "music_manutd1", "music_manutd2", "music_manutd3", "music_milan1",
            "music_olympiakos1", "music_pana1", "music_paok1", "music_psg1", "music_realmadrid1", "music_realmadrid2",
            "music_realmadrid3"];
        PiuPiuConsts.musicVolume = 0.5;

        //  Gameplay consts
        PiuPiuConsts.pointsPerEnemyKill = 7;
        PiuPiuConsts.pointsPerEnemyHeadShot = 10;
        PiuPiuConsts.pointsNormalMultiplier = 1;
        PiuPiuConsts.normalUpdateRate = 1;
        PiuPiuConsts.hitUpdateRate = 0.5;
        PiuPiuConsts.gameZIndex = 1;
        PiuPiuConsts.canContinueToNextSceneTimeOut = 2000;
        PiuPiuConsts.worlds = ["Madrid"];

        //  Status view
        PiuPiuConsts.statusZIndex = 10;

        //  Bullet
        PiuPiuConsts.framesPerSeconds = 1000;
        PiuPiuConsts.bulletZIndex = 5;

        //  Enemy
        PiuPiuConsts.enemyZIndex = 3;
        PiuPiuConsts.enemyWidth = 250;
        PiuPiuConsts.enemyHeight= 240;

        //  Player
        PiuPiuConsts.handsLength = 83;
        PiuPiuConsts.livesOnGameStart = 2;
        PiuPiuConsts.maxLives = 5;
        PiuPiuConsts.playerWidth = 240;
        PiuPiuConsts.playerHeight= 170;
        PiuPiuConsts.playerAnimationSpeed = 15;
        PiuPiuConsts.leftHandZIndex = 4;
        PiuPiuConsts.playerZIndex = 5;
        PiuPiuConsts.rightHandZIndex = 6;

        //  Powerups
        PiuPiuConsts.powerupRadius = 7;
        PiuPiuConsts.powerupPeriod = 3000;
        PiuPiuConsts.powerupTypes = ["oneUp", "captain", "machineGun", "stopwatch"];
        PiuPiuConsts.powerupMachineGunPeriod = 10000;
        PiuPiuConsts.powerupCaptainPeriod = 20000;
        PiuPiuConsts.powerupCaptainMultiplier = 2;
        PiuPiuConsts.powerupStopwatchPeriod = 10000;
        PiuPiuConsts.powerupStopwatchUpdateRate = 0.5;
        PiuPiuConsts.powerupZIndex = 2;

        //  Pause button
        PiuPiuConsts.pauseButtonSize = 32;
        PiuPiuConsts.pauseScreenZIndex = PiuPiuConsts.statusZIndex + 1;

        //  Facebook
        PiuPiuConsts.FB_appid = "331202163734875";
        //PiuPiuConsts.FBpermissionsNeeded = ["public_profile", "user_activities", "user_about_me", "user_friends", "publish_actions"];
        PiuPiuConsts.FBpermissionsNeeded = ["public_profile", "user_friends"];
        PiuPiuConsts.FBwaitForResultsInSeconds = 11;
        PiuPiuConsts.FBleaderboardShowTop = 7;
        PiuPiuConsts.FBpictureSize = 64;
        PiuPiuConsts.FBwaitBeforeCheckingStatus = 5000;
    }

    if (typeof PiuPiuGlobals == "undefined") {
        PiuPiuGlobals = {};

        //  Application vars
        PiuPiuGlobals.winSize = {};
        PiuPiuGlobals.scenes = [];
        //  Calculate hands anchor later, when screen size is defined
        PiuPiuGlobals.handsAnchor = [];
        PiuPiuConsts.sourcePoint = [];

        //  Load/Save stats
        PiuPiuGlobals.loadSave = ["showInstructions"];

        //  Music
        PiuPiuGlobals.currentMusicFile = "";
        PiuPiuGlobals.musicScheduler = "";

        //  Game vars
        PiuPiuGlobals.livesLeft = 0;
        PiuPiuGlobals.currentScore = 0;
        PiuPiuGlobals.currentPointsMultiplier = 1;
        PiuPiuGlobals.currentUpdateRate = PiuPiuConsts.normalUpdateRate;
        PiuPiuConsts.worlds.forEach( function(world) {
            PiuPiuGlobals["highScores." + world] = 0;
            PiuPiuGlobals.loadSave.push("highScores." + world);
        });
        PiuPiuGlobals.gameState = GameStates.Menu;
        PiuPiuGlobals.currentLevel = 0;
        PiuPiuGlobals.commonGrassMap = "";
        PiuPiuGlobals.soundEnabled = 1;
        PiuPiuGlobals.currentWorld = 0;
        PiuPiuGlobals.unlockedWorlds = [PiuPiuConsts.worlds[0]];
        PiuPiuGlobals.showAds = 1;
        PiuPiuGlobals.showInstructions = true;

        //  Stats vars
        PiuPiuGlobals.statsNames = ["totalBulletsFired", "totalPowerUps", "totalEnemyKilled", "totalHeadShots", "totalPoints", "gameProgress"];
        PiuPiuGlobals.statsNames.forEach( function(entry) {
            PiuPiuGlobals[entry] = 0;
            PiuPiuGlobals.loadSave.push(entry);
        });

        //  Facebook
        PiuPiuGlobals.FBdidEverAccessed = false;
        PiuPiuGlobals.FBisConnected = false;
        PiuPiuGlobals.FBpermissionsMissing = PiuPiuConsts.FBpermissionsNeeded;
        PiuPiuGlobals.FBpermissionsGranted = [];
        PiuPiuGlobals.FBdata = null;
        PiuPiuGlobals.FBmyUID = "";

        //  Parse
        PiuPiuConsts.worlds.forEach( function(world) {
            PiuPiuGlobals["ParseMyObjectIDs." + world] = "";
            PiuPiuGlobals.loadSave.push("ParseMyObjectIDs." + world);
        });
        PiuPiuGlobals.leaderboard = {};
        PiuPiuGlobals.UIDtoData = {};
        PiuPiuGlobals.UIDtoDataResults = {};
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