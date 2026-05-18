import type React from "react";
import { useMemo, useState } from "react";
import { Link, Navigate, Route, Routes, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Archive,
  BookOpen,
  Braces,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Compass,
  Filter,
  Layers3,
  LayoutGrid,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  categories,
  commonErrorFields,
  commonRequestFields,
  commonResponseGroups,
  docsBySlug,
  FieldDef,
  getCardBySlug,
  InterfaceCard,
  interfaceCatalog,
  OcrInterfaceDoc,
  VisualKind,
} from "./data/ocrDocs";

type ViewMode = "business" | "developer";

const thumbnailAssets = {
  bankcard: new URL("./assets/thumbs/bankcard-scene.jpg", import.meta.url).href,
  businessLicense: new URL("./assets/thumbs/business-license-scene.jpg", import.meta.url).href,
  customsDocument: new URL("./assets/thumbs/customs-document-scene.jpg", import.meta.url).href,
  driverLicense: new URL("./assets/thumbs/driver-license-scene.jpg", import.meta.url).href,
  handwriting: new URL("./assets/thumbs/handwriting-scene.jpg", import.meta.url).href,
  householdMarriage: new URL("./assets/thumbs/household-marriage-scene.jpg", import.meta.url)
    .href,
  idcard: new URL("./assets/thumbs/idcard-scene.jpg", import.meta.url).href,
  licensePlate: new URL("./assets/thumbs/license-plate-scene.jpg", import.meta.url).href,
  passportPermit: new URL("./assets/thumbs/passport-permit-scene.jpg", import.meta.url).href,
  realEstate: new URL("./assets/thumbs/real-estate-scene.jpg", import.meta.url).href,
  receipt: new URL("./assets/thumbs/receipt-scene.jpg", import.meta.url).href,
  socialSecurityCard: new URL("./assets/thumbs/social-security-card-scene.jpg", import.meta.url)
    .href,
  textDocument: new URL("./assets/thumbs/text-document-scene.jpg", import.meta.url).href,
  trainTicket: new URL("./assets/thumbs/train-ticket-scene.jpg", import.meta.url).href,
  vatInvoice: new URL("./assets/thumbs/vat-invoice-scene.jpg", import.meta.url).href,
  vehicleDocument: new URL("./assets/thumbs/vehicle-document-scene.jpg", import.meta.url).href,
  vehicleInvoice: new URL("./assets/thumbs/vehicle-invoice-scene.jpg", import.meta.url).href,
};

type ThumbnailKey = keyof typeof thumbnailAssets;
type HomeSpecimenKind =
  | "idcard"
  | "businessLicense"
  | "receipt"
  | "invoice"
  | "bankcard"
  | "textDocument"
  | "vehicleDocument"
  | "genericDocument"
  | "ticket";

const homeSpecimenAssets: Partial<Record<HomeSpecimenKind, string>> = {
  businessLicense: new URL("./assets/resources/business-license-specimen.png", import.meta.url)
    .href,
  idcard: new URL("./assets/resources/idcard-specimen.png", import.meta.url).href,
  invoice: new URL("./assets/resources/vehicle-invoice-specimen.png", import.meta.url).href,
  receipt: new URL("./assets/resources/receipt-specimen.png", import.meta.url).href,
};

const thumbnailBySlug: Partial<Record<string, ThumbnailKey>> = {
  "account-opening-license": "customsDocument",
  bankcard: "bankcard",
  "business-license": "businessLicense",
  "driver-license": "driverLicense",
  "gat-pass-back": "passportPermit",
  "gat-pass-front": "passportPermit",
  "household-register": "householdMarriage",
  idcard: "idcard",
  "itinerary-receipt": "trainTicket",
  "mainland-travel-permit-for-gat": "passportPermit",
  "marriage-certificate": "householdMarriage",
  "motor-vehicle-certificate": "vehicleDocument",
  "motor-vehicle-invoice": "vehicleInvoice",
  "motor-vehicle-registration-certificate": "vehicleDocument",
  "number-plates": "licensePlate",
  passport: "passportPermit",
  "railway-eticket": "trainTicket",
  "real-estate-certificate": "realEstate",
  "real-estate-registration-certificate": "realEstate",
  "receipt-ocr": "receipt",
  "social-security-card": "socialSecurityCard",
  "taxi-invoice": "receipt",
  "trade-in-recycle-voucher": "vehicleDocument",
  "train-ticket": "trainTicket",
  "universal-identification-handwriting": "handwriting",
  "universal-identification-text": "textDocument",
  "used-car-invoice": "vehicleInvoice",
  "vat-invoice": "vatInvoice",
  "vehicle-license": "vehicleDocument",
  vin: "licensePlate",
};

const fallbackThumbnailByKind: Record<VisualKind, ThumbnailKey> = {
  document: "businessLicense",
  idcard: "idcard",
  invoice: "vatInvoice",
  text: "textDocument",
  ticket: "receipt",
  vehicle: "vehicleDocument",
};

