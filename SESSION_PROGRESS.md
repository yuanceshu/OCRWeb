# OCRWeb Session Progress

> Last updated: 2026-06-10
> Purpose: give each new session a fast, reliable handoff point based on current source code, not historical screenshots.

Updated on `2026-06-25` for 开通流程页首屏纸壳回退:

- 用户已明确否定流程页首屏继续采用“外壳 + 可感知中心底纸”的实验方案；哪怕把内层底纸改成满铺弱纹理，只要还能读出独立第二张纸面，就不接受。
- 当前接受方向是直接对齐首页 `home-directory-paper` 的单层纸壳实现：外壳边缘与中心纸底由同一张 `paper-wide-alpha` 承担，避免再额外叠出 `activation-intro-paper-shell::after` 这类内层矩形底纸。
- 后续如果再调流程页首屏纸感，优先只在同源纸壳的 `border-image fill`、阴影强度和内容边距内微调，不要重新引入独立中心底纸、纵向明暗渐变或可见 inset 边界。

Updated on `2026-06-25` for 手机端子页顶部整体化:

- 用户明确否定手机端子页继续保留“主菜单栏 + 独立 Tab 栏”两条分离顶部；后续移动端顶部必须优先做成同一容器内的一体化 Header，不要再拆成两张独立纸卡或两条独立悬浮栏。
- 低频站点导航（首页 / 开通流程 / 联系支持）在手机端必须收进菜单，不再平铺占用顶部横向空间。
- 本轮又确认了一条范围边界：这类菜单折叠对首页顶部的同步影响是允许的，但默认只影响手机端，不应借机改动桌面端导航结构。
- 用户又明确要求开通流程页首屏两条主流程入口的编号使用中文“一 / 二”，不要继续显示“01 / 02”；正文步骤编号不在这轮改动范围内。

Updated on `2026-06-10` for 首页 Banner 左侧装订件素材接入:

- 用户已提供首页左侧装订件的绿幕位图素材 `项目回收站/83a5b978-080f-42ae-aef3-e2f7dfae00f5.png`，并明确要求本轮按该素材原始方向接入首页首屏。
- 当前这组装订件处理边界已确定：只做抠绿幕、去绿边、裁切并导出正式透明资源，不做水平翻转，也不做“变细”“去黄铜感”“重设计结构”类二次处理。
- 落位基准应贴近 `首页参考图.png`：装订件位于首页 Banner 左侧蓝色档案板边缘，作为弱结构装饰，不得遮挡标题纸卡、搜索条或首屏交互热点。

Updated on `2026-06-09` for 首页“接口图鉴”卡片点击收敛:

- 用户明确否定首页 PC 端“接口图鉴”卡片继续保留“整卡任意位置跳转”的交互；主要问题是用户在复制摘要或字段文字时会被误导到详情页。
- 当前接受方向是“明确热点跳转 + 正文可复制”：缩略图、标题、底部 `查看详情` 为真实入口，摘要、字段 chips、分类名、记录号等区域保持纯文本语义并允许直接选中复制。
- 后续若继续迭代这组卡片，不要回退到整卡链接，也不要引入双击跳转、二次确认弹窗或复制/跳转混合判定这类笨重方案。

Updated on `2026-06-04` for OCR 卡片缩略图修复:

- 用户明确否定 `条形码识别`、`海关报关单`、`事业单位法人证书`、`印章识别`、`基本存款账户信息`、`组织机构代码证`、`中国出口许可证` 这些卡片继续复用无关通用缩略图。
- 本次问题根因不是单张图片内容坏掉，而是这些 slug 没有专属 `thumbnailAssetsBySlug` 映射，页面回退到了 `fallbackThumbnailByKind`：其中多张 `document` 类卡片落到 `business-license-thumb.jpg`，`barcode-ocr` 落到 `universal-identification-text-thumb.jpg`。
- 这类已确认需要专属材料记忆点的接口，不应再依赖 `visualKind` 通用回退图；后续新增或替换相关卡片时，需同时检查 `src/App.tsx` 的缩略图映射是否完整。
- 本轮为上述 7 个 slug 新增了专属桌面档案风 `720x520` 缩略图，延续现有蓝色档案板摆拍体系，不改卡片结构或移动端表现。

Updated on `2026-06-04` for 首页左侧装订件方向:

- 用户明确指出首页左侧装订装饰的问题不在“孔眼不够精致”，而在于当前整体被做成了厚黄铜、粗横杆、工业五金件式的笨重结构。
- 当前接受方向应直接参考 `首页参考图.png`：装订孔与装订环是一整组，环要细、轻、克制，像线材穿过小孔眼，而不是厚重机械件。
- 后续若继续调整首页左侧装订装饰，默认目标不是“做一个更贵的黄铜孔眼”，而是保持参考图那种轻装帧、弱工业感的整体结构关系。

## First Read

When starting a new task, read these files in this order:

1. `AGENTS.md`
2. `PROJECT_VISION.md`
3. `DESIGN.md`
4. `SESSION_PROGRESS.md`
5. `MOBILE_WEB_PLAN.md` when continuing mobile web structure work
6. `docs/post-dev-qa-checklist.md` when continuing post-development QA

## Source Of Truth

- Live frontend target: `http://localhost:5173/`
- Product direction: `PROJECT_VISION.md`
- Visual system and implementation rules: `DESIGN.md`
- Mobile web task plan and progress pointer: `MOBILE_WEB_PLAN.md`
- Post-development QA checklist: `docs/post-dev-qa-checklist.md`
- Official OCR material source: `docs-source/ocr-interfaces/latest/`
- Historical screenshots and delivery artifacts are reference only, not current truth.

