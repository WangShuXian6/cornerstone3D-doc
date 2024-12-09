---
id: custom-image-loader
---
    
# 自定义图像加载器
    
在本操作指南中，我们将向您展示如何创建一个自定义图像加载器。您应该熟悉以下核心概念：
    
- [图像加载器](../concepts/cornerstone-core/imageLoader.md)
- [图像对象](../concepts/cornerstone-core/images.md)
- [元数据提供器](../concepts/cornerstone-core/metadataProvider.md)
    
## 介绍
    
Cornerstone **不处理**图像加载。它将图像加载委托给[图像加载器](../concepts/cornerstone-core/imageLoader.md)。Cornerstone 团队开发并维护了常用的图像加载器（使用 `wado-rs` 或 `wado-uri` 从 wado 兼容的 DICOM 服务器加载图像的 `CornerstoneDICOMImageLoader`，用于加载 PNG 和 JPEG 等网络图像的 `CornerstoneWebImageLoader`，以及用于加载 NIFTI 图像的 `cornerstone-nifti-image-loader`）。然而，您可能会问自己：
    
:::note 如何
    
我如何构建一个自定义图像加载器？
    
:::
    
## 实现
    
让我们实现一个使用 `XMLHttpRequest` 获取像素数据并返回一个包含 Promise 的图像加载对象的 `imageLoader`，该 Promise 解析为 Cornerstone [`image`](../concepts/cornerstone-core/images.md)。
    
### 步骤 1：创建图像加载器
    
下面，我们创建一个 `imageLoader`，它接受一个 `imageId` 并返回一个作为 Promise 的 `imageLoadObject`。
    
```js
function loadImage(imageId) {
  // 解析 imageId 并返回可用的 URL（逻辑省略）
  const url = parseImageId(imageId);
    
  // 创建一个新的 Promise
  const promise = new Promise((resolve, reject) => {
    // 在 Promise 构造函数内部，发起图像数据请求
    const oReq = new XMLHttpRequest();
    oReq.open('get', url, true);
    oReq.responseType = 'arraybuffer';
    oReq.onreadystatechange = function (oEvent) {
      if (oReq.readyState === 4) {
        if (oReq.status == 200) {
          // 请求成功，创建图像对象（逻辑省略）
          // 这可能需要将图像解码为原始像素数据，确定行/列，像素间距等
          const image = createImageObject(oReq.response);
    
          // 通过解析 Promise 返回图像对象
          resolve(image);
        } else {
          // 发生错误，通过拒绝 Promise 返回包含错误的对象
          reject(new Error(oReq.statusText));
        }
      }
    };
    
    oReq.send();
  });
    
  // 返回一个包含 Promise 的对象给 cornerstone，以便它可以设置回调
  // 异步调用成功/解析和失败/拒绝的场景。
  return {
    promise,
  };
}
```
    
### 步骤 2：确保图像元数据也可用
    
我们的图像加载器返回一个包含像素数据和相关信息的 `imageLoadObject`，但 Cornerstone 可能还需要[额外的元数据](../concepts/cornerstone-core/metadataProvider.md)才能显示图像。有关如何做到这一点，请参阅[自定义元数据提供器](custom-metadata-provider.md)文档。
    
### 步骤 3：注册图像加载器
    
在实现您的图像加载器后，您需要将其注册到 Cornerstone。首先，您需要决定您的图像加载器支持哪种 URL 方案。假设您的图像加载器希望支持 `custom1` 方案，那么任何以 `custom1://` 开头的 imageId 都将由您的图像加载器处理。
    
```js
// 注册
cornerstone.imageLoader.registerImageLoader('custom1', loadImage);
```
    
## 使用
    
```js
// 以以下方式加载的图像将传递给我们的 loadImage 函数：
stackViewport.setStack(['custom1://example.com/image.dcm']);
```
    
<details>
<summary>
使用视口 API 加载图像
</summary>
    
在 Cornerstone 的早期版本中，您可以使用 `loadImage` 或 `loadAndCacheImage` 来加载图像。然而，在 `Cornerstone3D` 中，这项任务可以通过 `Viewports` API 实现。
    
</details>