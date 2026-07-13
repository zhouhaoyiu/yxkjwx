import Toast, { ToastOptionsType } from "tdesign-miniprogram/toast";
Page({
    /**
     * 页面的初始数据
     */
    data: {
        sendPage: 1,
        sendInfo: [] as GroupedRecordJobs[]
    },
    toast(option: ToastOptionsType) {
        Toast({
            context: this,
            selector: "#toast",
            ...option,
        });
    },

    handleToast(message: string | ToastOptionsType) {
        this.toast({
            message: typeof message === "string" ? message : message.message,
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        wx.hideShareMenu({})
        this.getTabBar().setData({
            selected: 3
        });
        const openId = wx.getStorageSync("openId");
        const that = this;
        try {
            wx.request({
                method: "GET",
                url: "https://zhouhaoyiu.oicp.vip/recordJob/getSendRecordJobByPage",
                data: {
                    page: this.data.sendPage,
                    sendOpenId: openId,
                },
                success: (res: { data: RecordJob[] }) => {
                    if (res.data instanceof Array) {
                        let infoDate = new Set() as Set<string>;
                        res.data.forEach((ele: { jobDate: string }) => {
                            infoDate.add(String(ele.jobDate))
                        })
                        let info: GroupedRecordJobs[] = [];
                        infoDate.forEach((element) => {
                            let jobInfo: RecordJob[] = [];
                            res.data.forEach((item) => {
                                if (item.jobDate === element) {
                                    jobInfo.push(item);
                                }
                            });
                            info.push({
                                jobDate: element,
                                jobInfo: jobInfo,
                            });
                        });
                        that.setData({
                            sendInfo: info,
                        });
                    }
                }
            })
        } catch (e) {
            this.handleToast({
                message: "网络错误",
            });
        } finally {

        }
    },

    goDetails(e: MiniEvent<Record<string, never>, { jobuuid: string }>) {
        wx.navigateTo({
            url: "/pages/recordDetails/recordDetails?jobUuid=" + e.currentTarget.dataset.jobuuid,
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
    onShareAppMessage() { }
});
