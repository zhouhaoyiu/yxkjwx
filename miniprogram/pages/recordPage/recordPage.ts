// pages/home/home.ts
// @ts-nocheck
import Toast from 'tdesign-miniprogram/toast/index';

const width = wx.getSystemInfoSync().windowWidth;
const wellPostion = [
    {
        detectionTime: "",
        key: '井口',
        CO: '',
        H2S: '',
        O2: '',
        combustibleGas: '',
        detectionResult: true
    },
    {
        detectionTime: "",
        key: '井中',
        CO: '',
        H2S: '',
        O2: '',
        combustibleGas: '',
        detectionResult: true
    },
    {
        detectionTime: "",
        key: '井底',
        CO: '',
        H2S: '',
        O2: '',
        combustibleGas: '',
        detectionResult: true
    }
] as Record<string, string | boolean | number>[];
const roomPosition = [
    {
        detectionTime: "",
        key: '表房外',
        CO: '',
        H2S: '',
        O2: '',
        combustibleGas: '',
        detectionResult: true
    },
    {
        detectionTime: "",
        key: '表房内',
        CO: '',
        H2S: '',
        O2: '',
        combustibleGas: '',
        detectionResult: true
    }
] as Record<string, string | boolean | number>[];
Page({
    /**
     * 页面的初始数据
     */
    data: {
        uuid: '',
        width,
        xcfzrSignContext: undefined,
        xcfzrSignCanvas: (undefined as unknown) as WechatMiniprogram.Canvas,
        xcfzrHasDraw: false,
        xcfzrDrawOk: false, // 现场负责人签字完成
        xcfzrDrawShow: false,
        xzfzrSrc: null,
        xcfzrBase64: null,

        jcjlySignContext: undefined,
        jcjlySignCanvas: (undefined as unknown) as WechatMiniprogram.Canvas,
        jcjlyHasDraw: false,
        jcjlyDrawOk: false,
        jcjlyDrawShow: false,
        jcjlySrc: null,
        jcjlyBase64: null,

        // 位置表单信息
        wellPostion,
        roomPosition,

        // 作业日期的选择
        mode: '',
        dateVisible: false,
        timeVisible: false,
        date: new Date().getTime(), // 支持时间戳传入
        time: new Date().getHours() + ':' + new Date().getMinutes(),

        dateText: '', // 作业日期
        jobContent: '', // 作业内容
        jobPosition: '', // 作业地点

        latitude: 0, //首次加载维度
        longitude: 0, //首次加载的经度

        // 安全选项
        riskFactorsValue: true, // 危险因素
        safetyDisclosureValue: true, // 安全交底
        inspectionEquipmentValue: true, // 检测设备情况
        safetyProtectionValue: true, // 安全防护设备
        emerRescueValue: true, // 应急救援装备

        otherInfo: '', // 其他补充措施

        //  通风开始
        ventilationStartsTime: "",
        ventilationEndTime: "", // 通风结束

        jobStartTime: "",
        jobEndTime: "",

        isInterrupt: false, // 是否中断
        interruptStartTime: "", // 中断开始时间
        interruptEndTime: "", // 中断结束时间

        gasDetectionImgArr: [] as string[], // 气体检测图片数组
        gasDetectionBase64Arr: [] as (string | ArrayBuffer)[], // 气体检测图片base64数组

        signBoardImgArr: [] as string[], // 标志牌图片数组
        signBoardBase64Arr: [] as (string | ArrayBuffer)[],

        exhaustAirImgArr: [] as string[], // 排气图片数组
        exhaustAirBase64Arr: [] as (string | ArrayBuffer)[], // 排气图片base64数组

        imgPreview: '', // 图片预览

        positionList: wellPostion as Record<any, any>[],

        xzfzr: '',
        jcjly: '', // 检测人员

        confinedSpaceType: false // 有限空间类型
    },
    logWorkIn() {
        console.log(this.data);
    },
    openSign(e) {
        const name = e.target.dataset.name;
        if (!this.data[`${name}SignContext`]) {
            const query = wx.createSelectorQuery();
            query
                .select(`.${name}Sign`)
                .fields({ node: true })
                .exec(res => {
                    const canvas = res[0].node;
                    canvas.width = width;
                    canvas.height = '250';
                    let canvasContext = canvas.getContext('2d');
                    canvasContext.strokeStyle = 'black';
                    canvasContext.lineWidth = 2;
                    this.setData({
                        [`${name}SignContext`]: canvasContext,
                        [`${name}SignCanvas`]: canvas
                    });
                });
        }
        this.setData({
            [`${name}DrawShow`]: true,
            [`${name}HasDraw`]: false,
            [`${name}DrawOk`]: false,
            [`${name}Src`]: '',
            [`${name}Base64`]: ''
        });
    },

    changePostion(e: any) {
        this.setData({
            positionList: e.target.dataset.positon
        });
    },
    jobGroupVisible() {
        this.setData({
            jobGroupPick: !this.data.jobGroupPick
        });
    },
    setPositionData(e: any) {
        let value = e.detail.value;
        if (!value) {
            value = e.target.dataset.textvalue === "true"
        }
        const key = e.target.dataset.key;
        const index = e.target.dataset.index;
        const { positionList } = this.data;
        positionList[index][key] = value;
        this.setData({
            positionList
        });
    },

    handleUploadImg(e: any) {
        const arrname = e.target.dataset.arrname;
        const that = this;
        // 从相册或相机拍摄
        wx.chooseMedia({
            count: 1,
            sourceType: ['album', 'camera'],
            mediaType: ['image'],
            sizeType: ['compressed'],
            success(res) {
                let imgArr = [];
                let base64Arr = [];
                const fileManager = wx.getFileSystemManager();
                // console.log(res.tempFiles[0].size / 1024 / 1024);
                for (let i = 0; i < res.tempFiles.length; i++) {
                    const previewData = res.tempFiles[i].tempFilePath;
                    const base64 = fileManager.readFileSync(previewData, 'base64');
                    imgArr.push(previewData);
                    base64Arr.push(base64);
                }
                that.setData({
                    [`${arrname}ImgArr`]: imgArr,
                    [`${arrname}Base64Arr`]: base64Arr
                });
            },
            fail(e) {
                that.handleToast({
                    message: '图片上传失败',
                    theme: 'fail'
                });
            }
        });
    },

    udf() {
        void 0;
    },
    previewImg(e: any) {
        const arrname = e.target.dataset.arrname;
        const index = e.target.dataset.index;
        const { [`${arrname}ImgArr`]: imgArr } = this.data;
        let url = imgArr[index];
        wx.previewImage({
            urls: [url], // 图片地址列表
            current: '1', //默认显示的图片的地址
            success: _res => {
                console.log('预览调用成功');
            },
            fail: _res => {
                console.log('预览调用失败');
            }
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
            [`${arrname}Base64Arr`]: base64Arr
        });
    },

    setInputData(e: any) {
        this.setData({
            [e.target.dataset.inputfield]: e.detail.value
        });
    },
    // 数组
    joinArray(array: string[]) {
        return array.join('-');
    },
    onChangeSwitch(e: any) {
        const valueName = e.target.dataset.valuename;

        this.setData({
            [valueName]: e.detail.value
        });
        if (valueName === 'confinedSpaceType') {
            this.setData({
                positionList: e.detail.value ? roomPosition : wellPostion
            });
        }
    },
    onClickSwitchText(e: any) {
        const valueName = e.target.dataset.valuename;
        let textValue = e.target.dataset.textvalue;
        this.setData({
            [valueName]: textValue == 'true' ? true : false
        });
    },
    // 点击选择
    handleGroupChange(event) {
        this.setData({
            jobGroup: event.detail.value
        });
    },
    onChangeJobPerson(e: { detail: { value: any } }) {
        this.setData({
            jobPersonValue: e.detail.value
        });
    },

    onColumnChange(e: any) {
        console.log('picker pick:', e);
    },

    onPickerChange(e: { currentTarget: { dataset: { key: any } }; detail: { value: any } }) {
        const { key } = e?.currentTarget?.dataset;
        this.setData({
            [`${key}Visible`]: false,
            [`${key}Value`]: e.detail.value,
            [`${key}CurrentValue`]: this.joinArray(e.detail.value)
        });
    },

    onPickerCancel(e: { currentTarget: { dataset: { key: any } } }) {
        const { key } = e?.currentTarget?.dataset;
        this.setData({
            [`${key}Visible`]: false
        });
    },

    showPicker(e: { currentTarget: { dataset: { mode: any } } }) {
        const { mode, key } = e?.currentTarget?.dataset;

        this.setData({
            mode,
            [`${mode}Visible`]: true,
            dateTimekey: key
        });
    },
    showPositionPicker(e: any) {
        const { mode, index } = e?.currentTarget?.dataset;
        console.log(index);

        this.setData({
            mode,
            positionTimeVisible: true,
            positionTimeIndex: index
        })
    },
    hidePicker() {
        const { mode } = this.data;
        this.setData({
            [`${mode}Visible`]: false
        });
    },
    onConfirm(e: { detail: { value: any } }) {
        const { value } = e?.detail;
        console.log(value);
        const { dateTimekey } = this.data;
        this.setData({
            [dateTimekey]: value
        });
        this.hidePicker();
    },

    onPositionConfirm(e: any) {
        const { value } = e?.detail;
        let { positionTimeIndex, positionList } = this.data;
        positionList[positionTimeIndex].detectionTime = value;
        this.setData({
            positionList
        })
    },

    moveToLocation() {
        let that = this;
        wx.chooseLocation({
            success: function (res) {
                //赋值给data中的mapName
                that.setData({
                    jobPosition: res.name
                });
            },
            //错误信息
            fail: function (e) {
                console.log(e);
            }
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.getTabBar().setData({
            selected: 1
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
            .select('.xcfzrSign')
            .fields({ node: true })
            .exec(res => {
                console.log(res);

                const canvas = res[0].node;
                canvas.width = width;
                canvas.height = '250';
                let canvasContext = canvas.getContext('2d');
                canvasContext.strokeStyle = 'black';
                canvasContext.lineWidth = 2;
                this.setData({
                    xcfzrSignContext: canvasContext,
                    xcfzrSignCanvas: canvas
                });
            });
        query
            .select('.jcjlySign')
            .fields({ node: true })
            .exec(res => {
                console.log(res);

                const canvas = res[1].node;
                canvas.width = width;
                canvas.height = '250';
                let canvasContext = canvas.getContext('2d');
                canvasContext.strokeStyle = 'black';
                canvasContext.lineWidth = 2;
                this.setData({
                    jcjlySignContext: canvasContext,
                    jcjlySignCanvas: canvas
                });
            });
    },

    touchstart(e: { touches: { x: any; y: any }[]; target: { dataset: { name: string } } }) {
        const name = e.target.dataset.name;
        if (this.data[`${name}DrawOk`]) {
            return;
        }
        const canvasContext = this.data[`${name}SignContext`];
        canvasContext.beginPath();
        canvasContext.moveTo(e.touches[0].x, e.touches[0].y);

        this.setData({
            [`${name}SignContext`]: canvasContext,
            [`${name}HasDraw`]: true
        });
    },

    touchmove(e: { touches: { x: any; y: any }[]; target: { dataset: { name: string } } }) {
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
            [`${name}SignContext`]: canvasContext
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
            [`${name}Src`]: '',
            [`${name}Base64`]: ''
        });
    },

    signOk(e: { currentTarget: { dataset: { name: string } } }) {
        const name = e.currentTarget.dataset.name;
        let chineseName = '';
        switch (name) {
            case 'xcfzr':
                chineseName = '现场负责人';
                break;
            case 'jcjly':
                chineseName = '检查员';
                break;
        }
        if (!this.data[`${name}HasDraw`]) {
            this.handleToast({
                message: `请${chineseName}完成签字`,
                theme: 'fail'
            });
            return;
        } else {
            this.handleToast({
                message: `${chineseName}签字成功`,
                theme: 'fail'
            });
        }
        wx.canvasToTempFilePath(
            {
                canvas: this.data[`${name}SignCanvas`] as WechatMiniprogram.Canvas,
                success: res => {
                    const fileManager = wx.getFileSystemManager();
                    const base64 = fileManager.readFileSync(res.tempFilePath, 'base64');

                    this.setData({
                        [`${name}Src`]: res.tempFilePath,
                        [`${name}Base64`]: base64,
                        [`${name}DrawOk`]: true,
                        [`${name}DrawShow`]: false
                    });
                    let canvasContext = this.data[`${name}SignContext`];
                    canvasContext.clearRect(0, 0, this.data.width, 250);
                },
                fail(e) {
                    console.log(e);
                }
            },
            this
        );
    },

    submitJob() {
        const openId = wx.getStorageSync('openId');
        if (!this.data.dateText) {
            this.handleToast({
                message: '请选择作业日期',
                theme: 'fail'
            });
            return;
        }
        if (!this.data.jobContent) {
            this.handleToast({
                message: '请填写作业内容',
                theme: 'fail'
            });
            return;
        }
        if (!this.data.jobPosition) {
            this.handleToast({
                message: '请选择作业地点',
                theme: 'fail'
            });
            return;
        }

        if (this.data.isInterrupt && !this.data.pauseTime) {
            this.handleToast({
                message: '请输入中断时间',
                theme: 'fail'
            });
            return;
        }
        if (!this.data.gasDetectionBase64Arr.length) {
            this.handleToast({
                message: '请上传气体检测照片',
                theme: 'fail'
            });
            return;
        }
        if (!this.data.signBoardBase64Arr.length) {
            this.handleToast({
                message: '请上传作业标识照片',
                theme: 'fail'
            });
            return;
        }
        if (!this.data.xcfzr) {
            this.handleToast({
                message: '请输入现场负责人名称',
                theme: 'fail'
            });
            return;
        }
        if (!this.data.xcfzrDrawOk) {
            this.handleToast({
                message: '请现场负责人签字',
                theme: 'fail'
            });
            return;
        }
        if (!this.data.jcjly) {
            this.handleToast({
                message: '请输入检查员名称',
                theme: 'fail'
            });
            return;
        }
        if (!this.data.jcjlyDrawOk) {
            this.handleToast({
                message: '请检测员签字',
                theme: 'fail'
            });
            return;
        }

        const data = {
            jobContent: this.data.jobContent,
            jobDate: this.data.dateText,
            jobPosition: this.data.jobPosition,

            safetyDisclosureValue: this.data.safetyDisclosureValue, //
            inspectionEquipmentValue: this.data.inspectionEquipmentValue, //
            ventedExhaustValue: this.data.ventedExhaustValue, //
            personalProtectionValue: this.data.personalProtectionValue, //
            gasDetectionValue: this.data.gasDetectionValue, //
            safetyProtectionValue: this.data.safetyProtectionValue, //
            otherInfo: this.data.otherInfo, //
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
            xcfzr: this.data.xcfzr,
            xcfzrBase64: this.data.xcfzrBase64,
            jcjly: this.data.jcjly,
            jcjlyBase64: this.data.jcjlyBase64,
            sendOpenId: openId
        };
        const that = this;
        wx.request({
            // url: 'https://zhouhaoyiu.oicp.vip/Job/addJob',
            url: "http://localhost:8092/Job/addJob",
            method: 'POST',
            data: data,
            success(res) {
                that.handleToast({
                    message: res.data == 1 ? '提交成功' : '提交失败',
                    theme: res.data == 1 ? 'success' : 'fail'
                });
                that.setData({
                    xcfzr: '',

                    xcfzrHasDraw: false,
                    xcfzrDrawOk: false, // 现场负责人签字完成
                    xcfzrDrawShow: false,
                    xzfzrSrc: null,
                    xcfzrBase64: null,

                    jcjlyHasDraw: false,
                    jcjlyDrawOk: false,
                    jcjlyDrawShow: false,
                    jcjlySrc: null,
                    jcjlyBase64: null,

                    jobGroupPick: false,
                    // 作业日期的选择
                    mode: '',
                    dateVisible: false,
                    date: new Date().getTime(), // 支持时间戳传入

                    jobContent: '', // 作业内容
                    dateText: '', // 作业日期
                    jobPosition: '', // 作业地点

                    latitude: 0, //首次加载维度
                    longitude: 0, //首次加载的经度

                    // 安全选项
                    safetyDisclosureValue: true, // 安全交底
                    inspectionEquipmentValue: true, // 检测设备情况
                    ventedExhaustValue: true, //通风排气情况
                    personalProtectionValue: true, // 个人防护用品
                    gasDetectionValue: true, // 气体检测情况
                    safetyProtectionValue: true, // 安全防护设备

                    otherInfo: '', // 其他补充措施

                    isInterrupt: false, // 是否中断
                    pauseTime: '', // 中断时长
                    reDetectionValue: true, // 再次检测情况

                    gasDetectionImgArr: [] as string[], // 气体检测图片数组
                    gasDetectionBase64Arr: [] as (string | ArrayBuffer)[], // 气体检测图片base64数组

                    signBoardImgArr: [] as string[], // 标志牌图片数组
                    signBoardBase64Arr: [] as (string | ArrayBuffer)[],

                    exhaustAirImgArr: [] as string[], // 排气图片数组
                    exhaustAirBase64Arr: [] as (string | ArrayBuffer)[], // 排气图片base64数组
                    imgPreview: '', // 图片预览

                    positionList: wellPostion as Record<any, any>[],

                    jcjly: '', // 检测人员
                    cleaningInspection: true,
                    confinedSpaceType: false // 有限空间类型
                });
            },
            fail(res) {
                that.handleToast({
                    message: res.data,
                    theme: 'fail'
                });
            }
        });
    },

    toast(option: ToastOptionsType) {
        Toast({
            context: this,
            selector: '#t-toast',
            ...option,
            direction: 'column'
        });
    },

    handleToast(message: string | ToastOptionsType, theme: string) {
        this.toast({
            message: typeof message === 'string' ? message : message.message,
            theme: typeof message === 'string' ? theme : message.theme
        });
    },

    test() {
        console.log('test');
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
    onShareAppMessage() { }
});
