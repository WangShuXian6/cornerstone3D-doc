---
id: scope
sidebar_position: 2
---

# 项目范围

## 范围

`Cornerstone3D` 是一个 JavaScript 库，使用纯粹的 Web 标准实现医学图像的 3D 渲染。该库在可能的情况下采用 WebGL 进行 GPU 加速渲染。`Cornerstone3DTools` 是 `Cornerstone3D` 的同级库，包含许多用于操作和注释的工具，用于与图像进行交互。

`Cornerstone3D` 的范围 **不包括** 处理图像/体积加载和元数据解析。`Cornerstone3D` 的范围 **包括** 图像渲染和缓存。应使用 `imageLoader.registerImageLoader` 和 `volumeLoader.registerVolumeLoader` 将适当的图像加载器注册 **到** Cornerstone3D。此类图像加载器的示例包括使用 `cornerstoneDICOMImageLoader` 的 `wadors` 加载器，用于通过 `dicomweb` 加载 DICOM P10 实例，以及通过 HTTP 加载 DICOM P10 实例的 `wadouri`。

此外，`Cornerstone3D` 具有元数据注册机制，允许使用 `metaData.addProvider` 将元数据解析器注册 **到** `Cornerstone3D`。使用 `cornerstoneDICOMImageLoader`，其图像加载器和元数据提供器会自我注册到 `Cornerstone3D`。您可以随时查看示例助手，了解如何从元数据解析到图像加载和图像渲染实现端到端的示例。

## Typescript

由于 `Cornerstone3D` 单仓库中的所有库均使用 Typescript 编写，它们提供了类型安全的 API。这意味着您可以在 TypeScript 环境中使用该库，并且通过类型信息，您可以确保传递给任何方法的参数符合预期。

## 浏览器支持

`Cornerstone3D` 使用 HTML5 canvas 元素和 WebGL 2.0 GPU 渲染来渲染图像，所有现代浏览器都支持这些功能。我们的高级体积渲染最近进行了改进，以实现更好的性能和内存管理，并且不再需要使用之前渲染体积时所需的 sharedArrayBuffer。

- Chrome > 68
- Firefox > 79
- Edge > 79

如果您使用的是较旧的浏览器，或者没有图形卡，您的设备可能无法使用 `Cornerstone3D` 渲染体积图像。然而，您仍然可以使用我们在 `Cornerstone3D` 中实现的 CPU 回退渲染堆栈图像，以应对这种情况。

## 单仓库层次结构

`Cornerstone3D` 是一个单仓库，包含以下包：

- `/packages/core`：负责渲染图像和体积及缓存的核心库。
- `/packages/tools`：用于操作、注释和分割渲染及工具的工具库。
- `/packages/dicom-image-loader`：用于通过 HTTP 加载 `wadors` 和 `wadouri` DICOM P10 实例的图像加载器。
- `/packages/nifti-volume-loader`：用于 NIfTI 文件的图像加载器。
- `/packages/docs`：包含所有包的文档，包括指南、示例和 API 参考。