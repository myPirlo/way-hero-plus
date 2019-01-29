// declare global variable "D"
window.D = {
    // singletons
    common: null, //公共方法
    share(){
        let num=Math.floor(Math.random()*(this.shareInfo.length-1))
        if(this.getDay()=='201914'||this.getDay()=='201915'){
            num=this.shareInfo.length-1
        }
        wx.shareAppMessage(this.shareInfo[num])
    },
    getDay(){
        let year=(new Date()).getFullYear()
        let month=(new Date()).getMonth()
        let day=(new Date()).getDate()
        let dateNum=String(year)+String(month)+String(day)
        return dateNum
    },
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
        },
        {
            title: '猪事顺利,快来领取你的新年金砖！！',
            imageUrl:'http://webfdh.com/way-hero/happyNewYear.jpg'
        }
    ]
};

window._ = require('lodash');
