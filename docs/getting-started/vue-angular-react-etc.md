---
id: vue-angular-react-etc
title: 'React, Vue, Angular 等'
---

以下是如何在 React、Vue、Angular 等框架中使用 cornerstone3D 的一些示例。
我们已使 cornerstone3D 与您喜爱的框架的使用变得轻松。

请按照下面的链接查看如何在您喜爱的框架中使用 cornerstone3D。

- [Cornerstone3D 与 React](https://github.com/cornerstonejs/vite-react-cornerstone3d)
- [Cornerstone3D 与 Vue](https://github.com/cornerstonejs/vue-cornerstone3d)
- [Cornerstone3D 与 Angular](https://github.com/cornerstonejs/angular-cornerstone3d)
  - [社区维护项目](https://github.com/yanqzsu/ng-cornerstone)
- [Cornerstone3D 与 Next.js](https://github.com/cornerstonejs/nextjs-cornerstone3d)


## Vite

要更新您的 Vite 配置，请使用 CommonJS 插件，将 `dicom-image-loader` 从优化中排除，并包含 `dicom-parser`。我们计划将 `dicom-image-loader` 转换为 ES 模块，以消除将来需要排除的需求。

```javascript
import { viteCommonjs } from "@originjs/vite-plugin-commonjs"


export default defineConfig({
  plugins: [viteCommonjs()],
  optimizeDeps: {
    exclude: ["@cornerstonejs/dicom-image-loader"],
    include: ["dicom-parser"],
  },
})
```


## Webpack

对于 webpack，只需安装 cornerstone3D 库并将其导入到您的项目中。

如果您之前使用过

`noParse: [/(codec)/],`

来避免在 webpack 模块中解析编解码器，请删除该行。cornerstone3D 库现在将编解码器作为 ES 模块包含。