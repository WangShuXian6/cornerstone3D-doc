---
id: tools1
title: '@cornerstonejs/tools1'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


# @cornerstonejs/tools

## triggerAnnotationRenderForViewportIds

现在只需要 `viewportIds`，不再需要 `renderingEngine`。

```js
triggerAnnotationRenderForViewportIds(renderingEngine, viewportIds) ---> triggerAnnotationRenderForViewportIds(viewportIds)
```

<details>
<summary>为什么？</summary>
因为每个视口都有一个渲染引擎，因此不需要将渲染引擎作为参数传递。
</details>

## 工具

### StackScrollMouseWheelTool -> StackScrollTool

我们已经将鼠标滚轮与工具本身解耦，使其可以像其他鼠标绑定一样应用为绑定。

此更改带来了多个优势：

- 它可以与其他鼠标绑定组合使用
- 它可以与键盘绑定配对使用

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```js
cornerstoneTools.addTool(StackScrollMouseWheelTool);
toolGroup.addTool(StackScrollMouseWheelTool.toolName);
toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```js
cornerstoneTools.addTool(StackScrollTool);
toolGroup.addTool(StackScrollTool.toolName);
toolGroup.setToolActive(StackScrollTool.toolName, {
  bindings: [
    {
      mouseButton: MouseBindings.Wheel,
    },
  ],
});
```

  </TabItem>
</Tabs>

### BaseTool

`getTargetVolumeId` 方法已被移除，取而代之的是 `getTargetId`，而 `getTargetIdImage` 已重命名为 `getTargetImageData`，以更清楚地表明它是图像数据。

### 使用示例

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
const volumeId = this.getTargetVolumeId(viewport);
const imageData = this.getTargetIdImage(targetId, renderingEngine);
```

</TabItem>
<TabItem value="After" label="之后 🚀">

```typescript
const imageData = this.getTargetImageData(targetId);
```

</TabItem>
</Tabs>

## 新的分割模型

我们有一个新的分割模型，更加灵活且易于使用。

### 相同术语，不同架构

在 Cornerstone3D 版本 2 中，我们对分割模型进行了重大架构更改，同时保持了熟悉的术语。此重新设计旨在为在不同视口中处理分割提供更灵活和直观的方法。以下是主要更改及其背后的原因：

1. **视口特定，而非基于工具组**：

   - 以前：分割与工具组绑定，工具组通常由多个视口组成。当用户希望在同一工具组内为某些视口添加分割而不是其他视口时，这会带来复杂性。
   - 现在：分割现在是视口特定的。用户可以直接向视口添加分割，而不是向工具组添加或移除表示。这为每个视口渲染的内容提供了更细致的控制。
   - 为什么：我们发现将渲染绑定到工具组并不是一种有效的方法。它通常需要为特定视口创建额外的工具组以进行自定义或防止渲染。

2. **简化分割表示的识别**：

   - 以前：需要一个唯一的 `segmentationRepresentationUID` 进行识别。
   - 现在：分割表示通过 `segmentationId` 和表示 `type` 的组合进行识别。这允许每个视口对同一分割有不同的表示。
   - 为什么：这种简化使得在不同视口中管理和引用分割表示更加容易。

3. **数据与可视化的解耦**：

   - 以前：分割渲染与工具组紧密耦合。
   - 现在：分割现在纯粹作为数据处理，与用于交互的工具分离。
   - 为什么：虽然将工具绑定到工具组是合适的，但像分割渲染这样的视口特定功能应该由各个视口负责。这种分离允许在不同视口中有更灵活的渲染和交互选项。

4. **多态分割支持**：

   - 新架构更好地支持多态分割的概念，即单个分割可以有多个表示（例如，标签图、轮廓、表面），并且可以在它们之间高效地转换。
   - 为什么：这种灵活性允许更高效地存储、分析和实时可视化分割。

5. **跨表示类型的一致 API**：

   - 新的 API 提供了一种统一的方式来处理不同的分割表示，使得管理涉及多个视口和表示类型的复杂场景更加容易。
   - 为什么：这种一致性简化了开发，并减少了在处理不同分割类型时出错的可能性。

这些架构更改为处理分割提供了更坚实的基础，特别是在复杂的多视口场景中。新方法已被证明非常有效，并为未来的增强功能打开了可能性。虽然核心概念保持相似，但您在代码中与分割交互的方式将会显著改变。本迁移指南将引导您完成这些更改，提供前后示例，帮助您将现有代码库更新到新架构。

### 分割状态

`Segmentation` 类型已被重组，以更好地组织分割信息和表示数据。在讨论迁移指南之前，让我们先看看更改。

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
type Segmentation = {
  segmentationId: string;
  type: Enums.SegmentationRepresentations;
  label: string;
  activeSegmentIndex: number;
  segmentsLocked: Set<number>;
  cachedStats: { [key: string]: number };
  segmentLabels: { [key: string]: string };
  representationData: SegmentationRepresentationData;
};
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```typescript
type Segmentation = {
  segmentationId: string;
  label: string;
  segments: {
    [segmentIndex: number]: Segment;
  };
  representationData: RepresentationsData;
};

type Segment = {
  segmentIndex: number;
  label: string;
  locked: boolean;
  cachedStats: { [key: string]: unknown };
  active: boolean;
};
```

</TabItem>
</Tabs>

新的分割状态模型提供了更有组织的数据结构。以前分散的信息，如 `cachedStats`、`segmentLabels` 和 `activeSegmentIndex`，已被整合到 `segments` 属性下。这种重组增强了清晰度和效率。在接下来的部分中，我们将讨论迁移指南，解释如何在新结构中访问和修改这些属性。这种重组主要影响分割存储级别。

#### 表示数据键

`SegmentationRepresentations` 枚举已更新为使用标题大小写而不是全大写，以使其与其他枚举保持一致。

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
enum SegmentationRepresentations {
  Labelmap = 'LABELMAP',
  Contour = 'CONTOUR',
  Surface = 'SURFACE',
}
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```typescript
enum SegmentationRepresentations {
  Labelmap = 'Labelmap',
  Contour = 'Contour',
  Surface = 'Surface',
}
```

</TabItem>
</Tabs>

## triggerAnnotationRenderForViewportIds

现在只需要 `viewportIds`，不再需要 `renderingEngine`。

```js
triggerAnnotationRenderForViewportIds(renderingEngine, viewportIds) ---> triggerAnnotationRenderForViewportIds(viewportIds)
```

<details>
<summary>为什么？</summary>
因为每个视口都有一个渲染引擎，因此不需要将渲染引擎作为参数传递。
</details>

## 工具

### StackScrollMouseWheelTool -> StackScrollTool

我们已经将鼠标滚轮与工具本身解耦，使其可以像其他鼠标绑定一样应用为绑定。

此更改带来了多个优势：

- 它可以与其他鼠标绑定组合使用
- 它可以与键盘绑定配对使用

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```js
cornerstoneTools.addTool(StackScrollMouseWheelTool);
toolGroup.addTool(StackScrollMouseWheelTool.toolName);
toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```js
cornerstoneTools.addTool(StackScrollTool);
toolGroup.addTool(StackScrollTool.toolName);
toolGroup.setToolActive(StackScrollTool.toolName, {
  bindings: [
    {
      mouseButton: MouseBindings.Wheel,
    },
  ],
});
```

  </TabItem>
</Tabs>

### BaseTool

`getTargetVolumeId` 方法已被移除，取而代之的是 `getTargetId`，而 `getTargetIdImage` 已重命名为 `getTargetImageData`，以更清楚地表明它是图像数据。

### 使用示例

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
const volumeId = this.getTargetVolumeId(viewport);
const imageData = this.getTargetIdImage(targetId, renderingEngine);
```

</TabItem>
<TabItem value="After" label="之后 🚀">
    
```typescript
const imageData = this.getTargetImageData(targetId);
```

</TabItem>
</Tabs>

## 新的分割模型

我们有一个新的分割模型，更加灵活且易于使用。

### 相同术语，不同架构

在 Cornerstone3D 版本 2 中，我们对分割模型进行了重大架构更改，同时保持了熟悉的术语。此重新设计旨在为在不同视口中处理分割提供更灵活和直观的方法。以下是主要更改及其背后的原因：

1. **视口特定，而非基于工具组**：

   - **以前**：分割与工具组绑定，工具组通常由多个视口组成。当用户希望在同一工具组内为某些视口添加分割而不是其他视口时，这会带来复杂性。
   - **现在**：分割现在是视口特定的。用户可以直接向视口添加分割，而不是向工具组添加或移除表示。这为每个视口渲染的内容提供了更细致的控制。
   - **为什么**：我们发现将渲染绑定到工具组并不是一种有效的方法。它通常需要为特定视口创建额外的工具组以进行自定义或防止渲染。

2. **简化分割表示的识别**：

   - **以前**：需要一个唯一的 `segmentationRepresentationUID` 进行识别。
   - **现在**：分割表示通过 `segmentationId` 和表示 `type` 的组合进行识别。这允许每个视口对同一分割有不同的表示。
   - **为什么**：这种简化使得在不同视口中管理和引用分割表示更加容易。

3. **数据与可视化的解耦**：

   - **以前**：分割渲染与工具组紧密耦合。
   - **现在**：分割现在纯粹作为数据处理，与用于交互的工具分离。
   - **为什么**：虽然将工具绑定到工具组是合适的，但像分割渲染这样的视口特定功能应该由各个视口负责。这种分离允许在不同视口中有更灵活的渲染和交互选项。

4. **多态分割支持**：

   - 新架构更好地支持多态分割的概念，即单个分割可以有多个表示（例如，标签图、轮廓、表面），并且可以在它们之间高效地转换。
   - **为什么**：这种灵活性允许更高效地存储、分析和实时可视化分割。

5. **跨表示类型的一致 API**：

   - 新的 API 提供了一种统一的方式来处理不同的分割表示，使得管理涉及多个视口和表示类型的复杂场景更加容易。
   - **为什么**：这种一致性简化了开发，并减少了在处理不同分割类型时出错的可能性。

这些架构更改为处理分割提供了更坚实的基础，特别是在复杂的多视口场景中。新方法已被证明非常有效，并为未来的增强功能打开了可能性。虽然核心概念保持相似，但您在代码中与分割交互的方式将会显著改变。本迁移指南将引导您完成这些更改，提供前后示例，帮助您将现有代码库更新到新架构。

### 分割状态

`Segmentation` 类型已被重组，以更好地组织分割信息和表示数据。在讨论迁移指南之前，让我们先看看更改。

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
type Segmentation = {
  segmentationId: string;
  type: Enums.SegmentationRepresentations;
  label: string;
  activeSegmentIndex: number;
  segmentsLocked: Set<number>;
  cachedStats: { [key: string]: number };
  segmentLabels: { [key: string]: string };
  representationData: SegmentationRepresentationData;
};
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```typescript
type Segmentation = {
  segmentationId: string;
  label: string;
  segments: {
    [segmentIndex: number]: Segment;
  };
  representationData: RepresentationsData;
};

type Segment = {
  segmentIndex: number;
  label: string;
  locked: boolean;
  cachedStats: { [key: string]: unknown };
  active: boolean;
};
```

</TabItem>
</Tabs>

新的分割状态模型提供了更有组织的数据结构。以前分散的信息，如 `cachedStats`、`segmentLabels` 和 `activeSegmentIndex`，已被整合到 `segments` 属性下。这种重组增强了清晰度和效率。在接下来的部分中，我们将讨论迁移指南，解释如何在新结构中访问和修改这些属性。这种重组主要影响分割存储级别。

#### 表示数据键

`SegmentationRepresentations` 枚举已更新为使用标题大小写而不是全大写，以使其与其他枚举保持一致。

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
enum SegmentationRepresentations {
  Labelmap = 'LABELMAP',
  Contour = 'CONTOUR',
  Surface = 'SURFACE',
}
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```typescript
enum SegmentationRepresentations {
  Labelmap = 'Labelmap',
  Contour = 'Contour',
  Surface = 'Surface',
}
```

</TabItem>
</Tabs>

这项更改影响了表示数据的访问方式：

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```typescript
const representationData = segmentation.representationData.SURFACE;
const representationData = segmentation.representationData.LABELMAP;
const representationData = segmentation.representationData.CONTOUR;
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```typescript
const representationData = segmentation.representationData.Surface;
const representationData = segmentation.representationData.Labelmap;
const representationData = segmentation.representationData.Contour;
```

  </TabItem>
</Tabs>

#### 分割表示

表示结构已被简化，现在是视口特定的。

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```typescript
type ToolGroupSpecificRepresentation =
  | ToolGroupSpecificLabelmapRepresentation
  | ToolGroupSpecificContourRepresentation;

type ToolGroupSpecificRepresentationState = {
  segmentationRepresentationUID: string;
  segmentationId: string;
  type: Enums.SegmentationRepresentations;
  active: boolean;
  segmentsLocked: Set<number>;
  colorLUTIndex: number;
};

type SegmentationState = {
  toolGroups: {
    [key: string]: {
      segmentationRepresentations: ToolGroupSpecificRepresentations;
      config: SegmentationRepresentationConfig;
    };
  };
};
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```typescript
type SegmentationRepresentation =
  | LabelmapRepresentation
  | ContourRepresentation
  | SurfaceRepresentation;

type BaseSegmentationRepresentation = {
  colorLUTIndex: number;
  segmentationId: string;
  type: Enums.SegmentationRepresentations;
  visible: boolean;
  active: boolean;
  segments: {
    [segmentIndex: number]: {
      visible: boolean;
    };
  };
};

type SegmentationState = {
  viewportSegRepresentations: {
    [viewportId: string]: Array<SegmentationRepresentation>;
  };
};
```

  </TabItem>
</Tabs>

以前，分割表示是基于工具组的，这导致了一些问题。在新的结构中，分割表示是视口特定的。它现在由 `segmentationId`、`type` 以及该分割的各种设置组成。由于这一变化，几个函数被移除或修改。以下是更改的总结：

#### 移除的函数

- `getDefaultSegmentationStateManager`
- `getSegmentationRepresentations`
- `getAllSegmentationRepresentations`
- `getSegmentationIdRepresentations`
- `findSegmentationRepresentationByUID`
- `getToolGroupIdsWithSegmentation`
- `getToolGroupSpecificConfig`
- `setToolGroupSpecificConfig`
- `getGlobalConfig`
- `setGlobalConfig`
- `setSegmentationRepresentationSpecificConfig`
- `getSegmentationRepresentationSpecificConfig`
- `getSegmentSpecificRepresentationConfig`
- `setSegmentSpecificRepresentationConfig`
- `getToolGroupIdFromSegmentationRepresentationUID`
- `addSegmentationRepresentation`
- `getSegmentationRepresentationByUID`

#### 新的函数

