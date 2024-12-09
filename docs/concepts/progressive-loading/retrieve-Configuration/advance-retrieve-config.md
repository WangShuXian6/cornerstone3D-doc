---

id: advance-retrieve-config  
title: 高级选项  
sidebar_position: 2
---  

`retrieve stages` 和 `retrieve options` 有更多的高级选项，可以用来定制渐进加载的行为。  

:::tip  
如果您对高级选项不感兴趣（目前），可以跳过这一部分，直接跳转到 [使用部分](./usage)。基本上，这些选项中的一些（如位置、稀疏化、偏移、优先级和邻近帧）在“体积渐进式”示例中有所使用，您可以稍后重新访问。  
:::  

## 高级检索阶段选项  

### positions?: number[];  

用于体积渐进式加载，在此需要指定要检索的确切图像索引。一般来说，在一般的悬挂协议中，这通常是正确的，因为初始图像通常位于堆栈的中间、顶部或底部。  

您可以使用绝对位置，或在 [0, 1] 范围内的相对位置。  
小于 0 的位置相对于末尾，因此您可以使用 -1 来指示堆栈中的最后一张图像。  

示例  

```js  
stages: [  
  {  
    id: 'initialImages',  
    positions: [0.5, 0, -1],  
    retrieveType: 'initial', // 如上所述的任意命名  
  },  
];  
```  

在上述示例中，我们请求堆栈中的中间图像、第一张图像和最后一张图像。  

:::tip  
若要基于初始显示位置自动检索另一个初始图像，请复制阶段，并添加一个新的阶段，设置所需的位置，并将该阶段放在第一位。  
这样可以确保首先获取初始图像。  
:::  

### decimate?: number & offset?: number;  

通过利用稀疏化和偏移功能，我们可以增强指定所需图像的灵活性。例如，如果一个体积包含 100 张图像，应用稀疏化值为 2，偏移值为 0，将检索图像 0、2、4、6、8、10、12、14、16、18 等。类似地，应用稀疏化值为 2，偏移值为 1，将检索图像 1、3、5、7、9、11、13、15、17、19 等。这演示了如何通过不同的偏移和稀疏化值有效地交错图像。  

重复图像检索是安全的，因为当图像质量状态已好于指定的检索状态时，检索将被丢弃。  

```js  
stages: [  
  {  
    id: 'initialImages',  
    positions: [0.5, 0, -1],  
    retrieveType: 'initial', // 如上所述的任意命名  
  },  
  {  
    id: 'initialPass',  
    decimate: 2,  
    offset: 0,  
    retrieveType: 'fast', // 如上所述的任意命名  
  },  
  {  
    id: 'secondPass',  
    decimate: 2,  
    offset: 1,  
    retrieveType: 'fast', // 如上所述的任意命名  
  },  
];  
```  

上面有三个阶段，我们首先获取初始图像，然后分两次获取其余的图像。第一次获取图像 0、2、4、6、8、10、12、14、16、18 等。第二次获取图像 1、3、5、7、9、11、13、15、17、19 等。  

### priority?: number & requestType  

通过结合 requestType（缩略图、预取、交互）和 priority（越小优先级越高），您可以有效地优先处理请求。  
例如，您可以将初始图像的优先级设置为高（较小的数字），以确保初始图像在队列中优先获取。  

```js  
stages: [  
  {  
    id: 'initialImages',  
    positions: [0.5, 0, -1],  
    retrieveType: 'initial',  
    requestType: RequestType.INTERACTION,  
    priority: -1,  
  },  
  {  
    id: 'initialPass',  
    decimate: 2,  
    offset: 0,  
    retrieveType: 'fast',  
    priority: 2,  
    requestType: RequestType.PREFETCH,  
  },  
  {  
    id: 'secondPass',  
    decimate: 2,  
    offset: 1,  
    retrieveType: 'fast',  
    priority: 3,  
    requestType: RequestType.PREFETCH,  
  },  
];  
```  

:::tip  
将要运行的最大请求数设置为较低的值，以确保首先执行所需的请求。例如：  

```javascript  
imageLoadPoolManager.setMaxSimultaneousRequests(RequestType.INTERACTION, 6);  
```  

:::  

### nearbyFrames?: NearbyFrames[];  

