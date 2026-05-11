---
title: React 实战经验总结
date: 2026-05-11
category: 前端
tags:
  - React
  - 最佳实践
  - 性能优化
  - 踩坑记录
sticky: true
---

# React 实战经验总结

从 class 组件写到 hooks，从 Redux 写到 Zustand，React 生态的进化速度让人又爱又恨。这里记录一些真正在生产环境里跑过的经验。

---

## 一、状态管理：选型比实现重要

### 1. 不同场景不同方案

| 场景 | 推荐 | 理由 |
|------|------|------|
| 组件内部状态 | `useState` / `useReducer` | 够用，别过度设计 |
| 跨组件共享（轻量） | `useContext` + `useReducer` | 不需要额外依赖 |
| 全局状态（中等复杂） | Zustand | API 极简，TS 支持好，无 boilerplate |
| 服务端状态（缓存/同步） | TanStack Query | 比你手写的任何方案都好 |
| 复杂表单 | React Hook Form | 性能最优，原生 HTML 表单体验 |
| URL 状态 | `useSearchParams` | 可分享、可书签的状态 |

### 2. 为什么我不推荐 Redux Toolkit

不是它不好，是大多数项目不需要。如果你 70% 的状态其实是服务端缓存，那就该用 TanStack Query；如果你只有几个跨组件共享的值，Zustand 10 行代码搞定。

```tsx
// Zustand：定义 store
import { create } from 'zustand'

interface BearStore {
  bears: number
  increase: () => void
}

const useBearStore = create<BearStore>((set) => ({
  bears: 0,
  increase: () => set((state) => ({ bears: state.bears + 1 })),
}))

// 使用：零 boilerplate
function Counter() {
  const bears = useBearStore((s) => s.bears)
  const increase = useBearStore((s) => s.increase)
  return <button onClick={increase}>{bears} bears</button>
}
```

### 3. 服务端状态用 TanStack Query

```tsx
// ✅ 自动缓存、去重请求、后台刷新、乐观更新 —— 全都有了
const { data, isLoading, error } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  staleTime: 5 * 60 * 1000,  // 5 分钟内不重新请求
})
```

千万别自己写 `useEffect` + `fetch` + `useState` 来管理服务端数据——你会掉进缓存失效、竞态条件、重复请求的坑里。

---

## 二、Hooks：用了 6 年，还是容易踩坑

### 1. `useEffect` 的依赖数组

```tsx
// ❌ 无限循环
const [count, setCount] = useState(0)
useEffect(() => {
  setCount(count + 1)  // 每次渲染都触发 effect
}, [count])            // count 变了 → effect 执行 → count 变了 → 死循环

// ✅ 改成函数式更新
useEffect(() => {
  setCount((prev) => prev + 1)  // 不依赖外部 count
}, [])                           // 只在挂载时执行一次
```

### 2. `useCallback` / `useMemo` 不是免费的

```tsx
// ❌ 滥用：比不 memo 还慢
const handleClick = useCallback(() => {
  doSomething(count)
}, [count])  // count 每次变，回调每次重建，memo 白做了

// ✅ 当且仅当传给子组件（且子组件用了 React.memo）时才用
<ExpensiveChild onAction={handleClick} />  // 这里值得 memo
```

**经验法则：profile 之前不要 memo。** React 18+ 的自动批处理和并发渲染已经优化了很多场景。

### 3. `useRef` 的两种用途

```tsx
// 1. DOM 引用
const inputRef = useRef<HTMLInputElement>(null)
// <input ref={inputRef} />

// 2. 跨渲染的"逃逸仓"——不触发重新渲染的可变值
const timerRef = useRef<number | null>(null)
const latestProps = useRef(props)
latestProps.current = props  // 始终指向最新的 props

// 在 setTimeout/定时器里读取 latestProps.current
// 不用担心闭包陷阱
```

### 4. 闭包陷阱

```tsx
// ❌ 经典 bug：3 秒后 count 还是 0
const [count, setCount] = useState(0)
function handleClick() {
  setTimeout(() => {
    alert(count)  // 闭包捕获了点击时的 count 值
  }, 3000)
}

// ✅ 方案 1：用 ref 存储最新值
const countRef = useRef(count)
countRef.current = count

// ✅ 方案 2：函数式更新（如果只是 setState）
setCount((prev) => prev + 1)
```

### 5. 自定义 Hook 的命名和设计

