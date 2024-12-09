---
id: viewportReferencePresentation
title: 视口图像选择参考与展示
sidebar_position: 14
---
# 视口图像选择参考与展示

视口的参考和展示信息指定了视口正在显示的图像，以及图像的展示方式。通过几种方式可以指定这些信息，以便将视图从一个视口转移到另一个视口，或者记住视图以便以后恢复。可以获取当前图像的参考，或堆栈中的特定图像，这些图像按照滚动位置的编号/排序方式进行编号/排序。

一些特定的使用场景包括：

- 为工具引用特定的图像
  - 使用 `ViewReference` 来指定要应用的图像
  - 使用 `isReferenceCompatible` 来判断工具是否应该显示
  - 使用 `isReferenceCompatible` 来确定一组视口中哪一个最适合导航到图像
  - 使用 `setViewReference(viewRef)` 来导航到指定的图像
- 恢复早期视图或从堆栈转换为体积视图，反之亦然
  - 使用 `ViewReference` 和 `ViewPresentation` 来存储图像信息
- 对图像集应用插值
  - 使用 `getViewReference` 获取特定图像位置的引用，获取中间图像或与附近注释相关的图像进行插值
- 调整大小并同步显示展示
  - 使用 `getViewPresentation` 获取旧的展示信息，然后使用 `setViewPresentation(viewPres)` 恢复

## 视图参考

视图参考指定了视图包含的图像，通常通过引用图像的 ID 来标识，以及与参考框架/焦点相关的信息。具体来说，这允许在不同排序方式、堆栈图像 ID 或体积图像之间正确关联包含相同图像或相同参考框架的视口。

视图参考的一个非常重要的用例是作为注释的元数据基础，其中注释元数据指定它应用于哪个图像。在这种情况下，视图参考被用来确定一个图像是否适用于给定的视图，以及确定一个视口是否可以导航到显示给定的注释，无论是否需要导航和/或方向变化。然后，为了导航到给定的参考，调用 `viewport.setViewReference` 来应用给定的导航。这适用于正射投影视口和堆栈视口。

`ViewReference` 包含若干字段来确定视图，其中重要的是堆栈视图的 `referencedImageId`，以及体积视图中的 `volumeId` 和 `cameraFocalPoint, viewPlaneNormal, FrameOfReferenceUID`。如果可能，堆栈和体积视口都会填充这两组信息，以便使视图适用于任意一种图像类型。

### referencedImageId

`referencedImageId` 允许指定非参考框架的堆栈类型图像。通常这是一个单独的图像，可以由堆栈视口用来导航到特定图像。当获取一个单一的获取方向图像的参考时，正射投影视口会提供此值，以便使这些视图引用与堆栈视口兼容。

#### `referencedImageId` 和 `sliceIndex`

堆栈视口使用 `sliceIndex` 和 `referencedImageId` 组合来快速猜测给定 `referencedImageId` 的 `imageIdIndex` 值。如果给定的 `referencedImageId` 与 `sliceIndex` 处的图像相同，则可以直接使用 `sliceIndex`，否则需要找到 `imageIdIndex`。`sliceIndex` 不是必需的。

对于视频视口，`referencedImageId` 将是视频图像 ID，而 `sliceIndex` 可以是单帧，也可以是一个帧范围数组。

### 参考框架、焦点和法线

参考框架和焦点/法线值可以由正射投影视口用来指定除获取平面视图以外的其他视图。这些值在堆栈视口中可用时提供，并且可以被体积视口使用。

目前，应用于体积视口时需要这三者，尽管将来可能会有其他方式指定视图，而不需要提供法线。

### `volumeId`、`sliceIndex` 和 `viewPlaneNormal`

当正射投影视口创建视图参考时，它会包含 `volumeId`、`sliceIndex` 和 `viewPlaneNormal`。这可以快速识别视口是否显示给定的参考，并快速导航到给定的视图。主要用于 `isReferenceCompatible`，该函数可以在正射投影视图中多次调用，以确定注释工具视图。