const heroSpecimens = [
  {
    title: "身份证识别",
    badge: "证件类",
    code: "ID-001",
    sample: "idcard",
    rotate: "-2deg",
    tone: "blue",
  },
  {
    title: "营业执照识别",
    badge: "证照类",
    code: "BIZ-001",
    sample: "businessLicense",
    rotate: "1deg",
    tone: "green",
  },
  {
    title: "POS 小票识别",
    badge: "票据类",
    code: "RC-001",
    sample: "receipt",
    rotate: "-1deg",
    tone: "amber",
  },
  {
    title: "通用文字识别",
    badge: "通用类",
    code: "TXT-001",
    sample: "textDocument",
    rotate: "2deg",
    tone: "purple",
  },
] satisfies Array<{
  title: string;
  badge: string;
  code: string;
  sample: HomeSpecimenKind;
  rotate: string;
  tone: "blue" | "green" | "amber" | "purple";
}>;

const featuredSlugs = [
  "idcard",
  "business-license",
  "receipt-ocr",
  "motor-vehicle-invoice",
  "bankcard",
  "universal-identification-text",
];

const anchors = [
  { id: "overview", label: "接口概览" },
  { id: "visual", label: "示意样张" },
  { id: "fields", label: "字段说明" },
  { id: "request", label: "请求参数" },
  { id: "response", label: "返回结构" },
  { id: "errors", label: "错误码" },
  { id: "related", label: "相关接口" },
];

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/interfaces/:slug" element={<DetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function HomePage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("全部");

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return interfaceCatalog.filter((item) => {
      const categoryMatched = activeCategory === "全部" || item.category === activeCategory;
      const textMatched =
        !normalizedQuery ||
        [item.title, item.summary, item.category, ...item.previewFields]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      return categoryMatched && textMatched;
    });
  }, [activeCategory, query]);

  const categoryStats = useMemo(
    () =>
      categories.map((category) => ({
        category,
        count: interfaceCatalog.filter((item) => item.category === category).length,
      })),
    [],
  );
  const completeCount = interfaceCatalog.filter((item) => item.status === "complete").length;
  const coreRecommendation = docsBySlug.get("idcard") ?? buildCatalogDoc(interfaceCatalog[0]);
  const featuredRecords = featuredSlugs
    .map((slug) => getCardBySlug(slug))
    .filter((item): item is InterfaceCard => Boolean(item));
  const isBrowsing = query.trim().length > 0 || activeCategory !== "全部";
  const recordsForBoard = isBrowsing ? filtered : featuredRecords;
  const directoryRecords = isBrowsing ? filtered : interfaceCatalog;
  const scenarioIndex = [
    { label: "实名开户", count: categoryStats.find((item) => item.category === "证照身份类")?.count ?? 0 },
    { label: "财务报销", count: categoryStats.find((item) => item.category === "发票票据类")?.count ?? 0 },
    { label: "商户入网", count: categoryStats.find((item) => item.category === "商户经营类")?.count ?? 0 },
    { label: "车辆归档", count: categoryStats.find((item) => item.category === "车辆交通类")?.count ?? 0 },
  ];
  const fieldIndex = [
    { label: "结构化字段", count: interfaceCatalog.length },
    {
      label: "含坐标信息",
      count: interfaceCatalog.filter((item) => item.previewFields.length >= 3).length,
    },
    { label: "票面表格", count: interfaceCatalog.filter((item) => item.visualKind === "invoice").length },
    {
      label: "长文本版面",
      count: interfaceCatalog.filter((item) => item.category === "通用文本类").length,
    },
  ];

  return (
    <main className="home-page">
      <div className="home-board">
        <div className="home-board-rings" aria-hidden="true">
          <span />
          <span />
        </div>

        <header className="home-header" aria-label="站点导航">
          <Link className="home-brand" to="/">
            <span className="home-brand-mark">OCR</span>
            <strong>OCR 识别接口文档中心</strong>
          </Link>
          <nav aria-label="主导航">
            <a className="active" href="#home">
              首页
            </a>
            <a href="#catalog">接口分类</a>
            <a href="#directory">字段字典</a>
            <a href="#updates">更新记录</a>
          </nav>
          <a className="home-support" href="#catalog">
            <BookOpen size={17} />
            查看图鉴
          </a>
        </header>

        <section className="home-hero" id="home">
          <div className="home-catalogue-paper">
            <div className="home-paper-meta">
              <span>CATALOGUE</span>
              <code>OCR-ATLAS</code>
              <em>No. 0001</em>
            </div>
            <div className="home-eyebrow">
              <Sparkles size={16} />
              银商大脑 OCR 文档中心
            </div>
            <h1>OCR 识别接口图鉴</h1>
            <p>
              以档案化方式整理证件、票据、交易凭证与通用文本识别接口，便于快速查询字段结构与说明。
            </p>
            <label className="home-search">
              <Search size={21} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="检索接口名称 / 字段 / 识别类型"
              />
            </label>
            <span className="home-watermark" aria-hidden="true" />
          </div>

          <div className="home-specimen-rail" aria-label="已收录接口样张陈列">
            {heroSpecimens.map((specimen, index) => (
              <HomeSpecimenCard index={index} key={specimen.code} specimen={specimen} />
            ))}
          </div>
        </section>

        <section className="home-workbench" id="catalog">
          <aside className="home-index-paper" aria-label="索引目录">
            <div className="home-panel-title">
              <h2>索引目录</h2>
              <span>INDEX</span>
            </div>
            <div className="home-index-group">
              <button
                className={activeCategory === "全部" ? "active" : ""}
                onClick={() => setActiveCategory("全部")}
                type="button"
              >
                <LayoutGrid size={16} />
                <span>全部识别类型</span>
                <strong>{interfaceCatalog.length}</strong>
              </button>
              {categoryStats.map((item) => (
                <button
                  className={activeCategory === item.category ? "active" : ""}
                  key={item.category}
                  onClick={() => setActiveCategory(item.category)}
                  type="button"
                >
                  <Filter size={16} />
                  <span>{item.category}</span>
                  <strong>{item.count}</strong>
                </button>
              ))}
            </div>
            <HomeIndexList title="按业务场景" rows={scenarioIndex} />
            <HomeIndexList title="按字段特征" rows={fieldIndex} />
          </aside>

          <section className="home-record-paper" aria-label="OCR 接口档案">
            <div className="home-record-tab">接口图鉴 · {isBrowsing ? "筛选结果" : "精选档案"}</div>
            <div className="home-record-head">
              <div>
                <span>{isBrowsing ? "SEARCH RESULT" : "SELECTED FILES"}</span>
                <h2>{isBrowsing ? "筛选结果" : "接口图鉴 · 精选档案"}</h2>
              </div>
              <em>共 {recordsForBoard.length} 项</em>
            </div>
            <div className="home-record-grid">
              {recordsForBoard.length ? (
                recordsForBoard.map((item) => <HomeRecordCard item={item} key={item.slug} />)
              ) : (
                <div className="home-empty">未找到匹配的 OCR 接口档案。</div>
              )}
            </div>
          </section>

          <aside className="home-summary-paper" aria-label="档案摘要">
            <div className="home-panel-title">
              <h2>档案摘要</h2>
              <span>ARCHIVE SUMMARY</span>
            </div>
            <HomeSummaryItem
              icon={<Archive size={30} />}
              label="接口总数"
              note="已收录 OCR 接口档案"
              value={interfaceCatalog.length}
            />
            <HomeSummaryItem
              icon={<Compass size={30} />}
              label="当前推荐"
              note={coreRecommendation.title}
              value="证照与票据"
            />
            <HomeSummaryItem
              icon={<Clock3 size={30} />}
              label="最近更新"
              note="完整档案样张"
              value={completeCount}
            />
            <a className="home-summary-link" href="#directory">
              查看完整目录
              <span aria-hidden="true">→</span>
            </a>
          </aside>
        </section>

        <section className="home-directory-paper" id="directory" aria-label="完整接口目录">
          <div className="home-record-head">
            <div>
              <span>FULL INDEX</span>
              <h2>{isBrowsing ? "当前筛选目录" : "完整接口目录"}</h2>
            </div>
            <em>{directoryRecords.length} 项</em>
          </div>
          <div className="home-directory-grid">
            {directoryRecords.map((item) => (
              <HomeDirectoryItem item={item} key={item.slug} />
            ))}
          </div>
        </section>

        <section className="home-reference-strip" id="updates" aria-label="扩展资料">
          <div className="home-reference-tag">
            <strong>延伸索引</strong>
            <span>REFERENCE FILES</span>
          </div>
          <a className="home-reference-card" href="#directory">
            <BookOpen size={34} />
            <div>
              <strong>字段命名规范</strong>
              <p>统一字段含义、英文命名方式与约定，便于理解与对接。</p>
            </div>
          </a>
          <a className="home-reference-card" href="#catalog">
            <ShieldCheck size={34} />
            <div>
              <strong>初次接入建议</strong>
              <p>从接入准备到调试校验，帮助开发人员减少误读。</p>
            </div>
          </a>
          <a className="home-reference-card" href="#catalog">
            <CheckCircle2 size={34} />
            <div>
              <strong>常见错误码说明</strong>
              <p>汇总 OCR 接口常见错误与状态说明，快速定位问题。</p>
            </div>
          </a>
          <div className="home-archive-note">
            <strong>档案说明</strong>
            <p>本站仅使用虚构示意素材，接口字段以正式文档为准。</p>
          </div>
        </section>
      </div>
    </main>
  );
}

