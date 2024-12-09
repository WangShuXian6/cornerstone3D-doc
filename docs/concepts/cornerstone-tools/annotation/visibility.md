---

id: visibility  
title: 可见性  
sidebar_position: 8
---

# 可见性

注释可以更改其可见性。您可以使用可见性 API 来显示/隐藏注释。

## API

有多种 API 可用于显示和隐藏注释以及获取/设置方法

```js
import { annotation } from '@cornerstonejs/tools';

// 将注释的可见性更改为可见（隐式可见参数）。
annotation.visibility.setAnnotationVisibility(annotationUID);

// 将注释的可见性更改为不可见。
annotation.visibility.setAnnotationVisibility(annotationUID, false);

// 显示所有注释（隐藏）。
annotation.visibility.showAllAnnotations();

// 获取注释是否可见。
// 可能的结果是：如果给定 UID 没有注释，则为 undefined；如果可见，则为 true；如果不可见，则为 false。
annotation.visibility.isAnnotationVisible(annotationUID);
```

## 阅读更多

:::note TIP  
关于可见性 API 的更多信息，请 [**点击这里**](/api/tools/namespace/annotation#visibility)  
:::