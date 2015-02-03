import ui.ImageView as ImageView;
import ui.TextView as TextView;
import ui.View;
import animate;

import src.anim.MainMenuAnim as MainMenuAnim;

const yGap = 10;
const startY = 100;
const widthRatio = 0.8;

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
        var entries = ["Start", "Sound on", "Statistics", "Leaderboard", "Achievements"];
        if (!PiuPiuGlobals.soundEnabled){
            entries[1] = "Sound off";
        }
        this.menu = {};

        for (var i=0; i< entries.length; i++) {
            var y = startY + i * (PiuPiuConsts.fontSizeBig + yGap );
            var width = PiuPiuConsts.fontSizeBig * entries[i].length * widthRatio;

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
        this.menu[1].on('InputSelect', bind (this, function() {
            //  Sound
            animateText(this.menu[1]);
            this.soundToggle();
        }));
        this.menu[2].on('InputSelect', bind (this, function() {
            //  Stats
            if (!this.isMenuClickable) { return }
            this.isMenuClickable = false;

            animateText(this.menu[2]);
            LOG(entries[2]);
            this.emit('stats:start');
        }));
        this.menu[3].on('InputSelect', bind (this, function() {
            //  Leaderboard
            //if (!this.isMenuClickable) { return }
            //this.isMenuClickable = false;

            animateText(this.menu[3]);
            LOG(entries[3]);
            this.runFBanimation();
        }));
        this.menu[4].on('InputSelect', bind (this, function() {
            //  Achievements
            //if (!this.isMenuClickable) { return }
            //this.isMenuClickable = false;

            animateText(this.menu[4]);
            LOG(entries[4]);
        }));
        //  Handle FB login
        this.showFBlogo();
    };

    this.animate = function () {
        this.anim.restartAnimation();
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
            this.menu[1].setText("Sound off");
            stopAllSounds();
            stopMusic();
        } else {
            this.menu[1].setText("Sound on");
            startMusic();
        }
    };

    this.showFBlogo = function () {
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

        var text = "You must login to Facebook to enable this feature. We are *NOT* going to post anything on your wall/timeline without clearly stating so.";
        var textWidth = PiuPiuConsts.fontSizeSmall * text.length * widthRatio * 0.7;
        this.FBtext = new TextView({
            superview: this,
            fontFamily : PiuPiuConsts.fontName,
            size: PiuPiuConsts.fontSizeSmall,
            text: text,
            color: "yellow",
            strokeColor: "blue",
            strokeWidth: PiuPiuConsts.fontStrokeSizeSmall,
            width: textWidth,
            height: PiuPiuConsts.fontSizeSmall,
            horizontalAlign: "left",
            zIndex: 1,
            x: PiuPiuGlobals.winSize.width + 1,
            y: PiuPiuGlobals.winSize.height - PiuPiuConsts.fontSizeSmall
        });
        this.FBlogo.on('InputSelect', this.onFBclick.bind(this));
    };

    this.onFBclick = function () {
        if (!PiuPiuGlobals.FBdidEverAccessed) {
            if (FBfirstTime()) {
                this.FBlogo.hide();
            }
        } else {
            if (FBlogin()) {
                this.FBlogo.hide();
            }
        }
    };

    //  FB animation
    this.runFBanimation = function () {
        this.animateFBlogo();
        this.animateFBText();
    };

    this.animateFBlogo = function () {
        if (this.isAnimatingFBLogin) {
            return;
        }

        this.isAnimatingFBLogin = true;
        const SHAKE_TIME = 50;
        const BIAS = 20;
        const LEFT = (PiuPiuGlobals.winSize.width - this.FB_LOGO_SIZE - BIAS) / 2;
        const RIGHT = (PiuPiuGlobals.winSize.width - this.FB_LOGO_SIZE + BIAS) / 2;
        const CENTER = (PiuPiuGlobals.winSize.width - this.FB_LOGO_SIZE ) / 2;

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
        const TEXT_TIME = 20000;

        animate(this.FBtext).now({x: -1 * this.FBtext.style.width}, TEXT_TIME, animate.linear).
            then(this.resetFBText.bind(this));
    };

    this.resetFBText = function () {
        animate(this.FBtext).clear();
        this.isAnimatingText = false;
        this.FBtext.style.x = PiuPiuGlobals.winSize.width + 1;
    };

});

