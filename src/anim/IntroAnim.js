/**
 * Created by shirkan on 12/3/14.
 */

import ui.ImageView as ImageView;
import animate;
import src.anim.Ball as Ball;
import src.anim.Player as Player;
import src.anim.Enemy as Enemy;
import src.anim.Goal as Goal;

exports = Class(ImageView, function(supr) {
    this.init = function (opts) {
        var map = PiuPiuGlobals.commonGrassMap
        opts = merge(opts, {
            image: map
        });
        supr(this, 'init', [opts]);

        this.player = new Player({parent: this});
        this.enemy1 = new Enemy({parent: this});
        this.enemy2 = new Enemy({parent: this});
        this.enemy3 = new Enemy({parent: this});
        this.ball = new Ball({parent: this});
        this.goal = new Goal({parent: this});
        this.BALL_SCALE = 0.7;

        this.reset();
    };
    
    this.reset = function () {
        this.Y_FLOOR = PiuPiuGlobals.winSize.height - 20;

        //  Init
        this.player.style.x = -this.player.style.width;
        this.player.style.y = this.Y_FLOOR - this.player.style.height;
        this.xPlayerStanding = PiuPiuGlobals.winSize.width * 0.1;

        this.ball.style.x = -this.ball.style.width;
        this.ball.style.y = this.Y_FLOOR - this.ball.style.height;
        this.ball.style.anchorX = this.ball.style.width / 2;
        this.ball.style.anchorY = this.ball.style.height / 2;
        this.ball.style.scale = this.BALL_SCALE;

        this.playerBallGap = this.player.style.width - this.ball.style.width;
        this.xBallStanding = this.xPlayerStanding + this.playerBallGap;

        this.enemy1.style.x = PiuPiuGlobals.winSize.width;
        this.enemy1.style.y = - this.enemy1.style.height;

        this.enemy2.style.x = PiuPiuGlobals.winSize.width;
        this.enemy2.style.y = 0;

        this.enemy3.style.x = PiuPiuGlobals.winSize.width - this.enemy3.style.width;
        this.enemy3.style.y = - this.enemy3.style.height;

        this.goal.style.x = PiuPiuGlobals.winSize.width - this.goal.style.width;
        this.goal.style.y = this.Y_FLOOR - this.goal.style.height;
    }

    this.restart = function () {

        //  Animate
        animate(this.player).now({x : this.xPlayerStanding}, 2000, animate.easeOut);
        animate(this.ball).now({x : this.xBallStanding, r : Math.PI * 8}, 2000, animate.easeOut).
            then({x: this.goal.style.x + this.ball.style.width * this.BALL_SCALE, y: this.goal.style.y + this.ball.style.height / 2 * this.BALL_SCALE, r: Math.PI * 6}, 1000, animate.linear).
            then({x: this.goal.style.x + this.goal.style.width * 0.5, y: this.goal.style.y + this.goal.style.height / 2, r: Math.PI * 3}, 500, animate.linear).
            then({y: this.Y_FLOOR - this.ball.style.height, r: Math.PI * 3}, 2000, animate.linear);
        animate(this.enemy1).wait(7000).then({x : PiuPiuGlobals.winSize.width - this.enemy1.style.width, y:0}, 2000, animate.easeOut);
        animate(this.enemy2).wait(7000).then({x : PiuPiuGlobals.winSize.width - this.enemy2.style.width, y:this.enemy2.style.height}, 2000, animate.easeOut);
        animate(this.enemy3).wait(7000).then({x : PiuPiuGlobals.winSize.width - this.enemy3.style.width * 2, y:0}, 2000, animate.easeOut);

        this.timer = setTimeout(function () { GC.app.emit("intro:end")}, 9000);
        this.on("InputSelect", bind(this, function () {
            clearTimeout(this.timer);
            GC.app.emit("intro:end");
        }));
    };
});
