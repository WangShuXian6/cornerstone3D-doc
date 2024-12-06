---

id: volumeLoader  
title: 卷加载器  
---  

# 卷加载器  

类似于 [`图像加载器`](./imageLoader.md)，卷加载器接受一个 `volumeId` 和加载卷所需的其他信息，并返回一个 `Promise`，该 `Promise` 解析为一个 `Volume`。  
这个 `Volume` 可以由一组 2D 图像（例如 `imageIds`）构建，也可以来自一个 3D 数组对象（如 `NIFTI` 格式）。  

我们添加了 [`cornerstoneStreamingImageVolumeLoader`](/docs/concepts/streaming-image-volume/streaming) 库来支持将 2D 图像（`imageIds`）流式传输到 3D 卷，它是流式卷的默认卷加载器。  

## 注册卷加载器  

您可以使用 [`registerVolumeLoader`](/api/core/namespace/volumeLoader#registerVolumeLoader) 来定义一个在特定 `scheme` 上调用的卷加载器。  
下面是我们 `cornerstoneStreamingImageVolumeLoader` 的简化代码，其中：  

1. 基于一组 `imageIds`，我们计算卷的元数据，如：间距、原点、方向等。  
2. 实例化一个新的 [`StreamingImageVolume`](/api/streaming-image-volume-loader/class/StreamingImageVolume)  

   - `StreamingImageVolume` 实现了加载方法（`.load`）  
   - 它通过使用 `imageLoadPoolManager` 来实现加载  
   - 每个加载的帧（`imageId`）被放置在 3D 卷的正确切片中  

3. 返回一个 `Volume Load Object`，它具有一个 `Promise`，解析为 `Volume`。  

```js  
function cornerstoneStreamingImageVolumeLoader(  
  volumeId: string,  
  options: {  
    imageIds: Array<string>,  
  }  
) {  
  // 基于 imageIds 计算卷的元数据  
  const volumeMetadata = makeVolumeMetadata(imageIds);  
  const streamingImageVolume = new StreamingImageVolume(  
    // ImageVolume 属性  
    {  
      volumeId,  
      metadata: volumeMetadata,  
      dimensions,  
      spacing,  
      origin,  
      direction,  
      scalarData,  
      sizeInBytes,  
    },  
    // 流式属性  
    {  
      imageIds: sortedImageIds,  
      loadStatus: {  
        loaded: false,  
        loading: false,  
        cachedFrames: [],  
        callbacks: [],  
      },  
    }  
  );  

  return {  
    promise: Promise.resolve(streamingImageVolume),  
    cancel: () => {  
      streamingImageVolume.cancelLoading();  
    },  
  };  
}  

registerVolumeLoader(  
  'cornerstoneStreamingImageVolume',  
  cornerstoneStreamingImageVolumeLoader  
);  

// 用于未提供 scheme 的任何卷  
registerUnknownVolumeLoader(cornerstoneStreamingImageVolumeLoader);  
```  

如上所示，由于 `cornerstoneStreamingImageVolumeLoader` 已注册为 `cornerstoneStreamingImageVolume` scheme，  
我们可以通过传递 `volumeId` 来加载具有 `cornerstoneStreamingImageVolume` scheme 的卷，如下所示：  

```js  
const volumeId = 'cornerstoneStreamingImageVolume:myVolumeId';  

const volume = await volumeLoader.createAndCacheVolume(volumeId, {  
  imageIds: imageIds,  
});  
```  

## 默认未知卷加载器  

默认情况下，如果找不到与 scheme 对应的 `volumeLoader`，则使用 `unknownVolumeLoader`。`cornerstoneStreamingImageVolumeLoader` 是默认的未知卷加载器。  

:::info  
即使您没有提供 scheme，`cornerstoneStreamingImageVolumeLoader` 也会默认使用。  

因此，以下代码也会正常工作：  

```js  
const volumeId = 'myVolumeId';  
const volume = await volumeLoader.createAndCacheVolume(volumeId, {  
  imageIds: imageIds,  
});  
```  