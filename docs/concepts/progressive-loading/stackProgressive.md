---
id: stackProgressive
title: 渐进加载堆栈
---

在这里，我们将探讨 stackViewports 的渐进加载，作为渐进加载的一个示例用例，并将其与常规加载进行基准测试。我们将更详细地讨论，包括涉及多个阶段的渐进加载和不同检索类型的场景。

:::tip
对于堆叠视口，可以使用流式方法解码较大的图像，其中 HTJ2K RPCL 图像作为流接收，并在其可用时解码其部分内容。这可以显著改善堆叠图像的查看，而不需要任何特殊的服务器要求，除了支持 HTJ2K RPCL 传输语法。
:::

# 基准测试

通常，对于图像的有损/第一版本，检索的图像大约是图像的 1/16 到 1/10。这为第一批图像带来了显著的速度提升。它受到整体图像大小、网络性能和压缩比的相当强烈的影响。

**完整的测试图像大小为 3036 x 3036，大小为 11.1 MB。
**

| 类型                           | 网络  | 大小  | 首次渲染  | 最终渲染（基线） |
| ------------------------------ | ----- | ----- | --------- | ----------------- |
| HTJ2K 流式传输（1 阶段）        | 4g    | 11.1 M | 66 ms    | 5053 ms           |
| HTJ2K 字节范围（2 阶段）        | 4g    | 128 K  | 45 ms    | 4610 ms           |

上述测试的配置如下

## HTJ2K 流式传输（1 阶段）

此配置将使用单阶段流式响应检索图像。它可以安全地用于流式和非流式传输语法，但仅在与 HTJ2K 传输语法一起使用时才会激活解码部分。对于 HTJ2K 解码，如果图像不是 RPCL 格式，则可能会发生其他解码进展，例如按区域解码（例如左上、右上、左下、右下），或者解码可能会在完整数据可用之前失败。

:::tip
您可以使用 `urlParameters: accept=image/jhc` 以符合标准的方式请求 HTJ2K。
:::

```js
const retrieveConfiguration = {
  // stages 默认为 singleRetrieveConfiguration
  retrieveOptions: {
    single: {
      streaming: true,
    },
  },
};
```

## HTJ2K 字节范围（2 阶段）

此顺序检索配置指定了两个阶段，每个阶段适用于整个图像 ID 堆栈。第一阶段将使用 `singleFast` 检索类型加载每个图像，随后第二阶段将使用 `singleFinal` 进行检索。

请注意，此检索配置需要服务器端支持字节范围请求。对于不支持字节范围请求的服务器，这可能是安全的，但尝试时请求也可能失败。请阅读您的 DICOM 兼容性声明。

:::tip
您可以添加第三个错误恢复阶段，移除任何字节范围请求。只有在前几个阶段失败时，才会运行此阶段。这允许处理未知的服务器支持。
:::

```js
const retrieveConfiguration = {
  // 这个阶段列表作为 sequentialRetrieveStages 可用
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
  retrieveOptions: {
    singleFast: {
      rangeIndex: 0,
      decodeLevel: 3,
    },
    singleFinal: {
      rangeIndex: -1,
    },
  },
};
```