---
id: custom-volume-loading
---
    
# 自定义体积加载顺序
    
在本操作指南中，我们将向您展示如何以自定义顺序加载体积。
    
## 介绍
    
`Volumes` 可以由一组 2D 图像构成，您可能会问一个问题：
    
:::note 如何
    
在体积加载过程中，如何重新排序图像请求（自上而下、自下而上等）？
    
:::
    
## 实现
    
让我们重新排序两个体积加载，使它们的切片一起加载（而不是一个体积接一个体积地加载）。要创建自定义的体积加载顺序，我们需要从体积对象中获取 `imageLoadRequests` 并按自定义顺序排序它们。
    
### 步骤 1：创建体积
    
我们根据之前的教程，使用一组 `imageIds` 创建一个体积。
    
```js
const ptVolume = await volumeLoader.createAndCacheVolume(ptVolumeId, {
  imageIds: ptImageIds,
});
const ctVolume = await volumeLoader.createAndCacheVolume(ctVolumeId, {
  imageIds: ctVolumeImageIds,
});
```
    
### 步骤 2：获取 imageLoad 请求
    
接下来，我们需要获取 imageLoad 请求。
    
```js
const ctRequests = ctVolume.getImageLoadRequests();
const ptRequests = ptVolume.getImageLoadRequests();
```
    
### 步骤 3：自定义请求排序
    
我们使用 lodash 辅助工具以一种依次的方式合并请求。
    
```js
import _ from 'lodash';

const ctPtRequests = _.flatten(_.zip(ctRequests, ptRequests)).filter(
  (el) => el
);
```
    
### 步骤 4：将请求添加回 imageLoadPoolManager
    
我们需要将请求添加回 `imageLoadPoolManager`（我们还需要处理要绑定到 `callLoadImage` 的值）。
    
```js
ctPtRequests.forEach((request) => {
  const {
    callLoadImage,
    requestType,
    additionalDetails,
    priority,
    imageId,
    imageIdIndex,
    options,
  } = request;

  imageLoadPoolManager.addRequest(
    callLoadImage.bind(null, imageId, imageIdIndex, options),
    requestType,
    additionalDetails,
    priority
  );
});
```
    
:::note 提示
    
无需调用 `volume.load`，因为此方法基本上执行了与我们的步骤 3 和 4 相同的过程。
    
:::
    
## 结果
    
![customLoading](../assets/custom-loading.gif)