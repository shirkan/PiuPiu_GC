import ui.ImageView as ImageView;
import ui.TextView as TextView;
import ui.View;
import animate;

import src.anim.MainMenuAnim as MainMenuAnim;

/** @const */ var Y_GAP = 10;
/** @const */ var START_Y = 100;
/** @const */ var WIDTH_RATIO = 0.55;
/** @const */ var TEXT_TIME = 10000;
/** @const */ var SENTENCES0 = ["Start play now!", "Let's go hit some hooligans!", "What are you waiting for? Start play now!"];
/** @const */ var SENTENCES1_20 = ["Come on! you can do better!", "Let's go hit some hooligans!", "Come play some more!"];
/** @const */ var SENTENCES21_50 = ["You are getting better and better!", "Let's go hit some hooligans!", "Come play some more!"];
/** @const */ var SENTENCES51_80 = ["You are mastering this game!", "Let's go hit some hooligans!", "Come play some more!"];
/** @const */ var SENTENCES81_99 = ["You are getting close to complete this game!", "Only few more games and you complete it!",
    "We wish we were as good as you are!", "Let's go hit some hooligans!", "Come play some more!"];
/** @const */ var SENTENCES100 = ["You have successfully completed this game!", "Oh you are the MAN!", "Let's go hit some hooligans!", "Come play some more!"];

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        this.name = "MainMenuView";
        opts = merge(opts, {
            x: 0,
            y: 0,
            image: PiuPiuGlobals.commonGrassMap
        });

        supr(this, 'init', [opts]);

        this.anim = new MainMenuAnim({parent: this});
        this.build();
    };

    this.build = function() {
        //  Build menu
        //var entries = ["Start", "Sound on", "Statistics", "Leaderboard", "Achievements"];
        var entries = ["Start", "Statistics", "Leaderboard", "Achievements", "FEEDBACK"];

        this.menu = {};

        for (var i=0; i< entries.length; i++) {
            var y = START_Y + i * (PiuPiuConsts.fontSizeBig + Y_GAP );
            var width = PiuPiuConsts.fontSizeBig * entries[i].length * WIDTH_RATIO;

            this.menu[i] = new TextView({
                superview: this,
                fontFamily : PiuPiuConsts.fontName,
                size: PiuPiuConsts.fontSizeBig,
                text: entries[i],
                color: "yellow",
                strokeColor: "blue",
                strokeWidth: PiuPiuConsts.fontStrokeSize,
                width: width,
                height: PiuPiuConsts.fontSizeBig,
                anchorX: width / 2,
                anchorY: PiuPiuConsts.fontSizeBig / 2,
                zIndex: 1,
                x: (PiuPiuGlobals.winSize.width - width) / 2,
                y: y
            });
        }

        this.isMenuClickable = true;
        this.menu[0].on('InputSelect', bind (this, function() {
            //  Start
            if (!this.isMenuClickable) { return }
            this.isMenuClickable = false;

            animateText(this.menu[0]);
            LOG(entries[0]);
            this.emit('intro:start');
        }));
        //this.menu[1].on('InputSelect', bind (this, function() {
        //    //  Sound
        //    animateText(this.menu[1]);
        //    this.soundToggle();
        //}));
        this.menu[1].on('InputSelect', bind (this, function() {
            //  Stats
            if (!this.isMenuClickable) { return }
            this.isMenuClickable = false;

            animateText(this.menu[1]);
            LOG(entries[1]);
            this.emit('stats:start');
        }));
        this.menu[2].on('InputSelect', bind (this, function() {
            //  Leaderboard
            if (!this.isMenuClickable) { return }

            animateText(this.menu[2]);
            LOG(entries[2]);

            if (this.leaderboardEnabled) {
                this.isMenuClickable = false;
                this.emit('leaderboard:start');
            } else {
                this.runFBanimation();
            }
        }));
        this.menu[3].on('InputSelect', bind (this, function() {
            //  Achievements
            //if (!this.isMenuClickable) { return }
            //this.isMenuClickable = false;

            animateText(this.menu[3]);
            LOG(entries[3]);
        }));

        this.menu[4].on('InputSelect', bind (this, function() {
            //  Achievements
            //if (!this.isMenuClickable) { return }
            //this.isMenuClickable = false;

            animateText(this.menu[4]);
            LOG(entries[4]);
            window.open("http://meganeev.weebly.com/feedback.html");
        }));

        //  Build FB assets
        this.FB_LOGO_SIZE = 64;
        this.FBlogo = new ImageView({
            name: "FB Logo",
            superview: this,
            width: this.FB_LOGO_SIZE,
            height: this.FB_LOGO_SIZE,
            image: res.FB_png,
            zIndex: 1,
            x: (PiuPiuGlobals.winSize.width - this.FB_LOGO_SIZE) / 2,
            y: PiuPiuGlobals.winSize.height - this.FB_LOGO_SIZE - PiuPiuConsts.fontSizeSmall
        });
        this.FBlogo.on('InputSelect', this.onFBclick.bind(this));

        this.hideFB();

        //  Scrolled text
        this.scrolledText = new TextView({
            superview: this,
            fontFamily : PiuPiuConsts.fontName,
            size: PiuPiuConsts.fontSizeSmall,
            color: "yellow",
            strokeColor: "blue",
            strokeWidth: PiuPiuConsts.fontStrokeSizeSmall,
            height: PiuPiuConsts.fontSizeSmall,
            horizontalAlign: "left",
            zIndex: 1,
            x: PiuPiuGlobals.winSize.width + 1,
            y: PiuPiuGlobals.winSize.height - PiuPiuConsts.fontSizeSmall
        });
        this.resetGameProgressText();

        //  Sound icon
        this.soundIcon = new ImageView({
            superview: this,
            image: res.Sound_on_png,
            width: 40,
            height: 40,
            x: PiuPiuGlobals.winSize.width - 80,
            y: 40
        });

        this.soundIcon.on('InputSelect', bind (this, function() {
            //  Sound
            this.soundToggle();
        }));

        if (!PiuPiuGlobals.soundEnabled){
            this.soundIcon.setImage(res.Sound_off_png);
        }
    };

    this.checkFBstatus = function () {
        //  Handle FB login - Display FB logo if not logged in
        //FBisLoggedIn(this, this.hideFB, this.showFB);
        setTimeout(bind(this, function () {
            LOG("checkFBstatus: checking FB status: " + PiuPiuGlobals.FBisConnected);
            if (PiuPiuGlobals.FBisConnected) {
                this.hideFB();
            } else {
                this.showFB();
            }
        }), PiuPiuConsts.FBwaitBeforeCheckingStatus);
    };

    this.animate = function () {
        this.anim.restartAnimation();
        this.animateGameProgressText();
        // Play music
        startMusic();
    };

    this.resetView = function () {
        this.isMenuClickable = true;
        this.anim.resetAnimation();
        this.resetFBLogo();
        this.resetFBText();
    };

    animateText = function ( obj ) {
        animate(obj).now(bind(this,function () {
            obj._opts.color = "blue";
            obj._opts.strokeColor= "yellow";
            obj.__view.scale = 1.25;
        })).wait(150).then(bind(this,function () {
            obj._opts.color = "yellow";
            obj._opts.strokeColor= "blue";
            obj.__view.scale = 1;
        }));
    };

    this.soundToggle = function() {
        localStorage.soundEnabled = PiuPiuGlobals.soundEnabled = 1 - PiuPiuGlobals.soundEnabled;
        if (PiuPiuGlobals.soundEnabled == 0) {
            //this.menu[1].setText("Sound off");
            this.soundIcon.setImage(res.Sound_off_png);
            stopAllSounds();
            //stopMusic();
        } else {
            //this.menu[1].setText("Sound on");
            this.soundIcon.setImage(res.Sound_on_png);
            //startMusic();
        }
    };

    //  FB animation
    this.hideFB = function () {
        this.leaderboardEnabled = true;
        this.FBlogo.hide();
        //this.scrolledText.hide();
    };

    this.showFB = function () {
        this.leaderboardEnabled = false;
        this.FBlogo.show();
        //this.scrolledText.show();
    };

    this.onFBclick = function () {
        FBisLoggedIn(this, this.hideFB, FBfirstTime.bind(this, this, this.hideFB));
    };

    this.runFBanimation = function () {
        this.animateFBlogo();
        this.animateFBText();
    };

    this.animateFBlogo = function () {
        if (this.isAnimatingFBLogin) {
            return;
        }

        this.isAnimatingFBLogin = true;
        /** @const */ var SHAKE_TIME = 50;
        /** @const */ var BIAS = 20;
        /** @const */ var LEFT = (PiuPiuGlobals.winSize.width - this.FB_LOGO_SIZE - BIAS) / 2;
        /** @const */ var RIGHT = (PiuPiuGlobals.winSize.width - this.FB_LOGO_SIZE + BIAS) / 2;
        /** @const */ var CENTER = (PiuPiuGlobals.winSize.width - this.FB_LOGO_SIZE ) / 2;

        animate(this.FBlogo).now({x: LEFT},SHAKE_TIME).
            then({x: CENTER}, SHAKE_TIME).
            then({x: RIGHT}, SHAKE_TIME).
            then({x: CENTER}, SHAKE_TIME).
            then({x: LEFT}, SHAKE_TIME).
            then({x: CENTER}, SHAKE_TIME).
            then({x: RIGHT}, SHAKE_TIME).
            then({x: CENTER}, SHAKE_TIME).
            then({x: LEFT}, SHAKE_TIME).
            then({x: CENTER}, SHAKE_TIME).
            then({x: RIGHT}, SHAKE_TIME).
            then({x: CENTER}, SHAKE_TIME).
            then(this.resetFBLogo.bind(this));
    };

    this.resetFBLogo = function () {
        animate(this.FBlogo).clear();
        this.isAnimatingFBLogin = false;
    };

    this.animateFBText = function (){
        if (this.isAnimatingText) {
            return;
        }

        this.isAnimatingText = true;

        animate(this.scrolledText).now({x: -1 * this.scrolledText.style.width}, TEXT_TIME, animate.linear).
            then(this.resetFBText.bind(this)).
            then(this.resetGameProgressText.bind(this)).
            then(this.animateGameProgressText.bind(this));
    };

    this.resetFBText = function () {
        animate(this.scrolledText).clear();
        this.isAnimatingText = false;
        this.scrolledText.style.x = PiuPiuGlobals.winSize.width + 1;
        this.scrolledText.setText("You must login to Facebook to enable this feature.");
        this.scrolledText.style.width = PiuPiuConsts.fontSizeSmall * this.scrolledText.text.length * WIDTH_RATIO;
    };

    this.animateGameProgressText = function () {
        this.resetGameProgressText();
        animate(this.scrolledText).now({x: -1 * this.scrolledText.style.width}, TEXT_TIME, animate.linear).
            then(this.animateGameProgressText.bind(this));
    };

    this.resetGameProgressText = function () {
        animate(this.scrolledText).clear();
        this.scrolledText.style.x = PiuPiuGlobals.winSize.width + 1;
        var text = "You have completed " + PiuPiuGlobals.gameProgress + "% of the game. " + this.getGameProgressText();
        this.scrolledText.setText(text);
        this.scrolledText.style.width = PiuPiuConsts.fontSizeSmall * text.length * WIDTH_RATIO;
    };

    this.getGameProgressText = function () {
        if (PiuPiuGlobals.gameProgress == 0 ) {
            return SENTENCES0[randomNumber(0, SENTENCES0.length, true)];
        } else if (PiuPiuGlobals.gameProgress > 0 && PiuPiuGlobals.gameProgress < 21) {
            return SENTENCES1_20[randomNumber(0, SENTENCES1_20.length, true)];
        } else if (PiuPiuGlobals.gameProgress >= 21 && PiuPiuGlobals.gameProgress < 51) {
            return SENTENCES21_50[randomNumber(0, SENTENCES21_50.length, true)];
        } else if (PiuPiuGlobals.gameProgress >= 51 && PiuPiuGlobals.gameProgress < 81) {
            return SENTENCES51_80[randomNumber(0, SENTENCES51_80.length, true)];
        } else if (PiuPiuGlobals.gameProgress >= 81 && PiuPiuGlobals.gameProgress < 100) {
            return SENTENCES81_99[randomNumber(0, SENTENCES81_99.length, true)];
        } else {
            return SENTENCES100[randomNumber(0, SENTENCES100.length, true)];
        }
    };

});