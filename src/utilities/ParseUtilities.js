/**
 * Created by shirkan on 2/10/15.
 */

import .parse as parse;

exports
{
	var parseObjs = {};

	ParseInit = function () {
		parse.Parse.initialize("YfOISFZAxRmajUe9l6Sh3BL5lpekZfqBzRLFmCBU", "MxFgCdHsmFKt0VG2rwdxd1A1e7qpwRwHNFLpQcfS");
		var TestObject = parse.Parse.Object.extend("TestObject");
		var testObject = new TestObject();
		testObject.save({foo: "bar"}).then(function(object) {
		    alert("yay! it worked");
		});
	};

	ParseGetObject = function ( objName ) {
		if (!parseObjs[objName]) {
			var newParseObject = parse.Parse.Object.extend(objName);
			parseObjs[objName] = new newParseObject();
		}
		return parseObjs[objName];
	};

	ParseSaveData = function (objName, data) {
		var parseObj = ParseGetObject(objName);

		parseObj.save(data, {
			success: function(obj) {
				LOG("ParseSaveData: data saved successfully: " + obj);
			},
			error: function(obj, error) {
				LOG("ParseSaveData: failed saving obj: " + obj + " with error: " + error);
			}
		});
	};


};