# 大荒百景 · 内容样式指南

*Content Style Guide for Dahuang Dashboard*

---

## 设计原则

### 核心美学

**留白即呼吸**
- 内容不是越多越好，空间是设计的一部分
- 段落间距宽松，让文字有呼吸感
- 宁可分页，不要堆砌

**层次即节奏**
- 标题 → 正文 → 注释，三级字号对比要 dramatic
- 墨黑(ink) → 烟灰(ink-light) → 淡灰(ink-faint)，三级灰度层次
- 重点用朱红(vermilion)点缀，不泛滥

**克制即力量**
- 装饰元素点到为止（一枚印章、一条分割线）
- 不用渐变、不用阴影、不用圆角
- 动效轻柔，淡入淡出，不炫技

---

## Markdown 元素样式

### 标题 Headings

```markdown
# 一级标题 — 页面主标题，仅用一次
## 二级标题 — 章节分隔
### 三级标题 — 段落主题
```

**渲染样式：**

```css
h1 {
  font-family: var(--font-title);  /* 思源宋体 */
  font-size: 2rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  margin-bottom: 2rem;
}

h2 {
  font-size: 1.4rem;
  font-weight: 400;
  letter-spacing: 0.05em;
  color: var(--ink);
  margin-top: 3rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--paper-dark);
}

h3 {
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 0.03em;
  color: var(--ink-light);
  margin-top: 2rem;
  margin-bottom: 1rem;
}
```

---

### 正文 Body Text

```markdown
段落之间空一行。

行文简洁，不堆砌。一段话说一件事。
长句拆短句，让阅读有节奏。
```

**渲染样式：**

```css
p {
  font-size: 1rem;
  line-height: 2;              /* 宽松行高 */
  color: var(--ink-light);
  margin-bottom: 1.5rem;
  text-align: justify;
  letter-spacing: 0.02em;
}
```

---

### 引用 Blockquote

用于：
- 原文摘录
- 古籍引用
- 精彩段落

```markdown
> 羽民国在其东南，其为人长头，身生羽。
> 
> ——《山海经·海外南经》
```

**渲染样式：**

```css
blockquote {
  position: relative;
  padding: 1.5rem 2rem;
  margin: 2rem 0;
  background: var(--paper-dark);
  border-left: 3px solid var(--vermilion);
  font-style: normal;
  color: var(--ink);
}

blockquote p {
  margin-bottom: 0.5rem;
}

blockquote p:last-child {
  margin-bottom: 0;
  text-align: right;
  font-size: 0.85rem;
  color: var(--ink-faint);
}
```

**变体：大段引用**

```markdown
> ## 核心观点
> 
> 知识不是壁垒，材料才是。任何能进图书馆的国家都能设计核武器。
> 真正的限制是获取裂变材料的能力。
```

---

### 强调 Emphasis

```markdown
**粗体** — 关键词、核心概念
*斜体* — 书名、术语、外文
~~删除线~~ — 纠正、对比
`代码` — 技术术语、命令
```

**渲染样式：**

```css
strong {
  font-weight: 600;
  color: var(--ink);
}

em {
  font-style: italic;
  color: var(--ink);
}

del {
  color: var(--ink-faint);
  text-decoration: line-through;
}

code {
  font-family: var(--font-mono);
  font-size: 0.9em;
  padding: 0.1em 0.4em;
  background: var(--paper-dark);
  color: var(--vermilion);
}
```

---

### 列表 Lists

**无序列表** — 并列要点

```markdown
- 第一点
- 第二点
- 第三点
```

**有序列表** — 步骤、时间线

```markdown
1. 图书馆调研
2. 三年兼职工作
3. 提交设计
```

**渲染样式：**

```css
ul, ol {
  margin: 1.5rem 0;
  padding-left: 1.5rem;
}

li {
  line-height: 1.8;
  margin-bottom: 0.5rem;
  color: var(--ink-light);
}

ul li::marker {
  color: var(--vermilion);
}

ol li::marker {
  color: var(--ink-faint);
  font-size: 0.9em;
}
```

---

### 分割线 Horizontal Rule

用于章节大分隔，不要滥用。

```markdown
---
```

**渲染样式：**

```css
hr {
  border: none;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    var(--ink-faint),
    transparent
  );
  margin: 3rem 0;
}
```

---

### 链接 Links

```markdown
[显示文字](URL)
```

**渲染样式：**

```css
a {
  color: var(--vermilion);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

a:hover {
  border-bottom-color: var(--vermilion);
}
```

---

### 图片 Images

