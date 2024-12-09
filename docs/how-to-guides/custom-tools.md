---
title: 自定义工具
sidebar_position: 4
---

# 自定义工具

Cornerstone 工具是任何实现或扩展由 `BaseTool` 或 `AnnotationTool` 抽象类定义的接口的类。创建一个自定义工具就像以下简单的步骤：

```js
import csTools3d, { AnnotationTool, BaseTool } from '@Tools`

class MyCustomTool extends BaseTool {
  // ...
}

csTools3d.addTool(MyCustomTool, { /* Tool Options */ })
```

## BaseTool

基础工具具有名称、配置、选项、策略、绑定等。基础工具通常用于响应用户输入并对视口产生某些变化（例如其摄像机）。示例 `BaseTool` 包括：

- 平移
- PET 阈值
- 堆栈滚动
- 鼠标滚轮堆栈滚动
- 窗口级别
- 缩放

## AnnotationTool

注释工具通常具有与参考帧绑定的“注释”。它具有额外的方法，允许工具指示它们应处理/捕获交互。这通常用于“靠近句柄的交互”或“靠近渲染的工具线的交互”。

处于 `Active` 模式的注释工具具有 `addNewAnnotation` 方法，当鼠标事件未被捕获时调用。这允许活动工具为交互创建注释。示例 `AnnotationTool` 包括：

- 双向
- 椭圆 ROI
- 圆形 ROI
- 长度
- 探针
- 矩形 ROI
- 平面自由手 ROI

## 下一步

下一步，您可以：

- [查看使用文档](#)
- [探索我们的示例应用程序的源代码](#)