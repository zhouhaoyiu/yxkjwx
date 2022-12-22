// pages/workDetails/workDetails.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        workUuid: "",

        workDate: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(opt: Record<string, string>) {
        const openId = wx.getStorageSync("openId");
        this.setData({
            workUuid: opt.workUuid,
        })

        wx.request({
            url: "http://localhost:8092/workJob/getInfoByWorkJobUuid",
            data: {
                workUuid: this.data.workUuid
            },
            method: "GET",
            success: (_res: any) => {
                console.log(_res);
                console.log(JSON.parse(_res.data[0].workList));
                this.setData({
                    workDate: _res.data[0].workDate
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})