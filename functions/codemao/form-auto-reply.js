const axios = require("axios");
const chalk = require('chalk');
const { prompt } = require("inquirer");

module.exports = {
    async main() {
        console.log(chalk `
{red.bold 自动顶贴程序使用协议与规则}
{green 1. }{grey 自动顶贴即自动在帖子下添加回复, 以达到保持帖子处在帖子列表首页, 吸引更多流量.}
{green 2. }{grey 程序需要使用编程猫账号(Cookie验证信息)来进行操作, 自动化程序进行的操作本质上是模拟人工操作, }{red 因此由此产生的后果(如禁言,封禁等)均由账号Cookie提供者承担.}
{green 3. }{grey 程序使用Cookie来通过编程猫验证, 因此你必须提供一个用于进行操作的账号的Cookie. (稍后程序会详细说明)}
{green 4. }{grey 程序仅供学习交流使用, 请勿用于商业用途.}
{green 5. }{grey 出现意外情况(如程序宿主机关机, 停电, 网络中断等)可能会导致程序无法正常使用, 你可以在保证环境正常的情况下重新启动程序.}
{green 6. }{grey.bold 你需要同意协议并给程序提供必要信息才能开始运行.}
`)
        if (!(await prompt({ type: "confirm", name: "eula", message: "是否同意? (Y:是 N:否)" }))["eula"]) {
            console.log(chalk `{red 由于不同意协议, 程序退出}`);
            process.exit();
        }
        const { postID, interval, randomContent, deleteComment } = await prompt([
            { name: "postID", type: "input", validate: v => /^[0-9]+$/.test(v) ? true : "请输入正确的贴号", message: "请输入要顶的贴子的贴号" },
            {
                name: "interval",
                type: "input",
                default: 5,
                message: "顶贴延迟 单位:分钟 (请注意, 一天之内的顶贴次数有限, 超过之后会被禁言一天)",
                filter: v => {

                    v = Number(v);
                    return isNaN(v) ? "" : v;
                },
                validate(v) {
                    if (!(typeof v === "number")) return "请输入正确的数字";
                    if (v < 1) return "回帖速度不能过于频繁";
                    return true
                }
            },
            {
                name: "randomContent",
                type: "confirm",
                message: "是否随机决定回帖内容(Y: 使用看起来更加正常的回帖内容,建议用于给他人顶贴  N:使用固定的顶贴内容, 建议用于给自己顶贴)"
            },
            { name: "deleteComment", type: "confirm", message: "是否发布顶贴后删除回复(当不使用随机顶贴内容时, 你应当启用)" },

        ]);
        const Cookie = await (require("../../common/headerGetter").getCookie());
        const randomContents = [
      "不错", "必须顶~", "yyds!", "膜拜大佬", "你是最棒的", "顶顶顶",
      "很有用的贴", "针不戳诶", "编程猫有你更精彩~", "我觉得你的帖子迟早会火爆全网", "你最棒了~",
      "您!", "太您了!", "qwq", "awa", "虽然我看不懂，但我大为震撼", "太nb了!",
      "这么好的帖子怎么没人顶?"
    ]
        let count = 0,
            replyID;
        while (true) {
            console.clear()
            console.log(chalk `{blue.bold 自动顶贴} {red.bold 贴号: ${postID}} {green.bold 执行次数: ${count}}\n{yellow.bold 按Ctrl+C或关闭窗口以中断运行}\n`)
            try {

                let content = randomContent ? randomContents[Math.floor(Math.random() * randomContents.length)] :
                    `[自动化顶贴]\n时间: ${new Date().toLocaleString()}\n顶贴序号:${count}`;
                console.log(chalk `{blue.bold 正在发布回帖} {grey 内容: ${content}}`);
                replyID = (await axios.post(`https://api.codemao.cn/web/forums/posts/${postID}/replies`, {
                    content
                }, { headers: { Cookie } })).data.id;
            } catch (e) {
                if (e.response.status === 401) {
                    console.error(chalk `{red.bold 401错误, 登陆验证可能已经失效}`);
                } else if (e.response.status === 404) {
                    console.error(chalk `{red.bold 404错误, 帖子可能不存在}`);
                } else {
                    console.error(e);
                }
                break
            }
            if (deleteComment) {
                console.log(chalk `{blue.bold 正在删除回复信息}`);
                await axios.delete("https://api.codemao.cn/web/forums/replies/" + replyID, { headers: { Cookie } });
            }
            console.log(chalk `{green.bold 完成一次顶贴, 下一次顶贴时间: ${new Date(new Date().getTime() + interval * 60e3).toLocaleString()}}`)
            await new Promise(r => setTimeout(r, interval * 60e3));
            count++;
        }
    }

}