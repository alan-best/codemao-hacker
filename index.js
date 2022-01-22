const { prompt } = require("inquirer");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const FUNCTION_OPTIONS = JSON.parse(fs.readFileSync(path.join(__dirname, "./functions/options.json")).toString());

async function main() {
    let { category } = await prompt({
        type: "list",
        choices: Object.keys(FUNCTION_OPTIONS),
        name: "category",
        message: "选择功能分类"
    });
    let functionArray = FUNCTION_OPTIONS[category];
    let { moduleName } = await prompt({
        type: "list",
        choices: functionArray.map(o => o.label),
        name: "moduleName",
        message: "选择功能模块"
    });
    let { modulePath } = functionArray.filter(o => o.label === moduleName)[0];
    const finalPath = path.join(__dirname, "./functions/", modulePath)
    await require(finalPath).main();

}

main().then(() => {
    console.log(chalk.rgb(200, 120, 120).bold("将在3秒后关闭程序"));
    setTimeout(() => {
        process.exit();
    }, 3000);
});