/**
 * Created by shirkan on 2/10/15.
 */

import ..parse as parse;

exports
{
	var parseObjs = {};

	ParseInit = function () {
		parse.Parse.initialize("YfOISFZAxRmajUe9l6Sh3BL5lpekZfqBzRLFmCBU", "MxFgCdHsmFKt0VG2rwdxd1A1e7qpwRwHNFLpQcfS");
	};

	ParseGetObject = function ( objName ) {
		if (!parseObjs[objName]) {
			var newParseObject = parse.Parse.Object.extend(objName);
			parseObjs[objName] = new newParseObject();
		}
		return parseObjs[objName];
	};

	ParseUpdateLocalObjectID = function (world, objectId, whereFrom) {
		if (!PiuPiuGlobals["ParseMyObjectIDs." + world] ||
			PiuPiuGlobals["ParseMyObjectIDs." + world] != objectId){
			PiuPiuGlobals["ParseMyObjectIDs." + world] = objectId;
			saveData("ParseMyObjectIDs." + world, PiuPiuGlobals["ParseMyObjectIDs." + world]);
			LOG("ParseUpdateLocalObjectID: updated local objectID " + objectId + " for world " + world + " initiated from " + whereFrom);
		}
	};

	ParseSaveScore = function ( world ) {
		if (PiuPiuGlobals.FBmyUID == "") {
			LOG("ParsePostScore: no UID found");
			return;
		}
		var world = world || PiuPiuConsts.worlds[PiuPiuGlobals.currentWorld];
		var parseObj = ParseGetObject(world);
		var objectId = PiuPiuGlobals["ParseMyObjectIDs." + world];
		var data = {"objectId": objectId, "uid": PiuPiuGlobals.FBmyUID, "score": PiuPiuGlobals["highScores." + world]};

		parseObj.save(data, {
			success: function(obj) {
				LOG("ParseSaveData: data saved successfully: " + JSON.stringify(obj));
				ParseUpdateLocalObjectID(world, obj.id, "ParseSaveData");
			},
			error: function(obj, error) {
				LOG("ParseSaveData: failed saving obj: " + JSON.stringify(obj) + " with error: " + JSON.stringify(error));
				if (error.code == 101) {
					//  objectId error - clear objectId and retry. the correct objectId will be updated.
					PiuPiuGlobals["ParseMyObjectIDs." + world] = "";
					ParseSaveScore();
				}
			}
		});
	};

	ParseLoadMyScore = function (world, target, success_callback, error_callback) {
		if (PiuPiuGlobals.FBmyUID == "") {
			LOG("ParseLoadMyScore: no UID found");
			return;
		}

		var parseObj = parse.Parse.Object.extend(world);
		var query = new parse.Parse.Query(parseObj);
		query.equalTo("uid", PiuPiuGlobals.FBmyUID);
		query.first({
			success: function(obj) {
				LOG("ParseLoadMyScore: Successfully retrieved scores: " + JSON.stringify(obj));

				var id = obj.id;
				var score = obj.get('score');

				ParseUpdateLocalObjectID(world, id, "ParseLoadMyScore");

				PiuPiuGlobals["highScores." + world] = Math.max(PiuPiuGlobals["highScores." + world], score);
				saveData("highScores." + world, PiuPiuGlobals["highScores." + world]);

				target && success_callback && success_callback.call(target);
			},
			error: function(error) {
				//  It's possible that this is the first time the user logs in, we still need to refresh leaderboard
				LOG("ParseLoadMyScore: Error: " + error.code + " " + error.message);
				target && error_callback && error_callback.call(target);
			}
		});
	};

	ParseLoadAllScores = function (world, target, success_callback, error_callback) {

		PiuPiuGlobals.leaderboard[world] = PiuPiuGlobals.leaderboard[world] || {};

		var parseObj = parse.Parse.Object.extend(world);
		var query = new parse.Parse.Query(parseObj);
		query.descending("score");
		query.limit(PiuPiuConsts.FBleaderboardShowTop);
		query.find({
			success: function(results) {
				LOG("ParseLoadAllScores: Successfully retrieved " + results.length + " scores.");
				// Do something with the returned Parse.Object values

				PiuPiuGlobals.leaderboard[world]["scores"] = [];

				for (var i = 0; i < results.length; i++) {
					var object = results[i];
					var uid = object.get('uid');
					var score = object.get('score');

					LOG("ParseLoadAllScores: " + object.id + ' - ' + uid + ' - ' + score);

					PiuPiuGlobals.leaderboard[world][uid] = {"score": score};
					PiuPiuGlobals.leaderboard[world]["scores"].push(uid);
					PiuPiuGlobals.UIDtoData[uid] = PiuPiuGlobals.UIDtoData[uid] || {};

					if (uid == PiuPiuGlobals.FBmyUID) {
						ParseUpdateLocalObjectID(world, object.id, "ParseLoadAllScores");
					}
				}

				FBgetDataForUsers(target, success_callback);
			},
			error: function(error) {
				//  It's possible that this is the first time the user logs in, we still need to refresh leaderboard
				LOG("ParseLoadAllScores: Error: " + error.code + " " + error.message);
				target && error_callback && error_callback.call(target);
			}
		});
	};
};