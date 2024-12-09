---  
id: state  
title: 状态  
sidebar_position: 2
---  

# 状态

`SegmentationState` 存储有关 `Segmentation` 和 `SegmentationRepresentation` 当前状态的所有信息。在2.x版本中，我们将 `Segmentation` 与其表示分离，并使系统专注于视口而非工具组。通过 `Segmentation`，可以创建多种表示（目前支持标签图、轮廓和表面）。

## 色彩查找表（ColorLUT）

`SegmentationState` 存储一个 `colorLUT` 数组，用于渲染分割表示。`Cornerstone3DTools` 初始添加了255种颜色（`[[0,0,0,0], [221, 84, 84, 255], [77, 228, 121, 255], ...]`）作为该数组的第一个索引。默认情况下，所有分割表示使用第一个 `colorLUT`。然而，通过在配置中使用色彩API，您可以将更多颜色添加到全局 `colorLUT`，并/或在特定视口中更改特定分割表示的 `colorLUT`。

## 分割

`SegmentationState` 将所有分割存储在一个数组中。每个 `Segmentation` 对象存储用于创建 `SegmentationRepresentation` 的所需信息。

每个分割对象具有以下属性：

```js
{
  segmentationId: 'segmentation1',
  label: 'segmentation1',
  segments: {
    0: {
      segmentIndex: 0,
      label: 'Segment 1',
      active: true,
      locked: false,
      cachedStats: {}
    },
    1: {
      segmentIndex: 1,
      label: 'Segment 2',
      active: false,
      locked: false,
      cachedStats: {}
    }
  },
  representationData: {
    Labelmap: {
      volumeId: 'segmentation1'
    },
    Contour: {
      geometryIds: ['contourSet1', 'contourSet2']
    },
    Surface: {
      geometryId: 'surface1'
    }
  }
}
```

- `segmentationId`: 消费者提供的必填字段。它是分割的唯一标识符。
- `label`: 分割的标签。
- `segments`: 包含每个分割的相关信息的对象，包括其标签、活动状态、锁定状态和缓存的统计信息。
- `representationData`: **最重要的部分**，这是存储每种类型的 `SegmentationRepresentation` 创建数据的地方。例如，在 `Labelmap` 表示中，所需的信息是缓存的 `volumeId`。

### 将分割添加到状态中

由于 `Segmentation` 和 `SegmentationRepresentation` 被分离，因此首先我们需要使用顶层API将 `Segmentation` 添加到状态中：

```js
import { segmentation, Enums } from '@cornerstonejs/tools';

segmentation.addSegmentations([
  {
    segmentationId,
    representation: {
      type: Enums.SegmentationRepresentations.Labelmap,
      data: {
        imageIds: segmentationImageIds
      }
    }
  }
]);
```

:::note 重要  
将 `Segmentation` 添加到状态中 **不会** 渲染分割。您需要将 `SegmentationRepresentation` 添加到您希望渲染它们的特定视口中。  
:::

## 视口

### 将 `SegmentationRepresentation` 添加到视口

要渲染分割，您需要将其表示添加到特定的视口中。可以使用 `addSegmentationRepresentation` 方法来实现：

```js
import { segmentation, Enums } from '@cornerstonejs/tools';

await segmentation.addSegmentationRepresentations(viewportId, [
  {
    segmentationId,
    type: Enums.SegmentationRepresentations.Labelmap
  }
]);
```

### 特定表示方法

Cornerstone3D v2 提供了专用的方法来添加不同类型的分割表示：

```js
// 添加标签图表示
await segmentation.addLabelmapRepresentationToViewport(viewportId, [
  {
    segmentationId,
    config: {}
  }
]);

// 添加轮廓表示
await segmentation.addContourRepresentationToViewport(viewportId, [
  {
    segmentationId,
    config: {}
  }
]);

// 添加表面表示
await segmentation.addSurfaceRepresentationToViewport(viewportId, [
  {
    segmentationId,
    config: {}
  }
]);
```

### 多视口操作

您还可以使用视口映射方法同时将表示添加到多个视口：

```js
const viewportInputMap = {
  viewport1: [
    {
      segmentationId: 'seg1',
      type: Enums.SegmentationRepresentations.Labelmap
    }
  ],
  viewport2: [
    {
      segmentationId: 'seg1',
      type: Enums.SegmentationRepresentations.Labelmap
    }
  ]
};

await segmentation.addLabelmapRepresentationToViewportMap(viewportInputMap);
```