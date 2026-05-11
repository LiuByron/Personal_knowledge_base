---
title: Vue 实战经验总结
date: 2026-05-11
category: 前端
tags:
  - Vue
  - 最佳实践
  - 性能优化
  - 踩坑记录
sticky: true
---

# Vue 实战经验总结

从 Vue 2 写到 Vue 3，从 Options API 到 Composition API，踩过的坑比走过的路还多。这里记录一些真正在项目里验证过的经验。

---

## 一、响应式：你以为你懂，其实你没懂

### 1. `ref` vs `reactive` 的选择

| 场景 | 推荐 | 理由 |
|------|------|------|
| 基本类型 | `ref` | `reactive` 不支持基本类型 |
| 单个对象/表单 | `ref` | 方便整体替换（如接口回填） |
| 数组 | `ref` | `reactive` 的数组解构会丢失响应式 |
| 复杂嵌套对象且不需要整体替换 | `reactive` | 访问时不用 `.value`，代码更干净 |

**核心原则：不确定就用 `ref`。** `ref` 永远是"安全"的选择。

```ts
// ❌ 坑：reactive 的数组问题
const list = reactive([1, 2, 3])
// 解构后失去响应式
const [first] = list  // first 不是响应式的

// ✅ 正确做法
const list = ref([1, 2, 3])
const first = computed(() => list.value[0])
```

### 2. `watchEffect` 的隐藏陷阱

```ts
// ❌ 这段代码会导致无限循环
const count = ref(0)
watchEffect(() => {
  count.value++  // 触发了自己监听的变化！
})

// ✅ 正确做法：确保 watchEffect 不修改它读取的值
watchEffect(() => {
  console.log(`count is: ${count.value}`)
})
```

**规则：`watchEffect` 里面读取了什么，就不要去修改什么。**

### 3. `shallowRef` 的实战场景

大数据列表、第三方库实例（ECharts、地图 SDK），用 `shallowRef`：

```ts
// ✅ 地图实例不需要深层响应式，省去大量 proxy 开销
const mapInstance = shallowRef<AMap.Map | null>(null)

// 更新时整体替换
mapInstance.value = new AMap.Map('container', options)
```

### 4. `toRef` 的妙用

```ts
// ✅ 从 props 中提取单个属性，保持响应式连接
const { title } = toRefs(props)        // 多个
const title = toRef(props, 'title')    // 单个

// ❌ 常见错误：直接解构 props
const { title } = props  // 失去响应式！
```

---

## 二、组件设计：6 条铁律

### 1. Props 向下，Events 向上

这是 Vue 的"单向数据流"核心。永远不要让子组件直接修改 props。

```vue
<script setup>
// ❌ 不要这样做
const props = defineProps<{ modelValue: string }>()
function handleChange(val: string) {
  props.modelValue = val  // 控制台警告！
}

// ✅ 正确方式
const emit = defineEmits<{ 'update:modelValue': [val: string] }>()
function handleChange(val: string) {
  emit('update:modelValue', val)
}
</script>
```

### 2. `defineExpose` 少用

```vue
<script setup>
// ⚠️ 谨慎：暴露了内部状态，破坏封装性
defineExpose({ validate, reset, formData })
</script>
```

只在以下场景用 `defineExpose`：
- 表单组件的 `validate` / `reset`
- 模态框的 `open` / `close`
- 自定义指令需要操作 DOM

### 3. slot 优于 props 传组件

```vue
<!-- ❌ 通过 props 传组件名 -->
<DataTable :row-action="DeleteButton" />

<!-- ✅ 用 slot，更灵活 -->
<DataTable>
  <template #row-action="{ row }">
    <DeleteButton :item="row" @deleted="refresh" />
  </template>
</DataTable>
```

### 4. v-model 不是银弹

