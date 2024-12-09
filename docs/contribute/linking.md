---
id: linking
---

# 将 Cornerstone 库与 OHIF 进行开发链接

通常，您可能希望将一个包链接到 Cornerstone3D，这可能是为了开发一个功能、调试一个错误或其他原因。

此外，有时您可能希望链接外部包，以将库包含到您的构建中，这些库不是直接的依赖项，而是动态加载的。详情请参阅 externals/README.md 文件。

## Yarn Link

链接包的方法有多种。最常用的方法是使用 [`yarn link`](https://classic.yarnpkg.com/en/docs/cli/link)。

本指南解释了如何将本地 Cornerstone 库与 OHIF 进行开发链接。

## 前提条件

- 本地克隆的 OHIF Viewer
- 本地克隆所需的 Cornerstone 库（@cornerstonejs/core、@cornerstonejs/tools 等）
- Yarn 包管理器

## 链接库的步骤

1. **准备 Cornerstone 库**

   导航到您要链接的 Cornerstone 库目录（例如，@cornerstonejs/core）：

   ```bash
   cd packages/core
   ```

   首先取消任何现有的链接：

   ```bash
   yarn unlink
   ```

   创建链接：

   ```bash
   yarn link
   ```

   构建包以确保最新的更改：

   ```bash
   yarn dev
   ```

2. **在 OHIF 中链接**

   在您的 OHIF 项目目录中：

   ```bash
   yarn link @cornerstonejs/core
   ```

   启动 OHIF：

   ```bash
   yarn dev
   ```

## 使用多个库

您可以同时链接多个 Cornerstone 库。例如，要同时链接 core 和 tools：

```bash
# 在 cornerstone/packages/core 中
yarn unlink
yarn link
yarn dev

# 在 cornerstone/packages/tools 中
yarn unlink
yarn link
yarn dev

# 在 OHIF 中
yarn link @cornerstonejs/core
yarn link @cornerstonejs/tools
```

## 验证链接

1. 在链接的库中做一个可见的更改（例如，修改 tools 中的线宽）
2. 使用 `yarn dev` 重新构建库
3. 更改应自动反映在 OHIF 中

## 重要提示

- 每次更改后，始终在 Cornerstone 库中运行 `yarn dev`
- 由于 Cornerstone 3D 2.0 中的 ESM 迁移，链接过程比以前更简单
- 完成后，在两个项目中使用 `yarn unlink` 移除链接

## 故障排除

如果更改未反映：

1. 确保库已重新构建（`yarn dev`）
2. 检查控制台是否有任何链接错误
3. 使用浏览器控制台验证是否链接了正确的库版本

## 视频教程

<iframe width="560" height="315" src="https://www.youtube.com/embed/IOXQ1od6DZA?si=3QP4rppQgedJn7y8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## 提示

1. `yarn link` 实际上是在包之间创建了一个符号链接。如果您的链接不起作用，请检查 `Cornerstone3D` 目录中的 `node_modules`，以查看是否已创建符号链接（更新后的源代码——而不是 dist——可在 `node_modules` 中找到）。

2. 如果您的 `debugger` 没有命中，您可能需要将 webpack 中的 `mode` 设置从 `production` 更改为 `development`。这确保源代码不会被压缩。

3. 使用更详细的源映射进行调试。您可以在 [这里](https://webpack.js.org/configuration/devtool/) 阅读更多内容。