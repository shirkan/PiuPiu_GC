/**
 * Created by shirkan on 1/3/15.
 */

import ui.ImageView as ImageView;

exports = Class(ImageView, function(supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            x: 0,
            y: 0,
            image: "resources/images/title_screen.png"
        });

        supr(this, 'init', [opts]);

        this.build();
    };

    var imageview = new ImageView({
        superview: parent,
        image: res.Ball_png,
        width: 64,
        height: 64,
        x: 0,
        y: 0
    });
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