// app.ts
App<IAppOption>({
    globalData: {},
    onLaunch() {
        // 展示本地存储能力
        const logs = wx.getStorageSync("logs") || [];
        logs.unshift(Date.now());
        wx.setStorageSync("logs", logs);

        // 登录
        wx.login({
            success: (res) => {
                if (!res.code) {
                    return;
                }
                wx.request({
                    // url: "https://zhouhaoyiu.oicp.vip/Wx/login",
                    url: "http://localhost:8092/Wx/login",
                    data: {
                        code: res.code
                    },
                    success(res) {
                        wx.setStorageSync("openId", res.data)
                    }
                })
            },
        });
    },
});