## Current Stage

The project is already past the blank-slate phase and has entered the browser-compatibility and cleanup stage.

Updated on `2026-06-10` for 微信内置浏览器兼容性准备:

- 当前兼容性专项已收敛为“微信聊天中点开链接后进入的微信内置浏览器优先”。
- 正式目标范围固定为 `iPhone 微信内置浏览器` 与 `Android 微信内置浏览器`；桌面浏览器、独立 Safari、独立 Chrome 与其他 App 内 WebView 暂不作为本轮默认主线。
- 已新增 `docs/wechat-webview-compat-checklist.md` 作为微信专用检查入口；后续如执行微信兼容性实测，优先填写该文档中的测试矩阵、页面 smoke flow 与问题记录模板，而不是直接从桌面 QA 清单起步。
- 本地 Chromium + 微信 UA 移动视口预检已先跑一轮，只作为真机微信前置筛查，不作为正式通过结论。
- 当前手机端首页真实主入口是“接口图鉴”分类目录 `.home-directory-link`，不是桌面端搜索框、分类 chips 或档案卡片网格；微信检查清单的首页 smoke flow 已按该结构修正。
- 预检发现 `/interfaces/idcard` 存在 React duplicate key warning（`Nation` / `card-Nation`），这不是微信专属问题，后续可作为详情页稳定性/代码清理项单独处理。

Updated on `2026-06-04` for 字段来源模块下线:

- 用户已明确放弃详情页“字段来源示意”方向；所有子页面正文中的该模块与左侧索引入口均已删除。
- 后续默认不要恢复字段来源样张、热区标注、CSS 示意卡或相关导航入口，除非用户再次明确提出。

Current real state in code:

- A desktop-first archive-style homepage is implemented.
- A detail-page template is implemented.
- The site is a front-end OCR atlas, not an online debugging tool.
- Visual language has been moved to a paper archive / blue dossier style.
- Build is passing on the current codebase.

Updated on `2026-06-04` for 开通流程指引页文案方向:

- 用户明确指出当前页面里同一含义在步骤主句、补充说明、截图标题和截图提示中多次重复，阅读时会发懵。
- 开通流程页后续文案应遵循单一职责分工：步骤主句只写动作，补充说明只写前提/提醒，截图区只写“看哪里”，不要再让正文说明和截图说明重复表达同一件事。
- 对流程页中的弱动作表达保持警惕，避免继续使用“按需填写”“进入后查找”“提交该申请”这类信息密度低、不能直接指向下一步操作的句式。

Updated on `2026-06-05` for 手机端 M5 收口:

- 开通流程页手机端现在保持“流程优先”：首屏保留两条主流程入口，但顶部卡片标题已缩成短任务名，避免长流程名在窄屏里被拉散。
- 原先和首屏重复的流程索引在手机端已降级为正文后方折叠块；桌面端继续保留纸卡索引，不回退。
- 步骤卡在手机端重新整理为稳定单列：动作标题、补充说明、截图入口、附件下载各自占一层；`查看大图` 不再压在截图内容右下角，而是变成稳定的块级入口。
- 截图 lightbox 在手机端已改成近全屏，并在打开时锁定页面滚动。
- Playwright 实测 `390px`、`428px` 和桌面 `1600x900` 均满足 `scrollWidth === clientWidth`。

Updated on `2026-06-05` for 手机端 M6 收口:

- 补了一轮 Playwright 全站回归，并修掉两处跨阶段回退。
- 首页手机端最后一层覆盖曾把分类 chips 打回竖排列表，导致第一张接口卡重新被压低；现已恢复横向可滑 chips，`390px` 下首张接口卡顶部约为 `1032px`，重新早于旧基线 `1277px`。
- 从首页点击接口卡进入详情页时，已不再出现短暂的“先落在页面中段，再卷到顶部”的过渡；当前进入详情页时 `scrollY` 直接落在 `0`。
- 手机端专项文档 `MOBILE_WEB_PLAN.md` 已更新为 `M6 已完成`。如果后续继续手机端工作，默认应视为新的专项轮次，而不是继续沿用本轮待办。

Updated on `2026-06-05` for 手机端 M7 成品化计划:

- 用户明确指出当前手机端只是“工程可用”，样式布局还不像成品；后续应按手机用户第一任务重排体验，而不是继续只看无横向溢出。
- `MOBILE_WEB_PLAN.md` 已新增 `M7 手机端成品化体验优化`，包含 PC 端锁定规则、三页手机端框线图、分期实施顺序和验收口径。
- 继续手机端工作时，先读 `MOBILE_WEB_PLAN.md` 的 M7，不要再用 M6 已完成作为停止依据。
- M7 首轮已完成：清理中断前临时 `Mobile polish pass` 草稿样式，建立文件末尾单一 `Mobile v2` 覆盖区，并完成首页、详情页、流程页首轮手机端成品化。
- PC 端当前视觉视为冻结基线；每期手机端修改都必须复拍 `1600x900` 桌面截图，确认首页、详情页、开通流程页不回退。
- 验证结果：`npm run build` 通过；首页、`/interfaces/idcard`、`/interfaces/vat-invoice`、`/activation-guide` 在 `390x844`、`428x932`、`1600x900` 下均满足 `scrollWidth === clientWidth`。
- 首页首张接口卡在 `390px` 下顶部约为 `617px`，已进入首屏内；相关验证截图现已清理。
- 当前手机端专项已阶段性收口；除非用户重新开启手机端专项，否则后续默认不再把手机端视觉微调作为当前主线。

