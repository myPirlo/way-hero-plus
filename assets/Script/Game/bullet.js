cc.Class({
    extends: cc.Component,

    properties: {
        speed: cc.Integer,
    },

    // use this for initialization
    onLoad: function () {

    },
    //碰撞检测
    onCollisionEnter: function(other, self){
        this.bulletGroup.destroyBullet(self.node);
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.node.y += dt * this.speed*D.commonState.shotSpeed*D.commonState.buffShotSpeed;
        if (this.node.y > this.node.parent.height){
            this.bulletGroup.destroyBullet(this.node);
        }
    },
});
