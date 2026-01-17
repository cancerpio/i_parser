# Feature 調整指令

## 語言使用規則

**重要**：除非使用者明確指定其他語言，否則：
- **對話**：AI 與使用者的所有對話都使用繁體中文
- **文件修改**：所有文件的修改與編輯都使用繁體中文
- **文件記錄**：所有生成的記錄文件（Update.md、diff.md、changelog 等）都使用繁體中文

**例外情況**：
- 如果文件本身是英文的（例如：原始檔案的註解、變數名稱、API 文檔等），則保持原有的英文內容，不強制翻譯

## 指令目的

本指令支援兩種使用模式：

### 模式 1：修改既有的 SDD 專案

**用途**：在既有的 SDD 規格上新增或調整功能

**特點**：
- 需要遵循既有的四份文件（constitution.md, spec.md, plan.md, tasks.md）
- 完成後需要同步更新相關文件
- 記錄變更到 changelog

**適用場景**：
- 在已完成的 SDD 專案上新增功能
- 調整既有功能以符合新的需求
- 需要保持與既有規格的一致性

### 模式 2：直接根據需求實作

**用途**：直接根據需求產出可還原且有被記錄的實作

**特點**：
- 不需要遵循 SDD 文件規範
- 完成後不需要更新 SDD 文件
- 仍提供完整的備份還原機制和變更記錄

**適用場景**：
- 快速實作獨立功能
- 非 SDD 專案的功能開發
- 實驗性功能的實作

### 重要區別

- **初始實作**：依照完整的 SDD 流程（spec → plan → tasks → implement）
- **功能調整（SDD 專案）**：在既有實作基礎上，新增或修改功能，並同步更新相關文件
- **直接實作（非 SDD 專案）**：直接根據需求執行，不涉及 SDD 文件

## 執行流程順序

AI 執行本指令時，必須依照以下順序進行：

**步驟 0：確認專案類型**（優先執行）
- 無論用何種方式輸入指令，都必須先詢問使用者專案類型
- 根據專案類型決定後續流程（見下方「專案類型判斷」說明）

1. **前置準備**（僅 SDD 專案需要）：尋找並驗證檔案目錄（步驟 1）
   - 先檢查固定目錄 `.specify/memory/`
   - 如果缺少檔案，才詢問使用者 feature 目錄
   - 處理目錄衝突（兩個目錄都有相同檔案）
   - **列出四個最終檔案路徑並與使用者確認**
2. **確認調整需求**：根據指令方式確認要調整的內容（見下方「如何指定調整需求」說明）
3. **建立還原點**：在開始實作前，建立還原點以便後續還原（見下方「還原機制」說明）
4. **實作前回覆**：顯示預計修改的檔案清單和驗收計畫
5. **執行實作**：開始實作功能調整
   
   **SDD 專案模式**：
   - 必須依照四份文件的規範執行（見下方「執行實作」章節的詳細說明）
   - 參考 constitution.md、spec.md、plan.md、tasks.md 的內容
   - 確保實作符合既有規格和約束
   
   **非 SDD 專案模式**：
   - 直接根據使用者的需求描述或指定檔案內容執行
   - 不需要遵循 SDD 文件規範
   - 但仍需遵守一般的最佳實踐和程式碼規範
6. **更新文件**（僅 SDD 專案需要）：完成實作後，根據變更同步更新四份文件（constitution.md, spec.md, plan.md, tasks.md）
7. **實作後回覆**：記錄實際修改內容
   
   **共同記錄**（兩種模式都需要）：
   - Update.md：專案更新摘要
   - diff.md：詳細變更記錄和還原資訊（見下方「還原機制」說明）
   
   **SDD 專案額外記錄**：
   - changelog_{FEATURE_NAME}_{timestamp}.md：文件更新記錄（見下方「文件更新機制」說明）

## 步驟 0：確認專案類型（優先執行）

**這是第一個必須執行的步驟**。無論用何種方式輸入指令，AI 都必須先確認專案類型，以決定後續流程。

### 0.1 詢問專案類型

AI 應該這樣詢問：

```
請確認此需求的專案類型：

1. SDD 專案 / 有要遵循的文件（constitution.md, spec.md, plan.md, tasks.md）
   - 需要在既有 SDD 規格上新增或調整功能
   - 需要遵循既有的四份文件規範
   - 完成後需要同步更新相關文件

2. 非 SDD 專案 / 直接實作
   - 直接根據需求產出可還原且有被記錄的實作
   - 不需要遵循 SDD 文件規範
   - 完成後不需要更新 SDD 文件

請回覆 1 或 2
```

### 0.2 根據專案類型執行對應流程

