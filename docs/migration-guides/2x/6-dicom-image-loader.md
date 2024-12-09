---
id: dicom-image-loader
title: '@cornerstonejs/dicom-image-loader'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';



# @cornerstonejs/dicom-image-loader

## 初始化和配置

**之前：**

```js
cornerstoneDICOMImageLoader.external.cornerstone = cornerstone;
cornerstoneDICOMImageLoader.external.dicomParser = dicomParser;
cornerstoneDICOMImageLoader.configure({
  useWebWorkers: true,
  decodeConfig: {
    convertFloatPixelDataToInt: false,
    use16BitDataType: preferSizeOverAccuracy || useNorm16Texture,
  },
});

// 其他配置...
cornerstoneDICOMImageLoader.webWorkerManager.initialize(config);
```

**之后：**

```js
cornerstoneDICOMImageLoader.init();

// 可选地，您可以向 init 传递一个配置对象
cornerstoneDICOMImageLoader.init({
  maxWebWorkers: 2, //
});
```

**迁移指南：**

1. 您应该将 `configure` 替换为 `init`
2. 您不再需要传递 `cornerstone` 和 `dicomParser`，我们在内部使用它们并作为依赖项导入
3. 移除 `useWebWorkers` 选项，因为现在始终使用 web workers
4. 移除 `decodeConfig` 选项，因为它们不再适用
5. 移除单独的 `webWorkerManager.initialize` 调用，因为它现在在内部处理
6. 在配置选项中设置 `maxWebWorkers`，而不是使用单独的配置对象
   1. 默认情况下，我们设置可用核心的一半

### 移除外部模块

`externalModules` 文件已被移除。任何依赖于 `cornerstone.external` 的代码应更新为使用直接导入或新的配置方法。
我们只将 `cornerstonejs/core` 和 `dicomparser` 视为其他依赖项，并在内部直接导入它们。

### Webpack 配置

如果您的配置中存在以下 Webpack 规则，请将其移除：

```json
{
  test: /\.worker\.(mjs|js|ts)$/,
  use: [
    {
      loader: 'worker-loader',
    },
  ],
}
```

Web workers 现在由库内部处理。

## 始终 `Prescale`

默认情况下，Cornerstone3D 始终使用模态 LUT（重新缩放斜率和截距）预缩放图像。您可能不需要对代码库进行任何更改。

<details>
<summary>为什么？</summary>
之前，视口决定是否预缩放，所有视口都遵循这种方法。然而，我们在一些用户实现的自定义图像加载器中发现了预缩放错误。我们现在通过一致地应用预缩放来修复这些问题。
</details>

## 解码器更新

`@cornerstonejs/dicomImageLoader` 之前使用了旧的 web workers API，现在已弃用。它已通过我们新的内部包装器 `comlink` 转换为新的 web workers API。这一更改使与 web workers 的交互更加无缝，并促进了将 web workers 编译和打包以匹配库的 ESM 版本。

<details>
<summary>为什么？</summary>

使用新的 ES 模块格式整合 web worker API，这将使像 `vite` 这样的新打包器能够与库无缝协作。
</details>

因此，如果您在 webpack 或其他打包器中有自定义逻辑，您可以移除以下规则：

```json
{
  test: /\.worker\.(mjs|js|ts)$/,
  use: [
    {
      loader: 'worker-loader',
    },
  ],
}
```

## 移除对非 web worker 解码器的支持

我们在 cornerstone3D 的 2.0 版本中移除了对非 web worker 解码器的支持。这一更改旨在确保库性能更佳并减少打包大小。

<details>
<summary>为什么？</summary>

我们认为没有充分的理由再使用非 worker 解码器。Web worker 解码器提供更优的性能，并且与现代打包器兼容性更好。
</details>

## 移除 `imageFrame` 上的 `minAfterScale` 和 `maxAfterScale`

取而代之的是 `smallestPixelValue` 和 `largestPixelValue`，之前它们都是一起使用，导致难以使用正确的值。

## DICOM 图像加载器 ESM 默认

我们在 cornerstone3D 的 2.0 版本中将 DICOM 图像加载器的默认导出更改为 ESM，并正确发布了类型。

这意味着您不再需要为 DICOM 图像加载器设置别名。

<Tabs>
  <TabItem value="Before" label="Before 📦 " default>

可能在您的 webpack 或其他打包器中，您有以下内容

```js
 alias: {
  '@cornerstonejs/dicom-image-loader':
    '@cornerstonejs/dicom-image-loader/dist/dynamic-import/cornerstoneDICOMImageLoader.min.js',
},
```

  </TabItem>
  <TabItem value="After" label="After 🚀🚀">

现在，您可以移除此别名并使用默认导入

  </TabItem>
</Tabs>

<details>
<summary>为什么？</summary>

ESM 是 JavaScript 的未来，我们希望确保库与现代打包器和工具兼容。
</details>

---