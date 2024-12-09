---

id: volumes  
title: 卷  
sidebar_position: 5
---  

# 卷  

卷是一个具有物理大小和空间方向的 3D 数据数组。它可以通过组合 3D 成像系列的像素数据和元数据来构建，也可以由应用程序从头定义。一个卷具有 `FrameOfReferenceUID`、`voxelSpacing (x,y,z)`、`voxel dimensions (x,y,z)`、`origin` 和 `orientation` 向量，这些唯一地定义了它相对于病人坐标系统的坐标系。  

## ImageVolume  

在 `Cornerstone3D` 中，我们使用 `ImageVolume` 基类来表示一个 3D 图像卷。所有卷都是从此类派生的。例如，`StreamingImageVolume` 用于表示一个逐帧流式传输的卷。我们稍后将更详细地讨论 `StreamingImageVolume` 类。  

```js  
interface IImageVolume {  
  /** 卷在缓存中的唯一标识符 */  
  readonly volumeId: string  
  /** 卷的尺寸 */  
  dimensions: Point3  
  /** 卷的方向 */  
  direction: Float32Array  
  /** 卷的元数据 */  
  metadata: Metadata  
  /** 卷的原点 - 设置为卷中最后一幅图像的 imagePositionPatient */  
  origin: Point3  
  /** 卷的缩放元数据 */  
  scaling?: {  
    PET?: {  
      SUVlbmFactor?: number  
      SUVbsaFactor?: number  
      suvbwToSuvlbm?: number  
      suvbwToSuvbsa?: number  
    }  
  }  
  /** 卷的字节大小 */  
  sizeInBytes?: number  
  /** 卷的间距 */  
  spacing: Point3  
  /** 卷中的体素数量 */  
  numVoxels: number  
  /** 卷的图像数据作为 vtkImageData */  
  imageData?: vtkImageData  
  /** 卷的 openGL 纹理 */  
  vtkOpenGLTexture: any  
  /** 卷的加载状态对象，包含已加载/加载中的状态 */  
  loadStatus?: Record<string, any>  
  /** 卷的 imageIds（如果它是由单独的 imageIds 构建的） */  
  imageIds?: Array<string>  
  /** 卷引用的 referencedVolumeId（如果它是从另一个卷派生的） */  
  referencedVolumeId?: string // 如果卷是从另一个卷派生的  
  /** 体素管理器 */  
  voxelManager?: IVoxelManager  
}  
```  

## 体素管理器  

`VoxelManager` 负责管理卷的体素数据。在 `Cornerstone3D` 的早期版本中，我们曾将 `scalarData` 包含在 `ImageVolume` 对象中。然而，这种方法在内存使用和性能方面有若干限制。因此，我们现在将体素数据管理委托给 `VoxelManager` 类，它是一个有状态的类，用于跟踪卷中的体素数据。  

您可以在 [这里](./voxelManager.md) 阅读更多关于 `VoxelManager` 类的信息。  