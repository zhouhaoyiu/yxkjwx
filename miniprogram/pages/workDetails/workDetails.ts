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
        nProtectiveMeasureGroups: [] as unknown as [boolean, boolean],
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
        this.setData({
            workUuid: opt.workUuid,
        })

        wx.request({
            url: "https://zhouhaoyiu.oicp.vip/workJob/getInfoByWorkJobUuid",
            data: {
                workUuid: this.data.workUuid
            },
            method: "GET",
            success: (_res: { data: WorkJobPayload[] }) => {
                const item = _res.data[0];
                if (!item) return;
                let protectiveMeasureGroups = JSON.parse(item.protectiveMeasureGroups);
                let step1: boolean = protectiveMeasureGroups.includes("step1") || false;
                let step2: boolean = protectiveMeasureGroups.includes("step2") || false;
                let nProtectiveMeasureGroups: [boolean, boolean] = [step1, step2];
                if (item.status !== 0) {
                    wx.hideShareMenu({});
                };
                this.setData({
                    workDate: item.workDate,
                    workList: JSON.parse(item.workList),
                    zyfzr: item.zyfzr,
                    jhry: item.jhry,
                    zyry: item.zyry,
                    nProtectiveMeasureGroups: nProtectiveMeasureGroups,
                    spfzr: item.spfzr,
                    spfzrBase64: item.spfzrBase64,
                    spfzrInfo: item.spfzrInfo,
                    status: item.status,
                    verifyDate: item.verifyDate
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
