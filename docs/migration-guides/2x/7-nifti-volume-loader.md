---
id: nifti-volume-loader
title: '@cornerstonejs/nifti-volume-loader'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';



# `@cornerstonejs/nifti-image-volume-loader`

在迁移到新的体积像素数据模型之后，我们还更新了 Nifti 图像体积加载器以与该模型保持一致。

此更改使加载器更加符合 Cornerstone3D API 及其余库。我们现在拥有一个专用的 Nifti 图像加载器（而不是体积加载器）用于加载 Nifti 文件，从而在库中的所有图像加载器之间创建了更一致的 API。

一个显著的改进是能够为 Nifti 文件使用堆栈视口。您不再需要体积视口来渲染 Nifti 文件（尽管您仍然可以使用体积视口）。

<details>
<summary>为什么？</summary>

现在的过程包括调用 Nifti URL 并解析文件的前几个字节（通过流解码）以获取元数据。然后，我们基于这些元数据创建 imageIds 并使用它们来创建体积。

这种方法从我们之前的体积优先方法转变为 imageId 优先方法，与 Cornerstone3D API 的其余部分保持一致。

</details>

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```js
const niftiURL =
  'https://ohif-assets.s3.us-east-2.amazonaws.com/nifti/MRHead.nii.gz';
const volumeId = 'nifti:' + niftiURL;

const volume = await volumeLoader.createAndCacheVolume(volumeId);

setVolumesForViewports(
  renderingEngine,
  [{ volumeId }],
  viewportInputArray.map((v) => v.viewportId)
);
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```js
import {
  cornerstoneNiftiImageLoader,
  createNiftiImageIdsAndCacheMetadata,
} from '@cornerstonejs/nifti-volume-loader';

const niftiURL =
  'https://ohif-assets.s3.us-east-2.amazonaws.com/nifti/CTACardio.nii.gz';

// 注册 Nifti 文件的图像加载器
imageLoader.registerImageLoader('nifti', cornerstoneNiftiImageLoader);

// 类似于其他 Cornerstone3D 图像加载器
const imageIds = await createNiftiImageIdsAndCacheMetadata({ url: niftiURL });

// 对于堆栈视口
viewport.setStack(imageIds);

// 对于体积视口
const volume = await volumeLoader.createAndCacheVolume(volumeId, {
  imageIds,
});

await volume.load();
setVolumesForViewports(
  renderingEngine,
  [{ volumeId }],
  viewportInputArray.map((v) => v.viewportId)
);
```

  </TabItem>
</Tabs>

---