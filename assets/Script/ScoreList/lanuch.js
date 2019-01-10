
cc.Class({
    extends: cc.Component,

    properties: {
        display: cc.Node
    },

    start () {
        this._isShow = false;
        this._show = cc.moveTo(0.5, 0, 0);
        this._hide = cc.moveTo(0.5, 0, 2000);
    },

    onClick () {
        if (this._isShow) {
            this.display.runAction(this._hide);
        }
        else {
            this.display.runAction(this._show);
        }
        this._isShow = !this._isShow;
    },
    onLoad(){

        this.node.on('touchstart', function(){
            if(this._isShow==true){
                this.display.runAction(this._hide);
                this._isShow = false;
            }
        }, this);
    }


});
