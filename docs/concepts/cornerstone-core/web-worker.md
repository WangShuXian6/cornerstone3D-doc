---

id: webWorker  
title: Web Workers 
sidebar_position: 13 
---

Web Workers 提供了一种在后台线程中运行脚本的方法，允许 web 应用在不干扰用户界面的情况下执行任务。它们特别适用于执行计算密集型任务或需要大量处理时间的任务。

通常，与 worker 一起工作需要大量的样板代码、`postMessage` 调用和事件监听器。Cornerstone 提供了一个简单的 API 来创建和使用 worker，隐藏了所有复杂性。

## 要求

你需要将 [`comlink`](https://www.npmjs.com/package/comlink) 安装为应用程序的依赖项，仅此而已。  
`comlink` 是一个库，允许你像使用本地对象一样使用 Web Workers，无需担心底层的消息传递。  
尽管它不处理优先级队列、负载平衡或 worker 生命周期，但它提供了一个简单的 API 来与 worker 通信，Cornerstone 使用它来创建一个更强大且用户友好的 API。

## 使用示例

我们通过一个示例来解释 WebWorker API。假设你有一组希望在后台运行的函数。你需要编写一个通过 comlink 暴露这些函数的对象。

```js
// file/location/my-awesome-worker.js

import { expose } from 'comlink';

const obj = {
  counter: 69,
  inc() {
    obj.counter++;
    console.debug('inc', obj.counter);
  },
  fib({ value }) {
    if (value <= 1) {
      return 1;
    }
    return obj.fib({ value: value - 1 }) + obj.fib({ value: value - 2 });
  },
};

expose(obj);
```

:::note  
如上所示，我们的对象可以包含任意数量的函数，并且可以持有本地状态。对于这些函数的唯一要求是，参数必须是可序列化的。这意味着不能将 DOM 元素、函数或其他非可序列化对象作为参数传递。

我们使用对象作为参数。因此，在上面的例子中，我们使用 `fib({value})` 而不是 `fib(value)`（`value` 只是参数名称，你可以为参数使用任何名称）。  
:::

现在，关键是要通知 Cornerstone 这个函数，以便它可以顺利在后台运行。让我们深入了解一下。

## WebWorker 管理器

WebWorkerManager 在 WebWorker API 中起着至关重要的作用。它的主要功能是创建和监督 workers。  
通过为任务分配不同的优先级和队列类型，你可以依赖该管理器根据指定的优先级有效地在后台执行任务。  
此外，它处理 worker 的生命周期，分配工作负载，并提供一个用户友好的 API 来执行任务。

### `registerWorker`

注册一个新的 worker 类型，使用唯一的名称和一个函数来告诉管理器有关 worker 的信息。

参数包括：

- `workerName`：worker 类型的名称（应该是唯一的），我们稍后会用这个名称来调用函数。
- `workerFn`：一个返回新 Worker 实例的函数（稍后会详细说明）。
- `options`：一个对象，具有以下属性：
  - `maxWorkerInstances`（默认值为 1）：可以创建的该类型 worker 的最大实例数。多个实例意味着如果对同一函数有多个调用，它们可以被分配到 worker 类型的其他实例上。
  - `overwrite`（默认值为 false）：是否覆盖已注册的现有 worker 类型。
  - `autoTerminateOnIdle`（默认值为 false）：用于在一定时间的空闲后终止 worker（以毫秒为单位）。这对于不常使用的 worker 非常有用，你希望在一段时间后终止它们。该方法的参数是 `{enabled: boolean, idleTimeThreshold: number(ms)}`。

:::tip  
请注意，如果 worker 被终止，并不意味着它被从管理器中销毁。实际上，任何后续对该 worker 的调用都会创建一个新的 worker 实例，一切会按预期工作。  
:::

因此，要注册我们上面创建的 worker，我们可以这样做：

```js
import { getWebWorkerManager } from '@cornerstonejs/core';

const workerFn = () => {
  return new Worker(
    new URL(
      '../relativePath/file/location/my-awesome-worker.js',
      import.meta.url
    ),
    {
      name: 'ohif', // 浏览器用于在调试器中显示 worker 名称
    }
  );
};

const workerManager = getWebWorkerManager();

const options = {
  // maxWorkerInstances: 1,
  // overwrite: false
};

workerManager.registerWorker('ohif-worker', workerFn, options);
```

如上所示，你需要创建一个返回新 Worker 实例的函数。  
为了使 worker 能正常工作，它应该位于主线程可以访问的目录（它可以是相对于当前目录的路径）。

:::note  
你可以指定两个名称：

1. `workerFn` 中的 `name`，它被浏览器用来在调试器中显示 worker 名称。
2. 注册名称，我们稍后用它来调用函数。
:::

### `executeTask`

到目前为止，管理器只知道可用的 workers，但它不知道该如何使用它们。

`executeTask` 用于在 worker 上执行任务。它接受以下参数：

- `workerName`：我们之前注册的 worker 类型的名称。
- `methodName`：我们想在 worker 上执行的方法的名称（在上面的示例中是 `fib` 或 `inc`）。
- `args`（默认值 = `{}`）：传递给函数的参数。参数必须是可序列化的，这意味着你不能传递 DOM 元素、函数或任何其他非可序列化对象（下面会说明如何传递非可序列化函数）。
- `options`：一个对象，具有以下属性：
  - `requestType`（默认值 = `RequestType.COMPUTE`）：请求的组别。用于优先级排序。默认值为 `RequestType.COMPUTE`，这是最低优先级。其他组别按优先级顺序为：`RequestType.INTERACTION`、`RequestType.THUMBNAIL`、`RequestType.PREFETCH`。
  - `priority`（默认值 = 0）：请求在指定组中的优先级。数字越小，优先级越高。
  - `options`（默认值 = `{}`）：传递给池管理器的选项（通常不需要修改）。
  - `callbacks`（默认值 = `[]`）：传递任何你希望在 worker 中调用的函数。

现在，要在 worker 上执行 `fib` 函数，我们可以这样做：

```js
import { getWebWorkerManager } from '@cornerstonejs/core';

const workerManager = getWebWorkerManager();
workerManager.executeTask('ohif-worker', 'fib', { value: 10 });
```

上述代码将在名称为 `ohif-worker` 的 worker 上执行 `fib` 函数，并传入参数 `{value: 10}`。当然，这是一个简化的示例，通常你需要在任务完成或失败时执行一些操作。由于 `executeTask` 返回的是一个 promise，你可以使用 `then` 和 `catch` 方法来处理结果。

```js
workerManager
  .executeTask('ohif-worker', 'fib', { value: 10 })
  .then((result) => {
    console.log('result', result);
  })
  .catch((error) => {
    console.error('error', error);
  });
```

或者你也可以直接等待结果：

```js
try {
  const result = await workerManager.executeTask('ohif-worker', 'fib', {
    value: 10,
  });
  console.log('result', result);
} catch (error) {
  console.error('error', error);
}
```

### `eventListeners`

有时，您可能需要为 worker 提供回调函数。例如，如果你希望在 worker 进行进度更新时更新用户界面。正如前面提到的，不能直接将函数作为参数传递给 worker。但是，您可以通过使用 `callbacks` 属性来克服这个问题。这些 `callbacks` 会根据它们的位置作为参数传递给函数。

来自代码库的实际示例：

```js
const results = await workerManager.executeTask(
  'polySeg',
  'convertContourToSurface',
  {
    polylines,
    numPointsArray,
  },
  {
    callbacks: [
      (progress) => {
        console.debug('progress', progress);
      },
    ],
  }
);
```

如你所见，我们将一个函数作为回调传递给 worker。这个函数作为下一个参数传递给 worker。

在 worker 中，我们有：

```js
import { expose } from 'comlink';

const obj = {
  async convertContourToSurface(args, ...callbacks) {
    const { polylines, numPointsArray } = args;
    const [progressCallback] = callbacks;
    await this.initializePolySeg(progressCallback);
    const results = await this.polySeg.instance.convertContourRoiToSurface(
      polylines,
      numPointsArray
    );

    return results;
  },
};

expose(obj);
```

### `terminate`

要终止 worker，可以使用 `webWorkerManager.terminate(workerName)`。它会停止所有给定 worker 的实例并清理资源。