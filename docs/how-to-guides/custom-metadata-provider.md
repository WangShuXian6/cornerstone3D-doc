---
id: custom-metadata-provider
sidebar_position: 2
---
    
# 自定义元数据提供器
    
在本操作指南中，我们将向您展示如何创建一个自定义元数据提供器。您应该熟悉以下核心概念：
    
- [图像加载器](../concepts/cornerstone-core/imageLoader.md)
- [图像对象](../concepts/cornerstone-core/images.md)
- [元数据提供器](../concepts/cornerstone-core/metadataProvider.md)
    
## 介绍
    
Cornerstone **不处理**元数据的获取。它使用已注册的元数据提供器（按优先级顺序）来调用每个提供器，传递要获取的 `imageId` 和元数据的 `type`。通常，元数据提供器有一个方法将解析的元数据添加到其缓存中。
    
您可能会问一个问题：
    
:::note 如何
    
我如何构建一个自定义元数据提供器？
    
:::
    
## 实现
    
通过以下步骤，我们实现一个自定义元数据提供器，该提供器存储 PT 图像的缩放因子元数据。
    
### 步骤 1：创建添加方法
    
我们需要在缓存中存储元数据，并且需要一个方法来添加元数据。
    
```js
const scalingPerImageId = {};

function add(imageId, scalingMetaData) {
  const imageURI = csUtils.imageIdToImageURI(imageId);
  scalingPerImageId[imageURI] = scalingMetaData;
}
```
    
<details>
    
<summary>imageId vs imageURI</summary>
    
随着 `Cornerstone3D` 中 `Volumes` 的添加，以及 `Volumes` 和 `Images` 之间内部进行的缓存优化
([`imageLoader`](../concepts/streaming-image-volume/streaming.md#imageloader))
，我们应该在提供器的缓存中存储 imageURI（而不是 `imageId`），因为
imageURI 对每个图像都是唯一的，但可以通过不同的加载方案进行检索。
    
</details>
    
### 步骤 2：创建提供器
    
接下来，需要一个提供器函数，根据元数据的类型获取特定 `imageId` 的元数据。在这种情况下，提供器只关心 `scalingModule` 类型，
如果在缓存中存在 `imageId` 的元数据，它将返回该元数据。
    
```js
function get(type, imageId) {
  if (type === 'scalingModule') {
    const imageURI = csUtils.imageIdToImageURI(imageId);
    return scalingPerImageId[imageURI];
  }
}
```
    
### 步骤 3：注册提供器
    
最后，我们需要将提供器注册到 Cornerstone。
    
```js title="/src/myCustomProvider.js"
const scalingPerImageId = {};

function add(imageId, scalingMetaData) {
  const imageURI = csUtils.imageIdToImageURI(imageId);
  scalingPerImageId[imageURI] = scalingMetaData;
}

function get(type, imageId) {
  if (type === 'scalingModule') {
    const imageURI = csUtils.imageIdToImageURI(imageId);
    return scalingPerImageId[imageURI];
  }
}

export { add, get };
```
    
```js title="src/registerProvider.js"
import myCustomProvider from './myCustomProvider';

const priority = 100;
cornerstone.metaData.addProvider(
  myCustomProvider.get.bind(myCustomProvider),
  priority
);
```
    
## 使用示例
    
现在提供器已注册，我们可以使用它来获取图像的元数据。但首先，假设在图像加载过程中我们获取了 `imageId` 的元数据
并将其存储在提供器的缓存中。之后，我们可以使用提供器来获取 `imageId` 的元数据并使用它（例如，正确显示 SUV 值
用于工具）。
    
```js
// 获取此 metaData
const imagePlaneModule = cornerstone.metaData.get(
  'scalingModule',
  'scheme://imageId'
);
```