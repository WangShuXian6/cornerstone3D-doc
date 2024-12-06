---

id: locking  
title: 锁定  
---

# 锁定

注释可以被锁定，以避免意外更改。你可以使用锁定 API 来锁定/解锁注释。

## API

有多种 API 用于锁定和解锁注释，以及获取/设置方法。

```js
import { annotation } from '@cornerstonejs/tools';

// 锁定注释
annotation.locking.setAnnotationLocked(annotationUID, (locked = true));

// 获取所有锁定的注释
annotation.locking.getAnnotationsLocked();

// 解锁所有注释
annotation.locking.unlockAllAnnotations();
```

## 阅读更多

:::note TIP  
关于锁定 API 的更多信息，请 [点击这里](/api/tools/namespace/annotation#locking)  
:::