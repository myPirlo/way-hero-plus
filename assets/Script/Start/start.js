cc.Class({
    extends: cc.Component,

    properties: {
        loadAnimation: {
            default: null,
            type: cc.Animation
        },
        startButton: {
            default: null,
            type: cc.Button
        },
        buttonSound: {
            default: null,
            type: cc.AudioClip
        }
    },
    // use this for initialization
    onLoad: function () {
        
        // 预先加载游戏场景
        cc.director.preloadScene('Game');

        //设置微信的分享
        wx.showShareMenu({
            withShareTicket: true
        })
        wx.onShareAppMessage(function () {
            return {
                title: '真搞不懂你们,这游戏就那么好玩吗...盘它！！！',
                imageUrl:'http://webfdh.com/way-hero/banzhuan.jpg'
            }
        })
        D.bannerAdShow()
    },
    

    startGame: function () {
        cc.audioEngine.play(this.buttonSound);
        // 转场
        D.bannerDestory()
        cc.director.loadScene('Game');
    },

    

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
