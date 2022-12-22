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
        console.log(mode);

        this.setData({
            mode,
            [`${mode}Visible`]: true,
        });
    },

    onConfirm(e: { detail: { value: any } }) {
        const { value } = e?.detail;
        const { mode } = this.data;
        console.log(mode, value);

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
        console.log('group', event.detail.value);
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
        console.log(workList);

        this.setData({
            workList
        })

    },

    submitWork() {
        const openId = wx.getStorageSync("openId");
        // console.log(this.data.dateText);

        // 对数据进行检查，如果有空值，提示用户
        if (this.data.dateText == "") {
            wx.showToast({
                title: '请选择日期',
                icon: 'none'
            })
            return;
        }
        if (this.data.zyfzr == "") {
            wx.showToast({
                title: '请填写作业负责人',
                icon: 'none'
            })
            return;
        }
        if (this.data.jhry == "") {
            wx.showToast({
                title: '请填写监护人员',
                icon: 'none'
            })
            return;
        }
        if (this.data.zyry == "") {
            wx.showToast({
                title: '请填写作业人员',
                icon: 'none'
            })
            return;
        }
        if (this.data.protectiveMeasureGroups.length == 0) {
            wx.showToast({
                title: '请选择防护措施',
                icon: 'none'
            })
            return;
        }

        // 检查工作内容是否为空
        let workList = this.data.workList;
        for (let i = 0; i < workList.length; i++) {
            if (workList[i].workContent == "") {
                wx.showToast({
                    title: '请填写工作内容',
                    icon: 'none'
                })
                return;
            }
            if (workList[i].workPosition == "") {
                wx.showToast({
                    title: '请填写工作地点',
                    icon: 'none'
                })
                return;
            }
        }


        wx.request({
            url: "http://localhost:8092/workJob/addWorkJob",
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
            success: _res => {
                console.log(_res);
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
