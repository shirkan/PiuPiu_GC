7/**
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
import src.game.Players as Players;
import src.game.Bullets as Bullets;
import src.game.Enemies as Enemies;
import src.game.Powerups as Powerups;
import src.views.Background as Background;

import src.utilities.SpawningMechanism as SpawningMechanism;

exports = Class(View, function (supr) {
	this.init = function (opts) {
		this.name = "GameView";
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

		this.bg = new Background({parent: this});

		//  Add Status view
		this.status = new Status({ parent: this });
		//  Add player
		this.players = new Players({ parent: this.gameLayer });
		this.player = this.players.spawnPlayer(0, (PiuPiuGlobals.winSize.height - PiuPiuConsts.playerHeight) / 2);
		//  Prepare bullets
		this.bullets = new Bullets({ parent: this.gameLayer });
		//  Prepare enemies
		this.enemies = new Enemies({ parent: this.gameLayer });
		//  Prepare powerups
		this.powerups = new Powerups({ parent: this.gameLayer });

7		//  Init SM
		this.enemySM = new SpawningMechanism();
		this.powerupSM = new SpawningMechanism();

		//  Register for "ViewDidAppear"
		this.on('ViewWillAppear', this.initLevel);

		//  Register for enemies completing dying animation
		this.on('enemyDied', bind(this, function() {
			this.doneAnimatingDeadEnemies++;
			this.checkLevelComplete();
		}));

		//  Set speed for BG & powerups movement
		this.BG_MOVE_SPEED = -3;
		this.POWERUP_MOVE_SPEED = 1;
	};

	//  Init Level
	this.initLevel = function () {
		//var map = randomMap();
		//this.style._view.setImage(map);

		this.bg.reset();
		this.machineGunEnd();
		this.captainEnd();
		this.stopwatchEnd();
		this.canContinueToNextScene = false;
		this.doneAnimatingDeadEnemies = 0;

		if (PiuPiuGlobals.currentLevel == 1) {
			PiuPiuGlobals.currentScore = 0;
			PiuPiuGlobals.livesLeft = PiuPiuConsts.livesOnGameStart;
			playSound(res.sound_ohedNichnasLamigrash);
		}

		this.status.updateLives(PiuPiuGlobals.livesLeft);
		this.status.updateScore(PiuPiuGlobals.currentScore);

		//  Init & start enemies spwaning
		this.enemySM.init(this, this.spawnEnemy, PiuPiuLevelSettings.enemiesSpawnIntervalType,
			PiuPiuLevelSettings.enemiesSpawnInterval, PiuPiuLevelSettings.enemiesSpawnIntervalMin,
			PiuPiuLevelSettings.enemiesSpawnIntervalMax);

		//  Init $ start powerups spawning
		if (PiuPiuLevelSettings.powerupsTypes == "all") {
			PiuPiuLevelSettings.powerupsTypes = PiuPiuConsts.powerupTypes;
		}
		this.powerupSM.init(this.powerups, this.powerups.spawnPowerup, PiuPiuLevelSettings.powerupsSpawnIntervalType,
			PiuPiuLevelSettings.powerupsSpawnInterval, PiuPiuLevelSettings.powerupsSpawnIntervalMin,
			PiuPiuLevelSettings.powerupsSpawnIntervalMax);

		//  Catch clicks
		this.on('InputSelect', function (evt, pt) {
			this.shootBullet(pt);
		});

		this.on('InputMove', function (evt, pt) {
			if (this.isMachineGunMode) {
				this.shootBullet(pt);
			}
		});
	};

	this.startLevel = function () {
		this.enemySM.start();
		this.powerupSM.start();
		this.player.runWithRotatableHands();
		this.gameIsRunning = true;
	};



	//  Spawnings
	this.spawnEnemy = function () {
		if (PiuPiuLevelSettings.totalEnemiesToSpawn > 0) {
			this.enemies.spawnEnemy(this);
			PiuPiuLevelSettings.totalEnemiesToSpawn--;
			this.enemySM.step();
		} else {
			this.enemySM.stop();
		}
	};

	this.shootBullet = function (pt) {
		//  Angle limits - goes crazy beyond these angles
		if (pt.x < PiuPiuGlobals.handsAnchor.x) {
			return false;
		}

		var sound = this.isMachineGunMode ? "machineGun" : "piu";

		var bulletData = calculateBulletTrigonometry(pt);
		bulletData.push(sound);

		this.addBullet(bulletData);
		PiuPiuGlobals.totalBulletsFired++;
	};

	this.addBullet = function ( bulletData ) {
		var bulletStartPoint = bulletData[0];
		var bulletPathLengths = bulletData[1];
		var endAngle = parseFloat(bulletData[2]);   //  This actually fixes a bug in iOS and it's a good practice whatsoever
		var sound = bulletData[3];

		this.bullets.spawnBullet(bulletStartPoint, bulletPathLengths, endAngle);
		playSound(sound);

		this.player.rotateHands(endAngle);
	};




	//  Collisions
	this.onBulletEnemyCollision = function (bullet, enemy) {
		bullet.release();

		//  Update stats
		PiuPiuLevelSettings.enemiesVanished++;
		PiuPiuGlobals.totalEnemyKilled++;

		if (enemy.hitType == hitType.BulletEnemyHead) {
			//  Headshot
			PiuPiuGlobals.currentScore += (PiuPiuGlobals.currentPointsMultiplier * PiuPiuConsts.pointsPerEnemyHeadShot);
			PiuPiuGlobals.totalPoints += (PiuPiuGlobals.currentPointsMultiplier * PiuPiuConsts.pointsPerEnemyHeadShot);
			PiuPiuGlobals.totalHeadShots++;

			//  Display headshot in status
			this.status.displayHeaderMessage("Headshot!");

			//  Play headshot sound
			playSound("headshot");

			//  animateDeath auto releases entity
			enemy.animateHeadshot();

		} else if (enemy.hitType == hitType.BulletEnemy) {
			//  Body shot
			PiuPiuGlobals.currentScore += (PiuPiuGlobals.currentPointsMultiplier * PiuPiuConsts.pointsPerEnemyKill);
			PiuPiuGlobals.totalPoints += (PiuPiuGlobals.currentPointsMultiplier * PiuPiuConsts.pointsPerEnemyKill);

			//  animateDeath auto releases entity
			enemy.animateDeath();
		}

		this.status.updateScore(PiuPiuGlobals.currentScore);
		//this.checkLevelComplete();
	};

	this.onEnemyPlayerCollision = function (enemy, player) {
		enemy.release();
		//  TODO: animate enemy hitting player
		this.doneAnimatingDeadEnemies++;

		//  Update level settings
		PiuPiuLevelSettings.enemiesVanished++;
		PiuPiuGlobals.livesLeft--;
		if (PiuPiuGlobals.livesLeft < 0) {
			this.endGame( true, false);
		} else {
			this.status.updateLives(PiuPiuGlobals.livesLeft);
			this.checkLevelComplete();
		}
	};

	this.onBulletPowerupCollision = function (bullet, powerup) {
		bullet.release();
		powerup.release();
		PiuPiuGlobals.totalPowerUps++;
		eval((powerup.getData()).callback);
		this.checkLevelComplete();
	};




	//  Powerups handling
	this.machineGunStart = function () {
		if (this.isMachineGunMode) {
			clearTimeout(this.machineGunTimeOut);
		} else {
			this.isMachineGunMode = true;
			this.updateHandsType();
		}
		this.machineGunTimeOut = setTimeout(bind(this, this.machineGunEnd), PiuPiuConsts.powerupMachineGunPeriod);
	};

	this.machineGunEnd = function () {
		this.isMachineGunMode = false;
		this.updateHandsType();
	};

	this.addLife = function () {
		PiuPiuGlobals.livesLeft++;
		this.status.updateLives(PiuPiuGlobals.livesLeft);
	};

	this.captainStart = function () {
		if (this.isCaptainMode) {
			clearTimeout(this.captainTimeOut);
		} else {
			this.isCaptainMode = true;
			PiuPiuGlobals.currentPointsMultiplier = PiuPiuConsts.powerupCaptainMultiplier;
			this.updateHandsType();
		}
		this.captainTimeOut = setTimeout(bind(this, this.captainEnd), PiuPiuConsts.powerupCaptainPeriod);
	};

	this.captainEnd = function () {
		this.isCaptainMode = false;
		PiuPiuGlobals.currentPointsMultiplier = PiuPiuConsts.pointsNormalMultiplier;
		this.updateHandsType();
	};

	this.stopwatchStart = function () {
		if (this.isStopwatchMode) {
			clearTimeout(this.stopwatchTimeOut);
		} else {
			this.isStopwatchMode = true;
		}
		PiuPiuGlobals.currentUpdateRate = PiuPiuConsts.powerupStopwatchUpdateRate;
		this.player.setSpeedSlow();
		this.stopwatchTimeOut = setTimeout(bind(this, this.stopwatchEnd), PiuPiuConsts.powerupStopwatchPeriod);
	};

	this.stopwatchEnd = function () {
		this.isStopwatchMode = false;
		PiuPiuGlobals.currentUpdateRate = PiuPiuConsts.normalUpdateRate;
		this.player.setSpeedNormal();
	};

	this.updateHandsType = function () {
		if (this.isMachineGunMode) {
			//  Machine Gun mode on
			if (this.isCaptainMode) {
				//  Captain mode on
				this.player.handsSetMachineGunCaptain();
			} else {
				//  Captain Mode off
				this.player.handsSetMachineGun();
			}
		} else {
			//  Machine Gun mode off
			if (this.isCaptainMode) {
				//  Captain mode on
				this.player.handsSetCaptain();
			} else {
				//  Captain Mode off
				this.player.handsSetNormal();
			}
		}
	};




	//  Game endings
	this.endGame = function () {
		//  Display "Game over" message
		this.status.displayGameOver();
		//  Stop playing and emit game end
		this.stopPlaying("game:end");
	};

	this.levelCompleted = function () {
		//  Display "Level completed" message
		this.status.displayLevelCompleted();
		//  Stop playing and emit game end
		this.stopPlaying("game:levelCompleted");
		PiuPiuGlobals.currentLevel++;
	};

	//  This function checks for completion conditions and invoke levelCompleted if all conditions apply
	this.checkLevelComplete = function () {
		if (PiuPiuLevelSettings.totalEnemiesToSpawn == 0 &&
			PiuPiuLevelSettings.enemiesVanished >= PiuPiuLevelSettings.totalEnemiesToKill &&
			this.doneAnimatingDeadEnemies == PiuPiuLevelSettings.totalEnemiesToKill) {
			//PiuPiuGlobals.gameState = GameStates.LevelCompleted;
			this.levelCompleted();
			return true;
		}
		return false;
	};

	this.stopPlaying = function ( nextEvent ) {
		//  Remove all enemies & powerups and stop spawning
		this.enemySM.stop();
		this.enemies.reset();
		this.powerupSM.stop();
		this.powerups.reset();

		this.player.stand();
		this.gameIsRunning = false;

		//  Handle moving to next scene
		setTimeout(bind(this, function () { this.canContinueToNextScene = true}), PiuPiuConsts.canContinueToNextSceneTimeOut);
		this.unsubscribe("InputSelect", this);
		this.on('InputSelect', function (evt, pt) {
			if (this.canContinueToNextScene) {
				this.canContinueToNextScene = false;
				this.status.emit('removeMessages');
				GC.app.emit(nextEvent);
			}
		});
	};



	//  Tick
	this.tick = function(dt) {
		// speed up or slow down the passage of time - TODO: understand what is 100
		dt = Math.min(PiuPiuGlobals.currentUpdateRate * dt, 100);
		//dt = 10;

		//  Need to always update bullets so they can disappear on level complete
		this.bullets.update(dt);
		this.powerups.update(PiuPiuGlobals.currentUpdateRate * this.POWERUP_MOVE_SPEED);

		if (this.gameIsRunning) {
			// update entities
			this.enemies.update(dt);

			//  Check collisions detections
			//  Collide bullets with enemies
			this.bullets.onFirstPoolCollisions(this.enemies, this.onBulletEnemyCollision, this);
			//  Collide bullets with powerups
			this.bullets.onFirstPoolCollisions(this.powerups, this.onBulletPowerupCollision, this);
			//  Collide enemies with player
			this.enemies.onFirstCollision(this.player, this.onEnemyPlayerCollision, this);

			// players vertical movement determines view offset for everything
			this.bg.update(PiuPiuGlobals.currentUpdateRate * this.BG_MOVE_SPEED, 0);
		}

		//// update particles
		//this.particles.runTick(dt);
	};
});
