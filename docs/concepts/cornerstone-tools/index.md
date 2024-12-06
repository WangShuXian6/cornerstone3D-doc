---  
id: index  
title: Cornerstone工具  
---  

# 工具介绍  

## 工具  

在 `Cornerstone3D` 核心库中，每张图像都渲染在物理空间中（即使我们的堆叠视口也会在实际的位置和正常方向上渲染，而不是任何任意的2D平面），因此我们构建了一个 `Tools` 库，以便能够在3D空间中创建和操作工具。  
在 `Cornerstone3DTools` 中，注释现在存储在特定的 DICOM 参考框架（FoR）中的3D患者空间中。一般来说，单个 DICOM 研究中的所有图像都存在于同一个 FoR 中（例如，PET 和 CT 在 PET/CT 扫描中）。让我们来看看在这个库中将使用的一些概念。  