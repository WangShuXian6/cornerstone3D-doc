---
id: re-order
---

# 图像请求的重新排序

如 [`体积数据的流式传输`](./streaming.md) 部分所述，体积的创建和缓存与图像数据的加载分离。

这使我们能够以任意顺序加载图像，并能够重新排序图像请求，以按正确的顺序加载图像。

## getImageLoadRequests

在创建 `StreamingImageVolume` 实例后，您可以调用 `getImageLoadRequests` 来获取图像加载请求。

然后，您可以重新排序（或将系列请求与另一个系列交错）图像请求，以按所需顺序加载图像。