function HomeSpecimenCard({
  index,
  specimen,
}: {
  index: number;
  specimen: (typeof heroSpecimens)[number];
}) {
  return (
    <article
      className={`home-specimen-card ${specimen.tone}`}
      style={{ "--rotate": specimen.rotate } as React.CSSProperties}
    >
      <span className="home-tape" aria-hidden="true" />
      <header>
        <strong>{specimen.title}</strong>
        <small>SPECIMEN {String(index + 1).padStart(2, "0")}</small>
      </header>
      <div className="home-specimen-image">
        <HomeDocumentSpecimen kind={specimen.sample} title={specimen.title} variant="hero" />
      </div>
      <footer>
        <span>{specimen.badge}</span>
        <code>{specimen.code}</code>
      </footer>
      <em aria-hidden="true">已收录</em>
    </article>
  );
}

function HomeDocumentSpecimen({
  kind,
  title,
  variant,
}: {
  kind: HomeSpecimenKind;
  title: string;
  variant: "hero" | "record";
}) {
  const imageSrc = homeSpecimenAssets[kind];

  return (
    <div
      aria-label={`${title}虚构样张`}
      className={`home-doc-specimen ${kind} ${variant}`}
      role="img"
    >
      {imageSrc ? <img className="home-doc-photo" src={imageSrc} alt="" loading="lazy" /> : null}
      {kind === "bankcard" ? <BankcardSpecimen /> : null}
      {kind === "textDocument" ? <TextDocumentSpecimen /> : null}
      {kind === "vehicleDocument" ? <VehicleDocumentSpecimen /> : null}
      {kind === "ticket" ? <TicketSpecimen /> : null}
      {kind === "genericDocument" ? <GenericHomeSpecimen title={title} /> : null}
    </div>
  );
}

