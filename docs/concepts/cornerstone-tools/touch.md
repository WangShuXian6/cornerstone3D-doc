---

id: touchEvents  
title: 触摸事件

---

# 触摸事件

触摸事件在用户用一个或多个触摸点（如手指或触控笔）触摸设备时触发。触摸点的流转如下：

1. `TOUCH_START`
2. `TOUCH_START_ACTIVATE`
3. 可选: `TOUCH_PRESS`
4. 可选: `TOUCH_DRAG`
5. `TOUCH_END`

每次用户放下手指并抬起时，触摸事件的顺序流程将始终遵循上述顺序。触摸事件与点击事件不是互斥的。

其他可以独立发生的触摸事件有 `TOUCH_TAP` 事件和 `TOUCH_SWIPE` 事件。`TOUCH_TAP` 会触发 `TOUCH_START` -> `TOUCH_END` 的事件流程。如果用户连续点击，则仅会触发一次 `TOUCH_TAP` 事件，并记录用户点击的次数。`TOUCH_SWIPE` 事件发生在用户在单次拖动周期内，手指在画布上移动超过 `48px` 时。此外，`TOUCH_SWIPE` 仅在触摸屏幕后的 `200ms` 内发生移动时才会激活。如果用户进行对角线滑动，`LEFT`/`RIGHT` 和 `UP`/`DOWN` 滑动都会触发。

| 事件                        | 描述                                                                                   |
| ------------------------- | -------------------------------------------------------------------------------------- |
| `TOUCH_START`              | 当用户放下触摸点时触发。                                                                 |
| `TOUCH_START_ACTIVATE`     | 仅当没有工具阻止 `TOUCH_START` 事件的传播时触发。用于区分触摸到现有注释与需要创建新注释。 |
| `TOUCH_PRESS`              | 当用户放下触摸点并在超过 700 毫秒内未移动时触发。                                          |
| `TOUCH_DRAG`               | 当用户移动触摸点时触发，可能会在 `TOUCH_PRESS` 之前发生，因为 `TOUCH_PRESS` 事件允许一些移动。 |
| `TOUCH_END`                | 当用户抬起一个或多个触摸点时触发。                                                        |
| `TOUCH_TAP`                | 当用户接触屏幕少于 `300ms` 且从 `TOUCH_START` 起移动不超过画布的 `48px` 时触发。           |
| `TOUCH_SWIPE`              | 当用户在单次拖动周期内移动超过 `48px` 且触摸屏幕后的 `200ms` 内触发时。                   |

## 多点触控

