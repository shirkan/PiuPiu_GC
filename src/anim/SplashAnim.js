/**
 * Created by shirkan on 1/3/15.
 */

//  TODO: implement old animation

import ui.View as View;
import src.anim.Ball as Ball;
import src.anim.Ballview as BallView;
import animate;

/** @const */ var FPS = 15;
/** @const */ var TIME_firstBounce = 2;
/** @const */ var TIME_secondBounce = 2;
/** @const */ var TIME_thirdBounce = 2;
/** @const */ var TIME_roll = 2;
/** @const */ var X_firstHit = 1/3;
/** @const */ var X_secondHit = 2/3;
/** @const */ var X_thirdHit = 5/6;
/** @const */ var Y_Floor = PiuPiuGlobals.winSize.height - PiuPiuConsts.fontSizeSmall;
/** @const */ var BOUNCE_firstHit = 8;
/** @const */ var BOUNCE_secondHit = 8;
/** @const */ var BOUNCE_thirdHit = 5;
/** @const */ var BOUNCE_roll = 3;

exports = Class(View, function(supr) {
    this.init = function (opts) {
        supr(this, 'init', [opts]);
        this.build();
    };

    this.build = function () {
        /** @const */ var BALL_SIZE = 32;
        /** @const */ var FIRST_BOUNCE_TIME = 2000;
        /** @const */ var SECOND_BOUNCE_TIME = 2000;
        /** @const */ var THIRD_BOUNCE_TIME = 2000;
        /** @const */ var FOURTH_BOUNCE_TIME = 2000;
        this.Y_FLOOR = (PiuPiuGlobals.winSize.height - BALL_SIZE - PiuPiuConsts.fontSizeSmall);

        //  Points of ground hit
        //  Starting point
        var p1 = makePoint(0, PiuPiuGlobals.winSize.height / 2);

        //  Radial point is relative to p1
        var p12 = makePoint(0, PiuPiuGlobals.winSize.height / 2 - BALL_SIZE - PiuPiuConsts.fontSizeSmall);

        //  Radius point for second bounce
        var p23 = makePoint(PiuPiuGlobals.winSize.width * 0.3, BALL_SIZE / 2);

        //  Radius point for third bounce
        var p34 = makePoint(PiuPiuGlobals.winSize.width * 0.43, BALL_SIZE / 2);

        //  Radius point for forth bounce
        var p45 = makePoint(PiuPiuGlobals.winSize.width * 0.53, BALL_SIZE / 2);

        //  roll
        var p5 = makePoint(PiuPiuGlobals.winSize.width * 0.65 , BALL_SIZE / 2);

        this.ballView = new BallView({parent: this});
        this.ballView.style.x = p1.x;
        this.ballView.style.y = p1.y;
        this.ballView.style.anchorX = p12.x;
        this.ballView.style.anchorY = p12.y;

        var ball = new Ball({parent: this.ballView});

        ball.style.anchorX = ball.style.width / 2;
        ball.style.anchorY = ball.style.height / 2;

        ballSpin = function (spins, time, type) {
            if (type === undefined) {
                type = animate.linear;
            }
            ball.animate({r: Math.PI * 2 * spins}, time, type);
        }

        //animate(ball).now({r : Math.PI * 16}, FIRST_BOUNCE_TIME, animate.linear);
        ballSpin(6, FIRST_BOUNCE_TIME);
        animate(this.ballView).now({r : Math.PI * 0.5}, FIRST_BOUNCE_TIME, animate.linear).
            //wait(5000).
            then(bind(this, function() {
                playSound("ballHitGround");
                LOG("x: " + this.ballView.style.x + " y: " + this.ballView.style.y);
                //  Get position in ABSOLUTE cords, need to scale them.
                var pos = this.ballView.getPosition();
                this.ballView.style.x = (1 / PiuPiuGlobals.winSize.scale) * (pos.x) - BALL_SIZE;
                this.ballView.style.y = (1 / PiuPiuGlobals.winSize.scale) * (pos.y) - BALL_SIZE / 2;
                this.ballView.style.anchorY = p23.y;
                this.ballView.style.anchorX = (1 / PiuPiuGlobals.winSize.scale) * (p23.x - pos.x);
                this.ballView.style.r = 0;
                //ball.style.r = Math.PI * 0.5;
                ballSpin(10, FIRST_BOUNCE_TIME);
                LOG("x: " + this.ballView.style.x + " y: " + this.ballView.style.y);
            })).
            then({r: Math.PI}, SECOND_BOUNCE_TIME, animate.linear).
            //wait(2000).
            then(bind(this, function() {
                playSound("ballHitGround");
                //  Get position in ABSOLUTE cords, need to scale them.
                var pos = this.ballView.getPosition();
                this.ballView.style.x = (1 / PiuPiuGlobals.winSize.scale) * (pos.x) - BALL_SIZE;
                this.ballView.style.y = (1 / PiuPiuGlobals.winSize.scale) * (pos.y) - BALL_SIZE;
                this.ballView.style.anchorY = p34.y;
                this.ballView.style.anchorX = (1 / PiuPiuGlobals.winSize.scale) * (p34.x - pos.x);
                this.ballView.style.r = 0;
                //ball.style.r = Math.PI;
                ballSpin(14, SECOND_BOUNCE_TIME);
                LOG("x: " + this.ballView.style.x + " y: " + this.ballView.style.y);
            })).
            then({r: Math.PI}, THIRD_BOUNCE_TIME, animate.linear).
            //wait(2000).
            then(bind(this, function() {
                playSound("ballHitGround");
                //  Get position in ABSOLUTE cords, need to scale them.
                var pos = this.ballView.getPosition();
                this.ballView.style.x = (1 / PiuPiuGlobals.winSize.scale) * (pos.x) - BALL_SIZE;
                this.ballView.style.y = (1 / PiuPiuGlobals.winSize.scale) * (pos.y) - BALL_SIZE;
                this.ballView.style.anchorY = p45.y;
                this.ballView.style.anchorX = (1 / PiuPiuGlobals.winSize.scale) * (p45.x - pos.x);
                this.ballView.style.r = 0;
                //ball.style.r = Math.PI;
                ballSpin(16, THIRD_BOUNCE_TIME);
                LOG("x: " + this.ballView.style.x + " y: " + this.ballView.style.y);
            })).
            then({r: Math.PI}, FOURTH_BOUNCE_TIME, animate.linear).
            then(bind(this, function() {
                playSound("ballHitGround");
                //ball.style.r = Math.PI;
                ballSpin(18, FOURTH_BOUNCE_TIME, animate.easeOut);
            })).
            then({x: p5.x},FOURTH_BOUNCE_TIME, animate.easeOut).
            then(bind(this, function() {
                GC.app.emit("splashAnim:end");
            }))
    };

    this.resetAnimation = function () {
        animate(this.ballView).clear();
    }
});
 /*
var SplashAnim = cc.LayerColor.extend({
    FPS: 15,
    TIME_firstBounce: 2,
    TIME_secondBounce: 2,
    TIME_thirdBounce: 2,
    TIME_roll: 2,
    X_firstHit: 1/3,
    X_secondHit: 2/3,
    X_thirdHit: 5/6,
    Y_Floor: 20,
    BOUNCE_firstHit: 8,
    BOUNCE_secondHit: 8,
    BOUNCE_thirdHit: 5,
    BOUNCE_roll: 3,

    ctor : function(){
        this._super();
    },
    init:function() {
        //this._super();
        //  Points of ground hit
        //  Starting point
        var p1 = cc.p(-PiuPiuGlobals.winSize.width / 3, this.Y_Floor);

        //  First hit = 2/3
        var p2 = cc.p(PiuPiuGlobals.winSize.width * this.X_firstHit, this.Y_Floor);

        //  Top point for second bounce
        //var p23 = cc.p(PiuPiuGlobals.winSize.width * (this.X_firstHit + this.X_secondHit)/2, this.Y_Floor * 4);

        //  Second hit = 1/3
        var p3 = cc.p(PiuPiuGlobals.winSize.width * this.X_secondHit, this.Y_Floor);

        //  Top point for second bounce
        //var p34 = cc.p(PiuPiuGlobals.winSize.width * (this.X_thirdHit + this.X_secondHit)/2, this.Y_Floor * 2);

        //  Third hit = 1/6
        var p4 = cc.p(PiuPiuGlobals.winSize.width * this.X_thirdHit , this.Y_Floor);

        //  Roll over
        var p5 = cc.p(PiuPiuGlobals.winSize.width , this.Y_Floor);

        //  Add ball
        var ball = new cc.Sprite(res.Ball_png);
        ball.setScale(0.5);
        ball.setPosition(p1);
        this.addChild(ball);

        //  Create bounces
        var points1 = calculateHalfCirclePathFrom2Points(p1, p2, this.FPS, true, true);
        var anim1 = [];
        for (var i=0; i<this.FPS; i++){
            anim1.push(cc.MoveTo.create(1/this.FPS * this.TIME_firstBounce, points1[i]));
        }
        anim1.push(new cc.CallFunc(function() { playSound(res.sound_ballHitGround, true) }, this));

        var points2 = calculateHalfCirclePathFrom2Points(p2, p3, this.FPS, true, true);
        var anim2 = [];
        for (var i=0; i<this.FPS; i++){
            anim2.push(cc.MoveTo.create(1/this.FPS * this.TIME_secondBounce, points2[i]));
        }
        anim2.push(new cc.CallFunc(function() { playSound(res.sound_ballHitGround, true) }, this));

        var points3 = calculateHalfCirclePathFrom2Points(p3, p4, this.FPS, true, true);
        var anim3 = [];
        for (var i=0; i<this.FPS; i++){
            anim3.push(cc.MoveTo.create(1/this.FPS * this.TIME_thirdBounce, points3[i]));
        }
        anim3.push(new cc.CallFunc(function() { playSound(res.sound_ballHitGround, true) }, this));

        var ballAnimation = new cc.Sequence(
            new cc.Spawn(new cc.Sequence(anim1), cc.RotateBy.create(this.TIME_firstBounce, 360 * this.BOUNCE_firstHit)),
            new cc.Spawn(new cc.Sequence(anim2), cc.RotateBy.create(this.TIME_secondBounce, 360 * this.BOUNCE_secondHit)),
            new cc.Spawn(new cc.Sequence(anim3), cc.RotateBy.create(this.TIME_thirdBounce, 360 * this.BOUNCE_thirdHit)),
            new cc.Spawn(cc.MoveTo.create(this.TIME_roll, p5), cc.RotateBy.create(this.TIME_roll, 360 * this.BOUNCE_roll))
        );

        ball.runAction(ballAnimation);
    }
});*/