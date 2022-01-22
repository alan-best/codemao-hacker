const chalk = require("chalk");

module.exports = {
    async main() {
        console.log(chalk.rgb(200, 120, 120).bold("将在3秒后关闭程序"));
        setTimeout(() => {
            process.exit();
        }, 3000);
    }
}