---

id: requestPoolManager
sidebar_position: 12
---

# 请求池管理器

请求池管理器已经经过了广泛的重构，以提供两个新功能：1）`异步图像检索与解码` 2）`请求重新排序`。

## 图像加载与图像检索队列

之前，只有一个加载队列用于获取和解码图像。  
一旦图像解码完成，就会启动一个新的请求。当解码需要时间时，这就存在一个限制；即使根据配置的最大请求数允许额外的请求，也不会发送新的检索（获取）请求。

为了解决这一限制，专门创建了两个不同的队列：`imageRetrievalPoolManager` 和 `imageLoadPoolManager`，每个队列都有其可配置的最大并发作业数。它们是分开的并且异步执行，使得每个检索请求都能在请求触发槽位可用时立即启动。

从 `Cornerstone-wado-image-loader` 版本 `v4.0.0-rc` 或更高版本开始，默认启用了图像检索请求与解码的分离。

```js
// 加载 = 检索 + 解码
imageLoadPoolManager.maxNumRequests = {
  interaction: 1000,
  thumbnail: 1000,
  prefetch: 1000,
};

// 检索（通常）=== XHR 请求
imageRetrievalPoolManager.maxNumRequests = {
  interaction: 20,
  thumbnail: 20,
  prefetch: 20,
};
```

### 使用方法

在您的自定义 `imageLoader` 或 `volumeLoader` 中，为了正确使用 cornerstone 中的池管理器，您需要定义一个 `sendRequest` 函数来发起加载图像请求。

```js
import {
  imageLoadPoolManager,
  loadAndCacheImage,
  RequestType,
} from '@cornerstonejs/core';

function sendRequest(imageId, imageIdIndex, options) {
  return loadAndCacheImage(imageId, options).then(
    (image) => {
      // 渲染
      successCallback.call(this, image, imageIdIndex, imageId);
    },
    (error) => {
      errorCallback.call(this, error, imageIdIndex, imageId);
    }
  );
}

const imageId = 'schema://image';
const imageIdIndex = 10;

const requestType = RequestType.INTERACTION;
const priority = -5;
const additionalDetails = { imageId };
const options = {
  targetBuffer: {
    type: 'Float32Array',
  },
};

imageLoadPoolManager.addRequest(
  sendRequest.bind(this, imageId, imageIdIndex, options),
  requestType,
  additionalDetails,
  priority
);
```

## 请求重新排序

您可能希望按特定的顺序来检索图像。例如，假设您希望从中间切片开始加载一个体积，然后加载顶部和底部。我们在 `cornerstoneStreamingImageVolumeLoader` 中实现了这样的选项。您可以在 [请求重新排序](../streaming-image-volume/re-order) 部分了解更多内容。