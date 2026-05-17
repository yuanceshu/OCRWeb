export type FieldTag =
  | "必返"
  | "可选"
  | "数组"
  | "坐标"
  | "置信度"
  | "枚举"
  | "业务核心"
  | "图片Base64";

export type InterfaceCategory =
  | "证照身份类"
  | "发票票据类"
  | "车辆交通类"
  | "商户经营类"
  | "通用文本类"
  | "地产凭证类";

export type VisualKind = "idcard" | "invoice" | "document" | "ticket" | "vehicle" | "text";

export interface FieldDef {
  key: string;
  label: string;
  type: string;
  required: boolean;
  description: string;
  tags: FieldTag[];
  formatHint?: string;
  notes?: string;
}

export interface FieldGroup {
  title: string;
  description: string;
  fields: FieldDef[];
}

export interface EndpointInfo {
  protocol: string;
  method: "POST";
  testUrl: string;
  prodUrl: string;
}

export interface VisualSpec {
  kind: VisualKind;
  coverAlt: string;
  detailAlt: string;
  annotations: string[];
}

export interface OcrInterfaceDoc {
  slug: string;
  title: string;
  category: InterfaceCategory;
  summary: string;
  scenarios: string[];
  fieldCount: number;
  endpoints: EndpointInfo;
  request: FieldDef[];
  fieldGroups: FieldGroup[];
  response: {
    overview: string;
    commonGroups: FieldGroup[];
  };
  errors: FieldDef[];
  visual: VisualSpec;
  relatedSlugs: string[];
}

export interface InterfaceCard {
  slug: string;
  title: string;
  category: InterfaceCategory;
  summary: string;
  previewFields: string[];
  visualKind: VisualKind;
  status: "complete" | "planned";
}

export const commonRequestFields: FieldDef[] = [
  {
    key: "Authorization",
    label: "认证内容",
    type: "字符串",
    required: true,
    description: "HTTP 报文头中的认证信息。页面不展示真实密钥或签名内容。",
    tags: ["必返"],
    notes: "按平台认证流程生成，不在本站保存。",
  },
  {
    key: "picBase64",
    label: "图片文本",
    type: "字符串",
    required: true,
    description: "图片文件的 Base64 编码。",
    tags: ["必返", "图片Base64"],
    formatHint: "data:image/* 转码后的 Base64 字符串",
  },
];