```tsx
// ✅ use 开头，返回清晰
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

// ❌ 不要在 hook 里做太多事
function useEverything() { ... }  // 拆成 useA + useB
```

---

## 三、组件设计：组合优于继承

### 1. 受控 vs 非受控

```tsx
// ✅ 同时支持受控和非受控
interface InputProps {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
}

function Input({ value: controlledValue, defaultValue, onChange }: InputProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue

  function handleChange(next: string) {
    if (!isControlled) setInternalValue(next)
    onChange?.(next)
  }
  // ...
}
```

这是 Ant Design 的做法——库组件应该同时支持两种模式。

### 2. Compound Components 模式

```tsx
// ✅ 比 props 配置更灵活
<Tabs>
  <Tabs.List>
    <Tabs.Tab id="a">Tab A</Tabs.Tab>
    <Tabs.Tab id="b">Tab B</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel id="a">Content A</Tabs.Panel>
  <Tabs.Panel id="b">Content B</Tabs.Panel>
</Tabs>

// 实现要点：用 Context 在父子之间传递状态
const TabsContext = createContext<{
  active: string
  setActive: (id: string) => void
} | null>(null)
```

### 3. Render Props 已死，但 slot 模式长存

```tsx
// ✅ 现在的"slot"模式：传 ReactNode 或 render 函数
interface ListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  empty?: ReactNode
}

// 使用
<List
  items={users}
  renderItem={(user) => <UserCard user={user} />}
  empty={<Empty description="暂无数据" />}
/>
```

### 4. `forwardRef` + `useImperativeHandle`

```tsx
// ✅ 暴露方法而非 DOM
const Modal = forwardRef<ModalHandle, ModalProps>((props, ref) => {
  const [open, setOpen] = useState(false)

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
  }))

  return open ? <div className="modal">{props.children}</div> : null
})

// 使用
const modalRef = useRef<ModalHandle>(null)
<Modal ref={modalRef}>内容</Modal>
<button onClick={() => modalRef.current?.open()}>打开</button>
```

---

## 四、性能：过早优化的反面——不知如何优化的反面

### 1. React.memo 的正确用法

```tsx
// ❌ 给所有组件都包 memo——浪费
const SimpleText = memo(({ text }: { text: string }) => <p>{text}</p>)

// ✅ 只给渲染成本高的组件包 memo
const ExpensiveChart = memo(Chart, (prev, next) => {
  return prev.data === next.data  // 自定义比较
})
```

### 2. `useMemo` 用在计算昂贵的场景

```tsx
// ✅ 大数组的过滤/排序/聚合
const filtered = useMemo(
  () => items.filter(complexFilter).sort(complexSort),
  [items, complexFilter, complexSort]
)
```

### 3. 避免在渲染中创建对象/数组（传递 props 时）

```tsx
// ❌ 每次渲染 style 都是新对象，memo 的子组件会重新渲染
<Child style={{ color: 'red' }} />

// ✅ 提取到组件外部
const RED_STYLE = { color: 'red' } as const
<Child style={RED_STYLE} />

// ❌ 同上，匿名函数每次都是新引用
<Child onChange={(v) => setValue(v)} />

// ✅ 用 useCallback（仅当 Child 是 memo 的）
const handleChange = useCallback((v) => setValue(v), [])
<Child onChange={handleChange} />
```

### 4. 代码分割：`lazy` + `Suspense`

```tsx
const AdminPanel = lazy(() => import('./AdminPanel'))

function App() {
  return (
    <Suspense fallback={<Skeleton />}>
      <AdminPanel />
    </Suspense>
  )
}
```

### 5. 大列表虚拟化

```tsx
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  })

  return (
    <div ref={parentRef} style={{ height: '100vh', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: virtualItem.start,
              height: virtualItem.size,
            }}
          >
            {items[virtualItem.index].name}
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## 五、数据请求：别再用 useEffect 了

### 1. TanStack Query 的基本模式

```tsx
function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.getUser(userId),
  })

  if (isLoading) return <Skeleton />
  if (error) return <ErrorDisplay error={error} />
  return <div>{data.name}</div>
}
```

### 2. Mutation + 乐观更新

```tsx
const mutation = useMutation({
  mutationFn: (newTodo: Todo) => api.addTodo(newTodo),
  // 乐观更新：先改 UI，失败了回滚
  onMutate: async (newTodo) => {
    await queryClient.cancelQueries({ queryKey: ['todos'] })
    const previous = queryClient.getQueryData(['todos'])
    queryClient.setQueryData(['todos'], (old) => [...old, newTodo])
    return { previous }  // 用于回滚
  },
  onError: (err, newTodo, context) => {
    queryClient.setQueryData(['todos'], context.previous)  // 回滚
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] })  // 最终同步
  },
})
```

### 3. 竞态处理

```tsx
// ❌ 用 useEffect 取数据——没有竞态保护
useEffect(() => {
  fetch(`/api/user/${id}`).then(setUser)
}, [id])  // id 快速切换 → 旧结果可能覆盖新结果

