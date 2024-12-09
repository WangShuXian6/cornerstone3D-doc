---  
id: annotationGroups  
title: 注释组  
sidebar_position: 7
---  

# 注释组  

为了表示注释之间的关系，有一个 `AnnotationGroup` 类可以用来将注释分组。目前，分组功能非常基础，且不会在适配器中自动保存/恢复。对于增强分组的需求仍在收集当中，但目前已经具备基本的功能。注释可以添加到一个组中，并可以通过查找下一个/上一个注释来进行导航。  

## 创建一个新组  

要创建一个新的注释组，只需创建一个 `AnnotationGroup` 实例。  

## 将注释添加到组中  

如果组是活动的，并且已经调用了 `addListeners` 方法，则注释可以自动添加到该组中。或者，也可以通过调用注释组上的 `add` 方法手动将注释添加到组中。  

例如：  

```javascript  
const group = new cornerstoneTools.annotation.AnnotationGroup();  
group.add(annotation.annotationUID);  
```  

## 设置注释的可见性  

可以通过调用注释组上的 `setVisibility` 方法来显示/隐藏注释。这接受一个可选的第二个参数，该参数将防止任何被过滤的元素（即过滤函数返回 `false` 的元素）被隐藏。提供了一个默认的过滤函数，该函数排除了当前组中由于可见性标志而可见的成员。这允许使用重叠的组，并且只有在所有注释组都不可见时，注释才会被隐藏。  

```javascript  
// 仅切换组成员的可见性。  
// 需要其他信息来触发事件  
group.setVisibility(!group.isVisible, { viewportId, renderingEngineId });  
```  