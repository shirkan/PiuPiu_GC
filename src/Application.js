import ui.StackView as StackView;
import src.data.resources;
import src.data.globals;
import src.utilities.Utilities;
import src.utilities.GameUtilities;
import src.utilities.AudioUtilities;
import device;

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
            width: this.baseWidth,
            height: this.baseHeight,
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

        var game = new Game();
        this.mainMenu.on('game:start', bind(this, function () {
            this.rootView.push(game);
        }));
    };

    this.launchUI = function () {

    };

    this.scaleUI = function () {
        if (device.height > device.width) {
            this.baseWidth = BOUNDS_WIDTH;
            this.baseHeight = device.height * (BOUNDS_WIDTH / device.width);
            this.scale = device.width / this.baseWidth;
        } else {
            this.baseWidth = BOUNDS_HEIGHT;
            this.baseHeight = device.height * (BOUNDS_HEIGHT / device.width);
            this.scale = device.height / this.baseHeight;
        }
        this.view.style.scale = this.scale;

        PiuPiuGlobals.winSize.width = this.baseWidth;
        PiuPiuGlobals.winSize.height = this.baseHeight;
        PiuPiuGlobals.winSize.scale = this.scale;
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
        this.rootView.push(this.mainMenu);
    }
});