- `addSegmentations(segmentationInputArray)`
- `removeSegmentation(segmentationId)`
- `getSegmentation(segmentationId)`
- `getSegmentations()`
- `getSegmentationRepresentation(viewportId, specifier)`
- `getSegmentationRepresentations(viewportId, specifier)`
- `removeSegmentationRepresentation(viewportId, specifier, immediate)`
- `removeAllSegmentationRepresentations()`
- `removeLabelmapRepresentation(viewportId, segmentationId, immediate)`
- `removeContourRepresentation(viewportId, segmentationId, immediate)`
- `removeSurfaceRepresentation(viewportId, segmentationId, immediate)`
- `getViewportSegmentations(viewportId, type)`
- `getViewportIdsWithSegmentation(segmentationId)`
- `getCurrentLabelmapImageIdForViewport(viewportId, segmentationId)`
- `updateLabelmapSegmentationImageReferences(segmentationId, imageIds)`
- `getStackSegmentationImageIdsForViewport(viewportId, segmentationId)`
- `destroy()`

### 移除 SegmentationDisplayTool

不再需要将 SegmentationDisplayTool 添加到 toolGroup。

**之前**

```js
toolGroup2.addTool(SegmentationDisplayTool.toolName);

toolGroup1.setToolEnabled(SegmentationDisplayTool.toolName);
```

**现在**

```js
// 无需任何操作
```

### 堆栈标签图

要创建堆栈标签图，您不再需要手动在标签图 imageIds 和视口 imageIds 之间创建引用。我们现在为您自动处理此过程。

这需要一个长篇的为什么...

以前的模型要求用户提供一个 imageIdReferenceMap，将标签图 imageIds 链接到视口 imageIds。这种方法在实现高级分割用例时带来了几个挑战：

1. 手动创建映射容易出错，特别是在 imageIds 的顺序方面。

2. 一旦分割与特定的视口 imageIds 相关联，就很难在其他地方渲染。例如：

   - 在单个关键图像上渲染 CT 图像堆栈分割。
   - 在包含 CT 和其他图像的堆栈上渲染 CT 图像堆栈分割。
   - 在能量 1 上渲染 DX 双能分割到能量 2。
   - 在同一空间的 PT 标签图上从堆栈视口渲染 CT 标签图。

这些场景突显了以前模型的局限性。

我们现在已经过渡到一个系统，用户只需提供 imageIds。在渲染过程中，我们将视口的当前 imageId 与标签图 imageIds 进行匹配，如果有匹配项，则渲染分割。这个匹配过程发生在 SegmentationStateManager 中，条件是分割必须与引用的视口处于同一平面。

这种新方法启用了许多额外的用例，并为分割渲染提供了更大的灵活性。

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```js
segmentation.addSegmentations([
  {
    segmentationId,
    representation: {
      type: csToolsEnums.SegmentationRepresentations.Labelmap,
      data: {
        imageIdReferenceMap:
          cornerstoneTools.utilities.segmentation.createImageIdReferenceMap(
            imageIds,
            segmentationImageIds
          ),
      },
    },
  },
]);
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">


```js
segmentation.addSegmentations([
  {
    segmentationId,
    representation: {
      type: csToolsEnums.SegmentationRepresentations.Labelmap,
      data: {
        imageIds: segmentationImageIds,
      },
    },
  },
]);
```

  </TabItem>
</Tabs>

## triggerAnnotationRenderForViewportIds

现在只需要 `viewportIds`，不再需要 `renderingEngine`。

```js
triggerAnnotationRenderForViewportIds(renderingEngine, viewportIds) ---> triggerAnnotationRenderForViewportIds(viewportIds)
```

<details>
<summary>为什么？</summary>
因为每个视口都有一个渲染引擎，因此不需要将渲染引擎作为参数传递。
</details>

## 工具

### StackScrollMouseWheelTool -> StackScrollTool

我们已经将鼠标滚轮与工具本身解耦，使其可以像其他鼠标绑定一样应用为绑定。

此更改带来了多个优势：

- 它可以与其他鼠标绑定组合使用
- 它可以与键盘绑定配对使用

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```js
cornerstoneTools.addTool(StackScrollMouseWheelTool);
toolGroup.addTool(StackScrollMouseWheelTool.toolName);
toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```js
cornerstoneTools.addTool(StackScrollTool);
toolGroup.addTool(StackScrollTool.toolName);
toolGroup.setToolActive(StackScrollTool.toolName, {
  bindings: [
    {
      mouseButton: MouseBindings.Wheel,
    },
  ],
});
```

  </TabItem>
</Tabs>

### BaseTool

`getTargetVolumeId` 方法已被移除，取而代之的是 `getTargetId`，而 `getTargetIdImage` 已重命名为 `getTargetImageData`，以更清楚地表明它是图像数据。

### 使用示例

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
const volumeId = this.getTargetVolumeId(viewport);
const imageData = this.getTargetIdImage(targetId, renderingEngine);
```

</TabItem>
<TabItem value="After" label="之后 🚀">

```typescript
const imageData = this.getTargetImageData(targetId);
```

</TabItem>
</Tabs>

## 新的分割模型

我们有一个新的分割模型，更加灵活且易于使用。

### 相同术语，不同架构

在 Cornerstone3D 版本 2 中，我们对分割模型进行了重大架构更改，同时保持了熟悉的术语。此重新设计旨在为在不同视口中处理分割提供更灵活和直观的方法。以下是主要更改及其背后的原因：

1. **视口特定，而非基于工具组**：

   - **以前**：分割与工具组绑定，工具组通常由多个视口组成。当用户希望在同一工具组内为某些视口添加分割而不是其他视口时，这会带来复杂性。
   - **现在**：分割现在是视口特定的。用户可以直接向视口添加分割，而不是向工具组添加或移除表示。这为每个视口渲染的内容提供了更细致的控制。
   - **为什么**：我们发现将渲染绑定到工具组并不是一种有效的方法。它通常需要为特定视口创建额外的工具组以进行自定义或防止渲染。

2. **简化分割表示的识别**：

   - **以前**：需要一个唯一的 `segmentationRepresentationUID` 进行识别。
   - **现在**：分割表示通过 `segmentationId` 和表示 `type` 的组合进行识别。这允许每个视口对同一分割有不同的表示。
   - **为什么**：这种简化使得在不同视口中管理和引用分割表示更加容易。

3. **数据与可视化的解耦**：

   - **以前**：分割渲染与工具组紧密耦合。
   - **现在**：分割现在纯粹作为数据处理，与用于交互的工具分离。
   - **为什么**：虽然将工具绑定到工具组是合适的，但像分割渲染这样的视口特定功能应该由各个视口负责。这种分离允许在不同视口中有更灵活的渲染和交互选项。

4. **多态分割支持**：

   - 新架构更好地支持多态分割的概念，即单个分割可以有多个表示（例如，标签图、轮廓、表面），并且可以在它们之间高效地转换。
   - **为什么**：这种灵活性允许更高效地存储、分析和实时可视化分割。

5. **跨表示类型的一致 API**：

   - 新的 API 提供了一种统一的方式来处理不同的分割表示，使得管理涉及多个视口和表示类型的复杂场景更加容易。
   - **为什么**：这种一致性简化了开发，并减少了在处理不同分割类型时出错的可能性。

这些架构更改为处理分割提供了更坚实的基础，特别是在复杂的多视口场景中。新方法已被证明非常有效，并为未来的增强功能打开了可能性。虽然核心概念保持相似，但您在代码中与分割交互的方式将会显著改变。本迁移指南将引导您完成这些更改，提供前后示例，帮助您将现有代码库更新到新架构。

### 分割状态

`Segmentation` 类型已被重组，以更好地组织分割信息和表示数据。在讨论迁移指南之前，让我们先看看更改。

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
type Segmentation = {
  segmentationId: string;
  type: Enums.SegmentationRepresentations;
  label: string;
  activeSegmentIndex: number;
  segmentsLocked: Set<number>;
  cachedStats: { [key: string]: number };
  segmentLabels: { [key: string]: string };
  representationData: SegmentationRepresentationData;
};
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```typescript
type Segmentation = {
  segmentationId: string;
  label: string;
  segments: {
    [segmentIndex: number]: Segment;
  };
  representationData: RepresentationsData;
};

type Segment = {
  segmentIndex: number;
  label: string;
  locked: boolean;
  cachedStats: { [key: string]: unknown };
  active: boolean;
};
```

</TabItem>
</Tabs>

新的分割状态模型提供了更有组织的数据结构。以前分散的信息，如 `cachedStats`、`segmentLabels` 和 `activeSegmentIndex`，已被整合到 `segments` 属性下。这种重组增强了清晰度和效率。在接下来的部分中，我们将讨论迁移指南，解释如何在新结构中访问和修改这些属性。这种重组主要影响分割存储级别。

#### 表示数据键

`SegmentationRepresentations` 枚举已更新为使用标题大小写而不是全大写，以使其与其他枚举保持一致。

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
enum SegmentationRepresentations {
  Labelmap = 'LABELMAP',
  Contour = 'CONTOUR',
  Surface = 'SURFACE',
}
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```typescript
enum SegmentationRepresentations {
  Labelmap = 'Labelmap',
  Contour = 'Contour',
  Surface = 'Surface',
}
```

</TabItem>
</Tabs>

这项更改影响了表示数据的访问方式：

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```typescript
const representationData = segmentation.representationData.SURFACE;
const representationData = segmentation.representationData.LABELMAP;
const representationData = segmentation.representationData.CONTOUR;
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```typescript
const representationData = segmentation.representationData.Surface;
const representationData = segmentation.representationData.Labelmap;
const representationData = segmentation.representationData.Contour;
```

  </TabItem>
</Tabs>

#### 分割表示

表示结构已被简化，现在是视口特定的。

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```typescript
type ToolGroupSpecificRepresentation =
  | ToolGroupSpecificLabelmapRepresentation
  | ToolGroupSpecificContourRepresentation;

type ToolGroupSpecificRepresentationState = {
  segmentationRepresentationUID: string;
  segmentationId: string;
  type: Enums.SegmentationRepresentations;
  active: boolean;
  segmentsLocked: Set<number>;
  colorLUTIndex: number;
};

type SegmentationState = {
  toolGroups: {
    [key: string]: {
      segmentationRepresentations: ToolGroupSpecificRepresentations;
      config: SegmentationRepresentationConfig;
    };
  };
};
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```typescript
type SegmentationRepresentation =
  | LabelmapRepresentation
  | ContourRepresentation
  | SurfaceRepresentation;

type BaseSegmentationRepresentation = {
  colorLUTIndex: number;
  segmentationId: string;
  type: Enums.SegmentationRepresentations;
  visible: boolean;
  active: boolean;
  segments: {
    [segmentIndex: number]: {
      visible: boolean;
    };
  };
};

type SegmentationState = {
  viewportSegRepresentations: {
    [viewportId: string]: Array<SegmentationRepresentation>;
  };
};
```

  </TabItem>
</Tabs>

以前，分割表示是基于工具组的，这导致了一些问题。在新的结构中，分割表示是视口特定的。它现在由 `segmentationId`、`type` 以及该分割的各种设置组成。由于这一变化，几个函数被移除或修改。以下是更改的总结：

#### 移除的函数

- `getDefaultSegmentationStateManager`
- `getSegmentationRepresentations`
- `getAllSegmentationRepresentations`
- `getSegmentationIdRepresentations`
- `findSegmentationRepresentationByUID`
- `getToolGroupIdsWithSegmentation`
- `getToolGroupSpecificConfig`
- `setToolGroupSpecificConfig`
- `getGlobalConfig`
- `setGlobalConfig`
- `setSegmentationRepresentationSpecificConfig`
- `getSegmentationRepresentationSpecificConfig`
- `getSegmentSpecificRepresentationConfig`
- `setSegmentSpecificRepresentationConfig`
- `getToolGroupIdFromSegmentationRepresentationUID`
- `addSegmentationRepresentation`
- `getSegmentationRepresentationByUID`

#### 新的函数

- `addSegmentations(segmentationInputArray)`
- `removeSegmentation(segmentationId)`
- `getSegmentation(segmentationId)`
- `getSegmentations()`
- `getSegmentationRepresentation(viewportId, specifier)`
- `getSegmentationRepresentations(viewportId, specifier)`
- `removeSegmentationRepresentation(viewportId, specifier, immediate)`
- `removeAllSegmentationRepresentations()`
- `removeLabelmapRepresentation(viewportId, segmentationId, immediate)`
- `removeContourRepresentation(viewportId, segmentationId, immediate)`
- `removeSurfaceRepresentation(viewportId, segmentationId, immediate)`
- `getViewportSegmentations(viewportId, type)`
- `getViewportIdsWithSegmentation(segmentationId)`
- `getCurrentLabelmapImageIdForViewport(viewportId, segmentationId)`
- `updateLabelmapSegmentationImageReferences(segmentationId, imageIds)`
- `getStackSegmentationImageIdsForViewport(viewportId, segmentationId)`
- `destroy()`

### 移除 SegmentationDisplayTool

不再需要将 SegmentationDisplayTool 添加到 toolGroup。

**之前**

```js
toolGroup2.addTool(SegmentationDisplayTool.toolName);

toolGroup1.setToolEnabled(SegmentationDisplayTool.toolName);
```

**现在**

```js
// 无需任何操作
```

### 堆栈标签图

要创建堆栈标签图，您不再需要手动在标签图 imageIds 和视口 imageIds 之间创建引用。我们现在为您自动处理此过程。

这需要一个长篇的为什么...

以前的模型要求用户提供一个 imageIdReferenceMap，将标签图 imageIds 链接到视口 imageIds。这种方法在实现高级分割用例时带来了几个挑战：

1. 手动创建映射容易出错，特别是在 imageIds 的顺序方面。

2. 一旦分割与特定的视口 imageIds 相关联，就很难在其他地方渲染。例如：

   - 在单个关键图像上渲染 CT 图像堆栈分割。
   - 在包含 CT 和其他图像的堆栈上渲染 CT 图像堆栈分割。
   - 在能量 1 上渲染 DX 双能分割到能量 2。
   - 在同一空间的 PT 标签图上从堆栈视口渲染 CT 标签图。

这些场景突显了以前模型的局限性。

我们现在已经过渡到一个系统，用户只需提供 imageIds。在渲染过程中，我们将视口的当前 imageId 与标签图 imageIds 进行匹配，如果有匹配项，则渲染分割。这个匹配过程发生在 SegmentationStateManager 中，条件是分割必须与引用的视口处于同一平面。

这种新方法启用了许多额外的用例，并为分割渲染提供了更大的灵活性。

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```js
segmentation.addSegmentations([
  {
    segmentationId,
    representation: {
      type: csToolsEnums.SegmentationRepresentations.Labelmap,
      data: {
        imageIdReferenceMap:
          cornerstoneTools.utilities.segmentation.createImageIdReferenceMap(
            imageIds,
            segmentationImageIds
          ),
      },
    },
  },
]);
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```js
// 在这里填写“之后”部分的代码
```

  </TabItem>
