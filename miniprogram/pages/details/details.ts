Page({
    /**
     * 页面的初始数据
     */
    data: {
        jobUuid: 0,
        info: {},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(opt: any) {
        console.log(opt);
        const that = this;
        this.setData({
            jobUuid: opt.jobUuid,
        });
        wx.request({
            method: "GET",
            // url: "https://zhouhaoyiu.oicp.vip/Job/getInfoByJobUuid",
            url:"http://localhost:8092/Job/getInfoByJobUuid",
            data: {
                jobUuid: this.data.jobUuid,
            },
            success(res: any) {
                console.log(res);

                res.data[0].positionList = JSON.parse(res.data[0].positionList)
                if (res.data[0].status != 1) {
                    wx.hideShareMenu({});
                }
                that.setData({
                    info: res.data[0],
                });
            },
        });
    },

    previewImgByBase64(e: any) {
        const imgname = e.currentTarget.dataset.imgname as string;
        // @ts-ignore
        const base64 = "data:image/jpeg;base64," + this.data.info[imgname];

        wx.previewImage({
            urls: [base64],
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
    onPullDownRefresh() { },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() { },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
        return {
            title: "邀请您进行审批",
            path: "pages/verify/verify?jobUuid=" + this.data.jobUuid,
        };
    },
});
