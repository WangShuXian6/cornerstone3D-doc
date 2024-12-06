---  
id: non-htj2k-progressive  
title: 非HTJ2K渐进式加载  
---  

# 非HTJ2K渐进式编码数据的渐进式加载

## JLS缩略图

可以使用static-dicomweb工具包创建JLS缩略图，例如，通过执行：

```
# 创建一个JLS目录，包含在/jls子路径中编码的JLS数据
mkdicomweb create -t jhc --recompress true --alternate jlsLossless --alternate-name jls "/dicom/DE Images for Rad"
# 创建一个jlsThumbnail子目录，包含减少分辨率的数据
mkdicomweb create -t jhc --recompress true --alternate jls --alternate-name jlsThumbnail --alternate-thumbnail "/dicom/DE Images for Rad"
```

然后，可以通过配置来使用：

```javascript
cornerstoneDicomImageLoader.configure({
  retrieveOptions: {
    default: {
      default: {
        framesPath: '/jls/',
      },
    },
    singleFast: {
      default: {
        imageQualityStatus: ImageQualityStatus.SUBRESOLUTION,
        framesPath: '/jlsThumbnail/',
```

## 顺序检索配置

顺序检索配置指定了两个阶段，每个阶段应用于整个图像ID堆栈。第一阶段将使用`singleFast`检索类型加载每个图像，然后第二阶段使用`singleFinal`进行检索。如果第一阶段加载的是无损图像，第二阶段将不会运行，因此该行为与堆栈图像的先前行为相同。

此配置也可以用于体积图像，生成旧的/先前的体积流式加载行为。

配置如下：

```javascript
stages: [
    {
      id: 'lossySequential',
      retrieveType: 'singleFast',
    },
    {
      id: 'finalSequential',
      retrieveType: 'singleFinal',
    },
  ],
```

堆栈视口的图像可以首先加载较低分辨率/有损版本，然后加载越来越高的分辨率，最后加载无损版本。

对于HTJ2K，当图像按渐进分辨率顺序编码时，会自动完成此操作，使用流式读取器返回较低分辨率的图像，直到图像可用。

对于其他图像类型，需要单独提供较低分辨率/有损版本。Static DICOMweb工具包包括一些选项来创建此类图像。

# 性能

通常，图像的1/16到1/10部分会被检索为有损/第一版本的图像。这显著提高了第一张图像的加载速度。其性能受整体图像大小、网络性能和压缩比的较大影响。

完整尺寸图像为3036 x 3036，而JLS减小的图像为759 x 759

| 类型              | 网络     | 大小   | 第一渲染    | 最终渲染   |
| ----------------- | -------- | ------ | ----------- | ----------- |
| JLS               | 4g       | 10.6 M |             | 4586 ms     |
| JLS减小           | 4g       | 766 K  | 359 ms      | 4903 ms     |
| HTJ2K             | 4g       | 11.1 M | 66 ms       | 5053 ms     |
| HTJ2K字节范围     | 4g       | 128 K  | 45 ms       | 4610 ms     |

- JLS减小使用1/16大小的JLS“缩略图”
- HTJ2K使用流式数据
- HTJ2K字节范围使用64k初始检索，随后是剩余数据

# 交错性能

这些时间均不包括加载解码器的时间，解码器的加载时间可能是1秒或更长时间，但只在第一次渲染时看到。这些时间对于两种类型是相似的。

| 类型              | 大小   | 网络     | 第一渲染    | 完成       |
| ----------------- | ------ | -------- | ----------- | ---------- |
| JLS               | 30 M   | 4g       | 2265 ms     | 8106 ms    |
| JLS减小           | 3.6 M  | 4g       | 1028 ms     | 8455 ms    |
| HTJ2K             | 33 M   | 4g       | 2503 ms     | 8817 ms    |
| HTJ2K字节范围     | 11.1M  | 4g       | 1002 ms     | 8813 ms    |
| JLS               | 30 M   | 本地     | 1322 ms     | 1487 ms    |
| JLS减小           | 3.6 M  | 本地     | 1084 ms     | 1679 ms    |
| HTJ2K             | 33 M   | 本地     | 1253 ms     | 1736 ms    |
| HTJ2K字节范围     | 11.1M  | 本地     | 1359 ms     | 1964 ms    |

HTJ2K字节范围比直接的JLS稍慢，但可以在任何支持HTJ2K和字节范围请求的DICOMweb服务器上完成。

- 4g速度 - 30 Mbit/s下载，5 Mbit/s上传，10 ms延迟
- JLS和HTJ2K的完整时间基本上与基准的非渐进式加载时间相同
- 完整尺寸图像为512x512
- 减少分辨率的图像为128x128，并经过有损压缩

# 配置

请参见stackProgressive示例了解堆栈的详细信息。

堆栈视口需要通过注册图像ID的元数据或默认的`stack`元数据作为`IRetrieveConfiguration`值来配置渐进式流式加载。此值包含要运行的阶段，以及每个阶段的检索配置。具体来说，需要在检索配置中为`single`检索类型设置`streaming`值。

检索配置有两个部分：阶段和检索选项（此外，还可以完全替换检索器为自定义检索器）。阶段用于选择要检索的图像ID，并提供要使用的检索类型。然后，检索选项将检索类型映射到实际使用的选项。这允许多个阶段为不同的目的使用相同的检索类型。

用于堆栈的渐进式渲染的两个检索类型（定义在`sequentialRetrieveConfiguration`中）是`singleFast`和`singleFinal`。这允许为快速初始请求和最终无损请求做出不同的请求。示例`stackProgressive`展示了多个可能的配置，演示如何通过重复请求使用字节范围检索加载不同的URL路径或图像的不同部分。