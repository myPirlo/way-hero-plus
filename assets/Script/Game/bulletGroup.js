// 子弹生成的位置
const bulletPosition = cc.Class({
    name: 'bulletPosition',
    properties: {
        positionX: {
            default: '',
            tooltip: '子弹相对Hero的位置'
        }
    }
});

// 无限时长子弹
const infiniteBullet = cc.Class({
    name: 'infiniteBullet',
    properties: {
        name: '',
        rate: 0,
        poolAmount: 0,
        prefab: cc.Prefab,
        position: {
            default: [],
            type: bulletPosition,
            tooltip: '子弹位置'
        }
    }
});

// 有限时长子弹
const finiteBullet = cc.Class({
    extends: infiniteBullet,
    name: 'finiteBullet',
    properties: {
        duration: 0,
        ufoBulletName: ''
    }
});


// 有限时长子弹
cc.Class({
    extends: cc.Component,

    properties:() => ({
        infiniteBullet: {
            default: null,
            type: infiniteBullet,
            tooltip: '无限子弹'
        },
        finiteBullet: {
            default: [],
            type: finiteBullet,
            tooltip: '有限子弹'
        },
        hero: cc.Node,
        bulletSound: {
            default: null,
            type: cc.AudioClip,
        },
        atk:cc.Integer
    }),

    onLoad: function () {
        // 初始化对象池
        D.common.initNodePool(this, this.infiniteBullet);
        D.common.batchInitNodePool(this, this.finiteBullet);
    },
    // 发射子弹，定时器
    startAction: function () {
        this.startShoot = function () {
            this.genNewBullet(this.infiniteBullet);
            //cc.audioEngine.play(this.bulletSound,false,0.5);
        }.bind(this);
        // 定时器 发射子弹的就是创建子弹对象
        this.startFire()
    },
    startFire(){
        this.startBulletTimer=setInterval(
            //promise的写法是需要带()的
            this.startShoot
        , this.infiniteBullet.rate*1000/D.commonState.shotSpeed/D.commonState.buffShotSpeed);
    },
    stopFire(){
        clearInterval(this.startBulletTimer)
    },
    reStartFire(){
        this.stopFire()
        this.startAction()
    },
    // 生成子弹
    genNewBullet: function (bulletInfo) {
        let poolName = bulletInfo.name + 'Pool';
        for(let i = 0; i < bulletInfo.position.length; i++) {
            let newNode = D.common.genNewNode(this[poolName], bulletInfo.prefab, this.node);
            let pos = this.getBulletPosition(bulletInfo.position[i].positionX);
            newNode.setPosition(pos);
            // 这是个很基础的知识点，需要小心！
            // newNode.getComponent('bullet') 找到的是bullet脚本组件
            // 这里将this传进去，是为了下面bullet中调用destroyBullet方法时，this对象不变
            // 如果：newNode.getComponent('bullet').died = this.destroyBullet;
            // 那么只是将这个方法传给了bullet，当在bullet中使用该函数，函数的当前上下文就变了
            // 可以试试在 destroyBullet 中打印一下 this 看看当前的上下文
            newNode.getComponent('bullet').bulletGroup = this;
        }
    },
    //获取子弹位置
    getBulletPosition: function(positionStr){

        let heroP = this.hero.getPosition();
        var newV2_x = heroP.x
        let newV2_y = heroP.y;

        if(positionStr=='-this.hero.width/3'){
            newV2_x = heroP.x + (-this.hero.width/3);
        }
        if(positionStr=='this.hero.width/3'){
            newV2_x = heroP.x + (this.hero.width/3);
        }
  
        return cc.v2(newV2_x, newV2_y);
    },
    // 更换子弹
    changeBullet: function (ufoBulletName) {
        this.reStartFire()
        // this.unschedule(this.startShoot);
        // for (let i = 0; i < this.finiteBullet.length; i++) {
        //     if (this.finiteBullet[i].ufoBulletName === ufoBulletName) {
        //         let startDoubleShoot = function (i) {
        //             this.genNewBullet(this.finiteBullet[i]);
        //             cc.audioEngine.play(this.bulletSound,false,0.2);
        //         }.bind(this, i);
        //         // 设置一个延时，当一个定时器走完之后，另一个延时结束，开始执行
        //         this.schedule(startDoubleShoot, this.finiteBullet[i].rate, this.finiteBullet[i].duration);
        //         let delay = this.finiteBullet[i].rate * this.finiteBullet[i].duration;
        //         this.schedule(this.startShoot, this.infiniteBullet.rate, cc.macro.REPEAT_FOREVER, delay);
        //     }
        // }

    },
    //销毁子弹
    destroyBullet: function (node) {
        // bullet中是由bulletGroup调用，所以当前this为bulletGroup
        D.common.putBackPool(this, node);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
