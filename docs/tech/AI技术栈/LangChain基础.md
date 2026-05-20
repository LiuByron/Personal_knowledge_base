---
title: LangChain 基础
date: 2026-05-11
category: AI
tags:
  - LangChain
  - Python
  - TypeScript
  - LLM
draft: false
---

# LangChain 基础

支持 **Python** 和 **TypeScript** 双版本。

---

## 一、核心能力

### LLMs & Prompt

提供主流模型 API 接口，以及提示词管理和优化能力。

### Chains

将提示词、大语言模型、结果解析封装成 Chain，提供标准接口以形成交互序列，实现端到端的调用链路。

### RAG（检索增强生成）

解决预训练语料数据陈旧问题。Chain 先与外部数据源交互获取数据，再结合 LLMs 生成回答。典型场景：基于特定数据源的问答机器人。

### Agent 代理

LLMs 对任务进行拆分、执行行动、观察结果，重复直到任务完成。LangChain 提供标准接口、可选代理以及端到端示例。

### Memory 记忆

Chain 或 Agent 调用之间的状态持久化。提供标准接口及多种内存实现，使大模型具备记忆功能。

### Evaluation 评估

提供多种评估能力，方便对 LLMs 进行模型优劣评估。

---

## 二、优劣分析

::: info 优势
- 多平台多模型调用，灵活选择
- 轻量级 SDK（Python / JavaScript），易于与传统编程语言集成
- 支持多模态数据（图像、音频等）
:::

::: warning 劣势
- 学习曲线较高
- 官方文档相对不完善
- 版本变化较大
:::

---

## 三、环境搭建（Python）

### 版本要求

| 组件 | 版本 |
|------|------|
| Python | 3.12.1（最低 3.8.1） |
| LangChain | 0.3 |
| 操作系统 | Windows 10 |

使用 `venv` 虚拟环境隔离依赖。

### Jupyter Notebook

使用 Jupyter Notebook（`.ipynb`）或 VS Code Jupyter 插件运行 Python 代码。在命令行前加 `!` 执行 Shell 命令。

### 虚拟环境

Python 3.10+ 内置环境隔离：

```bash
# 创建虚拟环境
python -m venv .test

# 激活（macOS / Linux）
source .test/bin/activate

# 激活（Windows CMD）
.test\Scripts\activate.bat

# 激活（Windows PowerShell）
.test\Scripts\Activate.ps1
```

---

## 四、LangChain 实例

### 创建 LLM

```python
# "帮我起一个名字" → LLM.invoke() → "二蛋"
```

### 自定义提示词模板

```python
from langchain.prompts import PromptTemplate

# "帮我起一个具有{country}特色的名字"
# → Prompt.format(country='美国') → "托尼"
```

### 输出解释器

```python
from langchain.schema import OutputParser

# "帮我起4个具有中国特色的名字"
# → OutputParser.parse() → ['赵六', '王五', '张三', '李四']
```

---

## 五、ChatModels：磨平不同 LLM 的差异

支持结构化输出、多模态输入输出。

### 标准参数

| 参数 | 说明 |
|------|------|
| `model` | 模型名称 |
| `temperature` | 生成随机度 |
| `timeout` | 超时时间 |
| `max_tokens` | 输出长度 |
| `stop` | 指定停止字符 |
| `max_retries` | 最大重试数 |
| `api_key` | API KEY |
| `base_url` | 代理地址 |
| `rate_limiter` | 请求速率限制 |

::: tip
参数使用时，需原模型支持该参数。
:::

### 标准事件

| 方法 | 说明 |
|------|------|
| `invoke` | 主要调用方法，输入 list 输出 list |
| `stream` | 流式输出 |
| `batch` | 批量请求 |
| `bind_tools` | 绑定时具 |
| `with_structured_output` | 基于 invoke 的结构化输出 |

**异步事件**：

| 方法 | 说明 |
|------|------|
| `ainvoke` | 异步调用 |
| `astream` | 异步流式输出 |
| `abatch` | 异步批量处理 |
| `astream_events` | 异步流事件 |
| `with_retry` | 失败重试 |
| `with_fallback` | 失败恢复 |
| `configurable_fields` | 运行时参数配置 |

