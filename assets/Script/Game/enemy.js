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
        MaxSpeedY: 0,
        MinSpeedY: 0,
        MaxSpeedX: 0,
        MinSpeedX: 0,
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
        if(this.text){
            this.text.string=this.HP
        }
        this.direction=Math.random()>0.5?1:-1
        this.speedY = Math.random() * (this.MaxSpeedY - this.MinSpeedY + 1) + this.MinSpeedY;
        this.speedX = Math.random() * (this.MaxSpeedX - this.MinSpeedX + 1) + this.MinSpeedX*this.direction;
        
        
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
        if(other.name=='protect<BoxCollider>'){
            this.explodingAnim();
            return
        }
        if (other.node.group !== 'bullet') {
            return;
        }
        this.enemyHp-=(D.commonState.atk+D.commonState.buffatk);
       
        if(this.text){
            this.text.string=this.enemyHp
        }
        if (this.enemyHp <= 0) {
            if(this.text){
                this.text.string=0
            }
            this.explodingAnim();
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
            this.HP+=10
            this.speedY+=20
        }
        this.node.y -= dt * this.speedY;
        if(D.commonState.gameScore>1050){
            this.node.x += dt * this.speedX;
        }
        //出屏幕后 回收节点
        if (this.node.y < -this.node.parent.height / 2){
            
            this.enemyGroup.destroyEnemy(this.node);
            
            return
        }
        if (this.node.x-this.node.width/2 < -this.node.parent.width / 2){
            this.speedX=-this.speedX
            //this.enemyGroup.destroyEnemy(this.node);
            
            return
        }
        if (this.node.x+this.node.width/2 > this.node.parent.width / 2){
            this.speedX=-this.speedX
            //this.enemyGroup.destroyEnemy(this.node);
            return
        }
    },
    onHandleDestroy: function () {
        // Demo中零时使用，后续要使用对象池，参考bullet
        this.enemyGroup.destroyEnemy(this.node, this.score);
    }
});
