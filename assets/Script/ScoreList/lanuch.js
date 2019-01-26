
cc.Class({
    extends: cc.Component,

    properties: {
        display: cc.Node,
        startBtn:cc.Node,
        scoreListBtn:cc.Node,
        titleList:cc.Node,
        intro:cc.Node,
        introBtn:cc.Node,
        PK:cc.Node
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
        this.startBtn.active=false
        this.scoreListBtn.active=false
        this.titleList.active=false
        this.introBtn.active=false
        this.PK.active=false
    },

    close(tag){
        if(tag){
            this.display.runAction(this._hide);
        }
        this.startBtn.active=true
        this.scoreListBtn.active=true
        this.titleList.active=true
        this.introBtn.active=true
        this.PK.active=true
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
        let num=Math.floor(Math.random()*D.shareInfo.length)
        wx.shareAppMessage(D.shareInfo[num])
    }

});