### 输入与输出

LangChain Message 类型：

| 类型 | 说明 |
|------|------|
| `SystemMessage` | 系统角色 |
| `HumanMessage` | 用户角色 |
| `AIMessage` | 应用助理角色 |
| `AIMessageChunk` | 流式输出片段 |
| `ToolMessage` | 工具角色 |
| `RemoveMessage` | LangGraph 聊天记录 |

### AIMessage 返回字段

| 字段 | 说明 |
|------|------|
| `content` | 原生内容，通常为字符串或内容块列表 |
| `tool_calls` | 标准化的工具调用 |
| `invalid_tool_calls` | 工具调用解析错误 |
| `usage_metadata` | 元数据（输入/输出/总计 token 数） |
| `id` | 消息唯一标识符 |
| `response_metadata` | 响应元数据（响应头、token 计数等） |

::: warning
不同大模型返回的属性内容不同，目前行业暂无统一标准。
:::

---

## 六、模型上下文窗口与 Token

### 上下文限制原因

- **计算复杂度**：Transformer 自注意力机制复杂度 O(n²)，序列越长计算量平方增长
- **硬件限制**：GPU 显存有限，长序列需要更多显存，响应时间更长
- **训练数据限制**：预训练数据多为短文本，模型难学习长距离依赖
- **注意衰减**：序列越长，模型对早期信息注意力下降，导致遗忘

### 超出上下文的处理方法

1. 记忆增强（RAG）
2. 滑动窗口
3. 新型架构

### Token 查看示例

每家模型存放位置可能不同，以 DeepSeek 为例：

```python
from langchain_deepseek import ChatDeepSeek
import os

llm2 = ChatDeepSeek(
    model="deepseek-chat",
    temperature=0,
    api_key=os.environ.get("DEEPSEEK_API_KEY"),
    api_base=os.environ.get("DEEPSEEK_API_BASE"),
)

res2 = llm2.invoke("你好")

# Token 使用情况（DeepSeek）
res2.usage_metadata

# 另一种访问方式
res2.response_metadata["token_usage"]
```

---

## 七、速率限制与缓存机制

### 速率限制

大量 API 请求时限速以缓解服务器压力：

- **RPM**：限制每分钟请求数
- **TPM**：限制每分钟 Token 数

### 缓存机制

先将用户问题在缓存层查找，命中直接返回。分长期缓存（内存，机器不重启则存在）和短期缓存。

```python
from langchain_deepseek import ChatDeepSeek
from langchain_core.rate_limiters import InMemoryRateLimiter
import os

llm2 = ChatDeepSeek(
    model="deepseek-chat",
    temperature=0,
    api_key=os.environ.get("DEEPSEEK_API_KEY"),
    api_base=os.environ.get("DEEPSEEK_API_BASE"),
    rate_limiter=InMemoryRateLimiter(
        requests_per_second=1,      # 每秒 1 次请求
        check_every_n_seconds=0.1,  # 每 100ms 检查一次
        max_bucket_size=10,         # 最大突发大小
    ),
)

res2 = llm2.invoke("你好")
res2.usage_metadata
```

---

## 八、本地大模型部署

### 方案一：LLM Studio

部署本地模型后启动，通过 IP + 端口在其他工具中接入。

### 方案二：Ollama

流程：安装 Ollama → 拉取模型 → 启动 Ollama → 在 LangChain 中安装 Ollama 插件接入。

```python
from langchain_ollama import ChatOllama

llm = ChatOllama(
    model="llama3.1",  # Ollama 本地已启动的模型
    temperature=0,
    # other params...
)
```

---

## 九、大模型工具调用原理

### 调用流程

1. 创建工具（如数据库查询工具）
2. 将工具绑定到模型
3. 模型判断问题是否需要调用工具
4. 工具调用生成结构化数据
5. 执行工具（查询数据库）
6. 获取工具使用结果
7. 返回给大模型增强回答

### 核心要点

- 工具调用允许大模型通过调用工具来响应提示词
- 模型只生成工具参数，**并不直接运行工具**
- 本质是模型生成的一段特定结构化数据
- **并非所有模型都支持工具调用**

