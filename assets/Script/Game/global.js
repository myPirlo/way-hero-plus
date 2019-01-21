// declare global variable "D"
window.D = {
    // singletons
    common: null, //公共方法
    commonState: {
        atk:1,
        buffatk:0,
        enemyFeq:1,
        shotSpeed:1,
        buffShotSpeed:1,
        scoreBasic:1
    }, //定义的一些常量
};

window._ = require('lodash');
