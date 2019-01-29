cc.Class({
    extends: cc.Component,

    properties: () => ({
        bulletGroup: {
            default: null,
            type: require('bulletGroup'),
        },
        enemyGroup: {
            default: null,
            type: require('enemyGroup'),
        },
        mainScript: {
            default: null,
            type: require('main'),
        },
        heroHited:{
            default:null,
            type:cc.AudioClip
        },
        heroHitedBefore:{
            default:null,
            type:cc.AudioClip
        },
        timer:null,
        timer2:null,
        timer3:null,
        tips:cc.Node
    }),

    // use this for initialization
    onLoad: function () {

        this.showTips('拖动人物即可移动位置哦')  

        setTimeout(() => {
            this.showTips('相信我,没你想得那么简单(｀・ω・´) ')  
        }, 9000);
          

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
                    if(D.commonState.shotSpeed<2){
                        D.commonState.shotSpeed+=0.1
                    }else{
                        return
                    }
                    this.showTips('子弹速度提升')
                    this.bulletGroup.reStartFire();
                    break
                case 'tnt':
                    this.mainScript.receiveBomb();
                    break
                case 'protect':
                    this.showTips('护盾是个可以放飞自我的道具')
                    D.commonState.hasProtect=true
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
                case 'doubleScore':
                    clearTimeout(this.timer2)
                    D.commonState.scoreBasic=2
                    D.commonState.enemyFeq=2.4
                    this.enemyGroup.reStartAction()
                    this.timer2=setTimeout(() => {
                        D.commonState.scoreBasic=1
                        D.commonState.enemyFeq=1
                        this.enemyGroup.reStartAction()
                    }, 5000);
                    this.showTips('你是不是得到了什么奇怪的道具?') 
                    break
                case 'superShot':
                    clearTimeout(this.timer3)
                    D.commonState.buffShotSpeed=3
                    D.commonState.buffatk=5
                    this.bulletGroup.reStartFire()
                    this.timer3=setTimeout(() => {
                        D.commonState.buffShotSpeed=1
                        D.commonState.buffatk=0
                        this.bulletGroup.reStartFire()
                    }, 10000);
                    
                    break
                    
            }
        } else if (other.node.group === 'enemy'){
            if(D.commonState.hasProtect){
                return
            }
            //如果有复活的机会
            if(D.commonState.relifeChance>0&&D.getDay()!='2019030'){
                //显示复活框子,并暂停游戏
                cc.audioEngine.play(this.heroHitedBefore);
                this.mainScript.showModal()
                this.mainScript.doPause()
            }else{
                this.heroDied()
            }
        }
    },
    doRelife(){
        if(D.commonState.relifeBtn<1){
            //表示用户调起分享,还未关闭分享页
            this.mainScript.doShareToGroup()
            D.commonState.relifeBtn++
            return
        }else{
            D.commonState.relifeChance--
            this.mainScript.useBomb()
            this.mainScript.hideModal()
            this.mainScript.doRePause()
        }    
    },
    onHandleDestroy: function () {
        // 暂停正在运行的场景，该暂停只会停止游戏逻辑执行，但是不会停止渲染和 UI 响应
        this.offDrag();
        // 游戏结束转场
        this.mainScript.gameOver();
    },
    chooseGoDie(){
        this.mainScript.hideModal()
        this.mainScript.doRePause()
        this.heroDied()
    },
    heroDied(){
        cc.audioEngine.play(this.heroHited);  
        let anim = this.getComponent(cc.Animation);
        let animName = this.node.name + '_exploding';
        anim.play(animName);
        anim.on('finished', this.onHandleDestroy, this);
    },
    showTips(string){
        this.tips.children[1].getComponent(cc.Label).string=string
        let fadeIn=cc.fadeIn(3)
        let fadeOut = cc.fadeOut(3)   
        let seq=cc.sequence(fadeIn,fadeOut)          
        this.tips.runAction(seq);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(D.commonState.gameScore>=1000&&!D.commonState.wind){
            this.showTips('很简单?那就对了,我们增加点难度')
            D.commonState.wind=true
        }
    },
});
