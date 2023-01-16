import Toast, { ToastOptionsType } from "tdesign-miniprogram/toast";

// pages/home/home.ts
Page({
    /**
     * 页面的初始数据
     */
    data: {
        mode: '',
        dateVisible: false,
        date: new Date().getTime(),
        dateText: '',
        workList: [
            {
                id: 0,
                workContent: "",
                workPosition: ""
            }
        ] as any[],
        workListIndex: 1,
        protectiveMeasureGroups: [] as any,
        zyfzr: "",
        jhry: "",
        zyry: ""
    },

    toast(option: ToastOptionsType) {
        Toast({
            context: this,
            selector: '#t-toast',
            ...option,
            direction: 'column'
        });
    },

    handleToast(message: string | ToastOptionsType, theme: "loading" | "success" | "fail") {
        this.toast({
            message: typeof message === 'string' ? message : message.message,
            theme: typeof message === 'string' ? theme : message.theme || undefined
        });
    },

    showWorkDatePicker(e: { currentTarget: { dataset: { mode: string; }; }; }) {
        const { mode } = e?.currentTarget?.dataset;

        this.setData({
            mode,
            [`${mode}Visible`]: true,
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

    hidePicker() {
        const { mode } = this.data;
        this.setData({
            [`${mode}Visible`]: false,
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        wx.hideShareMenu({});
        this.getTabBar().setData({
            selected: 0
        });
    },

    addWork() {
        let temp = this.data.workList;
        temp.push({
            id: this.data.workListIndex,
            workContent: "",
            workPosition: ""
        });
        this.setData({
            workList: temp,
            workListIndex: this.data.workListIndex + 1
        });
    },

    deleteWork(e: any) {
        const { id } = e.target.dataset;
        let temp = this.data.workList;
        // 至少保留一条工作
        if (temp.length <= 1) {
            return;
            // wx.showToast({
            //     title: '需要至少保留一条',
            //     icon: 'none'
            // })
        }
        temp = temp.filter((item: any) => item.id != id);
        this.setData({
            workList: temp
        });
    },

    handleGroupChange(event: { detail: { value: string; }; }) {
        this.setData({
            protectiveMeasureGroups: event.detail.value,
        });
    },

    setInputData(e: any) {
        this.setData({
            [e.target.dataset.inputfield]: e.detail.value
        });
    },

    setWorkListInputData(e: { target: { dataset: { index: number, inputfield: string }; }; detail: { value: string } }) {
        const value = e.detail.value;
        const { index, inputfield } = e.target.dataset;
        let { workList } = this.data;
        workList[index][inputfield] = value
        this.setData({
            workList
        })

    },

    submitWork() {
        const openId = wx.getStorageSync("openId");

        if (this.data.dateText == "") {
            this.handleToast("请填写作业日期", "fail");
            return;
        }
        if (this.data.zyfzr == "") {
            this.handleToast('请填写作业负责人', 'fail');
            return;
        }
        if (this.data.jhry == "") {
            this.handleToast('请填写监护人员', "fail");
            return;
        }
        if (this.data.zyry == "") {
            this.handleToast('请填写作业人员', "fail");
            return;
        }
        if (this.data.protectiveMeasureGroups.length == 0) {
            this.handleToast("请选择防护措施", "fail");
            return;
        }

        // 检查工作内容是否为空
        let workList = this.data.workList;
        for (let i = 0; i < workList.length; i++) {
            if (workList[i].workContent == "") {
                this.handleToast('请填写工作内容', "fail");
                return;
            }
            if (workList[i].workPosition == "") {
                this.handleToast("请填写工作地点", "fail");
                return;
            }
        }

        wx.request({
            url: "https://zhouhaoyiu.oicp.vip/workJob/addWorkJob",
            method: "POST",
            data: {
                workDate: this.data.dateText,
                workList: JSON.stringify(this.data.workList),
                zyfzr: this.data.zyfzr,
                jhry: this.data.jhry,
                zyry: this.data.zyry,
                protectiveMeasureGroups: JSON.stringify(this.data.protectiveMeasureGroups),
                sendOpenId: openId,
            },
            success: (_res: { data: { code: number, data: number } }) => {
                if (_res.data.data === 1) {
                    this.handleToast("提交作业审批成功", "success")
                }
            }
        })
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
