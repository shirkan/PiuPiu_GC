/**
 * Created by shirkan on 12/31/14.
 */
import ui.View as View;
import animate;
import src.anim.Ball as Ball;
import src.anim.Player as Player;
import src.anim.Enemy as Enemy;

const CIRCLE = Math.PI * 2;

exports = Class(View, function(supr) {
    this.init = function (opts) {
        supr(this, 'init', [opts]);
        this.player = new Player({parent: this});
        this.enemy = new Enemy({parent: this});
        this.ball = new Ball({parent: this});
        this.resetAnimation();
    };

    this.resetAnimation = function () {
        clearInterval(this.timer);
        animate(this.player).clear();
        animate(this.ball).clear();
        animate(this.enemy).clear();

        this.Y_FLOOR = PiuPiuGlobals.winSize.height - 20;

        //  Init
        this.player.style.x = -this.player.style.width;
        this.player.style.y = this.Y_FLOOR - this.player.style.height;
        this.xPlayerStanding = PiuPiuGlobals.winSize.width * 0.1;
        
        this.ball.style.x = -this.ball.style.width;
        this.ball.style.y = this.Y_FLOOR - this.ball.style.height;
        this.ball.style.anchorX = this.ball.style.width / 2;
        this.ball.style.anchorY = this.ball.style.height / 2;
        this.ball.style.scale = 0.7;

        var playerBallGap = this.player.style.width - this.ball.style.width;
        this.xBallStanding = this.xPlayerStanding + playerBallGap;

        this.enemy.style.x = PiuPiuGlobals.winSize.width;
        this.enemy.style.y = this.Y_FLOOR - this.enemy.style.height;
        this.enemy.style.anchorX = this.enemy.style.width / 2;
        this.enemy.style.anchorY = this.enemy.style.height / 2;
        this.xEnemyStanding = PiuPiuGlobals.winSize.width * 0.9 - this.enemy.style.width;
    };

    this.restartAnimation = function () {
        this.ENTER_TIME = 2000;
        this.SHOOT_TIME = 300;
        this.ENEMY_SPINNING_TIME = 500;
        this.ENEMY_WAITING_TIME = 2000;

        //  Animate
        animate(this.player).now({x : this.xPlayerStanding}, this.ENTER_TIME, animate.easeOut);
        animate(this.ball).now({x : this.xBallStanding, r : CIRCLE * 4}, this.ENTER_TIME, animate.easeOut);
        animate(this.enemy).now({x : this.xEnemyStanding}, this.ENTER_TIME, animate.easeOut);

        animate(this).wait(this.ENTER_TIME).then(bind(this, this.loop));
        //this.timer = setInterval(bind(this, this.loop), 7000);
    };
    
    this.loop = function () {
        this.enemy.style.r = 0;
        animate(this.ball).now({x: this.xEnemyStanding, y: this.enemy.style.y, r: CIRCLE}, this.SHOOT_TIME, animate.linear).
            then({x: this.xBallStanding,  y: this.Y_FLOOR - this.ball.style.height,  r: -CIRCLE * 4}, this.SHOOT_TIME, animate.linear);
        animate(this.enemy).wait(this.SHOOT_TIME).
            then({x: PiuPiuGlobals.winSize.width, r: CIRCLE * 2}, this.ENEMY_SPINNING_TIME, animate.linear).
            wait(this.ENEMY_WAITING_TIME).
            then({x : this.xEnemyStanding}, this.ENTER_TIME, animate.easeOut);
    }
});

    /*
var MainMenuAnim = cc.Layer.extend({
    TIME_shootToEnemy: 0.2,
    TIME_enemyOut: 1.5,
    TIME_delayUntilNextShot: 6,
    TIME_enter: 2.5,
    TIME_ballSpinAfterShoot: 3,
    TIME_enemyReentrantDelay: 5,
    ctor : function(){
        this._super();
        //  Add background
        var spriteBG = new cc.Sprite(PiuPiuGlobals.commonGrassMap);
        this.addChild(spriteBG);
    },
    init:function() {
        this._super();

        //  Add player
        //  Place player on left side
        this.player = new cc.Sprite(res.Player_png);
        this.player.setScale(0.5);
        this.player.setAnchorPoint(0,0);
        this.player.setPosition(cc.p(-this.player.width, this.player.y + PiuPiuConsts.fontSizeSmall + 5));
        this.addChild(this.player);

        var hands = new cc.Sprite("#hands.png");
        hands.setScale(0.5);
        hands.setAnchorPoint(0,0);
        hands.setPosition(cc.p(-this.player.width + 15, this.player.y + 40 + PiuPiuConsts.fontSizeSmall + 5));
        this.addChild(hands);

        //  Add ball
        var ball = new cc.Sprite(res.Ball_png);
        ball.setScale(0.5);
        ball.setPosition(cc.p(-this.player.width + ball.width, ball.height / 2 + PiuPiuConsts.fontSizeSmall));
        this.addChild(ball);

        //  Add enemy
        this.enemy = new cc.Sprite(res.Enemy_png);
        this.enemyStartPos = cc.p(PiuPiuGlobals.winSize.width + this.enemy.width / 2, this.enemy.height + PiuPiuConsts.fontSizeSmall);
        this.enemy.setPosition(this.enemyStartPos);
        this.addChild(this.enemy);

        //  Generate animation
        var playerAnimation = cc.MoveBy.create(this.TIME_enter, cc.p(100, 0));

        var enemyAnimation = cc.MoveBy.create(this.TIME_enter, cc.p(-100, 0));

        var ballAnimation = new cc.Sequence(
            new cc.Spawn(cc.MoveBy.create(this.TIME_enter, cc.p(100,0)), cc.RotateBy.create(this.TIME_enter, 720)),
            new cc.CallFunc(this.shootBallTowardsEnemy, this, ball)
        );

        //  Assign animations and go
        this.player.runAction(playerAnimation);
        hands.runAction(playerAnimation.clone());
        this.enemy.runAction(enemyAnimation);
        ball.runAction(ballAnimation);
    },

    shootBallTowardsEnemy : function (oldball) {
        this.removeChild(oldball);
        //  Add ball
        var ball = new cc.Sprite(res.Ball_png);
        ball.setScale(0.5);

        var p1 = cc.p(-this.player.width + ball.width + 100, ball.height / 2 + PiuPiuConsts.fontSizeSmall);
        var p2 = cc.p(PiuPiuGlobals.winSize.width - 100 + this.enemy.width / 2, this.enemy.height * 1.5 + PiuPiuConsts.fontSizeSmall - 5);

        ball.setPosition(p1);
        this.addChild(ball);

        //  Shoot and rotate the ball towards enemy
        var shootToEnemy = new cc.Sequence(
            new cc.Spawn(cc.MoveTo.create(this.TIME_shootToEnemy, p2),
                         cc.RotateBy.create(this.TIME_shootToEnemy, 360)),
            new cc.CallFunc(this.triggerEnemy.bind(this), this),
            new cc.CallFunc(function () { playSound(res.sound_ballHitGround)}, this)
        );

        //  Swing the ball back to player
        var points = calculateHalfCirclePathFrom2Points(p1, p2, 30, true, false);
        var swingBack = [];
        for (var i=0; i<30; i++){
            swingBack.push(cc.MoveTo.create(1/15, points[i]));
        }

        var swingBackRotate = new cc.Spawn(
                new cc.Sequence(swingBack), cc.RotateBy.create(this.TIME_ballSpinAfterShoot, 1080 * 5).easing(cc.easeOut(this.TIME_ballSpinAfterShoot))
        );

        var ballAnimation = new cc.RepeatForever(
            new cc.Sequence(shootToEnemy, swingBackRotate, new cc.DelayTime(this.TIME_delayUntilNextShot))
        );
        ball.runAction(ballAnimation);
    },

    triggerEnemy : function() {
        var ballHitsEnemy = new cc.Sequence(
            new cc.Spawn(cc.RotateBy.create(this.TIME_enemyOut, 720), cc.MoveTo.create(this.TIME_enemyOut, this.enemyStartPos)),
            new cc.DelayTime(this.TIME_enemyReentrantDelay),
            cc.MoveBy.create(this.TIME_enter, cc.p(-100, 0))
        );
        this.enemy.runAction(ballHitsEnemy);
    }

});
        */