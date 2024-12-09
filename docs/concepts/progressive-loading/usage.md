---
id: usage
title: 使用
---

现在我们已经了解了检索配置，让我们看看如何在 Cornerstone3D 中使用它。

## `imageRetrieveMetadataProvider`

这是我们添加到 Cornerstone3D 库中的一个新的元数据提供器。它负责检索图像（或稍后我们将探讨的体积）的元数据。因此，为了对一组 imageIds 进行渐进式加载，您需要将您的检索配置添加到此提供器中。

### 堆栈视口

您可以通过将 imageIds 作为元数据的键来指定特定于 imageId 的检索配置。考虑到我们在前一节中的单阶段检索配置，我们有以下内容：

```js
import { utilities } from '@cornerstone3d/core';

const retrieveConfiguration = {
  stages: [
    {
      id: 'initialImages',
      retrieveType: 'single',
    },
  ],
  retrieveOptions: {
    single: {
      streaming: true,
    },
  },
};

utilities.imageRetrieveMetadataProvider.add('imageId1', retrieveConfiguration);
```

如果您不需要定义特定于 imageId 的检索配置，则可以将元数据范围限定为 `stack`，以便将其应用于所有 imageIds。

```js
utilities.imageRetrieveMetadataProvider.add('stack', retrieveConfiguration);
```

### 体积视口

要将体积加载为渐进式加载，您可以使用 `volumeId` 作为元数据的键。

```js
import { utilities } from '@cornerstone3d/core';

const volumeId = ....get volume id....
utilities.imageRetrieveMetadataProvider.add(volumeId, retrieveConfiguration);
```

或者，您可以将元数据范围限定为 `volume`，以便将其应用于所有 volumeIds。

```js
utilities.imageRetrieveMetadataProvider.add('volume', retrieveConfiguration);
```

:::tip
这就是您需要做的一切！加载图像的其他所有步骤都由 Cornerstone3D 库处理。
:::