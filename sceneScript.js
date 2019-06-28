var sceneScript = {
    "getMapData": function (e, gameInfo) {
        //地图根节点 gameMap
        this.gameMapNode = cc.find("Canvas/" + gameInfo.mapRootName);
        this.groupName = gameInfo.obstructionGroupName;
        //将地图水平和垂直分成多少块
        this.mapData = {};
        this.mapData.horizontalBlockC = gameInfo.horizontalBlockC;
        this.mapData.verticalBlockC = gameInfo.verticalBlockC;

        this.produceMapData();
        if (e.reply)
            e.reply("getMapData sucessed!", this.mapData);
    },

    "produceMapData": function () {
        let w = this.gameMapNode.width;
        let h = this.gameMapNode.height;

        //地图名为地图根节点名
        this.mapData.name = this.gameMapNode.name;

        this.mapData.mapSize = {
            "width": w,
            "height": h
        };

        //块的大小
        this.mapData.blockSize = {
            "width": this.mapData.mapSize.width / this.mapData.horizontalBlockC,
            "height": this.mapData.mapSize.height / this.mapData.verticalBlockC
        };

        //创建二维数组
        this.mapData.blockArray = new Array(this.mapData.verticalBlockC);
        for (let i = 0; i < this.mapData.verticalBlockC; i++)
            this.mapData.blockArray[i] = new Array(this.horizontalBlockC);

        this.initMapData();

        this.scanMap();
    },

    "initMapData": function () {
        let blockArray = this.mapData.blockArray;
        let bW = this.mapData.blockSize.width;
        let bH = this.mapData.blockSize.height;

        for (let i = 0; i < this.mapData.verticalBlockC; i++) {
            for (let j = 0; j < this.mapData.horizontalBlockC; j++) {
                //块的坐标统一为左下角的坐标,不记录坐标，可以根据块大小和数组下标求出。
                blockArray[i][j] = {
                    "x": j * bW,
                    "y": i * bH,
                    "weight": 0 //权重为0表未知，-1表无限大或不可走
                };
            }
        }
    },

    "scanMap": function () {
        let childrenNode = this.gameMapNode.children;
        let len = childrenNode.length;

        this.scanNode(childrenNode[2], this.mapData);

        for (let i = 0; i < len; i++) {
            let node = childrenNode[i];
            if (node.group !== this.groupName) //非障碍物
                continue;

            this.scanNode(node);
        }
    },
    scanNode: function (node) {
        let blockArray = this.mapData.blockArray;
        //块大小
        let bW = this.mapData.blockSize.width;
        let bH = this.mapData.blockSize.height;

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