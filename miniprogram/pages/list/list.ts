import Toast, { ToastOptionsType } from "tdesign-miniprogram/toast/index";
// @ts-nocheck
Page({
    /**
     * 页面的初始数据
     */
    data: {
        tabBarIndex: 0,
        sendPage: 1,
        verifyPage: 1,
        sendInfo: [] as any,
        verifyInfo: [] as any,
    },
    changeTabBar(e: any) {
        this.setData({
            tabBarIndex: e.detail.value,
        });
    },
    goDetails(e: any) {
        console.log(e);

        wx.navigateTo({
            url: "/pages/workDetails/workDetails?workUuid=" + e.currentTarget.dataset.workuuid,
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
        wx.hideShareMenu({});
        const openId = wx.getStorageSync("openId");
        const that = this;
        this.getTabBar().setData({
            selected: 2,
        });
        try {
            wx.request({
                method: "GET",
                // url: "https://zhouhaoyiu.oicp.vip/Job/getSendJobByPage",
                url: "http://localhost:8092/workJob/getSendWorkJobByPage",
                data: {
                    page: this.data.sendPage,
                    sendOpenId: openId,
                },
                success(res: any) {
                    console.log(res);
                    if (res.data instanceof Array) {
                        let infoDate = new Set() as Set<string>;
                        res.data.forEach((element: { workDate: string }) => {
                            infoDate.add(String(element.workDate));
                        });

                        let info: { workDate: string; workInfo: any[] }[] = [];
                        infoDate.forEach((element) => {
                            let workInfo: any[] = [];
                            res.data.forEach((item: { workDate: string }) => {
                                if (item.workDate === element) {
                                    workInfo.push(item);
                                }
                            });
                            info.push({
                                workDate: element,
                                workInfo: workInfo,
                            });
                        });
                        that.setData({
                            sendInfo: info,
                        });
                    }
                },
                fail(_e) {
                    that.handleToast({
                        message: "网络错误",
                    });
                },
            });
            console.log(openId, 123);

            wx.request({
                method: "GET",
                // url: "https://zhouhaoyiu.oicp.vip/Job/getVerifyJobByPage",
                url: "http://localhost:8092/workJob/getVerifyWorkJobByPage",
                data: {
                    page: this.data.verifyPage,
                    verifyOpenId: openId,
                },
                success(res: any) {
                    if (res.data instanceof Array) {
                        if (res.data) {
                            let infoDate = new Set() as Set<string>;
                            res.data.forEach((element: { workDate: string }) => {
                                infoDate.add(String(element.workDate));
                            });

                            let info: { workDate: string; workInfo: any[] }[] = [];
                            infoDate.forEach((element) => {
                                let workInfo: any[] = [];
                                res.data.forEach((item: { workDate: string }) => {
                                    if (item.workDate === element) {
                                        workInfo.push(item);
                                    }
                                });
                                info.push({
                                    workDate: element,
                                    workInfo: workInfo,
                                });
                            });
                            that.setData({
                                verifyInfo: info,
                            });
                        }
                    }
                },
            });
        } catch (e) {
            this.handleToast({
                message: "网络错误",
            });
        } finally {
            console.log("success");
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
        const openId = wx.getStorageSync("openId");
        const that = this;
        const pageName = this.data.tabBarIndex == 0 ? "sendPage" : "verifyPage";
        this.setData({
            [pageName]: 1,
        });
        const url =
            // this.data.tabBarIndex == 0
            //     ? "https://zhouhaoyiu.oicp.vip/Job/getSendJobByPage"
            //     : "https://zhouhaoyiu.oicp.vip/Job/getVerifyJobByPage";
            this.data.tabBarIndex == 0
                ? "http://localhost:8092/workJob/getSendWorkJobByPage"
                : "http://localhost:8092/workJob/getVerifyWorkJobByPage";
        wx.showLoading({
            title: "加载中",
        });
        try {
            wx.request({
                method: "GET",
                url: url,
                data: {
                    page: this.data[pageName],
                    [this.data.tabBarIndex == 0 ? "sendOpenId" : "verifyOpenId"]: openId,
                },
                success(res: any) {
                    console.log(res);
                    if (res.data instanceof Array) {
                        let infoDate = new Set() as Set<string>;
                        res.data.forEach((element: { workDate: unknown }) => {
                            infoDate.add(String(element.workDate));
                        });

                        let info: { workDate: string; workInfo: any[] }[] = [];
                        infoDate.forEach((element) => {
                            let workInfo: any[] = [];
                            res.data.forEach((item: { workDate: string }) => {
                                if (item.workDate === element) {
                                    workInfo.push(item);
                                }
                            });
                            info.push({
                                workDate: element,
                                workInfo: workInfo,
                            });
                        });
                        that.setData({
                            [that.data.tabBarIndex == 0 ? "sendInfo" : "verifyInfo"]: info,
                        });
                    }
                    wx.hideLoading();
                    wx.stopPullDownRefresh();
                },
            });
        } catch (e) {
            this.handleToast({
                message: "网络错误",
            });
        } finally {
        }
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        console.log(123);

        const openId = wx.getStorageSync("openId");
        const pageName = this.data.tabBarIndex == 0 ? "sendPage" : "verifyPage";
        const url =
            // this.data.tabBarIndex == 0
            //     ? "https://zhouhaoyiu.oicp.vip/Job/getSendJobByPage"
            //     : "https://zhouhaoyiu.oicp.vip/Job/getVerifyJobByPage";
            this.data.tabBarIndex == 0
                ? "http://localhost:8092/workJob/getSendWorkJobByPage"
                : "http://localhost:8092/workJob/getVerifyWorkJobByPage";
        const that = this;
        this.setData({
            [pageName]: this.data[pageName] + 1,
        });
        wx.request({
            url: url,
            method: "GET",
            data: {
                page:
                    this.data.tabBarIndex == 0
                        ? this.data.sendPage
                        : this.data.verifyPage,
                [this.data.tabBarIndex == 0 ? "sendOpenId" : "verifyOpenId"]: openId,
            },
            success(res) {
                if (res.data instanceof Array && res.data.length == 0) {
                    that.handleToast({
                        message: "没有更多了",
                    });
                    return;
                }
                if (res.data instanceof Array) {
                    let infoDate = new Set() as Set<string>;
                    res.data.forEach((element: { workDate: unknown }) => {
                        infoDate.add(String(element.workDate));
                    });

                    let currentInfo =
                        that.data.tabBarIndex == 0
                            ? that.data.sendInfo
                            : (that.data.verifyInfo as Array<{
                                workDate: string;
                                workInfo: any[];
                            }>);

                    res.data.forEach((element: { workDate: string }) => {
                        let flag = false;
                        currentInfo.forEach(
                            (item: { workDate: string; workInfo: { workDate: string }[] }) => {
                                if (item.workDate === element.workDate) {
                                    item.workInfo.push(element);
                                    flag = true;
                                }
                            }
                        );
                        if (!flag) {
                            currentInfo.push({
                                workDate: element.workDate,
                                workInfo: [element],
                            });
                        }
                    });

                    that.setData({
                        [that.data.tabBarIndex == 0 ? "sendInfo" : "verifyInfo"]:
                            currentInfo,
                    });
                }
            },
        });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() { },
});