function BankcardSpecimen() {
  return (
    <div className="sample-bankcard">
      <span className="sample-bank-logo" />
      <span className="sample-chip" />
      <strong>6222 1234 5678 9012</strong>
      <small>DEMO CARD</small>
    </div>
  );
}

function TextDocumentSpecimen() {
  return (
    <div className="sample-text-doc">
      <strong>通用文字识别样张</strong>
      {Array.from({ length: 8 }, (_, index) => (
        <span key={index} />
      ))}
    </div>
  );
}

function VehicleDocumentSpecimen() {
  return (
    <div className="sample-vehicle-doc">
      <strong>车辆资料</strong>
      <div>
        <span>VIN</span>
        <i>LSGPC1234F1234567</i>
      </div>
      <div>
        <span>号牌号码</span>
        <i>沪A12345</i>
      </div>
      <div>
        <span>车辆类型</span>
        <i>小型轿车</i>
      </div>
      <em>归档</em>
    </div>
  );
}

function TicketSpecimen() {
  return (
    <div className="sample-ticket">
      <strong>电子客票</strong>
      <b>上海虹桥 → 北京南</b>
      <span>G102　08:23 开</span>
      <i>￥553.00</i>
    </div>
  );
}

function GenericHomeSpecimen({ title }: { title: string }) {
  return (
    <div className="sample-generic-doc">
      <strong>{title}</strong>
      {Array.from({ length: 6 }, (_, index) => (
        <span key={index} />
      ))}
      <em>DEMO</em>
    </div>
  );
}

function HomeIndexList({
  rows,
  title,
}: {
  rows: Array<{ label: string; count: number }>;
  title: string;
}) {
  return (
    <div className="home-index-list">
      <div className="home-index-list-title">
        <ClipboardList size={15} />
        <strong>{title}</strong>
      </div>
      {rows.map((row) => (
        <div className="home-index-row" key={row.label}>
          <span>{row.label}</span>
          <em>{row.count}</em>
        </div>
      ))}
    </div>
  );
}

function HomeRecordCard({ item }: { item: InterfaceCard }) {
  return (
    <Link className="home-record-card" to={`/interfaces/${item.slug}`}>
      <figure className="home-record-thumb">
        <HomeDocumentSpecimen kind={getHomeSpecimenKind(item)} title={item.title} variant="record" />
      </figure>
      <div className="home-record-content">
        <div className="home-record-meta">
          <span>{item.category}</span>
          <code>{getRecordId(item)}</code>
        </div>
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
        <div className="home-field-chips">
          {item.previewFields.slice(0, 3).map((field) => (
            <span key={field}>{field}</span>
          ))}
          {item.previewFields.length > 3 ? <span>...</span> : null}
        </div>
        <div className="home-record-footer">
          <span className={`home-status ${item.status}`}>
            档案：{item.status === "complete" ? "完整类" : "能力类"}
          </span>
          <strong>
            查看详情
            <span aria-hidden="true">›</span>
          </strong>
        </div>
      </div>
    </Link>
  );
}

