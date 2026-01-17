# Task 實作指令

## 執行流程順序

AI 執行本指令時，必須依照以下順序進行：

1. **前置準備**：尋找並驗證檔案目錄（步驟 1）
   - 先檢查固定目錄 `.specify/memory/`
   - 如果缺少檔案，才詢問使用者 feature 目錄
   - 處理目錄衝突（兩個目錄都有相同檔案）
   - **列出四個最終檔案路徑並與使用者確認**
2. **確認 Task**：如果使用者在命令中未指定 Task，則詢問要實作哪個 Task
3. **特殊確認**：
   - 如果指定範圍（`001~010`）或多個 Task（`001, 005`），則顯示確認訊息並等待使用者確認
   - 如果指定 `all`，則顯示確認訊息並等待使用者確認
4. **建立還原點**：在開始實作前，建立還原點以便後續還原（見下方「還原機制」說明）
5. **實作前回覆**：顯示預計修改的檔案清單和驗收計畫
6. **執行實作**：開始實作功能（依照 Phase 順序）
7. **實作後回覆**：記錄實際修改內容到 Update.md 和 diff.md（見下方「還原機制」說明）

## 前置準備

### 步驟 1：尋找並驗證檔案目錄（優先執行）

**這是第一個必須執行的步驟**。AI 必須在詢問 Task 或執行任何其他操作之前，先尋找並驗證必要檔案是否存在。

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

## 實作範圍

**本次允許實作**：
- `tasks.md` 中指定的**單一 Task**（預設行為）
- **多個 Task**（使用範圍 `001~010` 或逗號分隔 `001, 005` 時）
- **所有 Task**（使用 `all` 參數時）

### 如何指定 Task

使用 slash command 時，在命令後面直接加上 Task ID，支援以下格式：

1. **完整 Task ID**（推薦）
   ```
   /implementtask T010
   /implementtask T020
   ```

2. **僅數字**
   ```
   /implementtask 010
   /implementtask 020
   ```

3. **範圍執行（連續多個 Task）**
   ```
   /implementtask 001~010
   /implementtask T001~T010
   ```
   執行從第一個 Task 到最後一個 Task 之間的所有 Task（包含邊界）
   - 範例：`001~010` 會執行 T001, T002, T003, ..., T010（共 10 個 Task）
   - 支援完整格式（`T001~T010`）或僅數字（`001~010`）

4. **多個指定 Task（逗號分隔）**
   ```
   /implementtask 001, 005
   /implementtask T001, T005, T020
   /implementtask 001,005,020
   ```
   執行指定的多個 Task，支援空格或無空格
   - 範例：`001, 005` 會執行 T001 和 T005
   - 支援完整格式（`T001, T005`）或僅數字（`001, 005`）

5. **執行所有 Task**
   ```
   /implementtask all
   ```
   ⚠️ **重要**：使用 `all` 時，AI **必須先與使用者確認**才會開始執行（見下方「特殊情況」說明）

6. **透過對話指定**
   如果沒有在命令後指定，AI 會在**完成檔案確認後**詢問要實作哪個 Task，請直接回覆 Task ID（例如：`T010` 或 `010`）

**執行順序提醒**：無論使用哪種方式指定 Task，AI 都必須先完成「前置準備：步驟 1」（尋找並驗證檔案目錄，並與使用者確認四個檔案路徑），然後才詢問或確認 Task。

**注意**：Task ID 格式為 `T###`（三位數），可在確認的 `tasks.md` 檔案中查看所有可用的 Task。

### 特殊情況：執行多個 Task

當使用者指定範圍（例如：`001~010`）或多個 Task（例如：`001, 005`）時：

**重要**：必須先完成「前置準備：步驟 1」（尋找並驗證檔案目錄，並與使用者確認四個檔案路徑），確認檔案後，才能顯示確認訊息。

#### 範圍執行（`001~010` 格式）

1. **解析範圍並驗證**
   - AI 必須解析範圍（例如：`001~010` → T001 到 T010）
   - 檢查 `tasks.md` 中是否存在這些 Task
   - 如果範圍內有任何 Task 不存在，列出缺少的 Task 並詢問使用者是否繼續

2. **顯示確認訊息**，包含：
   - 將會執行的 Task 清單（完整列表）
   - Task 總數
   - 預估會修改/新增的檔案清單（概要）
   - 執行順序（依照 `tasks.md` 中的 Phase 和依賴關係）

3. **等待使用者明確確認**（例如：回覆「確認執行」或「是」）才開始實作

4. **確認後，依照 `tasks.md` 中的 Phase 順序逐一執行**，並在每個 Task 完成後提供進度摘要

#### 多個指定 Task（`001, 005` 格式）

1. **解析並驗證**
   - AI 必須解析逗號分隔的 Task ID（例如：`001, 005` → T001 和 T005）
   - 檢查 `tasks.md` 中是否存在這些 Task
   - 如果指定的 Task 中有任何不存在，列出缺少的 Task 並詢問使用者是否繼續或修正

2. **顯示確認訊息**，包含：
   - 將會執行的 Task 清單（完整列表）
   - Task 總數
   - 預估會修改/新增的檔案清單（概要）
   - 執行順序（依照 `tasks.md` 中的 Phase 和依賴關係，可能不連續）

3. **等待使用者明確確認**（例如：回覆「確認執行」或「是」）才開始實作

