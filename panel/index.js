// panel/index.js, this filename needs to match the one registered in package.json
Editor.Panel.extend({
    // css style for panel
    style: `
      :host { margin: 5px; }
      h2 { color: #f90; }
    `,

    // html template for panel
    template: `
      <div>地图根节点名: <ui-input id="mapRootName"></ui-input></div>
      <hr />
      <div>障碍物分组名: <ui-input id="obstructionGroupName"></ui-input></div>
      <hr />
      <div>水平方向将地图分: <ui-input id="horizontalBlockC"></ui-input>个网格</div>
      <hr />
      <div>垂直方向将地图分:<ui-input id="verticalBlockC"></ui-input>个网格</div>
      <hr />
      <ui-button id="submit">submit</ui-button>
      <ui-button id="execute">execute</ui-button>
      <hr />
      <div>网格宽：<span id="labelBlockWidth">--</span></div>
      <hr />
      <div>网格高：<span id="labelBlockHeight">--</span></div>
    `,

    // element and variable binding
    $: {
        submit: '#submit', //将id为submit的按钮和变量submit绑定，$submit就表示该按钮
        execute: '#execute',
        mapRN: '#mapRootName',
        obstructionGN: '#obstructionGroupName',
        horizontalBlockC: '#horizontalBlockC',
        verticalBlockC: '#verticalBlockC',

        labelBlockWidth: '#labelBlockWidth',
        labelBlockHeight: '#labelBlockHeight'
    },

    // method executed when template and styles are successfully loaded and initialized
    ready() {
        //默认值
        this.$mapRN.value = "gameMap";
        this.$obstructionGN.value = "obstruction";
        this.$horizontalBlockC.value = 30;
        this.$verticalBlockC.value = 30;

        //该按钮监听"confirm"事件。
        this.$submit.addEventListener('confirm', () => {
            if (this.$mapRN.value == "" || this.$obstructionGN.value == "" || this.$horizontalBlockC == "" || this.$verticalBlockC == "") {
                Editor.log("输入不能为空！！！");
                return;
            }
            Editor.Ipc.sendToMain('produce_map_grid:submit', this.$mapRN.value, this.$obstructionGN.value, this.$horizontalBlockC.value, this.$verticalBlockC.value);
            Editor.log("submit:", this.$mapRN.value, this.$obstructionGN.value, this.$horizontalBlockC.value, this.$verticalBlockC.value);
        });
        this.$execute.addEventListener('confirm', () => {
            Editor.Ipc.sendToMain('produce_map_grid:execute');
        });
    },

    // register your ipc messages here
    messages: {
        'produce_map_grid:showBlockSize'(e, w, h) {
            this.$labelBlockWidth.innerText = w;
            this.$labelBlockHeight.innerText = h;
        }
    }
});