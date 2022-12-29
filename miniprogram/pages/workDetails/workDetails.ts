// pages/workDetails/workDetails.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        workUuid: "",

        workDate: "",
        workList: [],
        zyfzr: "",
        jhry: "",
        zyry: "",
        nProtectiveMeasureGroups: [] as unknown as [Boolean, Boolean],
        spfzr: "",
        spfzrBase64: "",
        spfzrInfo: "",
        status: 0,
        verifyDate: ""
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
                let protectiveMeasureGroups = JSON.parse(_res.data[0].protectiveMeasureGroups);
                let step1: Boolean = protectiveMeasureGroups.includes("step1") || false;
                let step2: Boolean = protectiveMeasureGroups.includes("step2") || false;
                let nProtectiveMeasureGroups: [Boolean, Boolean] = [step1, step2];
                if (_res.data[0].status !== 0) {
                    wx.hideShareMenu({});
                };
                this.setData({
                    workDate: _res.data[0].workDate,
                    workList: JSON.parse(_res.data[0].workList),
                    zyfzr: _res.data[0].zyfzr,
                    jhry: _res.data[0].jhry,
                    zyry: _res.data[0].zyry,
                    nProtectiveMeasureGroups: nProtectiveMeasureGroups,
                    spfzr: _res.data[0].spfzr,
                    spfzrBase64: _res.data[0].spfzrBase64,
                    spfzrInfo: _res.data[0].spfzrInfo,
                    status: _res.data[0].status,
                    verifyDate: _res.data[0].verifyDate
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
        return {
            title: "邀请您进行审批",
            path: "pages/verify/verify?workUuid=" + this.data.workUuid,
        };
    }
})