注意，堆栈视口不会提供 `volumeId`，因此此优化不能用于这些参考。

这些值在导航时不是必需的，但在注释显示检测时需要这些值，以检测视图的适用性。

### 堆栈视口引用

堆栈视口创建的引用包含：

- `referencedImageId` 和 `sliceIndex`
- 参考框架、焦点和法线（如果有）

它可以为当前显示的图像以及通过切片索引引用的图像创建这些引用，其中切片索引是图像 ID 的索引。

_警告_：不要假设体积的切片索引与堆栈的切片索引有任何关联，或者两个堆栈显示相同图像时使用相应的切片索引，或者帧号与切片索引之间有任何关联。

堆栈视口只能导航到包含 `referencedImageId` 的视图参考，它将无法（由于缺少信息）基于体积/相机等发现适当的图像。

堆栈视口的 `isReferenceCompatible` 还将使用切片索引进行快速检查，检查图像是否在给定位置找到，但并不依赖于切片索引，只是这样更快。

### 体积视口引用

体积视口创建的引用包含：

- 适合获取视图的 `referencedImageId`
- 参考框架、焦点和法线

此外，正射投影视口还会添加：

- 焦点视图的 `volumeId` 和 `sliceIndex`。

正射投影视口首先使用任何体积 ID、切片索引和法线来确定参考是否适用或导航到它。然后，两个体积视口都会应用参考框架/焦点/法线。

将来可能会添加特定的附加行为，用于检测 1D 和 2D 点（以便允许线条和点出现在原始视图之外）。

## 视图展示

视图展示指定了视口的平移、缩放和 VOI 信息。平移和缩放以相对于视口大小和原始显示区域的百分比值指定（如果已指定）。这允许将相同的视图展示应用于多种视口大小，这些视口可能会显示相同的图像实例，也可能不会。

VOI 是相对于图像数据中指定的基本 LUT 的。这意味着，它不包括模态和展示 LUT 转换。目前只指定了窗宽/窗位，尽管将来可能允许完整的查找表。

视图展示的一些典型用例包括：

- 记住图像的展示方式，以便稍后可以显示相同的展示，例如，当视口用于显示另一个堆栈并且随后返回到原始堆栈时。
- 同步相似但不完全相同的视口，例如，在不同的 CT 视图之间同步一些或全部展示属性。
- 调整视口大小，用于记住相对位置，以便图像保持在相同的“相对”位置。

## `setViewReference` 和 `setViewPresentation`

`viewport.setViewReference` 和 `viewport.setViewPresentation` 导航到指定的参考并应用给定的展示。如果两者都要应用，则必须首先应用视图参考。完成视图更改后，需要进行渲染，因为视图的多个部分可能会受到影响。

以下是一些不同用例的示例代码。假设 `viewports` 是一个包含不同类型视口的数组，`viewport` 是要应用更改的特定视口。参考和展示分别位于 `viewRef` 和 `viewPres` 中。

### 导航到给定的注释

```javascript
const { metadata } = annotation;
if (viewport.isReferenceCompatible({ withNavigation: true })) {
  viewport.setViewReference(metadata);
} else {
  // 抛出错误，指示视图不兼容或其他行为
  // 比如切换到体积视图或显示不同的图像 ID 等
}
```

### 查找最适合显示注释的视口

```javascript
function findViewportForAnnotation(annotation, viewports) {
  const { metadata } = annotation;

  // 如果已有视口正在显示该图像，则直接返回它
  const alreadyDisplayingViewport = viewports.find((viewport) =>
    viewport.isReferenceCompatible(metadata)
  );
  if (alreadyDisplayingViewport) return alreadyDisplayingViewport;

  // 如果有一个视口只需要导航，则返回它
 

 const referenceCompatibleViewport = viewports.find((viewport) =>
    viewport.isReferenceCompatible(metadata)
  );

  if (referenceCompatibleViewport) {
    referenceCompatibleViewport.setViewReference(metadata);
    return referenceCompatibleViewport;
  }

  // 如果没有合适的视口，则执行其他逻辑，如创建新视口等
  return null;
}
```