```vue
<!-- ❌ 滥用 v-model：一个组件十几个 v-model -->
<FormGenerator
  v-model:name="form.name"
  v-model:age="form.age"
  v-model:email="form.email"
  v-model:phone="form.phone"
  v-model:address="form.address"
/>

<!-- ✅ 超过 3 个 v-model，考虑传整个对象 + 一个 update 事件 -->
<FormGenerator v-model="form" />
```

### 5. 异步组件的加载状态

```ts
import { defineAsyncComponent } from 'vue'

const HeavyChart = defineAsyncComponent({
  loader: () => import('./HeavyChart.vue'),
  loadingComponent: ChartSkeleton,  // 加载中骨架屏
  errorComponent: ChartError,       // 加载失败占位
  delay: 200,                       // 200ms 后才显示 loading（避免闪烁）
  timeout: 10000,                   // 10s 超时
})
```

### 6. 用 `shallowRef` + 手动触发优化大对象

```vue
<script setup>
// 当你需要批量修改一个对象的很多属性时
const state = shallowRef({ a: 1, b: 2, c: 3 })

function batchUpdate() {
  // 直接 mutate，然后整体替换触发更新
  const newState = { ...state.value }
  newState.a = 10
  newState.b = 20
  newState.c = 30
  state.value = newState
}
</script>
```

---

## 三、Composition API：从入门到不写 bug

### 1. Composables 命名规范

```ts
// ✅ 以 use 开头，一看就知道是 composable
export function useUser() { ... }
export function useDebounce() { ... }
export function useLocalStorage() { ... }
```

### 2. Composable 的"干净"返回

```ts
// ❌ 返回太乱，调用方不知道哪个是 ref 哪个是 function
export function useSearch() {
  const keyword = ref('')
  const results = ref([])
  const loading = ref(false)
  const search = async () => { ... }
  return { keyword, results, loading, search }
}

// ✅ 返回值分组，带命名空间
export function useSearch() {
  const state = reactive({ keyword: '', results: [], loading: false })
  const search = async () => { ... }
  const reset = () => { ... }
  return { state: readonly(state), search, reset }
}
```

### 3. 生命周期：`onMounted` 里不要忘了清理

```ts
// ❌ 内存泄漏
onMounted(() => {
  window.addEventListener('resize', handleResize)
  setInterval(pollData, 5000)
})

// ✅ 正确清理
onMounted(() => {
  window.addEventListener('resize', handleResize)
  const timer = setInterval(pollData, 5000)

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    clearInterval(timer)
  })
})
```

**`watch` / `watchEffect` 在 `setup` 中会自动清理，这是 Vue 3 的优点。**

### 4. `provide/inject` 的实践经验

```ts
// ✅ 用 Symbol 做 key，避免命名冲突
// types.ts
export const USER_KEY = Symbol('user') as InjectionKey<Ref<User>>

// 父组件
provide(USER_KEY, readonly(currentUser))

// 子组件
const user = inject(USER_KEY)
if (!user) throw new Error('useUser() must be used inside <UserProvider>')
```

---

## 四、性能：不提前优化，但要知道怎么优化

### 1. `v-memo` — 最被低估的指令

```vue
<!-- 只有 item.id 变了才重新渲染这一行 -->
<div v-for="item in list" :key="item.id" v-memo="[item.id, item.updatedAt]">
  <!-- 复杂渲染 -->
</div>
```

### 2. `v-once` — 静态内容的终极优化

```vue
<!-- 只渲染一次，后续永不更新 -->
<div v-once>
  <h1>{{ siteTitle }}</h1>
  <p>{{ description }}</p>
</div>
```

### 3. `computed` 缓存 vs 方法调用

```vue
<!-- ❌ 模板中调用方法，每次重新渲染都执行 -->
<div>{{ formatPrice(price) }}</div>

<!-- ✅ 用 computed，只有 price 变化才重算 -->
<div>{{ formattedPrice }}</div>
```

### 4. 大列表用虚拟滚动

不要自己写，直接用 `vue-virtual-scroller` 或 `@tanstack/vue-virtual`。

### 5. 图片懒加载

