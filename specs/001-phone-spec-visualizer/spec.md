# Feature Specification: Phone Spec Visualizer

**Feature Branch**: `001-phone-spec-visualizer`  
**Created**: 2026-01-11  
**Status**: Draft  
**Input**: 建立一個輕量級儀表板，從公開唯讀的 Google 試算表讀取手機資料，聚焦 Asus / Samsung / Apple，提供價格帶篩選與視覺化比較。

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - 查看最新儀表板 (Priority: P1)

使用者打開儀表板後，可以立即看到從資料來源讀取到的最新手機清單摘要，以及至少一個視覺化圖表，用於快速理解不同品牌在價格與規格上的分佈。

**Why this priority**: 這是最小可行性產品的核心價值：減少人工整理與跨品牌比較的時間。

**Independent Test**: 使用者只要提供一份可公開瀏覽的試算表資料並開啟網站，即可驗證「載入成功、只顯示三品牌、圖表可見」。

**Acceptance Scenarios**:

1. **Given** 試算表可公開讀取且包含有效資料列，**When** 使用者開啟網站，**Then** 頁面顯示資料載入完成狀態、可見至少一個圖表、並呈現手機資料摘要（例如總筆數或品牌分布）。
2. **Given** 試算表中包含非 Asus/Samsung/Apple 的品牌資料列，**When** 使用者開啟網站，**Then** 畫面僅顯示 Asus/Samsung/Apple 的資料列，其他品牌不出現在清單與圖表中。

---

### User Story 2 - 依價格帶篩選並比較 (Priority: P2)

使用者可以選擇一個價格帶（例如 10,000–20,000、20,000–30,000），系統會即時更新清單與圖表，只呈現落在該價格帶的機型，方便在同一基準下做橫向比較。

**Why this priority**: 價格帶是決策最常用的切片方式；沒有篩選，儀表板的比較價值會大幅降低。

**Independent Test**: 準備一份試算表，至少包含兩個價格帶與三品牌各 1 台以上機型；切換價格帶即可驗證「結果縮小且圖表同步更新」。

**Acceptance Scenarios**:

1. **Given** 使用者已成功載入資料，**When** 選擇某一價格帶，**Then** 清單與圖表僅顯示該區間內的機型，且顯示的總筆數與試算表中符合區間的筆數一致。
2. **Given** 某價格帶沒有任何符合的機型，**When** 使用者切換到該價格帶，**Then** 系統顯示明確的空狀態訊息（例如「此價格帶無資料」），且頁面不崩潰。

---

### User Story 3 - 資料品質與錯誤可理解 (Priority: P3)

當資料來源不可用或資料列不完整時，使用者仍能理解發生什麼事、哪些資料被忽略，以及如何修正（例如補齊欄位或修正格式），而不是看到空白或崩潰。

**Why this priority**: 本專案依賴外部試算表；若沒有清楚的降級與提示，使用者會誤判為系統故障或資料不存在。

**Independent Test**: 以同一份試算表分別製造「缺少必要欄位」「Price 非數字」「無法讀取」等狀況，確認 UI 能提供清楚提示且仍可正常操作其他部分。

**Acceptance Scenarios**:

1. **Given** 試算表缺少必要欄位（如 Brand 或 Price），**When** 使用者開啟網站，**Then** 系統顯示明確錯誤提示（指出缺少哪些欄位），並避免整頁崩潰。
2. **Given** 部分資料列缺少必要欄位或值無效，**When** 使用者開啟網站，**Then** 系統略過無效資料列並呈現「已略過 N 筆」等可理解訊息。

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

- 試算表連結可公開瀏覽，但暫時無法取得（網路錯誤、服務不可用）時，頁面應顯示可理解的錯誤狀態。
- 試算表可取得，但 Header 欄位名稱改動或缺少必要欄位時，應顯示缺少欄位清單。
- `Price` 值為空、非數字、或為負數時，該筆資料應被忽略並納入「略過筆數」。
- 篩選後無資料時，顯示空狀態（非錯誤）。
- 試算表包含其他品牌、或品牌拼字/大小寫不一致時，應以明確規則正規化後再判斷是否屬於三品牌。
- 同一品牌/型號重複出現多筆時，系統應一致處理（例如全部顯示），且不影響頁面穩定性。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST read the latest dataset from a configured public, read-only Google Sheet when the page loads.
- **FR-002**: System MUST treat the Google Sheet as read-only and MUST NOT modify source data.
- **FR-003**: System MUST require (at minimum) `Brand`, `Model`, and `Price` fields to treat a row as valid.
- **FR-004**: System MUST ignore any rows with missing/invalid required fields and MUST surface a user-visible warning that rows were skipped.
- **FR-005**: System MUST render only devices whose brand is Asus, Samsung, or Apple; all other brands MUST be excluded from lists and charts.
- **FR-006**: Users MUST be able to select a price band, and the system MUST filter the visible devices to that band.
- **FR-007**: System MUST provide at least one visualization that helps compare devices across brands within the selected price band.
- **FR-008**: If the preferred performance indicator field is not present in the dataset, the system MUST fall back to an alternative numeric indicator (e.g., `Ram`) or switch to a price-only visualization mode, without crashing.
- **FR-009**: When the dataset cannot be fetched or parsed, the system MUST show a clear error state and MUST NOT render misleading empty results.
- **FR-010**: System MUST clearly distinguish between “no matches for current filters” (empty state) and “data unavailable/invalid” (error state).

<!--
  Constitution alignment reminder:
  - Do NOT introduce backend services or databases.
  - Data is read-only from a public Google Sheet.
  - Deployment is GitHub Pages via GitHub Actions.
  - UI framework is Vue 3.
  - Only Asus/Samsung/Apple are rendered; missing required fields must not crash.
-->

### Key Entities *(include if feature involves data)*

- **Device**: 一筆手機資料（品牌、型號、價格、以及可用的數值規格欄位）。
- **Price Band**: 一個可選的價格區間，用於篩選 Device。
- **Dataset**: 從資料來源載入並經過驗證/清理後的 Device 集合（包含略過筆數與原因摘要）。

### Assumptions

- 資料已存在於試算表中（人工維護或由其他工具寫入）；本產品只負責讀取與呈現。
- 試算表中的價格幣別一致，且 `Price` 可用數字表示。
- 若需要「性能」比較，試算表會提供可用的數值欄位（例如 `Spec_Score` 或 `Ram`）。若沒有，產品仍可提供價格分布與清單比較。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 在資料列數 ≤ 500 的試算表下，使用者刷新頁面後 5 秒內能看到「至少一個圖表」與「資料摘要」。
- **SC-002**: 使用者在 2 次點擊內可以切換到任一價格帶，且切換後 1 秒內清單與圖表完成更新。
- **SC-003**: 當試算表缺少必要欄位或無法讀取時，使用者在 1 次閱讀內能理解原因與修正方向（例如缺少欄位清單或資料來源不可用）。
- **SC-004**: 當試算表包含其他品牌時，頁面顯示結果 100% 僅包含 Asus/Samsung/Apple，且不影響載入成功率。
