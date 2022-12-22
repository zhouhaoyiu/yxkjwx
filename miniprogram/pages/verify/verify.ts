// @ts-nocheck
import Toast from "tdesign-miniprogram/toast/index";
const width = wx.getSystemInfoSync().windowWidth;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        width,
        jobUuid: 0,
        info: {},
        spr: "",
        sprSignContext: undefined,
        sprSignCanvas: undefined as unknown as WechatMiniprogram.Canvas,
        sprHasDraw: false,
        sprDrawOk: false,
        sprDrawShow: false,
        sprSrc: null,
        sprBase64: null,
        sprbz: "",
        showDialog: false
    },
    touchstart(e: {
        touches: { x: any; y: any }[];
        target: { dataset: { name: string } };
    }) {
        const name = e.target.dataset.name;
        if (this.data[`${name}DrawOk`]) {
            return;
        }

        const canvasContext = this.data[`${name}SignContext`];
        canvasContext.beginPath();
        canvasContext.moveTo(e.touches[0].x, e.touches[0].y);

        this.setData({
            [`${name}SignContext`]: canvasContext,
            [`${name}HasDraw`]: true,
        });
    },

    touchmove(e: {
        touches: { x: any; y: any }[];
        target: { dataset: { name: string } };
    }) {
        const name = e.target.dataset.name;
        if (this.data[`${name}DrawOk`]) {
            return;
        }
        var x = e.touches[0].x;
        var y = e.touches[0].y;
        let canvasContext = this.data[`${name}SignContext`];

        canvasContext.lineTo(x, y);
        canvasContext.stroke();
        this.setData({
            [`${name}SignContext`]: canvasContext,
        });
    },
    signOk(e: { currentTarget: { dataset: { name: string } } }) {
        const name = e.currentTarget.dataset.name;

        if (!this.data[`${name}HasDraw`]) {
            this.handleToast({
                message: `请审批人完成签字`,
            });
            return;
        } else {
            this.handleToast({
                message: `审批人签字成功`,
            });
        }

        wx.canvasToTempFilePath({
            canvas: this.data[`${name}SignCanvas`] as WechatMiniprogram.Canvas,
            success: (res) => {
                const fileManager = wx.getFileSystemManager();
                const base64 = fileManager.readFileSync(res.tempFilePath, "base64");

                this.setData({
                    [`${name}Src`]: res.tempFilePath,
                    [`${name}Base64`]: base64,
                    [`${name}DrawOk`]: true,
                    [`${name}DrawShow`]: false,
                });
                let canvasContext = this.data[`${name}SignContext`];
                canvasContext.clearRect(0, 0, this.data.width, 250);
            },
        });
    },
    setInputData(e: any) {
        this.setData({
            [e.target.dataset.inputfield]: e.detail.value,
        });
    },
    resign(e: { currentTarget: { dataset: { name: string } } }) {
        const name = e.currentTarget.dataset.name;
        let canvasContext = this.data[`${name}SignContext`];
        canvasContext.clearRect(0, 0, this.data.width, 250);
        this.setData({
            [`${name}HasDraw`]: false,
            [`${name}Src`]: null,
            [`${name}DrawOk`]: false,
            [`${name}Src`]: "",
            [`${name}Base64`]: "",
        });
    },

    refuse() {
        const openId = wx.getStorageSync("openId")
        if (!this.data.spr) {
            this.handleToast({
                message: `请输入审批人`,
            });
            return;
        }
        if (this.data.sprBase64 == null || !this.data.sprDrawOk) {
            this.handleToast({
                message: `请审批人完成签字`,
            });
        }
        wx.request({
            url: "http://localhost:8092/Job/verifyJob",
            // url: "https://zhouhaoyiu.oicp.vip/Job/verifyJob",
            method: "POST",
            data: {
                uuid: this.data.jobUuid,
                status: 3,
                spr: this.data.spr,
                sprBase64: this.data.sprBase64,
                sprbz: this.data.sprbz,
                verifyOpenId: openId
            }
        })
        wx.switchTab({
            url: "/pages/home/home"
        })
    },
    accept() {
        const openId = wx.getStorageSync("openId")
        if (!this.data.spr) {
            this.handleToast({
                message: `请输入审批人`,
            });
            return;
        }
        if (this.data.sprBase64 == null || !this.data.sprDrawOk) {
            this.handleToast({
                message: `请审批人完成签字`,
            });
        }

        wx.request({
            // url: "https://zhouhaoyiu.oicp.vip/Job/verifyJob",
            url: "http://localhost:8092/Job/verifyJob",
            method: "POST",
            data: {
                uuid: this.data.jobUuid,
                status: 2,
                spr: this.data.spr,
                sprBase64: this.data.sprBase64,
                sprbz: this.data.sprbz,
                verifyOpenId: openId
            },
            success(res) {
                if (res == 1) {
                    this.handleToast("审批成功")
                }
            }
        })
        wx.switchTab({
            url: "/pages/home/home"
        })
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
    onLoad(opt: any) {
        const that = this;
        let flag = true;
        this.setData({
            workUuid: opt.workUuid,
        });
        console.log(opt.workUuid);
        
        wx.hideShareMenu({})
        wx.request({
            method: "GET",
            // url: "https://zhouhaoyiu.oicp.vip/Job/getInfoByJobUuid",
            url: "http://localhost:8092/Job/getInfoByJobUuid",
            data: {
                jobUuid: this.data.jobUuid,
            },
            success(res: any) {
                console.log(res);

                res.data[0].positionList = JSON.parse(res.data[0].positionList)
                that.setData({
                    info: res.data[0],
                });
                if (res.data[0].spr) {
                    that.setData({
                        showDialog: true,
                    })
                    flag = false
                }
            },
        });
        if (flag) {
            const query = wx.createSelectorQuery();
            query
                .select(".sprSign")
                .fields({ node: true })
                .exec((res) => {
                    const canvas = res[0].node;
                    canvas.width = width;
                    canvas.height = "250";
                    let canvasContext = canvas.getContext("2d");
                    canvasContext.strokeStyle = "black";
                    canvasContext.lineWidth = 2;
                    this.setData({
                        sprSignContext: canvasContext,
                        sprSignCanvas: canvas,
                    });
                });
        }
    },
    goHome() {
        wx.switchTab({
            url: "/pages/home/home"
        })
    },
    openSign(e: any) {
        const name = e.target.dataset.name
        this.setData({
            [`${name}DrawShow`]: true,
            [`${name}HasDraw`]: false,
            [`${name}DrawOk`]: false,
            [`${name}Src`]: "",
            [`${name}Base64`]: "",
        })
    },
    previewImgByBase64(e: any) {
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
});
