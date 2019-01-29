cc.Class({
    extends: cc.Component,
    properties: () => ({
        pause: cc.Button,
        scoreDisplay: cc.Label,
        levelDisplay:cc.Label,
        bombAmount: cc.Label,
        bombDisplay: cc.Node,
        pauseSprite: {
          default: [],
          type: cc.SpriteFrame,
          tooltip:'暂停按钮图片组',
        },
        bgpSpriteArr:{
          default: [],
          type: cc.SpriteFrame,
          tooltip:'背景图片的按钮组',
        },
        backGroundSprite:cc.Node,
        hero: {
            default: null,
            type: require('hero')
        },
        bulletGroup: {
            default: null,
            type: require('bulletGroup')
        },
        enemyGroup: {
            default: null,
            type:require('enemyGroup')
        },
        enemy1:cc.Prefab,
        enemy2:cc.Prefab,
        enemy3:cc.Prefab,
        enemy4:cc.Prefab,
        ufoGroup: {
            default: null,
            type:require('ufoGroup')
        },
        bgm: {
            default: null,
            type: cc.AudioClip
        },
        gameOverSound: {
            default: null,
            type: cc.AudioClip
        },
        bombSound: {
            default: null,
            type: cc.AudioClip
        },
        buttonSound: {
            default: null,
            type: cc.AudioClip
        },
        level:1,
        reLife:cc.Node
    }),

    // use this for initialization
    onLoad: function () {
        this.initState();
        this.enemyGroup.startAction();
        this.bulletGroup.startAction();
        this.ufoGroup.startAction();
        wx.showShareMenu({
            withShareTicket: true
        })
        wx.onShareAppMessage(function () {
            D.share()
        })
        
        
        // play bgm
        //this.currentBgm=cc.audioEngine.play(this.bgm, true);
    },
    initState: function () {
        //暂停状态
        D.commonState.pauseState = false
        //储存炸药数量
        D.commonState.bombAmount = 0
        //游戏得分
        D.commonState.gameScore = 0
        //游戏难度
        D.commonState.level=0
        //子弹威力
        D.commonState.atk=1
        //敌人刷新速度
        D.commonState.enemyFeq=1
        //子弹射速
        D.commonState.shotSpeed=1
        //分数基数,用于翻倍基础得分
        D.commonState.scoreBasic=1
        //风力影响
        D.commonState.wind=false
        //BUFF后的攻击力
        D.commonState.buffatk=0
        //BUFF后的子弹速度
        D.commonState.buffShotSpeed=1
        //分享复活的机会数
        D.commonState.relifeChance=1
        //分享复活的按钮
        D.commonState.relifeBtn=0
        
        let sNum=Math.floor(Math.random()*(this.bgpSpriteArr.length-1))
        if(D.getDay()=='201914'||D.getDay()=='201915'){
            sNum=this.bgpSpriteArr.length-1
        }
        this.backGroundSprite.getComponent(cc.Sprite).spriteFrame=this.bgpSpriteArr[sNum]
        //console.log(2)
        
    },
    // 暂停
    handlePause: function () {
        cc.audioEngine.play(this.buttonSound);
        //cc.audioEngine.pause(this.currentBgm);
        if (D.commonState.pauseState) {
            this.doRePause()
        }else{
            this.doPause()
        }
    },
    doPause(){
        this.pause.normalSprite = this.pauseSprite[1];
        // 暂停正在运行的场景
        this.enemyGroup.stopAction()
        cc.director.pause();
        // 移除Hero拖拽监听
        this.hero.offDrag();
        return D.commonState.pauseState = !D.commonState.pauseState;
    },
    doRePause(){
        //this.currentBgm=cc.audioEngine.play(this.bgm, true);
        this.pause.normalSprite = this.pauseSprite[0];
        // 开始正在运行的场景
        this.enemyGroup.startAction()
        cc.director.resume();
        // 添加Hero拖拽监听
        this.hero.onDrag();
        return D.commonState.pauseState = !D.commonState.pauseState;

    },
    // 使用TNT炸弹
    useBomb: function () {
        //if (D.commonState.bombAmount > 0) {
            // 音效
            cc.audioEngine.play(this.bombSound);
            // 把当前的node.children 赋值给一个新的对象
            let enemy = new Array(...this.enemyGroup.node.children);
            for(let i = 0; i < enemy.length; i++) {
                enemy[i].getComponent('enemy').explodingAnim();
            }
            D.commonState.bombAmount--;
            this.bombAmount.string = String(D.commonState.bombAmount);
        //}
    },
    // 接收炸弹
    receiveBomb: function () {
        //原本的搜集炸弹逻辑
        // D.commonState.bombAmount++;
        // this.bombAmount.string = String(D.commonState.bombAmount);
        //现在改为直接始用
        this.useBomb()
    },
    // 分数
    changeScore: function (score) {
        D.commonState.gameScore += score*D.commonState.scoreBasic;
        if(D.commonState.gameScore%100==0){
            this.level++
            this.levelDisplay.string=this.level
        }
        this.scoreDisplay.string = D.commonState.gameScore.toString();
    },
    // 游戏结束
    gameOver: function () {
        this.enemyGroup.stopAction()
        this.bulletGroup.stopFire()
        D.common.clearAllPool();
        cc.audioEngine.play(this.gameOverSound);
        cc.director.loadScene('End');     
    },

    showModal(){
        this.reLife.active=true
    },
    hideModal(){
        this.reLife.active=false
    },
    doShareToGroup(){
        D.share()
    }

});
