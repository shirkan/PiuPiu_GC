import ui.StackView as StackView;
import src.data.resources;
import src.data.globals;
import src.utilities.Utilities;
import src.utilities.GameUtilities;
import src.utilities.AudioUtilities;
import src.utilities.AnimationUtilities;
import device;
import animate;

import src.views.Splash as Splash;
import src.views.MainMenu as MainMenu;
import src.views.Game as Game;

import ui.TextView;

var BOUNDS_WIDTH = 720;
var BOUNDS_HEIGHT = 1280;

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

        var splash = new Splash();
        this.rootView.push(splash);

        this.mainMenu = new MainMenu();

        splash.on('InputSelect', bind(this, function () {
            this.showMenu();
        }));

        this.switchToMenu = setTimeout(bind(this, function () {
            this.showMenu();
        }), PiuPiuConsts.splashScreenTimeOut);

        this.game = new Game();
        this.mainMenu.on('game:start', bind(this, function () {
            dissolvePushScenes(this.rootView, this.game, 3000, bind(this, function() {
                this.game.startLevel();
            }));
        }));

        this.on('game:end', bind (this, function() {
            dissolvePopScenes(this.rootView, 3000);
        }));

        this.on('game:levelCompleted', bind (this, function() {
            //this.rootView.pop();
        }));
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
        LOG("Initializing game");

        this.scaleUI();

        //  Init globals
        initGlobals();

        //  Load stats
        loadStats();

        //  Loads hands
        //cc.spriteFrameCache.addSpriteFrames(res.Hands_plist);

        setMusicVolume(PiuPiuConsts.musicVolume);

        PiuPiuGlobals.commonGrassMap = randomMap();

        //  Init Facebook
        //FBinit();

        //handleHighScore();

        //  Load all levels
        //  PAY ATTENTION! THIS CAUSE A FAILURE AND STOPS LOADING OTHER THINGS AFTERWARDS!
        loadAllLevels();
    };

    this.showMenu = function() {
        clearTimeout(this.switchToMenu);
        dissolvePushScenes(this.rootView, this.mainMenu, 2000, bind(this, function() {
            this.mainMenu.animate();
        }));
    }
});

