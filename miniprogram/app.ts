// app.ts
App<IAppOption>({
    globalData: {},
    onLaunch() {
        const updateManager = wx.getUpdateManager()
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

        wx.login({
            success: (res) => {
              return true
                // if (!res.code) {
                //     return;
                // }
            //     wx.request({
            //         // url: "https://zhouhaoyiu.oicp.vip/Wx/login",
            //         url: "https://zhouhaoyiu.oicp.vip/Wx/login",
            //         data: {
            //             code: res.code
            //         },
            //         success(res) {
            //             try {
            //                 wx.setStorageSync("openId", res.data)
            //             }
            //             catch (e) {
            //                 console.log(e);
            //             }
            //         }
            //     })
            },
        });
    },
});
