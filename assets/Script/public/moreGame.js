// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        moreContent:cc.Node        
    },


    start () {
        this.tag=false
    },

    doMore(){
        if(!this.tag){
            this.showMore()
        }else{
            this.hideMore()
        }
        this.tag=!this.tag
    },

    showMore(){
        this.moreContent.runAction(cc.moveBy(0.5,-410,0))
        this.moreContent.children[0].children[0].getComponents(cc.Label)[0].string='收\n起'
    },
    hideMore(){
        this.moreContent.runAction(cc.moveBy(0.5,410,0))
        this.moreContent.children[0].children[0].getComponents(cc.Label)[0].string='热\n门'
    },
    jumpToOther(e,appid){
        wx.navigateToMiniProgram({
            appId:appid
        })
    }
});
