import { categories as generatedCategories, categoryBySlug } from "./generated/interfaceClassification.generated";
import { interfaceSourceBySlug } from "./generated/interfaceSourceMap.generated";
import type { BusinessCategoryLabel } from "./generated/interfaceClassification.generated";

export type FieldTag =
  | "必返"
  | "可选"
  | "数组"
  | "坐标"
  | "置信度"
  | "枚举"
  | "业务核心"
  | "图片Base64";

export type InterfaceCategory = BusinessCategoryLabel;

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
  testUrl?: string;
  prodUrl: string;
  contentType: string;
  authType: string;
}

export interface DownloadAsset {
  title: string;
  fileName: string;
  href: string;
}

export interface RequestExample {
  header: Record<string, string>;
  body: unknown;
}

export interface OcrInterfaceDoc {
  slug: string;
  title: string;
  category: InterfaceCategory;
  summary: string;
  scenarios: string[];
  fieldCount: number;
  endpoints: EndpointInfo;
  requestGroups: FieldGroup[];
  fieldGroups: FieldGroup[];
  response: {
    overview: string;
    commonGroups: FieldGroup[];
    path?: string[];
  };
  errors: FieldDef[];
  sourcePdf?: DownloadAsset;
  relatedSlugs: string[];
  requestExample?: RequestExample;
  responseExample?: unknown;
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

type InterfaceCardSeed = Omit<InterfaceCard, "category">;

const defaultEndpointMeta = {
  protocol: "HTTP(S) + JSON",
  method: "POST" as const,
  contentType: "application/json",
  authType: "Authorization",
};

export function getEndpointInfoBySlug(slug: string): EndpointInfo {
  const source = interfaceSourceBySlug[slug];
  const testUrl = source?.endpoints.find((item) => item.environment === "test")?.url;
  const prodUrl = source?.endpoints.find((item) => item.environment === "production")?.url;

  return {
    ...defaultEndpointMeta,
    ...(testUrl ? { testUrl } : {}),
    prodUrl: prodUrl ?? `https://api-lob.open.chinaums.com/v1/brain/ocr/${slug}`,
  };
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
    key: "data.requestID",
    label: "请求流水号",
    type: "字符串",
    required: true,
    description: "业务侧生成的请求唯一标识，用于排查调用链路和结果追踪。",
    tags: ["必返", "业务核心"],
    formatHint: "建议使用唯一流水号或 UUID",
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

export const commonRequestGroups: FieldGroup[] = [
  {
    title: "请求头 Header",
    description: "调用接口前需要按开放平台认证流程生成认证内容。",
    fields: [commonRequestFields[0]],
  },
  {
    title: "请求体 Body",
    description: "OCR 识别图片以 JSON 请求体提交，页面不保存或上传真实图片。",
    fields: [commonRequestFields[1], commonRequestFields[2]],
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
    description: "ResultList 里承载识别对象、FieldList、状态信息和字段级结果。",
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
        key: "pid",
        label: "证件类型 PID",
        type: "数字型",
        required: false,
        description: "证件对应类型 pid。",
        tags: ["可选"],
      },
      {
        key: "type",
        label: "证件类型",
        type: "字符串",
        required: false,
        description: "识别对象的证件类型。",
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
        key: "left",
        label: "左",
        type: "数字型",
        required: false,
        description: "矩形区域左边界位置。",
        tags: ["坐标"],
      },
      {
        key: "top",
        label: "上",
        type: "数字型",
        required: false,
        description: "矩形区域上边界位置。",
        tags: ["坐标"],
      },
      {
        key: "width",
        label: "宽",
        type: "数字型",
        required: false,
        description: "矩形区域宽度。",
        tags: ["坐标"],
      },
      {
        key: "height",
        label: "高",
        type: "数字型",
        required: false,
        description: "矩形区域高度。",
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

const sourcePdfAssets = {
  allProducts: new URL(
    "../../docs-source/ocr-interfaces/latest/pdf/银商大脑-译图OCR26种产品-接口文档V2.1.pdf",
    import.meta.url,
  ).href,
  vatInvoice: new URL(
    "../../docs-source/ocr-interfaces/latest/pdf/银联商务开放平台--增值税发票识别.pdf",
    import.meta.url,
  ).href,
};

const idcardRequestGroups: FieldGroup[] = [
  {
    title: "请求头 Header",
    description: "调用接口前需要按开放平台认证流程生成认证内容。",
    fields: [commonRequestFields[0]],
  },
  {
    title: "请求体 Body",
    description: "身份证识别请求体只包含待识别图片和是否返回头像开关。",
    fields: [
      commonRequestFields[2],
      {
        key: "isHeadImage",
        label: "是否返回头像",
        type: "布尔型",
        required: false,
        description: "true 表示返回头像图片数据，false 表示不返回。默认 false。",
        tags: ["可选"],
        formatHint: "true / false",
      },
    ],
  },
];

const vatInvoiceRequestGroups: FieldGroup[] = [
  {
    title: "请求头 Header",
    description: "调用接口前需要按开放平台认证流程生成认证内容。",
    fields: [commonRequestFields[0]],
  },
  {
    title: "请求体 Body",
    description: "请求体包含 data 对象中的 requestID，以及顶层的 picBase64 图片内容。",
    fields: [
      {
        key: "data",
        label: "请求参数对象",
        type: "对象",
        required: true,
        description: "业务请求参数对象。",
        tags: ["必返"],
      },
      commonRequestFields[1],
      commonRequestFields[2],
    ],
  },
];

const vatInvoiceResponseGroups: FieldGroup[] = [
  {
    title: "顶层响应",
    description: "先判断接口顶层返回码，再进入 result 对象读取业务结果。",
    fields: [
      {
        key: "errCode",
        label: "顶层返回码",
        type: "字符串",
        required: true,
        description: "顶层返回码，AN000000 表示成功。",
        tags: ["必返", "业务核心"],
      },
      {
        key: "errMsg",
        label: "顶层返回说明",
        type: "字符串",
        required: true,
        description: "顶层返回说明。",
        tags: ["必返"],
      },
      {
        key: "result",
        label: "业务结果对象",
        type: "对象",
        required: true,
        description: "业务结果容器。",
        tags: ["必返"],
      },
    ],
  },
  {
    title: "业务结果容器",
    description: "识别结果位于 result.ocrResult 对象中，respondID 用于结果追踪。",
    fields: [
      {
        key: "result.code",
        label: "业务结果码",
        type: "字符串",
        required: true,
        description: "业务处理结果码，AN000000 表示成功。",
        tags: ["必返", "业务核心"],
      },
      {
        key: "result.msg",
        label: "业务结果说明",
        type: "字符串",
        required: true,
        description: "业务处理结果说明。",
        tags: ["必返"],
      },
      {
        key: "result.ocrResult",
        label: "OCR 结果对象",
        type: "对象",
        required: true,
        description: "增值税发票结构化识别结果对象。",
        tags: ["必返"],
      },
      {
        key: "result.respondID",
        label: "响应流水号",
        type: "字符串",
        required: true,
        description: "用于追踪本次接口响应的唯一标识。",
        tags: ["必返"],
      },
    ],
  },
];

const vatInvoiceErrorFields: FieldDef[] = [
  {
    key: "errCode",
    label: "顶层返回码",
    type: "字符串",
    required: true,
    description: "顶层返回码，AN000000 表示成功。",
    tags: ["必返", "业务核心"],
  },
  {
    key: "errMsg",
    label: "顶层返回说明",
    type: "字符串",
    required: true,
    description: "顶层返回说明。",
    tags: ["必返"],
  },
  {
    key: "result.code",
    label: "业务结果码",
    type: "字符串",
    required: true,
    description: "业务处理结果码，AN000000 表示成功。",
    tags: ["必返", "业务核心"],
  },
  {
    key: "result.msg",
    label: "业务结果说明",
    type: "字符串",
    required: true,
    description: "业务处理结果说明。",
    tags: ["必返"],
  },
];

const idcardDoc: OcrInterfaceDoc = {
  slug: "idcard",
  title: "二代证（人像页+国徽页）",
  category: categoryBySlug.idcard,
  summary: "识别居民身份证人像页与国徽页，提取身份信息、住址、签发机关和有效期限。",
  scenarios: ["实名开户", "身份核验", "客户资料归档", "证件有效期检查"],
  fieldCount: 13,
  endpoints: {
    ...getEndpointInfoBySlug("idcard"),
  },
  requestGroups: idcardRequestGroups,
  fieldGroups: [
    {
      title: "人像页字段",
      description: "用于识别个人基础身份信息和证件版面状态。",
      fields: [
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
        {
          key: "head_image_data",
          label: "头像图片数据",
          type: "字符串",
          required: false,
          description: "头像图片的 Base64 编码，仅在 isHeadImage 为 true 时返回。",
          tags: ["可选", "图片Base64"],
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
          key: "Nation",
          label: "民族",
          type: "字符串",
          required: false,
          description: "身份证人像页上的民族。",
          tags: ["业务核心"],
        },
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
          key: "Birth_OCR",
          label: "出生版面信息",
          type: "字符串",
          required: false,
          description: "出生日期对应的版面识别信息。",
          tags: ["可选"],
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
      "二代证接口采用旧版 FieldList 结果结构，需先判断 data / ResultList 状态，再从 FieldList 中读取人像页和国徽页字段。",
    commonGroups: commonResponseGroups,
    path: ["data", "Result", "ResultList", "FieldList"],
  },
  errors: commonErrorFields,
  sourcePdf: {
    title: "银商大脑-译图OCR26种产品-接口文档V2.1",
    fileName: "银商大脑-译图OCR26种产品-接口文档V2.1.pdf",
    href: sourcePdfAssets.allProducts,
  },
  relatedSlugs: ["bankcard", "social-security-card", "business-license", "passport"],
  requestExample: {
    header: {
      Authorization: 'OPEN-ACCESS-TOKEN AccessToken="<access-token>"',
      "Content-Type": "application/json",
    },
    body: {
      picBase64: "<base64-image-payload>",
      isHeadImage: false,
    },
  },
  responseExample: {
    errCode: "0000",
    errInfo: "success",
    data: {
      PageInfo: [
        {
          PageIndex: 1,
          ErrorCode: 0,
          Time: "18ms",
        },
      ],
      Result: [
        {
          ResultList: [
            {
              pid: 1,
              type: "idcard",
              ocr_error_code: 0,
              direct: 0,
              angle: 0,
              color: 0,
              shape: 3,
              is_image: 0,
              FieldList: [
                {
                  key: "Name",
                  chn_key: "姓名",
                  value: "张三",
                  score: 99.1,
                  position: {
                    left: 124,
                    top: 88,
                    width: 94,
                    height: 26,
                  },
                  quad: [
                    [124, 88],
                    [218, 88],
                    [124, 114],
                    [218, 114],
                  ],
                },
                {
                  key: "IDNum",
                  chn_key: "身份证号码",
                  value: "310101199001011234",
                  score: 98.8,
                  position: {
                    left: 120,
                    top: 226,
                    width: 246,
                    height: 28,
                  },
                  quad: [
                    [120, 226],
                    [366, 226],
                    [120, 254],
                    [366, 254],
                  ],
                },
                {
                  key: "IssueAuthority",
                  chn_key: "签发机关",
                  value: "上海市公安局浦东分局",
                  score: 98.5,
                  position: {
                    left: 116,
                    top: 318,
                    width: 180,
                    height: 26,
                  },
                  quad: [
                    [116, 318],
                    [296, 318],
                    [116, 344],
                    [296, 344],
                  ],
                },
                {
                  key: "ExpiryDate",
                  chn_key: "有效期限",
                  value: "2010.01.01-2030.01.01",
                  score: 98.2,
                  position: {
                    left: 112,
                    top: 354,
                    width: 212,
                    height: 24,
                  },
                  quad: [
                    [112, 354],
                    [324, 354],
                    [112, 378],
                    [324, 378],
                  ],
                },
                {
                  key: "head_image_data",
                  chn_key: "头像图片数据",
                  value: "<base64-head-image>",
                  score: 100,
                  position: {
                    left: 0,
                    top: 0,
                    width: 0,
                    height: 0,
                  },
                  quad: [],
                },
              ],
            },
          ],
        },
      ],
    },
  },
};

const vatInvoiceDoc: OcrInterfaceDoc = {
  slug: "vat-invoice",
  title: "增值税发票",
  category: categoryBySlug["vat-invoice"],
  summary: "识别增值税发票票面信息，提取购销方、金额税额、发票号码和明细行字段。",
  scenarios: ["财务报销", "税票归档", "交易凭证审核", "供应商对账"],
  fieldCount: 33,
  endpoints: {
    ...getEndpointInfoBySlug("vat-invoice"),
  },
  requestGroups: vatInvoiceRequestGroups,
  fieldGroups: [
    {
      title: "票面基础信息",
      description: "票面基础字段位于 result.ocrResult 对象中，按 PDF 原文字段名对齐展示。",
      fields: [
        {
          key: "invoiceName",
          label: "发票名称",
          type: "字符串",
          required: true,
          description: "发票名称或票据类型名称。",
          tags: ["业务核心"],
        },
        {
          key: "invoiceCode",
          label: "发票代码",
          type: "字符串",
          required: true,
          description: "发票代码。",
          tags: ["业务核心"],
        },
        {
          key: "invoiceNumber",
          label: "发票号码",
          type: "字符串",
          required: true,
          description: "发票号码。",
          tags: ["业务核心"],
        },
        {
          key: "invoiceDate",
          label: "开票日期",
          type: "字符串",
          required: true,
          description: "发票开具日期。",
          tags: ["业务核心"],
          formatHint: "票面原格式",
        },
        {
          key: "checkCode",
          label: "校验码",
          type: "字符串",
          required: true,
          description: "发票校验码。",
          tags: ["业务核心"],
        },
        {
          key: "machineNo",
          label: "机器编号",
          type: "字符串",
          required: true,
          description: "发票票面机器编号。",
          tags: ["可选"],
        },
        {
          key: "passwordArea",
          label: "密码区",
          type: "字符串",
          required: true,
          description: "发票密码区识别结果。",
          tags: ["可选"],
        },
        {
          key: "QRCode",
          label: "二维码",
          type: "数组",
          required: true,
          description: "二维码拆分后的数组结果。",
          tags: ["数组", "可选"],
        },
      ],
    },
    {
      title: "购方与销方信息",
      description: "用于财务归档、客户供应商匹配和税号校验。",
      fields: [
        {
          key: "buyerName",
          label: "购方名称",
          type: "字符串",
          required: true,
          description: "购买方名称。",
          tags: ["业务核心"],
        },
        {
          key: "buyerNumber",
          label: "购方号码",
          type: "字符串",
          required: true,
          description: "购买方号码或识别号码。",
          tags: ["业务核心"],
        },
        {
          key: "buyerAddressAndPhone",
          label: "购方地址电话",
          type: "字符串",
          required: true,
          description: "购买方地址和电话。",
          tags: ["可选"],
        },
        {
          key: "buyerBankAndAccount",
          label: "购方开户行账号",
          type: "字符串",
          required: true,
          description: "购买方开户行及账号。",
          tags: ["可选"],
        },
        {
          key: "sellerName",
          label: "销方名称",
          type: "字符串",
          required: true,
          description: "销售方名称。",
          tags: ["业务核心"],
        },
        {
          key: "sellerNumber",
          label: "销方号码",
          type: "字符串",
          required: true,
          description: "销售方号码或识别号码。",
          tags: ["业务核心"],
        },
        {
          key: "sellerAddressAndPhone",
          label: "销方地址电话",
          type: "字符串",
          required: true,
          description: "销售方地址和电话。",
          tags: ["可选"],
        },
        {
          key: "sellerBankAndAccount",
          label: "销方开户行账号",
          type: "字符串",
          required: true,
          description: "销售方开户行及账号。",
          tags: ["可选"],
        },
      ],
    },
    {
      title: "商品明细字段",
      description: "明细字段均以数组形式返回，对应多行商品或服务内容。",
      fields: [
        {
          key: "projectName",
          label: "项目名称",
          type: "数组",
          required: true,
          description: "商品或服务项目名称数组。",
          tags: ["数组", "业务核心"],
        },
        {
          key: "specModel",
          label: "规格型号",
          type: "数组",
          required: true,
          description: "规格型号数组。",
          tags: ["数组", "可选"],
        },
        {
          key: "unit",
          label: "单位",
          type: "数组",
          required: true,
          description: "明细行单位数组。",
          tags: ["数组", "可选"],
        },
        {
          key: "quantity",
          label: "数量",
          type: "数组",
          required: true,
          description: "明细行数量数组。",
          tags: ["数组", "可选"],
        },
        {
          key: "unitPrice",
          label: "单价",
          type: "数组",
          required: true,
          description: "明细行单价数组。",
          tags: ["数组", "可选"],
        },
        {
          key: "amount",
          label: "金额",
          type: "数组",
          required: true,
          description: "明细行金额数组。",
          tags: ["数组", "业务核心"],
        },
        {
          key: "taxRate",
          label: "税率",
          type: "数组",
          required: true,
          description: "明细行税率数组。",
          tags: ["数组", "业务核心"],
        },
        {
          key: "taxAmount",
          label: "税额",
          type: "数组",
          required: true,
          description: "明细行税额数组。",
          tags: ["数组", "业务核心"],
        },
      ],
    },
    {
      title: "合计与人员信息",
      description: "用于读取票面合计金额、备注和票面人员信息。",
      fields: [
        {
          key: "totalAmount",
          label: "合计金额",
          type: "字符串",
          required: true,
          description: "票面金额合计。",
          tags: ["业务核心"],
        },
        {
          key: "totalTaxAmount",
          label: "合计税额",
          type: "字符串",
          required: true,
          description: "票面税额合计。",
          tags: ["业务核心"],
        },
        {
          key: "capitalPriceAndTax",
          label: "价税合计大写",
          type: "字符串",
          required: true,
          description: "价税合计大写金额。",
          tags: ["业务核心"],
        },
        {
          key: "lowerPriceAndTax",
          label: "价税合计小写",
          type: "字符串",
          required: true,
          description: "价税合计小写金额。",
          tags: ["业务核心"],
        },
        {
          key: "notes",
          label: "备注",
          type: "字符串",
          required: true,
          description: "票面备注信息。",
          tags: ["可选"],
        },
        {
          key: "recipient",
          label: "收款人",
          type: "字符串",
          required: true,
          description: "票面收款人。",
          tags: ["可选"],
        },
        {
          key: "reviewer",
          label: "复核人",
          type: "字符串",
          required: true,
          description: "票面复核人。",
          tags: ["可选"],
        },
        {
          key: "drawer",
          label: "开票人",
          type: "字符串",
          required: true,
          description: "票面开票人。",
          tags: ["可选"],
        },
        {
          key: "machineNumber",
          label: "机器号码",
          type: "字符串",
          required: true,
          description: "票面机器号码字段。",
          tags: ["可选"],
        },
      ],
    },
  ],
  response: {
    overview:
      "增值税发票接口采用新版 JSON 结果结构，先读取顶层 errCode / errMsg，再进入 result.ocrResult 获取票面字段。",
    commonGroups: vatInvoiceResponseGroups,
    path: ["result", "ocrResult"],
  },
  errors: vatInvoiceErrorFields,
  sourcePdf: {
    title: "增值税发票识别",
    fileName: "银联商务开放平台--增值税发票识别.pdf",
    href: sourcePdfAssets.vatInvoice,
  },
  relatedSlugs: ["train-ticket", "taxi-invoice", "itinerary-receipt", "motor-vehicle-invoice"],
  requestExample: {
    header: {
      Authorization: 'OPEN-ACCESS-TOKEN AccessToken="<access-token>"',
      "Content-Type": "application/json",
    },
    body: {
      data: {
        requestID: "5b35ca29-a008-4ed2-b190-98f3ba798dd12",
      },
      picBase64: "<base64-image-payload>",
    },
  },
  responseExample: {
    errCode: "AN000000",
    errMsg: "成功",
    result: {
      code: "AN000000",
      msg: "Success",
      ocrResult: {
        invoiceName: "电子发票（普通发票）",
        invoiceCode: "05878685",
        invoiceNumber: "25442000000340962573",
        invoiceDate: "2025年06月10日",
        checkCode: "660639276504131322121",
        machineNo: "",
        buyerName: "李博",
        buyerNumber: "3704021963961020233",
        buyerAddressAndPhone: "",
        buyerBankAndAccount: "",
        passwordArea: "",
        sellerName: "江门市乔帮主科技有限责任公司",
        sellerNumber: "91440703095877920J",
        sellerAddressAndPhone: "",
        sellerBankAndAccount: "",
        projectName: ["手机"],
        specModel: ["PTP-AN10"],
        unit: ["台"],
        quantity: ["1"],
        unitPrice: ["5308"],
        amount: ["5308"],
        taxRate: ["13%"],
        taxAmount: ["690"],
        totalAmount: "5308",
        totalTaxAmount: "690",
        capitalPriceAndTax: "伍仟叁佰零捌圆整",
        lowerPriceAndTax: "5308.00",
        notes: "IMEI1:6686442, 享受补贴金额：500",
        recipient: "",
        reviewer: "",
        drawer: "封禅",
        machineNumber: "",
        QRCode: ["01", "32", "", "24142000000083955587", "80.00", "20241119", "", "8B63"],
      },
      respondID: "0fc3911c-2530-4710-b6e5-b81de0ad6ab5",
    },
  },
};

export const docs: OcrInterfaceDoc[] = [idcardDoc, vatInvoiceDoc];

export const docsBySlug = new Map(docs.map((doc) => [doc.slug, doc]));

const interfaceCatalogSeed: InterfaceCardSeed[] = [
  {
    slug: "idcard",
    title: "二代证（人像页+国徽页）",
    summary: "提取姓名、身份证号码、住址、签发机关和有效期限。",
    previewFields: ["姓名", "身份证号码", "地址", "签发机关", "有效期限"],
    visualKind: "idcard",
    status: "complete",
  },
  {
    slug: "bankcard",
    title: "银行卡",
    summary: "提取银行卡号、银行卡名称、发卡行和卡类型。",
    previewFields: ["银行卡号", "发卡行", "卡类型", "有效期"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "social-security-card",
    title: "社保卡",
    summary: "提取姓名、社会保障号、银行卡号、发卡日期和有效期。",
    previewFields: ["姓名", "社会保障号", "银行卡号", "有效期"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "vat-invoice",
    title: "增值税发票",
    summary: "提取发票代码、号码、购销方、价税合计和明细行。",
    previewFields: ["发票代码", "发票号码", "购方名称", "销方名称", "价税合计"],
    visualKind: "invoice",
    status: "complete",
  },
  {
    slug: "train-ticket",
    title: "火车票",
    summary: "提取出发站、到达站、车次、开车时间、票价和乘车人。",
    previewFields: ["出发站", "到达站", "车次", "票价"],
    visualKind: "ticket",
    status: "planned",
  },
  {
    slug: "taxi-invoice",
    title: "出租车票",
    summary: "提取发票代码、号码、上下车时间、里程、金额合计。",
    previewFields: ["发票代码", "金额合计", "里程", "上车时间"],
    visualKind: "ticket",
    status: "planned",
  },
  {
    slug: "receipt-ocr",
    title: "小票识别",
    summary: "参考新增资料中的小票识别能力，适合交易小票、消费凭证等字段展示。",
    previewFields: ["商户名称", "交易时间", "金额", "流水号"],
    visualKind: "ticket",
    status: "planned",
  },
  {
    slug: "itinerary-receipt",
    title: "航空电子行程单",
    summary: "提取旅客姓名、电子客票号、票价、燃油附加费和合计。",
    previewFields: ["旅客姓名", "电子客票号", "票价", "合计"],
    visualKind: "ticket",
    status: "planned",
  },
  {
    slug: "railway-eticket",
    title: "铁路电子客票识别服务",
    summary: "参考新增资料中的铁路电子客票能力，后续按正式文档导入字段。",
    previewFields: ["乘车人", "车次", "出发站", "到达站", "票价"],
    visualKind: "ticket",
    status: "planned",
  },
  {
    slug: "financial-ticket-mixed",
    title: "财务票据混合识别",
    summary: "识别多类型财务票据，适合报销、入账和票据归档场景。",
    previewFields: ["票据类型", "票据号码", "开票日期", "金额合计"],
    visualKind: "ticket",
    status: "planned",
  },
  {
    slug: "handwritten-signature",
    title: "手写签名识别",
    summary: "识别票据或表单中的手写签名区域与签名结果。",
    previewFields: ["签名区域", "签名结果", "置信度", "坐标"],
    visualKind: "text",
    status: "planned",
  },
  {
    slug: "tax-payment-certificate",
    title: "完税证明",
    summary: "提取完税证明中的纳税人、税种、税款所属期和实缴金额。",
    previewFields: ["纳税人名称", "税款所属期", "税种", "实缴金额"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "departure-tax-refund",
    title: "离境退税申请单",
    summary: "识别离境退税申请单中的旅客、商品金额、退税金额和申请信息。",
    previewFields: ["申请单号", "旅客姓名", "商品金额", "退税金额"],
    visualKind: "invoice",
    status: "planned",
  },
  {
    slug: "customs-declaration",
    title: "海关报关单",
    summary: "提取海关报关单中的报关单号、经营单位、运输方式和申报日期。",
    previewFields: ["报关单号", "经营单位", "运输方式", "申报日期"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "business-license",
    title: "营业执照",
    summary: "提取统一社会信用代码、企业名称、法人、注册资本和经营范围。",
    previewFields: ["统一社会信用代码", "企业名称", "法人", "经营范围"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "institution-legal-person-certificate",
    title: "事业单位法人证书",
    summary: "提取事业单位法人证书中的单位名称、统一社会信用代码、法定代表人和有效期。",
    previewFields: ["统一社会信用代码", "单位名称", "法定代表人", "有效期"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "seal-ocr",
    title: "印章识别",
    summary: "识别印章文本、印章类型、位置坐标和置信度。",
    previewFields: ["印章文本", "印章类型", "置信度", "坐标"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "number-plates",
    title: "车牌识别",
    summary: "识别车辆号牌信息。",
    previewFields: ["车牌号码", "号牌颜色"],
    visualKind: "vehicle",
    status: "planned",
  },
  {
    slug: "driver-license",
    title: "驾驶证识别",
    summary: "提取姓名、证号、准驾车型、有效期限和地址。",
    previewFields: ["姓名", "证号", "准驾车型", "有效期限"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "vehicle-license",
    title: "行驶证识别",
    summary: "提取号牌号码、车辆类型、所有人、VIN、发动机号。",
    previewFields: ["号牌号码", "车辆类型", "VIN", "发动机号"],
    visualKind: "vehicle",
    status: "planned",
  },
  {
    slug: "vin",
    title: "VIN",
    summary: "识别车辆识别代号并返回校验规则状态。",
    previewFields: ["车架号", "校验状态"],
    visualKind: "vehicle",
    status: "planned",
  },
  {
    slug: "passport",
    title: "护照",
    summary: "提取护照号码、姓名、机读码、出生地点和签发地点。",
    previewFields: ["护照号码", "姓名", "机读码", "签发地点"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "household-register",
    title: "户口本",
    summary: "提取户主、户号、住址、成员姓名和户主关系。",
    previewFields: ["户主姓名", "户号", "住址", "成员姓名"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "marriage-certificate",
    title: "结婚证",
    summary: "提取持证人、登记日期、证字号和双方身份信息。",
    previewFields: ["持证人", "登记日期", "证字号", "姓名"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "account-opening-license",
    title: "开户许可",
    summary: "提取核准号、开户名称、开户银行、账号和法人信息。",
    previewFields: ["核准号", "开户名称", "开户银行", "账号"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "basic-deposit-account",
    title: "基本存款账户信息",
    summary: "提取基本存款账户信息中的账户名称、账号、开户银行和法定代表人。",
    previewFields: ["账户名称", "账号", "开户银行", "法定代表人"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "mainland-travel-permit-for-gat",
    title: "港澳台居民来往大陆通行证",
    summary: "提取中文名、英文名、证件号码、有效期限和签发机关。",
    previewFields: ["中文名", "英文名", "证件号码", "有效期限"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "organization-code-certificate",
    title: "组织机构代码证",
    summary: "提取组织机构代码证中的机构代码、机构名称、地址和有效期限。",
    previewFields: ["组织机构代码", "机构名称", "地址", "有效期限"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "export-license",
    title: "中国出口许可证",
    summary: "提取出口许可证号、出口商、商品名称和有效期限等关键信息。",
    previewFields: ["许可证号", "出口商", "商品名称", "有效期限"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "motor-vehicle-certificate",
    title: "机动车合格证",
    summary: "提取合格证编号、车辆制造企业、车辆型号和车架号。",
    previewFields: ["合格证编号", "车辆型号", "车架号", "发证日期"],
    visualKind: "vehicle",
    status: "planned",
  },
  {
    slug: "electric-bicycle-certificate",
    title: "电动自行车合格证",
    summary: "提取电动自行车合格证中的合格证编号、车辆型号、整车编码和生产日期。",
    previewFields: ["合格证编号", "车辆型号", "整车编码", "生产日期"],
    visualKind: "vehicle",
    status: "planned",
  },
  {
    slug: "motorcycle-certificate",
    title: "摩托车合格证",
    summary: "提取摩托车合格证中的合格证编号、车辆型号、车架号和发动机号。",
    previewFields: ["合格证编号", "车辆型号", "车架号", "发动机号"],
    visualKind: "vehicle",
    status: "planned",
  },
  {
    slug: "motor-vehicle-registration-certificate",
    title: "机动车登记证识别",
    summary: "参考新增资料中的机动车登记证识别能力，后续按正式文档补齐字段。",
    previewFields: ["登记证编号", "车辆识别代号", "所有人", "登记日期"],
    visualKind: "vehicle",
    status: "planned",
  },
  {
    slug: "trade-in-recycle-voucher",
    title: "以旧换新回收凭单识别",
    summary: "参考新增资料中的以旧换新回收凭单识别能力，适合补贴和回收业务资料归档。",
    previewFields: ["凭单编号", "车牌号", "回收企业", "回收日期"],
    visualKind: "vehicle",
    status: "planned",
  },
  {
    slug: "gat-pass-front",
    title: "往来港澳通行证正面",
    summary: "提取出生日期、签发地点、编号、中文姓名、英文姓名。",
    previewFields: ["中文姓名", "英文姓名", "编号", "有效期限"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "gat-pass-back",
    title: "往来港澳通行证背面",
    summary: "提取往来香港/澳门签注种类、有效期和备注信息。",
    previewFields: ["签注种类", "签注有效期", "签注备注"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "universal-identification-text",
    title: "通用识别-文本",
    summary: "识别通用文本版面，返回页面、段落、行和文本坐标信息。",
    previewFields: ["页码", "页宽", "页高", "文本行"],
    visualKind: "text",
    status: "planned",
  },
  {
    slug: "universal-identification-handwriting",
    title: "通用识别-手写",
    summary: "识别手写文本版面，返回页面、段落、行和文本坐标信息。",
    previewFields: ["页码", "手写文本", "文本行", "坐标"],
    visualKind: "text",
    status: "planned",
  },
  {
    slug: "paddleocr-general",
    title: "PaddleOCR通用识别",
    summary: "识别通用版面文本，返回文本内容、文本行、坐标和置信度。",
    previewFields: ["文本内容", "文本行", "坐标", "置信度"],
    visualKind: "text",
    status: "planned",
  },
  {
    slug: "barcode-ocr",
    title: "条形码识别",
    summary: "识别图片中的条形码或二维码内容，并返回条码类型、位置和置信度。",
    previewFields: ["条码内容", "条码类型", "坐标", "置信度"],
    visualKind: "text",
    status: "planned",
  },
  {
    slug: "real-estate-certificate",
    title: "不动产权证",
    summary: "提取登记日期、编号、权利人、坐落、不动产单元号。",
    previewFields: ["登记日期", "权利人", "坐落", "不动产单元号"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "real-estate-registration-certificate",
    title: "不动产登记证",
    summary: "提取权利人、义务人、坐落、不动产单元号和证明事项。",
    previewFields: ["权利人", "义务人", "坐落", "证明事项"],
    visualKind: "document",
    status: "planned",
  },
  {
    slug: "motor-vehicle-invoice",
    title: "机动车发票",
    summary: "提取发票代码、号码、购方名称、厂牌型号、车辆类型。",
    previewFields: ["发票代码", "购方名称", "厂牌型号", "车辆类型"],
    visualKind: "invoice",
    status: "planned",
  },
  {
    slug: "used-car-invoice",
    title: "二手车发票",
    summary: "提取发票代码、号码、购销方、车牌照号和车辆价款。",
    previewFields: ["发票代码", "购方单位", "销方名称", "车牌照号"],
    visualKind: "invoice",
    status: "planned",
  },
];

export const interfaceCatalog: InterfaceCard[] = interfaceCatalogSeed.map((item) => ({
  ...item,
  category: categoryBySlug[item.slug],
}));

export const categories = [...generatedCategories];

export const getCardBySlug = (slug: string) => interfaceCatalog.find((item) => item.slug === slug);
