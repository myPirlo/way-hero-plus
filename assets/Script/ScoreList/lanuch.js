
cc.Class({
    extends: cc.Component,

    properties: {
        display: cc.Node,
        titleList:cc.Node,
        intro:cc.Node,
        startBtnGroup:cc.Node

    },

    start () {
        this._isShow = false;
        this._show = cc.moveTo(0.5, 0, 0);
        this._hide = cc.moveTo(0.5, 0, 2000);
    },

    open (tag) {
        if(tag){
            this.display.runAction(this._show);
        }
        this.startBtnGroup.active=false
        this.titleList.active=false
    },

    close(tag){
        if(tag){
            this.display.runAction(this._hide);
        }
        this.startBtnGroup.active=true
        this.titleList.active=true
    },
    
    showIntr(){
        this.intro.active=true
        this.open()
    },
    hideIntro(){
        this.intro.active=false
        this.close()
    },
    doShare(){
        D.share()
    },
    watchVideo(){
        D.bannerDestory()
         let _this=this 
         wx.showLoading({
            title: '加载中',
         })
         return new Promise((resolve, reject) => {
             let videoAd = wx.createRewardedVideoAd({
                adUnitId: 'adunit-8d953778ab1ee7c0'
             })
             videoAd.load()
             .then(() => {
                 videoAd.show();
                 wx.hideLoading();
                 videoAd.onClose(res => {
                     
                 })
             })
             .catch(err => {
                 wx.hideLoading();
                 reject('error')
             })
             videoAd.onError(function () {
                 wx.hideLoading();
                 reject('error')
             })
         })
    }

});
