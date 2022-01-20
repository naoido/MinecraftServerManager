const menu = new Vue({
    el: '#vue_menu',
    template: `
            <ul>
                <li><button id="file_open_button" @click="open">新規追加</button></li>
                <li><div @click="click_reload(false)" id="reload_button"></div></li>
                <div class="stop" @click="stop_process_sever"></div>
            </ul>
      `,
    methods: {
        async open() {
            const file_path = await eel.open_file()();
            if (file_path !== null) {
                add_alert(file_path + "を追加しました。", true)
            }
            this.click_reload(true);
        },
        click_reload(hide) {
            ver_list.path = [];
            ver_list.jar = [];
            ver_list.pro = [];
            ver_list.display_path = [];
            get_data().then(obj => {
                for (let k in Object.keys(obj)) {
                    ver_list.path.push(Object.keys(obj)[k]);
                    ver_list.display_path.push(Object.keys(obj)[k].match(/\b\/.+$/)[0].substr(1));
                }
                for (let i in Object.keys(obj)) {
                    let list = [];
                    let jar = Object.values(obj)[i]["jar"];
                    for (let k in jar) {
                        list.push(jar[k].substr(jar[k].indexOf('\\') + 1));
                    }
                    ver_list.jar.push(list);
                    ver_list.stop_button.push(false)
                    ver_list.pro.push(Object.values(obj)[i]["pro"]);
                }
            });
            if (!hide) { add_alert("バージョンリストをリロードしました。", true) }
        },
        stop_process_sever() {
            eel.stop_mc_server()
        }
    }
});

const ver_list = new Vue({
    el: '#ver_list',
    template: `
        <div id="ver_list">
            <div v-for="(p, index) in path" class="ver_list_box">
                <ul><li>
                    <h1 class="path" :path-id="p">{{ display_path[index] }}</h1>
                    <ul class="jar_list">
                        <li :path-jar="j" class="jar" v-for="(j, j_idx) in jar[index]">
                            <p>{{ j }}</p>
                            <div class="start" @click="run_server(path[index], jar[index][j_idx], index)"></div>
                            <div class="close" @click="delete_ver(index, j_idx)"></div>
                        </li>
                    </ul>
                </li></ul>
                <div class="option" :por-path="pro[index]"><p>設定</p></div>
            </div>
        </div>
    `,
    data: {
        path: [],
        display_path: [],
        jar: [],
        pro: [],
        stop_button: []
    },
    methods: {
        delete_ver(idx, j_idx) {
            if (this.jar[idx].length > 1) {
                add_alert(this.jar[idx][j_idx] + "を削除しました。", false)
                eel.del_jar(j_idx, this.path[idx])
                this.jar[idx].splice(j_idx, 1)
            } else {
                add_alert(this.path[idx] + "を削除しました。", false)
                eel.del_path(this.path[idx])
                this.path.splice(idx, 1);
                this.display_path.splice(idx, 1);
                this.jar.splice(idx, 1);
                this.pro.splice(idx, 1);
            }
        },
        async run_server(path, jar, index) {
            let xmx = start_option.$data.max;
            let xms = start_option.$data.min;
            if (xmx < xms) {
                add_alert("Xmx値がXms値を下回っています。", false)
                return
            }
            let gui = start_option.$data.gui;
            await eel.run_mc_server(path, jar, xmx ,xms, !gui)()
        }
    },
    mounted: {
        window: onload = function () {
            menu.$options.methods.click_reload(true);
        }
    }
});

const alert_msg = new Vue({
    el: "#alert",
    data() {
        return {
            alerts: [{}],
            color: [],
            next_num: 0
        }
    },
    methods: {
        add_alert (txt, bool) {
            if (bool) {
                alert_msg.color.unshift("blue")
            } else {
                alert_msg.color.unshift("red")
            }
            let num = alert_msg.next_num += 1;
            const data = {
                key: num,
                text: txt
            }
            alert_msg.alerts.unshift(data)
            setTimeout(() => {
                alert_msg.alerts.splice(alert_msg.alerts.indexOf(num) - 1, 1)
            }, 3000);
        }
    }
});

const start_option = new Vue({
    el: '#cmd-line',
    template: `
        <ul id="options">
            <li>Xmx<input type="number" id="Xmx" min="1" value="1" v-model="max">G</li>
            <li>Xms<input type="number" id="Xms" min="1" value="1" v-model="min">G</li>
            <li><label for="gui-check">nogui</label><input type="checkbox" id="gui-check" v-model="gui"></li>
        </ul>
    `,
    data() {
        return {
            gui: false,
            max: 1,
            min: 1
        }
    }
});
async function get_data() {
    return await eel.path_load()();
}

eel.expose(add_alert)
function add_alert(txt, bool) {
    alert_msg.$options.methods.add_alert(txt, bool);
}