// ✅ TanStack Query 自动处理
const { data } = useQuery({ queryKey: ['user', id], queryFn: ... })
```

---

## 六、踩坑实录

### 坑 1：`useState` 的初始化函数只执行一次

```tsx
// ❌ 你以为每次渲染都会调用 expensiveInit？不会。
const [state, setState] = useState(expensiveInit())

// ✅ 传函数才惰性初始化
const [state, setState] = useState(() => expensiveInit())
```

### 坑 2：`setState` 是异步的

```tsx
// ❌ 紧接着读 state 还是旧值
setCount(count + 1)
console.log(count)  // 旧值！

// ✅ 函数式更新 + 用 useEffect 读
setCount((prev) => prev + 1)
useEffect(() => { console.log(count) }, [count])
```

### 坑 3：Strict Mode 下 effect 执行两次

```tsx
// React 18 Strict Mode：开发环境下 mount → unmount → mount
// 这意味着你的 effect 会执行两次！
useEffect(() => {
  const ws = new WebSocket(url)
  // ❌ 如果没有 cleanup，会创建两个连接
  return () => ws.close()  // ✅ 必须有 cleanup
}, [url])
```

**这不是 bug，是帮你发现缺少 cleanup 的设计。**

### 坑 4：key 用 index

```tsx
// ❌ 列表中间增删时，key 错位导致状态混乱
{items.map((item, index) => (
  <Todo key={index} item={item} />  // 删了第 2 项，第 3 项 key 变成 2
))}

// ✅ 用稳定的唯一 ID
{items.map((item) => (
  <Todo key={item.id} item={item} />
))}
```

### 坑 5：`useEffect` 里用 async 函数

```tsx
// ❌ useEffect 不能直接传 async 函数
useEffect(async () => {
  const data = await fetchData()
  setData(data)
}, [])

// ✅ 内部定义再调用
useEffect(() => {
  async function load() {
    const data = await fetchData()
    setData(data)
  }
  load()
}, [])
```

### 坑 6：在渲染中读写 ref

```tsx
// ❌ 在渲染期间修改 ref——不可预测
function Component() {
  ref.current = calculateSomething()  // 其他并发渲染可能读到不同值
  return <div>{ref.current}</div>
}

// ✅ ref 的读写放在 effect 或 event handler 里
useEffect(() => {
  ref.current = calculateSomething()
})
```

### 坑 7：没有给 Context value 做 memo

```tsx
// ❌ 每次渲染都是新的 value 对象，所有消费者都重新渲染
<MyContext.Provider value={{ user, setUser }}>
  {children}
</MyContext.Provider>

// ✅ memo 住 value
const value = useMemo(() => ({ user, setUser }), [user])
<MyContext.Provider value={value}>
  {children}
</MyContext.Provider>
```

### 坑 8：`flushSync` 的滥用

```tsx
// ⚠️ flushSync 强制同步渲染，绕过了 React 18 的自动批处理
// 只在必须同步读取 DOM 时才用
flushSync(() => {
  setItems([...items, newItem])
})
// 此时 items 的 DOM 已经更新
scrollToBottom()
```

---

## 七、TypeScript 在 React 中的最佳实践

### 1. 组件 Props 类型

```tsx
// ✅ 用 interface 而不是 type（可扩展性更好）
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'ghost'
  loading?: boolean
}

// ✅ 区分 Props 和 ComponentProps
// Props = 用户传入的
// 内部可能还有更多状态（不需要导出）
```

### 2. `ReactNode` vs `ReactElement`

```tsx
// ✅ children 类型用 ReactNode（最宽泛）
interface CardProps {
  children: ReactNode        // string | number | boolean | null | undefined | ReactElement | ...
  title: string
}
// ❌ 不要用 JSX.Element 或 ReactElement，太窄了
```

### 3. 事件处理

```tsx
// ✅ 用 React 内置事件类型
const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
  console.log(e.target.value)
}