</Tabs>

## triggerAnnotationRenderForViewportIds

现在只需要 `viewportIds`，不再需要 `renderingEngine`。

```js
triggerAnnotationRenderForViewportIds(renderingEngine, viewportIds) ---> triggerAnnotationRenderForViewportIds(viewportIds)
```

<details>
<summary>为什么？</summary>
因为每个视口都有一个渲染引擎，因此不需要将渲染引擎作为参数传递。
</details>

## 工具

### StackScrollMouseWheelTool -> StackScrollTool

我们已经将鼠标滚轮与工具本身解耦，使其可以像其他鼠标绑定一样应用为绑定。

此更改带来了多个优势：

- 它可以与其他鼠标绑定组合使用
- 它可以与键盘绑定配对使用

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```js
cornerstoneTools.addTool(StackScrollMouseWheelTool);
toolGroup.addTool(StackScrollMouseWheelTool.toolName);
toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```js
cornerstoneTools.addTool(StackScrollTool);
toolGroup.addTool(StackScrollTool.toolName);
toolGroup.setToolActive(StackScrollTool.toolName, {
  bindings: [
    {
      mouseButton: MouseBindings.Wheel,
    },
  ],
});
```

  </TabItem>
</Tabs>

### BaseTool

`getTargetVolumeId` 方法已被移除，取而代之的是 `getTargetId`，而 `getTargetIdImage` 已重命名为 `getTargetImageData`，以更清楚地表明它是图像数据。

### 使用示例

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
const volumeId = this.getTargetVolumeId(viewport);
const imageData = this.getTargetIdImage(targetId, renderingEngine);
```

</TabItem>
<TabItem value="After" label="之后 🚀">

```typescript
const imageData = this.getTargetImageData(targetId);
```

</TabItem>
</Tabs>

## 新的分割模型

我们有一个新的分割模型，更加灵活且易于使用。

### 相同术语，不同架构

在 Cornerstone3D 版本 2 中，我们对分割模型进行了重大架构更改，同时保持了熟悉的术语。此重新设计旨在为在不同视口中处理分割提供更灵活和直观的方法。以下是主要更改及其背后的原因：

1. **视口特定，而非基于工具组**：

   - **以前**：分割与工具组绑定，工具组通常由多个视口组成。当用户希望在同一工具组内为某些视口添加分割而不是其他视口时，这会带来复杂性。
   - **现在**：分割现在是视口特定的。用户可以直接向视口添加分割，而不是向工具组添加或移除表示。这为每个视口渲染的内容提供了更细致的控制。
   - **为什么**：我们发现将渲染绑定到工具组并不是一种有效的方法。它通常需要为特定视口创建额外的工具组以进行自定义或防止渲染。

2. **简化分割表示的识别**：

   - **以前**：需要一个唯一的 `segmentationRepresentationUID` 进行识别。
   - **现在**：分割表示通过 `segmentationId` 和表示 `type` 的组合进行识别。这允许每个视口对同一分割有不同的表示。
   - **为什么**：这种简化使得在不同视口中管理和引用分割表示更加容易。

3. **数据与可视化的解耦**：

   - **以前**：分割渲染与工具组紧密耦合。
   - **现在**：分割现在纯粹作为数据处理，与用于交互的工具分离。
   - **为什么**：虽然将工具绑定到工具组是合适的，但像分割渲染这样的视口特定功能应该由各个视口负责。这种分离允许在不同视口中有更灵活的渲染和交互选项。

4. **多态分割支持**：

   - 新架构更好地支持多态分割的概念，即单个分割可以有多个表示（例如，标签图、轮廓、表面），并且可以在它们之间高效地转换。
   - **为什么**：这种灵活性允许更高效地存储、分析和实时可视化分割。

5. **跨表示类型的一致 API**：

   - 新的 API 提供了一种统一的方式来处理不同的分割表示，使得管理涉及多个视口和表示类型的复杂场景更加容易。
   - **为什么**：这种一致性简化了开发，并减少了在处理不同分割类型时出错的可能性。

这些架构更改为处理分割提供了更坚实的基础，特别是在复杂的多视口场景中。新方法已被证明非常有效，并为未来的增强功能打开了可能性。虽然核心概念保持相似，但您在代码中与分割交互的方式将会显著改变。本迁移指南将引导您完成这些更改，提供前后示例，帮助您将现有代码库更新到新架构。

### 分割状态

`Segmentation` 类型已被重组，以更好地组织分割信息和表示数据。在讨论迁移指南之前，让我们先看看更改。

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
type Segmentation = {
  segmentationId: string;
  type: Enums.SegmentationRepresentations;
  label: string;
  activeSegmentIndex: number;
  segmentsLocked: Set<number>;
  cachedStats: { [key: string]: number };
  segmentLabels: { [key: string]: string };
  representationData: SegmentationRepresentationData;
};
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```typescript
type Segmentation = {
  segmentationId: string;
  label: string;
  segments: {
    [segmentIndex: number]: Segment;
  };
  representationData: RepresentationsData;
};

type Segment = {
  segmentIndex: number;
  label: string;
  locked: boolean;
  cachedStats: { [key: string]: unknown };
  active: boolean;
};
```

</TabItem>
</Tabs>

新的分割状态模型提供了更有组织的数据结构。以前分散的信息，如 `cachedStats`、`segmentLabels` 和 `activeSegmentIndex`，已被整合到 `segments` 属性下。这种重组增强了清晰度和效率。在接下来的部分中，我们将讨论迁移指南，解释如何在新结构中访问和修改这些属性。这种重组主要影响分割存储级别。

#### 表示数据键

`SegmentationRepresentations` 枚举已更新为使用标题大小写而不是全大写，以使其与其他枚举保持一致。

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
enum SegmentationRepresentations {
  Labelmap = 'LABELMAP',
  Contour = 'CONTOUR',
  Surface = 'SURFACE',
}
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```typescript
enum SegmentationRepresentations {
  Labelmap = 'Labelmap',
  Contour = 'Contour',
  Surface = 'Surface',
}
```

</TabItem>
</Tabs>

这项更改影响了表示数据的访问方式：

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
const representationData = segmentation.representationData.SURFACE;
const representationData = segmentation.representationData.LABELMAP;
const representationData = segmentation.representationData.CONTOUR;
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```typescript
const representationData = segmentation.representationData.Surface;
const representationData = segmentation.representationData.Labelmap;
const representationData = segmentation.representationData.Contour;
```

</TabItem>
</Tabs>

#### 分割表示

表示结构已被简化，现在是视口特定的。

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
type ToolGroupSpecificRepresentation =
  | ToolGroupSpecificLabelmapRepresentation
  | ToolGroupSpecificContourRepresentation;

type ToolGroupSpecificRepresentationState = {
  segmentationRepresentationUID: string;
  segmentationId: string;
  type: Enums.SegmentationRepresentations;
  active: boolean;
  segmentsLocked: Set<number>;
  colorLUTIndex: number;
};

type SegmentationState = {
  toolGroups: {
    [key: string]: {
      segmentationRepresentations: ToolGroupSpecificRepresentations;
      config: SegmentationRepresentationConfig;
    };
  };
};
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```typescript
type SegmentationRepresentation =
  | LabelmapRepresentation
  | ContourRepresentation
  | SurfaceRepresentation;

type BaseSegmentationRepresentation = {
  colorLUTIndex: number;
  segmentationId: string;
  type: Enums.SegmentationRepresentations;
  visible: boolean;
  active: boolean;
  segments: {
    [segmentIndex: number]: {
      visible: boolean;
    };
  };
};

type SegmentationState = {
  viewportSegRepresentations: {
    [viewportId: string]: Array<SegmentationRepresentation>;
  };
};
```

</TabItem>
</Tabs>

以前，分割表示是基于工具组的，这导致了一些问题。在新的结构中，分割表示是视口特定的。它现在由 `segmentationId`、`type` 以及该分割的各种设置组成。由于这一变化，几个函数被移除或修改。以下是更改的总结：

#### 移除的函数

- `getDefaultSegmentationStateManager`
- `getSegmentationRepresentations`
- `getAllSegmentationRepresentations`
- `getSegmentationIdRepresentations`
- `findSegmentationRepresentationByUID`
- `getToolGroupIdsWithSegmentation`
- `getToolGroupSpecificConfig`
- `setToolGroupSpecificConfig`
- `getGlobalConfig`
- `setGlobalConfig`
- `setSegmentationRepresentationSpecificConfig`
- `getSegmentationRepresentationSpecificConfig`
- `getSegmentSpecificRepresentationConfig`
- `setSegmentSpecificRepresentationConfig`
- `getToolGroupIdFromSegmentationRepresentationUID`
- `addSegmentationRepresentation`
- `getSegmentationRepresentationByUID`

#### 新的函数

- `addSegmentations(segmentationInputArray)`
- `removeSegmentation(segmentationId)`
- `getSegmentation(segmentationId)`
- `getSegmentations()`
- `getSegmentationRepresentation(viewportId, specifier)`
- `getSegmentationRepresentations(viewportId, specifier)`
- `removeSegmentationRepresentation(viewportId, specifier, immediate)`
- `removeAllSegmentationRepresentations()`
- `removeLabelmapRepresentation(viewportId, segmentationId, immediate)`
- `removeContourRepresentation(viewportId, segmentationId, immediate)`
- `removeSurfaceRepresentation(viewportId, segmentationId, immediate)`
- `getViewportSegmentations(viewportId, type)`
- `getViewportIdsWithSegmentation(segmentationId)`
- `getCurrentLabelmapImageIdForViewport(viewportId, segmentationId)`
- `updateLabelmapSegmentationImageReferences(segmentationId, imageIds)`
- `getStackSegmentationImageIdsForViewport(viewportId, segmentationId)`
- `destroy()`

### 移除 SegmentationDisplayTool

不再需要将 SegmentationDisplayTool 添加到 toolGroup。

**之前**

```js
toolGroup2.addTool(SegmentationDisplayTool.toolName);

toolGroup1.setToolEnabled(SegmentationDisplayTool.toolName);
```

**现在**

```js
// 无需任何操作
```

### 堆栈标签图

要创建堆栈标签图，您不再需要手动在标签图 imageIds 和视口 imageIds 之间创建引用。我们现在为您自动处理此过程。

这需要一个长篇的为什么...

以前的模型要求用户提供一个 imageIdReferenceMap，将标签图 imageIds 链接到视口 imageIds。这种方法在实现高级分割用例时带来了几个挑战：

1. 手动创建映射容易出错，特别是在 imageIds 的顺序方面。

2. 一旦分割与特定的视口 imageIds 相关联，就很难在其他地方渲染。例如：

   - 在单个关键图像上渲染 CT 图像堆栈分割。
   - 在包含 CT 和其他图像的堆栈上渲染 CT 图像堆栈分割。
   - 在能量 1 上渲染 DX 双能分割到能量 2。
   - 在同一空间的 PT 标签图上从堆栈视口渲染 CT 标签图。

这些场景突显了以前模型的局限性。

我们现在已经过渡到一个系统，用户只需提供 imageIds。在渲染过程中，我们将视口的当前 imageId 与标签图 imageIds 进行匹配，如果有匹配项，则渲染分割。这个匹配过程发生在 SegmentationStateManager 中，条件是分割必须与引用的视口处于同一平面。

这种新方法启用了许多额外的用例，并为分割渲染提供了更大的灵活性。

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```js
segmentation.addSegmentations([
  {
    segmentationId,
    representation: {
      type: csToolsEnums.SegmentationRepresentations.Labelmap,
      data: {
        imageIdReferenceMap:
          cornerstoneTools.utilities.segmentation.createImageIdReferenceMap(
            imageIds,
            segmentationImageIds
          ),
      },
    },
  },
]);
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```js
// 在这里填写“之后”部分的代码
```

</TabItem>
</Tabs>

---

**迁移步骤:**

1. 将通用的 `addSegmentationRepresentations` 调用替换为适当的特定表示函数。
2. 更新输入数组以匹配新的 `RepresentationPublicInput` 类型。
3. 从代码中移除任何特定类型的逻辑，因为现在这些逻辑由这些新函数处理。

#### 多视口函数

版本 2 引入了新的函数，用于同时向多个视口添加分割表示。

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
// 版本 1 中没有等效的函数
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```typescript
function addContourRepresentationToViewportMap(viewportInputMap: {
  [viewportId: string]: RepresentationPublicInput[];
});

function addLabelmapRepresentationToViewportMap(viewportInputMap: {
  [viewportId: string]: RepresentationPublicInput[];
});

function addSurfaceRepresentationToViewportMap(viewportInputMap: {
  [viewportId: string]: RepresentationPublicInput[];
});
```

</TabItem>
</Tabs>

**迁移步骤:**

1. 如果您之前向多个工具组添加表示，请重构代码以使用这些新的多视口函数。
2. 创建一个 `viewportInputMap` 对象，将视口 ID 作为键，`RepresentationPublicInput` 数组作为值。
3. 根据表示类型调用适当的多视口函数。

### 事件

由于我们从工具组转向视口，许多事件已被重命名，以包含 `viewportId` 而不是 `toolGroupId`，并且
一些事件详情已更改为包含 `segmentationId` 而不是 `segmentationRepresentationUID` 或 `toolGroupId`。

#### 移除工具组特定事件

`triggerSegmentationRepresentationModified` 和 `triggerSegmentationRepresentationRemoved` 函数已被移除。取而代之的是，库现在使用更通用的方法来处理分割事件。

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
function triggerSegmentationRepresentationModified(
  toolGroupId: string,
  segmentationRepresentationUID?: string
): void {
  // ...
}

function triggerSegmentationRepresentationRemoved(
  toolGroupId: string,
  segmentationRepresentationUID: string
): void {
  // ...
}
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```typescript
function triggerSegmentationRepresentationModified(
  viewportId: string,
  segmentationId: string,
  type?: SegmentationRepresentations
): void {
  // ...
}

function triggerSegmentationRepresentationRemoved(
  viewportId: string,
  segmentationId: string,
  type: SegmentationRepresentations
): void {
  // ...
}
```

</TabItem>
</Tabs>

**迁移步骤:**

1. 在函数调用中将 `toolGroupId` 替换为 `viewportId`。
2. 将 `segmentationRepresentationUID` 替换为 `segmentationId`。
3. 添加 `type` 参数以指定分割表示类型。

#### 简化的分割修改事件

`triggerSegmentationModified` 函数已简化，始终需要一个 `segmentationId`。

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
function triggerSegmentationModified(segmentationId?: string): void {
  // ...
}
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```typescript
function triggerSegmentationModified(segmentationId: string): void {
  // ...
}
```

</TabItem>
</Tabs>

**迁移步骤:**

1. 确保在调用 `triggerSegmentationModified` 时始终提供 `segmentationId`。
2. 移除任何处理 `segmentationId` 未定义情况的逻辑。

#### 更新的事件详情类型

几个事件详情类型已更新，以反映分割系统中的更改：

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
type SegmentationRepresentationModifiedEventDetail = {
  toolGroupId: string;
  segmentationRepresentationUID: string;
};

type SegmentationRepresentationRemovedEventDetail = {
  toolGroupId: string;
  segmentationRepresentationUID: string;
};

type SegmentationRenderedEventDetail = {
  viewportId: string;
  toolGroupId: string;
};
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```typescript
type SegmentationRepresentationModifiedEventDetail = {
  segmentationId: string;
  type: string;
  viewportId: string;
};

