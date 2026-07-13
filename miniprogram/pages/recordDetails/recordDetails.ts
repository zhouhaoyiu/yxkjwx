Page({
    /**
     * 页面的初始数据
     */
    data: {
        jobUuid: "",
        info: {} as Record<string, unknown>,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(opt: Record<string, string>) {
        wx.hideShareMenu({});
        const that = this;
        this.setData({
            jobUuid: opt.jobUuid,
        });
        wx.request({
            method: "GET",
            url: "https://zhouhaoyiu.oicp.vip/recordJob/getInfoByRecordJobUuid",
            data: {
                jobUuid: this.data.jobUuid,
            },
            success(res: { data: RecordJob[] }) {
                const item = res.data[0];
                if (!item) return;
                that.setData({
                    info: {
                        ...item,
                        positionList: JSON.parse(item.positionList),
                        interruptList: JSON.parse(item.interruptList),
                    },
                });
            },
        });
    },

    previewImgByBase64(e: MiniEvent<Record<string, never>, { imgname: string }>) {
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
    },
});
