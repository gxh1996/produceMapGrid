var sceneScript = {
    "getMapData": function (e, gameInfo) {
        //地图根节点 gameMap
        this.gameMapNode = cc.find("Canvas/" + gameInfo.mapRootName);
        this.groupName = gameInfo.obstructionGroupName;
        //将地图着分成多少块
        let blockCount = 30;

        let mapData = this.produceMapData(blockCount);
        if (e.reply)
            e.reply("getMapData sucessed!", mapData);
    },

    "produceMapData": function (blockCount) {
        let mapData = {};
        let w = this.gameMapNode.width;
        let h = this.gameMapNode.height;

        //地图名为地图根节点名
        mapData.name = this.gameMapNode.name;

        mapData.blockCount = blockCount;

        mapData.mapSize = {
            "width": w,
            "height": h
        };

        //块的大小
        mapData.blockSize = {
            "width": mapData.mapSize.width / blockCount,
            "height": mapData.mapSize.height / blockCount
        };

        //创建二维数组
        mapData.blockArray = new Array(blockCount);
        for (let i = 0; i < blockCount; i++)
            mapData.blockArray[i] = new Array(blockCount);

        this.initMapData(mapData);

        this.scanMap(mapData);

        return mapData;
    },

    "initMapData": function (mapData) {
        let blockArray = mapData.blockArray;
        let bW = mapData.blockSize.width;
        let bH = mapData.blockSize.height;

        for (let i = 0; i < mapData.blockCount; i++) {
            for (let j = 0; j < mapData.blockCount; j++) {
                //块的坐标统一为左下角的坐标,不记录坐标，可以根据块大小和数组下标求出。
                blockArray[i][j] = {
                    "x": j * bW,
                    "y": i * bH,
                    "weight": 0 //权重为0表未知，-1表无限大或不可走
                };
            }
        }
    },

    "scanMap": function (mapData) {
        let childrenNode = this.gameMapNode.children;
        let len = childrenNode.length;

        this.scanNode(childrenNode[2], mapData);

        for (let i = 0; i < len; i++) {
            let node = childrenNode[i];
            if (node.group !== this.groupName) //非障碍物
                continue;

            this.scanNode(node, mapData);
        }
    },
    scanNode: function (node, mapData) {
        let blockArray = mapData.blockArray;
        //块大小
        let bW = mapData.blockSize.width;
        let bH = mapData.blockSize.height;

        //获得节点的左下角和右上角
        let pos = node.getPosition();
        let leftDownP = cc.v2(pos.x - node.width / 2, pos.y - node.height / 2);
        let rightUpP = cc.v2(pos.x + node.width / 2, pos.y + node.height / 2);

        //算出网格边界
        let minJ = Math.ceil(leftDownP.x / bW) - 1;
        let maxJ = Math.ceil(rightUpP.x / bW) - 1;
        let minI = Math.ceil(leftDownP.y / bH) - 1;
        let maxI = Math.ceil(rightUpP.y / bH) - 1;

        //修改网格数组信息
        for (let i = minI; i <= maxI; i++)
            for (let j = minJ; j <= maxJ; j++)
                blockArray[i][j].weight = -1;
    }
};

module.exports = sceneScript; 