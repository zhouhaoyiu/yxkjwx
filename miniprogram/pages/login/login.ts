// pages/login/login.ts
Page({
    /**
     * 页面的初始数据
     */
    data: {},

    wxLogin() {
        // wx.getUserProfile({
        //     desc: "用于完善用户资料",
        //     success: (res) => {
        //         console.log(res);
        //         wx.switchTab({
        //             url: "/pages/home/home",
        //         });
        //     },
        // });
        wx.switchTab({
            url: "/pages/home/home",
        });
    },
    onGetPhoneNumber(e: any) {
        console.log(e);
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() { },

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
    onPullDownRefresh() { },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() { },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() { },
});