```markdown
![描述文字](image-url)
```

**渲染样式：**

```css
img {
  max-width: 100%;
  margin: 2rem 0;
  filter: grayscale(10%);  /* 轻微去饱和，统一调性 */
}

figure {
  margin: 2rem 0;
}

figcaption {
  font-size: 0.8rem;
  color: var(--ink-faint);
  text-align: center;
  margin-top: 0.5rem;
  letter-spacing: 0.05em;
}
```

---

### 代码块 Code Blocks

```markdown
​```javascript
const wisdom = 'less is more';
​```
```

**渲染样式：**

```css
pre {
  background: var(--ink);
  color: var(--paper);
  padding: 1.5rem;
  margin: 2rem 0;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  line-height: 1.6;
}

pre code {
  background: none;
  padding: 0;
  color: inherit;
}
```

---

### 表格 Tables

```markdown
| 栏目 | 说明 |
|------|------|
| 羽民国 | 四方采集 |
| 昆仑丘 | 百川之源 |
```

**渲染样式：**

```css
table {
  width: 100%;
  border-collapse: collapse;
  margin: 2rem 0;
  font-size: 0.9rem;
}

th {
  text-align: left;
  font-weight: 500;
  color: var(--ink-faint);
  letter-spacing: 0.05em;
  padding: 0.75rem 0;
  border-bottom: 2px solid var(--paper-dark);
}

td {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--paper-dark);
  color: var(--ink-light);
}

tr:last-child td {
  border-bottom: none;
}
```

---

## 特殊组件

### 💡 洞察块

用于跨领域连接、核心 learning。

```markdown
> 💡 **核心洞察**
> 
> 知识民主化是双刃剑。Atoms for Peace 的信息公开
> 帮助了和平核能，也帮助了这三个学生。
```

**渲染样式：**

```css
.insight-block {
  background: linear-gradient(135deg, var(--paper-dark), var(--paper));
  border-left: 3px solid var(--gold);
  padding: 1.5rem 2rem;
  margin: 2rem 0;
}

.insight-block strong {
  color: var(--gold);
}
```

---

### 📌 注释/旁注

用于补充说明，不打断正文。

```markdown
正文内容。[^1]

[^1]: 这是一条注释，提供额外上下文。
```

**渲染样式：**

```css
.footnote-ref {
  font-size: 0.75em;
  vertical-align: super;
  color: var(--ink-faint);
}

.footnotes {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--paper-dark);
  font-size: 0.85rem;
  color: var(--ink-faint);
}
```

---

### 时间线片段

用于历史叙事、事件回顾。

```markdown
**1964** — 五角大楼启动 Nth Country 实验

**1967** — 三人提交最终设计，与广岛同等当量
```

**渲染样式：**

```css
.timeline-fragment strong {
  display: inline-block;
  min-width: 80px;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}

.timeline-fragment p {
  position: relative;
  padding-left: 100px;
}

.timeline-fragment p::before {
  content: '—';
  position: absolute;
  left: 70px;
  color: var(--ink-faint);
}
```

---

## 写作规范

### 语言

- **中文为主**，英文术语保留原文
- **简体中文**，标点用全角
- **不用网络用语**，保持书面感

### 段落

- **一段一主题**，不混杂
- **首句即核心**，不绕弯
- **150 字内**，太长就拆

### 引用

- **精选**，不是原文搬运
- **标注出处**，格式统一
- **翻译附原文**（如有）

### 标题

- **动词优先**：「如何设计原子弹」优于「原子弹的设计」
- **具体优先**：「三个学生」优于「一群人」
- **不用问号**：陈述比提问更有力

---

## 色彩变量

```css
:root {
  /* 主色 */
  --ink: #1a1a1a;           /* 墨黑 - 标题、强调 */
  --ink-light: #4a4a4a;     /* 烟灰 - 正文 */
  --ink-faint: #8a8a8a;     /* 淡灰 - 注释、次要 */
  
  /* 背景 */
  --paper: #faf9f7;         /* 宣纸白 */
  --paper-dark: #f0eeea;    /* 深纸色 - 引用、代码块 */
  
  /* 点缀 */
  --vermilion: #c73e3a;     /* 朱红 - 链接、强调 */
  --gold: #b8860b;          /* 古金 - 洞察、特殊 */
}
```

---

## 字体栈

```css
:root {
  --font-title: 'Noto Serif SC', 'Source Han Serif SC', serif;
  --font-body: 'Noto Sans SC', 'Source Han Sans SC', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}
```

---

*克制、留白、层次。让内容自己说话。*