#### 類型 1：SDD 專案（有要遵循的文件）

**後續流程**：
- ✅ 執行「前置準備：步驟 1」（尋找並驗證四份文件）
- ✅ 執行「執行實作」時，必須依照四份文件的規範
- ✅ 執行「更新文件」步驟（同步更新四份文件）
- ✅ 執行「實作後回覆」時，額外記錄到 changelog

#### 類型 2：非 SDD 專案（直接實作）

**後續流程**：
- ❌ **跳過**「前置準備：步驟 1」（不需要尋找四份文件）
- ✅ 執行「確認調整需求」步驟
- ✅ 執行「建立還原點」步驟（仍需要備份還原機制）
- ✅ 執行「實作前回覆」步驟
- ✅ 執行「執行實作」步驟（直接根據需求執行，不遵循 SDD 文件）
- ❌ **跳過**「更新文件」步驟（不需要更新 SDD 文件）
- ✅ 執行「實作後回覆」步驟（只記錄到 Update.md 和 diff.md，不記錄 changelog）

### 0.3 流程對照表

| 流程步驟 | SDD 專案 | 非 SDD 專案 |
|---------|---------|------------|
| 步驟 0：確認專案類型 | ✅ 執行 | ✅ 執行 |
| 步驟 1：前置準備（找四份文件） | ✅ 執行 | ❌ 跳過 |
| 步驟 2：確認調整需求 | ✅ 執行 | ✅ 執行 |
| 步驟 3：建立還原點 | ✅ 執行 | ✅ 執行 |
| 步驟 4：實作前回覆 | ✅ 執行 | ✅ 執行 |
| 步驟 5：執行實作 | ✅ 依四份文件規範 | ✅ 直接根據需求 |
| 步驟 6：更新文件 | ✅ 執行 | ❌ 跳過 |
| 步驟 7：實作後回覆 | ✅ 包含 changelog | ✅ 不包含 changelog |

## 前置準備（僅 SDD 專案需要）

### 步驟 1：尋找並驗證檔案目錄

**注意**：此步驟**僅適用於 SDD 專案**。如果專案類型為「非 SDD 專案」，請跳過此步驟。

AI 必須在確認調整需求之前，先尋找並驗證必要檔案是否存在。

#### 1.1 優先檢查固定目錄

AI 必須先檢查固定目錄 `.specify/memory/` 中是否存在以下四個檔案：

- `.specify/memory/constitution.md`
- `.specify/memory/spec.md`
- `.specify/memory/plan.md`
- `.specify/memory/tasks.md`

#### 1.1.1 四份文件的用途說明（根據 GitHub Spec Kit）

這四份文件在 Spec Kit 工作流程中各自扮演關鍵角色：

1. **constitution.md**（專案憲法）
   - **位置**：`.specify/memory/constitution.md`（專案層級）
   - **用途**：定義專案的「不可違反原則」和核心約束
   - **內容**：核心原則（Core Principles）、品質門檻（Quality Gates）、治理規則（Governance）
   - **權威性**：憲法優先於所有其他文件（spec/plan/tasks），任何實作都必須遵守
   - **產生方式**：由 `/speckit.constitution` 命令產生或手動維護

2. **spec.md**（功能規格說明書）
   - **位置**：`{FEATURE_DIR}/spec.md`（功能層級）
   - **用途**：定義功能的詳細規格和使用者故事 (What & Why, not how)
   - **內容**：
     - 功能概述和上下文
     - 使用者故事（User Stories）與優先順序（P1, P2, P3）
     - 功能需求（Functional Requirements）
     - 非功能需求（Non-Functional Requirements）
     - 成功標準（Success Criteria）
     - 測試場景（User Scenarios & Testing）
   - **產生方式**：由 `/speckit.specify` 命令產生，基於使用者的功能描述

3. **plan.md**（實作計劃）
   - **位置**：`{FEATURE_DIR}/plan.md`（功能層級）
   - **用途**：定義如何實作功能，包含技術堆疊和架構決策
   - **內容**：
     - 技術上下文（Technical Context）：語言版本、主要依賴、儲存方案、測試框架等
     - 專案結構（Project Structure）：目錄結構和檔案組織
     - 憲法檢查（Constitution Check）：確保符合專案憲法的要求
     - 設計階段產物：research.md、data-model.md、contracts/、quickstart.md
   - **產生方式**：由 `/speckit.plan` 命令產生，基於 spec.md 和 constitution.md

