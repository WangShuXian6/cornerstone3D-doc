---
id: karma-tests
sidebar_position: 6
---

# 编写 Karma 测试

为了确保我们的渲染和工具在未来的修改中不会出现问题，我们为它们编写了测试。渲染测试包括将渲染的图像与预期的图像进行比较。工具测试包括将工具的输出与预期的输出进行比较。

### 在本地运行 Karma 测试

您可以运行 `yarn run test` 在本地运行所有测试。
默认情况下，`karma.conf.js` 将在无头 Chrome 浏览器中运行测试，以确保我们的测试可以在任何服务器上运行。因此，默认情况下您无法可视化它。为了运行测试并直观检查结果，您可以通过将 `karma.conf.js` 文件中的 `browsers: ['ChromeHeadless']` 改为 `browsers: ['Chrome']` 来运行测试。

![renderingTests](../assets/tests.gif)

### 仅在本地运行一个 Karma 测试

您可以使用 `karma` 说明符，如 `describe` 代替 (`describe`) 和 `fit` 代替 (`it`) 来仅运行一个测试。