const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
  e.preventDefault()
}
```

### 4. `useRef` 的类型

```tsx
// 只读 DOM ref（不可变）
const divRef = useRef<HTMLDivElement>(null)        // RefObject<T>

// 可变 ref（可赋值）
const timerRef = useRef<number | null>(null)        // MutableRefObject<T | null>
const timerRef = useRef<number>(0)                  // MutableRefObject<T>
```

### 5. 泛型组件

```tsx
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => ReactNode
  getKey: (item: T) => string
}

// 使用时有类型推断
<List items={users} renderItem={(user) => (  // user 自动推断为 User
  <div>{user.name}</div>
)} getKey={(user) => user.id} />
```

---

## 八、工程化实践

### 1. 目录结构

```
src/
├── components/        # 通用组件
│   ├── ui/            # Button、Input、Modal 等基础组件
│   └── business/      # 业务组件
├── hooks/             # 自定义 hooks
├── stores/            # Zustand / 全局状态
├── services/          # API 层（请求函数）
├── pages/             # 页面入口（路由级别）
├── lib/               # 纯函数工具库
├── types/             # 全局类型定义
└── constants/         # 常量
```

### 2. API 层的封装

```tsx
// services/user.ts
export const userService = {
  getById: (id: string) => api.get<User>(`/users/${id}`),
  list: (params: UserListParams) => api.get<PaginatedResponse<User>>('/users', { params }),
  create: (data: CreateUserDTO) => api.post<User>('/users', data),
}

// hooks/useUser.ts —— 组合 API + 状态
export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getById(id),
    enabled: !!id,
  })
}
```

### 3. 错误边界

```tsx
class ErrorBoundary extends React.Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
    // 上报到监控平台
  }

  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}
```

React 团队还没给函数组件提供 Error Boundary 的原生方案。如果你在用 `react-error-boundary` 这个库，它能提供函数式 API。

### 4. 环境变量

```
VITE_API_BASE_URL=https://api.example.com    # Vite 项目用 VITE_ 前缀
```

```tsx
// 使用
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})
```

---

## 九、调试技巧

### 1. React DevTools

- **Profiler**：录制交互，看哪些组件渲染了、渲染了多久
- **Components tab**：实时查看 props / state / hooks / context
- **Highlight updates**：可视化哪些组件在重新渲染

### 2. 快速定位重渲染

```tsx
// 开发时在组件里加一行
const renders = useRef(0)
useEffect(() => { renders.current++ })
console.log(`[${Component.name}] render #${renders.current}`)
```

或者直接用 `why-did-you-render` 库。

### 3. 追踪 prop 变化

```tsx
function useWhyDidYouUpdate(name: string, props: Record<string, unknown>) {
  const previousProps = useRef<Record<string, unknown>>({})

  useEffect(() => {
    if (previousProps.current) {
      const changed: Record<string, [unknown, unknown]> = {}
      Object.keys({ ...previousProps.current, ...props }).forEach((key) => {
        if (previousProps.current[key] !== props[key]) {
          changed[key] = [previousProps.current[key], props[key]]
        }
      })
      if (Object.keys(changed).length) {
        console.log(`[${name}] changed props:`, changed)
      }
    }
    previousProps.current = props
  })
}
```

---

## 十、React 的哲学

写了十年 React，最大的体会是：**React 在变得越来越"简单"，但这种简单的背后是更复杂的心智模型。**

Server Components、Suspense、Concurrent Rendering——这些东西不是为了让你写更多代码，而是为了让你可以少写代码（少写 loading 状态、少写竞态处理、少写性能优化）。

几条核心原则：

1. **UI 是状态的函数** — `UI = f(state)`，不要操作 DOM，操作 state
2. **组合 > 继承** — React 的设计哲学就是组合，Hooks 是组合的极致体现
3. **数据流单向** — 状态从上往下流，事件从下往上冒
4. **不要过早抽象** — 出现三次以上再考虑抽取
5. **先让功能跑通，再优化性能** — profiler 之前的所有优化都是猜测
6. **理解 Concurrent React** — `useTransition`、`useDeferredValue` 是性能优化的未来
