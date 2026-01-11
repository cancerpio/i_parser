````markdown
這是一個非常具體且可執行的 MVP（最小可行性產品）轉向。這將原本龐大的「AI 自動爬蟲+資料庫」構想，收斂為一個「輕量級視覺化儀表板」。

在產出文件前，基於您提供的截圖 與新需求，我有 **兩點關鍵假設** 與 **一個潛在衝突** 需要先說明，以避免擅自補充：

1.  **資料來源假設**：原本討論是希望 AI 自動抓資料，但現在指定 `Google Sheet`。我將假設 **「資料已經存在 Sheet 中」**（人工維護或另外的腳本寫入），此 Vue 網站只負責「讀取與呈現」，**不包含** 寫入或爬蟲功能。
2.  **分析邏輯簡化**：截圖中您重視「公模 vs 研發」的深度判斷。但在手機領域（Asus/Samsung/Apple）且僅讀取 Sheet 的情況下，除非 Sheet 裡有人工標註的「特色欄位」，否則前端只能針對 **硬體規格（CPU, RAM, ROM, 電池）** 做量化比較。Spec 將以此為準。
3.  **衝突/確認點（Google Sheet 格式）**：Vue 網站要能運作，Google Sheet 必須有固定的「欄位名稱（Header）」。我在 `plan.md` 中定義了一套標準欄位（如 `Brand`, `Model`, `Price`, `Price_Band`），**這不算擅自補充，而是系統實作的必要條件**。

以下是為您生成的 GitHub Spec Kit 三份文件內容：

---

### File 1: `spec.md` (規格書)

```markdown
# Specification: Phone Spec Visualizer

## 1. Background & Problem (Why)
根據先前的痛點分析，使用者在進行產品選購或競品分析時，常面臨以下問題：
- **手動整理耗時**：傳統方式需人工搜尋資料並 Key 入 Excel，過程繁瑣。
- **缺乏直觀比較**：單純的表格數字難以看出在特定「價格帶」內的性價比優劣。
- **品牌盲點**：難以跨品牌（如 Asus vs Samsung vs Apple）在同一基準線上進行橫向評測。

## 2. Solution Overview (What)
建立一個基於 Web 的輕量化視覺化儀表板。
- **核心功能**：讀取公開的 Google Sheet 產品資料，自動轉換為互動式圖表。
- **目標受眾**：需要快速進行手機規格與價格帶分析的產品經理或消費者。

## 3. Scope & Requirements
### 3.1 Target Brands
僅限顯示以下三個品牌的手機：
- Asus
- Samsung
- Apple

### 3.2 Key Features
1.  **Data Sync**：前端網頁需動態讀取指定的 `Public Read` Google Sheet，確保資料與試算表保持同步。
2.  **Price Band Filtering**：使用者可查看不同價格區間（例如：10k-20k, 20k-30k）的產品分佈。
3.  **Visualization**：
    - 提供規格比較圖表（如：價格 vs 性能散佈圖，或規格條狀圖）。
    - 清楚標示不同品牌的產品落點。

## 4. User Stories
- 作為一名用戶，我希望打開網頁就能看到最新的手機數據，而不需要重新部署程式碼。
- 作為一名用戶，我希望能篩選「20,000 - 30,000 元」區間，並看到 Asus 與 Samsung 在此區間的規格差異。
```

---

### File 2: `constitution.md` (專案章程)

