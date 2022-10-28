Page({
    /**
     * 页面的初始数据
     */
    data: {
        page: 1,
        testInfo: [] as any
    },

    goDetails(e: any) {
        console.log(e);

        wx.navigateTo({
            url: "/pages/details/details?jobUuid=" + e.currentTarget.dataset.jobuuid,
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        const openId = wx.getStorageSync("openId")
        console.log(openId);

        const that = this;
        this.getTabBar().setData({
            selected: 1,
        });
        wx.request({
            method: "GET",
            // url: "https://zhouhaoyiu.oicp.vip/Job/getJobByPage",
            url: "http://localhost:8092/Job/getJobByPage",
            data: {
                page: this.data.page,
                sendOpenId: openId
            },
            success(res) {
                console.log(res);
                that.setData({
                    testInfo: res.data
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() { },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() { },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() { },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() { },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        console.log("到底了");
        // wx.request({
        //     url: "https://zhouhaoyiu.oicp.vip/Job/test",
        //     success(res) {
        //         console.log(res);
        //     },
        // });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() { },
});
