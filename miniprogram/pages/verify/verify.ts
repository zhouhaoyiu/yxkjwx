// @ts-nocheck
import { request } from "../../utils/api";
import Toast from "tdesign-miniprogram/toast/index";
const width = wx.getSystemInfoSync().windowWidth;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        width,
        workUuid: "",
        info: {},
        spfzr: "",
        spfzrSignContext: undefined,
        spfzrSignCanvas: undefined as unknown as WechatMiniprogram.Canvas,
        spfzrHasDraw: false,
        spfzrDrawOk: false,
        spfzrDrawShow: false,
        spfzrSrc: null,
        spfzrBase64: null,
        spfzrInfo: "",
        showDialog: false,
        submitting: false
    },
    touchstart(e: {
        touches: { x: unknown; y: unknown }[];
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
        touches: { x: unknown; y: unknown }[];
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
    setInputData(e: unknown) {
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

    refuse() { this.review(2); },
    accept() { this.review(1); },
    review(status: number) {
        if (this.data.submitting) return;
        if (!this.data.spfzr || !this.data.spfzrBase64 || !this.data.spfzrDrawOk) {
            this.handleToast("请填写审批人并完成签字"); return;
        }
        if (status === 2 && !this.data.spfzrInfo.trim()) {
            this.handleToast("请填写驳回原因"); return;
        }
        this.setData({ submitting: true });
        request({
            url: "/workJob/verifyWorkJob", method: "POST",
            data: { workUuid: this.data.workUuid, status, spfzr: this.data.spfzr,
                spfzrBase64: this.data.spfzrBase64, spfzrInfo: this.data.spfzrInfo },
            success: res => {
                if (res.statusCode === 200 && res.data === 1) {
                    this.handleToast("审批已保存");
                    this.setData({ showDialog: true });
                } else this.handleToast(res.statusCode === 409 ? "此申请已被审批，请刷新" : "审批未保存，请重试");
            },
            fail: () => this.handleToast("网络连接失败，签字已保留"),
            complete: () => this.setData({ submitting: false }),
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
    onLoad(opt: unknown) {
        const that = this;
        let flag = true;
        this.setData({
            workUuid: opt.workUuid,
        });
        wx.hideShareMenu({})
        request({
            method: "GET",
            // url: "/Job/getInfoByJobUuid",
            url: "/workJob/getInfoByWorkJobUuid",
            data: {
                workUuid: this.data.workUuid
            },
            success(res: unknown) {
                if (res.statusCode !== 200 || !Array.isArray(res.data) || !res.data[0]) {
                    that.handleToast("申请不存在或无权查看");
                    return;
                }
                if (res.data[0].spfzr) {
                    that.setData({
                        showDialog: true,
                    })
                    flag = false;
                }
                let protectiveMeasureGroups = JSON.parse(res.data[0].protectiveMeasureGroups);
                let step1: boolean = protectiveMeasureGroups.includes("step1") || false;
                let step2: boolean = protectiveMeasureGroups.includes("step2") || false;
                let nProtectiveMeasureGroups: [boolean, boolean] = [step1, step2];
                that.setData({
                    info: {
                        workDate: res.data[0].workDate,
                        workList: JSON.parse(res.data[0].workList),
                        zyfzr: res.data[0].zyfzr,
                        jhry: res.data[0].jhry,
                        zyry: res.data[0].zyry,
                        nProtectiveMeasureGroups: nProtectiveMeasureGroups
                    }
                })
            },
        });
        if (flag) {
            const query = wx.createSelectorQuery();
            query
                .select(".spfzrSign")
                .fields({ node: true })
                .exec((res) => {
                    const canvas = res[0].node;
                    canvas.width = width;
                    canvas.height = "250";
                    let canvasContext = canvas.getContext("2d");
                    canvasContext.strokeStyle = "black";
                    canvasContext.lineWidth = 2;
                    this.setData({
                        spfzrSignContext: canvasContext,
                        spfzrSignCanvas: canvas,
                    });
                });
        }
    },
    goHome() {
        wx.switchTab({
            url: "/pages/home/home"
        })
    },
    openSign(e: unknown) {
        const name = e.target.dataset.name
        this.setData({
            [`${name}DrawShow`]: true,
            [`${name}HasDraw`]: false,
            [`${name}DrawOk`]: false,
            [`${name}Src`]: "",
            [`${name}Base64`]: "",
        })
    },
    previewImgByBase64(e: unknown) {
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