### 方式一：Pydantic 定义工具

```python
from pydantic import BaseModel, Field
from langchain_openai import ChatOpenAI
import os

# 加法工具
class Add(BaseModel):
    """Add two integers."""
    a: int = Field(..., description="First integer")
    b: int = Field(..., description="Second integer")

# 乘法工具
class Multiply(BaseModel):
    """Multiply two integers."""
    a: int = Field(..., description="First integer")
    b: int = Field(..., description="Second integer")

llm = ChatOpenAI(
    model="gpt-4",
    temperature=0,
    api_key=os.environ.get("OPENAI_API_KEY"),
    base_url=os.environ.get("OPENAI_API_BASE"),
)

tools = [Add, Multiply]  # 可绑定多个工具
llm_with_tools = llm.bind_tools(tools)

query = "3乘以12等于多少？"
# 大模型自动判断调用哪个方法
llm_with_tools.invoke(query).tool_calls  # tool_calls 是关键方法
```

### 方式二：@tool 装饰器

```python
from langchain_core.tools import tool

@tool
def multiply(a: int, b: int) -> int:
    """Multiply two numbers."""  # 此注释是工具描述，必需
    return a * b

print(multiply.name)        # 工具名称: multiply
print(multiply.description) # 工具描述: Multiply two numbers.
print(multiply.args)        # 工具参数
```

### PromptTemplate：提示词工程实践

<!-- TODO: 补充 PromptTemplate 详细内容 -->

---

## 十、TypeScript 环境搭建与实战

> 截至 2026 年 5 月的最新文档和社区实践。

### 10.1 准备环境

在写代码之前，确保开发环境准备就绪：

| 组件 | 要求 |
|------|------|
| **Node.js** | 20.0 或以上（LangChain v1 起不再支持 Node 18） |
| **DeepSeek API Key** | 前往 DeepSeek 官网开发者中心申请，充值几块钱即可 |
| **TypeScript** | 全程使用 TypeScript 获得完整类型安全和智能提示 |

### 10.2 项目初始化

打开终端，逐步创建项目：

**1. 创建项目并初始化**

```bash
mkdir my-first-langchain-app
cd my-first-langchain-app
npm init -y
```

**2. 安装核心依赖**

当前（2026 年 5 月），接入 DeepSeek 的最佳方式是使用官方为 LangChain 推出的专属集成包 `@langchain/deepseek`。

```bash
npm install @langchain/deepseek @langchain/core dotenv zod
npm install -D typescript tsx @types/node
```

| 包 | 说明 |
|----|------|
| `@langchain/deepseek` | DeepSeek 官方的 LangChain 集成包 |
| `@langchain/core` | LangChain 的核心抽象 |
| `dotenv` | 管理环境变量，安全存放 API Key |
| `zod` | 定义和校验结构化数据，TypeScript 生态标配 |
| `tsx` | 直接运行 TypeScript 代码，无需手动编译 |

**3. 配置 TypeScript**

```bash
npx tsc --init
```

这会在项目根目录创建一个 `tsconfig.json` 文件，默认配置即可。

### 10.3 配置 API Key

安全第一，永远不要将 API Key 直接写在代码里。最佳实践是使用环境变量。

在项目根目录创建 `.env` 文件：

```ini
DEEPSEEK_API_KEY=你的DeepSeek_API密钥
```

为了让 Git 忽略这个包含敏感信息的文件，务必创建或编辑 `.gitignore` 文件，并添加一行 `.env`。

### 10.4 编写核心代码：你的第一个 LangChain 应用

在项目根目录创建 `src` 文件夹，并在其中新建 `index.ts` 文件：

