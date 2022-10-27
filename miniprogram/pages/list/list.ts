Page({
    /**
     * 页面的初始数据
     */
    data: {
        testInfo: [
            {
                id: 0,
                status: 0,
                subName: "xx",
                time: new Date().toLocaleString(),
            },
            {
                id: 1,
                status: 1,
                subName: "xx",
                time: new Date().toLocaleString(),
            },
            {
                id: 2,
                status: 2,
                subName: "xx",
                time: new Date().toLocaleString(),
            },
            {
                id: 3,
                status: 1,
                subName: "xx",
                time: new Date().toLocaleString(),
            },
            {
                id: 4,
                status: 2,
                subName: "xx",
                time: new Date().toLocaleString(),
            },
            {
                id: 5,
                status: 1,
                subName: "xx",
                time: new Date().toLocaleString(),
            },
        ],
    },

    goDetails(e: any) {
        console.log(e.currentTarget.dataset.listid);
        wx.navigateTo({
            url: "/pages/details/details?listId=" + e.currentTarget.dataset.listid,
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.getTabBar().setData({
            selected: 1,
        });
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
        wx.request({
            url: "http://localhost:8092/Job/test",
            success(res) {
                console.log(res);
            },
        });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() { },
});