type SegmentationRepresentationRemovedEventDetail = {
  segmentationId: string;
  type: string;
  viewportId: string;
};

type SegmentationRenderedEventDetail = {
  viewportId: string;
  segmentationId: string;
  type: string;
};
```

</TabItem>
</Tabs>

## triggerAnnotationRenderForViewportIds

现在只需要 `viewportIds`，不再需要 `renderingEngine`。

```js
triggerAnnotationRenderForViewportIds(renderingEngine, viewportIds) ---> triggerAnnotationRenderForViewportIds(viewportIds)
```

<details>
<summary>为什么？</summary>
因为每个视口都有一个渲染引擎，因此不需要将渲染引擎作为参数传递。
</details>

## 工具

### StackScrollMouseWheelTool -> StackScrollTool

我们已经将鼠标滚轮与工具本身解耦，使其可以像其他鼠标绑定一样应用为绑定。

此更改带来了多个优势：

- 它可以与其他鼠标绑定组合使用
- 它可以与键盘绑定配对使用

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```js
cornerstoneTools.addTool(StackScrollMouseWheelTool);
toolGroup.addTool(StackScrollMouseWheelTool.toolName);
toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```js
cornerstoneTools.addTool(StackScrollTool);
toolGroup.addTool(StackScrollTool.toolName);
toolGroup.setToolActive(StackScrollTool.toolName, {
  bindings: [
    {
      mouseButton: MouseBindings.Wheel,
    },
  ],
});
```

  </TabItem>
</Tabs>

### BaseTool

`getTargetVolumeId` 方法已被移除，取而代之的是 `getTargetId`，而 `getTargetIdImage` 已重命名为 `getTargetImageData`，以更清楚地表明它是图像数据。

### 使用示例

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
const volumeId = this.getTargetVolumeId(viewport);
const imageData = this.getTargetIdImage(targetId, renderingEngine);
```

</TabItem>
<TabItem value="After" label="之后 🚀">

```typescript
const imageData = this.getTargetImageData(targetId);
```

</TabItem>
</Tabs>

## 新的分割模型

我们有一个新的分割模型，更加灵活且易于使用。

### 相同术语，不同架构

在 Cornerstone3D 版本 2 中，我们对分割模型进行了重大架构更改，同时保持了熟悉的术语。此重新设计旨在为在不同视口中处理分割提供更灵活和直观的方法。以下是主要更改及其背后的原因：

1. **视口特定，而非基于工具组**：

   - **以前**：分割与工具组绑定，工具组通常由多个视口组成。当用户希望在同一工具组内为某些视口添加分割而不是其他视口时，这会带来复杂性。
   - **现在**：分割现在是视口特定的。用户可以直接向视口添加分割，而不是向工具组添加或移除表示。这为每个视口渲染的内容提供了更细致的控制。
   - **为什么**：我们发现将渲染绑定到工具组并不是一种有效的方法。它通常需要为特定视口创建额外的工具组以进行自定义或防止渲染。

2. **简化分割表示的识别**：

   - **以前**：需要一个唯一的 `segmentationRepresentationUID` 进行识别。
   - **现在**：分割表示通过 `segmentationId` 和表示 `type` 的组合进行识别。这允许每个视口对同一分割有不同的表示。
   - **为什么**：这种简化使得在不同视口中管理和引用分割表示更加容易。

3. **数据与可视化的解耦**：

   - **以前**：分割渲染与工具组紧密耦合。
   - **现在**：分割现在纯粹作为数据处理，与用于交互的工具分离。
   - **为什么**：虽然将工具绑定到工具组是合适的，但像分割渲染这样的视口特定功能应该由各个视口负责。这种分离允许在不同视口中有更灵活的渲染和交互选项。

4. **多态分割支持**：

   - 新架构更好地支持多态分割的概念，即单个分割可以有多个表示（例如，标签图、轮廓、表面），并且可以在它们之间高效地转换。
   - **为什么**：这种灵活性允许更高效地存储、分析和实时可视化分割。

5. **跨表示类型的一致 API**：

   - 新的 API 提供了一种统一的方式来处理不同的分割表示，使得管理涉及多个视口和表示类型的复杂场景更加容易。
   - **为什么**：这种一致性简化了开发，并减少了在处理不同分割类型时出错的可能性。

这些架构更改为处理分割提供了更坚实的基础，特别是在复杂的多视口场景中。新方法已被证明非常有效，并为未来的增强功能打开了可能性。虽然核心概念保持相似，但您在代码中与分割交互的方式将会显著改变。本迁移指南将引导您完成这些更改，提供前后示例，帮助您将现有代码库更新到新架构。

### 分割状态

`Segmentation` 类型已被重组，以更好地组织分割信息和表示数据。在讨论迁移指南之前，让我们先看看更改。

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
type Segmentation = {
  segmentationId: string;
  type: Enums.SegmentationRepresentations;
  label: string;
  activeSegmentIndex: number;
  segmentsLocked: Set<number>;
  cachedStats: { [key: string]: number };
  segmentLabels: { [key: string]: string };
  representationData: SegmentationRepresentationData;
};
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```typescript
type Segmentation = {
  segmentationId: string;
  label: string;
  segments: {
    [segmentIndex: number]: Segment;
  };
  representationData: RepresentationsData;
};

type Segment = {
  segmentIndex: number;
  label: string;
  locked: boolean;
  cachedStats: { [key: string]: unknown };
  active: boolean;
};
```

</TabItem>
</Tabs>

新的分割状态模型提供了更有组织的数据结构。以前分散的信息，如 `cachedStats`、`segmentLabels` 和 `activeSegmentIndex`，已被整合到 `segments` 属性下。这种重组增强了清晰度和效率。在接下来的部分中，我们将讨论迁移指南，解释如何在新结构中访问和修改这些属性。这种重组主要影响分割存储级别。

#### 表示数据键

`SegmentationRepresentations` 枚举已更新为使用标题大小写而不是全大写，以使其与其他枚举保持一致。

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
enum SegmentationRepresentations {
  Labelmap = 'LABELMAP',
  Contour = 'CONTOUR',
  Surface = 'SURFACE',
}
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```typescript
enum SegmentationRepresentations {
  Labelmap = 'Labelmap',
  Contour = 'Contour',
  Surface = 'Surface',
}
```

</TabItem>
</Tabs>

这项更改影响了表示数据的访问方式：

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
const representationData = segmentation.representationData.SURFACE;
const representationData = segmentation.representationData.LABELMAP;
const representationData = segmentation.representationData.CONTOUR;
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```typescript
const representationData = segmentation.representationData.Surface;
const representationData = segmentation.representationData.Labelmap;
const representationData = segmentation.representationData.Contour;
```

</TabItem>
</Tabs>

#### 分割表示

表示结构已被简化，现在是视口特定的。

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
type ToolGroupSpecificRepresentation =
  | ToolGroupSpecificLabelmapRepresentation
  | ToolGroupSpecificContourRepresentation;

type ToolGroupSpecificRepresentationState = {
  segmentationRepresentationUID: string;
  segmentationId: string;
  type: Enums.SegmentationRepresentations;
  active: boolean;
  segmentsLocked: Set<number>;
  colorLUTIndex: number;
};

type SegmentationState = {
  toolGroups: {
    [key: string]: {
      segmentationRepresentations: ToolGroupSpecificRepresentations;
      config: SegmentationRepresentationConfig;
    };
  };
};
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```typescript
type SegmentationRepresentation =
  | LabelmapRepresentation
  | ContourRepresentation
  | SurfaceRepresentation;

type BaseSegmentationRepresentation = {
  colorLUTIndex: number;
  segmentationId: string;
  type: Enums.SegmentationRepresentations;
  visible: boolean;
  active: boolean;
  segments: {
    [segmentIndex: number]: {
      visible: boolean;
    };
  };
};

type SegmentationState = {
  viewportSegRepresentations: {
    [viewportId: string]: Array<SegmentationRepresentation>;
  };
};
```

</TabItem>
</Tabs>

以前，分割表示是基于工具组的，这导致了一些问题。在新的结构中，分割表示是视口特定的。它现在由 `segmentationId`、`type` 以及该分割的各种设置组成。由于这一变化，几个函数被移除或修改。以下是更改的总结：

#### 移除的函数

- `getDefaultSegmentationStateManager`
- `getSegmentationRepresentations`
- `getAllSegmentationRepresentations`
- `getSegmentationIdRepresentations`
- `findSegmentationRepresentationByUID`
- `getToolGroupIdsWithSegmentation`
- `getToolGroupSpecificConfig`
- `setToolGroupSpecificConfig`
- `getGlobalConfig`
- `setGlobalConfig`
- `setSegmentationRepresentationSpecificConfig`
- `getSegmentationRepresentationSpecificConfig`
- `getSegmentSpecificRepresentationConfig`
- `setSegmentSpecificRepresentationConfig`
- `getToolGroupIdFromSegmentationRepresentationUID`
- `addSegmentationRepresentation`
- `getSegmentationRepresentationByUID`

#### 新的函数

- `addSegmentations(segmentationInputArray)`
- `removeSegmentation(segmentationId)`
- `getSegmentation(segmentationId)`
- `getSegmentations()`
- `getSegmentationRepresentation(viewportId, specifier)`
- `getSegmentationRepresentations(viewportId, specifier)`
- `removeSegmentationRepresentation(viewportId, specifier, immediate)`
- `removeAllSegmentationRepresentations()`
- `removeLabelmapRepresentation(viewportId, segmentationId, immediate)`
- `removeContourRepresentation(viewportId, segmentationId, immediate)`
- `removeSurfaceRepresentation(viewportId, segmentationId, immediate)`
- `getViewportSegmentations(viewportId, type)`
- `getViewportIdsWithSegmentation(segmentationId)`
- `getCurrentLabelmapImageIdForViewport(viewportId, segmentationId)`
- `updateLabelmapSegmentationImageReferences(segmentationId, imageIds)`
- `getStackSegmentationImageIdsForViewport(viewportId, segmentationId)`
- `destroy()`

### 移除 SegmentationDisplayTool

不再需要将 SegmentationDisplayTool 添加到 toolGroup。

**之前**

```js
toolGroup2.addTool(SegmentationDisplayTool.toolName);

toolGroup1.setToolEnabled(SegmentationDisplayTool.toolName);
```

**现在**

```js
// 无需任何操作
```

### 堆栈标签图

要创建堆栈标签图，您不再需要手动在标签图 imageIds 和视口 imageIds 之间创建引用。我们现在为您自动处理此过程。

这需要一个长篇的为什么...

以前的模型要求用户提供一个 `imageIdReferenceMap`，将标签图 imageIds 链接到视口 imageIds。这种方法在实现高级分割用例时带来了几个挑战：

1. 手动创建映射容易出错，特别是在 imageIds 的顺序方面。

2. 一旦分割与特定的视口 imageIds 相关联，就很难在其他地方渲染。例如：

   - 在单个关键图像上渲染 CT 图像堆栈分割。
   - 在包含 CT 和其他图像的堆栈上渲染 CT 图像堆栈分割。
   - 在能量 1 上渲染 DX 双能分割到能量 2。
   - 在同一空间的 PT 标签图上从堆栈视口渲染 CT 标签图。

这些场景突显了以前模型的局限性。

我们现在已经过渡到一个系统，用户只需提供 imageIds。在渲染过程中，我们将视口的当前 imageId 与标签图 imageIds 进行匹配，如果有匹配项，则渲染分割。这个匹配过程发生在 SegmentationStateManager 中，条件是分割必须与引用的视口处于同一平面。

这种新方法启用了许多额外的用例，并为分割渲染提供了更大的灵活性。

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```js
segmentation.addSegmentations([
  {
    segmentationId,
    representation: {
      type: csToolsEnums.SegmentationRepresentations.Labelmap,
      data: {
        imageIdReferenceMap:
          cornerstoneTools.utilities.segmentation.createImageIdReferenceMap(
            imageIds,
            segmentationImageIds
          ),
      },
    },
  },
]);
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```js
// 在这里填写“之后”部分的代码
```

  </TabItem>
</Tabs>

---

**迁移步骤:**

1. 将通用的 `addSegmentationRepresentations` 调用替换为适当的特定表示函数。
2. 更新输入数组以匹配新的 `RepresentationPublicInput` 类型。
3. 从代码中移除任何特定类型的逻辑，因为现在这些逻辑由这些新函数处理。

#### 多视口函数

版本 2 引入了新的函数，用于同时向多个视口添加分割表示。

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```typescript
// 版本 1 中没有等效的函数
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```typescript
function addContourRepresentationToViewportMap(viewportInputMap: {
  [viewportId: string]: RepresentationPublicInput[];
});

function addLabelmapRepresentationToViewportMap(viewportInputMap: {
  [viewportId: string]: RepresentationPublicInput[];
});

function addSurfaceRepresentationToViewportMap(viewportInputMap: {
  [viewportId: string]: RepresentationPublicInput[];
});
```

  </TabItem>
</Tabs>

**迁移步骤:**

1. 如果您之前向多个工具组添加表示，请重构代码以使用这些新的多视口函数。
2. 创建一个 `viewportInputMap` 对象，将视口 ID 作为键，`RepresentationPublicInput` 数组作为值。
3. 根据表示类型调用适当的多视口函数。

### 事件

由于我们从工具组转向视口，许多事件已被重命名，以包含 `viewportId` 而不是 `toolGroupId`，并且
一些事件详情已更改为包含 `segmentationId` 而不是 `segmentationRepresentationUID` 或 `toolGroupId`。

#### 移除工具组特定事件

`triggerSegmentationRepresentationModified` 和 `triggerSegmentationRepresentationRemoved` 函数已被移除。取而代之的是，库现在使用更通用的方法来处理分割事件。

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```typescript
function triggerSegmentationRepresentationModified(
  toolGroupId: string,
  segmentationRepresentationUID?: string
): void {
  // ...
}

function triggerSegmentationRepresentationRemoved(
  toolGroupId: string,
  segmentationRepresentationUID: string
): void {
  // ...
}
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```typescript
function triggerSegmentationRepresentationModified(
  viewportId: string,
  segmentationId: string,
  type?: SegmentationRepresentations
): void {
  // ...
}

function triggerSegmentationRepresentationRemoved(
  viewportId: string,
  segmentationId: string,
  type: SegmentationRepresentations
): void {
  // ...
}
```

  </TabItem>
