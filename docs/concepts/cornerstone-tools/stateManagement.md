---  
id: state-management  
title: 状态管理  
---  

# 状态管理  

我们将从使用基于图像ID的默认注释管理器转向基于参考框架（FrameOfReference）的注释管理器，在这种管理器中，注释使用世界坐标来表示点。底层，注释管理器将具有与当前 `cornerstoneTools` 注释管理器非常相似的结构：  

```js  
const annotations = {  
  myFrameOfReferenceUID: {  
    myToolID: [  
      {  
        viewPlaneNormal: [0, 0, 1], // 工具绘制时所在平面的法向量  
        toolUID: 'someUniqueIdentifier.1.231.4.12.5', // 该注释的唯一标识符  
        FrameOfReferenceUID: 'myFrameOfReference.1.2.3',  
        toolName: 'myToolID', // 与该注释相关的工具名称  
      }, // ... myToolID 的其他注释条目  
    ], // 该参考框架上的其他注释  
  }, //... 其他参考框架  
};  
```  

每个单独的注释条目将类似于以下内容：  

```js  
// 示例长度注释条目：  

const annotation = {  
  viewPlaneNormal: [0, 0, 1], // 绘制在轴向平面上  
  uid: 'someUniqueIdentifier.1.231.4.12.5', // 该注释的唯一标识符  
  FrameOfReferenceUID: 'myFrameOfReference.1.2.3', // 参考框架UID  
  toolName: LengthTool.toolName, // 工具名称  
  handles: {  
    points: [  
      // 定义该线段的世界空间中的两个点  
      [23.54, 12.42, -27.6],  
      [13.54, 14.42, -27.6],  
    ],  
  },  
};  
```  

注释可能具有特定于其工具的属性，但必须包含 `viewPlaneNormal`、`UID` 和 `tool`。开发者可以通过以下API与注释管理器进行交互：  

```js  
// 添加注释  
annotationManager.addAnnotation(annotation);  

// 根据注释引用移除注释  
annotationManager.removeAnnotation(annotation.annotationUID);  

// 返回给定参考框架的所有注释。  
// 可选：如果给定了工具名称，则仅返回该工具的注释。  
// 可选：如果给定了注释UID，则仅返回该特定注释。  
annotationManager.getAnnotationsByFrameOfReference(  
  FrameOfReferenceUID,  
  toolName,  
  annotationUID  
);  

// 一个辅助方法，返回与UID匹配的单个注释条目。  
// 相较于使用所有参数的 `getAnnotationsByFrameOfReference` 方法效率较低，但可以在没有所有信息的情况下查找注释。  
annotationManager.getAnnotation(annotationUID);  

// 删除通过给定UID找到的注释。  
// 相较于 `removeAnnotation`，效率较低，但如果只有UID也可以调用该方法。  
annotationManager.removeAnnotation(annotationUID);  
```