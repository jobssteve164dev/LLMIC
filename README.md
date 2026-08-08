# LLMIC

一个面向普通读者的 3D 芯片制造科普网站。项目以 Intel 4004 为叙事主线，用 18 个可交互场景串起需求定义、硅晶圆、PMOS 晶体管、互连、封装和计算器应用。

## 体验设计

- 完整旅程与 2 分钟速览两种路径
- 可旋转、缩放的原创教学 3D 模型
- 每一步区分直接史料、同期工艺还原和现代工艺类比
- 桌面、手机、键盘和减少动态效果偏好均可使用
- 资料入口直达 Intel、Computer History Museum、原始数据手册等专业来源

## 本地运行

需要 Node.js 22 或更新版本。

```bash
npm install
npm run dev
```

## 验证

```bash
npm run check
npm test
npm run build
npm audit --omit=dev --audit-level=high
```

## 部署

网站使用 Cloudflare Workers Static Assets。复制 `.env.example` 为 `.env` 并配置 Cloudflare 身份后运行：

```bash
npm run deploy
```

生产域名：<https://llmic.szlk.uk>

## 研究与设计文档

- [Intel 4004 3D 生产全流程设计报告](docs/intel-4004-3d-production-design-report.md)
- [界面设计系统](design-system/MASTER.md)

## 许可

代码以 [MIT License](LICENSE) 开源。站内 3D 场景均为原创教学示意；Intel、4004 及相关商标属于其各自权利人。