export const commonResponseGroups: FieldGroup[] = [
  {
    title: "页面与识别结果",
    description: "所有结构化 OCR 接口都会返回页面级信息和识别结果数组。",
    fields: [
      {
        key: "data",
        label: "结果",
        type: "字符串",
        required: false,
        description: "接口返回结果容器。",
        tags: ["可选"],
      },
      {
        key: "PageInfo",
        label: "页面信息",
        type: "数组",
        required: false,
        description: "识别返回的页面信息。",
        tags: ["数组"],
      },
      {
        key: "Result",
        label: "结果信息",
        type: "数组",
        required: false,
        description: "识别返回的结果信息集合。",
        tags: ["数组"],
      },
      {
        key: "PageIndex",
        label: "页数信息",
        type: "数字型",
        required: false,
        description: "第一页为 1，第二页为 2，以此类推。",
        tags: ["可选"],
      },
      {
        key: "ErrorCode",
        label: "返回值",
        type: "数字型",
        required: false,
        description: "0 代表成功，其他值代表失败。",
        tags: ["枚举"],
      },
      {
        key: "Time",
        label: "识别时间",
        type: "字符串",
        required: false,
        description: "接口识别耗时。",
        tags: ["可选"],
      },
    ],
  },
  {
    title: "字段与坐标信息",
    description: "FieldList 里承载字段名、中文名、识别值、置信度和区域坐标。",
    fields: [
      {
        key: "ResultList",
        label: "返回结果数组",
        type: "数组",
        required: false,
        description: "识别对象的结果列表。",
        tags: ["数组"],
      },
      {
        key: "FieldList",
        label: "数据结果集",
        type: "数组",
        required: false,
        description: "字段级识别结果集合。",
        tags: ["数组"],
      },
      {
        key: "key",
        label: "英文字段名称",
        type: "字符串",
        required: false,
        description: "字段英文名，对接时建议使用此字段做结构化映射。",
        tags: ["业务核心"],
      },
      {
        key: "chn_key",
        label: "中文字段名称",
        type: "字符串",
        required: false,
        description: "字段中文显示名。",
        tags: ["业务核心"],
      },
      {
        key: "value",
        label: "识别结果",
        type: "字符串",
        required: false,
        description: "对应字段的识别文本。",
        tags: ["业务核心"],
      },
      {
        key: "score",
        label: "置信度",
        type: "数字型",
        required: false,
        description: "字段识别置信度，范围通常为 0 到 100。",
        tags: ["置信度"],
      },
      {
        key: "position",
        label: "矩形区域",
        type: "数组",
        required: false,
        description: "字段所在区域的矩形位置信息。",
        tags: ["坐标"],
      },
      {
        key: "quad",
        label: "四点坐标",
        type: "数组",
        required: false,
        description: "区域四个点的坐标：左上、右上、左下、右下。",
        tags: ["坐标"],
      },
    ],
  },
  {
    title: "方向与版面辅助",
    description: "用于判断图片方向、颜色、形状和图片型字段。",
    fields: [
      {
        key: "direct",
        label: "图片方向",
        type: "数字型",
        required: false,
        description: "图片方向识别结果。",
        tags: ["枚举"],
      },
      {
        key: "angle",
        label: "图片角度",
        type: "数字型",
        required: false,
        description: "图片旋转角度。",
        tags: ["枚举"],
      },
      {
        key: "color",
        label: "颜色",
        type: "数字型",
        required: false,
        description: "0 未检测到，1 black，2 red，3 blue。",
        tags: ["枚举"],
      },
      {
        key: "shape",
        label: "形状",
        type: "数字型",
        required: false,
        description: "0 未检测到，1 circle，2 ellipse，3 rect，4 other。",
        tags: ["枚举"],
      },
      {
        key: "is_image",
        label: "是否图片",
        type: "数字型",
        required: false,
        description: "1 表示字段值是图片 Base64，0 表示不是。",
        tags: ["枚举", "图片Base64"],
      },
    ],
  },
];

export const commonErrorFields: FieldDef[] = [
  {
    key: "errCode",
    label: "返回码",
    type: "字符串",
    required: true,
    description: "接口级返回码，长度参考 20。",
    tags: ["必返"],
  },
  {
    key: "errInfo",
    label: "返回码说明",
    type: "字符串",
    required: false,
    description: "接口级返回码说明，长度参考 256。",
    tags: ["可选"],
  },
  {
    key: "ocr_error_code",
    label: "识别响应状态码",
    type: "数字型",
    required: false,
    description: "0 代表识别成功。",
    tags: ["枚举"],
  },
];

