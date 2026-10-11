import { request } from "../../utils/api";
Page({
    data: { username: "", password: "", submitting: false, error: "" },
    setInputData(e: MiniEvent<{ value: string }, { inputfield: string }>) {
        const field = e.target.dataset.inputfield;
        if (field === "username" || field === "password") this.setData({ [field]: e.detail.value });
    },
    wxLogin() {
        if (this.data.submitting) return;
        if (!this.data.username.trim() || !this.data.password) { this.setData({ error: "请输入账号和密码" }); return; }
        this.setData({ submitting: true, error: "" });
        request<{ token: string; id: string; role: string }>({
            url: "/auth/login", method: "POST",
            data: { username: this.data.username.trim(), password: this.data.password },
            success: res => {
                if (res.statusCode !== 200 || !res.data.token) { this.setData({ error: "登录失败，请核对账号或稍后重试" }); return; }
                wx.setStorageSync("sessionToken", res.data.token);
                wx.setStorageSync("openId", res.data.id);
                wx.setStorageSync("role", res.data.role);
                wx.setStorageSync("login", true);
                this.setData({ password: "" });
                wx.switchTab({ url: "/pages/recordPage/recordPage" });
            },
            fail: () => this.setData({ error: "连接失败，请检查网络" }),
            complete: () => this.setData({ submitting: false }),
        });
    },
});