```vue
<img v-lazy="imageUrl" />
<!-- 用 vue-lazyload 指令，不进入视口不加载 -->
```

### 6. KeepAlive 的正确打开方式

```vue
<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="cachedViews">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup>
// 动态缓存：只有列表页缓存，详情页不缓存
const cachedViews = ref(['ArticleList'])
</script>
```

---

## 五、状态管理：Pinia 比 Vuex 好用太多

### 1. Store 结构

```ts
// stores/user.ts
export const useUserStore = defineStore('user', () => {
  // state
  const user = ref<User | null>(null)
  const token = useLocalStorage('token', '')

  // getter
  const isLoggedIn = computed(() => !!token.value)

  // action
  async function login(credentials: Credentials) {
    const res = await api.login(credentials)
    user.value = res.user
    token.value = res.token
  }

  function logout() {
    user.value = null
    token.value = ''
  }

  return { user, token, isLoggedIn, login, logout }
})
```

Setup Store 风格（`defineStore('id', () => {...})`）比 Options Store 更灵活——你可以用 watcher、composable、直接使用其他 store。

### 2. Store 之间的依赖

```ts
// ✅ 直接在 action 里调用另一个 store
export const useCartStore = defineStore('cart', () => {
  const userStore = useUserStore()  // 注意：只能在函数体内调用

  async function checkout() {
    if (!userStore.isLoggedIn) {
      throw new Error('请先登录')
    }
    // ...
  }
})
```

### 3. 不要在 store 外直接修改 state

```ts
// ❌
const cartStore = useCartStore()
cartStore.items.push(newItem)  // 绕过了 action 逻辑

// ✅ 通过 action 封装
cartStore.addItem(newItem)
```

---

## 六、踩坑实录：那些年我们犯过的错

### 坑 1：`v-for` 和 `v-if` 的优先级

```vue
<!-- Vue 3：v-if 优先级 > v-for -->
<!-- ❌ v-if 引用了 v-for 的变量，会报错 -->
<li v-for="item in items" v-if="item.visible">
  {{ item.name }}
</li>

<!-- ✅ 先用 computed 过滤 -->
<li v-for="item in visibleItems" :key="item.id">
  {{ item.name }}
</li>
```

### 坑 2：直接修改 props 对象的属性

```ts
// ❌ 没有警告但很危险
const props = defineProps({ config: Object })
props.config.theme = 'dark'  // 如果父组件重新渲染，修改会丢失

// ✅ 用本地副本
const localConfig = reactive({ ...props.config })
```

### 坑 3：`watch` 默认不深度监听（Vue 3）

```ts
// ❌ 对象内部属性变化不会触发
watch(obj, (val) => { ... })

// ✅ 需要显式开启 deep
watch(obj, (val) => { ... }, { deep: true })

// ✅ 或者直接监听具体属性
watch(() => obj.nested.value, (val) => { ... })
```

### 坑 4：`onMounted` 中的异步导致组件已卸载

```ts
onMounted(async () => {
  const data = await fetchData()  // 如果组件已经卸载……
  state.value = data              // 这行会报 warning
})

// ✅ 加守卫
let isAlive = true
onMounted(async () => {
  const data = await fetchData()
  if (!isAlive) return
  state.value = data
})
onBeforeUnmount(() => { isAlive = false })
```

### 坑 5：`transition` 组件要求单一子元素

```vue
<!-- ❌ transition 内部不能有多个根元素 -->
<transition>
  <div v-if="show">A</div>
  <div v-else>B</div>
</transition>

<!-- ✅ 用 key 切换 -->
<transition>
  <div :key="show ? 'a' : 'b'">{{ show ? 'A' : 'B' }}</div>
</transition>
```

### 坑 6：SSR 水合不匹配

```vue
<script setup>
// ❌ 服务端渲染时 navigator 不存在
const isMobile = navigator.userAgent.includes('Mobile')

// ✅ 在 onMounted 中访问浏览器 API
const isMobile = ref(false)
onMounted(() => {
  isMobile.value = /Mobile/.test(navigator.userAgent)
})
</script>
```