const idcardDoc: OcrInterfaceDoc = {
  slug: "idcard",
  title: "二代证（人像页+国徽页）",
  category: "证照身份类",
  summary: "识别居民身份证人像页与国徽页，提取身份信息、住址、签发机关和有效期限。",
  scenarios: ["实名开户", "身份核验", "客户资料归档", "证件有效期检查"],
  fieldCount: 12,
  endpoints: {
    protocol: "HTTP(S) + JSON",
    method: "POST",
    testUrl: "https://test-api-open.chinaums.com/v1/brain/ocr/idcard",
    prodUrl: "https://api-lob.open.chinaums.com/v1/brain/ocr/idcard",
  },
  request: commonRequestFields,
  fieldGroups: [
    {
      title: "人像页字段",
      description: "用于识别个人基础身份信息和证件版面状态。",
      fields: [
        {
          key: "Name",
          label: "姓名",
          type: "字符串",
          required: false,
          description: "身份证人像页上的姓名。",
          tags: ["业务核心"],
          formatHint: "虚构示意：张三",
        },
        {
          key: "Sex",
          label: "性别",
          type: "字符串",
          required: false,
          description: "身份证人像页上的性别。",
          tags: ["业务核心", "枚举"],
          formatHint: "男 / 女",
        },
        {
          key: "Nation",
          label: "民族",
          type: "字符串",
          required: false,
          description: "身份证人像页上的民族。",
          tags: ["业务核心"],
        },
        {
          key: "Birth",
          label: "出生日期",
          type: "字符串",
          required: false,
          description: "身份证人像页上的出生日期。",
          tags: ["业务核心"],
          formatHint: "YYYYMMDD",
        },
        {
          key: "Address",
          label: "地址",
          type: "字符串",
          required: false,
          description: "身份证人像页上的住址信息。",
          tags: ["业务核心"],
        },
        {
          key: "IDNum",
          label: "身份证号码",
          type: "字符串",
          required: false,
          description: "身份证人像页上的公民身份号码。",
          tags: ["业务核心"],
          formatHint: "18 位号码格式占位",
        },
        {
          key: "Birth_OCR",
          label: "出生版面信息",
          type: "字符串",
          required: false,
          description: "出生日期对应的版面识别信息。",
          tags: ["可选"],
        },
        {
          key: "img_type",
          label: "图片类型",
          type: "数字型",
          required: false,
          description: "复印件检测结果：0 原件，1 屏拍件，2 复印件。",
          tags: ["枚举"],
        },
        {
          key: "img_type_score",
          label: "证件分类检测置信度",
          type: "数字型",
          required: false,
          description: "证件分类检测的置信度。",
          tags: ["置信度"],
        },
        {
          key: "score",
          label: "字段识别置信度",
          type: "数字型",
          required: false,
          description: "字段级识别置信度。",
          tags: ["置信度"],
        },
      ],
    },
    {
      title: "国徽页字段",
      description: "用于识别签发机关和证件有效期。",
      fields: [
        {
          key: "IssueAuthority",
          label: "签发机关",
          type: "字符串",
          required: false,
          description: "身份证国徽页上的签发机关。",
          tags: ["业务核心"],
        },
        {
          key: "ExpiryDate",
          label: "有效期限",
          type: "字符串",
          required: false,
          description: "身份证国徽页上的有效期限。",
          tags: ["业务核心"],
          formatHint: "YYYY.MM.DD-YYYY.MM.DD",
        },
      ],
    },
  ],
  response: {
    overview:
      "二代证接口返回通用 OCR 结果结构，并在 FieldList 中提供人像页与国徽页的特有字段。",
    commonGroups: commonResponseGroups,
  },
  errors: commonErrorFields,
  visual: {
    kind: "idcard",
    coverAlt: "规范化身份证示意卡片",
    detailAlt: "身份证字段解剖示意图",
    annotations: ["姓名", "身份证号码", "住址", "签发机关", "有效期限"],
  },
  relatedSlugs: ["bankcard", "social-security-card", "business-license", "passport"],
};

