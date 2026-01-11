# Phone Spec Visualizer

一個純前端（無後端）的輕量級儀表板：從「公開唯讀」的 Google Sheet 讀取手機資料（CSV），聚焦 Asus / Samsung / Apple，提供價格帶篩選與視覺化比較。

## 需求

- Node.js + npm

## 設定資料來源（必要）

本專案透過環境變數 `VITE_SHEET_CSV_URL` 指定 Google Sheet 的 CSV 匯出網址。

1. 參考 [.env.example](.env.example)
2. 在專案根目錄建立 `.env.local`，內容如下：

```bash
VITE_SHEET_CSV_URL=https://docs.google.com/spreadsheets/d/<SHEET_ID>/export?format=csv&gid=<GID>
```

說明：
- 試算表需設定為「任何知道連結的人都可檢視」
- 建議另外執行「檔案 → 分享 → 發布到網路（Publish to web）」以確保 CSV 可被前端（或 `wget`）直接下載
- CSV 欄位至少要包含：`Brand`, `Model`, `Price`

## 本機開發

```bash
npm install
npm run dev
```

## 打包

```bash
npm run build
```

產物會在 `dist/`。

## 部署（GitHub Pages）

已包含 GitHub Actions workflow（Pages build + deploy）。

注意：
- Vite 的 `base` 已設定為 `/i_parser/`（對應 repo 名稱）。如果 repo 名稱不同，需要同步調整 [vite.config.ts](vite.config.ts)。
