---
id: streaming
---

# 体积数据的流式传输

随着 [`Volumes`](../cornerstone-core/volumes.md) 被添加到 `Cornerstone3D`，我们正在添加和维护 `Streaming-volume-image-loader`，这是一个用于体积的渐进式加载器。此加载器旨在接受 imageIds 并将它们加载到 `Volume` 中。

## 从图像创建体积

由于 3D `Volume` 由 2D 图像组成（在 `StreamingImageVolume` 中），其体积元数据来源于 2D 图像的元数据。因此，此加载器需要初始调用来获取图像元数据。通过这种方式，我们不仅可以预先分配并缓存内存中的 `Volume`，还可以在 2D 图像被加载时渲染体积（渐进式加载）。

![](../../assets/volume-building.png)

通过预先获取所有图像（`imageIds`）的元数据，我们不需要为每个 imageId 创建 [`Image`](../cornerstone-core/images.md) 对象。相反，我们可以将图像的 pixelData 直接插入到体积中的正确位置。这保证了速度和内存效率（但带来了预获取元数据的最低成本）。

## 将体积与图像相互转换

`StreamingImageVolume` 基于一系列获取的图像（2D）加载体积，`Volume` 可以实现将其 3D 像素数据转换为 2D 图像的功能，而无需通过网络重新请求它们。例如，使用 `convertToCornerstoneImage`，`StreamingImageVolume` 实例接受一个 imageId 及其 imageId 索引，并返回一个 Cornerstone Image 对象（ImageId 索引是必需的，因为我们希望在 3D 数组中定位 imageId 的 pixelData 并将其复制到 Cornerstone Image 中）。

这是一个可以逆转的过程；如果一组 `imageIds` 具有体积的属性（相同的参考系、起点、维度、方向和像素间距），`Cornerstone3D` 可以从这些 `imageIds` 创建一个体积。

## 使用

如前所述，应事先从图像元数据创建预缓存体积。这可以通过调用 `createAndCacheVolume` 来完成。

```js
const ctVolumeId = 'cornerstoneStreamingImageVolume:CT_VOLUME';
const ctVolume = await volumeLoader.createAndCacheVolume(ctVolumeId, {
  imageIds: ctImageIds,
});
```

然后，体积可以调用其 `load` 方法来实际加载图像的像素数据。

```js
await ctVolume.load();
```

## imageLoader

由于体积加载器不需要为 `StreamingImageVolume` 中的每个 imageId 创建 [`Image`](../cornerstone-core/images.md) 对象，它将内部使用 `skipCreateImage` 选项来跳过图像对象的创建。否则，体积的图像加载器与 `cornerstone-wado-image-loader` 中编写的 wadors 图像加载器相同。

```js
const imageIds = ['wadors:imageId1', 'wadors:imageId2'];

const ctVolumeId = 'cornerstoneStreamingImageVolume:CT_VOLUME';

const ctVolume = await volumeLoader.createAndCacheVolume(ctVolumeId, {
  imageIds: ctImageIds,
});

await ctVolume.load();
```

## 可考虑的替代实现

尽管我们相信我们的预获取体积方法确保了体积尽可能快速地加载，但仍然可以有其他不依赖此预获取的体积加载器实现。

#### 创建不预获取元数据的体积

在这种情况下，每个图像需要单独创建，这意味着每个图像需要被加载并且应该创建一个 Cornerstone [`Image`](../cornerstone-core/images.md)。这是一个昂贵的操作，因为所有图像对象都被加载到内存中，并且需要从这些图像单独创建一个 [`Volume`](../cornerstone-core/volumes.md)。

优点：

- 不需要单独的元数据调用来获取图像元数据。

缺点：

- 性能成本
- 无法渐进式加载图像数据，因为它需要为每个图像更改创建一个新的体积