const vatInvoiceDoc: OcrInterfaceDoc = {
  slug: "vat-invoice",
  title: "增值税发票",
  category: "发票票据类",
  summary: "识别增值税发票票面信息，提取购销方、金额税额、发票号码和明细行字段。",
  scenarios: ["财务报销", "税票归档", "交易凭证审核", "供应商对账"],
  fieldCount: 39,
  endpoints: {
    protocol: "HTTP(S) + JSON",
    method: "POST",
    testUrl: "https://test-api-open.chinaums.com/v1/brain/ocr/vat-invoice",
    prodUrl: "https://api-lob.open.chinaums.com/v1/brain/ocr/vat-invoice",
  },
  request: commonRequestFields,
  fieldGroups: [
    {
      title: "票面基础信息",
      description: "用于定位发票身份、开票日期、票据类型和防伪辅助信息。",
      fields: [
        {
          key: "FPDM",
          label: "发票代码",
          type: "字符串",
          required: false,
          description: "票面发票代码。",
          tags: ["业务核心"],
        },
        {
          key: "FPHM",
          label: "发票号码",
          type: "字符串",
          required: false,
          description: "票面发票号码。",
          tags: ["业务核心"],
        },
        {
          key: "KPRQ",
          label: "开票日期",
          type: "字符串",
          required: false,
          description: "发票开具日期。",
          tags: ["业务核心"],
          formatHint: "YYYY-MM-DD 或票面原格式",
        },
        {
          key: "JQBH",
          label: "机器编号",
          type: "字符串",
          required: false,
          description: "票面机器编号。",
          tags: ["可选"],
        },
        {
          key: "MWSJ",
          label: "密文数据",
          type: "字符串",
          required: false,
          description: "票面密文区识别结果。",
          tags: ["可选"],
        },
        {
          key: "FPLX",
          label: "发票类型",
          type: "字符串",
          required: false,
          description:
            "增值税专用发票 01，增值税普通发票 04，电子普通发票 10，电子专用发票 20，卷式 11，通行费 14。",
          tags: ["枚举"],
        },
        {
          key: "JYM",
          label: "校验码",
          type: "字符串",
          required: false,
          description: "发票校验码。",
          tags: ["业务核心"],
        },
        {
          key: "QR",
          label: "二维码",
          type: "字符串",
          required: false,
          description: "票面二维码识别结果。",
          tags: ["可选"],
        },
        {
          key: "FPLC",
          label: "发票联次",
          type: "字符串",
          required: false,
          description: "取值 0-3，0 表示不确定，其他为具体联次。",
          tags: ["枚举"],
        },
        {
          key: "FPZYZ",
          label: "发票专用章",
          type: "字符串",
          required: false,
          description: "0 表示没检测到，1 表示检测到。",
          tags: ["枚举"],
        },
      ],
    },
    {
      title: "购方与销方信息",
      description: "用于财务归档、客户供应商匹配和税号校验。",
      fields: [
        {
          key: "GFMC",
          label: "购方名称",
          type: "字符串",
          required: false,
          description: "购买方名称。",
          tags: ["业务核心"],
        },
        {
          key: "GMSBH",
          label: "购方识别号",
          type: "字符串",
          required: false,
          description: "购买方纳税人识别号。",
          tags: ["业务核心"],
        },
        {
          key: "GFKHHZH",
          label: "购方开户行账号",
          type: "字符串",
          required: false,
          description: "购买方开户行及账号。",
          tags: ["可选"],
        },
        {
          key: "GFDZDH",
          label: "购方地址电话",
          type: "字符串",
          required: false,
          description: "购买方地址和电话。",
          tags: ["可选"],
        },
        {
          key: "XFMC",
          label: "销方名称",
          type: "字符串",
          required: false,
          description: "销售方名称。",
          tags: ["业务核心"],
        },
        {
          key: "XFSBH",
          label: "销方识别号",
          type: "字符串",
          required: false,
          description: "销售方纳税人识别号。",
          tags: ["业务核心"],
        },
        {
          key: "XFKHHZH",
          label: "销方开户行账号",
          type: "字符串",
          required: false,
          description: "销售方开户行及账号。",
          tags: ["可选"],
        },
        {
          key: "XFDZDH",
          label: "销方地址电话",
          type: "字符串",
          required: false,
          description: "销售方地址和电话。",
          tags: ["可选"],
        },
      ],
    },
    {
      title: "金额与合计",
      description: "用于报销核验、对账和票面金额校验。",
      fields: [
        {
          key: "JSHJ",
          label: "价税合计",
          type: "字符串",
          required: false,
          description: "价税合计金额。",
          tags: ["业务核心"],
        },
        {
          key: "JEHJ",
          label: "金额合计",
          type: "字符串",
          required: false,
          description: "不含税金额合计。",
          tags: ["业务核心"],
        },
        {
          key: "SEHJ",
          label: "税额合计",
          type: "字符串",
          required: false,
          description: "税额合计。",
          tags: ["业务核心"],
        },
        {
          key: "DXJE",
          label: "大写金额",
          type: "字符串",
          required: false,
          description: "票面大写金额。",
          tags: ["业务核心"],
        },
        {
          key: "BZ",
          label: "备注",
          type: "字符串",
          required: false,
          description: "票面备注信息。",
          tags: ["可选"],
        },
      ],
    },
    {
      title: "人员与明细行",
      description: "用于识别开票人信息和货物服务明细。",
      fields: [
        {
          key: "SKR",
          label: "收款人",
          type: "字符串",
          required: false,
          description: "票面收款人。",
          tags: ["可选"],
        },
        {
          key: "FH",
          label: "复核",
          type: "字符串",
          required: false,
          description: "票面复核人。",
          tags: ["可选"],
        },
        {
          key: "KPR",
          label: "开票人",
          type: "字符串",
          required: false,
          description: "票面开票人。",
          tags: ["可选"],
        },
        {
          key: "XH",
          label: "序号",
          type: "字符串",
          required: false,
          description: "明细行序号。",
          tags: ["可选"],
        },
        {
          key: "HWMC",
          label: "货物名称",
          type: "字符串",
          required: false,
          description: "货物或应税劳务、服务名称。",
          tags: ["业务核心"],
        },
        {
          key: "GGXH",
          label: "规格型号",
          type: "字符串",
          required: false,
          description: "明细行规格型号。",
          tags: ["可选"],
        },
        {
          key: "DW",
          label: "单位",
          type: "字符串",
          required: false,
          description: "明细行单位。",
          tags: ["可选"],
        },
        {
          key: "SL",
          label: "数量",
          type: "字符串",
          required: false,
          description: "明细行数量。",
          tags: ["可选"],
        },
        {
          key: "DJ",
          label: "单价",
          type: "字符串",
          required: false,
          description: "明细行单价。",
          tags: ["可选"],
        },
        {
          key: "JE",
          label: "金额",
          type: "字符串",
          required: false,
          description: "明细行金额。",
          tags: ["业务核心"],
        },
        {
          key: "SLV",
          label: "税率",
          type: "字符串",
          required: false,
          description: "明细行税率。",
          tags: ["业务核心"],
        },
        {
          key: "SE",
          label: "税额",
          type: "字符串",
          required: false,
          description: "明细行税额。",
          tags: ["业务核心"],
        },
      ],
    },
  ],
  response: {
    overview:
      "增值税发票接口返回通用 OCR 结果结构，并在 FieldList 中提供票面基础信息、购销方、金额合计和明细行字段。",
    commonGroups: commonResponseGroups,
  },
  errors: commonErrorFields,
  visual: {
    kind: "invoice",
    coverAlt: "规范化增值税发票示意卡片",
    detailAlt: "增值税发票字段解剖示意图",
    annotations: ["发票代码", "发票号码", "开票日期", "购销方", "价税合计"],
  },
  relatedSlugs: ["train-ticket", "taxi-invoice", "itinerary-receipt", "motor-vehicle-invoice"],
};

