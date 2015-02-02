/**
 * Created by shirkan on 1/5/15.
 */

import ui.ImageView as ImageView;
import animate;
import src.anim.LevelText as LevelText;
import src.anim.Player as Player;
import src.anim.Enemy as Enemy;
import src.anim.Bullet as Bullet;

exports = Class(ImageView, function(supr) {
    this.init = function (opts) {
        var map = PiuPiuGlobals.commonGrassMap
        opts = merge(opts, {
            image: map
        });
        supr(this, 'init', [opts]);

        //  Create LevelText
        this.levelText = new LevelText({parent: this});
        //  Hold levels animations here
        this.levels = [null, this.animateLevel1, this.animateLevel2, this.animateLevel3, this.animateLevel4];
        
        //  Create objects required here
        this.player = new Player({parent: this});
        this.enemy = new Enemy({parent: this});
        this.bullet = new Bullet({parent: this});
        this.reset();

        this.on("InputSelect", bind(this, function () {
            clearTimeout(this.timer);
            GC.app.emit("cutscene:end");
        }));
    };

    this.animateLevel = function () {
        const ANIM_TIMEOUT = 10000;
        this.levelText.show();

        //  Invoke animation function
        (this.levels[PiuPiuGlobals.currentLevel]).call(this);
        this.timer = setTimeout(function () { GC.app.emit("cutscene:end")}, ANIM_TIMEOUT);
    };

    this.reset = function () {
        this.player.hide();
        this.enemy.hide();
        this.bullet.hide();
        this.levelText.hide();

        this.clearAll();
    };

    this.clearAll = function () {
        animate(this.player).clear();
        animate(this.enemy).clear();
        animate(this.bullet).clear();
        clearTimeout(this.timer);
    };

    this.animateLevel1 = function () {
        //  consts
        const Y_FLOOR = PiuPiuGlobals.winSize.height - PiuPiuConsts.fontSizeSmall;
        const ENTERING_TIME = 1500;
        const SHOOT_TIME = 800;

        this.clearAll();

        //  Init
        this.player.style.x = -this.player.style.width;
        this.player.style.y = Y_FLOOR - this.player.style.height;
        this.player.show();
        var xPlayerStanding = PiuPiuGlobals.winSize.width * 0.2;

        this.enemy.style.x = PiuPiuGlobals.winSize.width;
        this.enemy.style.y = Y_FLOOR - this.enemy.style.height;
        this.enemy.show();
        var xEnemyStanding = PiuPiuGlobals.winSize.width * 0.9 - this.enemy.style.width;

        this.bullet.style.x = xPlayerStanding + this.player.style.width;
        this.bullet.style.y = this.player.style.y + this.player.style.height * 0.3;

        //  Animate
        animate(this.player).now({x : xPlayerStanding}, ENTERING_TIME, animate.easeOut);
        animate(this.enemy).now({x : xEnemyStanding}, ENTERING_TIME, animate.easeOut);
        animate(this.bullet).wait(ENTERING_TIME).then(
            bind(this, function() {
                this.bullet.show();
                playSound("piu");
            })).then(
            {x: xEnemyStanding + this.enemy.style.width *0.3}, SHOOT_TIME).then(
            bind(this, function () {
                this.bullet.hide();
                this.enemy.hide();
            })
        );

    };

    this.animateLevel2 = function () {

    };
    this.animateLevel3 = function () {

    };
    this.animateLevel4 = function () {

    };
});
