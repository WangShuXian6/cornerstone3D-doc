---  
id: encoding  
title: 编码  
---

## 部分分辨率的类型

有几种类型的部分分辨率图像：

- `有损` 图像是原始分辨率/位深度，但进行了有损编码
- `缩略图` 图像是降分辨率的图像
- `字节范围` 图像是完整分辨率的前缀，随后获取剩余的数据。这只适用于像 HTJ2K 编码的图像，采用分辨率优先的排序。

## 创建部分分辨率图像

[Static DICOMweb](https://github.com/RadicalImaging/Static-DICOMWeb) 仓库已增强，增加了创建部分分辨率图像的功能，并支持字节范围请求。以下是针对 Ct 数据集的一些示例命令：

```bash
# 创建 HTJ2K 作为默认，并将 HTJ2K 有损图像写入 .../lossy/
mkdicomweb create -t jhc --recompress true --alternate jhc --alternate-name lossy d:\src\viewer-testdata\dcm\Juno
# 创建 JLS 和 JLS 缩略图版本
mkdicomweb create -t jhc --recompress true --alternate jls --alternate-name jls /src/viewer-testdata/dcm/Juno
mkdicomweb create -t jhc --recompress true --alternate jls --alternate-name jlsThumbnail --alternate-thumbnail /src/viewer-testdata/dcm/Juno
# 创建 HTJ2K 无损和缩略图版本（通常不需要当顶部项目已经是无损时）
mkdicomweb create -t jhc --recompress true --alternate jhcLossless --alternate-name htj2k  /src/viewer-testdata/dcm/Juno
mkdicomweb create -t jhc --recompress true --alternate jhc --alternate-name htj2kThumbnail --alternate-thumbnail /src/viewer-testdata/dcm/Juno
```

可以使用任何其他创建多部分/相关封装数据的工具，也可以使用标准 DICOMweb 服务器的接受头或参数。

请注意，这些数据的路径通常是正常的 DICOMweb 路径，其中 `/frames/` 被替换为其他名称。