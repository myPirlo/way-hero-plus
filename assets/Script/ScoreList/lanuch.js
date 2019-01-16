
cc.Class({
    extends: cc.Component,

    properties: {
        display: cc.Node,
        startBtn:cc.Node,
        scoreListBtn:cc.Node,
        titleList:cc.Node
    },

    start () {
        this._isShow = false;
        this._show = cc.moveTo(0.5, 0, 0);
        this._hide = cc.moveTo(0.5, 0, 2000);
    },

    open () {
        this.display.runAction(this._show);
        this.startBtn.active=false
        this.scoreListBtn.active=false
        this.titleList.active=false
    },

    close(){
        this.display.runAction(this._hide);
        this.startBtn.active=true
        this.scoreListBtn.active=true
        this.titleList.active=true
    }



});