4. **tasks.md**（任務清單）
   - **位置**：`{FEATURE_DIR}/tasks.md`（功能層級）
   - **用途**：將功能規格和實作計劃拆解為可執行的具體任務
   - **內容**：
     - 依 Phase 組織的任務清單（Phase 1: Setup → Phase 2: Foundational → Phase 3+: User Stories → Final: Polish）
     - 每個任務包含：Task ID、檔案路徑、描述、依賴關係、並行標記
     - 依賴關係圖（Dependencies & Execution Order）
     - 並行執行範例（Parallel Execution Examples）
     - 實作策略（Implementation Strategy）
   - **產生方式**：由 `/speckit.tasks` 命令產生，基於 spec.md 和 plan.md
   - **本指令使用**：本指令（`/implementtask`）就是用來執行 tasks.md 中的任務

**工作流程關係**：
```
constitution.md（專案約束）
    ↓
spec.md（功能規格）→ plan.md（實作計劃）→ tasks.md（任務清單）→ 執行實作
    ↑                    ↑                       ↑
  使用者需求           技術決策               可執行任務
```

#### 1.2 判斷是否需要使用者輸入

- **如果固定目錄中找到全部四個檔案**：
  - 不需要詢問使用者目錄
  - 直接使用固定目錄中的檔案
  - 跳至步驟 1.5（確認檔案）

- **如果固定目錄中缺少任何檔案**：
  - **必須詢問使用者提供 feature 目錄**
  - AI 應該這樣詢問：
    ```
    在固定目錄 `.specify/memory/` 中找不到以下檔案：
    - {缺少的檔案清單}
    
    請提供 feature 目錄路徑（例如：specs/002-cooling-spec-tabs），以便尋找這些檔案。
    ```

#### 1.3 驗證使用者提供的目錄

使用者提供目錄（例如：`specs/002-cooling-spec-tabs`，記為 `{FEATURE_DIR}`）後，AI 必須檢查該目錄下是否存在：
- `{FEATURE_DIR}/spec.md`
- `{FEATURE_DIR}/plan.md`
- `{FEATURE_DIR}/tasks.md`

**注意**：`constitution.md` 通常只在 `.specify/memory/` 中，如果 `{FEATURE_DIR}` 中也有，視為衝突情況。

#### 1.4 處理目錄衝突

如果固定目錄和使用者提供的目錄中都存在相同檔案（例如：兩個目錄都有 `spec.md`），AI 必須：

1. **列出所有衝突的檔案**：
   ```
   發現以下檔案同時存在於兩個目錄中：
   - spec.md
     * 固定目錄：.specify/memory/spec.md
     * Feature 目錄：{FEATURE_DIR}/spec.md
   - plan.md
     * 固定目錄：.specify/memory/plan.md
     * Feature 目錄：{FEATURE_DIR}/plan.md
   ```

2. **逐一詢問使用者確認每個衝突檔案要使用哪一個**：
   ```
   請確認 spec.md 要使用哪一個：
   1. .specify/memory/spec.md（固定目錄）
   2. {FEATURE_DIR}/spec.md（Feature 目錄）
   請回覆 1 或 2
   ```

3. **記錄使用者的選擇**，並使用選定的路徑

#### 1.5 最終確認四個檔案

**在讀取檔案之前**，AI 必須先列出最終確定的四個檔案路徑，並與使用者確認：

```
已確認將讀取以下四個檔案：

1. constitution.md：{最終路徑}
2. spec.md：{最終路徑}
3. plan.md：{最終路徑}
4. tasks.md：{最終路徑}

請確認是否為正確的檔案，回覆「確認」或「是」以繼續，如有錯誤請告知。
```

- **如果使用者確認**：繼續執行步驟 1.6（讀取檔案）
- **如果使用者指出錯誤**：重新檢查並修正路徑，再次確認

#### 1.6 讀取檔案

**只有在使用者確認後**，才讀取以下四個檔案：
- `{最終確定的 constitution.md 路徑}`
- `{最終確定的 spec.md 路徑}`
- `{最終確定的 plan.md 路徑}`
- `{最終確定的 tasks.md 路徑}`

## 調整範圍

**本次允許調整**：
- 在既有功能基礎上**新增功能**
- 在既有功能基礎上**調整/修改功能**
- **不適用於**：完整實作 SDD 中的初始功能（應使用完整的 SDD 流程）

### 如何指定調整需求

使用 slash command 時，支援以下三種方式：

#### 方式 1：直接執行（不帶參數）

```
/implement_feature_task
```

**AI 必須執行以下步驟**：

1. **提醒使用者這是功能調整**
   ```
   注意：這是功能調整指令，用於在既有規格上新增或調整功能，而非實作 SDD 的初始功能。
   
   如果是首次實作功能，請使用完整的 SDD 流程（spec → plan → tasks → implement）。
   ```

