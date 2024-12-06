---

id: voxelManager
title: 体素管理器
---

# 体素管理器文档

体素管理器是 Cornerstone 库新架构中用于处理体素数据和卷管理的关键组件。这个更新的设计简化了数据流并增强了性能，提供了图像缓存和数据访问的单一真实来源，重点是减少内存使用并提高处理大型图像数据集的性能。

## 概述

通过集成体素管理器，体素数据处理从依赖大型标量数组转变为使用单独的图像和针对性的体素数据访问方法。体素管理器作为与体素数据交互的工具和函数的适配器，提供了高效的访问、修改和流式传输体素信息的方法。

### 关键特性

- **单一真实来源**：仅使用图像缓存，消除了对单独卷缓存的需求，减少了同步问题。
- **高效的卷流式传输**：逐张加载图像，仅缓存必要的内容，并将数据直接流式传输到 GPU。
- **优化的缓存**：数据以其原生格式存储，仅在需要时转换，最小化内存和处理开销。
- **简化的 Web Worker 实现**：移除了 `SharedArrayBuffer` 依赖，简化了安全性和 Worker 需求。

## 体素管理器 API

体素管理器 API 用提供精确控制体素数据的方法替换了直接的标量数据访问，而无需生成大型数据数组。以下是主要方法和使用模式：

### 访问体素数据

- **`getScalarData()`**：返回单个图像的标量数据数组（仅适用于 `IImage`）。
- **`getScalarDataLength()`**：提供总的体素数量，替代 `scalarData.length`。
- **`getAtIndex(index)`**：检索特定线性索引处的体素值。
- **`setAtIndex(index, value)`**：设置特定线性索引处的体素值。
- **`getAtIJK(i, j, k)`**：获取 IJK 坐标处的体素值。
- **`setAtIJK(i, j, k, value)`**：设置 IJK 坐标处的体素值。
- **`getArrayOfModifiedSlices()`**：列出已修改的切片索引。

### 数据操作

- **`forEach(callback, options)`**：通过回调函数迭代体素以处理或修改数据。
- **`toIndex(ijk)`**：将 IJK 坐标转换为线性索引。
- **`toIJK(index)`**：将线性索引转换回 IJK 坐标。

### 卷信息

- **`getConstructor()`**：返回标量数据类型的构造函数。
- **`getBoundsIJK()`**：获取 IJK 坐标系中的卷边界。

### 专用方法

- **`setTimePoint(timePoint)`**：对于 4D 数据集，设置当前时间点。
- **`getAtIndexAndTimePoint(index, timePoint)`**：检索指定索引和时间点处的体素值。

### 示例：迁移数据访问和操作

不直接访问 `scalarData`，而是使用体素管理器进行数据操作。以下是迁移示例：

#### 之前

```javascript
function processVolume(volume) {
  const scalarData = volume.getScalarData();
  for (let i = 0; i < scalarData.length; i++) {
    if (scalarData[i] > 100) {
      scalarData[i] = 100;
    }
  }
}
```

#### 之后

```javascript
function processVolume(volume) {
  const voxelManager = volume.voxelManager;
  const length = voxelManager.getScalarDataLength();
  for (let i = 0; i < length; i++) {
    const value = voxelManager.getAtIndex(i);
    if (value > 100) {
      voxelManager.setAtIndex(i, 100);
    }
  }
}
```

## 处理图像卷构建

在创建卷时，不再需要 `scalarData`。相反，内部使用 `VoxelManager`：

#### 之前

```typescript
const streamingImageVolume = new StreamingImageVolume({
  volumeId,
  metadata,
  dimensions,
  spacing,
  origin,
  direction,
  scalarData,
  sizeInBytes,
  imageIds,
});
```

#### 之后

```typescript
const streamingImageVolume = new StreamingImageVolume({
  volumeId,
  metadata,
  dimensions,
  spacing,
  origin,
  direction,
  imageIds,
  dataType,
  numberOfComponents,
});
```

## 最佳实践

- **数据访问优化**：由于效率高，使用 `getAtIndex` 和 `setAtIndex` 进行批量操作。对于大体积迭代，使用 `forEach`。
- **内存管理**：避免使用 `getCompleteScalarDataArray()`，因为它会重建大型数据数组并可能降低性能。
- **处理 RGB 数据**：`getAtIndex` 和 `getAtIJK` 返回 RGB 卷的 `[r, g, b]` 数组。

## 结论

体素管理器是 Cornerstone 新的卷管理策略的核心，提供了一个灵活、高效的体素数据访问和操作 API。这种迁移到体素管理器允许更高效的内存使用、更快的性能和与大型数据集的更好兼容性，确保开发人员在处理复杂医疗成像数据时拥有更流畅的工作流程。