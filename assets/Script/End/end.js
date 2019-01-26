cc.Class({
    extends: cc.Component,

    properties: {
        newScore: {
            default: null,
            type: cc.Label,
        },
        restartBtn: {
            default: null,
            type: cc.Button,
        },
        historyBtn: {
            default: null,
            type: cc.Button,
        },
        quitBtn: {
            default: null,
            type: cc.Button,
        },
        buttonSound: {
            default: null,
            type: cc.AudioClip
        }
    },
    // use this for initialization
    start: function () {
        this.newScore.string = D.commonState.gameScore ? D.commonState.gameScore.toString() : '0';
        if(D.commonState.gameScore){
            //如果有分数,就向子域中发送分数
            const openDataContext = wx.getOpenDataContext()
            openDataContext.postMessage({
                score: D.commonState.gameScore,
                year: (new Date()).getFullYear()
            })
        }    
    },
    
    restartGame: function () {
        cc.audioEngine.play(this.buttonSound);
        cc.director.loadScene('Game');
    },
    quitGame: function () {
        cc.audioEngine.play(this.buttonSound);
        cc.director.loadScene('Start');
    },
    endShare(){
        let num=Math.floor(Math.random()*D.shareInfo.length)
        wx.shareAppMessage(D.shareInfo[num])
    }


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});