</Tabs>

**迁移步骤:**

1. 在函数调用中将 `toolGroupId` 替换为 `viewportId`。
2. 将 `segmentationRepresentationUID` 替换为 `segmentationId`。
3. 添加 `type` 参数以指定分割表示类型。

#### 简化的分割修改事件

`triggerSegmentationModified` 函数已简化，始终需要一个 `segmentationId`。

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```typescript
function triggerSegmentationModified(segmentationId?: string): void {
  // ...
}
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```typescript
function triggerSegmentationModified(segmentationId: string): void {
  // ...
}
```

  </TabItem>
</Tabs>

**迁移步骤:**

1. 确保在调用 `triggerSegmentationModified` 时始终提供 `segmentationId`。
2. 移除任何处理 `segmentationId` 未定义情况的逻辑。

#### 更新的事件详情类型

几个事件详情类型已更新，以反映分割系统中的更改：

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```typescript
type SegmentationRepresentationModifiedEventDetail = {
  toolGroupId: string;
  segmentationRepresentationUID: string;
};

type SegmentationRepresentationRemovedEventDetail = {
  toolGroupId: string;
  segmentationRepresentationUID: string;
};

type SegmentationRenderedEventDetail = {
  viewportId: string;
  toolGroupId: string;
};
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```typescript
type SegmentationRepresentationModifiedEventDetail = {
  segmentationId: string;
  type: string;
  viewportId: string;
};

type SegmentationRepresentationRemovedEventDetail = {
  segmentationId: string;
  type: string;
  viewportId: string;
};

type SegmentationRenderedEventDetail = {
  viewportId: string;
  segmentationId: string;
  type: string;
};
```

  </TabItem>
</Tabs>

## triggerAnnotationRenderForViewportIds

现在只需要 `viewportIds`，不再需要 `renderingEngine`。

```js
triggerAnnotationRenderForViewportIds(renderingEngine, viewportIds) ---> triggerAnnotationRenderForViewportIds(viewportIds)
```

<details>
<summary>为什么？</summary>
因为每个视口都有一个渲染引擎，因此不需要将渲染引擎作为参数传递。
</details>

## 工具

### StackScrollMouseWheelTool -> StackScrollTool

我们已经将鼠标滚轮与工具本身解耦，使其可以像其他鼠标绑定一样应用为绑定。

此更改带来了多个优势：

- 它可以与其他鼠标绑定组合使用
- 它可以与键盘绑定配对使用

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```js
cornerstoneTools.addTool(StackScrollMouseWheelTool);
toolGroup.addTool(StackScrollMouseWheelTool.toolName);
toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```js
cornerstoneTools.addTool(StackScrollTool);
toolGroup.addTool(StackScrollTool.toolName);
toolGroup.setToolActive(StackScrollTool.toolName, {
  bindings: [
    {
      mouseButton: MouseBindings.Wheel,
    },
  ],
});
```

  </TabItem>
</Tabs>

### BaseTool

`getTargetVolumeId` 方法已被移除，取而代之的是 `getTargetId`，而 `getTargetIdImage` 已重命名为 `getTargetImageData`，以更清楚地表明它是图像数据。

### 使用示例

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
const volumeId = this.getTargetVolumeId(viewport);
const imageData = this.getTargetIdImage(targetId, renderingEngine);
```

</TabItem>
<TabItem value="After" label="之后 🚀">

```typescript
const imageData = this.getTargetImageData(targetId);
```

</TabItem>
</Tabs>

## 新的分割模型

我们有一个新的分割模型，更加灵活且易于使用。

### 相同术语，不同架构

在 Cornerstone3D 版本 2 中，我们对分割模型进行了重大架构更改，同时保持了熟悉的术语。此重新设计旨在为在不同视口中处理分割提供更灵活和直观的方法。以下是主要更改及其背后的原因：

1. **视口特定，而非基于工具组**：

   - **以前**：分割与工具组绑定，工具组通常由多个视口组成。当用户希望在同一工具组内为某些视口添加分割而不是其他视口时，这会带来复杂性。
   - **现在**：分割现在是视口特定的。用户可以直接向视口添加分割，而不是向工具组添加或移除表示。这为每个视口渲染的内容提供了更细致的控制。
   - **为什么**：我们发现将渲染绑定到工具组并不是一种有效的方法。它通常需要为特定视口创建额外的工具组以进行自定义或防止渲染。

2. **简化分割表示的识别**：

   - **以前**：需要一个唯一的 `segmentationRepresentationUID` 进行识别。
   - **现在**：分割表示通过 `segmentationId` 和表示 `type` 的组合进行识别。这允许每个视口对同一分割有不同的表示。
   - **为什么**：这种简化使得在不同视口中管理和引用分割表示更加容易。

3. **数据与可视化的解耦**：

   - **以前**：分割渲染与工具组紧密耦合。
   - **现在**：分割现在纯粹作为数据处理，与用于交互的工具分离。
   - **为什么**：虽然将工具绑定到工具组是合适的，但像分割渲染这样的视口特定功能应该由各个视口负责。这种分离允许在不同视口中有更灵活的渲染和交互选项。

4. **多态分割支持**：

   - 新架构更好地支持多态分割的概念，即单个分割可以有多个表示（例如，标签图、轮廓、表面），并且可以在它们之间高效地转换。
   - **为什么**：这种灵活性允许更高效地存储、分析和实时可视化分割。

5. **跨表示类型的一致 API**：

   - 新的 API 提供了一种统一的方式来处理不同的分割表示，使得管理涉及多个视口和表示类型的复杂场景更加容易。
   - **为什么**：这种一致性简化了开发，并减少了在处理不同分割类型时出错的可能性。

这些架构更改为处理分割提供了更坚实的基础，特别是在复杂的多视口场景中。新方法已被证明非常有效，并为未来的增强功能打开了可能性。虽然核心概念保持相似，但您在代码中与分割交互的方式将会显著改变。本迁移指南将引导您完成这些更改，提供前后示例，帮助您将现有代码库更新到新架构。

### 分割状态

`Segmentation` 类型已被重组，以更好地组织分割信息和表示数据。在讨论迁移指南之前，让我们先看看更改。

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
type Segmentation = {
  segmentationId: string;
  type: Enums.SegmentationRepresentations;
  label: string;
  activeSegmentIndex: number;
  segmentsLocked: Set<number>;
  cachedStats: { [key: string]: number };
  segmentLabels: { [key: string]: string };
  representationData: SegmentationRepresentationData;
};
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```typescript
type Segmentation = {
  segmentationId: string;
  label: string;
  segments: {
    [segmentIndex: number]: Segment;
  };
  representationData: RepresentationsData;
};

type Segment = {
  segmentIndex: number;
  label: string;
  locked: boolean;
  cachedStats: { [key: string]: unknown };
  active: boolean;
};
```

</TabItem>
</Tabs>

新的分割状态模型提供了更有组织的数据结构。以前分散的信息，如 `cachedStats`、`segmentLabels` 和 `activeSegmentIndex`，已被整合到 `segments` 属性下。这种重组增强了清晰度和效率。在接下来的部分中，我们将讨论迁移指南，解释如何在新结构中访问和修改这些属性。这种重组主要影响分割存储级别。

#### 表示数据键

`SegmentationRepresentations` 枚举已更新为使用标题大小写而不是全大写，以使其与其他枚举保持一致。

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
enum SegmentationRepresentations {
  Labelmap = 'LABELMAP',
  Contour = 'CONTOUR',
  Surface = 'SURFACE',
}
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```typescript
enum SegmentationRepresentations {
  Labelmap = 'Labelmap',
  Contour = 'Contour',
  Surface = 'Surface',
}
```

</TabItem>
</Tabs>

这项更改影响了表示数据的访问方式：

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```typescript
const representationData = segmentation.representationData.SURFACE;
const representationData = segmentation.representationData.LABELMAP;
const representationData = segmentation.representationData.CONTOUR;
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```typescript
const representationData = segmentation.representationData.Surface;
const representationData = segmentation.representationData.Labelmap;
const representationData = segmentation.representationData.Contour;
```

  </TabItem>
</Tabs>

#### 分割表示

表示结构已被简化，现在是视口特定的。

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
type ToolGroupSpecificRepresentation =
  | ToolGroupSpecificLabelmapRepresentation
  | ToolGroupSpecificContourRepresentation;

type ToolGroupSpecificRepresentationState = {
  segmentationRepresentationUID: string;
  segmentationId: string;
  type: Enums.SegmentationRepresentations;
  active: boolean;
  segmentsLocked: Set<number>;
  colorLUTIndex: number;
};

type SegmentationState = {
  toolGroups: {
    [key: string]: {
      segmentationRepresentations: ToolGroupSpecificRepresentations;
      config: SegmentationRepresentationConfig;
    };
  };
};
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```typescript
type SegmentationRepresentation =
  | LabelmapRepresentation
  | ContourRepresentation
  | SurfaceRepresentation;

type BaseSegmentationRepresentation = {
  colorLUTIndex: number;
  segmentationId: string;
  type: Enums.SegmentationRepresentations;
  visible: boolean;
  active: boolean;
  segments: {
    [segmentIndex: number]: {
      visible: boolean;
    };
  };
};

type SegmentationState = {
  viewportSegRepresentations: {
    [viewportId: string]: Array<SegmentationRepresentation>;
  };
};
```

</TabItem>
</Tabs>

以前，分割表示是基于工具组的，这导致了一些问题。在新的结构中，分割表示是视口特定的。它现在由 `segmentationId`、`type` 以及该分割的各种设置组成。由于这一变化，几个函数被移除或修改。以下是更改的总结：

#### 移除的函数

- `getDefaultSegmentationStateManager`
- `getSegmentationRepresentations`
- `getAllSegmentationRepresentations`
- `getSegmentationIdRepresentations`
- `findSegmentationRepresentationByUID`
- `getToolGroupIdsWithSegmentation`
- `getToolGroupSpecificConfig`
- `setToolGroupSpecificConfig`
- `getGlobalConfig`
- `setGlobalConfig`
- `setSegmentationRepresentationSpecificConfig`
- `getSegmentationRepresentationSpecificConfig`
- `getSegmentSpecificRepresentationConfig`
- `setSegmentSpecificRepresentationConfig`
- `getToolGroupIdFromSegmentationRepresentationUID`
- `addSegmentationRepresentation`
- `getSegmentationRepresentationByUID`

#### 新的函数

- `addSegmentations(segmentationInputArray)`
- `removeSegmentation(segmentationId)`
- `getSegmentation(segmentationId)`
- `getSegmentations()`
- `getSegmentationRepresentation(viewportId, specifier)`
- `getSegmentationRepresentations(viewportId, specifier)`
- `removeSegmentationRepresentation(viewportId, specifier, immediate)`
- `removeAllSegmentationRepresentations()`
- `removeLabelmapRepresentation(viewportId, segmentationId, immediate)`
- `removeContourRepresentation(viewportId, segmentationId, immediate)`
- `removeSurfaceRepresentation(viewportId, segmentationId, immediate)`
- `getViewportSegmentations(viewportId, type)`
- `getViewportIdsWithSegmentation(segmentationId)`
- `getCurrentLabelmapImageIdForViewport(viewportId, segmentationId)`
- `updateLabelmapSegmentationImageReferences(segmentationId, imageIds)`
- `getStackSegmentationImageIdsForViewport(viewportId, segmentationId)`
- `destroy()`

### 移除 SegmentationDisplayTool

不再需要将 SegmentationDisplayTool 添加到 toolGroup。

**之前**

```js
toolGroup2.addTool(SegmentationDisplayTool.toolName);

toolGroup1.setToolEnabled(SegmentationDisplayTool.toolName);
```

**现在**

```js
// 无需任何操作
```

### 堆栈标签图

要创建堆栈标签图，您不再需要手动在标签图 imageIds 和视口 imageIds 之间创建引用。我们现在为您自动处理此过程。

这需要一个长篇的为什么...

以前的模型要求用户提供一个 `imageIdReferenceMap`，将标签图 imageIds 链接到视口 imageIds。这种方法在实现高级分割用例时带来了几个挑战：

1. 手动创建映射容易出错，特别是在 imageIds 的顺序方面。

2. 一旦分割与特定的视口 imageIds 相关联，就很难在其他地方渲染。例如：

   - 在单个关键图像上渲染 CT 图像堆栈分割。
   - 在包含 CT 和其他图像的堆栈上渲染 CT 图像堆栈分割。
   - 在能量 1 上渲染 DX 双能分割到能量 2。
   - 在同一空间的 PT 标签图上从堆栈视口渲染 CT 标签图。

这些场景突显了以前模型的局限性。

我们现在已经过渡到一个系统，用户只需提供 imageIds。在渲染过程中，我们将视口的当前 imageId 与标签图 imageIds 进行匹配，如果有匹配项，则渲染分割。这个匹配过程发生在 SegmentationStateManager 中，条件是分割必须与引用的视口处于同一平面。

这种新方法启用了许多额外的用例，并为分割渲染提供了更大的灵活性。

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```js
segmentation.addSegmentations([
  {
    segmentationId,
    representation: {
      type: csToolsEnums.SegmentationRepresentations.Labelmap,
      data: {
        imageIdReferenceMap:
          cornerstoneTools.utilities.segmentation.createImageIdReferenceMap(
            imageIds,
            segmentationImageIds
          ),
      },
    },
  },
]);
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```js
// 在这里填写“之后”部分的代码
```

  </TabItem>
</Tabs>

---

**迁移步骤:**

1. 将通用的 `addSegmentationRepresentations` 调用替换为适当的特定表示函数。
2. 更新输入数组以匹配新的 `RepresentationPublicInput` 类型。
3. 从代码中移除任何特定类型的逻辑，因为现在这些逻辑由这些新函数处理。

#### 多视口函数

版本 2 引入了新的函数，用于同时向多个视口添加分割表示。

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```typescript
// 版本 1 中没有等效的函数
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```typescript
function addContourRepresentationToViewportMap(viewportInputMap: {
  [viewportId: string]: RepresentationPublicInput[];
});

function addLabelmapRepresentationToViewportMap(viewportInputMap: {
  [viewportId: string]: RepresentationPublicInput[];
});

