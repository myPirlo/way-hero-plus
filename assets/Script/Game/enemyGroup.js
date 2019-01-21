const enemyG = cc.Class({
    name: 'enemyG',
    properties: {
        name: '',
        prefab: cc.Prefab,
        freq: 0,
        poolAmount: 0
    }
});

cc.Class({
    extends: cc.Component,
    properties: {
        enemyGroup: {
            default: [],
            type: enemyG,
        },
        mainScript: {
            default: null,
            type: require('main'),
        },
        startTimer:[]
    },

    // use this for initialization
    onLoad: function () {
        D.common.batchInitNodePool(this, this.enemyGroup);
    },
    // 敌机出动
    startAction: function () {
        console.log(D.commonState.enemyFeq)
        // 每组敌机都需要设置定时器
        for(let i = 0; i < this.enemyGroup.length; i++) {
            let groupName = this.enemyGroup[i].name;
            let freq = this.enemyGroup[i].freq;
            this[groupName] = function (i) {
                this.genNewEnemy(this.enemyGroup[i]);
            }.bind(this, i)
            this.startTimer[i]=setInterval(this[groupName], freq*1000/D.commonState.enemyFeq);
        }
    },
    stopAction(){
        for(var i=0;i<this.startTimer.length;i++){
            clearInterval(this.startTimer[i])
        }
    },
    reStartAction(){
        this.stopAction()
        this.startAction()
    },
    // 生成敌机
    genNewEnemy: function (enemyInfo) {
        let poolName = enemyInfo.name + 'Pool';
        let newNode = D.common.genNewNode(this[poolName], enemyInfo.prefab, this.node);
        let pos = this.getNewEnemyPosition(newNode);
        newNode.setPosition(pos);
        newNode.getComponent('enemy').enemyGroup = this;
        // 初始化敌机状态
        newNode.getComponent('enemy').enemyInit();
    },
    //敌机随机生成的位置
    getNewEnemyPosition: function(newEnemy) {
        //位于上方，先不可见
        let randx = (Math.random() - 0.5) * 2 * (this.node.parent.width / 2 - newEnemy.width);
        let randy = this.node.parent.height / 2 + newEnemy.height / 2;
        return cc.v2(randx,randy);
    },
    // 销毁
    destroyEnemy: function (node, score = 0) {
        D.common.putBackPool(this, node);
        score && this.mainScript.changeScore(score);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