Updated on `2026-06-09` for 运行时位图格式统一:

- 当前运行时资源已进一步统一到更轻的位图交付格式：接口缩略图从 `*.jpg` 切换为 `*.webp` 引用，首页右侧罗盘压印 `home-compass-seal-faint-alpha` 也已切到 `*.webp`。
- `scripts/optimize-home-assets.mjs` 的 `thumbs-runtime` 分组已改为直接产出 `*.webp`，后续不要再把新生成的缩略图以运行时 `JPG` 直接接入页面。
- 透明装饰素材不要一刀切改成 `WebP`；需先测体积收益。当前 `home-compass-seal-faint-alpha` 已完成 `WebP` 运行时切换，而 `decor-compass-seal-alpha.png`、`decor-stamp-collected-alpha.png`、`decor-stamp-ring-alpha.png` 这类透明 PNG 不应仅为“统一格式”而盲转。
- 当前已确认 `src/assets/thumbs/*.jpg` 保留为已认可缩略图基准，运行时只引用同名 `*.webp`。清理资产时不要删除这批 JPG 基准，除非先同步更新项目规则和用户确认。
- 当前已确认部分 `src/assets/resources/*.webp` 是 WebP-only 运行时资产，不再要求从同名 PNG 母版重建；`scripts/optimize-home-assets.mjs` 只维护当前仓库仍保留源母版的资产任务。

Updated on `2026-06-05` for 接口地址单一事实源:

- 当前详情页地址信息原先分散在三处：`src/data/ocrDocs.ts` 手写完整文档地址、`src/App.tsx` 中 `buildCatalogDoc()` 按 slug 直接拼地址、`scripts/build-ocr-source-map.mjs` 中维护 canonical endpoint。这样会让 placeholder 详情页和真实文档页逐步漂移。
- 本轮已把 canonical endpoint 映射生成到 `src/data/generated/interfaceSourceMap.generated.ts`，并让 `getEndpointInfoBySlug()` 成为详情页地址的统一读取入口。
- `buildCatalogDoc()` 已改为读取该映射，不再按 slug 盲拼测试/生产 URL；这修正了如 `vat-invoice` 等接口的真实路径，也为后续 prod-only 接口保留正确表示能力。
- `EndpointInfo.testUrl` 已调整为可选。像 `financial-ticket-mixed`、`handwritten-signature` 这类仅生产环境开放的接口，后续详情页将不再伪造测试地址。
- `validate:ocr-catalog` 脚本原先依赖旧版 `interfaceCatalog` 字面量结构，已改为校验 `interfaceCatalogSeed` 的 slug / title 对齐，恢复可用。

Mobile web initiative, started on `2026-06-03`:

- User has restarted mobile web planning after earlier intentionally blocking mobile adaptation.
- A dedicated mobile plan/progress document now exists: `MOBILE_WEB_PLAN.md`.
- Current mobile diagnosis from live page: homepage and activation guide do not horizontally overflow at 390px but are inefficient; detail page is the P0 issue because it horizontally overflows to roughly 835px and hides the main access information.
- Current mobile phase: `M6 验证、回归与文档收口` is completed.
- Completed mobile subtask: `M1.1 修复详情页横向溢出`. `/interfaces/idcard` and `/interfaces/vat-invoice` now satisfy `scrollWidth === clientWidth` at 390px; desktop `1600x900` smoke check also stayed within viewport; build passed.
- Completed mobile subtask: `M1.2 详情页阅读顺序重排`. Mobile detail pages now surface the back entry, category, title, summary, test/prod endpoints, and quick actions before the directory; the desktop left nav remains intact.
- Completed mobile subtask: `M1.3 改造接口地址区域`. Mobile endpoint rows are now stacked as compact cards with label + copy action above the URL, so long URLs no longer compete with the button for horizontal space.
- Completed mobile subtask: `M2.1 压缩统一站点头部并统一移动端间距`. Mobile header, spacing, specimen density, activation guide density, and shared mobile rhythm were tightened without changing desktop layout.
- Completed mobile subtask: `M3 首页手机端结构重排`. The final mobile override layer now keeps a single representative specimen card visible, makes the category row horizontally scrollable chips, surfaces record cards before the full directory, and preserves the desktop structure.
- Next mobile subtask: none in the current mobile plan. Start a new mobile follow-up only if the user opens another round.
- Do not start by beautifying mobile visuals. Continue by preserving the current mobile homepage ordering and moving on to the touch interaction work.

Current catalog baseline:

- Total interface cards: `44`
- Complete structured detail docs: `2`
- Complete docs currently implemented: `idcard`, `vat-invoice`
- Remaining cards mostly use generated "capability archive" fallback content instead of source-accurate full docs.

## What Has Been Built

### Homepage

Implemented in `src/App.tsx` and `src/styles.css`.

- Archive-style landing page with search
- Category filtering
- Interface card grid
- Full index directory
- Real bitmap material usage for paper/specimen surfaces

### Detail Page

Implemented in `src/App.tsx`.

- Route: `/interfaces/:slug`
- Left anchor navigation
- Business / developer view switch
- Visual specimen area
- Field groups
- Request parameter section
- Response structure section
- Error code section
- Related interfaces section

### Data Layer

Implemented in `src/data/ocrDocs.ts`.

- Shared types for OCR docs, fields, groups, categories, and cards
- Full interface card catalog
- Two hand-authored complete docs
- Fallback doc builder for cards without complete source mapping

## Document Roles

### Product / Thinking Documents

- `PROJECT_VISION.md`
  Defines what the product is supposed to be: an OCR capability center, not a plain API parameter site.