function addSurfaceRepresentationToViewportMap(viewportInputMap: {
  [viewportId: string]: RepresentationPublicInput[];
});
```

  </TabItem>
</Tabs>

**迁移步骤:**

1. 如果您之前向多个工具组添加表示，请重构代码以使用这些新的多视口函数。
2. 创建一个 `viewportInputMap` 对象，将视口 ID 作为键，`RepresentationPublicInput` 数组作为值。
3. 根据表示类型调用适当的多视口函数。

### 事件

由于我们从工具组转向视口，许多事件已被重命名，以包含 `viewportId` 而不是 `toolGroupId`，并且
一些事件详情已更改为包含 `segmentationId` 而不是 `segmentationRepresentationUID` 或 `toolGroupId`。

#### 移除工具组特定事件

`triggerSegmentationRepresentationModified` 和 `triggerSegmentationRepresentationRemoved` 函数已被移除。取而代之的是，库现在使用更通用的方法来处理分割事件。

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```typescript
function triggerSegmentationRepresentationModified(
  toolGroupId: string,
  segmentationRepresentationUID?: string
): void {
  // ...
}

function triggerSegmentationRepresentationRemoved(
  toolGroupId: string,
  segmentationRepresentationUID: string
): void {
  // ...
}
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```typescript
function triggerSegmentationRepresentationModified(
  viewportId: string,
  segmentationId: string,
  type?: SegmentationRepresentations
): void {
  // ...
}

function triggerSegmentationRepresentationRemoved(
  viewportId: string,
  segmentationId: string,
  type: SegmentationRepresentations
): void {
  // ...
}
```

  </TabItem>
</Tabs>

**迁移步骤:**

1. 在函数调用中将 `toolGroupId` 替换为 `viewportId`。
2. 将 `segmentationRepresentationUID` 替换为 `segmentationId`。
3. 添加 `type` 参数以指定分割表示类型。

#### 简化的分割修改事件

`triggerSegmentationModified` 函数已简化，始终需要一个 `segmentationId`。

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```typescript
function triggerSegmentationModified(segmentationId?: string): void {
  // ...
}
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```typescript
function triggerSegmentationModified(segmentationId: string): void {
  // ...
}
```

  </TabItem>
</Tabs>

**迁移步骤:**

1. 确保在调用 `triggerSegmentationModified` 时始终提供 `segmentationId`。
2. 移除任何处理 `segmentationId` 未定义情况的逻辑。

#### 更新的事件详情类型

几个事件详情类型已更新，以反映分割系统中的更改：

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```typescript
type SegmentationRepresentationModifiedEventDetail = {
  toolGroupId: string;
  segmentationRepresentationUID: string;
};

type SegmentationRepresentationRemovedEventDetail = {
  toolGroupId: string;
  segmentationRepresentationUID: string;
};

type SegmentationRenderedEventDetail = {
  viewportId: string;
  toolGroupId: string;
};
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```typescript
type SegmentationRepresentationModifiedEventDetail = {
  segmentationId: string;
  type: string;
  viewportId: string;
};

type SegmentationRepresentationRemovedEventDetail = {
  segmentationId: string;
  type: string;
  viewportId: string;
};

type SegmentationRenderedEventDetail = {
  viewportId: string;
  segmentationId: string;
  type: string;
};
```

  </TabItem>
</Tabs>

---

#### 设置渲染非活动分割

启用或禁用渲染非活动分割的函数已更新。

**之前**

这是分割配置的一部分：

```js
setGlobalConfig({ renderInactiveSegmentations: true });
```

**现在**

使用 `setRenderInactiveSegmentations`：

```js
// 设置是否在视口中渲染非活动分割
setRenderInactiveSegmentations(viewportId, true);

// 获取视口中是否渲染非活动分割
const renderInactive = getRenderInactiveSegmentations(viewportId);
```

#### 重置为全局样式

要将所有分割样式重置为全局样式：

```js
resetToGlobalStyle();
```

#### 示例迁移

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```js
import {
  getGlobalConfig,
  getGlobalRepresentationConfig,
  getToolGroupSpecificConfig,
  setGlobalConfig,
  setGlobalRepresentationConfig,
  setToolGroupSpecificConfig,
  setSegmentSpecificConfig,
  getSegmentSpecificConfig,
  setSegmentationRepresentationSpecificConfig,
  getSegmentationRepresentationSpecificConfig,
} from './segmentationConfig';

// 获取全局分割配置
const globalConfig = getGlobalConfig();

// 设置全局表示配置
setGlobalRepresentationConfig(SegmentationRepresentations.Labelmap, {
  renderOutline: true,
  outlineWidth: 2,
});

// 设置工具组特定配置
setToolGroupSpecificConfig(toolGroupId, {
  representations: {
    LABELMAP: {
      renderOutline: false,
    },
  },
});

// 设置段特定配置
setSegmentSpecificConfig(
  toolGroupId,
  segmentationRepresentationUID,
  segmentIndex,
  {
    LABELMAP: {
      renderFill: false,
    },
  }
);
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```js
import {
  getStyle,
  setStyle,
  setRenderInactiveSegmentations,
  getRenderInactiveSegmentations,
  resetToGlobalStyle,
  hasCustomStyle,
} from '@cornerstonejs/core';

// 获取 Labelmap 表示的全局样式
const labelmapStyle = getStyle({ type: SegmentationRepresentations.Labelmap });

// 设置 Labelmap 表示的全局样式
setStyle(
  { type: SegmentationRepresentations.Labelmap },
  {
    renderOutline: true,
    outlineWidth: 2,
  }
);

// 设置特定视口和分割的样式
setStyle(
  {
    viewportId: 'viewport1',
    segmentationId: 'segmentation1',
    type: SegmentationRepresentations.Labelmap,
  },
  {
    renderOutline: false,
  }
);

// 设置特定段的样式
setStyle(
  {
    segmentationId: 'segmentation1',
    type: SegmentationRepresentations.Labelmap,
    segmentIndex: segmentIndex,
  },
  {
    renderFill: false,
  }
);

// 设置视口的渲染非活动分割
setRenderInactiveSegmentations('viewport1', true);

// 获取视口的渲染非活动分割设置
const renderInactive = getRenderInactiveSegmentations('viewport1');

// 重置所有样式为全局样式
resetToGlobalStyle();
```

  </TabItem>
</Tabs>

---

#### 总结

- **统一的样式管理**：新的 `getStyle` 和 `setStyle` 函数提供了一种统一的方式来管理不同层级的分割样式——全局、分割特定、视口特定和段特定。
- **指定器对象**：`specifier` 对象允许您针对特定的视口、分割和段。
  - `type` 是必需的
  - 如果提供了 `segmentationId`，样式将应用于所有视口中该分割的特定表示
  - 如果同时提供了 `segmentationId` 和 `segmentIndex`，样式将应用于特定视口中该分割的特定段
  - 如果提供了 `viewportId`，样式将应用于特定视口中的所有分割
  - 如果同时提供了 `viewportId`、`segmentationId` 和 `segmentIndex`，样式将应用于特定视口中该分割的特定段
- **样式层级**：有效样式由一个层级决定，考虑了全局样式、分割特定样式和视口特定样式。

### Active

#### 基于视口的操作

API 现在使用视口 ID 而不是工具组 ID 来识别分割操作的上下文。

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```typescript
function getActiveSegmentationRepresentation(toolGroupId: string);

function getActiveSegmentation(toolGroupId: string);

function setActiveSegmentationRepresentation(
  toolGroupId: string,
  segmentationRepresentationUID: string
);
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```typescript
function getActiveSegmentation(viewportId: string);

function setActiveSegmentation(
  viewportId: string,
  segmentationId: string,
  suppressEvent: boolean = false
);
```

  </TabItem>
</Tabs>

#### 迁移步骤:

1. 将所有函数调用中的 `toolGroupId` 替换为 `viewportId`。
2. 更新 `getActiveSegmentationRepresentation` 和 `getActiveSegmentation` 调用以使用新的 `getActiveSegmentation` 函数。
3. 将 `setActiveSegmentationRepresentation` 调用替换为 `setActiveSegmentation`，并使用新的参数结构。

## triggerAnnotationRenderForViewportIds

现在只需要 `viewportIds`，不再需要 `renderingEngine`。

```js
triggerAnnotationRenderForViewportIds(renderingEngine, viewportIds) ---> triggerAnnotationRenderForViewportIds(viewportIds)
```

<details>
<summary>为什么？</summary>
因为每个视口都有一个渲染引擎，因此不需要将渲染引擎作为参数传递。
</details>

## 工具

### StackScrollMouseWheelTool -> StackScrollTool

我们已经将鼠标滚轮与工具本身解耦，使其可以像其他鼠标绑定一样应用为绑定。

此更改带来了多个优势：

- 它可以与其他鼠标绑定组合使用
- 它可以与键盘绑定配对使用

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```js
cornerstoneTools.addTool(StackScrollMouseWheelTool);
toolGroup.addTool(StackScrollMouseWheelTool.toolName);
toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```js
cornerstoneTools.addTool(StackScrollTool);
toolGroup.addTool(StackScrollTool.toolName);
toolGroup.setToolActive(StackScrollTool.toolName, {
  bindings: [
    {
      mouseButton: MouseBindings.Wheel,
    },
  ],
});
```

  </TabItem>
</Tabs>

### BaseTool

`getTargetVolumeId` 方法已被移除，取而代之的是 `getTargetId`，而 `getTargetIdImage` 已重命名为 `getTargetImageData`，以更清楚地表明它是图像数据。

### 使用示例

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
const volumeId = this.getTargetVolumeId(viewport);
const imageData = this.getTargetIdImage(targetId, renderingEngine);
```

</TabItem>
<TabItem value="After" label="之后 🚀">

```typescript
const imageData = this.getTargetImageData(targetId);
```

</TabItem>
</Tabs>

## 新的分割模型

我们有一个新的分割模型，更加灵活且易于使用。

### 相同术语，不同架构

在 Cornerstone3D 版本 2 中，我们对分割模型进行了重大架构更改，同时保持了熟悉的术语。此重新设计旨在为在不同视口中处理分割提供更灵活和直观的方法。以下是主要更改及其背后的原因：

1. **视口特定，而非基于工具组**：

   - **以前**：分割与工具组绑定，工具组通常由多个视口组成。当用户希望在同一工具组内为某些视口添加分割而不是其他视口时，这会带来复杂性。
   - **现在**：分割现在是视口特定的。用户可以直接向视口添加分割，而不是向工具组添加或移除表示。这为每个视口渲染的内容提供了更细致的控制。
   - **为什么**：我们发现将渲染绑定到工具组并不是一种有效的方法。它通常需要为特定视口创建额外的工具组以进行自定义或防止渲染。

2. **简化分割表示的识别**：

   - **以前**：需要一个唯一的 `segmentationRepresentationUID` 进行识别。
   - **现在**：分割表示通过 `segmentationId` 和表示 `type` 的组合进行识别。这允许每个视口对同一分割有不同的表示。
   - **为什么**：这种简化使得在不同视口中管理和引用分割表示更加容易。

3. **数据与可视化的解耦**：

   - **以前**：分割渲染与工具组紧密耦合。
   - **现在**：分割现在纯粹作为数据处理，与用于交互的工具分离。
   - **为什么**：虽然将工具绑定到工具组是合适的，但像分割渲染这样的视口特定功能应该由各个视口负责。这种分离允许在不同视口中有更灵活的渲染和交互选项。

4. **多态分割支持**：

   - 新架构更好地支持多态分割的概念，即单个分割可以有多个表示（例如，标签图、轮廓、表面），并且可以在它们之间高效地转换。
   - **为什么**：这种灵活性允许更高效地存储、分析和实时可视化分割。

5. **跨表示类型的一致 API**：

   - 新的 API 提供了一种统一的方式来处理不同的分割表示，使得管理涉及多个视口和表示类型的复杂场景更加容易。
   - **为什么**：这种一致性简化了开发，并减少了在处理不同分割类型时出错的可能性。

这些架构更改为处理分割提供了更坚实的基础，特别是在复杂的多视口场景中。新方法已被证明非常有效，并为未来的增强功能打开了可能性。虽然核心概念保持相似，但您在代码中与分割交互的方式将会显著改变。本迁移指南将引导您完成这些更改，提供前后示例，帮助您将现有代码库更新到新架构。

### 分割状态

`Segmentation` 类型已被重组，以更好地组织分割信息和表示数据。在讨论迁移指南之前，让我们先看看更改。

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
type Segmentation = {
  segmentationId: string;
  type: Enums.SegmentationRepresentations;
  label: string;
  activeSegmentIndex: number;
  segmentsLocked: Set<number>;
  cachedStats: { [key: string]: number };
  segmentLabels: { [key: string]: string };
  representationData: SegmentationRepresentationData;
};
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```typescript
type Segmentation = {
  segmentationId: string;
  label: string;
  segments: {
    [segmentIndex: number]: Segment;
  };
  representationData: RepresentationsData;
};

type Segment = {
  segmentIndex: number;
  label: string;
  locked: boolean;
  cachedStats: { [key: string]: unknown };
  active: boolean;
};
```

</TabItem>
</Tabs>

新的分割状态模型提供了更有组织的数据结构。以前分散的信息，如 `cachedStats`、`segmentLabels` 和 `activeSegmentIndex`，已被整合到 `segments` 属性下。这种重组增强了清晰度和效率。在接下来的部分中，我们将讨论迁移指南，解释如何在新结构中访问和修改这些属性。这种重组主要影响分割存储级别。

#### 表示数据键

`SegmentationRepresentations` 枚举已更新为使用标题大小写而不是全大写，以使其与其他枚举保持一致。

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
enum SegmentationRepresentations {
  Labelmap = 'LABELMAP',
  Contour = 'CONTOUR',
  Surface = 'SURFACE',
}
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```typescript
enum SegmentationRepresentations {
  Labelmap = 'Labelmap',
  Contour = 'Contour',
  Surface = 'Surface',
}
```

</TabItem>
</Tabs>

这项更改影响了表示数据的访问方式：

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
const representationData = segmentation.representationData.SURFACE;
const representationData = segmentation.representationData.LABELMAP;
const representationData = segmentation.representationData.CONTOUR;
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```typescript
const representationData = segmentation.representationData.Surface;
const representationData = segmentation.representationData.Labelmap;
const representationData = segmentation.representationData.Contour;
```

</TabItem>
</Tabs>

#### 分割表示

表示结构已被简化，现在是视口特定的。

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
type ToolGroupSpecificRepresentation =
  | ToolGroupSpecificLabelmapRepresentation
  | ToolGroupSpecificContourRepresentation;

type ToolGroupSpecificRepresentationState = {
  segmentationRepresentationUID: string;
  segmentationId: string;
  type: Enums.SegmentationRepresentations;
  active: boolean;
  segmentsLocked: Set<number>;
  colorLUTIndex: number;
};

type SegmentationState = {
  toolGroups: {
    [key: string]: {
      segmentationRepresentations: ToolGroupSpecificRepresentations;
      config: SegmentationRepresentationConfig;
    };
  };
};
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```typescript
type SegmentationRepresentation =
  | LabelmapRepresentation
  | ContourRepresentation
  | SurfaceRepresentation;

type BaseSegmentationRepresentation = {
  colorLUTIndex: number;
  segmentationId: string;
  type: Enums.SegmentationRepresentations;
  visible: boolean;
  active: boolean;
  segments: {
    [segmentIndex: number]: {
      visible: boolean;
    };
  };
};

type SegmentationState = {
  viewportSegRepresentations: {
    [viewportId: string]: Array<SegmentationRepresentation>;
  };
};
```

