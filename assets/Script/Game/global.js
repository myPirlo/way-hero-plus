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
        scoreBasic:1,
        relifeChance:1,
        relifeBtn:0
    }, //定义的一些常量
    shareInfo:[
        {
            title: '好玩到无法自拔,能超过我的分算我输！！！',
            imageUrl:'http://webfdh.com/way-hero/main.jpg'
        },{
            title: '真搞不懂你们,这游戏就那么好玩吗...盘它！！！',
            imageUrl:'http://webfdh.com/way-hero/banzhuan.jpg'
        },
        {
            title: '好看的皮囊千篇一律,有趣的游戏万里挑一',
            imageUrl:'http://webfdh.com/way-hero/main.jpg'
        },
        {
            title: '我就是无聊死,也不会玩这个游戏',
            imageUrl:'http://webfdh.com/way-hero/banzhuan.jpg'
        }
    ]
};

window._ = require('lodash');