2. **詢問要調整的內容**
   ```
   請描述要新增或調整的功能：
   - 可以直接描述功能需求
   - 也可以提供檔案路徑，讓我根據檔案內容確認要新增/調整的功能
   ```

3. **等待使用者回覆**
   - 如果使用者提供描述：按照「方式 2」處理
   - 如果使用者提供檔案路徑：按照「方式 3」處理

#### 方式 2：帶描述執行

```
/implement_feature_task 新增使用者登入功能，包含帳號密碼驗證和 JWT token 發放
```

**AI 處理流程**：
1. 根據描述理解要新增/調整的功能
2. 自動生成 feature name（例如：從「新增使用者登入功能」→ `user-login`）
3. 繼續執行後續流程

#### 方式 3：帶檔案路徑執行

```
/implement_feature_task path/to/feature-request.md
```

**AI 處理流程**：
1. 讀取指定檔案內容
2. 從檔案路徑或檔案內容提取 feature name
   - 優先使用檔案名稱（不含副檔名）
   - 例如：`feature-request.md` → feature name 為 `feature-request`
3. 根據檔案內容確認要新增/調整的功能
4. 繼續執行後續流程

**檔案路徑格式**：
- 相對路徑：`docs/new-feature.md`
- 絕對路徑：`/Users/user/Project/docs/new-feature.md`
- 支援 `.md`、`.txt`、`.json` 等文字格式

### Feature Name 命名規則

- **如果使用者指定檔案路徑**：使用檔案名稱（不含副檔名）
  - 範例：`docs/user-authentication.md` → feature name: `user-authentication`
- **如果使用者提供描述**：AI 自行根據需求取名
  - 規則：使用 2-4 個單字，使用連字號連接，採用 action-noun 格式
  - 範例：「新增使用者登入功能」→ `user-login`
  - 範例：「調整價格計算邏輯」→ `price-calculation-update`
  - 範例：「修復登入錯誤」→ `login-fix`

### 執行順序提醒

無論使用哪種方式指定調整需求，AI 都必須先完成「前置準備：步驟 1」（尋找並驗證檔案目錄，並與使用者確認四個檔案路徑），然後才確認調整需求。

### 確認調整需求

在確認調整需求時，AI 必須：

1. **理解調整範圍**
   - 確認是新增功能還是調整既有功能
   - 確認調整的功能範圍和影響範圍
   - 確認是否需要修改資料結構、API、UI 等

2. **顯示確認訊息**，包含：
   - 調整需求摘要
   - 預估會修改/新增的檔案清單（概要）
   - 預估會影響的功能範圍
   - 是否需要更新四份文件（constitution.md, spec.md, plan.md, tasks.md）

3. **等待使用者明確確認**（例如：回覆「確認執行」或「是」）才開始實作

4. **確認 Feature Name**
   - 根據前述規則確定 feature name
   - 用於後續的 changelog 檔案命名

## 實作限制

### 嚴格禁止的行為

以下行為**不允許**，除非 Task/需求明確要求：
- 新增依賴（npm 套件、外部服務等）
- 改動資料 schema（資料結構、型別定義）
- 改動部署策略（CI/CD、部署流程）

### 檔案修改範圍限制

**重要原則**：

1. **只修改與任務/需求直接相關的檔案**
   - **禁止**修改任何與指定的任務/需求不相關的檔案
   - 如果發現需要修改不相關的檔案，必須先與使用者討論並獲得同意
   - 在「實作前回覆」中，如果有修改不相關檔案的需求，必須特別標註並說明原因

2. **移除既有檔案必須獲得使用者同意**
   - **禁止**未經使用者同意就刪除或移除既有的檔案
   - 如果實作需要移除既有檔案，必須先暫停執行並與使用者討論：
     - 說明為什麼需要移除該檔案
     - 說明移除該檔案的影響範圍
     - 等待使用者明確同意後才能繼續執行
   - 在「實作前回覆」中，如果有移除檔案的需求，必須明確列出並說明原因

3. **修改既有文件內容必須先顯示 diff 並獲得同意**
   - **優先原則**：盡量以補充或新增的方式修改文件，避免改動既有內容
   - 如果需要改動既有文件的內容（例如：修改既有函數、改寫既有段落等），**必須先暫停執行**
   - 顯示完整的 diff 內容給使用者檢視：
     - 清楚標示哪些是原有內容（使用 `-` 或刪除標記）
     - 清楚標示哪些是新的內容（使用 `+` 或新增標記）
     - 說明修改的原因和影響
   - **只有獲得使用者明確同意後，才能進行修改**
   - 如果使用者拒絕修改，必須與使用者討論替代方案

