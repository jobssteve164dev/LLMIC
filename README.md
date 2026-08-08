# LLMIC

一个面向普通读者的 3D 芯片制造科普网站。项目以 Intel 4004 为叙事主线，用 18 个可交互场景串起需求定义、硅晶圆、PMOS 晶体管、互连、封装和计算器应用。

## 体验设计

- 完整旅程与 2 分钟速览两种路径
- 可旋转、缩放的 3D 模型；关键裸片场景使用公开的 4004 档案校正版图
- 每一步区分直接史料、同期工艺还原和现代工艺类比
- 桌面、手机、键盘和减少动态效果偏好均可使用
- 资料入口直达 Intel、Computer History Museum、原始数据手册等专业来源
- 页脚法律与合规文件、LLMIC 产品补充说明由 SZLKlaws 提供当前正式发布版本

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

代码以 [MIT License](LICENSE) 开源。`public/historical/4004` 中的历史版图及其衍生图像不适用 MIT，而按 Intel IPNC 与 4004.com 的 CC BY-NC-SA 3.0 非商业边界单独发布；完整归属、处理方式和限制见[资产说明](public/historical/4004/NOTICE.md)与[许可原文](public/historical/4004/Intel-IPNC-License.txt)。

工艺剖面、图层垂直间距与钝化开窗是明确标注的教学还原。Intel、4004 及相关商标属于其各自权利人，本项目与 Intel 无隶属或背书关系。
