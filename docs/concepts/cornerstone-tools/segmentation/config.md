---

id: config  
title: 配置  
sidebar_position: 5
---

# 配置

在 2.x 版本中，分割配置通过统一的样式系统进行管理，该系统可以在不同的层级上应用，使用说明符对象进行指定。

## 样式系统

样式可以在多个层级上应用：
- 所有分割的全局样式
- 类型特定的样式（例如，所有标签图）
- 视口特定的样式
- 分割特定的样式
- 段特定的样式

样式配置对象的结构取决于表示类型：

```js
// 标签图样式示例
{
  renderFill: true,
  renderOutline: true,
  outlineWidth: 3,
  fillAlpha: 0.7,
  outlineAlpha: 0.9
}

// 轮廓样式示例
{
  renderFill: true,
  renderOutline: true,
  outlineWidth: 2
}

// 表面样式示例
{
  renderFill: true,
  fillAlpha: 0.7
}
```

## 样式 API

新的样式 API 使用说明符对象来定位特定的配置：

```js
import { segmentation } from '@cornerstonejs/tools';

// 获取特定上下文的样式
const style = segmentation.getStyle({
  viewportId: 'viewport1',            // 可选
  segmentationId: 'segmentation1',    // 可选
  type: Enums.SegmentationRepresentations.Labelmap,  // 必需
  segmentIndex: 1                     // 可选
});

// 设置特定上下文的样式
segmentation.setStyle(
  {
    viewportId: 'viewport1',
    segmentationId: 'segmentation1',
    type: Enums.SegmentationRepresentations.Labelmap
  },
  {
    renderFill: true,
    renderOutline: true,
    outlineWidth: 3
  }
);

// 重置为全局样式
segmentation.resetToGlobalStyle();

// 检查上下文是否有自定义样式
const hasCustomStyle = segmentation.hasCustomStyle({
  viewportId: 'viewport1',
  segmentationId: 'segmentation1',
  type: Enums.SegmentationRepresentations.Labelmap
});
```

### 非活跃分割

非活跃分割的渲染现在由每个视口控制：

```js
// 设置是否渲染视口中的非活跃分割
segmentation.setRenderInactiveSegmentations('viewport1', true);

// 获取视口中是否渲染非活跃分割
const renderInactive = segmentation.getRenderInactiveSegmentations('viewport1');
```

## 颜色管理

颜色 API 已更新为视口特定，并使用更一致的命名：

```js
import { segmentation } from '@cornerstonejs/tools';

// 添加新的颜色 LUT
const colorLUTIndex = segmentation.addColorLUT(colorLUT);

// 设置视口中特定分割的颜色 LUT
segmentation.setColorLUT('viewport1', 'segmentation1', colorLUTIndex);

// 获取特定段的颜色
const color = segmentation.getSegmentIndexColor(
  'viewport1',
  'segmentation1',
  segmentIndex
);

// 设置特定段的颜色
segmentation.setSegmentIndexColor(
  'viewport1',
  'segmentation1',
  segmentIndex,
  [255, 0, 0, 255]  // RGBA 颜色
);
```

### 样式层级

样式按以下优先级顺序应用（从高到低）：
1. 段特定样式（当提供 segmentIndex 时）
2. 视口特定样式（当提供 viewportId 时）
3. 分割特定样式（当提供 segmentationId 时）
4. 类型特定样式（仅提供类型时）
5. 全局样式

示例：
```js
// 为所有标签图设置全局样式
segmentation.setStyle(
  { type: Enums.SegmentationRepresentations.Labelmap },
  { renderOutline: true }
);

// 覆盖特定视口的样式
segmentation.setStyle(
  {
    viewportId: 'viewport1',
    type: Enums.SegmentationRepresentations.Labelmap
  },
  { renderOutline: false }
);

// 为特定段设置样式
segmentation.setStyle(
  {
    viewportId: 'viewport1',
    segmentationId: 'segmentation1',
    type: Enums.SegmentationRepresentations.Labelmap,
    segmentIndex: 1
  },
  { outlineWidth: 5 }
);
```

:::note 提示  
有关每种表示类型的可用样式选项的详细信息，请参阅 API 文档。  
:::