cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        prefab: cc.Prefab
    },

    start () {       
        console.log(this.content)
        wx.onMessage( data => {
            if(data.score){
                this.wxSetScore(data.score)
            }
        });
        this.wxGetFriendScore()
    },
    wxSetScore(dataScore){
            let _self = this;
            wx.getUserCloudStorage({
                keyList:['score','time'],
                success(res){
                    console.log('获得当前用户分数成功',res)
                    if(res.KVDataList&&res.KVDataList.length>0){
                        this.myScore=Number(res.KVDataList[0].value)
                    }
                    
                    if((dataScore>this.myScore)||(!res.KVDataList)||(res.KVDataList.length<=1)||!_self.isWeekFun(Number(res.KVDataList[1].value))){
                        wx.setUserCloudStorage({
                            KVDataList:[
                                {
                                    key:'score',value:String(dataScore)
                                },
                                {
                                    key:'time',value:String((new Date()).valueOf())
                                }
                            ],
                            success(res){
                                console.log('上传分数成功',res)
                                _self.wxGetFriendScore()
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
    },
    wxGetFriendScore(){
        //先清空子节点???坑爹的
        this.content.destroyAllChildren()
        let _self = this;
        wx.getFriendCloudStorage({
            keyList:['score','time'],
            success: function (res) {
                console.log('朋友列表',res)
                let dataContainer=res.data
                //循环创建分数条目
                for (let k = 0; k < dataContainer.length; k++) {
                    //首批用户的重置操作
                    if(dataContainer[k].KVDataList.length<2){ 
                        dataContainer[k].KVDataList[0].value=0
                    }else if(!_self.isWeekFun(Number(dataContainer[k].KVDataList[1].value))){
                        //不在本周,显示为0
                        console.log(dataContainer[k])
                        dataContainer[k].KVDataList[0].value=0
                    }
                }
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

    isWeekFun (time) {
        // 当前时间
        var timestamp = Date.parse(new Date())
        var serverDate = new Date(timestamp)
        // 本周周日的的时间
        var sundayTiem = timestamp + ((7 - serverDate.getDay()) * 24 * 60 * 60 * 1000)
        var SundayData = new Date(sundayTiem)
        // 年
        var tomorrowY = SundayData.getFullYear()
        // 月
        var tomorrowM = (SundayData.getMonth() + 1 < 10 ? '0' + (SundayData.getMonth() + 1) : SundayData.getMonth() + 1)
        // 日
        var tomorrowD = SundayData.getDate() < 10 ? '0' + SundayData.getDate() : SundayData.getDate()
        // 本周周一的时间
        var mondayTime = timestamp - ((serverDate.getDay() - 1) * 24 * 60 * 60 * 1000)
        var mondayData = new Date(mondayTime)
        // 年
        var mondayY = mondayData.getFullYear()
        // 月
        var mondayM = (mondayData.getMonth() + 1 < 10 ? '0' + (mondayData.getMonth() + 1) : mondayData.getMonth() + 1)
        // 日
        var mondayD = mondayData.getDate() < 10 ? '0' + mondayData.getDate() : mondayData.getDate()
        // 当前时间
        var currentData = new Date(time)
        // 年
        var currentY = currentData.getFullYear()
        // 月
        var currentM = (currentData.getMonth() + 1 < 10 ? '0' + (currentData.getMonth() + 1) : currentData.getMonth() + 1)
        // 日
        var currentD = currentData.getDate() < 10 ? '0' + currentData.getDate() : currentData.getDate()
        // 时
        var currenH = currentData.getHours()
        // 分
        var currenM = currentData.getMinutes()
        var str = '星期' + '日一二三四五六'.charAt(currentData.getDay())
        var sundayDay = tomorrowY + tomorrowM + tomorrowD
        var mondayDay = mondayY + mondayM + mondayD
        var currentDay = currentY + currentM + currentD
        parseInt(currentDay)
        parseInt(mondayDay)
        if (parseInt(sundayDay)>=parseInt(currentDay)+1 && parseInt(currentDay)+1 >= parseInt(mondayDay)) {
            return true
          } else {
            return false
        }
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