'use strict';

const Fs = require("fire-fs");
const Path = require("fire-path");

module.exports = {
	load() {
	},

	unload() {
	},

	// register your ipc messages here
	messages: {
		'produce_map_grid:execute'() {
			if (this.gameInfo == undefined) {
				Editor.log("please input data!!!");
				return;
			}

			Editor.log("begin...");

			//创建目录
			let dir = Path.join(Editor.Project.path, 'assets', "maps");
			Fs.mkdirsSync(dir);

			Editor.Scene.callSceneScript("produce_map_grid", "getMapData", this.gameInfo, function (err, mapData) {
				let mapJson = JSON.stringify(mapData);
				mapJson = "let " + mapData.name + "=" + mapJson + ";\nmodule.exports = " + mapData.name + ";";

				Fs.writeFileSync(Path.join(dir, mapData.name + ".js"), mapJson);

				Editor.assetdb.refresh("db://assets/maps", () => {
					Editor.success("produce success!");
				});

				Editor.Ipc.sendToPanel('produce_map_grid', 'produce_map_grid:showBlockSize', mapData.blockSize.width, mapData.blockSize.height);
			});
		},
		'produce_map_grid:openInputPanel'() {
			Editor.Panel.open('produce_map_grid');
		},
		'produce_map_grid:submit'(e, mapRootName, obstructionGroupName, horizontalBlockC, verticalBlockC) {
			//要传入sceneScript.js的参数
			this.gameInfo = {
				mapRootName: mapRootName,
				obstructionGroupName: obstructionGroupName,
				horizontalBlockC: Number(horizontalBlockC),
				verticalBlockC: Number(verticalBlockC)
			}
		}

	}
};