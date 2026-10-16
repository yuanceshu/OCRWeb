# 票根能力目录数据源

本目录 Excel 为原始业务数据，网站每列保留一个独立票根，不分类、不合并。

更新 Excel 后，在项目根目录运行 `npm run build:ticket-capabilities`；执行 `npm run validate:ticket-capabilities` 可只读比对原图、字段映射、来源单元格及缩略图。提取使用 Python 3 标准库，缩略图使用项目现有 sharp，无新增依赖。

生成数据位于 `src/data/ticketCapabilities.json`；样张原图与 WebP 缩略图位于 `public/ticket-capabilities/`。来源单元格、图片 ID 和压缩包成员名保存在每条记录中。仅将该列第 5—40 行的非空值列为支持字段，说明及格式要求原样保存，不按通用字段描述改写业务含义。

原表特殊映射示例：景点“有效期”使用 `competitionNumber`；电影“影片放映类型”使用 `cooperationAgency1`。这些映射保留原文，不能自行修正。