- `DESIGN.md`
  Defines the current visual system in concrete terms: colors, paper/archive metaphor, layout, materials, forbidden regressions.

- `MOBILE_WEB_PLAN.md`
  Defines the mobile web task phases, current progress pointer, page-level mobile restructuring goals, and acceptance checks for the mobile initiative.

### Progress / Historical Thinking

- `子页面设计思路V1.txt`
  Older, narrower single-detail-page thinking. Useful as process history, but no longer the highest-level source of truth.

- `README.md`
  Environment and repo usage notes.

- `docs-source/ocr-interfaces/README.md`
  Documents how official OCR PDFs are stored and updated.

## Code Analysis Summary

### Architecture

- Stack: `Vite + React + TypeScript + React Router`
- Main entry: `src/main.tsx`
- Main app/router: `src/App.tsx`
- Main styles: `src/styles.css`
- Data source: `src/data/ocrDocs.ts`

This is currently a mostly static, data-driven front-end atlas. The important pattern is:

`structured doc data -> shared UI template -> home cards + detail pages`

That matches the product direction in `PROJECT_VISION.md`.

### Strengths In Current Code

- Product framing and visual direction are aligned.
- The page is no longer a generic SaaS dashboard.
- Data structures are reusable enough to scale to more OCR interfaces.
- The fallback doc builder keeps incomplete interfaces navigable.
- Local source-document management has started, instead of burying everything in ad hoc files.

### Current Gaps

- Full source-accurate detail data exists for only `2` interfaces.
- Most detail pages are still synthesized from `previewFields`, not from parsed official docs.
- PDF source ingestion is not fully connected to frontend data generation yet.
- Some endpoint information is inconsistent between files and likely needs a source audit before bulk expansion.
- There is at least one visible encoding issue in CSS text content.

## Known Issues To Watch

- 浏览器兼容性仍未建立正式支持矩阵；后续进入 QA 时需要明确桌面浏览器、iOS Safari 和 Android Chrome 的最低验收范围。

- 当前目录中仍保留部分源素材格式与运行时格式并存的情况；`src/assets/thumbs/*.jpg` 是当前认可缩略图基准，开通流程 `image*.png` 是 WebP 再导出的母版。清理时要区分“运行时引用”和“基准/母版素材”。

## Source Pipeline Status

The repository already contains the beginnings of a real source pipeline:

- `docs-source/ocr-interfaces/latest/manifest.json`
- `scripts/sync-ocr-docs.mjs`
- `scripts/build-ocr-source-map.mjs`

Current status:

- Manifest/source bookkeeping exists
- Interface-to-source mapping work exists
- Frontend catalog still depends mainly on manually maintained TS data
- PDF parsing / field extraction is not yet the actual publishing pipeline

## Recommended Next Step

The current most valuable next milestone is:

1. 明确浏览器兼容支持矩阵和验收设备范围。
2. 盘点 `sticky`、`100vh`、`safe-area-inset`、横向滚动、锚点跳转等高风险兼容点。
3. 在现有桌面与手机成品基线上做跨浏览器回归，而不是继续扩大功能范围。

## Verification Snapshot

Verified on 2026-06-09:

- `npx tsc --noEmit --noUnusedLocals --noUnusedParameters`
- `npm run build`
- Result: passed

## Material Pass Status

Homepage material direction is no longer in exploratory prototyping.

- 纸面、布面、索引卡、搜索纸条、样本卡和印章压印所需的运行时主资产已经基本稳定。
- 当前资产治理重点不再是继续换风格，而是区分运行时交付格式与源素材格式，并持续压缩首屏关键路径体积。
- 后续若继续做资产优化，优先检查运行时是否仍在直接引用未压缩 `PNG/JPG`，以及新增素材是否绕开了 `scripts/optimize-home-assets.mjs`。

## User Rejection Notes

Updated on `2026-06-02` for 个人身份类预览图真实感:

- 用户明确指出：个人身份类卡片可以放在同一类档案桌面场景里，但场景中的“证件本体”必须像真实证件，否则会和整体档案风格割裂。
- 当前 `idcard-thumb.jpg` 被指出与日常看到的身份证明显不一样；具体问题是正反面都偏通用浅蓝白信息卡，国徽页缺少真实身份证背面应有的关键标题结构，字段排布过松，材质像 AI 演示卡而不是证件。
- 后续生成身份证预览图时必须保留二代居民身份证的常见视觉记忆点：人像页信息密度、居民身份证背面标题/国徽/签发机关/有效期限结构、真实底纹和证件卡质感。所有姓名、号码、地址、机关、期限必须虚构或遮挡，不能生成可用证件。
- 当前个人身份类素材的替换优先级：第一优先 `idcard`、`mainland-travel-permit-for-gat`、`gat-pass-front`、`gat-pass-back`；第二优先 `social-security-card`、`driver-license`；第三优先 `passport`、`household-register`、`marriage-certificate`。

Updated on `2026-05-29` for homepage hero/title-paper prototype:

- Homepage first-screen paper title area: the top decorative labels `CATALOGUE`, `OCR-ATLAS`, and `No. 0001` have no product value and the user does not like them. Do not reintroduce these labels as filler.
- If removing those labels makes the paper feel empty, solve it with better vertical grouping, title scale, search-strip placement, or meaningful OCR/archive elements rather than decorative label chips.
- Homepage first-screen search box: the current large clean modern input reads too much like a SaaS search field. Future versions should make it feel like a paper archive search/index strip with vellum paper, aged border, short shadow, modest radius, and restrained printed/typed placeholder text.
- Homepage first-screen right-side pale oval stamp/watermark was explicitly called ugly. Do not reuse the pale gray oval watermark treatment.
- The replacement stamp direction has shifted to the user's screenshot reference: a faint gray transparent compass seal / paper imprint with fine worn lines, low contrast, no visible paper-background disk, and no heavy blue badge treatment.
- Font direction for this area should stay compatible with system defaults: use a serif fallback stack for the large Chinese title and system sans-serif for body/search UI; avoid relying on custom webfonts just to fix this section.

