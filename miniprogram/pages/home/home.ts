// pages/home/home.ts
const PICKER_KEY = {
    JOB_GROUP: "jobGroup",
};
const wellPostion = [
    {
        key: "井口",
        CO: "",
        H2S: "",
        O2: "",
        combustibleGas: "",
        detectionResult: ""
    },
    {
        key: "井中",
        CO: "",
        H2S: "",
        O2: "",
        combustibleGas: "",
        detectionResult: ""
    },
    {
        key: "井底",
        CO: "",
        H2S: "",
        O2: "",
        combustibleGas: "",
        detectionResult: ""
    },
] as Record<any, any>[]
const roomPosition = [
    {
        key: "表房外",
        CO: "",
        H2S: "",
        O2: "",
        combustibleGas: "",
        detectionResult: ""
    },
    {
        key: "表房内",
        CO: "",
        H2S: "",
        O2: "",
        combustibleGas: "",
        detectionResult: ""
    }
] as Record<any, any>[]
Page({
    /**
     * 页面的初始数据
     */
    data: {
        PICKER_KEY,
        wellPostion,
        roomPosition,
        [`${PICKER_KEY.JOB_GROUP}Visible`]: false,
        jobGroupPickerTitle: "选择作业段组",
        jobGroups: [
            { label: "户表一段", value: "户表一段" },
            { label: "户表二段", value: "户表二段" },
            { label: "户表三段", value: "户表三段" },
            { label: "户表四段", value: "户表四段" },
            { label: "巡视工段", value: "巡视工段" },
        ],
        [`${PICKER_KEY.JOB_GROUP}Value`]: [],

        mode: "",
        dateVisible: false,
        date: new Date().getTime(), // 支持时间戳传入
        dateText: "", // 作业日期

        jobContent: "", // 作业内容
        jobGroup: "", // 作业段组
        jobPosition: "", // 作业地点
        jobPersonValue: 0, // 作业人员
        // 安全交底
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

        imgArr: [] as string[], // 图片数组
        base64Arr: [] as (string | ArrayBuffer)[], // base64数组
        imgPreview: "", // 图片预览


        positionList: wellPostion as Record<any, any>[],

        inspector: "", // 检测人员
        recorder: "", // 记录人员
        cleaningInspection: true,
        confinedSpaceType: false
    },
    logWorkIn() {
        console.log(this.data);
    },

    changePostion(e: any) {
        this.setData({
            positionList: e.target.dataset.positon
        });
        console.log(123);
    },
    setPositionData(e: any) {
        console.log(e.target.dataset);

        const { value } = e.detail;
        const key = e.target.dataset.key
        const index = e.target.dataset.index
        // console.log(index, key, value);

        const { positionList } = this.data;
        positionList[index][key] = value;
        this.setData({
            positionList,
        });
    },

    handleUploadImg: function () {
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
                    imgArr: imgArr,
                    base64Arr: base64Arr,
                });
            },
        });
    },
    previewImg: function (e: any) {
        const { imgArr } = this.data;
        const index = e.target.dataset.index;
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

        let imgArr = this.data.imgArr;
        let base64Arr = this.data.base64Arr;
        imgArr.splice(index, 1);
        base64Arr.splice(index, 1);
        this.setData({
            imgArr: imgArr,
            base64Arr: base64Arr,
        });
    },

    setInputData(e: any) {
        console.log(e.target);

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
                positionList: e.detail.value ? roomPosition : wellPostion
            })
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
    onClickPicker(e: { currentTarget: { dataset: { key: any } } }) {
        const { key } = e?.currentTarget?.dataset;

        this.setData({
            [`${key}Visible`]: true,
        });
    },

    onChangeJobPerson(e: { detail: { value: any } }) {
        this.setData({
            jobPersonValue: e.detail.value,
        });
    },

    onColumnChange(e: any) {
        console.log("picker pick:", e, 4123);
    },

    onPickerChange(e: {
        currentTarget: { dataset: { key: any } };
        detail: { value: any };
    }) {
        const { key } = e?.currentTarget?.dataset;
        console.log("picker change:", e.detail);
        console.log(key);
        this.setData({
            [`${key}Visible`]: false,
            [`${key}Value`]: e.detail.value,
            [`${key}CurrentValue`]: this.joinArray(e.detail.value),
        });
    },

    onPickerCancel(e: { currentTarget: { dataset: { key: any } } }) {
        const { key } = e?.currentTarget?.dataset;
        console.log(e, "取消");
        console.log("picker1 cancel:");
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.getTabBar().setData({
            selected: 0,
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
    onShareAppMessage() { },
});
