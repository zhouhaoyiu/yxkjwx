import Toast, { ToastOptionsType } from "tdesign-miniprogram/toast/index";
Page({
    /**
     * 页面的初始数据
     */
    data: {
        pin: ""
    },
    setInputData(e: any) {
        this.setData({
            [e.target.dataset.inputfield]: e.detail.value,
        });
    },
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
        if (this.data.pin == "tygscbyx") {
            wx.switchTab({
                url: "/pages/home/home",
            });
            wx.setStorageSync("login", true);
        }
        else {
            this.handleToast({
                message: `pin码错误`,
            });
        }
    },
    onGetPhoneNumber(e: any) {
        console.log(e);
    },
    toast(option: ToastOptionsType) {
        Toast({
            context: this,
            selector: "#t-toast",
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
        const login = wx.getStorageSync('login') || false
        if (login) {
            wx.switchTab({
                url: "/pages/home/home",
            });
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