### 坑 7：不稳定的组件引用

```vue
<script setup>
// ❌ 用 string ref 在 <script setup> 中不可用
const inputRef = ref('myInput')     // 这种写法已经过时
const el = ref<HTMLElement | null>(null)  // ✅ template ref 正确写法
</script>
```

---

## 七、工程化：让项目活得更久

### 1. ESLint 配置

至少要开这几条规则：
- `vue/no-mutating-props` — 禁止修改 props
- `vue/require-v-for-key` — 强制 v-for 有 key
- `vue/component-name-in-template-casing` — 统一 PascalCase
- `vue/define-macros-order` — defineProps/defineEmits 顺序

### 2. TypeScript 在 Vue 中的最佳实践

```vue
<script setup lang="ts">
// ✅ 为 emit 定义类型
const emit = defineEmits<{
  update: [id: number, value: string]
  delete: [id: number]
}>()

// ✅ 为 template ref 标注类型
const formRef = ref<InstanceType<typeof MyForm> | null>(null)

// ✅ 为 provide/inject 用 InjectionKey
import type { InjectionKey, Ref } from 'vue'
export const THEME_KEY: InjectionKey<Ref<'light' | 'dark'>> = Symbol('theme')
</script>
```

### 3. 自动化 import

使用 `unplugin-auto-import` 和 `unplugin-vue-components`：
- `ref`、`computed`、`watch` 不用手动 import
- 组件自动按需导入，减少手动注册

### 4. 目录结构建议

```
src/
├── components/      # 通用组件
│   └── ui/          # UI 基础组件（button、input……）
├── composables/     # 可组合函数
├── stores/          # Pinia stores
├── views/           # 页面
├── api/             # 接口层
├── utils/           # 纯工具函数
├── types/           # 全局类型
└── constants/       # 常量
```

### 5. 环境变量管理

```
.env                # 所有环境共享
.env.local          # 本地覆盖（加入 .gitignore）
.env.development    # 开发环境
.env.production     # 生产环境
```

---

## 八、调试技巧

### 1. Vue DevTools

- **Timeline**：找出哪个组件重渲染了，为什么重渲染
- **Pinia tab**：实时查看每个 store 的状态和时间旅行调试
- **Open in editor**：Vite 配置后可以直接在 VS Code 打开组件

### 2. 快速定位重渲染

```vue
<script setup>
// 开发环境下打印组件的重渲染触发原因
import { onUpdated, getCurrentInstance } from 'vue'
if (import.meta.env.DEV) {
  onUpdated(() => {
    console.log(`[${getCurrentInstance()?.type.__name}] re-rendered`)
  })
}
</script>
```

### 3. 排查 props 变化

```ts
watch(() => ({ ...props }), (newVal, oldVal) => {
  Object.keys(newVal).forEach(key => {
    if (newVal[key] !== oldVal[key]) {
      console.log(`Prop "${key}" changed:`, oldVal[key], '→', newVal[key])
    }
  })
}, { deep: true })
```

---

## 九、写在最后

写 Vue 这些年最大的感悟：**框架帮你做的事情越多，越要理解它在做什么。** 响应式系统的原理、虚拟 DOM 的 diff 逻辑、编译器的静态提升——这些"底层知识"才是你排查诡异 bug 时的底牌。

几条一直遵循的原则：

1. **先用官方工具，再考虑社区方案** — Pinia > 自己造的 store，Vite > 自己配的 webpack
2. **computed 优先于 watch** — 能用 computed 解决的问题不用 watch，computed 自动管理依赖和缓存
3. **组件越小越好** — 超过 300 行的组件就该拆了
4. **不要提前抽象** — 出现 3 次以上重复代码再抽取 composable
5. **读源码不是炫技** — 但你至少要读过 `ref()` 和 `reactive()` 的实现
