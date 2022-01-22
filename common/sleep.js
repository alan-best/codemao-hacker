module.exports = async function(timeMs) {
    return new Promise(res => {
        setTimeout(() => {
            res();
        }, ms);
    })
}