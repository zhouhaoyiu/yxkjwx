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

const wellInterruptTemplate = [{
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
}]

const roomInterruptTemplate = [{
    detectionTime: "",
    key: '表房外',
    CO: '',
    H2S: '',
    O2: '',
    combustibleGas: '',
    detectionResult: true,
}, {
    detectionTime: "",
    key: '表房内',
    CO: '',
    H2S: '',
    O2: '',
    combustibleGas: '',
    detectionResult: true
}
]
Page({
    /**
     * 页面的初始数据
     */
    data: {
        uuid: '',

        unionWork: "",
        unionWorkUuid: "",
        unionWorkList: "",

        unionMission: "",
        unionMissionCId: 0,
        unionMissionList: "",

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
        wellInterruptTemplate,
        roomInterruptTemplate,

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

        ventilationStartsTime: "", //  通风开始
        ventilationEndTime: "", // 通风结束
        jobStartTime: "", // 作业开始
        jobEndTime: "", // 作业结束

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

        positionList: wellPostion as Record<string, string | boolean | number>[],
        interruptList: wellInterruptTemplate,
        interruptTestPositionIndex: 0,

        xzfzr: '', // 现场负责人
        jcjly: '', // 检测人员

        confinedSpaceType: false // 有限空间类型
    },
    logWorkIn() {
        console.log(this.data);
    },
    onUnionMissionPicker() {
        this.setData({
            unionMissionVisible: true
        })
    },
    onUnionMissionPickerChange(e) {
        console.log(e);
        this.setData({
            unionMissionCId: e.detail.value[0]
        })
    },
    onUnionWorkPicker() {
        const openId = wx.getStorageSync("openId");
        wx.request({
            url: "http://localhost:8092/workJob/getUnionWork",
            method: "GET",
            data: {
                sendOpenId: openId,
                size: 30
            },
            success: _res => {
                if (_res.data) {
                    let index = 1;
                    let workDate = _res.data[0].workDate;
                    _res.data.forEach((item, i) => {
                        if (item.workDate === workDate) {
                            item.index = index;
                            index++;
                        }
                        else {
                            index = 1;
                            item.index = index;
                            workDate = item.workDate;
                        }
                        item.cIndex = i;
                    });

                    let format = _res.data.map((i) => {
                        return {
                            label: `${i.workDate} 申请表${i.index}`,
                            value: i.workUuid,
                            workList: i.workList
                        }
                    })
                    this.setData({ unionWorkVisible: true, unionWorkList: format, baseUnionWorkList: _res.data });
                }
                else {
                    this.handleToast("获取关联申请表错误");
                }
            },
            fail: _res => {
                this.handleToast("获取关联申请表错误");
            }
        })
    },
    onUnionWorkPickerChange(e) {
        console.log(e);
        let { label, value } = e.detail
        let target = e.currentTarget.dataset.key
        console.log(label, value, target);
        this.data.baseUnionWorkList.forEach(element => {
            if (element.workUuid == value[0]) {
                this.setData({
                    unionMissionList: JSON.parse(element.workList).map(i => {
                        console.log(i);
                        return {
                            label: `作业地点：${i.workPosition}`,
                            value: i.id
                        }
                    })
                })
            }
        });
        this.setData({
            [target]: label,
            [`${target}Uuid`]: value[0]
        })
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

    setPositionData(e: any) {
        let value = e.detail.value;
        const key = e.target.dataset.key;
        const index = e.target.dataset.index;
        if (!value && key === "detectionResult") {
            value = e.target.dataset.textvalue === "true"
        }
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
                positionList: e.detail.value ? roomPosition : wellPostion,
                interruptList: e.detail.value ? roomInterruptTemplate : wellInterruptTemplate
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

    handleGroupChange(event) {
        this.setData({
            jobGroup: event.detail.value
        });
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
        this.setData({
            mode,
            positionTimeVisible: true,
            positionTimeIndex: index
        })
    },

    showInterruptPicker(e: any) {
        const { mode, index } = e?.currentTarget?.dataset;
        this.setData({
            mode,
            interruptTimeVisible: true,
            interruptTimeIndex: index
        })
    },

    hidePicker() {
        const { mode } = this.data;
        this.setData({
            [`${mode}Visible`]: false
        });
    },

    onConfirm(e: { detail: { value: string } }) {
        const { value } = e?.detail;
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

    onInterruptConfirm(e: any) {
        const { value } = e?.detail;
        let { interruptTimeIndex, interruptList } = this.data;
        interruptList[interruptTimeIndex].detectionTime = value;
        this.setData({
            interruptList
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

    onLoad() {
        this.getTabBar().setData({
            selected: 1
        });
        wx.hideShareMenu({});
        const query = wx.createSelectorQuery();

        query
            .select('.xcfzrSign')
            .fields({ node: true })
            .exec(res => {
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
                chineseName = '检测记录员';
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
                theme: 'success'
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
        );
    },

    submitJob() {
        const openId = wx.getStorageSync("openId");
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

        if (this.data.isInterrupt && !this.data.interruptStartTime) {
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
                message: '请输入检测记录员名称',
                theme: 'fail'
            });
            return;
        }
        if (!this.data.jcjlyDrawOk) {
            this.handleToast({
                message: '请检测记录员签字',
                theme: 'fail'
            });
            return;
        }

        const data = {
            jobContent: this.data.jobContent,
            jobDate: this.data.dateText,
            jobPosition: this.data.jobPosition,

            riskFactorsValue: this.data.riskFactorsValue, //
            safetyDisclosureValue: this.data.safetyDisclosureValue, //
            inspectionEquipmentValue: this.data.inspectionEquipmentValue, //
            safetyProtectionValue: this.data.safetyProtectionValue, //
            emerRescueValue: this.data.emerRescueValue, //
            otherInfo: this.data.otherInfo, //

            ventilationStartsTime: this.data.ventilationStartsTime, //  通风开始
            ventilationEndTime: this.data.ventilationEndTime, // 通风结束

            jobStartTime: this.data.jobStartTime,
            jobEndTime: this.data.jobEndTime,

            isInterrupt: this.data.isInterrupt, //
            interruptStartTime: this.data.interruptStartTime, // 中断开始时间
            interruptEndTime: this.data.interruptEndTime, // 中断结束时间

            confinedSpaceType: this.data.confinedSpaceType,

            positionList: JSON.stringify(this.data.positionList),
            interruptList: JSON.stringify(this.data.interruptList),

            gasDetectionBase64Arr: this.data.gasDetectionBase64Arr.toString(),
            signBoardBase64Arr: this.data.signBoardBase64Arr.toString(),
            exhaustBase64Arr: this.data.exhaustAirBase64Arr.toString(),

            xcfzr: this.data.xcfzr,
            xcfzrBase64: this.data.xcfzrBase64,
            jcjly: this.data.jcjly,
            jcjlyBase64: this.data.jcjlyBase64,
            sendOpenId: openId,
        };
        const that = this;
        wx.request({
            // url: 'https://zhouhaoyiu.oicp.vip/Job/addJob',
            url: "http://localhost:8092/recordJob/addRecordJob",
            method: 'POST',
            data: data,
            success(res) {
                that.handleToast({
                    message: res.data == 1 ? '提交成功' : '提交失败',
                    theme: res.data == 1 ? 'success' : 'fail'
                });
                // that.setData({
                //     xcfzr: '',
                //     xcfzrHasDraw: false,
                //     xcfzrDrawOk: false, // 现场负责人签字完成
                //     xcfzrDrawShow: false,
                //     xzfzrSrc: null,
                //     xcfzrBase64: null,

                //     jcjly: '', // 检测人员
                //     jcjlyHasDraw: false,
                //     jcjlyDrawOk: false,
                //     jcjlyDrawShow: false,
                //     jcjlySrc: null,
                //     jcjlyBase64: null,
                //     // 作业日期的选择
                //     mode: '',
                //     dateVisible: false,
                //     timeVisible: false,
                //     date: new Date().getTime(), // 支持时间戳传入
                //     time: new Date().getHours() + ':' + new Date().getMinutes(),

                //     jobContent: '', // 作业内容
                //     dateText: '', // 作业日期
                //     jobPosition: '', // 作业地点

                //     // 安全选项
                //     riskFactorsValue: true, // 危险因素
                //     safetyDisclosureValue: true, // 安全交底
                //     inspectionEquipmentValue: true, // 检测设备情况
                //     safetyProtectionValue: true, // 安全防护设备
                //     emerRescueValue: true, // 应急救援装备
                //     otherInfo: '', // 其他补充措施

                //     ventilationStartsTime: "", //  通风开始
                //     ventilationEndTime: "", // 通风结束
                //     jobStartTime: "", // 作业开始
                //     jobEndTime: "", // 作业结束

                //     isInterrupt: false, // 是否中断
                //     interruptStartTime: "", // 中断开始时间
                //     interruptEndTime: "", // 中断结束时间

                //     gasDetectionImgArr: [] as string[], // 气体检测图片数组
                //     gasDetectionBase64Arr: [] as (string | ArrayBuffer)[], // 气体检测图片base64数组

                //     signBoardImgArr: [] as string[], // 标志牌图片数组
                //     signBoardBase64Arr: [] as (string | ArrayBuffer)[],

                //     exhaustAirImgArr: [] as string[], // 排气图片数组
                //     exhaustAirBase64Arr: [] as (string | ArrayBuffer)[], // 排气图片base64数组
                //     imgPreview: '', // 图片预览

                //     positionList: wellPostion as Record<any, any>[],
                //     interruptList: wellInterruptTemplate,
                //     interruptTestPositionIndex: 0,

                //     confinedSpaceType: false // 有限空间类型
                // });
            },
            fail(res) {
                that.handleToast({
                    message: res.data,
                    theme: 'fail'
                });
            }
        });
    },


    setInterruptInputData(e) {
        let value = e.detail.value;
        const key = e.target.dataset.key;
        if (!value && key === "detectionResult") {
            value = e.target.dataset.textvalue === "true"
        }
        const index = e.target.dataset.index;
        const { interruptList } = this.data;
        interruptList[index][key] = value;
        this.setData({
            interruptList
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

    udf() {
        void 0;
    },

    test() {
        console.log('test');
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

});
