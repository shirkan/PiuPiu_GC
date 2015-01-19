/**
 * Created by shirkan on 1/18/15.
 */

import AudioManager;
import src.data.resources;
import src.data.globals;

exports
{
	var audiomanager = new AudioManager({
		path:"resources/music",
		files: {
			sound_achievement_complete: {
				path: res.sound_achievement_complete
			},
			sound_ballHitGround: {
				path: res.sound_ballHitGround
			},
			sound_headshot: {
				path: res.sound_headshot
			},
			sound_machineGun: {
				path: res.sound_machineGun
			},
			sound_piu: {
				path: res.sound_piu
			},
			sound_ohedNichnasLamigrash: {
				path: res.sound_ohedNichnasLamigrash
			},
			sound_shaar: {
				path: res.sound_shaar
			},
			sound_hineZeBa: {
				path: res.sound_hineZeBa
			},

			arsenal1: {
				background: true
			},

			music_arsenal1: {
				path: res.music_arsenal1,
				background: true
			},
			music_athletico1: {
				path: res.music_athletico1,
				background: true
			},
			music_barca1: {
				path: res.music_barca1,
				background: true
			},
			music_barca2: {
				path: res.music_barca2,
				background: true
			},
			music_barca3: {
				path: res.music_barca3,
				background: true
			},
			music_bayern1: {
				path: res.music_bayern1,
				background: true
			},
			music_boca1: {
				path: res.music_boca1,
				background: true
			},
			music_boca2: {
				path: res.music_boca2,
				background: true
			},
			music_chelsea1: {
				path: res.music_chelsea1,
				background: true
			},
			music_chelsea2: {
				path: res.music_chelsea2,
				background: true
			},
			music_dortmund1: {
				path: res.music_dortmund1,
				background: true
			},
			music_hapoel1: {
				path: res.music_hapoel1,
				background: true
			},
			music_juve1: {
				path: res.music_juve1,
				background: true
			},
			music_juve2: {
				path: res.music_juve2,
				background: true
			},
			music_liverpool1: {
				path: res.music_liverpool1,
				background: true
			},
			music_liverpool2: {
				path: res.music_liverpool2,
				background: true
			},
			music_maccabi1: {
				path: res.music_maccabi1,
				background: true
			},
			music_maccabi2: {
				path: res.music_maccabi2,
				background: true
			},
			music_mancity1: {
				path: res.music_mancity1,
				background: true
			},
			music_manutd1: {
				path: res.music_manutd1,
				background: true
			},
			music_manutd2: {
				path: res.music_manutd2,
				background: true
			},
			music_manutd3: {
				path: res.music_manutd3,
				background: true
			},
			music_milan1: {
				path: res.music_milan1,
				background: true
			},
			music_olympiakos1: {
				path: res.music_olympiakos1,
				background: true
			},
			music_pana1: {
				path: res.music_pana1,
				background: true
			},
			music_paok1: {
				path: res.music_paok1,
				background: true
			},
			music_psg1: {
				path: res.music_psg1,
				background: true
			},
			music_realmadrid1: {
				path: res.music_realmadrid1,
				background: true
			},
			music_realmadrid2: {
				path: res.music_realmadrid2,
				background: true
			},
			music_realmadrid3: {
				path: res.music_realmadrid3,
				background: true
			}
		}
	});

	//  Music & sounds
	playSound = function ( sound, force ) {
		if (force || PiuPiuGlobals.soundEnabled) {
			audiomanager.play(sound);
		}
	}

	stopAllSounds = function () {
		for (var key in audiomanager.files) {
			if (key.indexof("sound_") == 0) {
				audiomanager.stop(key);
			}
		}
	}

	playMusic = function (musicFile) {
		if (!PiuPiuGlobals.soundEnabled) {
			stopMusic();
			return;
		}

		if (audiomanager.isPlaying(musicFile)) {
			return;
		}

		if (typeof musicFile != "string") {
			musicFile = "";
		}

		if (audiomanager.isPlaying(PiuPiuGlobals.currentMusicFile)) {
			return;
		}

		if (!musicFile) {
			musicFile = PiuPiuConsts.musicFiles[randomNumber(0, PiuPiuConsts.musicFiles.length, true)];
		}

		PiuPiuGlobals.currentMusicFile = "arsenal1";
		audiomanager.setMusicMuted(false);
		audiomanager.play("arsenal1");
		//setTimeout(playMusic, audiomanager.getDuration(PiuPiuGlobals.currentMusicFile));
	}

	stopMusic = function () {
		audiomanager.stop(PiuPiuGlobals.currentMusicFile);
		//for (var key in audiomanager.files) {
		//	if (key.indexof("music_") == 0) {
		//		audiomanager.stop(key);
		//	}
		//}
	}

	startMusic = function () {
		playMusic();
	}

	setMusicVolume = function ( val ) {
		for (var key in audiomanager.files) {
			if (key.indexof("music_") == 0) {
				audiomanager.setVolume(key, val);
			}
		}
	}
}