function HomeSummaryItem({
  icon,
  label,
  note,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  note: string;
  value: number | string;
}) {
  return (
    <div className="home-summary-item">
      <div className="home-summary-icon">{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <p>{note}</p>
      </div>
    </div>
  );
}

function HomeDirectoryItem({ item }: { item: InterfaceCard }) {
  return (
    <Link className="home-directory-item" to={`/interfaces/${item.slug}`}>
      <span>{item.category}</span>
      <strong>{item.title}</strong>
      <code>{getRecordId(item)}</code>
    </Link>
  );
}

function DetailPage() {
  const { slug = "" } = useParams();
  const doc = docsBySlug.get(slug);
  const card = getCardBySlug(slug);

  if (doc) {
    return <DocDetail doc={doc} />;
  }

  if (card) {
    return <DocDetail doc={buildCatalogDoc(card)} />;
  }

  return <Navigate to="/" replace />;
}

const scenariosByCategory: Record<OcrInterfaceDoc["category"], string[]> = {
  证照身份类: ["实名开户注册", "身份信息核验", "客户资料归档"],
  发票票据类: ["财务报销", "票据归档", "交易凭证审核"],
  车辆交通类: ["车辆资料采集", "交通票据归档", "资产与补贴审核"],
  商户经营类: ["商户入网", "经营资质审核", "账户资料归档"],
  通用文本类: ["文本归档", "非标版式识别", "人工录入替代"],
  地产凭证类: ["权属资料采集", "凭证信息归档", "业务材料核验"],
};

const fieldKeyHints: Record<string, string> = {
  姓名: "Name",
  性别: "Sex",
  民族: "Nation",
  出生日期: "Birth",
  地址: "Address",
  身份证号码: "IDNum",
  签发机关: "IssueAuthority",
  有效期限: "ExpiryDate",
  银行卡号: "CardNo",
  发卡行: "BankName",
  卡类型: "CardType",
  社会保障号: "SocialSecurityNo",
  发票代码: "FPDM",
  发票号码: "FPHM",
  开票日期: "KPRQ",
  购方名称: "GFMC",
  购方识别号: "GMSBH",
  销方名称: "XFMC",
  销方识别号: "XFSBH",
  价税合计: "JSHJ",
  金额合计: "JEHJ",
  税额合计: "SEHJ",
  出发站: "FromStation",
  到达站: "ToStation",
  车次: "TrainNo",
  票价: "Fare",
  乘车人: "PassengerName",
  商户名称: "MerchantName",
  交易时间: "TransactionTime",
  金额: "Amount",
  流水号: "TraceNo",
  统一社会信用代码: "CreditCode",
  企业名称: "EnterpriseName",
  法人: "LegalPerson",
  经营范围: "BusinessScope",
  车牌号码: "PlateNo",
  号牌颜色: "PlateColor",
  证号: "LicenseNo",
  准驾车型: "DrivingClass",
  VIN: "VIN",
  发动机号: "EngineNo",
  护照号码: "PassportNo",
  机读码: "MRZ",
  户号: "HouseholdNo",
  持证人: "HolderName",
  登记日期: "RegisterDate",
  核准号: "ApprovalNo",
  开户名称: "AccountName",
  开户银行: "BankName",
  账号: "AccountNo",
  中文姓名: "ChineseName",
  英文姓名: "EnglishName",
  证件号码: "CertificateNo",
  合格证编号: "CertificateNo",
  车辆型号: "VehicleModel",
  车架号: "VIN",
  登记证编号: "RegisterCertificateNo",
  所有人: "OwnerName",
  凭单编号: "VoucherNo",
  回收企业: "RecycleEnterprise",
  回收日期: "RecycleDate",
  签注种类: "EndorsementType",
  签注有效期: "EndorsementValidity",
  签注备注: "EndorsementRemark",
  页码: "PageIndex",
  页宽: "PageWidth",
  页高: "PageHeight",
  文本行: "TextLine",
  手写文本: "HandwritingText",
  坐标: "Position",
  权利人: "RightHolder",
  义务人: "Obligor",
  坐落: "Location",
  不动产单元号: "RealEstateUnitNo",
  证明事项: "CertificateItem",
  厂牌型号: "BrandModel",
  车辆类型: "VehicleType",
  购方单位: "BuyerName",
  销方单位: "SellerName",
  车牌照号: "PlateNo",
};

function buildCatalogDoc(card: InterfaceCard): OcrInterfaceDoc {
  const fields = card.previewFields.map<FieldDef>((field, index) => ({
    key: fieldKeyHints[field] ?? `field_${String(index + 1).padStart(2, "0")}`,
    label: field,
    type: "字符串",
    required: false,
    description: `${field}对应的结构化识别结果，用于${card.summary.replace(/[。.]$/, "")}。`,
    tags: index < 3 ? ["业务核心"] : ["可选"],
    formatHint: index < 3 ? "典型核心字段" : undefined,
  }));

  return {
    slug: card.slug,
    title: card.title,
    category: card.category,
    summary: card.summary,
    scenarios: scenariosByCategory[card.category],
    fieldCount: fields.length,
    endpoints: {
      protocol: "HTTP(S) + JSON",
      method: "POST",
      testUrl: `https://test-api-open.chinaums.com/v1/brain/ocr/${card.slug}`,
      prodUrl: `https://api-lob.open.chinaums.com/v1/brain/ocr/${card.slug}`,
    },
    request: commonRequestFields,
    fieldGroups: [
      {
        title: "典型业务字段",
        description: "按现有接口材料整理的高频字段，用于快速理解该识别能力的主要返回内容。",
        fields,
      },
    ],
    response: {
      overview: `${card.title}接口采用统一 OCR 返回结构，字段结果通过 FieldList 返回，并保留坐标、置信度等辅助信息。`,
      commonGroups: commonResponseGroups,
    },
    errors: commonErrorFields,
    visual: {
      kind: card.visualKind,
      coverAlt: `${card.title}规范化示意缩略图`,
      detailAlt: `${card.title}字段分布示意图`,
      annotations: card.previewFields.slice(0, 5),
    },
    relatedSlugs: interfaceCatalog
      .filter((item) => item.category === card.category && item.slug !== card.slug)
      .slice(0, 4)
      .map((item) => item.slug),
  };
}

function DocDetail({ doc }: { doc: OcrInterfaceDoc }) {
  const [mode, setMode] = useState<ViewMode>("business");
  const allSpecificFields = doc.fieldGroups.flatMap((group) => group.fields);
  const isCompleteDoc = docsBySlug.has(doc.slug);
  const card = getCardBySlug(doc.slug);

  return (
    <main className="detail-shell">
      <aside className="side-nav" aria-label="页面目录">
        <Link className="back-link" to="/">
          <ArrowLeft size={18} />
          返回
        </Link>
        <nav>
          {anchors.map((anchor) => (
            <a href={`#${anchor.id}`} key={anchor.id}>
              {anchor.label}
            </a>
          ))}
        </nav>
      </aside>

      <article className="doc-content">
        <section className="detail-hero" id="overview">
          <div className="detail-hero-copy">
            <span className="category-pill">{doc.category}</span>
            <h1>{doc.title}</h1>
            <p>{doc.summary}</p>
          </div>
          <div className="detail-hero-aside">
            {card ? <VisualThumb item={card} variant="detail" /> : null}
            <div className="mode-switch" aria-label="阅读视角">
              <button
                className={mode === "business" ? "active" : ""}
                onClick={() => setMode("business")}
                type="button"
              >
                业务视角
              </button>
              <button
                className={mode === "developer" ? "active" : ""}
                onClick={() => setMode("developer")}
                type="button"
              >
                开发视角
              </button>
            </div>
          </div>
        </section>

        <section className="section-block">
          <div className="overview-grid">
            <InfoTile label="协议" value={doc.endpoints.protocol} />
            <InfoTile label="请求方式" value={doc.endpoints.method} />
            <InfoTile label="字段数量" value={`${doc.fieldCount || allSpecificFields.length} 个`} />
            <InfoTile label="返回形式" value="JSON" />
          </div>
          <div className="scenario-band">
            {doc.scenarios.map((scenario) => (
              <span key={scenario}>{scenario}</span>
            ))}
          </div>
        </section>

        <section className="section-block visual-section" id="visual">
          <SectionTitle
            icon={<ShieldCheck size={20} />}
            title="规范化示意样张"
            subtitle="页面只使用虚构字段和结构化示意，不放真实证件、票据或业务材料样例。"
          />
          <DocumentVisual doc={doc} />
        </section>

        <section className="section-block" id="fields">
          <SectionTitle
            icon={<ClipboardList size={20} />}
            title={mode === "business" ? "业务字段分组" : "字段定义表"}
            subtitle={
              mode === "business"
                ? "先按业务语义理解信息，再进入技术字段名。"
                : "保留英文字段名、类型、标签和说明，方便开发对接。"
            }
          />
          <div className="field-group-stack">
            {doc.fieldGroups.map((group) => (
              <FieldGroupBlock group={group} key={group.title} mode={mode} />
            ))}
          </div>
        </section>

        <section className="section-block" id="request">
          <SectionTitle
            icon={<Braces size={20} />}
            title="请求参数"
            subtitle="本站展示参数结构与接口地址，不提供上传、试用或在线调用入口。"
          />
          <EndpointPanel doc={doc} />
          <FieldTable fields={doc.request} compact={false} />
        </section>

        <section className="section-block" id="response">
          <SectionTitle
            icon={<Layers3 size={20} />}
            title="返回结构"
            subtitle={doc.response.overview}
          />
          <div className="field-group-stack">
            {doc.response.commonGroups.map((group) => (
              <FieldGroupBlock group={group} key={group.title} mode="developer" />
            ))}
          </div>
        </section>

        <section className="section-block" id="errors">
          <SectionTitle
            icon={<CheckCircle2 size={20} />}
            title="错误码与状态"
            subtitle="接口级返回码和识别状态码分开理解，便于排查链路问题。"
          />
          <FieldTable fields={doc.errors} compact={false} />
        </section>

        <section className="section-block" id="related">
          <SectionTitle
            icon={<BookOpen size={20} />}
            title="相关接口"
            subtitle="同类能力便于业务人员横向查阅。"
          />
          <div className="related-grid">
            {doc.relatedSlugs
              .map((relatedSlug) => getCardBySlug(relatedSlug))
              .filter(Boolean)
              .map((item) => (
                <Link className="related-card" to={`/interfaces/${item!.slug}`} key={item!.slug}>
                  <span>{item!.category}</span>
                  <strong>{item!.title}</strong>
                  <p>{item!.summary}</p>
                </Link>
              ))}
          </div>
        </section>
      </article>

      <aside className="summary-panel">
        <div className="summary-card">
          <span className={`status-pill ${isCompleteDoc ? "complete" : "planned"}`}>
            {isCompleteDoc ? "完整档案" : "能力档案"}
          </span>
          <h2>{doc.title}</h2>
          <dl>
            <div>
              <dt>分类</dt>
              <dd>{doc.category}</dd>
            </div>
            <div>
              <dt>方法</dt>
              <dd>{doc.endpoints.method}</dd>
            </div>
            <div>
              <dt>字段数</dt>
              <dd>{doc.fieldCount || allSpecificFields.length}</dd>
            </div>
            <div>
              <dt>结构</dt>
              <dd>JSON</dd>
            </div>
          </dl>
          <div className="summary-note">示意内容均为虚构占位；页面不保存密钥，不提供接口调用能力。</div>
        </div>
      </aside>
    </main>
  );
}

function EndpointPanel({ doc }: { doc: OcrInterfaceDoc }) {
  return (
    <div className="endpoint-panel">
      <div>
        <span>测试环境</span>
        <code>{doc.endpoints.testUrl}</code>
      </div>
      <div>
        <span>生产环境</span>
        <code>{doc.endpoints.prodUrl}</code>
      </div>
    </div>
  );
}

function FieldGroupBlock({
  group,
  mode,
}: {
  group: { title: string; description: string; fields: FieldDef[] };
  mode: ViewMode;
}) {
  return (
    <section className="field-group">
      <div className="field-group-head">
        <div>
          <h3>{group.title}</h3>
          <p>{group.description}</p>
        </div>
        <span>{group.fields.length} 字段</span>
      </div>
      {mode === "business" ? (
        <div className="semantic-fields">
          {group.fields.map((field) => (
            <div className="semantic-field" key={field.key}>
              <span>{field.label}</span>
              <strong>{field.key}</strong>
              <p>{field.description}</p>
              <TagRow field={field} />
            </div>
          ))}
        </div>
      ) : (
        <FieldTable fields={group.fields} compact />
      )}
    </section>
  );
}

function FieldTable({ fields, compact }: { fields: FieldDef[]; compact: boolean }) {
  return (
    <div className={`field-table-wrap ${compact ? "compact" : ""}`}>
      <table>
        <thead>
          <tr>
            <th>字段名</th>
            <th>中文名称</th>
            <th>类型</th>
            <th>标记</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field) => (
            <tr key={field.key}>
              <td>
                <code>{field.key}</code>
              </td>
              <td>{field.label}</td>
              <td>{field.type}</td>
              <td>
                <TagRow field={field} />
              </td>
              <td>
                {field.description}
                {field.formatHint ? <em>{field.formatHint}</em> : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TagRow({ field }: { field: FieldDef }) {
  const tags = field.tags.length ? field.tags : [field.required ? "必返" : "可选"];
  return (
    <div className="tag-row">
      {tags.map((tag) => (
        <span className={`tag tag-${tag}`} key={tag}>
          {tag}
        </span>
      ))}
    </div>
  );
}

function SectionTitle({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="section-title">
      <div className="section-icon">{icon}</div>
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="info-tile">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function VisualThumb({
  item,
  variant = "card",
}: {
  item: InterfaceCard;
  variant?: "card" | "detail";
}) {
  const labelByKind: Record<VisualKind, string> = {
    idcard: "ID",
    invoice: "税票",
    document: "证照",
    ticket: "票据",
    vehicle: "车辆",
    text: "文本",
  };
  const imageSrc = getThumbnailSrc(item);

  return (
    <figure className={`visual-thumb ${item.visualKind} ${variant}`}>
      <img src={imageSrc} alt={`${item.title}虚构示意缩略图`} loading="lazy" />
      <figcaption>
        <span>{labelByKind[item.visualKind]}</span>
        <strong>{getRecordId(item)}</strong>
      </figcaption>
    </figure>
  );
}

function getHomeSpecimenKind(item: InterfaceCard): HomeSpecimenKind {
  if (item.slug === "idcard") return "idcard";
  if (item.slug === "business-license") return "businessLicense";
  if (item.slug === "receipt-ocr" || item.slug === "taxi-invoice") return "receipt";
  if (item.slug === "bankcard") return "bankcard";
  if (item.slug === "railway-eticket" || item.slug === "train-ticket") return "ticket";
  if (item.visualKind === "invoice") return "invoice";
  if (item.visualKind === "vehicle") return "vehicleDocument";
  if (item.visualKind === "text") return "textDocument";
  if (item.visualKind === "ticket") return "receipt";
  return "genericDocument";
}

function getThumbnailSrc(item: InterfaceCard) {
  const thumbnailKey = thumbnailBySlug[item.slug] ?? fallbackThumbnailByKind[item.visualKind];
  return thumbnailAssets[thumbnailKey];
}

function getRecordId(item: InterfaceCard) {
  const prefixByKind: Record<VisualKind, string> = {
    idcard: "ID",
    invoice: "INV",
    document: "DOC",
    ticket: "RC",
    vehicle: "VEH",
    text: "TXT",
  };
  const index = interfaceCatalog.findIndex((catalogItem) => catalogItem.slug === item.slug);
  return `${prefixByKind[item.visualKind]}-${String(index + 1).padStart(3, "0")}`;
}

function DocumentVisual({ doc }: { doc: OcrInterfaceDoc }) {
  if (doc.slug === "bankcard") {
    return <BankCardAnnotatedVisual />;
  }

  if (doc.visual.kind === "idcard") {
    return <IdCardVisual />;
  }

  if (doc.visual.kind === "invoice") {
    return <InvoiceVisual />;
  }

  return (
    <GenericDocumentVisual
      annotations={doc.visual.annotations}
      kind={doc.visual.kind}
      title={doc.title}
    />
  );
}

const bankCardAnnotations = [
  {
    index: "01",
    label: "发卡行",
    key: "BankName",
    point: [23, 31],
    labelPoint: [8, 14],
  },
  {
    index: "02",
    label: "银行卡号",
    key: "CardNo",
    point: [44, 60],
    labelPoint: [8, 62],
  },
  {
    index: "03",
    label: "芯片区域",
    key: "ChipArea",
    point: [20, 42],
    labelPoint: [8, 42],
  },
  {
    index: "04",
    label: "持卡人",
    key: "CardHolder",
    point: [30, 76],
    labelPoint: [8, 84],
  },
  {
    index: "05",
    label: "有效期",
    key: "ValidDate",
    point: [64, 75],
    labelPoint: [78, 76],
  },
  {
    index: "06",
    label: "卡类型",
    key: "CardType",
    point: [85, 30],
    labelPoint: [78, 16],
  },
] as const;

function BankCardAnnotatedVisual() {
  return (
    <div className="annotated-document bankcard-visual" aria-label="银行卡字段解剖示意图">
      <div className="annotated-stage">
        <img src={thumbnailAssets.bankcard} alt="银行卡虚构示意样张" />
        <svg className="annotation-lines" viewBox="0 0 100 100" aria-hidden="true">
          {bankCardAnnotations.map((annotation) => (
            <g key={annotation.index}>
              <line
                x1={annotation.point[0]}
                x2={annotation.labelPoint[0]}
                y1={annotation.point[1]}
                y2={annotation.labelPoint[1]}
              />
              <circle cx={annotation.point[0]} cy={annotation.point[1]} r="0.9" />
            </g>
          ))}
        </svg>
        {bankCardAnnotations.map((annotation) => (
          <div
            className="document-callout"
            key={annotation.index}
            style={
              {
                "--x": `${annotation.labelPoint[0]}%`,
                "--y": `${annotation.labelPoint[1]}%`,
              } as React.CSSProperties
            }
          >
            <strong>{annotation.label}</strong>
            <span>{annotation.key}</span>
          </div>
        ))}
      </div>
      <div className="annotation-list">
        {bankCardAnnotations.map((annotation) => (
          <Annotation index={annotation.index} label={annotation.label} key={annotation.index} />
        ))}
      </div>
    </div>
  );
}

function IdCardVisual() {
  return (
    <div className="visual-board idcard-board" aria-label="身份证字段解剖示意图">
      <div className="id-card-face">
        <div className="id-photo">示意头像</div>
        <div className="id-lines">
          <VisualLine label="姓名" wide />
          <VisualLine label="性别 / 民族" />
          <VisualLine label="出生日期" />
          <VisualLine label="住址" wide />
          <VisualLine label="身份证号码" wide />
        </div>
      </div>
      <div className="id-card-back">
        <VisualLine label="签发机关" wide />
        <VisualLine label="有效期限" wide />
      </div>
      <div className="annotation-list">
        <Annotation index="01" label="姓名" />
        <Annotation index="02" label="身份证号码" />
        <Annotation index="03" label="住址" />
        <Annotation index="04" label="签发机关" />
        <Annotation index="05" label="有效期限" />
      </div>
    </div>
  );
}

function InvoiceVisual() {
  return (
    <div className="visual-board invoice-board" aria-label="增值税发票字段解剖示意图">
      <div className="invoice-paper">
        <div className="invoice-title">增值税发票示意</div>
        <div className="invoice-top">
          <VisualLine label="发票代码" />
          <VisualLine label="发票号码" />
          <VisualLine label="开票日期" />
        </div>
        <div className="invoice-party">
          <VisualLine label="购方名称 / 识别号" wide />
          <VisualLine label="销方名称 / 识别号" wide />
        </div>
        <div className="invoice-table">
          {["货物名称", "金额", "税率", "税额"].map((item) => (
            <span key={item}>{item}</span>
          ))}
          {Array.from({ length: 12 }, (_, index) => (
            <i key={index} />
          ))}
        </div>
        <div className="invoice-total">
          <VisualLine label="金额合计" />
          <VisualLine label="税额合计" />
          <VisualLine label="价税合计" />
        </div>
      </div>
      <div className="annotation-list">
        <Annotation index="01" label="发票代码" />
        <Annotation index="02" label="发票号码" />
        <Annotation index="03" label="购销方" />
        <Annotation index="04" label="明细行" />
        <Annotation index="05" label="价税合计" />
      </div>
    </div>
  );
}

function GenericDocumentVisual({
  annotations,
  kind,
  title,
}: {
  annotations: string[];
  kind: VisualKind;
  title: string;
}) {
  const visualTitle: Record<VisualKind, string> = {
    idcard: "证件示意",
    invoice: "票据示意",
    document: "证照资料示意",
    ticket: "票据凭证示意",
    vehicle: "车辆资料示意",
    text: "文本版面示意",
  };
  const fields = annotations.length ? annotations : ["字段一", "字段二", "字段三", "字段四"];

  return (
    <div className={`visual-board generic-board ${kind}`} aria-label={`${title}字段分布示意图`}>
      <div className={`generic-paper ${kind}`}>
        <div className="generic-doc-head">
          <span>{visualTitle[kind]}</span>
          <strong>示意</strong>
        </div>
        <div className="generic-doc-title">{title}</div>
        <div className="generic-field-stack">
          {fields.slice(0, 6).map((field, index) => (
            <div className="generic-field-line" key={`${field}-${index}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <i>{field}</i>
            </div>
          ))}
        </div>
        <div className="generic-layout-grid" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => (
            <span key={index} />
          ))}
        </div>
      </div>
      <div className="annotation-list">
        {fields.slice(0, 5).map((field, index) => (
          <Annotation index={String(index + 1).padStart(2, "0")} label={field} key={field} />
        ))}
      </div>
    </div>
  );
}

function VisualLine({ label, wide = false }: { label: string; wide?: boolean }) {
  return (
    <div className={`visual-line ${wide ? "wide" : ""}`}>
      <span>{label}</span>
    </div>
  );
}

function Annotation({ index, label }: { index: string; label: string }) {
  return (
    <div className="annotation">
      <strong>{index}</strong>
      <span>{label}</span>
    </div>
  );
}

export default App;
