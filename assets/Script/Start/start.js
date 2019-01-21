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
                // 用户点击了“转发”按钮
                return {
                  title: '我就是无聊死,也不会玩这个游戏！！！',
                  imageUrl:'http://webfdh.com/way-hero/1.jpg'
                }
            })
    },

    startGame: function () {
        cc.audioEngine.play(this.buttonSound);
        // 转场
        cc.director.loadScene('Game');
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