4. **遇到任何問題都必須暫停並討論**
   - 如果在實作過程中遇到任何問題、不確定性或衝突，**必須立即暫停執行**
   - 與使用者討論問題、影響和解決方案
   - **只有獲得使用者明確同意後，才能繼續執行**

## 實作前回覆

開始實作前，請先回覆以下內容：

1. **預計修改/新增的檔案清單**
   - 列出所有會被修改的檔案
   - 列出所有會被新增的檔案
   - **使用範圍或多個 Task 時**：提供所有 Task 的檔案清單概覽，並說明將會依照 Phase 順序執行
   - **使用 `all` 時**：提供完整的檔案清單概覽，並說明將會分 Phase 執行

2. **驗收計畫（具體指令）**
   - 說明如何驗證功能正常運作
   - 提供可執行的測試指令或步驟
   - **使用範圍或多個 Task 時**：說明整體驗收計畫，以及每個 Phase 的檢查點
   - **使用 `all` 時**：說明整體驗收計畫，以及每個 Phase 的檢查點

## 執行實作

### 執行原則

**重要**：此章節的執行原則**僅適用於 SDD 專案模式**。非 SDD 專案請跳過此章節，直接根據需求執行。

AI 在執行功能調整時（SDD 專案模式），**必須嚴格參考並遵守以下四份文件**：

1. **constitution.md**（專案憲法）
   - **優先級最高**：任何實作都必須遵守專案的不可違反原則
   - **用途**：作為約束條件，確保實作符合專案核心原則
   - **檢查點**：實作前必須檢查是否符合憲法要求（例如：靜態前端、資料只讀、無秘密等）

2. **spec.md**（功能規格說明書）
   - **用途**：了解「What & Why」，即功能的目標和使用者故事
   - **參考內容**：
     - 使用者故事和優先順序（P1, P2, P3）
     - 功能需求（Functional Requirements）
     - 成功標準（Success Criteria）
     - 測試場景（User Scenarios & Testing）
   - **使用方式**：確保實作符合功能規格中定義的需求和目標

3. **plan.md**（實作計劃）
   - **用途**：了解「How」，即技術決策和實作方式
   - **參考內容**：
     - 技術堆疊（tech stack）和主要依賴
     - 專案結構（Project Structure）
     - 技術上下文（Technical Context）
     - 設計階段產物（research.md、data-model.md、contracts/ 等）
   - **使用方式**：確保實作符合計劃中定義的技術架構和結構

4. **tasks.md**（任務清單）
   - **用途**：了解具體要執行的任務和執行順序
   - **參考內容**：
     - Task 描述和檔案路徑
     - Phase 組織和依賴關係
     - 執行順序（Dependencies & Execution Order）
   - **使用方式**：依照 tasks.md 中定義的任務描述進行實作

### 執行流程

1. **閱讀相關文件**
   - 執行 Task 前，重新檢視相關的文件內容
   - 確認 Task 在 tasks.md 中的描述和檔案路徑
   - 對照 spec.md 確認功能目標
   - 參考 plan.md 確認技術架構
   - 檢查 constitution.md 確保符合約束

2. **執行實作（功能調整）**
   - **重要**：這是在既有規格上新增或調整功能，而非從零開始實作
   - 在既有程式碼基礎上進行調整，保持與現有架構的一致性
   - 依照 tasks.md、spec.md、plan.md 的既有規範進行實作
   - 嚴格遵守 constitution.md 中的約束條件
   - 確保調整不破壞既有功能

3. **處理衝突或模糊情況**

   **如果發現以下情況，必須暫停執行並與使用者討論**：
   
   - **文件間衝突**：
     - tasks.md 的描述與 spec.md 的需求不一致
     - plan.md 的技術架構與 constitution.md 的約束衝突
     - 任何兩份文件之間的矛盾
   
   - **描述模糊或不完整**：
     - tasks.md 中的 Task 描述不夠具體，無法判斷如何實作
     - spec.md 中的需求描述不明確
     - plan.md 中的技術決策缺失或不清楚
   
   - **技術可行性問題**：
     - 發現 plan.md 中建議的技術方案在 constitution.md 的約束下不可行
     - 發現 tasks.md 中的實作方式與專案現有架構不匹配
   
   - **憲法違規風險**：
     - 任何可能違反 constitution.md 中定義原則的情況
   
   - **需要修改不相關檔案**：
     - 發現實作需要修改與任務/需求不相關的檔案
     - 必須說明原因並獲得使用者同意
   
   - **需要移除既有檔案**：
     - 發現實作需要刪除或移除既有的檔案
     - 必須說明原因、影響範圍並獲得使用者同意
   
   - **其他問題或不確定性**：
     - 任何實作過程中的問題、不確定性或疑慮
     - 無法確定正確的實作方式
     - 發現可能影響既有功能的變更
   
   **暫停並討論的方式**：
   
   ```
   發現問題：[具體描述問題]
   
   相關文件：
   - tasks.md：{Task ID 的描述}
   - spec.md：{相關的功能需求}
   - plan.md：{相關的技術決策}
   - constitution.md：{相關的約束條件}
   
   衝突/模糊點：
   - [具體說明衝突或模糊的地方]
   
   建議解決方案：
   - [如果有的話，提供建議]
   
   請確認：
   1. 是否需要調整 tasks.md 中的描述？
   2. 是否需要調整實作方式？
   3. 是否需要修改其他文件？
   ```
   
   **等待使用者明確指示後，才繼續執行**