Updated on `2026-05-29` after implementation:

- Homepage hero title copy is now `OCR 接口图鉴`.
- Homepage hero description copy is now `接口换种读法，让开发者也能拥有高颜值、易查阅的文档`.
- The hero search field now uses generated bitmap material `home-search-paper-field.png` as the paper/search-strip texture while keeping the input as real DOM for interaction.
- The hero compass seal now uses transparent alpha asset `home-compass-seal-faint-alpha`; do not replace it with a full paper-background image that creates a visible circular or rectangular backing.
- Verified live page at `1600x900` via Chrome headless; its local screenshot has since been cleaned. Build passed with `PATH="$PWD/.tools/node/bin:$PATH" npm run build`.

Updated on `2026-06-01` for pure-image Banner review:

- The first generated pure-image Banner review pass was directionally accepted for material quality: the user explicitly认可 paper texture and overall tactile improvement.
- The user explicitly wants the next pass to go beyond material realism. Typography, icon design, title composition, navigation lettering, search icon treatment, and other small graphic details must feel more intentionally designed and more aligned with the archive/catalog tone of the site.
- Anti-regression rule for future Banner image passes: do not stop at “same composition + better paper texture”. If the bitmap Banner still reads like ordinary UI text and ordinary icons placed onto better paper, it is not sufficient.
- Future Banner image refinements should preserve the current live content structure while increasing editorial/archive flavor through type hierarchy, serif/sans pairing feel, printed-label sensibility, more deliberate icon shapes, and stronger overall design authorship.

Updated on `2026-06-01` for pure-image Banner rollback:

- The homepage pure-image Banner experiment (`?hero=image`) has been rolled back by user decision and is no longer an active runtime path.
- Current homepage implementation stays on the original direction: structured DOM layout with layered bitmap materials (not whole-banner single-image rendering).
- Trial assets `home-hero-banner-v1.png` and `home-header-banner-v1.png` plus related experiment screenshots were removed to avoid future confusion.

Updated on `2026-06-01` for 开通流程指引页改版:

- 用户明确否定了“信息过载”版本：不接受把流程、示例、申请表说明、下载入口等拆成多块并列区域导致阅读主线断裂。
- 开通流程页的目标被明确收敛为单一问题：`我申请一套 OCR 参数应该遵循哪些步骤`；页面应只强化流程本身。
- 用户明确要求子页面顶部菜单与首页菜单保持一致，不接受子页面使用另一套导航结构。
- 用户明确要求流程层级和步骤层级视觉区分，不接受两者使用同一种编号样式造成混淆。
- 用户明确要求左侧索引只保留两条主流程，不接受把示例区/附件区当作并列流程节点。

Updated on `2026-06-01` for 首页小 logo / “接口图鉴”小标题牌候选重做:

- 上一轮首页小 logo 与“接口图鉴”小标题牌生图候选被用户整体否定，按失败稿处理，不作为后续优化基底。
- 明确禁忌：不要再生成“纪念品徽章感”“廉价复古贴图感”“黄铜小零件拼装感”的小资产，也不要用过多边饰、金属圈、勋章外框、齿轮或无功能装饰来冒充档案气质。
- 小 logo 与小标题牌都应回到更克制的方向：强调档案检索、纸面编目、小尺寸清晰和现有深蓝纸面体系的协调，不追求夸张复古道具感。
- 本轮目标对象严格限定为两个独立小资产：左上角品牌小图标位，以及“接口图鉴”板块标题行中的行内小标题牌；不要误做成首页大标题、横幅或大容器装饰。
- 如果用户选中的小标题牌素材本身已经带字，后续禁止再叠加 DOM 可见文字；标题牌只保留一层文字视觉。
- 首页“接口图鉴”小标题牌必须保持克制的小签尺度，不得放大成横幅感；桌面优先按小档案签而非大标题条来控制尺寸和留白。
- 用户明确要求移除“下载原始 Word”；真正需要下载的仅为“银商大脑 OCR 能力申请表”，且入口应放在流程中“需要附件”的对应步骤处，而非页首。

Updated on `2026-06-01` for 接口详情页信息架构讨论:

- 用户认可“如无必要，勿增实体”的简洁设计原则，并希望接口正文页也回到第一性原理：用户进入页面主要是为了快速找到调用地址、请求参数和返回参数。
- 当前上一轮“右侧接入速查 + 正文多个章节”的优化方向仍不够彻底；不能只新增速查卡，而正文继续保持能力展示、概览、字段来源、请求、返回、错误码、相关接口等平铺结构。
- 下一轮接口详情页应让首屏和左侧导航明确高亮最关键任务：测试地址、生产地址、请求参数、返回参数；这些项目需要可点击直达，最好能在首屏形成一条清晰的“接入路径”。
- 字段来源、样张示意、场景、相关接口可以作为辅助理解内容保留，但不应抢占用户第一眼找文档的主路径。

Updated on `2026-06-01` for 接口详情页再次收敛:

