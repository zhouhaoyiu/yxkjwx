// pages/home/home.ts
// @ts-nocheck
import Toast from "tdesign-miniprogram/toast/index";

const width = wx.getSystemInfoSync().windowWidth;
const wellPostion = [
    {
        key: "井口",
        CO: "0",
        H2S: "0",
        O2: "20.9",
        combustibleGas: "0",
        detectionResult: "",
    },
    {
        key: "井中",
        CO: "0",
        H2S: "0",
        O2: "20.9",
        combustibleGas: "0",
        detectionResult: "",
    },
    {
        key: "井底",
        CO: "0",
        H2S: "0",
        O2: "20.9",
        combustibleGas: "0",
        detectionResult: "",
    },
] as Record<any, any>[];
const roomPosition = [
    {
        key: "表房外",
        CO: "0",
        H2S: "0",
        O2: "20.9",
        combustibleGas: "0",
        detectionResult: "",
    },
    {
        key: "表房内",
        CO: "0",
        H2S: "0",
        O2: "20.9",
        combustibleGas: "0",
        detectionResult: "",
    },
] as Record<any, any>[];
Page({
    /**
     * 页面的初始数据
     */
    data: {
        uuid: "",
        width,
        // 签字信息
        aqySignContext: undefined as unknown as WechatMiniprogram.CanvasContext,
        aqySignCanvas: undefined as unknown as WechatMiniprogram.Canvas,
        aqyHasDraw: false,
        aqyDrawOk: false,
        aqySrc: null,
        aqyBase64: null,

        xcfzrSignContext: undefined,
        xcfzrSignCanvas: undefined as unknown as WechatMiniprogram.Canvas,
        xcfzrHasDraw: false,
        xcfzrDrawOk: false, // 现场负责人签字完成
        xzfzrSrc: null,
        xcfzrBase64: null,

        jcySignContext: undefined,
        jcySignCanvas: undefined as unknown as WechatMiniprogram.Canvas,
        jcyHasDraw: false,
        jcyDrawOk: false,
        jcySrc: null,
        jcyBase64: null,

        jlySignContext: undefined,
        jlySignCanvas: undefined as unknown as WechatMiniprogram.Canvas,
        jlyHasDraw: false,
        jlyDrawOk: false,
        jlySrc: null,
        jlyBase64: null,

        // 位置表单信息
        wellPostion,
        roomPosition,
        // 作业段组的选择
        jobGroups: [
            { label: "机运队", value: "机运队" },
            { label: "管道队", value: "管道队" },
            { label: "消防组", value: "消防组" },
            { label: "巡视工段", value: "巡视工段" },
            { label: "管理工段", value: "管理工段" },
            { label: "营销一段", value: "营销一段" },
            { label: "户表一段", value: "户表一段" },
            { label: "户表二段", value: "户表二段" },
            { label: "户表三段", value: "户表三段" },
            { label: "户表四段", value: "户表四段" },
        ],
        jobGroupPick: false,

        // 作业日期的选择
        mode: "",
        dateVisible: false,
        date: new Date().getTime(), // 支持时间戳传入

        jobContent: "", // 作业内容
        jobGroup: [], // 作业段组
        dateText: "", // 作业日期
        jobPosition: "", // 作业地点

        latitude: 0, //首次加载维度
        longitude: 0, //首次加载的经度
        jobPersonValue: 0, // 作业人员数量

        // 安全选项
        safetyDisclosureValue: true, // 安全交底
        inspectionEquipmentValue: true, // 检测设备情况
        ventedExhaustValue: true, //通风排气情况
        personalProtectionValue: true, // 个人防护用品
        gasDetectionValue: true, // 气体检测情况
        safetyProtectionValue: true, // 安全防护设备

        otherInfo: "", // 其他补充措施
        /* 开始时间 */
        startTimeHour: null,
        startTimeMinute: null,
        startTimeSecond: null,
        /* 结束时间 */
        endTimeHour: null,
        endTimeMinute: null,
        endTimeSecond: null,

        isInterrupt: false, // 是否中断
        pauseTime: "", // 中断时长
        reDetectionValue: true, // 再次检测情况

        gasDetectionImgArr: [] as string[], // 气体检测图片数组
        gasDetectionBase64Arr: [] as (string | ArrayBuffer)[], // 气体检测图片base64数组

        signBoardImgArr: [] as string[], // 标志牌图片数组
        signBoardBase64Arr: [] as (string | ArrayBuffer)[],

        exhaustAirImgArr: [] as string[], // 排气图片数组
        exhaustAirBase64Arr: [] as (string | ArrayBuffer)[], // 排气图片base64数组

        imgPreview: "", // 图片预览

        positionList: wellPostion as Record<any, any>[],

        aqy: "",
        xzfzr: "",
        jcy: "", // 检测人员
        jly: "", // 记录人员
        cleaningInspection: true,
        confinedSpaceType: false, // 有限空间类型
    },
    logWorkIn() {
        console.log(this.data);
    },

    changePostion(e: any) {
        this.setData({
            positionList: e.target.dataset.positon,
        });
    },
    jobGroupVisible() {
        this.setData({
            jobGroupPick: !this.data.jobGroupPick,
        });
    },
    setPositionData(e: any) {
        const { value } = e.detail;
        const key = e.target.dataset.key;
        const index = e.target.dataset.index;

        const { positionList } = this.data;
        positionList[index][key] = value;
        this.setData({
            positionList,
        });
    },

    handleUploadImg(e: any) {
        const arrname = e.target.dataset.arrname;
        const that = this;
        // 从相册或相机拍摄
        wx.chooseMedia({
            count: 1,
            sourceType: ["album", "camera"],
            mediaType: ["image"],
            sizeType: ["compressed"],
            success(res) {
                let imgArr = [];
                let base64Arr = [];
                const fileManager = wx.getFileSystemManager();
                // console.log(res.tempFiles[0].size / 1024 / 1024);
                for (let i = 0; i < res.tempFiles.length; i++) {
                    const previewData = res.tempFiles[i].tempFilePath;
                    const base64 = fileManager.readFileSync(previewData, "base64");
                    imgArr.push(previewData);
                    base64Arr.push(base64);
                }
                that.setData({
                    [`${arrname}ImgArr`]: imgArr,
                    [`${arrname}Base64Arr`]: base64Arr,
                });
            },
        });
    },

    previewImg(e: any) {
        const arrname = e.target.dataset.arrname;
        const index = e.target.dataset.index;
        const { [`${arrname}ImgArr`]: imgArr } = this.data;
        let url = imgArr[index];
        wx.previewImage({
            urls: [url], // 图片地址列表
            current: "1", //默认显示的图片的地址
            success: (_res) => {
                console.log("预览调用成功");
            },
            fail: (_res) => {
                console.log("预览调用失败");
            },
        });
    },

    deleteImg(e: any) {
        // const { imgPreview } = this.data
        const index = e.target.dataset.index;
        const arrname = e.target.dataset.arrname;
        const { [`${arrname}ImgArr`]: imgArr } = this.data;
        const { [`${arrname}Base64Arr`]: base64Arr } = this.data;
        imgArr.splice(index, 1);
        base64Arr.splice(index, 1);
        this.setData({
            [`${arrname}ImgArr`]: imgArr,
            [`${arrname}Base64Arr`]: base64Arr,
        });
    },

    setInputData(e: any) {
        this.setData({
            [e.target.dataset.inputfield]: e.detail.value,
        });
    },
    // 数组
    joinArray(array: string[]) {
        return array.join("-");
    },
    onChangeSwitch(e: any) {
        const valueName = e.target.dataset.valuename;

        this.setData({
            [valueName]: e.detail.value,
        });
        if (valueName === "confinedSpaceType") {
            this.setData({
                positionList: e.detail.value ? roomPosition : wellPostion,
            });
        }
    },
    onClickSwitchText(e: any) {
        const valueName = e.target.dataset.valuename;
        let textValue = e.target.dataset.textvalue;
        this.setData({
            [valueName]: textValue == "true" ? true : false,
        });
    },
    // 点击选择
    handleGroupChange(event) {
        this.setData({
            jobGroup: event.detail.value,
        });
    },
    onChangeJobPerson(e: { detail: { value: any } }) {
        this.setData({
            jobPersonValue: e.detail.value,
        });
    },

    onColumnChange(e: any) {
        console.log("picker pick:", e);
    },

    onPickerChange(e: {
        currentTarget: { dataset: { key: any } };
        detail: { value: any };
    }) {
        const { key } = e?.currentTarget?.dataset;
        this.setData({
            [`${key}Visible`]: false,
            [`${key}Value`]: e.detail.value,
            [`${key}CurrentValue`]: this.joinArray(e.detail.value),
        });
    },

    onPickerCancel(e: { currentTarget: { dataset: { key: any } } }) {
        const { key } = e?.currentTarget?.dataset;
        this.setData({
            [`${key}Visible`]: false,
        });
    },

    showPicker(e: { currentTarget: { dataset: { mode: any } } }) {
        const { mode } = e?.currentTarget?.dataset;
        this.setData({
            mode,
            [`${mode}Visible`]: true,
        });
    },
    hidePicker() {
        const { mode } = this.data;
        this.setData({
            [`${mode}Visible`]: false,
        });
    },
    onConfirm(e: { detail: { value: any } }) {
        const { value } = e?.detail;
        const { mode } = this.data;
        this.setData({
            [mode]: value,
            [`${mode}Text`]: value,
        });
        this.hidePicker();
    },
    moveToLocation() {
        let that = this;
        wx.chooseLocation({
            success: function (res) {
                //赋值给data中的mapName
                that.setData({
                    jobPosition: res.name,
                });
            },
            //错误信息
            fail: function (e) {
                console.log(e);
            },
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.getTabBar().setData({
            selected: 0,
        });
        // wx.request({
        //     url: "http://localhost:8092/Job/getUuid",
        //     method: "GET",
        //     success: (res) => {
        //         console.log(res);

        //         this.setData({
        //             uuid: res.data
        //         })
        //     },
        //     fail: (e) => {
        //         console.log(e);

        //     }
        // })
        const query = wx.createSelectorQuery();
        query
            .select(".aqySign")
            .fields({ node: true })
            .exec((res) => {
                const canvas = res[0].node;
                canvas.width = width;
                canvas.height = "250";
                let canvasContext = canvas.getContext("2d");
                canvasContext.strokeStyle = "black";
                canvasContext.lineWidth = 2;
                this.setData({
                    aqySignContext: canvasContext,
                    aqySignCanvas: canvas,
                });
            });

        query
            .select(".xcfzrSign")
            .fields({ node: true })
            .exec((res) => {
                const canvas = res[1].node;
                canvas.width = width;
                canvas.height = "250";
                let canvasContext = canvas.getContext("2d");
                canvasContext.strokeStyle = "black";
                canvasContext.lineWidth = 2;
                this.setData({
                    xcfzrSignContext: canvasContext,
                    xcfzrSignCanvas: canvas,
                });
            });
        query
            .select(".jcySign")
            .fields({ node: true })
            .exec((res) => {
                const canvas = res[2].node;
                canvas.width = width;
                canvas.height = "250";
                let canvasContext = canvas.getContext("2d");
                canvasContext.strokeStyle = "#000000";
                canvasContext.lineWidth = 2;
                this.setData({
                    jcySignContext: canvasContext,
                    jcySignCanvas: canvas,
                });
            });
        query
            .select(".jlySign")
            .fields({ node: true })
            .exec((res) => {
                const canvas = res[3].node;
                canvas.width = width;
                canvas.height = "250";
                let canvasContext = canvas.getContext("2d");
                canvasContext.strokeStyle = "black";
                canvasContext.lineWidth = 2;
                this.setData({
                    jlySignContext: canvasContext,
                    jlySignCanvas: canvas,
                });
            });
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

    resign(e: { currentTarget: { dataset: { name: string } } }) {
        const name = e.currentTarget.dataset.name;
        let canvasContext = this.data[`${name}SignContext`];
        canvasContext.clearRect(0, 0, this.data.width, 250);
        this.setData({
            [`${name}HasDraw`]: false,
            [`${name}Src`]: null,
            [`${name}DrawOk`]: false,
        });
    },

    signOk(e: { currentTarget: { dataset: { name: string } } }) {
        const name = e.currentTarget.dataset.name;
        let chineseName = "";
        switch (name) {
            case "aqy":
                chineseName = "安全员";
                break;
            case "xcfzr":
                chineseName = "现场负责人";
                break;
            case "jcy":
                chineseName = "检查员";
                break;
            case "jly":
                chineseName = "记录员";
                break;
        }
        if (!this.data[`${name}HasDraw`]) {
            this.handleToast({
                message: `请${chineseName}完成签字`,
            });
            return;
        } else {
            this.handleToast({
                message: `${chineseName}签字成功`,
            });
            this.setData({
                [`${name}DrawOk`]: true,
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
                });
            },
        });
    },

    submitJob() {
        if (!this.data.jobContent) {
            this.handleToast({
                message: "请填写作业内容",
            });
            return;
        }
        if (!this.data.jobGroup.toString()) {
            this.handleToast({
                message: "请选择作业班组",
            });
            return;
        }
        if (!this.data.dateText) {
            this.handleToast({
                message: "请选择作业日期",
            });
            return;
        }
        if (!this.data.jobPosition) {
            this.handleToast({
                message: "请选择作业地点",
            });
            return;
        }
        if (!this.data.jobPersonValue) {
            this.handleToast({
                message: "请输入作业人数",
            });
            return;
        }
        if (!this.data.startTimeHour) {
            this.handleToast({
                message: "请输入作业开始小时",
            });
            return;
        }
        if (!this.data.startTimeMinute) {
            this.handleToast({
                message: "请输入作业开始分钟",
            });
            return;
        }
        if (!this.data.startTimeSecond) {
            this.handleToast({
                message: "请输入作业开始秒",
            });
            return;
        }
        if (!this.data.endTimeHour) {
            this.handleToast({
                message: "请输入作业结束小时",
            });
            return;
        }
        if (!this.data.endTimeMinute) {
            this.handleToast({
                message: "请输入作业结束分钟",
            });
            return;
        }
        if (!this.data.endTimeSecond) {
            this.handleToast({
                message: "请输入作业结束秒",
            });
            return;
        }
        if (this.data.isInterrupt && !this.data.pauseTime) {
            this.handleToast({
                message: "请输入中断时间",
            });
            return;
        }
        if (!this.data.gasDetectionBase64Arr.length) {
            this.handleToast({
                message: "请上传气体检测照片",
            });
            return;
        }
        if (!this.data.signBoardBase64Arr.length) {
            this.handleToast({
                message: "请上传作业标识照片",
            });
            return;
        }
        if (!this.data.aqy) {
            this.handleToast({
                message: "请输入安全员名称",
            });
            return;
        }
        if (!this.data.aqyDrawOk) {
            this.handleToast({
                message: "请安全员签字",
            });
            return;
        }
        if (!this.data.xcfzr) {
            this.handleToast({
                message: "请输入现场负责人名称",
            });
            return;
        }
        if (!this.data.xcfzrDrawOk) {
            this.handleToast({
                message: "请现场负责人签字",
            });
            return;
        }
        if (!this.data.jcy) {
            this.handleToast({
                message: "请输入检查员名称",
            });
            return;
        }
        if (!this.data.jcyDrawOk) {
            this.handleToast({
                message: "请检测员签字",
            });
            return;
        }
        if (!this.data.jly) {
            this.handleToast({
                message: "请输入记录员名称",
            });
            return;
        }
        if (!this.data.jlyDrawOk) {
            this.handleToast({
                message: "请记录员签字",
            });
            return;
        }
        const data = {
            jobContent: this.data.jobContent,
            jobGroup: this.data.jobGroup.toString(),
            jobDate: this.data.dateText,
            jobPosition: this.data.jobPosition,

            jobPersonValue: this.data.jobPersonValue,
            safetyDisclosureValue: this.data.safetyDisclosureValue, //
            inspectionEquipmentValue: this.data.inspectionEquipmentValue, //
            ventedExhaustValue: this.data.ventedExhaustValue, //
            personalProtectionValue: this.data.personalProtectionValue, //
            gasDetectionValue: this.data.gasDetectionValue, //
            safetyProtectionValue: this.data.safetyProtectionValue, //
            otherInfo: this.data.otherInfo, //
            startTimeHour: this.data.startTimeHour,
            startTimeMinute: this.data.startTimeMinute,
            startTimeSecond: this.data.startTimeSecond,
            isInterrupt: this.data.isInterrupt, //
            pauseTime: this.data.pauseTime,
            reDetectionValue: this.data.reDetectionValue, //
            confinedSpaceType: this.data.confinedSpaceType, //
            positionList: JSON.stringify(this.data.positionList),
            gasDetectionBase64Arr: this.data.gasDetectionBase64Arr.toString(),
            signBoardBase64Arr: this.data.signBoardBase64Arr.toString(),
            exhaustBase64Arr: this.data.exhaustAirBase64Arr.toString(),
            endTimeHour: this.data.endTimeHour,
            endTimeMinute: this.data.endTimeMinute,
            endTimeSecond: this.data.endTimeSecond,
            cleaningInspection: this.data.cleaningInspection, //
            aqy: this.data.aqy,
            aqyBase64: this.data.aqyBase64,
            xcfzr: this.data.xcfzr,
            xcfzrBase64: this.data.xcfzrBase64,
            jcy: this.data.jcy,
            jcyBase64: this.data.jcyBase64,
            jly: this.data.jly,
            jlyBase64: this.data.jlyBase64,
        };
        console.log(data);

        wx.request({
          url: "http://localhost:8092/Job/addJob",
          method: "POST",
          data: data,
        });
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

    test() {
        console.log("test");
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
    onShareAppMessage() {
        return {
            title: "邀请您进行审批",
            path: "pages/verify/verify",
        };
    },
});
