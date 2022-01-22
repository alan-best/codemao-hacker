const inquirer = require("inquirer");
const chalk = require("chalk");
module.exports = {
    async getCookie() {
        console.log(chalk `{blue.bold 获取Cookie...}`)
        const { data } = await inquirer.prompt({
            type: "editor",
            message: `请提供账号验证信息 (按Enter开始编辑)`,
            default: `Cookie获取方法: 
打开这个网址: https://api.codemao.cn/web/forums/posts/396170/replies
按F12, 找到Network(网络), 然后选择第一项"replies"
从右侧找到"Headers", 往下翻, 找到Cookie后面一大串, 找到其中以"authorization="开头, 以";"结尾的部分

下面是格式示例(没有多余的引号或换行): 
authorization=eyJ0eXAiOiJnV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJDb1RlbWFvIEF1dGgiLCJ1c2VyX3R5cGUiOiJzdHVkZW50IiwiZGV2aWNlX2lkIjowLCJ1c2VyX2lkIjo0MzY0MzYsImlzcyI6IkF1dGggU2VydmljZSIsInBpZCI6IkFOTlJ2SFpUIiwiZXhwIjoxNjMyODA4Njk4LCJpYXQiOjE2Mjg5MjA2OTgsImp0aSI6ImE5ZDY1ZGE3LWVkMDUtNGU3Ni1iNzg5LWU3MTE5NmFjN2ViMyJ9.dPByMaaCsaxftbnU5BZwms1SwlQUVBrJAHSnC6ewHXM;

[!!!] 请删除这里的所有信息并将你的Cookie信息中的authorization粘贴在此处
编辑完成后保存并关闭编辑器窗口, 程序将自动处理`,
            name: "data",
            validate: v => /^[A-Za-z0-9\-_; =.%*&/]+$/.test(v) ? true : "输入格式有误. 输入内容应该只包含Cookie, 不能出现其他信息以及多余的换行. (按Enter重新编辑)"
        });
        return data;

    },
}