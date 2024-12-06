---

id: index  
title: 注释  
---

# 注释

在 `Cornerstone3DTools` 中，注释工具将其状态保存在一个 `state` 对象中。这个对象是一个普通的 JavaScript 对象，用于存储注释实例的状态。诸如注释的统计信息、数据和相机位置等信息都存储在该对象中。

有多种方法可以添加/删除、选择、锁定和解锁注释。可以通过调用以下代码，通过 `Cornerstone3DTools` 中的 `annotations` 命名空间访问这些方法：

```js
import { annotation } from '@cornerstonejs/tools';

// 所有处理注释状态的方法可以通过
annotation.state.XYZ;

// 所有处理注释选择的方法可以通过
annotation.selection.XYZ;

// 所有处理注释锁定的方法可以通过
annotation.locking.XYZ;

// 所有处理注释样式的方法可以通过
annotation.config.XYZ;

// AnnotationGroup 类允许将注释进行分组
annotation.AnnotationGroup;
```

让我们深入了解每个方法。