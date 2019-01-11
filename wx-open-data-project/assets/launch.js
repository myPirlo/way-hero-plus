cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        prefab: cc.Prefab
    },

    start () {
        let _self = this;
        

        wx.onMessage( data => {
            console.log(data.message);
        });

        // https://developers.weixin.qq.com/minigame/dev/document/open-api/data/wx.getUserInfo.html
        // wx.getUserInfo({
        //     openIdList: ['selfOpenId'],
        //     lang: 'zh_CN',
        //     success: (res) => {
        //         console.log('当前用户信息', res.data);
        //         let userInfo = res.data[0];
        //         _self.createUserBlock(userInfo);
        //     },
        //     fail: (res) => {
        //         reject(res);
        //     }
        // });

        wx.getUserCloudStorage({
            keyList:['score'],
            success(res){
                console.log('成功获得当前用户分数成功！！',res)
                this.myScore=res.KVDataList[0].value
            },
            fail(res){
                console.log('获得当前用户分数失败',res)
            }
        })
     
        // https://developers.weixin.qq.com/minigame/dev/document/open-api/data/wx.getFriendCloudStorage.html
        wx.getFriendCloudStorage({
            keyList:['score'],
            success: function (res) {
                console.log('获得朋友成功了哦',res)
                console.log('什么鬼东西哦~~~~~~~~~~~~~')
                for (let i = 0; i < 6; i++) {
                    let friendInfo = res.data[i];
                    if (!friendInfo) {
                        _self.createPrefab();
                        continue;
                    }
                    _self.createUserBlock(friendInfo);
                }
            },
            fail: function (res) {
                console.error(res);
            }
        });
    },

    createUserBlock (user) {
        let node = this.createPrefab();
        // getUserInfo will return the nickName, getFriendCloudStorage will return the nickname.
        let nickName = user.nickName ? user.nickName : user.nickname;
        let avatarUrl = user.avatarUrl;

        let userName = node.getChildByName('userName').getComponent(cc.Label);
        let userIcon = node.getChildByName('mask').children[0].getComponent(cc.Sprite);
        let userScoreLabel = node.getChildByName('score').getComponent(cc.Label);

        userScoreLabel.string=user.KVDataList[0].value

        userName.string = nickName;
        console.log(nickName + '\'s info has been getten.');
        cc.loader.load({
            url: avatarUrl, type: 'png'
        }, (err, texture) => {
            if (err) console.error(err);
            userIcon.spriteFrame = new cc.SpriteFrame(texture);
        });                   
    },

    createPrefab () {
        let node = cc.instantiate(this.prefab);
        node.parent = this.content;
        return node;
    }

});
