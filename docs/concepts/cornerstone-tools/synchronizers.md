---  
id: synchronizers  
title: 同步器  
sidebar_position: 4
---  

# 同步器  

同步器可以用来链接视口之间的特定操作（例如同步平移/缩放交互），但它们也可以用来将任何回调绑定到特定事件。同步器需要：  

- 一个 [`Event`](/api/core/namespace/Enums#Events) 来监听  
- 当该事件在源视口上触发时要调用的函数  
- 一个 `source` 视口的数组  
- 一个 `target` 视口的数组  

提供的函数接收事件、源视口和目标视口，并通常用于检查源视口上的“某个值”。然后，函数更新目标视口，通常使用核心库公开的 API，使其匹配该状态/值。  

## 使用方法  

`SynchronizerManager` 提供的 API 类似于 `ToolGroupManager`。创建的同步器具有 `addTarget`、`addSource`、`add`（将视口作为“源”和“目标”添加）以及等效的 `remove*` 方法。  

如果视口被禁用，同步器将自动移除源/目标。同步器还公开了一个 `disabled` 标志，可用于暂时禁止同步。  

```js  
import { Enums } from '@cornerstonejs/core';  
import { SynchronizerManager } from '@cornerstonejs/tools';  

const cameraPositionSynchronizer = SynchronizerManager.createSynchronizer(  
  'synchronizerName',  
  Enums.Events.CAMERA_MODIFIED,  
  (  
    synchronizerInstance,  
    sourceViewport,  
    targetViewport,  
    cameraModifiedEvent  
  ) => {  
    // 同步逻辑应放在这里  
  }  
);  

// 添加需要同步的视口  
const firstViewport = { renderingEngineId, viewportId };  
const secondViewport = {  
  /* */  
};  

sync.addSource(firstViewport);  
sync.addTarget(secondViewport);  
```  

### 内置同步器  

目前我们已经实现了两个可以立即使用的同步器，  

#### 位置同步器  

它同步视口之间的相机属性，包括缩放、平移和滚动。  

```js  
const ctAxial = {  
  viewportId: VIEWPORT_IDS.CT.AXIAL,  
  type: ViewportType.ORTHOGRAPHIC,  
  element,  
  defaultOptions: {  
    orientation: Enums.OrientationAxis.AXIAL,  
  },  
};  

const ptAxial = {  
  viewportId: VIEWPORT_IDS.PT.AXIAL,  
  type: ViewportType.ORTHOGRAPHIC,  
  element,  
  defaultOptions: {  
    orientation: Enums.OrientationAxis.AXIAL,  
    background: [1, 1, 1],  
  },  
};  

const axialSync = createCameraPositionSynchronizer('axialSync')[  
  (ctAxial, ptAxial)  
].forEach((vp) => {  
  const { renderingEngineId, viewportId } = vp;  
  axialSync.add({ renderingEngineId, viewportId });  
});  
```  

内部，源视口上的相机修改事件触发时，`cameraSyncCallback` 会运行以同步所有目标视口。  

#### VOI同步器  

它同步视口之间的VOI。例如，在PET/CT的3x3布局中，如果CT图像对比度发生变化，我们希望融合视口也能反映该变化。  

```js  
const ctWLSync = createVOISynchronizer('ctWLSync');  

ctViewports.forEach((viewport) => {  
  const { renderingEngineId, viewportId } = viewport;  
  ctWLSync.addSource({ renderingEngineId, viewportId });  
});  

fusionViewports.forEach((viewport) => {  
  const { renderingEngineId, viewportId } = viewport;  
  ctWLSync.addTarget({ renderingEngineId, viewportId });  
});  
```  

内部，`voiSyncCallback` 在 `VOI_MODIFIED` 事件后运行。