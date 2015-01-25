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
import src.game.Powerups as Powerups;

exports = Class(ImageView, function (supr) {
	this.init = function (opts) {

		opts = merge(opts, {
			name: "Game",
			x: 0,
			y: 0
		});

		supr(this, 'init', [opts]);

		this.build();
	};

	this.build = function () {
		//  Create view to put all elements on
		this.gameLayer = new View({
			parent: this,
			width: PiuPiuGlobals.winSize.width,
			height: PiuPiuGlobals.winSize.height,
			zIndex: PiuPiuConsts.gameZIndex
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
		//  Prepare powerups
		this.powerups = new Powerups({ parent: this.gameLayer });

		//  Init settings
		//this.initLevel();

		//  Catch clicks
		this.on('InputSelect', function (evt, pt) {
			this.shootBullet(pt);
			this.invokeEnemy();
		});
	};

	//  Init Level
	this.initLevel = function () {
		var map = randomMap();
		this.style._view.setImage(map);

		this.machineGunEnd();
		this.captainEnd();
		this.stopwatchEnd();
		this.canContinueToNextScene = false;

		if (PiuPiuGlobals.currentLevel == 1) {
			PiuPiuGlobals.currentScore = 0;
			PiuPiuGlobals.livesLeft = PiuPiuConsts.livesOnGameStart;
			playSound(res.sound_ohedNichnasLamigrash);
		}

		this.status.updateLives(PiuPiuGlobals.livesLeft);
		/*
		//  Init & start enemies spwaning
		this.enemySM.init(this, this.spawnEnemy, PiuPiuLevelSettings.enemiesSpawnIntervalType,
			PiuPiuLevelSettings.enemiesSpawnInterval, PiuPiuLevelSettings.enemiesSpawnIntervalMin,
			PiuPiuLevelSettings.enemiesSpawnIntervalMax);
		this.enemySM.start();

		//  Init $ start powerups spawning
		if (PiuPiuLevelSettings.powerupsTypes == "all") {
			PiuPiuLevelSettings.powerupsTypes = PiuPiuConsts.powerupTypes;
		}
		this.powerupSM.init(this, this.spawnPowerup, PiuPiuLevelSettings.powerupsSpawnIntervalType,
			PiuPiuLevelSettings.powerupsSpawnInterval, PiuPiuLevelSettings.powerupsSpawnIntervalMin,
			PiuPiuLevelSettings.powerupsSpawnIntervalMax);
		this.powerupSM.start();
		*/

		//TODO: This should be removed
		this.invokeEnemy();

	};

	//  Spawnings
	this.invokeEnemy = function () {
		setTimeout(bind(this, function () {
			this.enemies.spawnEnemy(1000,500);
			this.powerups.spawnPowerup();
		}), 2000);
	};

	this.shootBullet = function (pt) {
		//  Angle limits - goes crazy beyond these angles
		if (pt.x < PiuPiuGlobals.handsAnchor.x) {
			return false;
		}

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

	//  Collisions
	this.onBulletEnemyCollision = function (bullet, enemy) {
		enemy.release();
		bullet.release();

		//  Update stats
		PiuPiuLevelSettings.enemiesVanished++;
		PiuPiuGlobals.totalEnemyKilled++;

		if (enemy.hitType == hitType.BulletEnemyHead) {
			//  Headshot
			PiuPiuGlobals.currentScore += (PiuPiuGlobals.currentPointsMultiplier * PiuPiuConsts.pointsPerEnemyHeadShot);
			PiuPiuGlobals.totalPoints += (PiuPiuGlobals.currentPointsMultiplier * PiuPiuConsts.pointsPerEnemyHeadShot);

			//  Display headshot in status
			this.status.displayHeaderMessage("Headshot!");
			//  Play headshot sound
		} else if (enemy.hitType == hitType.BulletEnemy) {
			//  Body shot
			PiuPiuGlobals.currentScore += (PiuPiuGlobals.currentPointsMultiplier * PiuPiuConsts.pointsPerEnemyKill);
			PiuPiuGlobals.totalPoints += (PiuPiuGlobals.currentPointsMultiplier * PiuPiuConsts.pointsPerEnemyKill);
		}

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

	this.onBulletPowerupCollision = function (bullet, powerup) {
		bullet.release();
		powerup.release();
		PiuPiuGlobals.totalPowerUps++;
		eval((powerup.getData()).callback);
	};

	//  Powerups handling
	this.machineGunStart = function () {
		if (this.isMachineGunMode) {
			clearTimeout(this.machineGunEnd);
		} else {
			this.isMachineGunMode = true;
			this.updateHandsType();
		}
		setTimeout(bind(this, this.machineGunEnd), PiuPiuConsts.powerupMachineGunPeriod);
	};

	this.machineGunEnd = function () {
		LOG("machineGunEnd");
		this.isMachineGunMode = false;
		this.updateHandsType();
	};

	this.addLife = function () {
		PiuPiuGlobals.livesLeft++;
		this.status.updateLives(PiuPiuGlobals.livesLeft);
	};

	this.captainStart = function () {
		if (this.isCaptainMode) {
			clearTimeout(this.captainEnd);
		} else {
			this.isCaptainMode = true;
			PiuPiuGlobals.currentPointsMultiplier = PiuPiuConsts.powerupCaptainMultiplier;
			this.updateHandsType();
		}
		setTimeout(bind(this, this.captainEnd), PiuPiuConsts.powerupCaptainPeriod);
	};

	this.captainEnd = function () {
		LOG("captainEnd");
		this.isCaptainMode = false;
		PiuPiuGlobals.currentPointsMultiplier = PiuPiuConsts.pointsNormalMultiplier;
		this.updateHandsType();
	};

	this.stopwatchStart = function () {
		LOG("stopwatchStart");
	};

	this.stopwatchEnd = function () {
		LOG("stopwatchEnd");
	};

	this.updateHandsType = function () {
		if (this.isMachineGunMode) {
			//  Machine Gun mode on
			if (this.isCaptainMode) {
				//  Captain mode on
				this.hands.setMachineGunCaptain();
			} else {
				//  Captain Mode off
				this.hands.setMachineGun();
			}
		} else {
			//  Machine Gun mode off
			if (this.isCaptainMode) {
				//  Captain mode on
				this.hands.setCaptain();
			} else {
				//  Captain Mode off
				this.hands.setNormal();
			}
		}
	};

	//  Game endings
	this.endGame = function () {

	};

	this.levelCompleted = function () {

	};

	this.tick = function(dt) {
		// speed up or slow down the passage of time - TODO: understand what is 100
		dt = Math.min(PiuPiuGlobals.currentUpdateRate * dt, 100);
	LOG("dt is " + dt);
		// update entities
		//this.player.update(dt);
		this.bullets.update(dt);
		this.enemies.update(dt);

		//  Check collisions detections
		//  Collide bullets with enemies
		this.bullets.onFirstPoolCollisions(this.enemies, this.onBulletEnemyCollision, this);
		//  Collide bullets with powerups
		this.bullets.onFirstPoolCollisions(this.powerups, this.onBulletPowerupCollision, this);
		//  Collide enemies with player
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