4. **驗證實作**
   - 實作完成後，對照 spec.md 中的成功標準進行驗證
   - 確認實作符合 tasks.md 中 Task 的描述
   - 確保沒有違反 constitution.md 中的約束

### 執行順序

功能調整的執行順序：
1. 先閱讀相關文件和既有程式碼，理解現有架構
2. 確認調整範圍和影響範圍
3. 執行實作調整
4. 驗證調整不破壞既有功能
5. 同步更新相關文件

## 文件更新機制（僅 SDD 專案需要）

**重要**：此章節**僅適用於 SDD 專案模式**。如果專案類型為「非 SDD 專案」，請跳過此步驟。

完成功能調整後，AI **必須根據變更同步更新四份文件**，並記錄在 changelog 中。

### 更新原則

**重要**：調整功能後，四份文件可能都需要更新以反映新的狀態：

1. **constitution.md**（專案憲法）
   - 如果調整涉及核心原則的變更，必須更新
   - 例如：新增了新的約束條件、修改了品質門檻等

2. **spec.md**（功能規格說明書）
   - 必須更新以反映新增或調整的功能
   - 新增使用者故事、功能需求、成功標準等
   - 更新相關的測試場景

3. **plan.md**（實作計劃）
   - 如果調整涉及技術架構變更，必須更新
   - 更新技術堆疊、專案結構、技術上下文等
   - 更新相關的設計階段產物

4. **tasks.md**（任務清單）
   - 如果新增功能需要新的任務，必須更新
   - 新增相關的任務到適當的 Phase
   - 更新依賴關係和執行順序

### 更新流程

完成實作後，AI 必須：

1. **分析變更範圍**
   - 確認哪些文件需要更新
   - 確認每個文件需要更新的內容

2. **備份原文件**
   - 在更新前，先備份需要更新的文件
   - 備份位置：`.cursor/backups/{timestamp}_{FEATURE_NAME}/`
   - 與「還原機制」中的備份合併管理

3. **更新文件內容**
   - 根據實作變更，同步更新相關文件
   - 保持文件格式和結構的一致性
   - 確保更新後的文件仍然符合 Spec Kit 的規範

4. **記錄到 changelog**
   - 在 feature 目錄或專案根目錄建立/更新 changelog 文件
   - 檔案命名：`changelog_{FEATURE_NAME}_{YYYYMMDD_HHMMSS}.md`
   - 例如：`changelog_user-login_20240116_143022.md`

### Changelog 格式

changelog 文件應包含以下內容：

```markdown
# Changelog: {FEATURE_NAME}

執行時間：{timestamp}
調整類型：新增功能 / 調整功能
Feature Name：{FEATURE_NAME}

## 變更摘要

### 實作變更
- 新增的檔案：{檔案清單}
- 修改的檔案：{檔案清單}
- 刪除的檔案：{檔案清單}

### 文件更新

#### constitution.md
- 更新內容：{說明更新的內容}
- 更新原因：{為什麼需要更新}
- 備份位置：`.cursor/backups/{timestamp}_{FEATURE_NAME}/constitution.md`

#### spec.md
- 更新內容：
  - 新增使用者故事：{列出新增的故事}
  - 新增功能需求：{列出新增的需求}
  - 更新成功標準：{列出更新的標準}
- 更新原因：{為什麼需要更新}
- 備份位置：`.cursor/backups/{timestamp}_{FEATURE_NAME}/spec.md`

#### plan.md
- 更新內容：
  - 技術堆疊變更：{列出變更}
  - 專案結構變更：{列出變更}
  - 技術上下文變更：{列出變更}
- 更新原因：{為什麼需要更新}
- 備份位置：`.cursor/backups/{timestamp}_{FEATURE_NAME}/plan.md`

#### tasks.md
- 更新內容：
  - 新增任務：{列出新增的任務}
  - 更新任務：{列出更新的任務}
  - 更新依賴關係：{列出更新的依賴}
- 更新原因：{為什麼需要更新}
- 備份位置：`.cursor/backups/{timestamp}_{FEATURE_NAME}/tasks.md`

## 還原方式

如果需要還原文件更新：

### 還原文件

```bash
# 還原 constitution.md
cp .cursor/backups/{timestamp}_{FEATURE_NAME}/constitution.md {原檔案路徑}