使用邻近帧，您可以选择填充邻近帧，以立即填充并渲染体积中的空白区域。  

示例  

```js  
stages: [  
  {  
    id: 'initialPass',  
    decimate: 2,  
    offset: 0,  
    retrieveType: 'fast',  
    priority: 2,  
    requestType: RequestType.PREFETCH,  
    nearbyFrames: [  
      {  
        offset: +1,  
        imageQualityStatus: ImageQualityStatus.ADJACENT_REPLICATE,  
      },  
    ],  
  },  
  {  
    id: 'secondPass',  
    decimate: 2,  
    offset: 1,  
    retrieveType: 'fast',  
    priority: 3,  
    requestType: RequestType.PREFETCH,  
  },  
];  
```  

在上述示例中，我们指定希望复制当前帧的邻近帧（+1）。这样，直到下一阶段（secondPass）到达之前，我们将拥有准备好渲染和显示的邻近帧。secondPass 将用实际数据覆盖这些帧。  

## 高级检索选项  

### urlArguments  

- urlArguments - 是一组要添加到 URL 的参数  
  - 它区分了此请求与其他无法与此请求合并的请求  
  - DICOMweb 标准允许使用 `accept` 参数指定内容类型  
  - HTJ2K 内容类型为 `image/jhc`  

其配置为（假设支持基于标准的 DICOMweb）：  

```js  
retrieveOptions: {  
  default: {  
    urlArguments: 'accept=image/jhc',  
    rangeIndex: -1,  
  },  
  multipleFast: {  
    urlArguments: 'accept=image/jhc',  
    rangeIndex: 0,  
    decodeLevel: 0,  
  },  
},  
```  

:::warning  
您必须为每个阶段的范围请求重复相同的 framesPath 和 urlArguments，否则假设在第一个范围中检索的数据与在第二个范围中检索的数据不同，第二个范围请求将直接检索整个请求。  
:::  

### framePath  

- framesPath - 用于更新 URL 路径部分  

这对于获取其他可用路径很有用，例如缩略图、JPIP 或渲染端点，用于有损编码的检索，因为它们位于与无损编码图像不同的路径上。  

这对于与固定路径的替代编码服务器集成也很有用，后者根据 URL 路径选择返回的响应，将各种有损渲染存储在备用路径上。  

### imageQualityStatus  

- imageQualityStatus - 用于设置检索状态为有损或子分辨率  

这通常用于当 URL 或检索参数指定给定路径的有损最终渲染时，例如针对有损编码的 HTJ2K 图像。  


## 为子分辨率图像提供单独的 URL

字节范围请求的替代方法是为完整的，但有损/低分辨率图像发出不同的请求。这可以是基于标准的，假设 DICOMweb 支持 `JPIP`，或者更可能是非标准的，使用单独的路径来获取低分辨率图像。

对于此处所示的 `JPIP` 方法，`JPIP` 服务器必须暴露一个与正常像素数据端点路径相同的端点，除了路径以 `/jpip?target=<FRAMENO>` 结尾，并支持 `fsiz` 参数。请参见 DICOM 标准的 [第 5 部分](https://dicom.nema.org/medical/dicom/current/output/html/part05.html#sect_8.4.1) 和 [第 18 部分](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#sect_8.3.3.1)。

对于非标准路径方法，假设存在其他与正常 `/frames` 端点相关的端点，只是 URL 中的 `/frames/` 部分被另一个值替换。例如，这可以用于获取 `/jlsThumbnail/` 数据，正如在 `stackProgressive` 示例中使用的那样。

`JPIP` 的示例配置：

```js
  retrieveOptions: {
    default: {
      // 需要注意这是有损编码，因为无法根据这里的通用配置检测
      imageQualityStatus: ImageQualityStatus.SUBRESOLUTION,
      // 假设的 JPIP 服务器使用的是与正常 DICOMweb
      // 路径相同的路径，但 /jpip?target= 替换了 /frames 路径
      // 这使用了基于标准的目标 JPIP 参数，并将
      // 帧编号作为值。
      framesPath: '/jpip?target=',
      // 基于标准的 fsiz 参数用于获取子分辨率图像
      urlArguments: 'fsiz=128,128',
    },
  },
```