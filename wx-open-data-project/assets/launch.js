cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        prefab: cc.Prefab
    },

    start () {
        let _self = this;
        wx.onMessage( data => {
            if(data.score){
                wx.getUserCloudStorage({
                        keyList:['score'],
                        success(res){
                            console.log('获得当前用户分数成功',res)
                            if(res.KVDataList&&res.KVDataList.length>0){
                                this.myScore=Number(res.KVDataList[0].value)
                            }
                            
                            if((data.score>this.myScore)||(!res.KVDataList)||(res.KVDataList.length===0)){
                                wx.setUserCloudStorage({
                                    KVDataList:[{key:'score',value:String(data.score)}],
                                    success(res){
                                        console.log('上传分数成功',res)
                                    },
                                    fail(res){
                                        console.log('上传分数成功',res)
                                    }
                                })
                            }  
                        },
                        fail(res){
                            console.log('获得当前用户分数失败',res)
                        }
                })
            }
        });
        // https://developers.weixin.qq.com/minigame/dev/document/open-api/data/wx.getFriendCloudStorage.html
        wx.getFriendCloudStorage({
            keyList:['score'],
            success: function (res) {
                console.log('朋友列表',res)
                let dataContainer=res.data
                //分数从大到小排序
                for(let i=0;i<dataContainer.length-1;i++){
                    for(let j=0;j<dataContainer.length-i-1;j++){
                        if(Number(dataContainer[j].KVDataList[0].value)<Number(dataContainer[j+1].KVDataList[0].value)){
                            let t=dataContainer[j]
                            dataContainer[j]=dataContainer[j+1]
                            dataContainer[j+1]=t
                        }
                    }
                }
                //循环创建分数条目
                for (let k = 0; k < dataContainer.length; k++) {
                    let friendInfo = dataContainer[k];
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
        let userIcon = node.getChildByName('userIcon').getComponent(cc.Sprite);
        let userScoreLabel = node.getChildByName('score').getComponent(cc.Label);

        userScoreLabel.string=user.KVDataList[0].value

        userName.string = nickName;
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