cc.Class({
    extends: cc.Component,

    properties: {
        score: {
            default: 0,
            type: cc.Integer,
            tooltip: '敌机分数',
        },
        HP: {
            default: 0,
            type: cc.Integer,
            tooltip: '敌机血量',
        },
        speedMax: 0,
        speedMin: 0,
        initSpriteFrame: {
            default: null,
            type: cc.SpriteFrame,
            tooltip: '初始化图像'
        },
        explosionSound: {
            default: null,
            type: cc.AudioClip,
            tooltip: '敌人爆炸音效'
        },
        hitedMusic: {
            default: null,
            type: cc.AudioClip,
            tooltip: '敌人被击中的声音'
        },
        text:cc.Label
    },

    // use this for initialization
    onLoad: function () { 
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
    },
    enemyInit: function () {
        // 速度随机[speedMax, speedMin]
        this.text.string=this.HP
        this.speed = Math.random() * (this.speedMax - this.speedMin + 1) + this.speedMin;
        this.enemyHp = this.HP;
        // 找到node的Sprite组件
        let nSprite = this.node.getComponent(cc.Sprite);
        // 初始化spriteFrame
        if (nSprite.spriteFrame != this.initSpriteFrame){
            nSprite.spriteFrame = this.initSpriteFrame;
        }
    },
    //碰撞检测
    onCollisionEnter: function(other, self){
        cc.audioEngine.play(this.hitedMusic);
        if (other.node.group !== 'bullet') {
            return;
        }
        if (this.enemyHp === 1) {
            this.explodingAnim();
            this.enemyHp--;
            
            return;
        }
        if (this.enemyHp > 0) {
            this.enemyHp--;
            this.text.string=this.enemyHp
        }
    },
    explodingAnim: function () {
        // 播放爆炸音效
        cc.audioEngine.play(this.explosionSound);
        let anim = this.getComponent(cc.Animation);
        let animName = this.node.name + '_exploding';
        anim.play(animName);
        anim.on('finished',  this.onHandleDestroy, this);
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(D.commonState.gameScore%20===0){
            D.commonState.gameScore+=10
            this.speedMax+=50
            this.speedMin+=50
            this.HP++
        }
        this.node.y -= dt * this.speed;
        //出屏幕后 回收节点
        if (this.node.y < -this.node.parent.height / 2){
            this.enemyGroup.destroyEnemy(this.node);
        }
    },
    onHandleDestroy: function () {
        // Demo中零时使用，后续要使用对象池，参考bullet
        this.enemyGroup.destroyEnemy(this.node, this.score);
    }
});
