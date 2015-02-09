import ui.StackView as StackView;
import src.data.resources;
import src.utilities.Utilities;
import src.data.globals;
import src.utilities.GameUtilities;
import src.utilities.AudioUtilities;
import src.utilities.AnimationUtilities;
import src.utilities.FBUtilities;
import device;
import animate;

import .parse as parse;

import src.views.Splash as Splash;
import src.views.MainMenu as MainMenu;
import src.views.Game as Game;
import src.views.Statistics as Statistics;
import src.views.Leaderboard as Leaderboard;

import src.anim.IntroAnim as IntroAnim;
import src.anim.LevelAnim as LevelAnim;

import ui.TextView;

/** @const */ var BOUNDS_WIDTH = 720;
/** @const */ var BOUNDS_HEIGHT = 1280;

exports = Class(GC.Application, function () {

    this.initUI = function () {
        this.initializeGame();

        this.rootView = new StackView({
            superview: this,
            x: 0,
            y: 0,
            width: PiuPiuGlobals.winSize.width,
            height: PiuPiuGlobals.winSize.height,
            clip: true
        });

        /** @const */ var ANIMATING_SCENES_TIME = 500;

        this.splash = new Splash();
        this.mainMenu = new MainMenu();
        this.introAnim = new IntroAnim();
        this.levelAnim = new LevelAnim();
        this.game = new Game();
        this.stats = new Statistics();
        this.leaderboard = new Leaderboard();

        this.rootView.push(this.splash);

        //  Splash screen handling
        this.splash.on('InputSelect', bind(this, function () {
            this.showMenu();
        }));

        this.switchToMenu = setTimeout(bind(this, function () {
            this.showMenu();
        }), PiuPiuConsts.splashScreenTimeOut);

        //  Main Menu handling - Start
        this.mainMenu.on("intro:start", bind(this, function() {
            dissolvePushScenes(this.rootView, this.introAnim, ANIMATING_SCENES_TIME, bind(this, function() {
                this.introAnim.restartAnimation();
                this.mainMenu.resetView();
            }));
        }));

        this.on('intro:end', bind(this, function () {
            loadLevelSettings();
            dissolvePushScenes(this.rootView, this.levelAnim, ANIMATING_SCENES_TIME, bind(this, function() {
                this.rootView.remove(this.introAnim);
                this.introAnim.resetAnimation();
                this.levelAnim.animateLevel();
            }));
        }));

        this.on('cutscene:end', bind(this, function () {
            dissolvePushScenes(this.rootView, this.game, ANIMATING_SCENES_TIME, bind(this, function() {
                this.game.startLevel();

                this.rootView.remove(this.levelAnim);
                this.levelAnim.reset();
            }));
        }));

        //  Game handling
        this.on('game:end', bind (this, function() {
            PiuPiuGlobals.currentLevel = 1;
            saveStats();
            handleHighScore();
            dissolvePopScenes(this.rootView, ANIMATING_SCENES_TIME, bind(this.mainMenu, this.mainMenu.animate))
        }));

        this.on('game:levelCompleted', bind (this, function() {
            loadLevelSettings();
            saveStats();
            dissolvePushScenes(this.rootView, this.levelAnim, ANIMATING_SCENES_TIME, bind(this, function() {
                this.rootView.remove(this.game);
                this.levelAnim.animateLevel();
            }));
        }));

        //  Main Menu handling - Statistics
        this.mainMenu.on('stats:start', bind (this, function () {
            dissolvePushScenes(this.rootView, this.stats, ANIMATING_SCENES_TIME, bind(this, function () {
                this.stats.build();
                this.mainMenu.resetView();
            }));
        }));
        this.on('stats:end', function () {
            dissolvePopScenes(this.rootView, ANIMATING_SCENES_TIME, bind(this.mainMenu, this.mainMenu.animate))
        });

        //  Main Menu handling - Statistics
        this.mainMenu.on('leaderboard:start', bind (this, function () {
            dissolvePushScenes(this.rootView, this.leaderboard, ANIMATING_SCENES_TIME, bind(this, function () {
                this.leaderboard.build();
                this.mainMenu.resetView();
            }));
        }));
        this.on('leaderboard:end', function () {
            dissolvePopScenes(this.rootView, ANIMATING_SCENES_TIME, bind(this.mainMenu, this.mainMenu.animate))
        });



        //  Schedule to grab FB profile photos for leaderboard when connected
        this.on('facebook:loggedin', bind(this, this.leaderboard.getFBImages.bind(this.leaderboard)));
    };

    this.launchUI = function () {};

    this.scaleUI = function () {
        if (device.height > device.width) {
            PiuPiuGlobals.winSize.width = BOUNDS_WIDTH;
            PiuPiuGlobals.winSize.height = device.height * (BOUNDS_WIDTH / device.width);
            PiuPiuGlobals.winSize.scale = device.width / PiuPiuGlobals.winSize.width;
        } else {
            PiuPiuGlobals.winSize.width = BOUNDS_HEIGHT;
            PiuPiuGlobals.winSize.height = device.height * (BOUNDS_HEIGHT / device.width);
            PiuPiuGlobals.winSize.scale = device.height / PiuPiuGlobals.winSize.height;
        }
        this.view.style.scale = PiuPiuGlobals.winSize.scale;
    };

    this.initializeGame = function () {
        this.scaleUI();

        //  Init globals
        initGlobals();

        //  Load stats
        loadAll();

        setMusicVolume(PiuPiuConsts.musicVolume);

        PiuPiuGlobals.commonGrassMap = randomMap();

        //  Load all levels
        loadAllLevels();

        //parse.Parse.initialize("YfOISFZAxRmajUe9l6Sh3BL5lpekZfqBzRLFmCBU", "MxFgCdHsmFKt0VG2rwdxd1A1e7qpwRwHNFLpQcfS");
        //var TestObject = parse.Parse.Object.extend("TestObject");
        //var testObject = new TestObject();
        //testObject.save({foo: "bar"}).then(function(object) {
        //    alert("yay! it worked");
        //});

    };

    this.showMenu = function() {
        /** @const */ var SPLASH_TO_MENU_TIME = 1500;
        clearTimeout(this.switchToMenu);
        this.mainMenu.checkFBstatus();
        dissolvePushScenes(this.rootView, this.mainMenu, SPLASH_TO_MENU_TIME, bind(this, function() {
            this.mainMenu.animate();
            this.splash.reset();
        }));
    }
});

