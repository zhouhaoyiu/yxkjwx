// pages/home/home.ts
Page({
    /**
     * 页面的初始数据
     */
    data: {
        workList: [
            {
                id: 0,
                workContent: "",
                workPosition: ""
            }
        ],
        workListIndex: 1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.getTabBar().setData({
            selected: 0
        });
    },

    addWork() {
        let temp = this.data.workList;
        temp.push({
            id: this.data.workListIndex,
            workContent: "",
            workPosition: ""
        });
        this.setData({
            workList: temp,
            workListIndex: this.data.workListIndex + 1
        });
    },

    deleteWork(e: any) {
        const { id } = e.target.dataset;
        let temp = this.data.workList;
        // 至少保留一条工作
        if (temp.length <= 1) {
            return;
            // wx.showToast({
            //     title: '需要至少保留一条',
            //     icon: 'none'
            // })
        }
        temp = temp.filter((item: any) => item.id != id);
        this.setData({
            workList: temp
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {}
});
