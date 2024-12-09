---

id: selection  
title: 选择  
sidebar_position: 4
---

# 选择

注释可以被选择或取消选择。通过按住 `Shift` 键（默认情况下）并点击注释来实现。

## API

有多种 API 用于选择和取消选择注释，以及获取/设置方法。

```js
import { annotation } from '@cornerstonejs/tools';

// 选择注释
annotation.selection.setAnnotationSelected(
  annotationUID,
  (selected = true),
  (preserveSelected = false)
);

// 获取所有选中的注释
annotation.selection.getAnnotationsSelected();

// 获取特定工具选中的所有注释
annotation.selection.getAnnotationsSelectedByToolName(toolName);
```

## 阅读更多

:::note TIP  
关于选择 API 的更多信息，请 [**点击这里**](/api/tools/namespace/annotation#selection)  
:::