/**
 * Created by shirkan on 1/19/15.
 */

import ui.ImageView as ImageView;
import ui.TextView as TextView;
import ui.View as View;

import entities.Entity as Entity;
import entities.EntityPool as EntityPool;
import ui.View;
import animate;

import src.game.Status as Status;
import src.game.Player as Player;
import src.game.Hands as Hands;
import src.game.Bullets as Bullets;
import src.game.Enemies as Enemies;

exports = Class(ImageView, function (supr) {
	this.init = function (opts) {
		var map = randomMap();

		opts = merge(opts, {
			name: "Game",
			x: 0,
			y: 0,
			image: map
		});

		supr(this, 'init', [opts]);

		this.build();
	};

	this.build = function () {
		//  Create view to put all elements on
		this.gameLayer = new View({
			parent: this,
			width: PiuPiuGlobals.winSize.width,
			height: PiuPiuGlobals.winSize.height
		});

		//  Add Status view
		this.status = new Status({ parent: this });
		//  Add player
		this.player = new Player({ parent: this.gameLayer });
		//  Add hands
		this.hands = new Hands({ parent: this.gameLayer });
		//  Prepare bullets
		this.bullets = new Bullets({ parent: this.gameLayer });
		//  Prepare enemies
		this.enemies = new Enemies({ parent: this.gameLayer });
		this.invokeEnemy();

		//  Init settings
		this.initSettings();

		//  Catch clicks
		this.on('InputSelect', function (evt, pt) {
			this.shootBullet(pt);
			this.invokeEnemy();
		});
	};

	this.initSettings = function () {
		PiuPiuGlobals.livesLeft = 2;
		this.status.updateLives(PiuPiuGlobals.livesLeft);
	};

	this.invokeEnemy = function () {
		setTimeout(bind(this, function () {
			this.enemies.spawnEnemy(1000,500);
		}), 2000);
	};

	this.shootBullet = function (pt) {
		//  Angle limits - goes crazy beyond these angles
		//if (pos.x < PiuPiuConsts.handsAnchor.x) {
		//	return false;
		//}

		var sound = res.sound_piu;

		var bulletData = calculateBulletTrigonometry(pt);
		bulletData.push(sound);

		this.addBullet(bulletData);
		PiuPiuGlobals.totalBulletsFired++;
	};

	this.addBullet = function ( bulletData ) {
		var bulletStartPoint = bulletData[0];
		var bulletPathLengths = bulletData[1];
		var endAngle = bulletData[2];
		var sound = bulletData[3];

		//var bullet = new Bullet( this, endPoint, bulletStartPoint, endAngle);
		this.bullets.spawnBullet(bulletStartPoint, bulletPathLengths, endAngle);
		playSound(sound);

		this.hands.rotateHands(endAngle);
	};

	this.onBulletEnemyCollision = function (bullet, enemy) {
		enemy.release();
		bullet.release();

		//  Update stats
		PiuPiuLevelSettings.enemiesVanished++;
		PiuPiuGlobals.currentScore += (PiuPiuGlobals.currentPointsMultiplier * PiuPiuConsts.pointsPerEnemyKill);
		//this.statusLayer.updatePoints(PiuPiuGlobals.currentScore);

		PiuPiuGlobals.totalPoints += (PiuPiuGlobals.currentPointsMultiplier * PiuPiuConsts.pointsPerEnemyKill);
		PiuPiuGlobals.totalEnemyKilled++;

		this.status.updateScore(PiuPiuGlobals.currentScore);
	};

	this.onEnemyPlayerCollision = function (enemy, player) {
		LOG("Enemy hit player");
		enemy.release();

		//  Update level settings
		PiuPiuLevelSettings.enemiesVanished++;
		PiuPiuGlobals.livesLeft--;
		if (PiuPiuGlobals.livesLeft < 0) {
			this.endGame( true, false);

		} else {
			this.status.updateLives(PiuPiuGlobals.livesLeft);
		}
	};

	this.endGame = function () {

	};

	this.tick = function(dt) {
		// speed up or slow down the passage of time - TODO: understand what is 100
		dt = Math.min(PiuPiuGlobals.currentUpdateRate * dt, 100);

		// update entities
		//this.player.update(dt);
		this.bullets.update(dt);
		this.enemies.update(dt);

		//  Check collisions detections
		// collide bullets with enemies
		this.bullets.onFirstPoolCollisions(this.enemies, this.onBulletEnemyCollision, this);
		this.enemies.onFirstCollision(this.player, this.onEnemyPlayerCollision, this);

		// players vertical movement determines view offset for everything
		//var screenOffsetY = -this.player.getScreenY();
		//this.elementLayer.style.y = screenOffsetY;
		//this.parallax.update(0, screenOffsetY);
		//
		//// collide bullets with enemies
		//this.bullets.onFirstPoolCollisions(this.enemies, this.onBulletHit, this);
		//
		//// collide enemies with player
		//this.enemies.onFirstCollision(this.player, this.onGameOver, this);
		//
		//// update particles
		//this.particles.runTick(dt);
	};
});