export const docs: OcrInterfaceDoc[] = [idcardDoc, vatInvoiceDoc];

export const docsBySlug = new Map(docs.map((doc) => [doc.slug, doc]));

export const interfaceCatalog: InterfaceCard[] = [
  {
    slug: "idcard",
    title: "二代证（人像页+国徽页）",
    category: "证照身份类",
    summary: "提取姓名、身份证号码、住址、签发机关和有效期限。",
    previewFields: ["姓名", "身份证号码", "地址", "签发机关", "有效期限"],
    visualKind: "idcard",
    status: "complete",
  },
  {
    slug: "bankcard",
    title: "银行卡",
    category: "证照身份类",
    summary: "提取银行卡号、银行卡名称、发卡行和卡类型。",
    previewFields: ["银行卡号", "发卡行", "卡类型", "有效期"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "social-security-card",
    title: "社保卡",
    category: "证照身份类",
    summary: "提取姓名、社会保障号、银行卡号、发卡日期和有效期。",
    previewFields: ["姓名", "社会保障号", "银行卡号", "有效期"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "vat-invoice",
    title: "增值税发票",
    category: "发票票据类",
    summary: "提取发票代码、号码、购销方、价税合计和明细行。",
    previewFields: ["发票代码", "发票号码", "购方名称", "销方名称", "价税合计"],
    visualKind: "invoice",
    status: "complete",
  },
  {
    slug: "train-ticket",
    title: "火车票",
    category: "发票票据类",
    summary: "提取出发站、到达站、车次、开车时间、票价和乘车人。",
    previewFields: ["出发站", "到达站", "车次", "票价"],
    visualKind: "ticket",
    status: "planned",
  },
  {
    slug: "taxi-invoice",
    title: "出租车票",
    category: "发票票据类",
    summary: "提取发票代码、号码、上下车时间、里程、金额合计。",
    previewFields: ["发票代码", "金额合计", "里程", "上车时间"],
    visualKind: "ticket",
    status: "planned",
  },
  {
    slug: "receipt-ocr",
    title: "小票识别",
    category: "发票票据类",
    summary: "参考新增资料中的小票识别能力，适合交易小票、消费凭证等字段展示。",
    previewFields: ["商户名称", "交易时间", "金额", "流水号"],
    visualKind: "ticket",
    status: "planned",
  },
  {
    slug: "itinerary-receipt",
    title: "航空电子行程单",
    category: "发票票据类",
    summary: "提取旅客姓名、电子客票号、票价、燃油附加费和合计。",
    previewFields: ["旅客姓名", "电子客票号", "票价", "合计"],
    visualKind: "ticket",
    status: "planned",
  },
  {
    slug: "railway-eticket",
    title: "铁路电子客票识别服务",
    category: "发票票据类",
    summary: "参考新增资料中的铁路电子客票能力，后续按正式文档导入字段。",
    previewFields: ["乘车人", "车次", "出发站", "到达站", "票价"],
    visualKind: "ticket",
    status: "planned",
  },
  {
    slug: "business-license",
    title: "营业执照",
    category: "商户经营类",
    summary: "提取统一社会信用代码、企业名称、法人、注册资本和经营范围。",
    previewFields: ["统一社会信用代码", "企业名称", "法人", "经营范围"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "number-plates",
    title: "车牌识别",
    category: "车辆交通类",
    summary: "识别车辆号牌信息。",
    previewFields: ["车牌号码", "号牌颜色"],
    visualKind: "vehicle",
    status: "planned",
  },
  {
    slug: "driver-license",
    title: "驾驶证识别",
    category: "车辆交通类",
    summary: "提取姓名、证号、准驾车型、有效期限和地址。",
    previewFields: ["姓名", "证号", "准驾车型", "有效期限"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "vehicle-license",
    title: "行驶证识别",
    category: "车辆交通类",
    summary: "提取号牌号码、车辆类型、所有人、VIN、发动机号。",
    previewFields: ["号牌号码", "车辆类型", "VIN", "发动机号"],
    visualKind: "vehicle",
    status: "planned",
  },
  {
    slug: "vin",
    title: "VIN",
    category: "车辆交通类",
    summary: "识别车辆识别代号并返回校验规则状态。",
    previewFields: ["车架号", "校验状态"],
    visualKind: "vehicle",
    status: "planned",
  },
  {
    slug: "passport",
    title: "护照",
    category: "证照身份类",
    summary: "提取护照号码、姓名、机读码、出生地点和签发地点。",
    previewFields: ["护照号码", "姓名", "机读码", "签发地点"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "household-register",
    title: "户口本",
    category: "证照身份类",
    summary: "提取户主、户号、住址、成员姓名和户主关系。",
    previewFields: ["户主姓名", "户号", "住址", "成员姓名"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "marriage-certificate",
    title: "结婚证",
    category: "证照身份类",
    summary: "提取持证人、登记日期、证字号和双方身份信息。",
    previewFields: ["持证人", "登记日期", "证字号", "姓名"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "account-opening-license",
    title: "开户许可",
    category: "商户经营类",
    summary: "提取核准号、开户名称、开户银行、账号和法人信息。",
    previewFields: ["核准号", "开户名称", "开户银行", "账号"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "mainland-travel-permit-for-gat",
    title: "港澳台居民来往大陆通行证",
    category: "证照身份类",
    summary: "提取中文名、英文名、证件号码、有效期限和签发机关。",
    previewFields: ["中文名", "英文名", "证件号码", "有效期限"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "motor-vehicle-certificate",
    title: "机动车合格证",
    category: "车辆交通类",
    summary: "提取合格证编号、车辆制造企业、车辆型号和车架号。",
    previewFields: ["合格证编号", "车辆型号", "车架号", "发证日期"],
    visualKind: "vehicle",
    status: "planned",
  },
  {
    slug: "motor-vehicle-registration-certificate",
    title: "机动车登记证识别",
    category: "车辆交通类",
    summary: "参考新增资料中的机动车登记证识别能力，后续按正式文档补齐字段。",
    previewFields: ["登记证编号", "车辆识别代号", "所有人", "登记日期"],
    visualKind: "vehicle",
    status: "planned",
  },
  {
    slug: "trade-in-recycle-voucher",
    title: "以旧换新回收凭单识别",
    category: "车辆交通类",
    summary: "参考新增资料中的以旧换新回收凭单识别能力，适合补贴和回收业务资料归档。",
    previewFields: ["凭单编号", "车牌号", "回收企业", "回收日期"],
    visualKind: "vehicle",
    status: "planned",
  },
  {
    slug: "gat-pass-front",
    title: "往来港澳通行证正面",
    category: "证照身份类",
    summary: "提取出生日期、签发地点、编号、中文姓名、英文姓名。",
    previewFields: ["中文姓名", "英文姓名", "编号", "有效期限"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "gat-pass-back",
    title: "往来港澳通行证背面",
    category: "证照身份类",
    summary: "提取往来香港/澳门签注种类、有效期和备注信息。",
    previewFields: ["签注种类", "签注有效期", "签注备注"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "universal-identification-text",
    title: "通用识别-文本",
    category: "通用文本类",
    summary: "识别通用文本版面，返回页面、段落、行和文本坐标信息。",
    previewFields: ["页码", "页宽", "页高", "文本行"],
    visualKind: "text",
    status: "planned",
  },
  {
    slug: "universal-identification-handwriting",
    title: "通用识别-手写",
    category: "通用文本类",
    summary: "识别手写文本版面，返回页面、段落、行和文本坐标信息。",
    previewFields: ["页码", "手写文本", "文本行", "坐标"],
    visualKind: "text",
    status: "planned",
  },
  {
    slug: "real-estate-certificate",
    title: "不动产权证",
    category: "地产凭证类",
    summary: "提取登记日期、编号、权利人、坐落、不动产单元号。",
    previewFields: ["登记日期", "权利人", "坐落", "不动产单元号"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "real-estate-registration-certificate",
    title: "不动产登记证",
    category: "地产凭证类",
    summary: "提取权利人、义务人、坐落、不动产单元号和证明事项。",
    previewFields: ["权利人", "义务人", "坐落", "证明事项"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "motor-vehicle-invoice",
    title: "机动车发票",
    category: "车辆交通类",
    summary: "提取发票代码、号码、购方名称、厂牌型号、车辆类型。",
    previewFields: ["发票代码", "购方名称", "厂牌型号", "车辆类型"],
    visualKind: "invoice",
    status: "planned",
  },
  {
    slug: "used-car-invoice",
    title: "二手车发票",
    category: "车辆交通类",
    summary: "提取发票代码、号码、购销方、车牌照号和车辆价款。",
    previewFields: ["发票代码", "购方单位", "销方名称", "车牌照号"],
    visualKind: "invoice",
    status: "planned",
  },
];

export const categories = Array.from(new Set(interfaceCatalog.map((item) => item.category)));

export const getCardBySlug = (slug: string) => interfaceCatalog.find((item) => item.slug === slug);