/*
//
//var MenuLayer = cc.Layer.extend({
//    labelSound:null,
//    facebookSprite:null,
//    isAnimatingFBLogin:false,
//    isVibratingFBLogo:false,
//    FBlogoPos:null,
//    ctor : function(){
//        //1. call super class's ctor function
//        this._super();
//    },
//    init:function(){
//        //call super class's super function
//        this._super();
//
//        //  Setup menu items
//        this.createMenu();
//
//        //  Check if need to add facebook login image
//        FBisLoggedIn(this, null, this.showFacebookLogo);
//    },
//
//    createMenu : function () {
//        var menuItems = [];
//
//        //  Start
//        var labelStart = new cc.LabelTTF("Start", PiuPiuConsts.fontName, PiuPiuConsts.fontSizeNormal);
//        labelStart.setFontFillColor(cc.color(255,220,80)); //Yellow
//        labelStart.enableStroke(cc.color(0,0,255), PiuPiuConsts.fontStrokeSize); //Blue
//
//        var menuItemPlay = new cc.MenuItemLabel(
//            labelStart,
//            this.onPlay, this);
//        menuItems.push(menuItemPlay);
//
//        //  Sound on/off
//        this.labelSound = new cc.LabelTTF("Sound on", "res/fonts/arcadepi.ttf", PiuPiuConsts.fontSizeNormal);
//        this.labelSound.setFontFillColor(cc.color(255,220,80)); //Yellow
//        this.labelSound.enableStroke(cc.color(0,0,255), PiuPiuConsts.fontStrokeSize); //Blue
//
//        if (PiuPiuGlobals.soundEnabled == 0) {
//            this.labelSound.setString("Sound off");
//        }
//
//
//        var menuItemSound = new cc.MenuItemLabel(
//            this.labelSound,
//            this.onModifySound, this);
//        menuItems.push(menuItemSound);
//
//        //  Statistics
//        var labelStatistics = new cc.LabelTTF("Statistics", "assets/res/fonts/arcadepi.ttf", PiuPiuConsts.fontSizeNormal);
//        labelStatistics.setFontFillColor(cc.color(255,220,80)); //Yellow
//        labelStatistics.enableStroke(cc.color(0,0,255), PiuPiuConsts.fontStrokeSize);
//
//        var menuItemStatistics = new cc.MenuItemLabel(
//            labelStatistics,
//            this.onStatistics, this);
//        menuItems.push(menuItemStatistics);
//
//        //  Leaderboard
//        var labelLeaderboard = new cc.LabelTTF("Leaderboard", PiuPiuConsts.fontName, PiuPiuConsts.fontSizeNormal);
//        labelLeaderboard.setFontFillColor(cc.color(255,220,80)); //Blue
//        labelLeaderboard.enableStroke(cc.color(0,0,255), PiuPiuConsts.fontStrokeSize);
//
//        var menuItemLeaderboard = new cc.MenuItemLabel(
//            labelLeaderboard,
//            this.onLeaderboard, this);
//        menuItems.push(menuItemLeaderboard);
//
//        //  Achievements
//        var labelAchievements = new cc.LabelTTF("Acheivements", PiuPiuConsts.fontName, PiuPiuConsts.fontSizeNormal);
//        labelAchievements.setFontFillColor(cc.color(255,220,80)); //Blue
//        labelAchievements.enableStroke(cc.color(0,0,255), PiuPiuConsts.fontStrokeSize); //Blue
//
//        var menuItemAchievements = new cc.MenuItemLabel(
//            labelAchievements,
//            this.onAchievements, this);
//        menuItems.push(menuItemAchievements);
//
//        var menu = new cc.Menu(menuItems);
//
//        menu.alignItemsVertically();
//
//        menu.setPosition(cc.p(PiuPiuGlobals.winSize.width / 2, PiuPiuGlobals.winSize.height / 2 + 30 ));
//        this.addChild(menu);
//    },
//
//    onPlay : function(){
//        var transition = new cc.TransitionFade(1, new IntroScene());
//        cc.director.pushScene(transition);
//    },
//
//    onExitClicked : function () {
//        cc.director.end();
//    },
//
//    onAchievements : function () {
//        console.log("achievements clicked");
//
//        if (isRunningOniOS()){
//            var admob = plugin.PluginManager.getInstance().loadPlugin("AdsAdmob");
//            admob.configDeveloperInfo({"AdmobID":"ca-app-pub-5934662800023467/3099613280"});
//            admob.preLoadInterstitial();
//            cc.director.getScheduler().scheduleCallbackForTarget(this, function () { admob.showAds({"AdmobType":"2", "AdmobSizeEnum":"2"})}, 0, 0, 5);
//            //ads.showAds({"AdmobType":"2", "AdmobSizeEnum":"2"});
//            //IAPinit();
//            //IAPrequestProducts(["1","2"]);
//        }
//
//        if (isRunningOnAndroid()){
//            var admob = plugin.PluginManager.getInstance().loadPlugin("AdsAdmob");
//            var bannerID = "ca-app-pub-5934662800023467/3239214081";
//            var interstitialID = "ca-app-pub-5934662800023467/4715947283";
//            var m = {
//                "AdmobID" : interstitialID,
//                "AdmobType" : "2",
//                "AdmobSizeEnum" : "2"
//            };
//            admob.configDeveloperInfo(m);
//            admob.showAds(m,2);
//        }
//
//        return;
//
//        if (!FBisLoggedIn()) {
//            this.animateLoginToFB();
//        }
//        return;
//        var transition = new cc.TransitionFade(1, new AchievementsScene());
//        cc.director.pushScene(transition);
//    },
//
//    onLeaderboard : function () {
//        console.log("leaderboard clicked");
//
//        if (!FBisLoggedIn()) {
//            this.animateLoginToFB();
//            return;
//        }
//
//        //FBgetAllScores();
//        var transition = new cc.TransitionFade(1, new LeaderboardScene());
//        cc.director.pushScene(transition);
//
//        return;
//        //var facebook = plugin.FacebookAgent.getInstance();
//        var info = {
//            "app_id": PiuPiuConsts.FB_appid,
//            "message": "Piu Piu is a great game!",
//            "title": "Piu Piu"
//        };
//        var facebook = plugin.FacebookAgent.getInstance();
//        facebook.appRequest(info, function (code, msg) {
//            if(code == plugin.FacebookAgent.CODE_SUCCEED){
//                cc.log("Sending request succeeded, code #" + code + ": " + msg.toString());
//            } else {
//                cc.log("Sending request failed, error #" + code + ": " + msg.toString());
//            }
//        });
//    },
//
//
//    onStatistics : function () {
//        var transition = new cc.TransitionFade(1, new StatsScene());
//        cc.director.runScene(transition);
//    },
//
//    onModifySound : function () {
//        cc.sys.localStorage.soundEnabled = PiuPiuGlobals.soundEnabled = 1 - PiuPiuGlobals.soundEnabled;
//        if (PiuPiuGlobals.soundEnabled == 0) {
//            this.labelSound.setString("Sound off");
//            stopAllSounds();
//            stopMusic();
//        } else {
//            this.labelSound.setString("Sound on");
//            startMusic();
//        }
//    },
//
//    showFacebookLogo : function () {
//
//        this.facebookSprite = new cc.Sprite(res.FB_png);
//        this.FBlogoPos = cc.p(PiuPiuGlobals.winSize.width/2 , 100);
//        this.facebookSprite.setPosition(this.FBlogoPos);
//        this.addChild(this.facebookSprite);
//
//        var listener1 = cc.EventListener.create({
//            event: cc.EventListener.TOUCH_ONE_BY_ONE,
//            // When "swallow touches" is true, then returning 'true' from the onTouchBegan method will "swallow" the touch event, preventing other listeners from using it.
//            swallowTouches: true,
//            //onTouchBegan event callback function
//            onTouchBegan: function (touch, event) {
//                // event.getCurrentTarget() returns the *listener's* sceneGraphPriority node.
//                var target = event.getCurrentTarget();
//                var parent = target.parent;
//
//                //Get the position of the current point relative to the button
//                var locationInNode = target.convertToNodeSpace(touch.getLocation());
//                var s = target.getContentSize();
//                var rect = cc.rect(0, 0, s.width, s.height);
//
//                //Check the click area
//                if (cc.rectContainsPoint(rect, locationInNode)) {
//                    FBlogin(parent, function () { this.removeChild(this.facebookSprite)} );
//                    return true;
//                }
//                return false;
//            }
//        });
//        cc.eventManager.addListener(listener1, this.facebookSprite);
//    },
//
//    animateLoginToFB : function () {
//        //  Code for bouncing logo
//        //if (! this.isBouncingFBLogo) {
//        //    //  Bouncing FB logo animation
//        //    var bouncingAnimation = new cc.Sequence(
//        //        cc.Repeat.create(new cc.Sequence(
//        //            cc.MoveBy.create(0.1, cc.p(0,40)),
//        //            cc.MoveBy.create(0.8, cc.p(0,-40)).easing(cc.easeBounceOut(1))
//        //        ), 3),
//        //        new cc.CallFunc(function() { this.isBouncingFBLogo = false}, this)
//        //    );
//        //    this.isBouncingFBLogo = true;
//        //    this.facebookSprite.runAction(bouncingAnimation);
//        //}
//
//        //  Code for vibrating logo
//        if (! this.isVibratingFBLogo) {
//            //  Bouncing FB logo animation
//            this.isVibratingFBLogo = true;
//            var vibratingAnimation = new cc.Sequence(
//                cc.Repeat.create(new cc.Sequence(
//                    cc.MoveBy.create(0.05, cc.p(-5,0)),
//                    cc.MoveBy.create(0.05, cc.p(5,0)),
//                    cc.MoveBy.create(0.05, cc.p(5,0)),
//                    cc.MoveTo.create(0.05, this.FBlogoPos)
//                ), 3),
//                new cc.CallFunc(function() { this.isVibratingFBLogo = false}, this)
//            );
//            this.facebookSprite.runAction(vibratingAnimation);
//        }
//        if (!this.isAnimatingFBLogin) {
//            var labelSprite = new cc.LabelTTF("You must login to Facebook to enable this feature. We are *NOT* going to post anything on your wall/timeline without clearly stating so.",
//                PiuPiuConsts.fontName, PiuPiuConsts.fontSizeSmall);
//            labelSprite.anchorX = 0;
//            //labelSprite.anchorX = 1;
//            //labelSprite.setPosition(cc.p(0, 20));
//            labelSprite.setPosition(cc.p(PiuPiuGlobals.winSize.width, 20));
//            labelSprite.setFontFillColor(cc.color(255,220,80)); //Yellow
//            labelSprite.enableStroke(cc.color(0,0,255), PiuPiuConsts.fontStrokeSizeSmall); // Blue
//            this.addChild(labelSprite);
//
//            var labelAnimation = new cc.Sequence(
//                cc.MoveBy.create(15, cc.p(-(PiuPiuGlobals.winSize.width + labelSprite.width), 0)),
//                new cc.CallFunc(function() { this.removeFromParent()}, labelSprite),
//                new cc.CallFunc(function() { this.isAnimatingFBLogin = false}, this)
//            );
//
//            this.isAnimatingFBLogin = true;
//            labelSprite.runAction(labelAnimation);
//        }
//    }
//
//});
//
//var MenuScene = cc.Scene.extend({
//    onEnter:function () {
//        this._super();
//
//        //  Add animation
//        var animLayer = new MainMenuAnim();
//        animLayer.init();
//        this.addChild(animLayer);
//
//        var layer = new MenuLayer();
//        layer.init();
//        layer.bake();
//        this.addChild(layer);
//
//        //  Set game state as menu
//        PiuPiuGlobals.gameState = GameStates.Menu;
//        PiuPiuGlobals.currentLevel = 1;
//        //  Load level settings
//        loadLevelSettings();
//
//        //  Play music
//        startMusic();
//
//        //  Setup back button to exit for android
//        cc.eventManager.addListener({
//            event: cc.EventListener.KEYBOARD,
//            onKeyReleased: function (keyCode, event) {
//                if (keyCode == cc.KEY.back || keyCode == cc.KEY.backspace) {
//                    event.getCurrentTarget().onExitClicked();
//                }
//
//                //FACEBOOK logout walkaround
//                if (keyCode == cc.KEY.l) {
//                    FBlogout();
//                }
//                if (keyCode == cc.KEY.d) {
//                    FBdeleteMe();
//                }
//                if (keyCode == cc.KEY.p) {
//                    FBgetPicture("me", event.getCurrentTarget(), event.getCurrentTarget().addimage);
//
//                }
//            }
//        }, this);
//
//        cc.eventManager.addListener({
//            event: cc.EventListener.TOUCH_ONE_BY_ONE,
//            swallowTouches: true,
//            onTouchBegan: this.onBackClicked,
//            onTouchMoved: function () {},
//            onTouchEnded: function () {}
//        }, this);
//    },
//
//    onBackClicked : function (touch, event) {
//        var pos = touch.getLocation();
//        LOG("pos is " + pos.x + " " + pos.y);
//        return true;
//
//    },
//    onExitClicked : function () {
//        cc.director.end();
//    },
//    addimage : function (userid, url) {
//
//        var sprite = new cc.Sprite(url);
//        //var tex = cc.textureCache.addImage(url);
//        //sprite.setTexture(tex);
//        sprite.setPosition(cc.p(110,110));
//        this.addChild(sprite);
//    }
//});

    */