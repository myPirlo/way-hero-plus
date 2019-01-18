cc.Class({
    extends: cc.Component,

    properties: () => ({
        bulletGroup: {
            default: null,
            type: require('bulletGroup'),
        },
        mainScript: {
            default: null,
            type: require('main'),
        },
        heroHited:{
            default:null,
            type:cc.AudioClip
        },
        timer:null,
        tips:cc.Node
    }),

    // use this for initialization
    onLoad: function () {
        
        
        this.tips.opacity=0
        // 监听拖动事件
        this.onDrag();
        // 获取碰撞检测系统
        let manager = cc.director.getCollisionManager();
        // 开启碰撞检测系统
        manager.enabled = true;
        this.node.children[0].active=false
    },
    // 添加拖动监听
    onDrag: function () {
        this.node.on('touchmove', this.onHandleHeroMove, this);
    },
    // 去掉拖动监听
    offDrag: function(){
        this.node.off('touchmove', this.onHandleHeroMove, this);
    },
    // Hero拖动
    onHandleHeroMove: function (event) {
        // touchmove事件中 event.getLocation() 获取当前已左下角为锚点的触点位置（world point）
        let position = event.getLocation();
        // 实际hero是background的子元素，所以坐标应该是随自己的父元素进行的，所以我们要将“world point”转化为“node point”
        let location = this.node.parent.convertToNodeSpaceAR(position);
        this.node.setPosition(location);
    },
    
    // 碰撞组件
    onCollisionEnter: function (other, self) {
        if (other.node.group === 'ufo'){
            switch (other.node.name) {
                case 'doubleBullet':
                    this.bulletGroup.changeBullet(other.node.name);
                    break
                case 'tnt':
                    this.mainScript.receiveBomb();
                    break
                case 'protect':
                    this.node.children[0].active=true
                    clearTimeout(this.timer)
                    this.timer=setTimeout(()=>{
                        //8秒后防护罩消失
                        this.node.children[0].active=false
                        D.commonState.hasProtect=false
                    },8000)
                    break
                case 'addAtk':
                    D.commonState.atk++
                    this.showTips('子弹等级提升至'+D.commonState.atk+'级') 
                    break
            }
        } else if (other.node.group === 'enemy'){
            if(D.commonState.hasProtect){
                return
            }
            cc.audioEngine.play(this.heroHited);
            
            let anim = this.getComponent(cc.Animation);
            let animName = this.node.name + '_exploding';
            anim.play(animName);
            anim.on('finished', this.onHandleDestroy, this);

        }
    },
    onHandleDestroy: function () {
        // 暂停正在运行的场景，该暂停只会停止游戏逻辑执行，但是不会停止渲染和 UI 响应
        this.offDrag();
        // 游戏结束转场
        this.mainScript.gameOver();
    },

    showTips(string){
        this.tips.children[1].getComponent(cc.Label).string=string
        let fadeIn=cc.fadeIn(1)
        let fadeOut = cc.fadeOut(2)   
        let seq=cc.sequence(fadeIn,fadeOut)          
        this.tips.runAction(seq);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