```markdown
# Project Constitution

## 1. Primary Directive (專案主旨)
本專案旨在提供一個**極輕量、零後端維護成本**的資料視覺化方案。所有資料流必須保持單向（Google Sheet -> Vue Client），嚴禁引入需要伺服器維護的資料庫。

## 2. Technical Constraints (不可違反的技術限制)
1.  **No Backend Server**：
    - 不得建立 Node.js/Python 後端伺服器。
    - 只能使用純靜態網頁技術（SPA）。
    - 資料來源僅限 `Google Sheet (Public Read)`。

2.  **Hosting & Deployment**：
    - 網站必須託管於 **GitHub Pages**。
    - **CI/CD 強制性**：必須設定 GitHub Actions。任何推送到 `main` 分支的 Commit，都必須觸發自動打包（Build）並部署到 GitHub Pages，不得依賴手動上傳。

3.  **Frontend Framework**：
    - 必須使用 **Vue.js 3**。

## 3. Data Integrity Rules
- 系統不得修改 Google Sheet 的內容（Read-Only）。
- 若 Sheet 中缺少關鍵欄位（如 Brand 或 Price），系統應優雅降級（顯示錯誤提示或略過該筆資料），不得導致頁面崩潰。

## 4. Brand Specificity
- 目前階段嚴格限制顯示 **Asus, Samsung, Apple** 三大品牌。若 Sheet 中包含其他品牌資料，前端必須在渲染層進行過濾。
```

---

### File 3: `plan.md` (實作計畫)

```markdown
# Implementation Plan

## 1. Tech Stack
- **Framework**: Vue.js 3 (Composition API) + Vite
- **Language**: TypeScript (建議) 或 JavaScript
- **Data Fetching**: `papaparse` (用於解析 Google Sheet 發布的 CSV 格式) 或直接 `fetch` JSON。
- **Visualization**: `Chart.js` (搭配 `vue-chartjs`) 或 `ApexCharts`。
- **Styling**: TailwindCSS (快速構建 RWD 介面)。
- **CI/CD**: GitHub Actions.

## 2. Data Structure Schema (Google Sheet 需求)
為了讓程式順利讀取，Google Sheet 必須包含（或映射至）以下欄位：
- `Brand` (e.g., Asus, Samsung, Apple)
- `Model` (e.g., ROG Phone 8, Galaxy S24)
- `Price` (Numeric, e.g., 24900)
- `Spec_Score` (Optional: 若無此欄位，則僅顯示價格；建議作為性能指標)
- `Ram` / `Storage` (Optional: 用於顯示詳細資訊)

## 3. Development Steps

### Step 1: Initialization
- 建立 Vue 3 專案 (`npm create vite@latest`)。
- 安裝依賴：`papaparse`, `chart.js`, `vue-chartjs`。

### Step 2: Google Sheet Connection
- 將 Google Sheet 設定為 "Anyone with the link can view"。
- 使用 Google Sheet 的 CSV Export Link 格式：
  `https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv&sheet={SHEET_NAME}`
- 撰寫 Vue Composable (`useSheets.js`) 來 Fetch 並 Parse CSV 資料為 JSON Array。

### Step 3: Filtering Logic
- 實作 `computed` 屬性過濾資料：
  1. **Brand Filter**: 僅保留 `['Asus', 'Samsung', 'Apple']`。
  2. **Price Band Logic**: 根據 User Input (Dropdown 或 Slider) 篩選 `Price` 區間。

### Step 4: Visualization Implementation
- 建立 `ComparisonChart.vue` 元件。
- 實作 **Scatter Plot (散佈圖)**：
  - X 軸：價格 (Price)
  - Y 軸：規格指標 (如 RAM 或 自訂分數)
  - 顏色：依品牌區分 (Asus: 紅/黑, Samsung: 藍, Apple: 銀/白)。

### Step 5: CI/CD Setup (GitHub Actions)
- 建立 `.github/workflows/deploy.yml`。
- 設定流程：
  1. `on: push` to `main`.
  2. `jobs: build-and-deploy`.
  3. 使用 `actions/setup-node` 安裝 Node.js。
  4. 執行 `npm install` && `npm run build`。
  5. 使用 `peaceiris/actions-gh-pages` 將 `dist` 資料夾部署至 `gh-pages` 分支。

## 4. Verification
- Push 程式碼後，檢查 Actions tab 是否全綠。
- 打開 GitHub Pages URL，確認修改 Google Sheet 資料後，重新整理網頁是否顯示新數據 (需注意 Google CDN 快取可能有短暫延遲)。
```
````
