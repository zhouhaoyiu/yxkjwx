type DraftPage = {
    data: Record<string, unknown>;
    setData: (data: Record<string, unknown>, callback?: () => void) => void;
};
export function attachDraft(page: DraftPage, name: string) {
    const fs = wx.getFileSystemManager();
    const owner = encodeURIComponent(String(wx.getStorageSync("openId") || "anonymous"));
    const path = wx.env.USER_DATA_PATH + "/" + name + "-" + owner + ".json";
    const setData = page.setData.bind(page);
    let timer: ReturnType<typeof setTimeout> | undefined;
    let disabled = false;
    const save = () => {
        if (timer) clearTimeout(timer);
        if (disabled) return;
        try {
            const content = Object.fromEntries(Object.entries(page.data).filter(([key]) =>
                !/Context|Canvas|Visible|Show|loading|submitting|draftState/.test(key)));
            fs.writeFileSync(path + ".tmp", JSON.stringify(content), "utf8");
            fs.renameSync(path + ".tmp", path);
            setData({ draftState: "草稿已保存" });
        } catch { setData({ draftState: "草稿未保存，请勿关闭页面" }); }
    };
    try {
        const draft = JSON.parse(fs.readFileSync(path, "utf8") as string);
        if (draft && typeof draft === "object" && !Array.isArray(draft)) setData(draft);
    } catch {
        try {
            fs.accessSync(path);
            disabled = true;
            setData({ draftState: "草稿读取失败，原文件已保留" });
        } catch { /* First visit has no draft. */ }
    }
    page.setData = (data, callback) => {
        setData(data, callback);
        if (timer) clearTimeout(timer);
        timer = setTimeout(save, 300);
    };
    return {
        save,
        clear() {
            disabled = true;
            if (timer) clearTimeout(timer);
            try { fs.unlinkSync(path); } catch { /* No saved draft. */ }
            setData({ draftState: "记录已提交" });
        },
        resume() { disabled = false; },
        dispose() { save(); if (timer) clearTimeout(timer); },
    };
}
