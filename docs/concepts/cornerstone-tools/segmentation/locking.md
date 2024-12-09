---

id: locking  
title: 分割锁定  
sidebar_position: 4
---

# 分割锁定  

![](../../../assets/segment-locking.png)  

您可以锁定分割中的特定片段，以防止它们被任何工具修改。  

例如，考虑下图中覆盖的标签图：  
- 左图：显示 `segment index 1`  
- 中图：显示 `segment index 2` 被绘制在 `segment index 1` 上的结果  
- 右图：显示当 `segment index 1` 被锁定时，`segment index 2` 被绘制在 `segment index 1` 上的结果  

如锁定场景（右图）所示，当 `segment index 1` 被锁定时，它无法通过新的绘图进行修改。  

![segment-locking-example]  

## API  

锁定 API 在版本 2.x 中进行了更新，提供了更清晰的方法名称和功能：  

```js  
import { segmentation } from '@cornerstonejs/tools';  

// 锁定/解锁分割中的片段索引  
segmentation.locking.setSegmentIndexLocked(  
  segmentationId,  
  segmentIndex,  
  locked  
);  

// 获取分割中所有已锁定的片段索引  
const lockedIndices = segmentation.locking.getLockedSegmentIndices(segmentationId);  

// 检查片段索引是否已锁定  
const isLocked = segmentation.locking.isSegmentIndexLocked(  
  segmentationId,  
  segmentIndex  
);  
```  

### 示例用法  

```js  
// 锁定分割中的片段 1  
segmentation.locking.setSegmentIndexLocked('segmentation1', 1, true);  

// 检查片段 1 是否已锁定  
const isLocked = segmentation.locking.isSegmentIndexLocked('segmentation1', 1);  
console.log(`Segment 1 is ${isLocked ? 'locked' : 'unlocked'}`);  

// 获取所有已锁定的片段  
const lockedIndices = segmentation.locking.getLockedSegmentIndices('segmentation1');  
console.log('Locked segment indices:', lockedIndices);  

// 解锁分割中的片段 1  
segmentation.locking.setSegmentIndexLocked('segmentation1', 1, false);  
```  

### 版本 2.x 中的关键变化  

1. 将 `getLockedSegments` 重命名为 `getLockedSegmentIndices` 以提高清晰度  
2. 锁定状态现在存储在片段数据结构中：  
```js  
{  
  segments: {  
    [segmentIndex]: {  
      locked: boolean,  
      // 其他片段属性...  
    }  
  }  
}  
```  

请注意，锁定状态适用于整个分割，而不是特定的表示或视口。如果一个片段被锁定，它将在所有视口和表示中保持锁定状态。  