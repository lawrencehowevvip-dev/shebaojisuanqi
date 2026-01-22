# 五险一金计算器 - 项目上下文管理中枢

## 项目目标
构建一个迷你的"五险一金"计算器Web应用，根据预设的员工工资数据和城市社保标准，计算出公司为每位员工应缴纳的社保公积金费用，并将结果清晰展示。

## 技术栈
| 类别 | 技术选型 |
|------|----------|
| 前端框架 | Next.js (App Router) |
| UI/样式 | Tailwind CSS |
| 数据库/后端 | Supabase (PostgreSQL + Serverless APIs) |
| Excel处理 | xlsx (SheetJS) |
| HTTP客户端 | fetch / Supabase JS Client |

---

## 数据库设计

### 1. cities（城市社保标准表）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| city_name | text | 城市名 |
| year | text | 年份 |
| base_min | int | 社保基数下限 |
| base_max | int | 社保基数上限 |
| rate | float | 综合缴纳比例（如 0.15 = 15%） |

### 2. salaries（员工工资表）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| employee_id | text | 员工工号 |
| employee_name | text | 员工姓名 |
| month | text | 年份月份（YYYYMM格式） |
| salary_amount | int | 该月工资金额 |

### 3. results（计算结果表）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| employee_name | text | 员工姓名 |
| avg_salary | float | 年度月平均工资 |
| contribution_base | float | 最终缴费基数 |
| company_fee | float | 公司缴纳金额 |

---

## 核心业务逻辑

### 计算函数执行步骤
1. 从 `salaries` 表中读取所有数据
2. 按 `employee_name` 分组，计算每位员工的"年度月平均工资"
3. 从 `cities` 表中获取目标城市（佛山）的 `year`、`base_min`、`base_max`、`rate`
4. 对每位员工，将"年度月平均工资"与基数上下限比较，确定"最终缴费基数"：
   - 低于下限 → 使用下限
   - 高于上限 → 使用上限
   - 在区间内 → 使用平均工资本身
5. 根据"最终缴费基数" × `rate`，计算"公司应缴纳金额"
6. **清空** `results` 表，将所有计算结果插入
7. 返回操作结果

### 数据范围说明
- **城市**：暂时固定为佛山（后续需扩展为多城市选择）
- **时间**：salaries表按特定年度范围筛选

---

## 前端页面结构

### `/` 主页
- **定位**：应用入口页面和导航中枢
- **布局**：两个并排或垂直排列的功能卡片
- **卡片1**：数据上传 → 跳转 `/upload`
- **卡片2**：结果查询 → 跳转 `/results`
- **设计参考**：Unsplash 办公/金融/数据相关图片

### `/upload` 数据上传与操作页
- **定位**：后台操作控制面板
- **功能**：
  - 按钮1：「上传城市标准数据」→ 上传Excel → 插入`cities`表
  - 按钮2：「上传员工工资数据」→ 上传Excel → 插入`salaries`表
  - 按钮3：「执行计算并存储结果」→ 触发核心计算逻辑 → 存入`results`表
- **反馈**：显示上传/计算状态和结果提示

### `/results` 结果查询与展示页
- **定位**：计算成果展示页面
- **功能**：
  - 页面加载时自动从`results`表获取数据
  - 使用Tailwind CSS样式展示表格
  - 表头：员工姓名、年度月平均工资、缴费基数、公司缴纳金额
  - 「导出Excel」按钮：将当前结果导出为Excel文件

---

## 开发任务清单（TodoList）

### 阶段一：项目初始化与环境搭建
- [ ] 1.1 使用 `npx create-next-app@latest` 创建Next.js项目
- [ ] 1.2 安装Tailwind CSS配置
- [ ] 1.3 安装依赖：`@supabase/supabase-js`、`xlsx`
- [ ] 1.4 创建Supabase项目，获取API密钥
- [ ] 1.5 在Supabase中创建三张数据表（cities、salaries、results）
- [ ] 1.6 配置环境变量（.env.local）：NEXT_PUBLIC_SUPABASE_URL、NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] 1.7 创建Supabase客户端工具函数（lib/supabase.ts）

### 阶段二：核心业务逻辑开发
- [ ] 2.1 创建Excel解析工具函数（lib/excelParser.ts）
  - 解析cities格式Excel
  - 解析salaries格式Excel
- [ ] 2.2 创建核心计算函数（app/api/calculate/route.ts）
  - 读取salaries数据并分组计算平均工资
  - 获取cities数据
  - 执行基数计算和费用计算
  - 清空results表并插入新数据
- [ ] 2.3 创建数据上传API（app/api/upload/cities/route.ts 和 app/api/upload/salaries/route.ts）
  - 接收Excel文件
  - 解析并验证数据
  - 插入对应数据表

### 阶段三：前端页面开发
- [ ] 3.1 主页（app/page.tsx）
  - 实现卡片布局
  - 添加导航链接
  - 应用Tailwind样式和背景图
- [ ] 3.2 数据上传页（app/upload/page.tsx）
  - 创建两个文件上传组件（分别对应cities和salaries）
  - 创建"执行计算"按钮
  - 添加状态提示和错误处理
- [ ] 3.3 结果展示页（app/results/page.tsx）
  - 实现数据获取逻辑（页面加载时）
  - 创建表格组件展示数据
  - 添加"导出Excel"功能

### 阶段四：测试与优化
- [ ] 4.1 使用提供的示例数据测试上传功能
- [ ] 4.2 测试计算逻辑的正确性
- [ ] 4.3 测试结果展示和导出功能
- [ ] 4.4 响应式布局适配
- [ ] 4.5 错误处理优化（上传失败、计算失败等场景）

---

## 项目文件结构规划
```
shebao/
├── .env.local                  # 环境变量
├── public/                     # 静态资源
├── lib/
│   ├── supabase.ts            # Supabase客户端
│   └── excelParser.ts         # Excel解析工具
├── app/
│   ├── page.tsx               # 主页
│   ├── upload/
│   │   └── page.tsx           # 数据上传页
│   ├── results/
│   │   └── page.tsx           # 结果展示页
│   ├── api/
│   │   ├── upload/
│   │   │   ├── cities/
│   │   │   │   └── route.ts   # 上传城市数据API
│   │   │   └── salaries/
│   │   │       └── route.ts   # 上传工资数据API
│   │   └── calculate/
│   │       └── route.ts       # 计算API
│   └── layout.tsx             # 根布局
├── package.json
└── tailwind.config.ts
```

---

## 待确认事项
- [ ] 示例Excel文件（cities和salaries）待提供
- [ ] Supabase项目信息待创建并配置
- [ ] Unsplash背景图选择

---

*本文件作为整个项目的上下文管理中枢，所有开发工作应参考此文件执行*
