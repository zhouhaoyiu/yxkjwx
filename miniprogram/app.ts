// app.ts
App<IAppOption>({
    globalData: {},
    onLaunch() {
        // 展示本地存储能力
        const logs = wx.getStorageSync("logs") || [];
        logs.unshift(Date.now());
        wx.setStorageSync("logs", logs);

        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function (res) {
            console.log(res.hasUpdate)
        })

        updateManager.onUpdateReady(function () {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success(res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
            })
        })

        updateManager.onUpdateFailed(function () {
            // 新版本下载失败
        })
        // 登录
        wx.login({
            success: (res) => {
                if (!res.code) {
                    return;
                }
                wx.request({
                    url: "https://zhouhaoyiu.oicp.vip/Wx/login",
                    // url: "http://localhost:8092/Wx/login",
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
