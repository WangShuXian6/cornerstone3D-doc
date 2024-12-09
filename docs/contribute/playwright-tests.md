---
id: playwright-tests
---

# 编写 PlayWright 测试

我们的 Playwright 测试使用 Playwright 测试框架编写。我们使用这些测试来测试我们的示例并确保它们按预期工作，这反过来又确保我们的包按预期工作。

在本指南中，我们将向您展示如何为我们的示例编写 Playwright 测试，创建新示例并针对它们进行测试。

## 针对现有示例进行测试

如果您想使用现有示例，可以在 `utils/ExampleRunner/example-info.json` 文件中找到示例列表。您可以使用 `exampleName` 属性来引用您想要使用的示例。例如，如果您想使用 `annotationToolModes` 示例，可以使用以下代码片段：

```ts
import { test } from '@playwright/test';
import { visitExample } from './utils/index';

test.beforeEach(async ({ page }) => {
  await visitExample(page, 'annotationToolModes');
});

test.describe('Annotation Tool Modes', async () => {
  test('should do something', async ({ page }) => {
    // Your test code here
  });
});
```

## 针对新示例进行测试

我们的 Playwright 测试针对我们的示例运行，如果您想添加一个新示例，可以将其添加到相应包的根目录下的 `examples` 文件夹中，例如 `packages/tools/examples/{your_example_name}/index.ts`，然后在 `utils/ExampleRunner/example-info.json` 文件中在其正确的类别下注册它。例如，如果它与工具相关，可以放入现有的 `tools-basic` 类别。如果您找不到适合您示例的类别，可以创建一个新类别并将其添加到 `example-info.json` 文件中的 `categories` 对象中。

```json
{
  "categories": {
    "tools-basic": {
      "description": "Tools library"
    },
    "examplesByCategory": {
      "tools-basic": {
        "your_example_name": {
          "name": "Good title for your example",
          "description": "Good description of what your example demonstrates"
        }
      }
    }
  }
}
```

完成后，您可以通过在 `tests/utils/visitExample.ts` 文件中使用 `visitExample` 函数针对该示例编写测试。例如，如果您想针对 `your_example_name` 示例编写测试，可以使用以下代码片段：

```ts
import { test } from '@playwright/test';
import { visitExample } from './utils/index';

test.beforeEach(async ({ page }) => {
  await visitExample(page, 'your_example_name');
});

test.describe('Your Example Name', async () => {
  test('should do something', async ({ page }) => {
    // Your test code here
  });
});
```

这还会使您的示例出现在我们的文档页面中，用户可以看到如何使用该示例，因此通过添加新示例，您增加了双重价值。

## 截图

检查您的测试是否按预期工作的一个好方法是在测试的不同阶段捕捉截图。您可以使用位于 `tests/utils/checkForScreenshot.ts` 的 `checkForScreenshot` 函数来捕捉截图。您还应该提前规划您的截图，截图需要在 `tests/utils/screenshotPaths.ts` 文件中定义。例如，如果您想在添加测量后捕捉截图，可以这样定义截图路径：

```ts
const screenShotPaths = {
  your_example_name: {
    measurementAdded: 'measurementAdded.png',
    measurementRemoved: 'measurementRemoved.png',
  },
};
```

如果截图尚不存在，这也是可以的，下一步会处理。定义截图路径后，您可以在测试中使用 `checkForScreenshot` 函数来捕捉截图。例如，如果您想在添加测量后捕捉 `cornerstone-canvas` 元素的截图，可以使用以下代码片段：

```ts
import { test } from '@playwright/test';
import {
  visitExample,
  checkForScreenshot,
  screenshotPath,
} from './utils/index';

test.beforeEach(async ({ page }) => {
  await visitExample(page, 'your_example_name');
});

test.describe('Your Example Name', async () => {
  test('should do something', async ({ page }) => {
    // Your test code here to add a measurement
    const locator = page.locator('.cornerstone-canvas');
    await checkForScreenshot(
      page,
      locator,
      screenshotPath.your_example_name.measurementAdded
    );
  });
});
```

测试第一次运行时将自动失败，但它会为您生成截图，您将在 `tests/screenshots` 文件夹下的 `chromium/your-example.spec.js/measurementAdded.png`、`firefox/your-example.spec.js/measurementAdded.png` 和 `webkit/your-example.spec.js/measurementAdded.png` 文件夹中看到 3 个新条目。您现在可以再次运行测试，它将使用这些截图与示例的当前状态进行比较。请在提交或测试之前验证地面真相截图是否正确。

## 模拟鼠标拖动

如果您想模拟鼠标拖动，可以使用位于 `tests/utils/simulateDrag.ts` 的 `simulateDrag` 函数。您可以使用此函数在元素上模拟鼠标拖动。例如，如果您想在 `cornerstone-canvas` 元素上模拟鼠标拖动，可以使用以下代码片段：

```ts
import {
  visitExample,
  checkForScreenshot,
  screenShotPaths,
  simulateDrag,
} from './utils/index';

test.beforeEach(async ({ page }) => {
  await visitExample(page, 'stackManipulationTools');
});

test.describe('Basic Stack Manipulation', async () => {
  test('should manipulate the window level using the window level tool', async ({
    page,
  }) => {
    await page.getByRole('combobox').selectOption('WindowLevel');
    const locator = page.locator('.cornerstone-canvas');
    await simulateDrag(page, locator);
    await checkForScreenshot(
      page,
      locator,
      screenShotPaths.stackManipulationTools.windowLevel
    );
  });
});
```

我们的模拟拖动工具可以在任何元素上模拟拖动，并避免超出边界。它将计算元素的边界框，并确保拖动保持在元素的边界内。这对于大多数工具来说已经足够好了，比提供自定义的 x 和 y 坐标更好，因为自定义坐标可能容易出错并使代码难以维护。

## 运行测试

编写测试后，您可以使用以下命令运行它们：

```bash
yarn test:e2e:ci
```

如果您想使用有头模式，可以使用以下命令：

```bash
yarn test:e2e:headed
```

您将在终端中看到测试结果，如果您想要深入的报告，可以使用以下命令：

```bash
yarn playwright show-report tests/playwright-report
```

## 手动为开发服务示例

默认情况下，当您运行测试时，它将首先调用 `yarn build-and-serve-static-examples` 命令来提供示例，然后运行测试。如果您想手动提供示例，可以使用相同的命令。示例将可在 `http://localhost:3000` 访问。这可以加快您的开发过程，因为 Playwright 将跳过构建和提供步骤，并使用端口 3000 上现有的服务器。

## Playwright VSCode 扩展和录制测试

如果您使用的是 VSCode，可以使用 Playwright 扩展来帮助您编写测试。该扩展提供了测试运行器和许多出色的功能，如使用鼠标选择定位器、录制新测试等。您可以通过在 VSCode 的扩展标签中搜索 `Playwright` 或访问 [Playwright 扩展页面](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) 来安装该扩展。

<div style={{padding:"56.25% 0 0 0", position:"relative"}}>
    <iframe src="https://player.vimeo.com/video/949208495?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
    frameBorder="0" allow="cross-origin-isolated" allowFullScreen style= {{ position:"absolute",top:0,left:0,width:"100%",height:"100%"}} title="Playwright Extension"></iframe>
</div>