# 還原 spec.md
cp .cursor/backups/{timestamp}_{FEATURE_NAME}/spec.md {原檔案路徑}

# 還原 plan.md
cp .cursor/backups/{timestamp}_{FEATURE_NAME}/plan.md {原檔案路徑}

# 還原 tasks.md
cp .cursor/backups/{timestamp}_{FEATURE_NAME}/tasks.md {原檔案路徑}
```

## 驗證

- [ ] 實作變更已完成
- [ ] 四份文件已同步更新
- [ ] Changelog 已記錄所有變更
- [ ] 檔案備份已建立
- [ ] 更新後的文件符合 Spec Kit 規範
```

## 還原機制

為了確保所有變更都可以還原，AI 必須在實作前建立檔案備份，並在實作後記錄變更。

**設計原則**：使用純檔案備份方式，不會進行任何 Git commit，確保不會影響 Git 歷史。

### 步驟 1：建立檔案備份（實作前）

在開始實作任何功能之前，AI 必須：

1. **確定將被修改的檔案清單**
   - 根據「實作前回覆」中的預計修改/新增檔案清單
   - 僅備份「將被修改」的檔案（新增的檔案不需要備份）

2. **建立備份目錄**
   - 在 `.cursor/backups/` 目錄下建立時間戳記子目錄
   - 備份目錄格式：`.cursor/backups/{YYYYMMDD_HHMMSS}_{FEATURE_NAME}/`
   - 範例：`.cursor/backups/20240116_143022_user-login/`

3. **備份檔案**
   - 對於每個將要被修改的檔案，建立備份副本
   - 備份檔案保留原始目錄結構
   - 範例：如果原檔案是 `src/components/Button.vue`
     - 備份到：`.cursor/backups/20240116_143022_user-login/src/components/Button.vue`
   
4. **記錄還原點資訊**
   - 在 `.cursor/implement-revert-point.txt` 記錄：
     ```
     執行時間：{timestamp}
     調整功能：{Feature Name}
     調整類型：新增功能 / 調整功能
     備份目錄：.cursor/backups/{timestamp}_{FEATURE_NAME}/
     備份檔案清單：
     - {檔案路徑 1}
     - {檔案路徑 2}
     ...
     ```

### 步驟 2：記錄變更（實作後）

在完成實作後，AI 必須：

#### 2.1 記錄到 diff.md

在 feature 目錄或專案根目錄建立/更新 `diff.md`，記錄以下內容：

```markdown
# Feature {FEATURE_NAME} 變更記錄

執行時間：{timestamp}
Feature Name：{FEATURE_NAME}
調整類型：新增功能 / 調整功能
備份目錄：.cursor/backups/{timestamp}_{FEATURE_NAME}/

## 變更摘要

### 新增的檔案
- {檔案路徑}
  - 說明：{檔案用途說明}

### 修改的檔案
- {檔案路徑}
  - 變更類型：新增/刪除/修改
  - 變更說明：{重點變更摘要}
  - 主要變更：
    - {具體變更點 1}
    - {具體變更點 2}
  - 備份位置：`.cursor/backups/{timestamp}_{FEATURE_NAME}/{檔案路徑}`

### 刪除的檔案
- {檔案路徑}
  - 說明：{刪除原因}
  - 備份位置：`.cursor/backups/{timestamp}_{FEATURE_NAME}/{檔案路徑}`

## 還原方式

### 步驟 1：刪除新增的檔案

```bash
# 刪除所有新增的檔案（如果不需要保留）
rm {新增檔案路徑1} {新增檔案路徑2}
```

### 步驟 2：恢復備份檔案

```bash
# 從備份目錄恢復修改的檔案
cp .cursor/backups/{timestamp}_{FEATURE_NAME}/{檔案路徑} {原檔案路徑}

