const { addItem } = require('./add-data.cjs');

addItem('insight', {
  title: "The Mechanic That's Impossible to Balance — Failure",
  summary: '失败是游戏的核心机制，但也是最难平衡的。Razbuten 拆解了为什么玩家需要失败却讨厌失败，以及 roguelite 如何软化失败、Silksong 的 runback 争议、时间限制的心理负担。',
  content: `## 核心洞察

**失败让游戏成为游戏——但玩家本能地想要避免它。**

这是一个无法完美解决的张力：没有失败的威胁，游戏就变成了「坐过山车」；失败太重，玩家会感到时间被浪费。开发者必须在这条razor's edge上行走。

---

## 关键论点

### 失败的双重性

| 需要失败的原因 | 讨厌失败的原因 |
|--------------|--------------|
| 给游戏赋予 stakes | 浪费时间的感觉 |
| 让成功有意义 | 重复相同内容 |
| 创造掌控感 | 打断心流 |
| 验证玩家技能 | 技能较弱的玩家受罚最重 |

### Silksong 争议的本质

**不是太难，是太惩罚。**

Silksong 的 runback 设计让每次死亡承担双重失败：死于 boss + 必须穿越已经通关的区域。
- 喜欢的人：享受掌握整个区域、找最优路径、失败间有喘息空间
- 讨厌的人：死 30 次后 runback 变成无脑操作，感觉是「永远拿不回的时间」

**对比 Elden Ring**：boss 旁边必有存档点，挑战集中在 boss 本身。两种设计都有效，但适合不同的失败容忍度。

### Roguelite 如何「软化」失败

**每次失败都让角色变强——给玩家一个 permission structure。**

| 传统游戏的失败 | Roguelite 的失败 |
|--------------|-----------------|
| 纯惩罚 | 进度（meta-progression） |
| 重复相同内容 | 新 build、新组合 |
| 技能 vs 技能 | 技能 vs 角色能力，模糊归因 |
| 固定难度 | Heat/Fear 系统让玩家自定义挑战 |

**关键设计**：Hades 的 Heat 系统让玩家逐步增加难度，保持在「刚好够难」的甜蜜点。

### 时间限制的心理负担

玩家害怕的不是时间限制本身，而是**早期失误导致后期无法挽回**。

好的解决方案（Unsighted）：
- 时间耗尽 ≠ Game Over
- 可以牺牲其他角色换取时间
- 继续游戏但得到 Bad Ending

**问题**：这些方案仍然「让人难受」——很多玩家只想要 Good Ending，其他结局等于「浪费时间」。

### 选择的悖论

**玩家说想要「选择有意义的游戏」，但实际上想要「按自己期望发展的剧情」。**

BG3 的 save scumming 现象：
- 桌游玩家信任 DM 会把失败变成有趣的故事
- 电子游戏无法像人一样灵活调整
- 信息时代让 FOMO 放大——你知道 Gale 是重要角色，错过他会很难接受

---

## 设计师 Takeaways

1. **区分「难度」和「惩罚度」**——Silksong 不是太难，是惩罚太重；这是两个可以独立调节的变量

2. **让失败产出进度**——roguelite 的 meta-progression 是最成功的失败软化机制

3. **注意负反馈循环**——技能较弱的玩家死得更多、受罚更重、体验更差；技能强的玩家反而更少接触失败系统

4. **时间限制需要退出机制**——不是 Game Over，而是「不同的结局」或「可接受的代价」

5. **玩家的失败容忍度 = 时间 × 心理状态**——每周只有几小时游戏时间的人，runback 的「税」感受完全不同

6. **当前行业趋势**：Dark Souls 的成功让整体游戏变得更惩罚；pendulum 可能要往回摆了

---

## 跨领域连接

- **投资心理学**：沉没成本让人更难接受失败，即使继续可能更糟
- **教育学**：失败即学习（growth mindset）vs 失败即惩罚（fixed mindset）——游戏设计同样面对这个选择
- **产品设计**：onboarding 的「失败」如何处理？用户流失往往发生在第一次「卡住」

---

## 💡 本期金句

> "The best time to beat a boss is when you are on the brink, when one more loss will push you over the edge."

刚好在崩溃边缘战胜——这是失败设计的终极目标，也是几乎不可能命中的靶心。
`,
  source: 'Razbuten',
  sourceUrl: 'https://www.youtube.com/watch?v=fMbVMO4FfHE',
  category: 'game-ux',
  tags: ['Failure Design', 'Difficulty Balance', 'Roguelite', 'Player Psychology', 'Silksong']
});

console.log('Entry added successfully');
