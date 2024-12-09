---
id: related-libraries
sidebar_position: 3
---

# 相关库

在本节中，我们将解释与 `Cornerstone3D` 相关的各种库。

## 历史

在解释这些库之前，我们首先讨论一下 `Cornerstone3D` 的历史。在 `Cornerstone3D` 之前，我们自2014年以来开发并维护了 [`cornerstone-core`](https://github.com/cornerstonejs/cornerstone) 和 [`cornerstone-tools`](https://github.com/cornerstonejs/cornerstoneTools)。由于 `Cornerstone3D` 相对于 `cornerstone-core` 和 `Cornerstone3DTools` 相对于 `cornerstone-tools` 的改进意义更大，从长远来看，我们将把重点转向 `Cornerstone3D`，并提供如何从传统的 `cornerstone` 升级到新的 `Cornerstone3D` 的充分文档。同时，我们将继续维护传统的 `cornerstone` 包，并处理潜在的关键错误。

除了 `cornerstone-core` 和 `cornerstone-tools` 包，我们还维护了 [`react-vtkjs-viewport`](https://github.com/OHIF/react-vtkjs-viewport)，这是我们使用 [vtk-js](https://github.com/kitware/vtk-js) 在 React 中实现 3D 渲染的第一代。`react-vtkjs-viewport` 目前在当前的主要 OHIF Viewer 中用于 MPR 视图。促使 `Cornerstone3D` 开发的主要动机之一是希望能够通过 React 将渲染与 UI 解耦，类似于 `cornerstone-core`。此外，`react-vtkjs-viewport` 的内存管理是一个重大挑战，尤其是在处理具有 10 个视口的 PET/CT 融合等更复杂的场景时。类似于传统的 cornerstone，我们将把精力从 `react-vtkjs-viewport` 转向使用新的 `Cornerstone3D` 和 `Cornerstone3DTools` 包。

## 库

### vtk.js

[`vtk-js`](https://github.com/kitware/vtk-js) 是一个用于 3D 计算机图形、图像处理和可视化的开源 JavaScript 库。过去，我们在 `react-vtkjs-viewport` 库中使用 `vtk-js` 来渲染和交互 3D 数据。`Cornerstone3D` 的渲染引擎被设计为使用 `vtk-js` 进行 3D 渲染。`vtk-js` 支持使用工具进行注释，但我们决定使用 `Cornerstone3DTools` 来实现这一目的，并仅依赖 `vtk-js` 进行实际渲染。我们的路线图（尚未获得资金）包括在 `Cornerstone3D` 中启用使用 `vtk-js` 的 3D 注释工具。

### OHIF Viewer

[开放健康成像基金会 (OHIF)](https://ohif.org/) 图像查看器是一个开源图像查看器，正在被用于学术和商业项目，如 [癌症成像档案 (TCIA)](https://www.cancerimagingarchive.net/) 和 [NCI 成像数据共享中心](https://datacommons.cancer.gov/repository/imaging-data-commons)。它是一个可扩展的 Web 成像平台，无需占用资源和安装。目前，OHIF 3.9 依赖于 `Cornerstone3D` 单一仓库中的所有库来实现其图像渲染和注释功能。