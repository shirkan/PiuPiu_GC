/**
 * Created by shirkan on 12/31/14.
 */
import ui.View as View;
import animate;
import src.anim.Ball as Ball;
import src.anim.Ballview as BallView;
import src.anim.Player as Player;
import src.anim.Enemy as Enemy;

/** @const */ var CIRCLE = Math.PI * 2;

exports = Class(View, function(supr) {
    this.init = function (opts) {
        opts = merge(opts, {zIndex: 10});
        supr(this, 'init', [opts]);

        this.player = new Player({parent: this});
        this.enemy = new Enemy({parent: this});
        this.ballView = new BallView({parent: this});
        this.ball = new Ball({parent: this.ballView, zIndex: 10});

        this.Y_FLOOR = PiuPiuGlobals.winSize.height - PiuPiuConsts.fontSizeSmall;
        this.ENEMY_ENTER_TIME = 500;
        this.PLAYER_ENTER_TIME = 2000;
        this.SHOOT_TIME = 300;
        this.ENEMY_SPINNING_TIME = 500;
        this.ENEMY_WAITING_TIME = 3000;
        this.ANIMATION_PART_A = this.SHOOT_TIME / (this.ENEMY_ENTER_TIME + this.SHOOT_TIME);
        this.BALL_HALF_CIRCLE_TIME = 2000;
        this.BALL_SIZE = 32;

        this.enemy.run();

        this.resetAnimation();
    };

    this.clearAll = function () {
        animate(this.player).clear();
        animate(this.ballView).clear();
        animate(this.ball).clear();
        animate(this.enemy).clear();
    };

    this.resetAnimation = function () {
        this.isRunning = false;
        this.clearAll();

        //  Init
        this.player.style.x = -this.player.style.width;
        this.player.style.y = this.Y_FLOOR - this.player.style.height;
        this.xPlayerStanding = PiuPiuGlobals.winSize.width * 0.1;
        
        this.ballView.style.x = -(this.ballView.style.width + this.player.style.width / 2);
        this.ballView.style.y = this.Y_FLOOR - this.ballView.style.height;
        this.ballView.style.r = 0;
        this.ballView.style.anchorX = this.ballView.style.width / 2;
        this.ballView.style.anchorY = this.ballView.style.height / 2;

        this.ball.style.anchorX = this.ball.style.width / 2;
        this.ball.style.anchorY = this.ball.style.height / 2;
        this.ball.style.scale = 0.7;

        var playerBallGap = this.player.style.width / 2;
        this.xBallStanding = this.xPlayerStanding + playerBallGap;

        this.enemy.style.x = PiuPiuGlobals.winSize.width;
        this.enemy.style.y = this.Y_FLOOR - this.enemy.style.height * 0.9;
        this.enemy.style.r = 0;
        this.enemy.style.anchorX = this.enemy.style.width / 2;
        this.enemy.style.anchorY = this.enemy.style.height / 2;
        this.xEnemyStanding = PiuPiuGlobals.winSize.width - (this.xPlayerStanding * 2) - this.enemy.style.width;
    };

    this.restartAnimation = function () {
        this.clearAll();
        this.isRunning = true;
        this.enemy.run();

        //  Animate
        animate(this.player).now({x : this.xPlayerStanding}, this.PLAYER_ENTER_TIME, animate.easeOut);
        animate(this.ballView).now({x : this.xBallStanding}, this.PLAYER_ENTER_TIME, animate.easeOut).
            then(ballAnimation.bind(this));
        animate(this.ball).now({r: CIRCLE * 4}, this.PLAYER_ENTER_TIME, animate.easeOut);
        animate(this.enemy).now({x : this.xEnemyStanding}, this.PLAYER_ENTER_TIME + this.SHOOT_TIME, animate.linear);
            //then(enemyAnimation.bind(this));
    };

    ballAnimation = function () {
        if (!this.isRunning) {
            return;
        }

        //  Enemy's head
        var p1 = makePoint(this.xEnemyStanding + this.enemy.style.width * 0.5, this.enemy.style.y);

        //  Player's legs
        var p2 = makePoint(this.xBallStanding, this.Y_FLOOR - this.ballView.style.height);

        animate(this.ball).now({r: CIRCLE * 3}, this.SHOOT_TIME, animate.linear).
        then({r: CIRCLE * 10}, this.BALL_HALF_CIRCLE_TIME * 1.2, animate.easeOut);

        animate(this.ballView).clear().
            now({x: p1.x, y: p1.y}, this.SHOOT_TIME, animate.linear).
            then(bind(this, function () {
                if (this.isRunning) {
                    playSound("ballHitGround");
                    enemyAnimation.call(this);
                    this.ballView.style.anchorY = (p2.y - p1.y + this.BALL_SIZE) / 2;
                    this.ballView.style.anchorX = (p2.x - p1.x + this.BALL_SIZE) / 2;
                }
            })).
            then({r: CIRCLE / -2}, this.BALL_HALF_CIRCLE_TIME, animate.linear).
            then(bind(this, function() {
                if (this.isRunning) {
                    this.ballView.style.x = p2.x;
                    this.ballView.style.y = p2.y;
                    this.ballView.style.r = 0;
                    this.ballView.style.anchorY = 0;
                    this.ballView.style.anchorX = 0;
                }
            }));
    };
    
    enemyAnimation = function () {
        if (!this.isRunning) {
            return;
        }

        this.enemy.style.r = 0;

        animate(this.enemy).clear().
            then({x: PiuPiuGlobals.winSize.width, r: CIRCLE * 2}, this.ENEMY_SPINNING_TIME, animate.linear).
            wait(this.ENEMY_WAITING_TIME).
            then({x : this.xEnemyStanding + this.ANIMATION_PART_A * (PiuPiuGlobals.winSize.width - this.xEnemyStanding)}, this.ENEMY_ENTER_TIME, animate.linear).
            then(bind(this, function () {
                if (this.isRunning) {
                    ballAnimation.call(this);
                }
            })).
            then({x : this.xEnemyStanding}, this.SHOOT_TIME, animate.linear);
    };
});
