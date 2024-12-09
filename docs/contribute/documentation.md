---
id: documentation
sidebar_position: 4
---

# 编写文档

我们强烈建议您在每次提交 Pull Request 时问自己以下问题：

- 此更改是否也需要更改文档？
- 这是一个新功能吗？如果是，是否需要记录？

如果答案是肯定的，建议进行文档记录。

## 运行文档页面

要运行文档，您需要执行

```sh
cd packages/docs/

yarn run start
```

这将打开端口 `3000` 并启动文档服务器。然后您可以访问 `http://localhost:3000` 查看文档页面。

:::note Important
第一次运行文档服务器可能会因为找不到 `example.md` 文件而失败。这是因为 `example.md` 文件是在构建时创建的，并且在仓库中不可用。为了解决这个问题，您可以第一次运行 `yarn docs:dev` 来构建并运行文档服务器。之后，您只需运行 `yarn docs` 来运行文档服务器。
:::

## 您可能遇到的潜在问题

### 侧边栏未显示

您的 markdown 文件中存在一个错误，可能是您使用 markdown 语法的方式有问题。