触摸事件本身支持多点触控，提供为 [`ITouchPoints[]`](api/tools/namespace/Types#ITouchPoints) 的列表。为了使触摸事件与鼠标事件兼容，这些 `ITouchPoints[]` 需要合并为一个单一的 `ITouchPoint`。当前的数组合并策略是取坐标值的平均值。也可以实现其他策略，例如取第一个点、中位点等。这些可以在 [`touch` 工具代码库](https://github.com/cornerstonejs/cornerstone3D/main/packages/tools/src/utilities/touch/index.ts) 中实现。

`ITouchPoints` 的结构如下：

```js
type ITouchPoints = {
  /** 页面坐标 */
  page: Types.Point2,
  /** 客户端坐标 */
  client: Types.Point2,
  /** 画布坐标 */
  canvas: Types.Point2,
  /** 世界坐标 */
  world: Types.Point3,

  /** 原生 Touch 对象属性（可序列化为 JSON） */
  touch: {
    identifier: string,
    radiusX: number,
    radiusY: number,
    force: number,
    rotationAngle: number,
  },
};
```

## 多点触控拖动计算

`TOUCH_DRAG` 事件具有以下结构：

```js
type TouchDragEventDetail = NormalizedTouchEventDetail & {
  /** 触摸事件的起始点。 */
  startPoints: ITouchPoints,
  /** 触摸的最后位置。 */
  lastPoints: ITouchPoints,
  /** 当前触摸位置。 */
  currentPoints: ITouchPoints,
  startPointsList: ITouchPoints[],
  /** 触摸的最后位置。 */
  lastPointsList: ITouchPoints[],
  /** 当前触摸位置。 */
  currentPointsList: ITouchPoints[],

  /** 当前与上一个点之间的差值。 */
  deltaPoints: IPoints,
  /** 当前与上一个点之间的距离差。 */
  deltaDistance: IDistance,
};
```

`deltaPoints` 是 `lastPointsList` 和 `currentPointsList` 坐标点的平均值之间的差值。  
`deltaDistance` 是 `lastPointsList` 和 `currentPointsList` 中点之间的平均距离差。

## 使用

可以为元素添加事件监听器。

```js
import Events from '@cornerstonejs/tools/enums/Events';
// element 是 Cornerstone 视口元素
element.addEventListener(Events.TOUCH_DRAG, (evt) => {
  // 拖动时的函数
  console.log(evt);
});

element.addEventListener(Events.TOUCH_SWIPE, (evt) => {
  // 滑动时的函数
  console.log(evt);
});

// 在已部署的 OHIF 应用的 Chrome 控制台中
cornerstone
  .getEnabledElements()[0]
  .viewport.element.addEventListener(Events.TOUCH_SWIPE, (evt) => {
    // 滑动时的函数
    console.log('SWIPE', evt);
  });
```

一个完整的示例可以通过运行 `yarn run example stackManipulationToolsTouch` 来找到，源代码 [在这里](https://github.com/gradienthealth/cornerstone3D/blob/gradienthealth/added_touch_events/packages/tools/examples/stackManipulationToolsTouch/index.ts)。

## 绑定

触摸工具的绑定取决于放下的触摸点数量。未来，绑定可以根据力或半径（如触控笔检测）进行过滤。`numTouchPoints` 可以是硬件支持的任意数量。

```js
// 将工具添加到 Cornerstone3D
cornerstoneTools.addTool(PanTool);
cornerstoneTools.addTool(WindowLevelTool);
cornerstoneTools.addTool(StackScrollTool);
cornerstoneTools.addTool(ZoomTool);

// 定义一个工具组，工具组定义了如何将鼠标事件映射到工具命令
// 适用于任何使用该组的视口
const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);

// 将工具添加到工具组
toolGroup.addTool(WindowLevelTool.toolName);
toolGroup.addTool(PanTool.toolName);
toolGroup.addTool(ZoomTool.toolName);
toolGroup.addTool(StackScrollTool.toolName);

// 设置工具的初始状态，这里所有工具都被激活并绑定到不同的触摸输入
// 支持最多 5 个触摸点 => 支持无限的触摸点，但通常受硬件限制。
toolGroup.setToolActive(ZoomTool.toolName, {
  bindings: [{ numTouchPoints: 2 }],
});
toolGroup.setToolActive(StackScrollTool.toolName, {
  bindings: [{ numTouchPoints: 3 }],
});
toolGroup.setToolActive(WindowLevelTool.toolName, {
  bindings: [
    {
      mouseButton: MouseBindings.Primary, // 单指触摸的特殊条件
    },
  ],
});
```

`MouseBindings.Primary` 是一种特殊的绑定类型，它将自动绑定单指触摸。

## 触摸和鼠标事件类比

触摸事件和鼠标事件有很多重叠的继承关系。大多数触摸事件都有对应的鼠标事件。请看下面的对比表：

| 触摸事件                  | 鼠标事件                 |
| --------------------- | --------------------- |
| `TOUCH_START`          | `MOUSE_DOWN`          |
| `TOUCH_START_ACTIVATE` | `MOUSE_DOWN_ACTIVATE` |
| `TOUCH_PRESS`          | N/A                   |
| `TOUCH_DRAG`           | `MOUSE_DRAG`          |
| `TOUCH_SWIPE`          | N/A                   |
| `TOUCH_END`            | `MOUSE_UP`            |
| `TOUCH_TAP`            | `MOUSE_CLICK`         |

触摸事件与鼠标事件的主要区别在于，触摸事件可以具有多个触摸点（多点触控）。触摸事件会自动将多个触摸点减少为一个单一的点值。默认情况下，这些点会通过加权平均的方式减少。这个减少后的点可以作为 `IPoints` 或 `ITouchPoints` 使用，具体取决于是否需要触摸信息。

如果需要多个触摸点，它们可以以列表的形式访问。

```js
type MousePointsDetail = {
  /** 鼠标事件的起始点。 */
  startPoints: IPoints,
  /** 鼠标的最后位置。 */
  lastPoints: IPoints,
  /** 当前鼠标位置。 */
  currentPoints: IPoints,
  /** 当前与上一个点之间的差值。 */
  deltaPoints: IPoints,
};

type TouchPointsDetail = {
  /** 触摸事件的起始点。 */
 

 startPoints: ITouchPoints,
  /** 触摸的最后位置。 */
  lastPoints: ITouchPoints,
  /** 当前触摸位置。 */
  currentPoints: ITouchPoints,
  /** 当前与上一个点之间的差值。 */
  deltaPoints: ITouchPoints,
};
```