</TabItem>
</Tabs>

以前，分割表示是基于工具组的，这导致了一些问题。在新的结构中，分割表示是视口特定的。它现在由 `segmentationId`、`type` 以及该分割的各种设置组成。由于这一变化，几个函数被移除或修改。以下是更改的总结：

#### 移除的函数

- `getDefaultSegmentationStateManager`
- `getSegmentationRepresentations`
- `getAllSegmentationRepresentations`
- `getSegmentationIdRepresentations`
- `findSegmentationRepresentationByUID`
- `getToolGroupIdsWithSegmentation`
- `getToolGroupSpecificConfig`
- `setToolGroupSpecificConfig`
- `getGlobalConfig`
- `setGlobalConfig`
- `setSegmentationRepresentationSpecificConfig`
- `getSegmentationRepresentationSpecificConfig`
- `getSegmentSpecificRepresentationConfig`
- `setSegmentSpecificRepresentationConfig`
- `getToolGroupIdFromSegmentationRepresentationUID`
- `addSegmentationRepresentation`
- `getSegmentationRepresentationByUID`

#### 新的函数

- `addSegmentations(segmentationInputArray)`
- `removeSegmentation(segmentationId)`
- `getSegmentation(segmentationId)`
- `getSegmentations()`
- `getSegmentationRepresentation(viewportId, specifier)`
- `getSegmentationRepresentations(viewportId, specifier)`
- `removeSegmentationRepresentation(viewportId, specifier, immediate)`
- `removeAllSegmentationRepresentations()`
- `removeLabelmapRepresentation(viewportId, segmentationId, immediate)`
- `removeContourRepresentation(viewportId, segmentationId, immediate)`
- `removeSurfaceRepresentation(viewportId, segmentationId, immediate)`
- `getViewportSegmentations(viewportId, type)`
- `getViewportIdsWithSegmentation(segmentationId)`
- `getCurrentLabelmapImageIdForViewport(viewportId, segmentationId)`
- `updateLabelmapSegmentationImageReferences(segmentationId, imageIds)`
- `getStackSegmentationImageIdsForViewport(viewportId, segmentationId)`
- `destroy()`

### 移除 SegmentationDisplayTool

不再需要将 SegmentationDisplayTool 添加到 toolGroup。

**之前**

```js
toolGroup2.addTool(SegmentationDisplayTool.toolName);

toolGroup1.setToolEnabled(SegmentationDisplayTool.toolName);
```

**现在**

```js
// 无需任何操作
```

### 堆栈标签图

要创建堆栈标签图，您不再需要手动在标签图 imageIds 和视口 imageIds 之间创建引用。我们现在为您自动处理此过程。

这需要一个长篇的为什么...

以前的模型要求用户提供一个 `imageIdReferenceMap`，将标签图 imageIds 链接到视口 imageIds。这种方法在实现高级分割用例时带来了几个挑战：

1. 手动创建映射容易出错，特别是在 imageIds 的顺序方面。

2. 一旦分割与特定的视口 imageIds 相关联，就很难在其他地方渲染。例如：

   - 在单个关键图像上渲染 CT 图像堆栈分割。
   - 在包含 CT 和其他图像的堆栈上渲染 CT 图像堆栈分割。
   - 在能量 1 上渲染 DX 双能分割到能量 2。
   - 在同一空间的 PT 标签图上从堆栈视口渲染 CT 标签图。

这些场景突显了以前模型的局限性。

我们现在已经过渡到一个系统，用户只需提供 imageIds。在渲染过程中，我们将视口的当前 imageId 与标签图 imageIds 进行匹配，如果有匹配项，则渲染分割。这个匹配过程发生在 SegmentationStateManager 中，条件是分割必须与引用的视口处于同一平面。

这种新方法启用了许多额外的用例，并为分割渲染提供了更大的灵活性。

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```js
segmentation.addSegmentations([
  {
    segmentationId,
    representation: {
      type: csToolsEnums.SegmentationRepresentations.Labelmap,
      data: {
        imageIdReferenceMap:
          cornerstoneTools.utilities.segmentation.createImageIdReferenceMap(
            imageIds,
            segmentationImageIds
          ),
      },
    },
  },
]);
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```js
// 在这里填写“之后”部分的代码
```

</TabItem>
</Tabs>

---

#### 迁移步骤:

1. 将通用的 `addSegmentationRepresentations` 调用替换为适当的特定表示函数。
2. 更新输入数组以匹配新的 `RepresentationPublicInput` 类型。
3. 从代码中移除任何特定类型的逻辑，因为现在这些逻辑由这些新函数处理。

#### 多视口函数

版本 2 引入了新的函数，用于同时向多个视口添加分割表示。

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
// 版本 1 中没有等效的函数
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```typescript
function addContourRepresentationToViewportMap(viewportInputMap: {
  [viewportId: string]: RepresentationPublicInput[];
});

function addLabelmapRepresentationToViewportMap(viewportInputMap: {
  [viewportId: string]: RepresentationPublicInput[];
});

function addSurfaceRepresentationToViewportMap(viewportInputMap: {
  [viewportId: string]: RepresentationPublicInput[];
});
```

</TabItem>
</Tabs>

**迁移步骤:**

1. 如果您之前向多个工具组添加表示，请重构代码以使用这些新的多视口函数。
2. 创建一个 `viewportInputMap` 对象，将视口 ID 作为键，`RepresentationPublicInput` 数组作为值。
3. 根据表示类型调用适当的多视口函数。

### 事件

由于我们从工具组转向视口，许多事件已被重命名，以包含 `viewportId` 而不是 `toolGroupId`，并且
一些事件详情已更改为包含 `segmentationId` 而不是 `segmentationRepresentationUID` 或 `toolGroupId`。

#### 移除工具组特定事件

`triggerSegmentationRepresentationModified` 和 `triggerSegmentationRepresentationRemoved` 函数已被移除。取而代之的是，库现在使用更通用的方法来处理分割事件。

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
function triggerSegmentationRepresentationModified(
  toolGroupId: string,
  segmentationRepresentationUID?: string
): void {
  // ...
}

function triggerSegmentationRepresentationRemoved(
  toolGroupId: string,
  segmentationRepresentationUID: string
): void {
  // ...
}
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```typescript
function triggerSegmentationRepresentationModified(
  viewportId: string,
  segmentationId: string,
  type?: SegmentationRepresentations
): void {
  // ...
}

function triggerSegmentationRepresentationRemoved(
  viewportId: string,
  segmentationId: string,
  type: SegmentationRepresentations
): void {
  // ...
}
```

</TabItem>
</Tabs>

**迁移步骤:**

1. 在函数调用中将 `toolGroupId` 替换为 `viewportId`。
2. 将 `segmentationRepresentationUID` 替换为 `segmentationId`。
3. 添加 `type` 参数以指定分割表示类型。

#### 简化的分割修改事件

`triggerSegmentationModified` 函数已简化，始终需要一个 `segmentationId`。

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
function triggerSegmentationModified(segmentationId?: string): void {
  // ...
}
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```typescript
function triggerSegmentationModified(segmentationId: string): void {
  // ...
}
```

</TabItem>
</Tabs>

**迁移步骤:**

1. 确保在调用 `triggerSegmentationModified` 时始终提供 `segmentationId`。
2. 移除任何处理 `segmentationId` 未定义情况的逻辑。

#### 更新的事件详情类型

几个事件详情类型已更新，以反映分割系统中的更改：

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
type SegmentationRepresentationModifiedEventDetail = {
  toolGroupId: string;
  segmentationRepresentationUID: string;
};

type SegmentationRepresentationRemovedEventDetail = {
  toolGroupId: string;
  segmentationRepresentationUID: string;
};

type SegmentationRenderedEventDetail = {
  viewportId: string;
  toolGroupId: string;
};
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```typescript
type SegmentationRepresentationModifiedEventDetail = {
  segmentationId: string;
  type: string;
  viewportId: string;
};

type SegmentationRepresentationRemovedEventDetail = {
  segmentationId: string;
  type: string;
  viewportId: string;
};

type SegmentationRenderedEventDetail = {
  viewportId: string;
  segmentationId: string;
  type: string;
};
```

</TabItem>
</Tabs>

---

#### 设置渲染非活动分割

启用或禁用渲染非活动分割的函数已更新。

**之前**

这是分割配置的一部分：

```js
setGlobalConfig({ renderInactiveSegmentations: true });
```

**现在**

使用 `setRenderInactiveSegmentations`：

```js
// 设置是否在视口中渲染非活动分割
setRenderInactiveSegmentations(viewportId, true);

// 获取视口中是否渲染非活动分割
const renderInactive = getRenderInactiveSegmentations(viewportId);
```

#### 重置为全局样式

要将所有分割样式重置为全局样式：

```js
resetToGlobalStyle();
```

#### 示例迁移

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```js
import {
  getGlobalConfig,
  getGlobalRepresentationConfig,
  getToolGroupSpecificConfig,
  setGlobalConfig,
  setGlobalRepresentationConfig,
  setToolGroupSpecificConfig,
  setSegmentSpecificConfig,
  getSegmentSpecificConfig,
  setSegmentationRepresentationSpecificConfig,
  getSegmentationRepresentationSpecificConfig,
} from './segmentationConfig';

// 获取全局分割配置
const globalConfig = getGlobalConfig();

// 设置全局表示配置
setGlobalRepresentationConfig(SegmentationRepresentations.Labelmap, {
  renderOutline: true,
  outlineWidth: 2,
});

// 设置工具组特定配置
setToolGroupSpecificConfig(toolGroupId, {
  representations: {
    LABELMAP: {
      renderOutline: false,
    },
  },
});

// 设置段特定配置
setSegmentSpecificConfig(
  toolGroupId,
  segmentationRepresentationUID,
  segmentIndex,
  {
    LABELMAP: {
      renderFill: false,
    },
  }
);
```

</TabItem>
<TabItem value="After" label="之后 🚀🚀">

```js
import {
  getStyle,
  setStyle,
  setRenderInactiveSegmentations,
  getRenderInactiveSegmentations,
  resetToGlobalStyle,
  hasCustomStyle,
} from '@cornerstonejs/core';

// 获取 Labelmap 表示的全局样式
const labelmapStyle = getStyle({ type: SegmentationRepresentations.Labelmap });

// 设置 Labelmap 表示的全局样式
setStyle(
  { type: SegmentationRepresentations.Labelmap },
  {
    renderOutline: true,
    outlineWidth: 2,
  }
);

// 设置特定视口和分割的样式
setStyle(
  {
    viewportId: 'viewport1',
    segmentationId: 'segmentation1',
    type: SegmentationRepresentations.Labelmap,
  },
  {
    renderOutline: false,
  }
);

// 设置特定段的样式
setStyle(
  {
    segmentationId: 'segmentation1',
    type: SegmentationRepresentations.Labelmap,
    segmentIndex: segmentIndex,
  },
  {
    renderFill: false,
  }
);

// 设置视口的渲染非活动分割
setRenderInactiveSegmentations('viewport1', true);

// 获取视口的渲染非活动分割设置
const renderInactive = getRenderInactiveSegmentations('viewport1');

// 重置所有样式为全局样式
resetToGlobalStyle();
```

</TabItem>
</Tabs>

---

#### 总结

- **统一的样式管理**：新的 `getStyle` 和 `setStyle` 函数提供了一种统一的方式来管理不同层级的分割样式——全局、分割特定、视口特定和段特定。
- **指定器对象**：`specifier` 对象允许您针对特定的视口、分割和段。
  - `type` 是必需的
  - 如果提供了 `segmentationId`，样式将应用于所有视口中该分割的特定表示
  - 如果同时提供了 `segmentationId` 和 `segmentIndex`，样式将应用于特定视口中该分割的特定段
  - 如果提供了 `viewportId`，样式将应用于特定视口中的所有分割
  - 如果同时提供了 `viewportId`、`segmentationId` 和 `segmentIndex`，样式将应用于特定视口中该分割的特定段
- **样式层级**：有效样式由一个层级决定，考虑了全局样式、分割特定样式和视口特定样式。

### Active

#### 基于视口的操作

API 现在使用视口 ID 而不是工具组 ID 来识别分割操作的上下文。

<Tabs>
<TabItem value="Before" label="Before 📦 " default>

```typescript
function getActiveSegmentationRepresentation(toolGroupId: string);

function getActiveSegmentation(toolGroupId: string);

function setActiveSegmentationRepresentation(
  toolGroupId: string,
  segmentationRepresentationUID: string
);
```

</TabItem>
<TabItem value="After" label="After 🚀🚀">

```typescript
function getActiveSegmentation(viewportId: string);