- 用户要求删除正文中的独立“调用地址”板块，因为首屏已经完整提供地址、复制和环境信息；后续不要再做首屏和正文双份地址信息。
- 用户明确指出左侧导航中“字段来源”和“错误码”不能做成视觉上像“返回参数”子页面或子级菜单；后续详情页导航必须用分组而非缩进附属关系表达主次。
- 用户要求在正文最后新增“请求示例 / 返回示例”章节，示例应作为开发参考补充，而不是插进主路径中部打断阅读。
- 用户补充要求首屏提供 PDF 下载入口，按钮应是小功能位，下载资源对应接口资源库里的 PDF，不要盖过调用地址主信息。

Updated on `2026-06-01` for 接口详情页左侧导航收敛:

- 用户明确指出左侧吸顶导航如果因为 `返回参数` 二级项长期展开而超过一屏，会让用户无法看到下半部分内容；后续默认不要让所有二级项一直摊开。
- 当前确认的可接受方向是：仅 `返回参数` 拥有二级导航，且二级导航在进入 `返回参数` 正文区域后自动展开，离开该区域后自动收起；其他分组始终保持普通一级导航。
- 用户明确指出左侧纸卡中的分组标题如“辅助理解”“示例参考”之前过于贴边；后续详情页侧栏应保持统一内容基线，让分组标题、分隔虚线和导航条目都留出稳定呼吸边距。

Updated on `2026-06-01` for 接口详情页左侧导航交互修正:

- 用户进一步指出：点击左侧 `返回参数` 一级项时，二级小节必须立刻展开，不能只在滚动监听切换到 `response` 后才出现；当前已确认这属于交互即时反馈要求，不是可选优化。
- 用户进一步指出：`请求参数`、`返回参数` 作为主路径入口可以常驻重点样式，但该样式必须明显弱于当前激活态，不能继续和“已选中”看起来一样。
- 用户进一步指出：分组标题如“接入主线”与上方边界也需要补足垂直留白，不只是左右不要贴边。

Updated on `2026-05-28` for future anti-regression reference:

- When the user explicitly says a result is unwanted, unattractive, or should not reappear, record it here during the same task; mirror it into `AGENTS.md` if it should govern future sessions globally.
- Homepage Banner: the four specimen cards on the right must not be wrapped in a separate framed container that visually disconnects them from the left Banner paper. They should read as part of the same hero composition.
- Homepage Banner first specimen card: the paperclip must read as clipped onto the card edge, not laid flat on top of the title area or covering readable text.
- Homepage Banner ID card and business license specimens: do not scale them up until they visually press against the card edges. Keep a clear inner margin so the paper card still has breathing room.
- Homepage "接口图鉴" paper: do not reintroduce a darker inset rectangle, a second-sheet illusion, or any obvious darker sub-container on the main yellow paper surface.
- Homepage "接口图鉴" paper: for the large dynamic paper container, do not use `border-image fill` or a stretched full-surface paper bitmap as the center paper implementation. The correct direction is edge-only paper border plus a repeatable center paper texture.
- Homepage "接口图鉴" paper: never reintroduce the gray rounded-rectangle inner frame line from `home-record-paper-alpha.png`. The user specifically wants only that repeated mechanical frame line gone forever; keep natural paper texture, rough torn edges, folds, stains, wear, and shadows.
- Homepage "接口图鉴" paper: left/right rough edge strips must not cover the top/bottom edge strips or start above the top edge; top/bottom edges should visually cap the side strips at the corners.
- Homepage "接口图鉴" paper: do not let the side-edge tile start on a frame that exposes a horizontal paper flap directly under the top edge. If the edge assets are reused as repeat-y strips, offset their Y start so those top flaps stay hidden.
- Homepage "接口图鉴" paper: do not allow a bright outer rough paper edge to transition into a visibly darker lower half, a vertically stretched side edge, or a flat rectangular pale-yellow backing plate showing through under torn transparent edges.
- Homepage blue dossier board: do not use a visibly stretched, blurry, low-fidelity large bitmap with fuzzy white flecks. Prefer tiled or otherwise non-stretched cloth material handling.

## Record Paper Refactor

Updated on `2026-05-28`:

- The homepage "接口图鉴" large paper container has been refactored away from `border-image` stretch. It now uses dedicated runtime edge assets for top/bottom/left/right plus a separate `.home-record-surface` wrapper for the center paper and content.
- `paper-wide-alpha.png` remains the source donor for the rough paper silhouette, but it no longer participates as a full-surface runtime paper. The new runtime assets are `record-paper-edge-top.webp`, `record-paper-edge-bottom.webp`, `record-paper-edge-left.png`, and `record-paper-edge-right.png`.
- The center surface continues to use `paper-clean-mottle-tile.webp` as a repeatable paper tile. This center paper must stay independent from the rough edge layer so the container can grow naturally with filtered content without stretching or exposing a rectangular backing board.
- The previous `.home-record-paper::before` `border-image` settings from `home-record-paper-alpha.png` have been explicitly reset in the final V5 rule. This prevents the asset's gray rounded inner frame from being painted repeatedly over the dynamic-height record paper.
- The record paper edge layering is: side strips on `.home-record-paper::after`, top/bottom strips above them on `.home-record-paper::before`, and `.home-record-surface` above both for the center paper and content.
- For this container, future edits should treat `.home-record-paper` as the outer edge shell and `.home-record-surface` as the center paper surface. Do not collapse them back into one `border-image fill` layer.

Updated on `2026-05-29`:

