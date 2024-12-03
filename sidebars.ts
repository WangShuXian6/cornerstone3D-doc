import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// 这里运行在 Node.js 环境中 - 请勿在此处使用客户端代码（浏览器 API、JSX 等）

/**
 * 创建侧边栏使你能够：
 - 创建文档的有序分组
 - 为该分组的每个文档渲染侧边栏
 - 提供上下文导航

 侧边栏可以从文件系统生成，或者在这里显式定义。

 你可以创建任意数量的侧边栏。
 */
const sidebars: SidebarsConfig = {
  // 默认情况下，Docusaurus 会根据文档文件夹结构生成侧边栏
  tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],

  // 你也可以手动创建侧边栏
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: '教程',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

export default sidebars;