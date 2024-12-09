---
id: examples
---

# 示例

## 基本使用

示例|说明
-|-
[Basic Stack Viewport Usage](https://www.cornerstonejs.org/live-examples/stackBasic.html) | 在 Stack 视口中显示单个图像。
| [Stack Viewport API](https://www.cornerstonejs.org/live-examples/stackAPI.html) | 演示如何与 Stack 视口交互（例如设置 VOI 范围，下一个/上一个图像，水平/垂直翻转，旋转，反转，缩放/平移，重置）
| [Stack Viewport Positioning](https://www.cornerstonejs.org/live-examples/stackPosition.html) | 演示如何使用显示区域和翻转/旋转对视口图像进行基本定位
| [Stack Sigmoid LUT](https://www.cornerstonejs.org/live-examples/stackVoiSigmoid.html) | 演示 Sigmoid LUT 函数而非线性
| [Stack Viewport Events](https://www.cornerstonejs.org/live-examples/stackEvents.html) | 演示在与 Stack 视口交互期间触发的事件
| [Stack Viewport Canvas-to-World](https://www.cornerstonejs.org/live-examples/stackCanvasToWorld.html) | 演示如何从画布上的坐标获取 3D 世界中的坐标。
| [Basic Volume Viewport Usage](https://www.cornerstonejs.org/live-examples/volumeBasic.html) | 在 Volume 视口中显示一组 DICOM 图像。
| [Volume Viewport API](https://www.cornerstonejs.org/live-examples/volumeAPI.html) | 演示如何与 Volume 视口交互（例如设置 VOI 范围，更改相机位置/方向，更改板厚，水平/垂直翻转，旋转，反转，缩放/平移，重置）
| [Volume Sigmoid LUT](https://www.cornerstonejs.org/live-examples/volumeVoiSigmoid.html) | 演示 Sigmoid LUT 函数而非线性
| [3D Volume Rendering](https://www.cornerstonejs.org/live-examples/volumeViewport3D.html) | 演示如何 3D 渲染一个体积并应用预设
| [Volume Viewport Events](https://www.cornerstonejs.org/live-examples/volumeEvents.html) | 演示在与 Volume 视口交互期间触发的事件
| [Multiple Volumes in a Volume Viewport](https://www.cornerstonejs.org/live-examples/multiVolumeAPI.html) | 演示在使用多个体积（例如 PET/CT 融合）时如何与 Volume 视口交互。
| [Multiple Volume Canvas-to-World](https://www.cornerstonejs.org/live-examples/multiVolumeCanvasToWorld.html) | 演示如何使用 canvasToWorld API 在鼠标悬停时找到每个体积的强度值
| [Poly Data Actor in a Volume Viewport](https://www.cornerstonejs.org/live-examples/polyDataActorAPI.html) | 演示如何使用 Volume 视口渲染多边形数据
| [Legacy DICOMweb (WADO-URI) Support](https://www.cornerstonejs.org/live-examples/wadouri.html) | 演示如何通过 URL 直接支持检索整个 Part 10 DICOM 文件
| [Basic Volume using streaming WADOURI](https://www.cornerstonejs.org/live-examples/volumeBasicWadoUri.html) | 演示如何在 Volume 视口中显示 DICOM 系列（通过 URL）
| [Load Web images of PNG or JPG format](https://www.cornerstonejs.org/live-examples/webLoader.html) | 演示如何在堆栈视口中渲染网页图像
| [Load a dynamic 4D data](https://www.cornerstonejs.org/live-examples/dynamicCINETool.html) | 演示如何使用 cornerstone 3d 渲染 4D 数据
| [Render To Canvas](https://www.cornerstonejs.org/live-examples/renderToCanvas.html) | 演示如何使用 API 直接渲染到画布
| [Change the colormap and adjusting the opacity](https://www.cornerstonejs.org/live-examples/changeColorMap.html) | 演示如何与融合视口交互，具体来说是更改色图和调整不透明度。
| [Prioritizing Slices during Volume Loading](https://www.cornerstonejs.org/live-examples/volumePriorityLoading.html) | 演示如何使用流式图像体积加载器自定义切片加载顺序
| [Programmatic Pan/Zoom](https://www.cornerstonejs.org/live-examples/programaticPanZoom.html) | 演示如何编程地平移/缩放堆栈视口。可用于设置初始显示区域和呈现状态。
| [DICOM P10 from the local file system](https://www.cornerstonejs.org/live-examples/local.html) | 提供一个接口，从本地文件系统将 DICOM P10 图像加载到 Cornerstone3D
| [DICOM P10 from the local file system using CPU](https://www.cornerstonejs.org/live-examples/localCPU.html) | Cornerstone3D 默认使用 WebGL 进行渲染（如果可用），并回退到 CPU。此示例强制在 CPU 上渲染以进行调试。
| [Stack viewport default properties](https://www.cornerstonejs.org/live-examples/stackProperties.html) | 演示如何为堆栈视口中的每个图像设置属性，这些属性作为该特定图像的默认值
| [Volume Slab Scroll](https://www.cornerstonejs.org/live-examples/volumeSlabScroll.html) | 演示如何使用 slab scroll 工具滚动浏览体积
| [Resize viewport and change aspect ratio](https://www.cornerstonejs.org/live-examples/resize.html) | 调整视口大小并允许各种纵横比/条件
| [Apply view reference and/or presentation parameters](https://www.cornerstonejs.org/live-examples/viewReferencePresentation.html) | 演示如何应用各种视图/参考呈现参数。
| [Custom Web Worker Function](https://www.cornerstonejs.org/live-examples/webWorker.html) | 演示如何使用 web worker 管理器注册和执行自定义 web worker 函数，不在主线程上

## 工具库 Tools library

示例 | 说明
-|-
[ETDRS Grid Tool](https://www.cornerstonejs.org/live-examples/etdrsGrid.html) | 演示如何使用 ETDRS Grid 工具。ETDRS Grid（早期治疗糖尿病视网膜病变研究网格）是眼科中用于评估黄斑厚度和视网膜变化的标准化网格。
| [Multiple Tool Groups](https://www.cornerstonejs.org/live-examples/multipleToolGroups.html) | 演示如何为一组视口使用多个工具组。
| [Stack Manipulation Tools](https://www.cornerstonejs.org/live-examples/stackManipulationTools.html) | 演示几种操作工具（窗口/级别，平移，缩放）以及 Stack 视口特定的滚动
| [Stack Manipulation Tools Touch](https://www.cornerstonejs.org/live-examples/stackManipulationToolsTouch.html) | 演示几种操作工具（窗口/级别，平移，缩放）以及适用于移动触摸的 Stack 视口特定的滚动
| [Annotation Tool Modes](https://www.cornerstonejs.org/live-examples/annotationToolModes.html) | 演示注释工具的各种模式（活动，消极，启用，禁用）
| [Stack Annotation Tools](https://www.cornerstonejs.org/live-examples/stackAnnotationTools.html) | 演示如何在 Stack 视口上使用各种注释工具（探针，矩形 ROI，椭圆 ROI，双向测量）。
| [Calibration Tools](https://www.cornerstonejs.org/live-examples/calibrationTools.html) | 演示如何在 Stack 视口上使用校准工具。
| [Volume Annotation Tools](https://www.cornerstonejs.org/live-examples/volumeAnnotationTools.html) | 演示如何在 Volume 视口（轴向，矢状，斜位视图）中使用长度工具进行注释
| [Annotation Selection and Locking](https://www.cornerstonejs.org/live-examples/annotationSelectionAndLocking.html) | 演示如何切换注释的锁定和选择状态
| [Viewports Reset Camera](https://www.cornerstonejs.org/live-examples/resetCamera.html) | 演示可用于重置视口相机的各种选项
| [Annotation changing visibility](https://www.cornerstonejs.org/live-examples/annotationVisibility.html) | 演示如何切换注释的可见性状态
| [Binding Tools with Modifier Keys](https://www.cornerstonejs.org/live-examples/modifierKeys.html) | 演示如何将工具绑定到键盘和鼠标组合（例如 shift+click，ctrl+click）
| [Magnify Tool](https://www.cornerstonejs.org/live-examples/magnifyTool.html) | 演示放大工具的使用
| [Advanced Magnify Tool](https://www.cornerstonejs.org/live-examples/advancedMagnifyTool.html) | 演示在堆栈和体积视口上使用高级放大工具
| [CINE Tool](https://www.cornerstonejs.org/live-examples/CINETool.html) | 演示 CINE 工具的使用
| [Freehand ROI Tool](https://www.cornerstonejs.org/live-examples/planarFreehandROITool.html) | 演示在堆栈和体积视口上绘制开闭自由手 ROI（轮廓工具）
| [Sculptor Tool](https://www.cornerstonejs.org/live-examples/SculptorTool.html) | 演示自由手 ROI 和 FreehandContourSegmentations 的雕刻
| [Manipulation Tools with Poly Data in a Volume Viewport API](https://www.cornerstonejs.org/live-examples/polyDataActorManipulationTools.html) | 演示如何通过鼠标事件与 Volume 视口（平移，缩放，旋转）交互
| [Volume Viewport Orientation](https://www.cornerstonejs.org/live-examples/volumeViewportOrientation.html) | 演示您可以在体积视口的不同方向之间切换
| [Referencing Cursors](https://www.cornerstonejs.org/live-examples/referenceCursors.html) | 演示如何在多个视口之间同步光标
| [Double Click With Stack Annotation Tools](https://www.cornerstonejs.org/live-examples/doubleClickWithStackAnnotationTools.html) | 演示在使用各种注释工具在堆栈视口上进行操作前/中/后检测双击。
| [Load a petCT data where PT series is 4D](https://www.cornerstonejs.org/live-examples/dynamicPetCt.html) | 演示如何将 4D 数据渲染到多个视口并融合它们
| [ColorBar](https://www.cornerstonejs.org/live-examples/colorBar.html) | 演示如何向堆栈视口添加交互式色条
| [Advanced ColorBar](https://www.cornerstonejs.org/live-examples/advancedColorBar.html) | 演示如何向堆栈和体积视口添加带有 PT/CT 体积的交互式色条
| [Ultrasound Enhanced Region](https://www.cornerstonejs.org/live-examples/ultrasoundenhancedregion.html) | 演示可以在带有超声区域属性序列的超声数据上使用的几种工具
| [Window Level Region](https://www.cornerstonejs.org/live-examples/windowLevelRegion.html) | 演示如何使用窗口级区域工具调整图像的窗口级别
| [Spline ROI Tools](https://www.cornerstonejs.org/live-examples/splineROITools.html) | 演示如何使用样条 ROI 工具（线性，Cardinal，Catmull-ROM 和 BSpline）
| [Livewire](https://www.cornerstonejs.org/live-examples/livewireContour.html) | 演示如何使用 livewire 工具创建 ROI

## 细分 Segmentation

示例 | 说明     
-|-
[Labelmap Segmentation Rendering](https://www.cornerstonejs.org/live-examples/labelmapRendering.html) | 演示如何向视口添加 Labelmap 以进行渲染
| [Contour Segmentation Representation](https://www.cornerstonejs.org/live-examples/contourRendering.html) | 演示如何使用 Contour Segmentation Representation
| [Surface Segmentation Representation](https://www.cornerstonejs.org/live-examples/surfaceRendering.html) | 演示如何使用 Surface Segmentation Representation
| [Labelmap Segmentation Swapping](https://www.cornerstonejs.org/live-examples/labelmapSwapping.html) | 演示如何在体积视口上显示分割，并切换正在显示的分割
| [Global Labelmap Segmentation Configuration](https://www.cornerstonejs.org/live-examples/labelmapGlobalConfiguration.html) | 演示如何为分割表示设置全局配置
| [Contour rendering configuration](https://www.cornerstonejs.org/live-examples/contourRenderingConfiguration.html) | 演示如何为轮廓渲染设置配置（例如线条厚度）
| [Viewport Specific Labelmap Segmentation Configuration](https://www.cornerstonejs.org/live-examples/labelmapViewportSpecificConfiguration.html) | 演示如何通过分割表示更改特定工具组显示分割的配置
| [Labelmap segment-specific Configuration](https://www.cornerstonejs.org/live-examples/labelmapSegmentSpecificConfiguration.html) | 演示如何更改特定分段的配置
| [Segmentation Tools (Labelmap) - Brush, Scissors](https://www.cornerstonejs.org/live-examples/labelmapSegmentationTools.html) | 演示如何使用手动分割工具修改分割数据
| [Labelmap Statistics](https://www.cornerstonejs.org/live-examples/labelmapStatistics.html) | 显示 Labelmap 统计
| [Labelmap Segmentation Dynamic Threshold and Preview](https://www.cornerstonejs.org/live-examples/labelmapSegmentationDynamicThreshold.html) | 演示如何使用动态阈值和预览来修改分割数据
| [Labelmap Segment Color Change](https://www.cornerstonejs.org/live-examples/labelmapSegmentColorChange.html) | 演示如何更改分割表示中段的颜色
| [Labelmap Segmentation Locking](https://www.cornerstonejs.org/live-examples/labelmapSegmentLocking.html) | 演示如何锁定段，使其不能被分割工具编辑
| [Rendering Labelmap with Different Resolutions](https://www.cornerstonejs.org/live-examples/labelmapRenderingDifferentResolutions.html) | 演示分割分辨率不必与源数据相同
| [Rectangle ROI Threshold Segmentation](https://www.cornerstonejs.org/live-examples/rectangleROIThreshold.html) | 演示如何使用矩形 ROI 工具执行阈值分割
| [Stack Labelmap creation/edit for stack viewports](https://www.cornerstonejs.org/live-examples/stackLabelmapSegmentation.html) | 演示如何为堆栈视口创建和编辑分割 Labelmap
| [Spline ROI Tools](https://www.cornerstonejs.org/live-examples/splineROITools.html) | 演示如何使用样条 ROI 工具（线性，Cardinal，Catmull-ROM 和 BSpline）
| [Interpolation of Contours between slices](https://www.cornerstonejs.org/live-examples/interpolationContourSegmentation.html) | 演示如何为轮廓分割设置帧之间的插值
| [Contour Segmentation Configuration](https://www.cornerstonejs.org/live-examples/contourSegmentationConfiguration.html) | 演示如何为轮廓分割设置配置
| [Segmentation Bidirectional Tool](https://www.cornerstonejs.org/live-examples/segmentBidirectionalTool.html) | 演示如何计算分割轮廓内的最大双向直径，类似于 RECIST 测量，用于评估医学成像中肿瘤大小或解剖结构随时间的变化。
| [Segment Select Tool](https://www.cornerstonejs.org/live-examples/segmentSelect.html) | 演示 segmentSelectTool 功能，您可以仅通过悬停在其上来切换活动段。
| [Spline Segmentation Tools](https://www.cornerstonejs.org/live-examples/splineContourSegmentationTools.html) | 演示如何使用 SplineROI 工具创建轮廓分割
| [Advanced Spline Segmentation Tools](https://www.cornerstonejs.org/live-examples/splineContourSegmentationToolsAdvanced.html) | 演示如何在多个视口（堆栈和体积）、分割和活动与非活动状态的不同样式上使用 SplineROI 工具创建轮廓分割
| [Freehand Segmentation Tool](https://www.cornerstonejs.org/live-examples/planarFreehandContourSegmentationTool.html) | 演示如何使用 planarFreehandROITool 工具创建轮廓分割
| [Livewire Segmentation Tool](https://www.cornerstonejs.org/live-examples/livewireContourSegmentation.html) | 演示如何使用 livewireContour 工具创建轮廓分割
| [sculptorTool Tool](https://www.cornerstonejs.org/live-examples/sculptorTool.html) | 演示如何在轮廓上具有类似刷子的工具效果

## 高级工具库

示例 | 说明
-- | --
[Maximum Intensity Projection (MIP) - Jump to Click](https://www.cornerstonejs.org/live-examples/mipJumpToClick.html)| 演示如何在 MIP 视图中获取射线上最大值的位置，然后导航到另一个视口组到该位置。
[Crosshairs](https://www.cornerstonejs.org/live-examples/crossHairs.html)| 在此演示了如何链接相同数据的三个正交视图的十字准线
[Overlay Grid](https://www.cornerstonejs.org/live-examples/overlayGrid.html)| 演示如何在三个视口中使用覆盖网格工具，每个视口对应一个方向
[Reference Lines](https://www.cornerstonejs.org/live-examples/referenceLines.html)| 演示参考线工具，用于相对于彼此渲染视口位置
[Orientation Marker](https://www.cornerstonejs.org/live-examples/orientationMarker.html)| 演示视口方向的方向标记工具，具有立方体，轴和自定义演员
[PET-CT Fusion + MIPLayout](https://www.cornerstonejs.org/live-examples/petCT.html)| 带有十字准线和同步相机，CT W/L 和 PET 阈值的 PET-CT 融合布局
[Shared Tool State](https://www.cornerstonejs.org/live-examples/sharedToolState.html)| 演示注释存储在参考帧上，因此可以在 Stack 和 Volume 视口之间共享。
[StackViewport to and from VolumeViewport](https://www.cornerstonejs.org/live-examples/stackToVolumeWithAnnotations.html)| 演示即使在将堆栈视口转换为体积视口或反之亦然时，注释也会被保留并正确渲染。这是 MPR 的高级用法
[Volume Viewport Synchronization](https://www.cornerstonejs.org/live-examples/volumeViewportSynchronization.html)| 演示如何设置视口之间的同步，以用于视口级别（例如相机）和演员级别（例如 VOI）属性。
[Cancel Annotation Drawing](https://www.cornerstonejs.org/live-examples/cancelAnnotationDrawing.html)| 演示如何使用键盘（ESC）键取消注释绘制。
[Scale Overlay Tool](https://www.cornerstonejs.org/live-examples/scaleOverlayTool.html)| 演示在视口上渲染比例尺的比例尺覆盖工具，显示图像的实际世界大小。
[Generate 3D Volume From 4D Data](https://www.cornerstonejs.org/live-examples/generateImageFromTimeData.html)| 演示如何使用减法，平均或求和从 4D 数据生成 3D 体积。
[Dynamically Add Annotations](https://www.cornerstonejs.org/live-examples/dynamicallyAddAnnotations.html)| 演示如何动态地向视口添加注释
[Tool History](https://www.cornerstonejs.org/live-examples/toolHistory.html)| 演示如何使用工具历史记录撤销和重做工具操作

## GPU分割工具

示例 | 说明
-- | --
[Region Segment Tool](https://www.cornerstonejs.org/live-examples/regionSegment.html)| 演示如何在 GPU 中绘制 3D 球体并运行 grow cut 算法后创建分割
[Region Segment Plus Tool](https://www.cornerstonejs.org/live-examples/regionSegmentPlus.html)| 演示如何通过单击在 GPU 中运行 grow cut 算法创建分割
[Custom Brush Grow Cut](https://www.cornerstonejs.org/live-examples/growCutLabelmap.html)| 演示如何在 GPU 中对具有正负种子的 labelmap 运行 grow cut 算法
[Whole Body Segment tool](https://www.cornerstonejs.org/live-examples/wholeBodySegment.html)| 演示如何在 GPU 中处理用户选择的区域并分割整个身体
[Segmentation AI Assistance](https://www.cornerstonejs.org/live-examples/SAMClientSide.html)| 演示如何使用 onnx runtime 在客户端使用 AI 辅助工具进行分割创建

## 多态分割 Polymorph Segmentation

示例 | 说明
-- | --
[Convert contour segmentation to stack labelmap](https://www.cornerstonejs.org/live-examples/PolySegWasmContourToStackLabelmap.html)| 演示如何将轮廓分割转换为堆栈 labelmap
[Convert contour segmentation to volume labelmap](https://www.cornerstonejs.org/live-examples/PolySegWasmContourToVolumeLabelmap.html)| 演示如何将轮廓分割转换为体积 labelmap
[Convert contour segmentation to surface](https://www.cornerstonejs.org/live-examples/PolySegWasmContourToSurface.html)| 演示如何将轮廓分割转换为闭合表面
[Convert stack labelmap to surface](https://www.cornerstonejs.org/live-examples/PolySegWasmStackLabelmapToSurface.html)| 演示如何将堆栈 labelmap 转换为闭合表面
[Convert volume labelmap to surface](https://www.cornerstonejs.org/live-examples/PolySegWasmVolumeLabelmapToSurface.html)| 演示如何将体积 labelmap 转换为闭合表面
[Convert surface to volume labelmap](https://www.cornerstonejs.org/live-examples/PolySegWasmSurfaceToVolumeLabelmap.html)| 演示如何将闭合表面转换为体积 labelmap
[Convert surface to stack labelmap](https://www.cornerstonejs.org/live-examples/PolySegWasmSurfaceToStackLabelmap.html)| 演示如何将闭合表面转换为堆栈 labelmap
[Convert volume labelmap to contour](https://www.cornerstonejs.org/live-examples/PolySegWasmVolumeLabelmapToContour.html)| 演示如何将体积 labelmap 转换为轮廓分割
[Convert surface to contour](https://www.cornerstonejs.org/live-examples/PolySegWasmSurfaceToContour.html)| 演示如何将闭合表面转换为轮廓分割

## DICOM图像加载器

示例 | 说明
-- | --
[WADO-URI (DICOM P10)](https://www.cornerstonejs.org/live-examples/dicomImageLoaderWADOURI.html)| 使用不同编解码器的 WADO-URI（通过 HTTP GET 的 DICOM P10）
[HTJ2K Stack Basic Loading](https://www.cornerstonejs.org/live-examples/htj2kStackBasic.html)| 演示 HTJ2K 的基本加载
[HTJ2K Volume Basic Loading](https://www.cornerstonejs.org/live-examples/htj2kVolumeBasic.html)| 演示 HTJ2K 在 MPR 视图中的基本加载
[Stack Progressive Loading](https://www.cornerstonejs.org/live-examples/stackProgressive.html)| 使用 HTJ2K 和/或其他方法的堆栈渐进加载
[Volume Progressive Loading](https://www.cornerstonejs.org/live-examples/volumeProgressive.html)| 体积渐进加载，图像内和图像间

## 适配器 Adapters

示例 | 说明
-- | --
[DICOM SEG export](https://www.cornerstonejs.org/live-examples/segmentationExport.html)| 演示如何将分割导出为 DICOM SEG
[DICOM SEG Stack](https://www.cornerstonejs.org/live-examples/segmentationStack.html)| 演示如何从 Cornerstone3D 堆栈导入或导出分割为 DICOM SEG
[DICOM SEG Volume](https://www.cornerstonejs.org/live-examples/segmentationVolume.html)| 演示如何从 Cornerstone3D 体积导入或导出分割为 DICOM SEG

## 其他视窗（视频、wsi）

示例 | 说明
-- | --
[Video Display](https://www.cornerstonejs.org/live-examples/video.html)| 基本视频显示
[Video Navigation](https://www.cornerstonejs.org/live-examples/videoNavigation.html)| 视频播放导航
[Video Color Control](https://www.cornerstonejs.org/live-examples/videoColor.html)| 视频颜色校正和亮度/对比度
[Video Tools](https://www.cornerstonejs.org/live-examples/videoTools.html)| 视频注释工具
[Video Annotation Grouping](https://www.cornerstonejs.org/live-examples/videoGroup.html)| 注释分组工具
[Video Labelmap Segmentation](https://www.cornerstonejs.org/live-examples/videoSegmentation.html)| 基于 Labelmap 的视频分割
[Video Contour Segmentation](https://www.cornerstonejs.org/live-examples/videoContourSegmentation.html)| 演示在视频视口上使用样条和 livewire 轮廓分割
[Video Range Selection](https://www.cornerstonejs.org/live-examples/videoRange.html)| 视频范围选择
[Whole Slide Imaging](https://www.cornerstonejs.org/live-examples/wsi.html) | 显示 WSI 系列
[WSI Annotation Tools](https://www.cornerstonejs.org/live-examples/wsiAnnotationTools.html)| 带有长度和其他注释工具的 WSI

## Nifti 体积加载器

示例 | 说明
-- | --
[Load Nifti Volume](https://www.cornerstonejs.org/live-examples/niftiBasic.html)| 演示如何加载和渲染 Nifti 体积
[Tool Usage in Nifti](https://www.cornerstonejs.org/live-examples/niftiWithTools.html)| 演示如何在 Nifti 体积上使用操作和注释工具