- The `2026-05-28` edge-splitting attempt was visually rejected. Although it removed the repeated gray inner frame, it broke the paper continuity at the top corners because the top strip and side strips were no longer a naturally continuous shell.
- The current accepted direction restores a same-source outer shell on `.home-record-paper::before` using `paper-wide-alpha.png` as a border-only shell, while keeping the center paper independent and stretch-safe.
- The main paper center is still not allowed to use `border-image fill` or a full-surface stretched bitmap. Instead, `.home-record-paper::after` now acts as the shell underlay and `.home-record-surface` remains the content paper layer above it.
- The gray rounded inner frame from `home-record-paper-alpha.png` remains permanently banned. Only the rough outer torn shell continuity was restored.
- Anti-regression rule: do not split a same-source paper shell into unmatched top/side runtime strips if the result creates corner seams, exposed gaps, or the feeling that the top edge and side edges belong to different sheets.

Updated on `2026-06-01` for 首页首屏小精灵位置修正:

- 把首页首屏小精灵绑定到搜索框左侧或左下作为“搜索引导”方向已被事实证明不稳定；它会持续和标题、副标题、搜索框争同一块注意力，即使不遮挡也会让左下角显得被硬塞进第二主元素。
- 后续首页首屏若保留该角色，默认方向应是放在左卡右上角的相对空白区，作为独立轻装饰处理，与标题主轴和搜索入口解耦。
- 用户在 `2026-06-04` 明确否定首页“全部接口总目录”小卡片使用渐变色容器；后续这组 `.home-directory-link` 应保持克制的暖纸纯色底，不要再用上下渐变去制造层次。
- 同日进一步确认：即使没有显式 `linear-gradient`，也不要用顶部内高光或类似“亮边”阴影去伪造层次；这会继续读成渐变白卡。
- 用户在 `2026-06-04` 明确要求首页“全部接口总目录”按分类行做垂直居中关系；左侧分类标题块与右侧小卡片云不能继续统一顶端贴齐。

## Index Paper Material Cleanup

Updated on `2026-05-29`:

- The homepage left "索引目录" card previously used `paper-card-alpha.png`, whose baked-in black/gray ornamental frame produced an overly mechanical four-sided line around the card.
- The current implementation uses `home-index-paper-clean-alpha.png` only for `.home-index-paper`; other paper cards still use their existing assets to avoid broad visual changes.
- Anti-regression rule: do not point `.home-index-paper` back to the uncleaned `paper-card-alpha.png` unless the mechanical inner frame is removed by another clean material treatment.

## Identity Thumbnail Pass

Updated on `2026-06-02`:

- 用户指出首页 Banner 四张小卡片里的身份证和营业执照方向更好；关键不是一次性生成整张含文字场景，而是先做独立证件样本，再放入纸卡/档案桌面场景。
- 本轮确认个人身份类预览图的优先规则：证件本体用独立样本承载真实版式、底纹、人像、字段和样张标记；场景只负责纸卡、档案板、夹子、桌面光影。中文字段、号码、地址、签发机关、有效期限等可读信息优先本地排版，不交给生图模型直接在整张场景里生成。
- `idcard-thumb-v2` 到 `v7` 的主要问题包括：模型字段黑块/剪影、透视文字不稳定、底纹网格过强、整体怪异或仍像演示卡；这些版本不要接入最终首页卡片。
- 用户在 `2026-06-03` 明确要求回退新生成的身份证预览图，并希望其他个人身份类证件也使用以前版本。
- 当前已将 `src/App.tsx` 中的 `thumbnailAssetsBySlug.idcard` 回退为旧版 `idcard-thumb` 方案。其他个人身份类证件继续使用已有旧版 `*-thumb` 方案，不要默认套用 `v7` 的生产方式。

## Update Rule

## OCR Specimen Pretest

Updated on `2026-06-03`:

- 本轮按 `docs/ocr-specimen-prompt.md` 的安全合规降级路径做了预先测试。由于当前会话没有可用内置 `image_gen` 工具，也没有 `OPENAI_API_KEY` 可走 CLI 图像生成，因此测试范围限定为本地 SVG 合成，而不是真实生图模型输出。
- 新增一次性脚本 `scripts/generate-ocr-specimen-pretest.mjs`，输出到 `output/ocr-specimen-pretest/`。已生成身份证双面、营业执照、户口本三类测试样张的 SVG/PNG/WebP。
- 测试结论：身份证双面和营业执照能稳定表达“材料类别可辨认 + 字段清晰 + 全部虚构无效 + SAMPLE/示例标记明显”；户口本暴露了密集表格材料的关键风险，正式 skill 不能只生成 prompt，还需要内置字段长度、字号、换行和列宽约束。
- 当前这些输出是预案验证资产，不是最终首页缩略图替换来源；除非用户明确要求，不要接入 `src/assets` 或替换现有卡片图。

## Update Rule

When a session meaningfully changes product direction, data coverage, source pipeline, or major UI state, update this file with:

- date
- current milestone
- what became true
- what is still placeholder
- next recommended step
Updated on `2026-06-05` for 手机端 M4 收口:

- 详情页字段来源模块已经下线，因此手机端 `M4` 不再包含任何 hover/tap 联动样张恢复工作；这一阶段的真实范围已经收敛为“字段表卡片化 + 代码块移动交互”。
- `FieldTable` 现在在桌面端继续保留宽表格，在 `720px` 以下切换为字段卡：中文名、字段 key、类型、标签和说明按纵向阅读顺序组织，不再要求用户横向拖整张表。
- `RequestSkeleton` 的 `Header` / `Body`，以及示例区的 `请求示例` / `返回示例`，都已补齐统一复制按钮；代码块仍保持内部横向滚动，不强行换行破坏 JSON。
- 当前手机端主线已推进到 `M5 开通流程页手机端优化`。

