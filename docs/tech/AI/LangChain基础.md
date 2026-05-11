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

支持 Python 和 TypeScript 双版本。

## 核心能力

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

## 优劣

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

## 环境搭建（Python）

### 版本要求
- Python 3.12.1
- LangChain 0.3
- Windows 10

Python 需 3.8.1 以上，使用 `venv` 虚拟环境隔离依赖。

### Jupyter Notebook
使用 Jupyter Notebook（`.ipynb`）或 VS Code Jupyter 插件运行 Python 代码。在命令行前加 `!` 执行 Shell 命令。

### 虚拟环境
Python 3.10+ 内置环境隔离：

```bash
# 创建虚拟环境
python -m venv .test

# 激活（macOS）
source .test/bin/activate

# 激活（Windows CMD）
.test\Scripts\activate.bat

# 激活（Windows PowerShell）
.test\Scripts\Activate.ps1
```

## LangChain 实例

### 创建 LLM
```
"帮我起一个名字" → LLM.invoke() → "二蛋"
```

### 自定义提示词模板
```python
from langchain.prompts import PromptTemplate
# "帮我起一个具有{country}特色的名字" → Prompt.format(country='美国') → "托尼"
```

### 输出解释器
```python
from langchain.schema import OutputParser
# "帮我起4个具有中国特色的名字" → OutputParser.parse() → ['赵六', '王五', '张三', '李四']
```

## ChatModels：磨平不同 LLM 的差异

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

**异步事件：**

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

## 模型上下文窗口与 Token

### 上下文限制原因

- **计算复杂度**：Transformer 自注意力机制复杂度 O(n²)，序列越长计算量平方增长
- **硬件限制**：GPU 显存有限，长序列需要更多显存，响应时间更长
- **训练数据限制**：预训练数据多为短文本，模型难学习长距离依赖
- **注意衰减**：序列越长，模型对早期信息注意力下降，导致遗忘

### 超出上下文的处理方法

1. **记忆增强（RAG）**
2. **滑动窗口**
3. **新型架构**

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

## 速率限制与缓存机制

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

## 本地大模型部署

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

## 大模型工具调用原理

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

## PromptTemplate：提示词工程实践

<!-- TODO: 补充 PromptTemplate 详细内容 -->
