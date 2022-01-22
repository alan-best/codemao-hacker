const axios = require("axios");
const { prompt } = require("inquirer");
const chalk = require("chalk");
const path = require('path');
const fs = require('fs');

const serverList = JSON.parse(fs.readFileSync(path.join(__dirname, 'servers.json').toString())).servers;

module.exports = {
    async main() {
        var serverNames = [];
        var serverInfos = [];
        var serverIps = [];

        serverList.forEach(d => {
            serverIps.push(`${d.ip}:${d.port}${d.path}`);
        });
        await serverIps.forEach((d, i) => {
            axios.get(`${d}look`, {
                headers: {
                    Host: d,
                }
            }).then(async(d) => {
                var info = d.data;

                serverInfos.push({ t: info.title, i: i, c: info.content, k: serverList[i].key });
                serverNames.push(info.title);
                // if (i == serverIps.length) {

                // }
            });
        });
        let { postID, server } = await prompt([{
                name: "postID",
                message: "输入贴号(示例: 394580)",
                type: "input",
                validate: v => /^[0-9]+$/.test(v) ? true : "请输入正确的贴号"
            },
            {
                name: "server",
                message: "使用的服务器",
                type: "list",
                choices: serverNames
            }
        ]);

        console.log(chalk `{yellow.bold 添加服务器任务中}`);

        var index = serverNames.indexOf(server);
        var usingIp = serverIps[index];
        console.log(chalk `{red 使用的服务器IP:}{blue ${usingIp}}`);

        axios.get(`${usingIp}${serverInfos[index].k}/start/${postID}`).then(({ data }) => {
            if (data.err) {
                console.log(chalk.bold.red("失败!具体原因:"));
                console.log(chalk.red(data.c));
            } else {
                console.log(chalk.bold.green("成功!任务时间为10秒"));
            }
        });
        console.log("");

    }
}