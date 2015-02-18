import ui.StackView as StackView;
import src.data.resources;
import src.utilities.Utilities;
import src.data.globals;
import src.utilities.GameUtilities;
import src.utilities.AudioUtilities;
import src.utilities.AnimationUtilities;
import src.utilities.FBUtilities;
import src.utilities.ChartboostUtilities;
import device;
import animate;

import src.views.Splash as Splash;
import src.views.MainMenu as MainMenu;
import src.views.Game as Game;
import src.views.Statistics as Statistics;
import src.views.Leaderboard as Leaderboard;
import src.views.Instructions as Instructions;

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
        this.instructions = new Instructions();

        this.rootView.push(this.splash);

        //  Splash screen handling
        this.splash.on('InputSelect', bind(this, this.showMenu));
        this.on('splashAnim:end', bind(this, this.showMenu));

        //  Main Menu handling - Start
        this.mainMenu.on("instructions:start", bind(this, function() {
            this.instructions.reset();
            dissolvePushScenes(this.rootView, this.instructions, ANIMATING_SCENES_TIME, bind(this, function() {
                this.instructions.startAnimation();
                this.mainMenu.resetView();
            }));
        }));

        this.on('instructions:end', bind(this, function () {
            loadLevelSettings();
            dissolvePushScenes(this.rootView, this.game, ANIMATING_SCENES_TIME, bind(this, function() {
                this.game.startLevel();
                this.rootView.remove(this.instructions);
                this.instructions.reset();
            }));
        }));

        this.on('game:start', bind(this, function () {
            loadLevelSettings();
            dissolvePushScenes(this.rootView, this.game, ANIMATING_SCENES_TIME, bind(this, function() {
                this.game.startLevel();
            }));
        }));

        //  Game handling
        this.on('game:end', bind (this, function() {
            PiuPiuGlobals.currentLevel = 1;
            saveStats();
            updateHighScore();
            CBonGameEnd();
            dissolvePopScenes(this.rootView, ANIMATING_SCENES_TIME, bind(this.mainMenu, this.mainMenu.animate));
            this.instructions.reset();
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
            dissolvePopScenes(this.rootView, ANIMATING_SCENES_TIME, bind(this.mainMenu, this.mainMenu.animate));
        });

        //  Main Menu handling - Leaderboard
        this.mainMenu.on('leaderboard:start', bind (this, function () {
            dissolvePushScenes(this.rootView, this.leaderboard, ANIMATING_SCENES_TIME, bind(this, function () {
                this.mainMenu.resetView();
            }));
        }));
        this.on('leaderboard:end', function () {
            dissolvePopScenes(this.rootView, ANIMATING_SCENES_TIME, bind(this.mainMenu, this.mainMenu.animate));
        });

        //  Schedule to grab online data from FB & Parse for leaderboard when connected
        this.on('onlineData:ready', bind(this, this.leaderboard.refreshLeaderboard.bind(this.leaderboard)));
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

        //  Set back button in Android to put the game in BG
        device.setBackButtonHandler(function() {
            console.log("someone hit the back button!");
            return false;
        });

        //  Init globals
        initGlobals();

        //  Load stats
        loadAll();

        //setMusicVolume(PiuPiuConsts.musicVolume);

        PiuPiuGlobals.commonGrassMap = randomMap();

        //  Load all levels
        loadAllLevels();

        //  Init Chartboost
        CBinit();
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

