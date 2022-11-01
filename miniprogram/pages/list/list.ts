import Toast, { ToastOptionsType } from "tdesign-miniprogram/toast/index";
Page({
    /**
     * 页面的初始数据
     */
    data: {
        tabBarIndex: 0,
        sendPage: 1,
        verifyPage: 1,
        sendInfo: [] as any,
        verifyInfo: [] as any
    },
    changeTabBar(e: any) {
        this.setData({
            tabBarIndex: e.detail.value
        })
    },
    goDetails(e: any) {
        console.log(e);

        wx.navigateTo({
            url: "/pages/details/details?jobUuid=" + e.currentTarget.dataset.jobuuid,
        });
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
        const openId = wx.getStorageSync("openId")
        const that = this;
        this.getTabBar().setData({
            selected: 1,
        });
        try {
            wx.request({
                method: "GET",
                url: "https://zhouhaoyiu.oicp.vip/Job/getSendJobByPage",
                // url: "http://localhost:8092/Job/getSendJobByPage",
                data: {
                    page: this.data.sendPage,
                    sendOpenId: openId
                },
                success(res) {
                    console.log(res);
                    that.setData({
                        sendInfo: res.data
                    })
                },
                fail(_e) {
                    that.handleToast({
                        message: '网络错误',
                    });
                }
            })
            wx.request({
                method: "GET",
                url: "https://zhouhaoyiu.oicp.vip/Job/getVerifyJobByPage",
                // url: "http://localhost:8092/Job/getVerifyJobByPage",
                data: {
                    page: this.data.verifyPage,
                    verifyOpenId: openId
                },
                success(res) {
                    that.setData({
                        verifyInfo: res.data
                    })
                }
            })
        }
        catch (e) {
            this.handleToast({
                message: '网络错误',
            })
        }
        finally {

        }
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