# 範例：恢復 src/components/Button.vue
cp .cursor/backups/20240116_143022_user-login/src/components/Button.vue src/components/Button.vue
```

### 步驟 3：還原刪除的檔案（如果需要）

```bash
# 從備份目錄恢復刪除的檔案
cp .cursor/backups/{timestamp}_{FEATURE_NAME}/{檔案路徑} {原檔案路徑}
```

### 快速還原腳本（選用）

如果備份了多個檔案，可以使用以下腳本一次性還原：

```bash
#!/bin/bash
BACKUP_DIR=".cursor/backups/{timestamp}_{FEATURE_NAME}"

# 恢復所有備份檔案
find "$BACKUP_DIR" -type f | while read backup_file; do
    # 計算相對路徑
    relative_path="${backup_file#$BACKUP_DIR/}"
    original_file="$relative_path"
    
    # 確保目錄存在
    mkdir -p "$(dirname "$original_file")"
    
    # 恢復檔案
    cp "$backup_file" "$original_file"
    echo "恢復：$original_file"
done

echo "還原完成！"
```

### 清理備份（還原後選用）

如果確認還原成功且不需要備份，可以刪除備份目錄：

```bash
rm -rf .cursor/backups/{timestamp}_{FEATURE_NAME}/
```

## 還原點資訊

還原點檔案：`.cursor/implement-revert-point.txt`
- 備份目錄：`.cursor/backups/{timestamp}_{FEATURE_NAME}/`
- 備份檔案總數：{數量}

## 驗證還原

還原後，請執行以下命令驗證：
- `npm run build`（如果適用）
- 檢查功能是否恢復到執行前狀態
- 檢查 Git 狀態：`git status`（如果有 Git 儲存庫）
```

#### 2.2 記錄詳細變更（選用）

如果專案有 Git 儲存庫，可以記錄 `git diff` 輸出（僅作為參考，不會實際 commit）：

```markdown
## Git Diff 參考（僅記錄，不會 commit）

\`\`\`diff
{git diff 輸出內容}
\`\`\`

**注意**：此 diff 僅作為變更記錄參考，不會影響 Git 歷史。
```

#### 2.3 更新 .cursor/implement-revert-point.txt

在檔案末尾追加：
- 完成時間戳記
- 變更檔案總數（新增、修改、刪除）
- diff.md 檔案位置

### 還原執行流程範例

1. **查看還原點資訊**
   ```bash
   cat .cursor/implement-revert-point.txt
   ```

2. **查看變更記錄**
   ```bash
   cat diff.md
   ```

3. **執行還原**
   ```bash
   # 單一檔案還原
   cp .cursor/backups/20240116_143022_user-login/src/components/Button.vue src/components/Button.vue
   
   # 或使用還原腳本（批量還原）
   bash restore.sh
   ```

4. **驗證還原**
   ```bash
   npm run build  # 確認專案可以正常編譯
   ```

## 實作後回覆

### SDD 專案模式

完成後，請回覆並且將以下內容記錄到三個地方：
- **Update.md**：專案更新摘要
- **diff.md**：詳細變更記錄和還原資訊（見上方「還原機制」說明）
- **changelog_{FEATURE_NAME}_{timestamp}.md**：文件更新記錄（見上方「文件更新機制」說明）

### 非 SDD 專案模式

完成後，請回覆並且將以下內容記錄到兩個地方：
- **Update.md**：專案更新摘要
- **diff.md**：詳細變更記錄和還原資訊（見上方「還原機制」說明）

### Update.md 內容

1. **實際修改的檔案清單（含重點摘要）**
   - 列出所有實際修改的檔案
   - 針對每個檔案提供重點變更摘要

2. **驗收指令與預期結果**
   - 提供可執行的驗收指令
   - 說明預期的執行結果

3. **若失敗最可能的原因與修正方向**
   - 分析可能的失敗原因
   - 提供修正建議

### diff.md 內容

**重要**：必須按照「還原機制：步驟 2」的格式，詳細記錄所有變更和還原方式。

### changelog_{FEATURE_NAME}_{timestamp}.md 內容（僅 SDD 專案）

**重要**：此記錄**僅適用於 SDD 專案模式**。必須按照「文件更新機制：Changelog 格式」的格式，詳細記錄所有文件更新內容。

### 還原點確認

完成後，AI 必須告知使用者：

**共同資訊**（兩種模式都需要）：
- **還原點位置**：`.cursor/implement-revert-point.txt`
- **備份目錄**：`.cursor/backups/{timestamp}_{FEATURE_NAME}/`
- **變更記錄位置**：`diff.md`
- **還原方式**：查看 `diff.md` 中的「還原方式」章節

**SDD 專案額外資訊**：
- **文件更新記錄位置**：`changelog_{FEATURE_NAME}_{timestamp}.md`
- **文件更新還原方式**：查看 `changelog_{FEATURE_NAME}_{timestamp}.md` 中的「還原方式」章節