4. **確認後，依照 `tasks.md` 中的 Phase 順序逐一執行指定的 Task**，跳過未指定的 Task，並在每個 Task 完成後提供進度摘要

**注意**：執行順序必須遵循 `tasks.md` 中的 Phase 和依賴關係，即使使用者指定的 Task 不連續，也要依照 Phase 順序執行。

### 特殊情況：執行所有 Task

當使用者指定 `/implementtask all` 時：

**重要**：必須先完成「前置準備：步驟 1」（尋找並驗證檔案目錄，並與使用者確認四個檔案路徑），確認檔案後，才能顯示確認訊息。

1. **AI 必須先顯示確認訊息**，包含：
   - 將會執行所有 Task 的總數
   - 預估會修改/新增的檔案清單（概要）
   - 執行順序（依照 `tasks.md` 中的 Phase 和依賴關係）
   - 警告：這是一個大規模變更，可能影響多個檔案

2. **等待使用者明確確認**（例如：回覆「確認執行」或「是」）才開始實作

3. **如果使用者未確認或拒絕**，則停止執行並詢問是否要改為執行特定 Task

4. **確認後，依照 `tasks.md` 中的 Phase 順序逐一執行**，並在每個 Phase 完成後提供進度摘要

## 實作限制

以下行為**不允許**，除非 Task 明確要求：
- 新增依賴（npm 套件、外部服務等）
- 改動資料 schema（資料結構、型別定義）
- 改動部署策略（CI/CD、部署流程）

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

AI 在執行任何 Task 時，**必須嚴格參考並遵守以下四份文件**：

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

2. **執行實作**
   - 依照 tasks.md 中的 Task 描述進行實作
   - 使用 plan.md 中定義的技術堆疊和專案結構
   - 確保實作符合 spec.md 中的功能需求
   - 嚴格遵守 constitution.md 中的約束條件

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

- **單一 Task**：直接執行該 Task
- **多個 Task**：依照 tasks.md 中的 Phase 順序和依賴關係執行
- **範圍執行**：依照 Phase 順序，只執行範圍內的 Task
- **執行所有 Task**：依照 tasks.md 中的完整 Phase 順序逐一執行

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
   - 備份目錄格式：`.cursor/backups/{YYYYMMDD_HHMMSS}_{TASK_ID}/`
   - 範例：`.cursor/backups/20240116_143022_T010/`

3. **備份檔案**
   - 對於每個將要被修改的檔案，建立備份副本
   - 備份檔案保留原始目錄結構
   - 範例：如果原檔案是 `src/components/Button.vue`
     - 備份到：`.cursor/backups/20240116_143022_T010/src/components/Button.vue`
   
4. **記錄還原點資訊**
   - 在 `.cursor/implement-revert-point.txt` 記錄：
     ```
     執行時間：{timestamp}
     執行 Task：{Task ID 或範圍}
     備份目錄：.cursor/backups/{timestamp}_{TASK_ID}/
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
# Task {TASK_ID} 變更記錄

執行時間：{timestamp}
執行範圍：{Task ID 或範圍}
備份目錄：.cursor/backups/{timestamp}_{TASK_ID}/

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
  - 備份位置：`.cursor/backups/{timestamp}_{TASK_ID}/{檔案路徑}`

### 刪除的檔案
- {檔案路徑}
  - 說明：{刪除原因}
  - 備份位置：`.cursor/backups/{timestamp}_{TASK_ID}/{檔案路徑}`

## 還原方式

### 步驟 1：刪除新增的檔案

```bash
# 刪除所有新增的檔案（如果不需要保留）
rm {新增檔案路徑1} {新增檔案路徑2}
```

### 步驟 2：恢復備份檔案

```bash
# 從備份目錄恢復修改的檔案
cp .cursor/backups/{timestamp}_{TASK_ID}/{檔案路徑} {原檔案路徑}

# 範例：恢復 src/components/Button.vue
cp .cursor/backups/20240116_143022_T010/src/components/Button.vue src/components/Button.vue
```

### 步驟 3：還原刪除的檔案（如果需要）

```bash
# 從備份目錄恢復刪除的檔案
cp .cursor/backups/{timestamp}_{TASK_ID}/{檔案路徑} {原檔案路徑}
```

### 快速還原腳本（選用）

如果備份了多個檔案，可以使用以下腳本一次性還原：

```bash
#!/bin/bash
BACKUP_DIR=".cursor/backups/{timestamp}_{TASK_ID}"

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
rm -rf .cursor/backups/{timestamp}_{TASK_ID}/
```

## 還原點資訊

還原點檔案：`.cursor/implement-revert-point.txt`
- 備份目錄：`.cursor/backups/{timestamp}_{TASK_ID}/`
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
   cp .cursor/backups/20240116_143022_T010/src/components/Button.vue src/components/Button.vue
   
   # 或使用還原腳本（批量還原）
   bash restore.sh
   ```

4. **驗證還原**
   ```bash
   npm run build  # 確認專案可以正常編譯
   ```

## 實作後回覆

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

### 還原點確認

完成後，AI 必須告知使用者：
- **還原點位置**：`.cursor/implement-revert-point.txt`
- **備份目錄**：`.cursor/backups/{timestamp}_{TASK_ID}/`
- **變更記錄位置**：`diff.md`
- **還原方式**：查看 `diff.md` 中的「還原方式」章節，使用檔案備份還原
