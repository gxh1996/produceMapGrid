// panel/index.js, this filename needs to match the one registered in package.json
Editor.Panel.extend({
    // css style for panel
    style: `
      :host { margin: 5px; }
      h2 { color: #f90; }
    `,

    // html template for panel
    template: `
      <div>地图根节点名: <ui-input unnavigable  id="mapRootName"></ui-input></div>
      <hr />
      <div>障碍物分组名: <ui-input unnavigable id="obstructionGroupName"></ui-input></div>
      <hr />
      <ui-button id="submit">submit</ui-button>
      <ui-button id="execute">execute</ui-button>
    `,

    // element and variable binding
    $: {
        submit: '#submit', //将id为submit的按钮和变量submit绑定，$submit就表示该按钮
        execute: '#execute',
        mapRN: '#mapRootName',
        obstructionGN: '#obstructionGroupName',
    },

    // method executed when template and styles are successfully loaded and initialized
    ready() {
        //该按钮监听"confirm"事件。
        this.$submit.addEventListener('confirm', () => {
            if (this.$mapRN.value == "" || this.$obstructionGN.value == "") {
                Editor.log("输入不能为空！！！");
                return;
            }
            Editor.Ipc.sendToMain('produce_map_grid:submit', this.$mapRN.value, this.$obstructionGN.value);
            Editor.log("submit:", this.$mapRN.value, this.$obstructionGN.value);
        });
        this.$execute.addEventListener('confirm', () => {
            Editor.Ipc.sendToMain('produce_map_grid:execute');
        });
    },

    // register your ipc messages here
    messages: {
    }
});