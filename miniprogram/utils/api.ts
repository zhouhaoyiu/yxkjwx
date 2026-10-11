export const API_BASE = "https://safety.example.invalid";

export function request<T extends string | ArrayBuffer | WechatMiniprogram.IAnyObject = WechatMiniprogram.IAnyObject>(options: WechatMiniprogram.RequestOption<T>) {
    const token = wx.getStorageSync("sessionToken");
    return wx.request<T>({
        ...options,
        url: API_BASE + options.url,
        timeout: 20000,
        header: { ...options.header, Authorization: token ? `Bearer ${token}` : "" },
        success: response => {
            if (response.statusCode === 401 && options.url !== "/auth/login") {
                wx.removeStorageSync("sessionToken");
                wx.removeStorageSync("login");
                wx.reLaunch({ url: "/pages/login/login" });
            }
            options.success?.(response);
        },
    });
}