```typescript
// src/index.ts
import "dotenv/config"; // 确保在文件最开始加载环境变量
import { ChatDeepSeek } from "@langchain/deepseek";

async function main() {
  // 初始化 DeepSeek 模型
  // 最新模型名：deepseek-v4-flash（日常）和 deepseek-v4-pro（复杂）
  const llm = new ChatDeepSeek({
    model: "deepseek-v4-flash", // 日常任务首选，速度快，成本低
    temperature: 0.8, // 控制创造力，0 为保守，1 为天马行空
  });

  console.log("正在向 DeepSeek 提问...");

  // 发送消息并获取回复
  const aiMsg = await llm.invoke([
    ["system", "你是一个幽默风趣的AI助手，喜欢用轻松的方式解答问题。"],
    ["human", "你好，能用三句话简单介绍一下 LangChain 吗？"],
  ]);

  // 打印 AI 的回复
  console.log(`AI 回答: ${aiMsg.content}`);
}

// 捕获并优雅地处理错误
main().catch((error) => {
  console.error("发生错误:", error);
  process.exit(1);
});
```

### 10.5 运行你的程序

回到终端，使用 `tsx` 来运行你刚刚写的代码：

```bash
npx tsx src/index.ts
```

如果一切顺利，你会在终端看到 DeepSeek 给出的风趣回答。

### 10.6 深入理解：Agent 与工具调用

能聊天只是开始，LangChain 真正的威力在于**智能体（Agent）**。Agent 能像人一样思考、决策，并且调用外部工具来完成任务。比如，你告诉它"帮我查一下北京明天天气，并发一封邮件给我"，它就能自己调用查天气的 API 和发邮件的 API。

下面创建一个能联网搜索并查询天气的智能体。这里使用 **LangGraph 的 `createReactAgent`**，这是目前构建 Agent 的推荐方式。

**1. 安装新依赖**

```bash
npm install @langchain/langgraph @langchain/tavily
```

| 包 | 说明 |
|----|------|
| `@langchain/langgraph` | LangGraph 是 LangChain 新的核心，专为构建有状态的、多步骤的 Agent 应用而设计 |
| `@langchain/tavily` | Tavily 是专为 AI Agent 设计的联网搜索工具，用于获取实时信息 |

> 你需要去 Tavily 官网申请一个免费的 API Key，并加到 `.env` 文件中：
> ```ini
> TAVILY_API_KEY=你的Tavily_API密钥
> ```

**2. 编写 Agent 代码**

创建 `src/agent.ts` 文件：

```typescript
// src/agent.ts
import "dotenv/config";
import { ChatDeepSeek } from "@langchain/deepseek";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { TavilySearch } from "@langchain/tavily";

// 1. 定义工具 (Tools)

// --- 模拟天气查询工具 ---
const weatherTool = tool(
  async ({ location }) => {
    // 模拟 API 调用，实际项目可以换成真的天气 API
    return `2026年5月20日，${location} 的天气是：晴朗，24°C，微风。非常适合出门！`;
  },
  {
    name: "get_weather",
    description: "当用户询问某个城市的天气时，调用此工具。",
    schema: z.object({
      location: z.string().describe("城市名称，例如：北京"),
    }),
  }
);

// --- 联网搜索工具 ---
const searchTool = new TavilySearch({
  maxResults: 3, // 只获取前 3 条搜索结果
});

async function main() {
  // 2. 初始化 DeepSeek 模型
  const llm = new ChatDeepSeek({
    model: "deepseek-v4-flash",
    temperature: 0, // 做 Agent 时建议温度设低，保证决策稳定
  });

  // 3. 创建 Agent
  const agent = createReactAgent({
    llm: llm,
    tools: [weatherTool, searchTool], // 把工具交给 Agent
    messageModifier: "你是一个乐于助人的智能助手，可以根据需要调用工具来回答用户问题。",
  });

  // 4. 与 Agent 交互
  console.log("Agent 启动...");

  const result = await agent.invoke({
    messages: [
      { role: "user", content: "帮我查查今天北京的天气，顺便搜一下LangChain最新版本号。" },
    ],
  });

  // 5. 获取最终结果
  const finalMessage = result.messages[result.messages.length - 1];
  console.log(`Agent 最终回答: ${finalMessage.content}`);
}

main().catch(console.error);
```

**3. 运行 Agent**

```bash
npx tsx src/agent.ts
```

你会看到 Agent 先是判断需要调用两个不同的工具，然后分别获取天气和搜索结果，最后整合成一段流畅的回答。这就是 Agent 的核心魔力。
