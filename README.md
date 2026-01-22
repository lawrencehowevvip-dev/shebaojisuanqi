# 五险一金计算器

一个基于 Web 的社保公积金费用计算工具，帮助企业快速计算员工社保费用。

## 功能特性

- 📊 **Excel 数据导入** - 支持批量上传城市标准和员工工资数据
- 🧮 **自动计算** - 根据基数上下限自动计算缴费基数和公司缴纳金额
- 📋 **结果展示** - 清晰的表格展示计算结果
- 💾 **Excel 导出** - 一键导出计算结果为 Excel 文件

## 技术栈

- **前端框架**: Next.js 15 (App Router)
- **UI 样式**: Tailwind CSS
- **数据库**: Supabase (PostgreSQL)
- **Excel 处理**: SheetJS (xlsx)

## 项目结构

```
shebaojisuanqi/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── upload/        # 数据上传 API
│   │   ├── calculate/     # 计算逻辑 API
│   │   └── results/       # 结果查询 API
│   ├── page.tsx           # 主页
│   ├── upload/            # 数据上传页面
│   └── results/           # 结果展示页面
├── lib/                   # 工具函数
│   ├── supabase.ts       # Supabase 客户端
│   └── excelParser.ts    # Excel 解析工具
└── public/                # 静态资源
```

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/lawrencehowevvip-dev/shebaojisuanqi.git
cd shebaojisuanqi
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.local.example` 为 `.env.local`，并填入您的 Supabase 配置：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥
```

### 4. 创建数据库表

在 Supabase SQL Editor 中执行以下 SQL：

```sql
-- 城市标准表
CREATE TABLE cities (
  id SERIAL PRIMARY KEY,
  city_name TEXT NOT NULL,
  year TEXT NOT NULL,
  base_min INTEGER NOT NULL,
  base_max INTEGER NOT NULL,
  rate FLOAT NOT NULL
);

-- 员工工资表
CREATE TABLE salaries (
  id SERIAL PRIMARY KEY,
  employee_id TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  month TEXT NOT NULL,
  salary_amount INTEGER NOT NULL
);

-- 计算结果表
CREATE TABLE results (
  id SERIAL PRIMARY KEY,
  employee_name TEXT NOT NULL,
  avg_salary FLOAT NOT NULL,
  contribution_base FLOAT NOT NULL,
  company_fee FLOAT NOT NULL
);

-- 禁用行级安全（无需权限控制）
ALTER TABLE cities DISABLE ROW LEVEL SECURITY;
ALTER TABLE salaries DISABLE ROW LEVEL SECURITY;
ALTER TABLE results DISABLE ROW LEVEL SECURITY;
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 使用说明

1. **上传数据**
   - 访问 `/upload` 页面
   - 上传城市标准数据（Excel）
   - 上传员工工资数据（Excel）

2. **执行计算**
   - 点击"执行计算并存储结果"按钮
   - 系统自动计算每位员工的社保费用

3. **查看结果**
   - 访问 `/results` 页面查看计算结果
   - 点击"导出 Excel"下载结果文件

## Excel 数据格式

### 城市标准数据 (cities.xlsx)

| id | city_namte | year | rate | base_min | base_max |
|----|------------|------|------|----------|----------|
| 1  | 佛山       | 2024 | 0.14 | 4546     | 26421    |

### 员工工资数据 (salaries.xlsx)

| employee_id | employee_name | month | salary_amount |
|-------------|---------------|-------|---------------|
| E001        | 张三          | 202401| 8000          |

## 计算逻辑

1. 计算员工年度月平均工资
2. 根据城市基数上下限确定缴费基数：
   - 平均工资 < 基数下限 → 使用基数下限
   - 平均工资 > 基数上限 → 使用基数上限
   - 其他情况 → 使用平均工资
3. 计算公司缴纳金额 = 缴费基数 × 缴纳比例

## 部署

本项目可以部署到 Vercel、Netlify 等平台：

```bash
npm run build
npm start
```

## 许可证

MIT License

## 作者

Lawrence

---

Made with ❤️ using Next.js and Supabase
