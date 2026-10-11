# 有限空间作业小程序

`pnpm install --frozen-lockfile` 后通过微信开发者工具构建 npm。

在 `miniprogram/utils/api.ts` 设置服务 HTTPS 地址并配置合法域名。账号由 yxkj-Java 服务维护，登录成功后取得短期会话。发布时不要写入密码或长期访问令牌。

现场记录自动保存到小程序私有目录，按账号隔离。服务器明确确认成功后才清理草稿，失败保留签字、照片和请求 ID。重复提交由后端事务与唯一索引处理。审批缺少签字时不会发请求。

运行 `pnpm type-check`、`pnpm lint`、`pnpm test`。上线前需在微信开发者工具及实际设备上验证拍照、定位、签字和断网恢复。