function setActiveSegmentation(
  viewportId: string,
  segmentationId: string,
  suppressEvent: boolean = false
);
```

</TabItem>
</Tabs>

#### 迁移步骤:

1. 将所有函数调用中的 `toolGroupId` 替换为 `viewportId`。
2. 更新 `getActiveSegmentationRepresentation` 和 `getActiveSegmentation` 调用以使用新的 `getActiveSegmentation` 函数。
3. 将 `setActiveSegmentationRepresentation` 调用替换为 `setActiveSegmentation`，并使用新的参数结构。

---

#### 返回类型更改

`getActiveSegmentation` 的返回类型已从隐式的 `undefined` 更改为显式的 `Segmentation` 类型。

<Tabs>
  <TabItem value="Before" label="Before 📦 " default>

```typescript
function getActiveSegmentation(toolGroupId: string);
```

  </TabItem>
  <TabItem value="After" label="After 🚀🚀">

```typescript
function getActiveSegmentation(viewportId: string): Segmentation;
```

  </TabItem>
</Tabs>

#### 迁移步骤:

1. 将所有对 `getActiveSegmentationRepresentation` 的调用替换为 `getActiveSegmentation`。
2. 更新依赖于 `ToolGroupSpecificRepresentation` 类型的任何代码，以改为使用 `Segmentation` 类型。

这些更改旨在简化 API 并使其更直观易用。通过专注于基于视口的操作并消除分割表示和分割之间的区别，新的 API 应该更易于使用，同时保持库的核心功能。

### 可见性

#### 视口中心方法

API 现在专注于视口而不是工具组，反映了库架构的变化。

<Tabs>
  <TabItem value="Before" label="Before 📦 " default>

```typescript
function setSegmentationVisibility(
  toolGroupId: string,
  segmentationRepresentationUID: string,
  visibility: boolean
): void {
  // ...
}
```

  </TabItem>
  <TabItem value="After" label="After 🚀🚀">

```typescript
function setSegmentationRepresentationVisibility(
  viewportId: string,
  specifier: {
    segmentationId: string;
    type?: SegmentationRepresentations;
  },
  visibility: boolean
): void {
  // ...
}
```

  </TabItem>
</Tabs>

**迁移步骤:**

1. 在函数调用中将 `toolGroupId` 替换为 `viewportId`。
2. 使用 `specifier` 对象代替 `segmentationRepresentationUID`。
3. 在 `specifier` 对象中包含 `segmentationId`。
4. 可选地指定分割表示的 `type`。

#### 分割表示类型

版本 2 引入了分割表示类型的概念，允许对不同表示样式进行更细粒度的控制。

<Tabs>
  <TabItem value="Before" label="Before 📦 " default>

```typescript
function getSegmentationVisibility(
  toolGroupId: string,
  segmentationRepresentationUID: string
): boolean | undefined {
  // ...
}
```

  </TabItem>
  <TabItem value="After" label="After 🚀🚀">

```typescript
function getSegmentationRepresentationVisibility(
  viewportId: string,
  specifier: {
    segmentationId: string;
    type: SegmentationRepresentations;
  }
): boolean | undefined {
  // ...
}
```

  </TabItem>
</Tabs>

**迁移步骤:**

1. 将函数名称从 `getSegmentationVisibility` 更新为 `getSegmentationRepresentationVisibility`。
2. 将 `toolGroupId` 替换为 `viewportId`。
3. 使用包含 `segmentationId` 和 `type` 的 `specifier` 对象替代 `segmentationRepresentationUID`。

#### 段级可见性控制

控制单个段可见性的 API 已更新，以符合新的视口中心方法。

<Tabs>
  <TabItem value="Before" label="Before 📦 " default>

```typescript
function setSegmentVisibility(
  toolGroupId: string,
  segmentationRepresentationUID: string,
  segmentIndex: number,
  visibility: boolean
): void {
  // ...
}
```

  </TabItem>
  <TabItem value="After" label="After 🚀🚀">

```typescript
function setSegmentIndexVisibility(
  viewportId: string,
  specifier: {
    segmentationId: string;
    type?: SegmentationRepresentations;
  },
  segmentIndex: number,
  visibility: boolean
): void {
  // ...
}
```

  </TabItem>
</Tabs>

**迁移步骤:**

1. 将函数名称从 `setSegmentVisibility` 更新为 `setSegmentIndexVisibility`。
2. 将 `toolGroupId` 替换为 `viewportId`。
3. 使用包含 `segmentationId` 和可选 `type` 的 `specifier` 对象替代 `segmentationRepresentationUID`。

#### 新的实用函数

版本 2 引入了用于管理分割可见性的新的实用函数。

```typescript
function getHiddenSegmentIndices(
  viewportId: string,
  specifier: {
    segmentationId: string;
    type: SegmentationRepresentations;
  }
): Set<number> {
  // ...
}
```

这个新函数允许您检索特定分割表示的隐藏段索引集合。

#### 移除的函数

以下函数在版本 2 中已被移除：

- `setSegmentsVisibility`
- `getSegmentVisibility`

使用上述新 API 方法替换这些函数的使用。

<details>
<summary>为什么？</summary>

由于可见性应该在表示上设置，并且分割不是可见性的拥有者，一个分割可以在每个视口上有两个具有不同可见性的表示

</details>

### 锁定

#### 检索已锁定的段

检索已锁定段的函数已被重命名并更改了其实现：

<Tabs>
  <TabItem value="Before" label="Before 📦 " default>

```typescript
function getLockedSegments(segmentationId: string): number[] | [];
```

  </TabItem>
  <TabItem value="After" label="After 🚀🚀">

```typescript
function getLockedSegmentIndices(segmentationId: string): number[] | [];
```

  </TabItem>
</Tabs>

**迁移步骤:**

1. 将所有 `getLockedSegments` 的调用更新为 `getLockedSegmentIndices`。
2. 注意实现现在使用 `Object.keys` 和 `filter`，而不是将 Set 转换为数组。

### 颜色

#### 以视口为中心的方法

API 已从基于工具组的方法转变为以视口为中心的方法。此更改影响了多个函数签名以及如何引用分割。

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```typescript
function setColorLUT(
  toolGroupId: string,
  segmentationRepresentationUID: string,
  colorLUTIndex: number
): void {
  // ...
}
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```typescript
function setColorLUT(
  viewportId: string,
  segmentationId: string,
  colorLUTsIndex: number
): void {
  // ...
}
```

  </TabItem>
</Tabs>

**迁移步骤:**

1. 在函数调用中将 `toolGroupId` 替换为 `viewportId`。
2. 将 `segmentationRepresentationUID` 替换为 `segmentationId`。
3. 更新依赖于基于工具组的分割管理的任何代码，以改用基于视口的管理。

#### 颜色 LUT 管理

`addColorLUT` 函数现在返回添加的颜色 LUT 的索引，并具有一个可选的 `colorLUTIndex` 参数。

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```typescript
function addColorLUT(colorLUT: Types.ColorLUT, colorLUTIndex: number): void {
  // ...
}
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```typescript
function addColorLUT(colorLUT: Types.ColorLUT, colorLUTIndex?: number): number {
  // ...
}
```

  </TabItem>
</Tabs>

**迁移步骤:**

1. 更新对 `addColorLUT` 的调用以在需要时处理返回的索引。
2. 在函数调用中使 `colorLUTIndex` 参数变为可选。

#### 分割颜色的检索和设置

用于获取和设置分割颜色的函数已重新命名，并更新了其签名以与新的以视口为中心的方法保持一致。

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```typescript
function getColorForSegmentIndex(
  toolGroupId: string,
  segmentationRepresentationUID: string,
  segmentIndex: number
): Types.Color {
  // ...
}

function setColorForSegmentIndex(
  toolGroupId: string,
  segmentationRepresentationUID: string,
  segmentIndex: number,
  color: Types.Color
): void {
  // ...
}
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```typescript
function getSegmentIndexColor(
  viewportId: string,
  segmentationId: string,
  segmentIndex: number
): Types.Color {
  // ...
}

function setSegmentIndexColor(
  viewportId: string,
  segmentationId: string,
  segmentIndex: number,
  color: Types.Color
): void {
  // ...
}
```

  </TabItem>
</Tabs>

**迁移步骤:**

1. 将 `getColorForSegmentIndex` 重命名为 `getSegmentIndexColor`。
2. 将 `setColorForSegmentIndex` 重命名为 `setSegmentIndexColor`。
3. 更新函数调用以使用 `viewportId` 代替 `toolGroupId`。
4. 在函数调用中将 `segmentationRepresentationUID` 替换为 `segmentationId`。

### 其他更改

#### 重命名

```js
getSegmentAtWorldPoint-- > getSegmentIndexAtWorldPoint;
getSegmentAtLabelmapBorder-- > getSegmentIndexAtLabelmapBorder;
```

#### getToolGroupIdsWithSegmentation

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```typescript
function getToolGroupIdsWithSegmentation(segmentationId: string): string[];
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```typescript
function getViewportIdsWithSegmentation(segmentationId: string): string[];
```

  </TabItem>
</Tabs>

**迁移步骤:**

1. 将 `getToolGroupIdsWithSegmentation` 替换为 `getViewportIdsWithSegmentation`。

#### 分割表示管理

添加、检索和移除分割表示的方式发生了重大变化。

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```typescript
function addSegmentationRepresentation(
  toolGroupId: string,
  segmentationRepresentation: ToolGroupSpecificRepresentation,
  suppressEvents?: boolean
): void;

function getSegmentationRepresentationByUID(
  toolGroupId: string,
  segmentationRepresentationUID: string
): ToolGroupSpecificRepresentation | undefined;

function removeSegmentationRepresentation(
  toolGroupId: string,
  segmentationRepresentationUID: string
): void;
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```typescript
function addSegmentationRepresentation(
  viewportId: string,
  segmentationRepresentation: SegmentationRepresentation,
  suppressEvents?: boolean
): void;

function getSegmentationRepresentation(
  viewportId: string,
  specifier: {
    segmentationId: string;
    type: SegmentationRepresentations;
  }
): SegmentationRepresentation | undefined;

function removeSegmentationRepresentation(
  viewportId: string,
  specifier: {
    segmentationId: string;
    type: SegmentationRepresentations;
  },
  immediate?: boolean
): void;
```

  </TabItem>
</Tabs>

**迁移步骤:**

1. 将所有 `addSegmentationRepresentation` 的调用更新为使用 `viewportId` 代替 `toolGroupId`。
2. 使用新的指定对象，将 `getSegmentationRepresentationByUID` 替换为 `getSegmentationRepresentation`。
3. 更新 `removeSegmentationRepresentation` 的调用，使用新的指定对象代替 `segmentationRepresentationUID`。

### PolySEG

#### 导入

PolySEG 已被拆分并放置在一个单独的外部包中。要使用它，请将 `peerImport` 函数添加到 Cornerstone Core 的 `init` 函数中。

```js
async function peerImport(moduleId) {
  if (moduleId === '@icr/polyseg-wasm') {
    return import('@icr/polyseg-wasm');
  }
}

import { init } from '@cornerstonejs/core';

await init({ peerImport });
```

#### 选项

您无需为分割表示提供 polyseg 选项。如果指定的表示不可用，它将自动使用 PolySeg。

<Tabs>
  <TabItem value="Before" label="之前 📦 " default>

```js
await segmentation.addSegmentationRepresentations(toolGroupId2, [
  {
    segmentationId,
    type: csToolsEnums.SegmentationRepresentations.Labelmap,
    options: {
      polySeg: {
        enabled: true,
      },
    },
  },
]);
```

  </TabItem>
  <TabItem value="After" label="之后 🚀🚀">

```js
await segmentation.addSegmentationRepresentations(viewportId2, [
  {
    segmentationId,
    type: csToolsEnums.SegmentationRepresentations.Labelmap,
  },
]);
```

  </TabItem>
</Tabs>

#### 标签图的 Actor UID

生成 `actorUID` 的方式已更改，现使用 `segmentationId` 和 `SegmentationRepresentations.Labelmap` 的组合。

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```js
const volumeInputs: Types.IVolumeInput[] = [
  {
    volumeId: labelMapData.volumeId,
    actorUID: segmentationRepresentationUID,
    visibility,
    blendMode: Enums.BlendModes.MAXIMUM_INTENSITY_BLEND,
  },
];
```

</TabItem>
<TabItem value="After" label="之后 🚀">

```js
const volumeInputs: Types.IVolumeInput[] = [
  {
    volumeId,
    actorUID: `${segmentationId}-${SegmentationRepresentations.Labelmap}`,
    visibility,
    blendMode: Enums.BlendModes.MAXIMUM_INTENSITY_BLEND,
  },
];
```

</TabItem>
</Tabs>

我们已将 `actorUID` 更新为 `${segmentationId}-${SegmentationRepresentations.Labelmap}`。此更改使我们能够在不依赖 `segmentationRepresentationUID` 的情况下唯一标识表示。

因此，添加了 `getSegmentationActor` 供您获取给定标签图的 actor。

```ts
export function getSegmentationActor(
  viewportId: string,
  specifier: {
    segmentationId: string;
    type: SegmentationRepresentations;
  }
): Types.VolumeActor | Types.ImageActor | undefined;
```

### 新的实用工具

添加了 `clearSegmentValue` 来清除分割中的特定段值，它将使段值为 0。

```js
 function clearSegmentValue(
  segmentationId: string,
  segmentIndex: number
)
```

## 重命名和命名法

### 类型

PointsManager 现为 IPointsManager

迁移

```js
import { IPointsManager } from '@cornerstonejs/tools/types';
```

### 单位

#### getCalibratedLengthUnitsAndScale 签名

您直接使用此函数的可能性极小，但如果使用了，以下是迁移步骤。函数的返回类型略有更改，`units` 和 `areaUnits` 分别重命名为 `unit` 和 `areaUnit`。

<Tabs>
<TabItem value="Before" label="之前 📦 " default>

```typescript
const getCalibratedLengthUnitsAndScale = (image, handles) => {
  // ...
  return { units, areaUnits, scale };
};
```

</TabItem>
<TabItem value="After" label="之后 🚀">

```typescript
const getCalibratedLengthUnitsAndScale = (image, handles) => {
  // ...
  return { unit, areaUnit, scale };
};
```

</TabItem>
</Tabs>

#### getModalityUnit -> getPixelValueUnits

为了更合理

<details>
<summary>为什么？</summary>
库中使用的单位过于不一致。我们有 `unit`、`areaUnits`、`modalityUnit` 以及其他各种单位。现在，我们已经整合了这些单位。如果您正在为 Cornerstone3D 注释提供数据，则需要更新您的代码库以反映新的单位系统。

此外，`modalityUnit` 现为 `pixelValueUnits` 以反映正确的术语，因为对于单一模态，可以有多个像素值（例如，PT SUV、PT RAW、PT PROC）。
</details>

### BasicStatsCalculator

选项 `noPointsCollection` 已重命名为 `storePointData`

### getSegmentAtWorldPoint -> getSegmentIndexAtWorldPoint

### getSegmentAtLabelmapBorder -> getSegmentIndexAtLabelmapBorder

---

## 其他

### roundNumber

该实用工具已从 `@cornerstonejs/tools` 实用工具迁移到 `@cornerstonejs/core/utilities`。

迁移

```js
import { roundNumber } from '@cornerstonejs/core/utilities';
```

### jumpToSlice

该实用工具已从 `@cornerstonejs/tools` 实用工具迁移到 `@cornerstonejs/core/utilities`。

迁移

```js
import { jumpToSlice } from '@cornerstonejs/core/utilities';
```

### pointInShapeCallback

### 1. 新的导入路径

`pointInShapeCallback` 函数已被移动。请按以下方式更新您的导入：

```js
import { pointInShapeCallback } from '@cornerstonejs/core/utilities';
```

### 2. 更新后的使用方法

函数签名已更改，使用选项对象以提高清晰度和灵活性。以下是使用方法变化的指南。

**旧的使用方法：**

```js
const pointsInShape = pointInShapeCallback(
  imageData,
  shapeFnCriteria,
  (point) => {
    // 每个点的回调逻辑
  },
  boundsIJK
);
```

**新的使用方法：**

```js
const pointsInShape = pointInShapeCallback(imageData, {
  pointInShapeFn: shapeFnCriteria,
  callback: (point) => {
    // 每个点的回调逻辑
  },
  boundsIJK: boundsIJK,
  returnPoints: true, // 可选，返回形状内的点
});
```

### 关键变化：

- **选项对象**：配置参数如 `pointInShapeFn`、`callback`、`boundsIJK` 和 `returnPoints` 现在通过选项对象传递。
- **返回点**：使用 `returnPoints` 选项来指定是否返回形状内的点，之前它总是返回点。如果您依赖于直接返回点，请确保在激活工具时在工具选项中包含 `storePointData: true`
