const { addItem } = require('./scripts/add-data.cjs');

addItem('insight', {
  title: 'Planetoño — 当快餐遇上银河系',
  summary: '一个虚构太空快餐网站如何用 Blender + three.js + Rive 打造沉浸式滚动体验',
  content: `## Design Analysis

### 风格 Style

**太空复古 + 童趣治愈**

Planetoño 是 Tubik Studio 的概念作品：一个虚构的太空快餐品牌。视觉语言融合了：

- **复古太空美学**：60年代太空竞赛时期的乐观主义，浓郁饱和的色彩
- **clay art 3D 风格**：Tubik 标志性的「黏土人」质感，圆润、柔软、治愈
- **幽默叙事**：「NASA 说不行」「Cluck Rogers, the space chick on a flavor mission」

这种组合创造了一种*认真地搞笑*的调性——技术上严肃，内容上荒诞。

### 色彩 Color

**宇宙调色盘**

- **深空背景**：不是纯黑，而是带紫调的深蓝（#0d0a1a 附近），更有神秘感
- **食物高光**：金黄、番茄红、芥末黄——经典快餐色彩的「太空化」处理
- **渐变大气层**：背景随滚动从一个星系「漂移」到另一个，每道菜有自己的「星球配色」

**Borrowable**: 用「氛围色」而非「品牌色」来定义每个内容单元，让滚动本身成为一种情绪旅程。

### 构图 Composition

**Portal Layout**

- **3D 深度堆叠**：食物不是排列在平面上，而是沿 Z 轴分布在不同深度
- **滚动 = 穿越**：用户不是在「翻页」，而是在「穿越太空」
- **前景/后景**：角色（太空鸡、考拉宇航员）在前景，食物在中景，星空在远景

> We built a custom scroll animation engine in three.js, optimized shader workflows, redesigned the UI integration around a portal-style layout. — Tubik

### 字体 Typography

**故意的「混乱」**

标题使用大小写混排（「BiGgerthan hunger」），模拟手写涂鸦或外星信号传输误差。这种「故障美学」与精致的 3D 模型形成对比张力。

正文保持可读，但标题大胆破格。

### 动效 Motion

**三层动效系统**

1. **滚动驱动 3D**：three.js 自定义滚动引擎，相机沿 Z 轴移动
2. **Rive 微交互**：按钮、图标的轻量动画，响应式且高性能
3. **Shader 呼吸感**：背景渐变、光晕随滚动速度变化

**关键技术洞察**（来自 Codrops 类似项目）：

- 滚动速度变成「信号」：rawVelocity = scrollCurrent - previousScrollCurrent
- 平滑处理：velocity = lerp(velocity, rawVelocity, damping)
- 速度影响视觉：快滚时画面更亮、元素倾斜

**这不是「滚动动画」，而是「滚动作为输入信号」** — 用户的操作方式（快/慢/停）直接影响视觉呈现。

### Takeaways

**可借鉴的技法**：

1. **Mood-per-image**：每张图片定义自己的「氛围配色」，背景随之过渡
2. **Velocity as signal**：把滚动速度变成可复用的参数，驱动多层视觉反馈
3. **Depth over pagination**：用 Z 轴深度代替传统分页，创造空间感
4. **Contrast of polish + absurdity**：精致的执行 + 荒诞的内容 = 记忆点
5. **Blender → three.js pipeline**：3D 建模在 Blender 完成，用 glTF 导入 Web

**适用场景**：
- 产品展示（有故事线的系列产品）
- 品牌概念站（需要差异化的创意公司）
- 沉浸式内容叙事（博物馆、活动、艺术项目）

---

*Planetoño 证明：概念作品可以是技术试验场。没有真实客户的约束，反而能探索更前沿的交互形式。*
`,
  source: 'Tubik Studio',
  sourceUrl: 'https://www.planetono.space/',
  category: 'design',
  tags: ['3D', 'animation', 'three.js', 'scroll-interaction', 'Blender', 'concept-design']
});
