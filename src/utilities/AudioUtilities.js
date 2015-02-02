/**
 * Created by shirkan on 1/18/15.
 */

import AudioManager;
import src.data.resources;
import src.data.globals;

var soundManager = new AudioManager({
	path: "resources/sounds",
	files: {
		achievement_complete: {
			volume: 1
		},
		ballHitGround: {
			volume: 1
		},
		headshot: {
			volume: 1
		},
		machineGun: {
			volume: 1
		},
		piu: {
			volume: 1
		},
		ohedNichnasLamigrash: {
			volume: 1
		},
		shaar: {
			volume: 1
		},
		hineZeBa: {
			volume: 1
		}
	}
});

var musicManager = new AudioManager({
	path:"resources/music",
	files: {
		music_arsenal1: {
			background: true,
			loop: false
		},
		music_athletico1: {
			background: true,
			loop: false
		},
		music_barca1: {
			background: true,
			loop: false
		},
		music_barca2: {
			background: true,
			loop: false
		},
		music_barca3: {
			background: true,
			loop: false
		},
		music_bayern1: {
			background: true,
			loop: false
		},
		music_boca1: {
			background: true,
			loop: false
		},
		music_boca2: {
			background: true,
			loop: false
		},
		music_chelsea1: {
			background: true,
			loop: false
		},
		music_chelsea2: {
			background: true,
			loop: false
		},
		music_dortmund1: {
			background: true,
			loop: false
		},
		music_hapoel1: {
			background: true,
			loop: false
		},
		music_juve1: {
			background: true,
			loop: false
		},
		music_juve2: {
			background: true,
			loop: false
		},
		music_liverpool1: {
			background: true,
			loop: false
		},
		music_liverpool2: {
			background: true,
			loop: false
		},
		music_maccabi1: {
			background: true,
			loop: false
		},
		music_maccabi2: {
			background: true,
			loop: false
		},
		music_mancity1: {
			background: true,
			loop: false
		},
		music_manutd1: {
			background: true,
			loop: false
		},
		music_manutd2: {
			background: true,
			loop: false
		},
		music_manutd3: {
			background: true,
			loop: false
		},
		music_milan1: {
			background: true,
			loop: false
		},
		music_olympiakos1: {
			background: true,
			loop: false
		},
		music_pana1: {
			background: true,
			loop: false
		},
		music_paok1: {
			background: true,
			loop: false
		},
		music_psg1: {
			background: true,
			loop: false
		},
		music_realmadrid1: {
			background: true,
			loop: false
		},
		music_realmadrid2: {
			background: true,
			loop: false
		},
		music_realmadrid3: {
			background: true,
			loop: false
		}
	}
});

exports
{
	//  Music & sounds
	playSound = function ( sound, force ) {
		if (force || PiuPiuGlobals.soundEnabled) {
			soundManager.play(sound);
		}
	};

	stopAllSounds = function () {
		for (var key in soundManager.files) {
			soundManager.stop(key);
		}
	};

	playMusic = function (musicFile) {
		if (!PiuPiuGlobals.soundEnabled) {
			stopMusic();
			return;
		}

		//  Check if requesting to play a certain musicFile
		if (typeof musicFile != "string") {
			//  No musicFile was supplied
			musicFile = "";

			//  Check if other file is playing, return if yes
			if (musicManager.isPlaying(PiuPiuGlobals.currentMusicFile)) {
				return;
			}

			//  No music file is playing, randomly select a file
			PiuPiuGlobals.currentMusicFile = PiuPiuConsts.musicFiles[randomNumber(0, PiuPiuConsts.musicFiles.length, true)];
		} else {
			//  Check if musicFile is playing
			if (musicManager.isPlaying(musicFile)) {
				return;
			}

			//  Force playing musicFile
			PiuPiuGlobals.currentMusicFile = musicFile;
		}

		musicManager.setMusicMuted(false);
		musicManager.play(PiuPiuGlobals.currentMusicFile, {loop: false});

		//PiuPiuGlobals.musicScheduler = setTimeout(playMusic, musicManager.getDuration(PiuPiuGlobals.currentMusicFile));
	};

	stopMusic = function () {
		musicManager.stop(PiuPiuGlobals.currentMusicFile);
		clearTimeout(PiuPiuGlobals.musicScheduler);
	};

	startMusic = function () {
		playMusic();
	};

	setMusicVolume = function ( val ) {
		for (var key in musicManager.files) {
			musicManager.setVolume(key, val);
		}
	};
}