Updated on `2026-06-08` for 首页手机端收口:

- 用户指出首页首屏右侧四张样例卡片中原本更好看的“已收录”印章被手机端性能/收口过程简化掉了，当前简化圆章不可接受。
- 本轮恢复范围已锁定为桌面端首页 Hero 四张样例卡片；移动端样例区是否继续保留，不在本次任务内展开。
- 当前接受方向是恢复 `src/assets/resources/decor-stamp-collected-alpha.png` 这类位图旧章质感，避免再回到纯 CSS 边框圆圈。

- 用户明确否定首页手机端当前“Hero + 索引目录 + OCR 接口档案 + 全部目录”连续堆叠的布局，认为页面主线混乱。
- 当前接受方向已收敛为：首页手机端只保留顶部头部、首屏 Hero 检索区和“全部接口总目录”；`索引目录` 与 `OCR 接口档案` 在手机端默认隐藏，不再作为当前主线的一部分。
- 同轮还确认了两个具体反例：右上角 `联系支持` 入口不能出现裁切/挤压的显示 bug；“全部接口总目录”标题说明文字不能贴着纸面左边缘，必须回到稳定内边距基线。
- 同轮进一步确认：手机端与窄屏端的 `联系支持` 不要继续保留蓝底图标按钮，统一改为接近头部导航的纯文字可点击入口，不带图标、不额外占据按钮式体积；桌面端现有按钮样式可保留。

Updated on `2026-06-25` for 详情页共享头部回归:

- 用户明确指出：详情页头部里的 `参数 / 返回 / 示例 / 错误码` 这组快捷标签只属于手机端，不允许在桌面端再次出现；这类泄漏属于严重回退。
- 当前已确认一个具体风险点：`SiteHeader` 即使在桌面端继续接收 `mobileTabs`，也必须依赖“默认隐藏 + 仅在移动端断点显式打开”的样式策略，不能只靠宽屏媒体查询兜底，否则会被桌面通用 `nav` 规则重新显示。
- 后续凡是调整共享头部、详情页快捷入口、移动端菜单或 `nav` 通用样式，都必须回归桌面 `1600×900` live 页面，确认没有额外一行移动端标签、没有头部增高、没有空白占位。

Updated on `2026-09-16` for OCR 模型训练指南独立视觉重做:

- 用户明确否定复用旧页面的蓝色档案背景、浅色纸张和旧装饰素材；该页面必须从零建立视觉系统，不得只换配色或沿用旧版布局样式。
- 本轮改为深石墨底、浅色文字与信号橙重点色，用数字、网格和分栏建立层级；六步梗概首屏等权展示，平台操作细节另起章节。
- 只保留 Word 中的真实平台操作截图作为说明内容，移除旧素材纹理与页面装饰；视频链接、第三步李顺风联系方式、最后一步王骞联系方式均保留。
- 完成交付文件 `交付/OCR模型自训练全流程操作指南.html`；1600×900 桌面截图已目视复核，六步卡片、步骤详情、平台视频、图片放大、复制联系方式与打印均通过 Playwright 检查，390px 页面无横向溢出。

Updated on `2026-09-17` for 临时文件清理与“接口定制指引”发布接入复核:

- 已将 `.codex-work/training-guide/` 下 72 个中间脚本、审稿/验证截图、抽取文本和打印/PDF 检查产物（约 24 MB）移到 `项目回收站/2026-09-17/.codex-work/training-guide/`，保留原相对路径和恢复记录；该移动未释放磁盘空间。`.gitignore` 已精确增加 `.codex-work/`。
- 已修复 `scripts/static-server.cjs` 的目录索引解析，`/interface-custom-guide/` 现在优先返回自身 `index.html`，不再误回退到 React 主站。
- 已新增 `vercel.json`：指南静态页路由优先，`/interfaces/:path*` 和 `/activation-guide` 单独回退 React `index.html`，避免彼此覆盖。
- 已修复指南窄屏 CSS：`返回 OCR 主站` 在手机端常驻可见，页内低频锚点收起。
- `npm run build` 通过，`dist/interface-custom-guide/index.html` 与 `docs-source/OCR模型自训练全流程操作指南.html` 逐字节一致。开发服务与生产静态服务的 `/`、`/interfaces/idcard`、`/activation-guide`、`/interface-custom-guide/` 均已验证；菜单进入、返回首页、浏览器返回、指南直访/刷新、18 张内容截图加载、图片放大与 3 个视频链接均通过。
- 首页、`/interfaces/idcard`、`/activation-guide` 已用当前 live 页面做 `1600×900` 桌面目视回归，无本次接入导致的布局回退；`390×844` 仅检查新增菜单和指南返回入口，两者可见可用且无横向溢出。
- 已确认 GitHub 仓库 `yuanceshu/OCRWeb` 为公开仓库；待提交指南含真实平台截图和联系人姓名/电话/CU 账号，用户已于本轮明确授权公开提交与发布。
- 远端已 `fetch --prune`，当前分支 `codex/homepage-reference-restoration` 推送时与上游无分叉。GitHub Deployment 记录显示本轮提交 `e062fd5` 已完成 Vercel Production 部署，状态为 `success`，环境 URL 为 `https://ocr-ap0sqixg7-r-e-mi-n.vercel.app`；但本机通过 Node HTTP 与浏览器访问该域名均连接超时，因此未能实际打开线上指南复验。
- 浏览器控制台仍有已记录的 `idcard` 字段 React duplicate-key 警告（`Nation` / `card-Nation`）与 React Router v7 future-flag 提示；均非本次指南接入引入，本轮未扩大修复。
