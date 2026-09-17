import type React from "react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BadgePercent,
  Banknote,
  BookOpen,
  ClipboardPenLine,
  Braces,
  Building2,
  CarFront,
  FileBadge2,
  Files,
  FileStack,
  FileText,
  CheckCircle2,
  Copy,
  Download,
  Expand,
  House,
  KeyRound,
  Layers3,
  LayoutGrid,
  Link2,
  LogIn,
  Network,
  Paperclip,
  PenLine,
  Search,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import {
  categories,
  commonResponseGroups,
  commonErrorFields,
  commonRequestGroups,
  docsBySlug,
  DownloadAsset,
  FieldDef,
  getEndpointInfoBySlug,
  getCardBySlug,
  InterfaceCard,
  interfaceCatalog,
  OcrInterfaceDoc,
  VisualKind,
} from "./data/ocrDocs";
import { recordIdBySlug } from "./data/generated/interfaceClassification.generated";

const thumbnailAssetsBySlug = {
  "account-opening-license": new URL("./assets/thumbs/account-opening-license-thumb.webp", import.meta.url).href,
  bankcard: new URL("./assets/thumbs/bankcard-thumb.webp", import.meta.url).href,
  "barcode-ocr": new URL("./assets/thumbs/barcode-ocr-thumb.webp", import.meta.url).href,
  "basic-deposit-account": new URL("./assets/thumbs/basic-deposit-account-thumb.webp", import.meta.url)
    .href,
  "business-license": new URL("./assets/thumbs/business-license-thumb.webp", import.meta.url).href,
  "customs-declaration": new URL("./assets/thumbs/customs-declaration-thumb.webp", import.meta.url).href,
  "driver-license": new URL("./assets/thumbs/driver-license-thumb.webp", import.meta.url).href,
  "export-license": new URL("./assets/thumbs/export-license-thumb.webp", import.meta.url).href,
  "gat-pass-back": new URL("./assets/thumbs/gat-pass-back-thumb.webp", import.meta.url).href,
  "gat-pass-front": new URL("./assets/thumbs/gat-pass-front-thumb.webp", import.meta.url).href,
  "household-register": new URL("./assets/thumbs/household-register-thumb.webp", import.meta.url).href,
  idcard: new URL("./assets/thumbs/idcard-thumb.webp", import.meta.url).href,
  "institution-legal-person-certificate": new URL(
    "./assets/thumbs/institution-legal-person-certificate-thumb.webp",
    import.meta.url,
  ).href,
  "itinerary-receipt": new URL("./assets/thumbs/itinerary-receipt-thumb.webp", import.meta.url).href,
  "mainland-travel-permit-for-gat": new URL("./assets/thumbs/mainland-travel-permit-for-gat-thumb.webp", import.meta.url).href,
  "marriage-certificate": new URL("./assets/thumbs/marriage-certificate-thumb.webp", import.meta.url).href,
  "motor-vehicle-certificate": new URL("./assets/thumbs/motor-vehicle-certificate-thumb.webp", import.meta.url).href,
  "motor-vehicle-invoice": new URL("./assets/thumbs/motor-vehicle-invoice-thumb.webp", import.meta.url).href,
  "motor-vehicle-registration-certificate": new URL("./assets/thumbs/motor-vehicle-registration-certificate-thumb.webp", import.meta.url).href,
  "number-plates": new URL("./assets/thumbs/number-plates-thumb.webp", import.meta.url).href,
  "organization-code-certificate": new URL(
    "./assets/thumbs/organization-code-certificate-thumb.webp",
    import.meta.url,
  ).href,
  passport: new URL("./assets/thumbs/passport-thumb.webp", import.meta.url).href,
  "railway-eticket": new URL("./assets/thumbs/railway-eticket-thumb.webp", import.meta.url).href,
  "real-estate-certificate": new URL("./assets/thumbs/real-estate-certificate-thumb.webp", import.meta.url).href,
  "real-estate-registration-certificate": new URL("./assets/thumbs/real-estate-registration-certificate-thumb.webp", import.meta.url).href,
  "receipt-ocr": new URL("./assets/thumbs/receipt-ocr-thumb.webp", import.meta.url).href,
  "seal-ocr": new URL("./assets/thumbs/seal-ocr-thumb.webp", import.meta.url).href,
  "social-security-card": new URL("./assets/thumbs/social-security-card-thumb.webp", import.meta.url).href,
  "taxi-invoice": new URL("./assets/thumbs/taxi-invoice-thumb.webp", import.meta.url).href,
  "trade-in-recycle-voucher": new URL("./assets/thumbs/trade-in-recycle-voucher-thumb.webp", import.meta.url).href,
  "train-ticket": new URL("./assets/thumbs/train-ticket-thumb.webp", import.meta.url).href,
  "universal-identification-handwriting": new URL("./assets/thumbs/universal-identification-handwriting-thumb.webp", import.meta.url).href,
  "universal-identification-text": new URL("./assets/thumbs/universal-identification-text-thumb.webp", import.meta.url).href,
  "used-car-invoice": new URL("./assets/thumbs/used-car-invoice-thumb.webp", import.meta.url).href,
  "vat-invoice": new URL("./assets/thumbs/vat-invoice-thumb.webp", import.meta.url).href,
  "vehicle-license": new URL("./assets/thumbs/vehicle-license-thumb.webp", import.meta.url).href,
  vin: new URL("./assets/thumbs/vin-thumb.webp", import.meta.url).href,
};

type ThumbnailSlug = keyof typeof thumbnailAssetsBySlug;
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
  bankcard: new URL("./assets/resources/bankcard-specimen-alpha.webp", import.meta.url).href,
  businessLicense: new URL("./assets/resources/business-license-specimen-alpha.webp", import.meta.url)
    .href,
  idcard: new URL("./assets/resources/idcard-specimen-alpha.webp", import.meta.url).href,
  invoice: new URL("./assets/resources/vehicle-invoice-specimen-alpha.webp", import.meta.url).href,
  receipt: new URL("./assets/resources/receipt-specimen-alpha.webp", import.meta.url).href,
  textDocument: new URL("./assets/resources/contract-specimen-alpha.webp", import.meta.url).href,
};

const homeAssistantMascot = new URL(
  "./assets/resources/home-assistant-mascot-alpha.webp",
  import.meta.url,
).href;
const homeHeroBinderTopAsset = new URL("./assets/resources/home-hero-binder-top-alpha.webp", import.meta.url).href;
const homeHeroBinderBottomAsset = new URL("./assets/resources/home-hero-binder-bottom-alpha.webp", import.meta.url).href;
const homeRecordTabAsset = new URL("./assets/resources/home-record-tab-selected.webp", import.meta.url).href;
const supportContactsAsset = new URL("resources/support-contacts.txt", document.baseURI).href;

type SupportContact = {
  label: string;
  department: string;
  name: string;
  phone: string;
};

type SupportContactLoadState = "idle" | "loading" | "ready" | "error";

function parseSupportContacts(text: string): SupportContact[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label = "", department = "", name = "", phone = ""] = line.split("|").map((part) => part.trim());
      return { label, department, name, phone };
    })
    .filter((contact) => contact.label && contact.department && contact.name && contact.phone);
}

const activationGuideAssets = {
  applicationForm: new URL(
    "./assets/guides/ocr-activation/银商大脑OCR能力申请表.docx",
    import.meta.url,
  ).href,
  image1: new URL("./assets/guides/ocr-activation/image1.webp", import.meta.url).href,
  image2: new URL("./assets/guides/ocr-activation/image2.webp", import.meta.url).href,
  image3: new URL("./assets/guides/ocr-activation/image3.webp", import.meta.url).href,
  image4: new URL("./assets/guides/ocr-activation/image4.webp", import.meta.url).href,
  image5: new URL("./assets/guides/ocr-activation/image5.webp", import.meta.url).href,
};

const fallbackThumbnailByKind: Record<VisualKind, ThumbnailSlug> = {
  document: "business-license",
  idcard: "idcard",
  invoice: "vat-invoice",
  text: "universal-identification-text",
  ticket: "receipt-ocr",
  vehicle: "vehicle-license",
};

const categoryTones: Record<InterfaceCard["category"], { color: string; rgb: string }> = {
  个人身份类: { color: "#244b82", rgb: "36 75 130" },
  账户金融类: { color: "#2f6f73", rgb: "47 111 115" },
  企业资质类: { color: "#3f6f5a", rgb: "63 111 90" },
  财税报销类: { color: "#b36b21", rgb: "179 107 33" },
  出行票证类: { color: "#a06f2f", rgb: "160 111 47" },
  贸易关务类: { color: "#9b4a36", rgb: "155 74 54" },
  车辆档案类: { color: "#4f7698", rgb: "79 118 152" },
  通用文字类: { color: "#6a5f9f", rgb: "106 95 159" },
  不动产类: { color: "#6d7041", rgb: "109 112 65" },
};

type CategoryToneStyle = React.CSSProperties & {
  "--category-color": string;
  "--category-rgb": string;
};

type HomeDirectoryGroupData = {
  category: InterfaceCard["category"];
  count: number;
  items: InterfaceCard[];
};

const categoryIcons: Record<InterfaceCard["category"], React.ReactNode> = {
  个人身份类: <FileBadge2 size={16} />,
  账户金融类: <Banknote size={16} />,
  企业资质类: <Building2 size={16} />,
  财税报销类: <BadgePercent size={16} />,
  出行票证类: <BookOpen size={16} />,
  贸易关务类: <FileStack size={16} />,
  车辆档案类: <CarFront size={16} />,
  通用文字类: <FileText size={16} />,
  不动产类: <House size={16} />,
};

const categoryDescriptions: Record<InterfaceCard["category"], string> = {
  个人身份类: "身份证、证照、通行证等身份材料",
  账户金融类: "银行卡、开户许可与账户信息",
  企业资质类: "营业执照、印章、机构代码等资质材料",
  财税报销类: "发票、小票、报销与退税材料",
  出行票证类: "火车票、行程单等出行凭证",
  贸易关务类: "报关单、许可证等贸易关务材料",
  车辆档案类: "车牌、驾驶证、行驶证、车辆票证等材料",
  通用文字类: "手写、文本、条码与通用识别能力",
  不动产类: "不动产权证、登记证明等房产材料",
};

function getRouteScrollStorageKey(pathname: string) {
  return `route-scroll:${pathname}`;
}

function getRouteScrollSnapshotKey(pathname: string) {
  return `route-scroll-snapshot:${pathname}`;
}

function readStoredRouteScroll(pathname: string) {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(getRouteScrollStorageKey(pathname));
  if (rawValue === null) {
    return null;
  }

  const parsedValue = Number(rawValue);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function readStoredRouteScrollSnapshot(pathname: string) {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(getRouteScrollSnapshotKey(pathname));
  if (rawValue === null) {
    return null;
  }

  const parsedValue = Number(rawValue);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function writeStoredRouteScroll(pathname: string, scrollY: number) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(getRouteScrollStorageKey(pathname), String(scrollY));
}

function writeStoredRouteScrollSnapshot(pathname: string, scrollY: number) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(getRouteScrollSnapshotKey(pathname), String(scrollY));
}

function clearStoredRouteScrollSnapshot(pathname: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(getRouteScrollSnapshotKey(pathname));
}

function captureInstantPathNavigationSnapshot() {
  if (typeof window === "undefined") {
    return;
  }

  const scrollSnapshotWindow = window as typeof window & {
    __instantNavScrollSnapshot?: { pathname: string; scrollY: number };
  };
  scrollSnapshotWindow.__instantNavScrollSnapshot = {
    pathname: window.location.pathname,
    scrollY: window.scrollY,
  };
  writeStoredRouteScroll(window.location.pathname, window.scrollY);
  writeStoredRouteScrollSnapshot(window.location.pathname, window.scrollY);
}

function prepareInstantPathNavigation() {
  if (typeof window === "undefined") {
    return;
  }

  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });

  window.requestAnimationFrame(() => {
    root.style.scrollBehavior = previousScrollBehavior;
  });
}

function getCategoryToneStyle(category: InterfaceCard["category"]): CategoryToneStyle {
  const tone = categoryTones[category];

  return {
    "--category-color": tone.color,
    "--category-rgb": tone.rgb,
  };
}

const heroSpecimens = [
  {
    title: "身份证识别",
    badge: "个人身份类",
    code: "ID-001",
    slug: "idcard",
    sample: "idcard",
    rotate: "-2deg",
    tone: "blue",
  },
  {
    title: "营业执照识别",
    badge: "企业资质类",
    code: "BIZ-001",
    slug: "business-license",
    sample: "businessLicense",
    rotate: "1deg",
    tone: "green",
  },
  {
    title: "POS 小票识别",
    badge: "财税报销类",
    code: "RC-001",
    slug: "receipt-ocr",
    sample: "receipt",
    rotate: "-1deg",
    tone: "amber",
  },
  {
    title: "通用文字识别",
    badge: "通用文字类",
    code: "TXT-001",
    slug: "universal-identification-text",
    sample: "textDocument",
    rotate: "2deg",
    tone: "purple",
  },
] satisfies Array<{
  title: string;
  badge: string;
  code: string;
  slug: string;
  sample: HomeSpecimenKind;
  rotate: string;
  tone: "blue" | "green" | "amber" | "purple";
}>;

const detailAnchorGroups = [
  {
    title: "接入主线",
    anchors: [
      { id: "request", label: "请求参数", tone: "core" },
      { id: "response", label: "返回参数", tone: "core" },
      { id: "errors", label: "错误码", tone: "support" },
    ],
  },
  {
    title: "示例参考",
    anchors: [{ id: "examples", label: "请求 / 返回示例", tone: "secondary" }],
  },
] as const;

type DetailAnchorGroup = (typeof detailAnchorGroups)[number];
type DetailAnchor = DetailAnchorGroup["anchors"][number];
type DetailSubAnchor = {
  id: string;
  label: string;
  kind: "section" | "group";
};

function parseActiveDetailSectionFromHash(hash: string): DetailAnchor["id"] | null {
  const normalized = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!normalized) {
    return null;
  }

  if (normalized.startsWith("response")) {
    return "response";
  }

  const matchedAnchor = detailNavAnchors.find((anchor) => anchor.id === normalized);
  return matchedAnchor?.id ?? null;
}

const detailQuickActions = [
  { id: "request", label: "请求参数", mobileTabLabel: "参数" },
  { id: "response", label: "返回参数", mobileTabLabel: "返回" },
  { id: "examples", label: "请求 / 返回示例", mobileTabLabel: "示例" },
  { id: "errors", label: "错误码", mobileTabLabel: "错误码" },
] as const;

const detailNavAnchors: DetailAnchor[] = detailAnchorGroups.flatMap((group) => [...group.anchors]);

type SiteHeaderMobileTab = {
  id: string;
  href: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
};

type ActivationStep = {
  icon?: "login" | "search" | "fill" | "link" | "upload" | "submit";
  text: string;
  note?: string;
  shot?: {
    src: string;
    variant?: "wide" | "portrait";
  };
  attachment?: {
    title: string;
    fileName: string;
    summary: string;
    href?: string;
  };
};

type ActivationProcess = {
  id: string;
  icon?: "credentials" | "workflow";
  label: string;
  pathTitle: string;
  mobilePathTitle: string;
  title: string;
  summary: string;
  outcome: string;
  steps: ActivationStep[];
};

const activationProcesses: ActivationProcess[] = [
  {
    id: "process-up",
    icon: "credentials",
    label: "流程一",
    pathTitle: "申请开放平台参数",
    mobilePathTitle: "流程一：申请开放平台参数",
    title: "流程一｜UP 系统申请开放平台参数",
    summary: "在 UP 系统提交开放平台参数申请，用于获取 APPID、APPKEY。",
    outcome: "完成开放平台参数申请提交",
    steps: [
      {
        icon: "login",
        text: "登录 UP 系统，进入业务统一受理平台。",
        note: "从业务办理相关入口开始查找流程。",
      },
      {
        icon: "search",
        text: "搜索并进入“开放平台参数申请通用流程”。",
        note: "先在流程名称输入框搜索“开放平台”，再进入对应流程。",
        shot: {
          src: activationGuideAssets.image1,
        },
      },
      {
        icon: "fill",
        text: "填写开放平台参数申请中的必填字段。",
        note: "接口相关信息需提前向对应技术或售前老师获取。",
        shot: {
          src: activationGuideAssets.image2,
          variant: "wide",
        },
      },
      {
        icon: "submit",
        text: "核对申请信息后提交。",
        note: "重点确认申请类型、接口信息和联系人信息是否完整。",
      },
    ],
  },
  {
    id: "process-project",
    icon: "workflow",
    label: "流程二",
    pathTitle: "提交开发需求",
    mobilePathTitle: "流程二：提交开发需求",
    title: "流程二｜项目管理中心提交开发需求",
    summary: "在项目管理中心发起开发需求，并补充 OCR 能力申请表等材料。",
    outcome: "完成项目开发流程提交",
    steps: [
      {
        icon: "login",
        text: "进入项目管理中心。",
        note: "从左侧导航查找“流程申请单”。",
      },
      {
        icon: "search",
        text: "进入“开发需求申请”，新建开发需求。",
        note: "不要误入其他类型的申请单。",
        shot: {
          src: activationGuideAssets.image3,
          variant: "wide",
        },
      },
      {
        icon: "fill",
        text: "填写开发需求申请单的基础信息。",
        note: "先填写需求名称、描述、联系人等基础内容，后续再补项目和附件。",
        shot: {
          src: activationGuideAssets.image4,
          variant: "portrait",
        },
      },
      {
        icon: "link",
        text: "搜索“天言”并选择对应关联项目。",
        note: "确认项目选择正确后，再继续补充其他信息。",
        shot: {
          src: activationGuideAssets.image5,
          variant: "wide",
        },
      },
      {
        icon: "fill",
        text: "将需求联系人填写为申请人本人。",
        note: "便于审批或补充材料时直接联系。",
      },
      {
        icon: "upload",
        text: "上传“银商大脑 OCR 能力申请表”附件。",
        note: "下载申请表后按实际业务填写，再上传到申请单。",
        attachment: {
          title: "银商大脑 OCR 能力申请表",
          fileName: "银商大脑OCR能力申请表.docx",
          summary: "下载申请表，填写后作为附件上传。",
          href: activationGuideAssets.applicationForm,
        },
      },
      {
        icon: "submit",
        text: "核对申请单和附件后提交。",
        note: "提交后等待项目开发流程审批。",
      },
    ],
  },
];

function getActivationProcessIcon(icon?: ActivationProcess["icon"]) {
  switch (icon) {
    case "credentials":
      return <KeyRound size={15} />;
    case "workflow":
      return <ClipboardPenLine size={15} />;
    default:
      return <Files size={15} />;
  }
}

function getActivationStepIcon(icon?: ActivationStep["icon"]) {
  switch (icon) {
    case "login":
      return <LogIn size={15} />;
    case "search":
      return <Search size={15} />;
    case "fill":
      return <PenLine size={15} />;
    case "link":
      return <Link2 size={15} />;
    case "upload":
      return <Paperclip size={15} />;
    case "submit":
      return <Send size={15} />;
    default:
      return <FileText size={15} />;
  }
}

function App() {
  return (
    <>
      <RouteScrollManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/activation-guide" element={<ActivationGuidePage />} />
        <Route path="/interfaces/:slug" element={<DetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function RouteScrollManager() {
  const location = useLocation();
  const scrollPositionsRef = useRef<Map<string, number>>(new Map());
  const previousPathnameRef = useRef(location.pathname);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const saveScrollPosition = () => {
      scrollPositionsRef.current.set(location.pathname, window.scrollY);
      writeStoredRouteScroll(location.pathname, window.scrollY);
    };

    saveScrollPosition();
    window.addEventListener("scroll", saveScrollPosition, { passive: true });

    return () => {
      window.removeEventListener("scroll", saveScrollPosition);
      saveScrollPosition();
    };
  }, [location.pathname]);

  useLayoutEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    const previousPathname = previousPathnameRef.current;
    const pathnameChanged = previousPathname !== location.pathname;
    const routeState = (location.state as { restoreScroll?: boolean } | null) ?? null;
    const scrollSnapshotWindow = window as typeof window & {
      __instantNavScrollSnapshot?: { pathname: string; scrollY: number };
    };
    let restoreFrameId: number | null = null;

    if (
      pathnameChanged &&
      scrollSnapshotWindow.__instantNavScrollSnapshot?.pathname === previousPathname
    ) {
      scrollPositionsRef.current.set(previousPathname, scrollSnapshotWindow.__instantNavScrollSnapshot.scrollY);
      delete scrollSnapshotWindow.__instantNavScrollSnapshot;
    }

    previousPathnameRef.current = location.pathname;

    if (!pathnameChanged) {
      return undefined;
    }

    root.style.scrollBehavior = "auto";

    if (!location.hash) {
      if (routeState?.restoreScroll) {
        const snapshotScrollY = readStoredRouteScrollSnapshot(location.pathname);
        const savedScrollY =
          snapshotScrollY ??
          readStoredRouteScroll(location.pathname) ??
          scrollPositionsRef.current.get(location.pathname) ??
          0;
        window.scrollTo({ top: savedScrollY, left: 0, behavior: "auto" });
        if (snapshotScrollY !== null) {
          clearStoredRouteScrollSnapshot(location.pathname);
        }
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }

      restoreFrameId = window.requestAnimationFrame(() => {
        root.style.scrollBehavior = previousScrollBehavior;
      });

      return () => {
        if (restoreFrameId !== null) {
          window.cancelAnimationFrame(restoreFrameId);
        }
        root.style.scrollBehavior = previousScrollBehavior;
      };
    }

    const hashId = decodeURIComponent(location.hash.slice(1));
    const frameId = window.requestAnimationFrame(() => {
      const target = document.getElementById(hashId);
      if (target) {
        target.scrollIntoView({ block: "start", behavior: "auto" });
      }

      root.style.scrollBehavior = previousScrollBehavior;
    });

    return () => {
      if (restoreFrameId !== null) {
        window.cancelAnimationFrame(restoreFrameId);
      }
      window.cancelAnimationFrame(frameId);
      root.style.scrollBehavior = previousScrollBehavior;
    };
  }, [location.hash, location.pathname]);

  return null;
}

function SiteHeader({
  active,
  mobileTabs = [],
}: {
  active: "home" | "activation" | "detail";
  mobileTabs?: SiteHeaderMobileTab[];
}) {
  const headerRef = useRef<HTMLElement | null>(null);
  const location = useLocation();
  const hasMobileTabs = mobileTabs.length > 0;
  const [isSupportDialogOpen, setIsSupportDialogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [supportContacts, setSupportContacts] = useState<SupportContact[]>([]);
  const [supportContactLoadState, setSupportContactLoadState] = useState<SupportContactLoadState>("idle");

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header || typeof window === "undefined") {
      return;
    }

    const root = document.documentElement;
    const updateHeaderHeight = () => {
      const nextHeight = Math.ceil(header.getBoundingClientRect().height);
      root.style.setProperty("--site-header-height", `${nextHeight}px`);
    };

    updateHeaderHeight();

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            updateHeaderHeight();
          });
    resizeObserver?.observe(header);
    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.hash, location.pathname]);

  const openSupportDialog = () => {
    setIsMobileMenuOpen(false);
    setIsSupportDialogOpen(true);

    if (supportContactLoadState !== "idle") {
      return;
    }

    setSupportContactLoadState("loading");
    fetch(supportContactsAsset, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Support contacts asset is unavailable.");
        }

        return response.text();
      })
      .then((text) => {
        setSupportContacts(parseSupportContacts(text));
        setSupportContactLoadState("ready");
      })
      .catch(() => {
        setSupportContactLoadState("error");
      });
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={["home-header", "site-topbar", hasMobileTabs ? "has-mobile-tabs" : ""].filter(Boolean).join(" ")}
        aria-label="站点导航"
        ref={headerRef}
      >
        <Link className="home-brand" to="/">
          <span className="home-brand-mark" aria-hidden="true">
            <img src={homeAssistantMascot} alt="" />
          </span>
          <span className="home-brand-copy">
            <strong className="home-brand-title-desktop">OCR 识别接口文档中心</strong>
            <strong className="home-brand-title-mobile">OCR 识别接口文档中心</strong>
          </span>
        </Link>
        <nav aria-label="主导航" className="home-header-desktop-nav">
          {active === "home" ? (
            <a className="active" href="#home">
              首页
            </a>
          ) : (
            <Link state={{ restoreScroll: true }} to="/">
              首页
            </Link>
          )}
          <a
            className={["home-nav-directory", active === "detail" ? "active" : ""].filter(Boolean).join(" ")}
            href={active === "home" ? "#directory" : "/#directory"}
          >
            全部接口
          </a>
          <Link
            className={active === "activation" ? "active" : undefined}
            onMouseDown={() => captureInstantPathNavigationSnapshot()}
            onTouchStart={() => captureInstantPathNavigationSnapshot()}
            onClick={() => prepareInstantPathNavigation()}
            to="/activation-guide"
          >
            开通流程指引
          </Link>
          <a href="/interface-custom-guide/">接口定制指引</a>
        </nav>
        <button
          aria-expanded={isSupportDialogOpen}
          aria-haspopup="dialog"
          className="home-support"
          onClick={openSupportDialog}
          type="button"
        >
          <BookOpen size={17} />
          联系支持
        </button>
        <button
          aria-expanded={isMobileMenuOpen}
          aria-haspopup="menu"
          aria-label={isMobileMenuOpen ? "关闭菜单" : "打开菜单"}
          className="mobile-header-menu-button"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
          type="button"
        >
          {isMobileMenuOpen ? <X size={18} /> : <span aria-hidden="true">☰</span>}
        </button>
        {hasMobileTabs ? (
          <nav className="mobile-header-tabs" aria-label="页面快捷导航">
            {mobileTabs.map((tab) => (
              <a
                className={tab.isActive ? "active" : undefined}
                href={tab.href}
                key={tab.id}
                onClick={() => tab.onClick?.()}
              >
                {tab.label}
              </a>
            ))}
          </nav>
        ) : null}
        {isMobileMenuOpen ? (
          <>
            <button
              aria-label="关闭菜单"
              className="mobile-header-menu-backdrop"
              onClick={closeMobileMenu}
              type="button"
            />
            <div aria-label="站点菜单" className="mobile-header-menu-panel" role="menu">
              {active === "home" ? (
                <a className="mobile-header-menu-item active" href="#home" onClick={closeMobileMenu} role="menuitem">
                  首页
                </a>
              ) : (
                <Link className="mobile-header-menu-item" onClick={closeMobileMenu} role="menuitem" to="/">
                  首页
                </Link>
              )}
              {active === "activation" ? (
                <a
                  className="mobile-header-menu-item active"
                  href="#overview"
                  onClick={closeMobileMenu}
                  role="menuitem"
                >
                  开通流程
                </a>
              ) : (
                <Link
                  className="mobile-header-menu-item"
                  onClick={() => {
                    closeMobileMenu();
                    prepareInstantPathNavigation();
                  }}
                  onMouseDown={() => captureInstantPathNavigationSnapshot()}
                  onTouchStart={() => captureInstantPathNavigationSnapshot()}
                  role="menuitem"
                  to="/activation-guide#overview"
                >
                  开通流程
                </Link>
              )}
              <a className="mobile-header-menu-item" href="/interface-custom-guide/" onClick={closeMobileMenu} role="menuitem">
                接口定制指引
              </a>
              <button className="mobile-header-menu-item" onClick={openSupportDialog} role="menuitem" type="button">
                联系支持
              </button>
            </div>
          </>
        ) : null}
      </header>
      {isSupportDialogOpen ? (
        <SupportContactDialog
          contacts={supportContacts}
          loadState={supportContactLoadState}
          onClose={() => setIsSupportDialogOpen(false)}
        />
      ) : null}
    </>
  );
}

function SupportContactDialog({
  contacts,
  loadState,
  onClose,
}: {
  contacts: SupportContact[];
  loadState: SupportContactLoadState;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="support-dialog-backdrop" onClick={onClose}>
      <section
        aria-labelledby="support-dialog-title"
        aria-modal="true"
        className="support-dialog"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <span className="support-dialog-tape" aria-hidden="true" />
        <header>
          <div>
            <h2 id="support-dialog-title">联系支持</h2>
            <p>根据问题类型选择对应支持人。</p>
          </div>
          <button
            aria-label="关闭联系支持信息框"
            autoFocus
            className="support-dialog-close"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </header>
        <div className="support-dialog-body">
          {loadState === "loading" || loadState === "idle" ? (
            <p className="support-dialog-note">正在读取支持信息...</p>
          ) : null}
          {loadState === "error" ? <p className="support-dialog-note">支持信息读取失败，请稍后再试。</p> : null}
          {loadState === "ready" && contacts.length ? (
            <div className="support-contact-list">
              {contacts.map((contact) => (
                <article className="support-contact-row" key={`${contact.label}-${contact.name}`}>
                  <div>
                    <span className="support-contact-label">{contact.label}</span>
                    <strong>{contact.name}</strong>
                    <em>{contact.department}</em>
                  </div>
                  <span className="support-contact-phone">{contact.phone}</span>
                </article>
              ))}
            </div>
          ) : null}
          {loadState === "ready" && !contacts.length ? <p className="support-dialog-note">暂无支持信息。</p> : null}
        </div>
      </section>
    </div>
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

  const categorizedRecords = useMemo<HomeDirectoryGroupData[]>(
    () => {
      return categories
        .map((category) => {
          const items = interfaceCatalog.filter((item) => item.category === category);
          return {
            category,
            items,
            count: items.length,
          };
        })
        .filter((group) => group.count > 0);
    },
    [],
  );
  const categoryStats = categorizedRecords;
  const recordsForBoard = filtered;
  const directoryGroups = categorizedRecords;

  return (
    <main className="home-page">
      <div className="home-board">
        <SiteHeader active="home" />

        <section className="home-hero" id="home">
          <div className="home-hero-binders" aria-hidden="true">
            <img className="home-hero-binder home-hero-binder-top" src={homeHeroBinderTopAsset} alt="" />
            <img className="home-hero-binder home-hero-binder-bottom" src={homeHeroBinderBottomAsset} alt="" />
          </div>

          <div className="home-catalogue-paper">
            <div className="home-eyebrow">
              <Sparkles size={16} />
              研究院产品文档中心
            </div>
            <h1>OCR 接口图鉴</h1>
            <p>接口换种读法，让开发者也能拥有高颜值、易查阅的文档</p>
            <div className="home-search-row">
              <HomeSearchField query={query} setQuery={setQuery} />
            </div>
          </div>

          <div className="home-specimen-rail" aria-label="已收录接口样张陈列">
            <span className="home-paperclip" aria-hidden="true" />
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
                  style={getCategoryToneStyle(item.category)}
                  type="button"
                >
                  {categoryIcons[item.category]}
                  <span>{item.category}</span>
                  <strong>{item.count}</strong>
                </button>
              ))}
            </div>
          </aside>

          <section className="home-record-paper" aria-label="OCR 接口档案">
            <div className="home-record-surface">
              <div className="home-record-head">
                <div className="home-record-heading">
                  <div aria-label="接口图鉴" className="home-record-tab" role="img">
                    <img src={homeRecordTabAsset} alt="" aria-hidden="true" />
                  </div>
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
            </div>
          </section>
        </section>

        <div className="home-specimen-rail home-specimen-rail-mobile" aria-label="已收录接口样张陈列（移动端）">
          <span className="home-paperclip" aria-hidden="true" />
          {heroSpecimens.map((specimen, index) => (
            <HomeSpecimenCard index={index} key={`mobile-${specimen.code}`} specimen={specimen} />
          ))}
        </div>

        <section className="home-directory-paper" id="directory" aria-label="全部接口总目录">
          <div className="home-record-head">
            <div className="home-directory-heading">
              <span>FULL INDEX</span>
              <h2>全部接口</h2>
              <p>按分类归档，可直接进入单个接口文档。</p>
            </div>
            <em>{interfaceCatalog.length} 项</em>
          </div>
          <div className="home-directory-grid">
            {directoryGroups.map((group) => (
              <HomeDirectoryGroup group={group} key={group.category} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function HomeSearchField({
  className,
  query,
  setQuery,
}: {
  className?: string;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <label className={className ? `home-search ${className}` : "home-search"}>
      <Search size={21} />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="搜接口名 / 字段 / 类别"
      />
    </label>
  );
}

function HomeSpecimenCard({
  index,
  specimen,
}: {
  index: number;
  specimen: (typeof heroSpecimens)[number];
}) {
  const detailHref = `/interfaces/${specimen.slug}`;
  const navigationIntentHandlers = {
    onMouseDown: () => captureInstantPathNavigationSnapshot(),
    onTouchStart: () => captureInstantPathNavigationSnapshot(),
    onClick: () => prepareInstantPathNavigation(),
  };

  return (
    <Link
      aria-label={`查看${specimen.title}接口文档`}
      className={`home-specimen-card ${specimen.tone}`}
      style={{ "--rotate": specimen.rotate } as React.CSSProperties}
      to={detailHref}
      {...navigationIntentHandlers}
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
    </Link>
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
      {imageSrc ? (
        <img className="home-doc-photo" src={imageSrc} alt="" loading="lazy" />
      ) : (
        <>
          {kind === "bankcard" ? <BankcardSpecimen /> : null}
          {kind === "textDocument" ? <TextDocumentSpecimen /> : null}
          {kind === "vehicleDocument" ? <VehicleDocumentSpecimen /> : null}
          {kind === "ticket" ? <TicketSpecimen /> : null}
          {kind === "genericDocument" ? <GenericHomeSpecimen title={title} /> : null}
        </>
      )}
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

function HomeRecordCard({ item }: { item: InterfaceCard }) {
  const imageSrc = getThumbnailSrc(item);
  const detailHref = `/interfaces/${item.slug}`;
  const navigationIntentHandlers = {
    onMouseDown: () => captureInstantPathNavigationSnapshot(),
    onTouchStart: () => captureInstantPathNavigationSnapshot(),
    onClick: () => prepareInstantPathNavigation(),
  };

  return (
    <article className="home-record-card" style={getCategoryToneStyle(item.category)}>
      <Link
        aria-label={`查看${item.title}接口文档缩略图`}
        className="home-record-thumb-link"
        to={detailHref}
        {...navigationIntentHandlers}
      >
        <figure className="home-record-thumb">
          <img src={imageSrc} alt={`${item.title}虚构示意缩略图`} loading="lazy" />
        </figure>
      </Link>
      <div className="home-record-content">
        <div className="home-record-meta">
          <span>{item.category}</span>
          <code>{getRecordId(item)}</code>
        </div>
        <h3>
          <Link className="home-record-title-link" to={detailHref} {...navigationIntentHandlers}>
            {item.title}
          </Link>
        </h3>
        <p>{item.summary}</p>
        <div className="home-field-chips">
          {item.previewFields.slice(0, 3).map((field) => (
            <span key={field}>{field}</span>
          ))}
          {item.previewFields.length > 3 ? <span>...</span> : null}
        </div>
        <div className="home-record-footer">
          <Link className="home-record-cta" to={detailHref} {...navigationIntentHandlers}>
            查看详情
            <span aria-hidden="true">›</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

function HomeDirectoryGroup({ group }: { group: HomeDirectoryGroupData }) {
  return (
    <section className="home-directory-group" style={getCategoryToneStyle(group.category)}>
      <header className="home-directory-group-head">
        <div>
          <span>{group.category}</span>
          <p>{categoryDescriptions[group.category]}</p>
        </div>
        <strong>{group.count} 项接口</strong>
      </header>
      <div className="home-directory-links">
        {group.items.map((item) => (
          <Link
            aria-label={`查看${item.title}接口文档`}
            className="home-directory-link"
            key={item.slug}
            onMouseDown={() => captureInstantPathNavigationSnapshot()}
            onTouchStart={() => captureInstantPathNavigationSnapshot()}
            onClick={() => prepareInstantPathNavigation()}
            data-slug={item.slug}
            to={`/interfaces/${item.slug}`}
          >
            <span>{item.title}</span>
            <i aria-hidden="true">›</i>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ActivationGuidePage() {
  const [activePreview, setActivePreview] = useState<{
    src: string;
    title: string;
    caption: string;
  } | null>(null);

  useEffect(() => {
    if (!activePreview) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActivePreview(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePreview]);

  useEffect(() => {
    if (!activePreview) {
      return undefined;
    }

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [activePreview]);

      return (
    <main className="activation-page">
      <div className="activation-board">
        <div className="activation-hero-binders" aria-hidden="true">
          <img className="activation-hero-binder activation-hero-binder-top" src={homeHeroBinderTopAsset} alt="" />
          <img
            className="activation-hero-binder activation-hero-binder-bottom"
            src={homeHeroBinderBottomAsset}
            alt=""
          />
        </div>

        <SiteHeader active="activation" />

        <section className="activation-intro" id="overview">
          <div className="activation-intro-paper-shell">
            <div className="activation-intro-paper">
              <h1>银商大脑 OCR 开通流程</h1>
              <p>
                开通 OCR 需完成两步：先在 UP 系统申请开放平台参数，再到项目管理中心提交开发需求并上传 OCR 能力申请表。
              </p>
              <div className="activation-path">
                {activationProcesses.map((process, index) => (
                  <a className="activation-path-item" href={`#${process.id}`} key={process.id}>
                    <span className="activation-path-badge">
                      <i aria-hidden="true" className="activation-path-badge-icon">
                        {getActivationProcessIcon(process.icon)}
                      </i>
                      <b className="activation-path-badge-label">{process.label}</b>
                    </span>
                    <div className="activation-path-copy">
                      <strong>{process.pathTitle}</strong>
                      <p>{index === 0 ? "申请 APPID / APPKEY" : "提交开发需求并补齐附件"}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="activation-workbench">
          <aside className="activation-index-paper" aria-label="流程索引">
            <div className="activation-index-desktop">
              <div className="activation-panel-title">
                <h2>流程索引</h2>
                <span>PROCESS INDEX</span>
              </div>
              <nav>
                {activationProcesses.map((process) => (
                  <a href={`#${process.id}`} key={process.id}>
                    <span>{process.label}</span>
                    <strong>{process.title}</strong>
                    <em>{process.steps.length} 步</em>
                  </a>
                ))}
              </nav>
            </div>
            <details className="activation-index-mobile">
              <summary>
                <div>
                  <strong>流程索引</strong>
                  <span>{activationProcesses.length} 条主流程</span>
                </div>
                <b>展开</b>
              </summary>
              <nav>
                {activationProcesses.map((process) => (
                  <a href={`#${process.id}`} key={`mobile-${process.id}`}>
                    <span>{process.label}</span>
                    <strong>{process.pathTitle}</strong>
                    <em>{process.steps.length} 步</em>
                  </a>
                ))}
              </nav>
            </details>
          </aside>

          <div className="activation-stack">
            {activationProcesses.map((process) => (
              <ActivationProcessBlock
                key={process.id}
                onPreview={setActivePreview}
                process={process}
              />
            ))}
          </div>
        </div>
      </div>
      {activePreview ? (
        <ActivationImageLightbox image={activePreview} onClose={() => setActivePreview(null)} />
      ) : null}
    </main>
  );
}

function ActivationProcessBlock({
  onPreview,
  process,
}: {
  onPreview: (image: { src: string; title: string; caption: string }) => void;
  process: (typeof activationProcesses)[number];
}) {
  return (
    <section className="activation-section" id={process.id}>
      <ActivationProcessHeading
        mobileTitle={process.mobilePathTitle}
        summary={process.summary}
        title={process.title}
      />

      <div className="activation-step-stack">
        {process.steps.map((step, stepIndex) => {
          const stepNo = String(stepIndex + 1).padStart(2, "0");

          return (
            <article className={step.shot ? "activation-step-card has-shot" : "activation-step-card"} key={step.text}>
              <div className="activation-step-copy">
                <span>{stepNo}</span>
                <div className="activation-step-copy-body">
                  <strong>
                    <i aria-hidden="true">{getActivationStepIcon(step.icon)}</i>
                    <b>{step.text}</b>
                  </strong>
                  {step.note ? <p>{step.note}</p> : null}
                </div>
              </div>
              {step.shot ? (
                <ActivationEvidenceFigure
                  caption={step.note ?? ""}
                  onPreview={onPreview}
                  src={step.shot.src}
                  title={step.text}
                  variant={step.shot.variant}
                />
              ) : null}
              {step.attachment ? <ActivationAttachmentCard attachment={step.attachment} /> : null}
            </article>
          );
        })}
        <div className="activation-outcome">
          <strong>
            <CheckCircle2 aria-hidden="true" size={16} />
            <span>完成结果</span>
          </strong>
          <p>{process.outcome}</p>
        </div>
      </div>
    </section>
  );
}

function ActivationProcessHeading({
  mobileTitle,
  title,
  summary,
}: {
  mobileTitle: string;
  title: string;
  summary: string;
}) {
  return (
    <div className="activation-process-heading">
      <h2>
        <span className="activation-title-desktop">{title}</span>
        <span className="activation-title-mobile">{mobileTitle}</span>
      </h2>
      <p>{summary}</p>
    </div>
  );
}

function ActivationAttachmentCard({
  attachment,
}: {
  attachment: NonNullable<(typeof activationProcesses)[number]["steps"][number]["attachment"]>;
}) {
  return (
    <div className="activation-attachment">
      <div className="activation-attachment-copy">
        <strong>
          <Paperclip aria-hidden="true" size={15} />
          <span>{attachment.title}</span>
        </strong>
        <p>{attachment.summary}</p>
        <em>{attachment.fileName}</em>
      </div>
      {attachment.href ? (
        <a download href={attachment.href}>
          <Download size={16} />
          下载申请表
        </a>
      ) : (
        <button disabled type="button">
          申请表待上传
        </button>
      )}
    </div>
  );
}

function ActivationEvidenceFigure({
  src,
  title,
  caption,
  onPreview,
  variant = "wide",
}: {
  src: string;
  title: string;
  caption: string;
  onPreview: (image: { src: string; title: string; caption: string }) => void;
  variant?: "wide" | "portrait";
}) {
  return (
    <figure className={`activation-evidence ${variant}`}>
      <button
        aria-label={`查看大图：${title}`}
        className="activation-shot-frame"
        onClick={() => onPreview({ caption, src, title })}
        type="button"
      >
        <img alt={title} loading="lazy" src={src} />
        <span>
          <Expand size={16} />
          查看大图
        </span>
      </button>
    </figure>
  );
}

function ActivationImageLightbox({
  image,
  onClose,
}: {
  image: { src: string; title: string; caption: string };
  onClose: () => void;
}) {
  return (
    <div
      aria-label="截图大图预览"
      aria-modal="true"
      className="activation-lightbox"
      onClick={onClose}
      role="dialog"
    >
      <div className="activation-lightbox-panel" onClick={(event) => event.stopPropagation()}>
        <header>
          <div>
            <strong>{image.title}</strong>
            {image.caption ? <p>{image.caption}</p> : null}
          </div>
          <button onClick={onClose} type="button">
            关闭
          </button>
        </header>
        <div>
          <img alt={image.title} src={image.src} />
        </div>
      </div>
    </div>
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
  个人身份类: ["实名开户注册", "身份信息核验", "客户资料归档"],
  账户金融类: ["账户开户核验", "银行卡信息采集", "银行资料归档"],
  企业资质类: ["商户入网", "经营资质审核", "主体信息归档"],
  财税报销类: ["财务报销", "票据归档", "交易凭证审核"],
  出行票证类: ["出行票证核验", "差旅单据归档", "交通费用核算"],
  贸易关务类: ["关务申报", "贸易单证归档", "跨境业务核验"],
  车辆档案类: ["车辆资料采集", "交通票据归档", "资产与补贴审核"],
  通用文字类: ["文本归档", "非标版式识别", "人工录入替代"],
  不动产类: ["权属资料采集", "凭证信息归档", "业务材料核验"],
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
  票据类型: "BillType",
  票据号码: "BillNo",
  商户名称: "MerchantName",
  交易时间: "TransactionTime",
  金额: "Amount",
  流水号: "TraceNo",
  签名区域: "SignatureArea",
  签名结果: "SignatureResult",
  置信度: "Score",
  纳税人名称: "TaxpayerName",
  税款所属期: "TaxPeriod",
  税种: "TaxType",
  实缴金额: "PaidAmount",
  申请单号: "ApplicationNo",
  旅客姓名: "PassengerName",
  商品金额: "GoodsAmount",
  退税金额: "RefundAmount",
  报关单号: "CustomsDeclarationNo",
  经营单位: "BusinessEntity",
  运输方式: "TransportMode",
  申报日期: "DeclarationDate",
  统一社会信用代码: "CreditCode",
  企业名称: "EnterpriseName",
  法人: "LegalPerson",
  经营范围: "BusinessScope",
  单位名称: "InstitutionName",
  法定代表人: "LegalRepresentative",
  印章文本: "SealText",
  印章类型: "SealType",
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
  账户名称: "AccountName",
  开户银行: "BankName",
  账号: "AccountNo",
  中文姓名: "ChineseName",
  英文姓名: "EnglishName",
  证件号码: "CertificateNo",
  组织机构代码: "OrganizationCode",
  机构名称: "OrganizationName",
  许可证号: "LicenseNo",
  出口商: "Exporter",
  商品名称: "GoodsName",
  合格证编号: "CertificateNo",
  车辆型号: "VehicleModel",
  车架号: "VIN",
  整车编码: "VehicleCode",
  生产日期: "ProductionDate",
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
  文本内容: "TextContent",
  文本行: "TextLine",
  手写文本: "HandwritingText",
  坐标: "Position",
  条码内容: "BarcodeContent",
  条码类型: "BarcodeType",
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
    endpoints: getEndpointInfoBySlug(card.slug),
    requestGroups: commonRequestGroups,
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
    relatedSlugs: interfaceCatalog
      .filter((item) => item.category === card.category && item.slug !== card.slug)
      .slice(0, 4)
      .map((item) => item.slug),
  };
}

function DocDetail({ doc }: { doc: OcrInterfaceDoc }) {
  const allSpecificFields = doc.fieldGroups.flatMap((group) => group.fields);
  const card = getCardBySlug(doc.slug);
  const coreResponseFields = allSpecificFields
    .filter((field) => field.tags.includes("业务核心"))
    .slice(0, 6);
  const quickResponseFields = coreResponseFields.length ? coreResponseFields : allSpecificFields.slice(0, 4);
  const [activeSectionId, setActiveSectionId] = useState<DetailAnchor["id"]>(() => {
    if (typeof window === "undefined") {
      return "request";
    }

    return parseActiveDetailSectionFromHash(window.location.hash) ?? "request";
  });
  const mobileHeaderTabs = detailQuickActions.map((action) => ({
    id: action.id,
    href: `#${action.id}`,
    label: action.mobileTabLabel,
    isActive: activeSectionId === action.id,
    onClick: () => setActiveSectionId(action.id),
  }));

  const responseCommonGroups = doc.response.commonGroups.map((group, index) => ({
    ...group,
    anchorId: `response-common-${index}`,
  }));
  const responseBusinessGroups = doc.fieldGroups.map((group, index) => ({
    ...group,
    anchorId: `response-business-${index}`,
  }));
  const responseSectionAnchors: DetailSubAnchor[] = [
    { id: "response-common-root", label: "统一结构", kind: "section" },
    ...responseCommonGroups.map((group) => ({
      id: group.anchorId,
      label: group.title,
      kind: "group" as const,
    })),
    { id: "response-business-root", label: "业务字段", kind: "section" },
    ...responseBusinessGroups.map((group) => ({
      id: group.anchorId,
      label: group.title,
      kind: "group" as const,
    })),
  ];
  const [activeResponseSubAnchorId, setActiveResponseSubAnchorId] = useState<string>("response-common-root");
  const isResponseNavExpanded = activeSectionId === "response";
  const endpointRows = [
    doc.endpoints.testUrl ? { label: "测试环境", url: doc.endpoints.testUrl } : null,
    { label: "生产环境", url: doc.endpoints.prodUrl },
  ].filter((item): item is { label: string; url: string } => item !== null);

  useEffect(() => {
    const sections = detailNavAnchors
      .map((anchor) => document.getElementById(anchor.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!sections.length) {
      return;
    }

    const rootStyles = window.getComputedStyle(document.documentElement);
    const headerHeight = Number.parseInt(rootStyles.getPropertyValue("--site-header-height"), 10) || 0;

    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => Math.abs(left.boundingClientRect.top) - Math.abs(right.boundingClientRect.top))[0];

        if (activeEntry?.target.id) {
          setActiveSectionId(activeEntry.target.id as DetailAnchor["id"]);
        }
      },
      {
        rootMargin: `-${headerHeight + 24}px 0px -55% 0px`,
        threshold: [0.15, 0.35, 0.6],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [doc.slug]);

  useEffect(() => {
    const sections = responseSectionAnchors
      .map((anchor) => document.getElementById(anchor.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!sections.length) {
      return;
    }

    const rootStyles = window.getComputedStyle(document.documentElement);
    const headerHeight = Number.parseInt(rootStyles.getPropertyValue("--site-header-height"), 10) || 0;

    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => Math.abs(left.boundingClientRect.top) - Math.abs(right.boundingClientRect.top))[0];

        if (activeEntry?.target.id) {
          setActiveResponseSubAnchorId(activeEntry.target.id);
        }
      },
      {
        rootMargin: `-${headerHeight + 52}px 0px -58% 0px`,
        threshold: [0.08, 0.2, 0.4],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [doc.slug, responseSectionAnchors]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const syncActiveSectionFromHash = () => {
      const parsed = parseActiveDetailSectionFromHash(window.location.hash);
      if (parsed) {
        setActiveSectionId(parsed);
      }
    };

    window.addEventListener("hashchange", syncActiveSectionFromHash);

    return () => window.removeEventListener("hashchange", syncActiveSectionFromHash);
  }, []);

  const renderDetailNavigation = () => (
    <nav aria-label="页面目录">
      {detailAnchorGroups.map((group) => (
        <section className="side-nav-group" key={group.title}>
          <strong>{group.title}</strong>
          <div>
            {group.anchors.map((anchor) => (
              <div className="side-nav-item-stack" key={anchor.id}>
                <a
                  className={[
                    anchor.tone,
                    activeSectionId === anchor.id ? "active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  href={`#${anchor.id}`}
                  onClick={() => setActiveSectionId(anchor.id)}
                >
                  {anchor.label}
                </a>
                {anchor.id === "response" && isResponseNavExpanded ? (
                  <div className="side-nav-sublist" aria-label="返回参数小节">
                    {responseSectionAnchors.map((subAnchor) => (
                      <a
                        className={[
                          subAnchor.kind,
                          activeResponseSubAnchorId === subAnchor.id ? "active" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        href={`#${subAnchor.id}`}
                        key={subAnchor.id}
                        onClick={() => setActiveSectionId("response")}
                      >
                        <span />
                        {subAnchor.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ))}
    </nav>
  );

  return (
    <main className="detail-page">
      <div className="detail-board">
        <SiteHeader active="detail" mobileTabs={mobileHeaderTabs} />

        <div className="detail-main">
          <aside className="side-nav" aria-label="页面目录">
            <Link className="back-link" state={{ restoreScroll: true }} to="/">
              <ArrowLeft size={18} />
              返回
            </Link>
            {renderDetailNavigation()}
          </aside>

          <article className="doc-content">
            <section className="detail-hero">
              <div className="detail-hero-head">
                <div className="detail-hero-copy">
                  <span className="category-pill detail-hero-category">{doc.category}</span>
                  <h1>{doc.title}</h1>
                  <p>{doc.summary}</p>
                  <div className="hero-field-strip" aria-label="核心返回字段">
                    {quickResponseFields.slice(0, 5).map((field) => (
                      <span key={field.key}>{field.label}</span>
                    ))}
                  </div>
                </div>
                {card ? (
                  <div className="detail-hero-thumb">
                    <VisualThumb item={card} variant="detail" />
                  </div>
                ) : null}
              </div>

              <div className="hero-entry-points">
                {endpointRows.map((item) => (
                  <EndpointRow key={item.label} label={item.label} url={item.url} />
                ))}
              </div>

              <div className="hero-quick-actions" aria-label="快速入口">
                {detailQuickActions.map((action) => (
                  <a href={`#${action.id}`} key={action.id}>
                    {action.label}
                  </a>
                ))}
              </div>

              <div className="hero-support-strip" aria-label="接入约定">
                <div className="hero-meta-strip">
                  <span>{doc.endpoints.method}</span>
                  <span>{doc.endpoints.contentType}</span>
                  <span>{doc.endpoints.authType}</span>
                  <span>{doc.response.path?.join(" → ") ?? "FieldList"}</span>
                </div>
                {doc.sourcePdf ? <HeroAssetActions asset={doc.sourcePdf} /> : null}
              </div>
            </section>

            <section className="section-block" id="request">
              <SectionTitle
                icon={<Braces size={20} />}
                title="请求参数"
                subtitle="先看请求骨架，再按 Header 与 Body 字段逐项填写。"
              />
              <RequestSkeleton doc={doc} />
              <div className="field-group-stack">
                {doc.requestGroups.map((group) => (
                  <FieldGroupBlock group={group} key={group.title} />
                ))}
              </div>
            </section>

            <section className="section-block" id="response">
              <SectionTitle
                icon={<Layers3 size={20} />}
                title="返回参数"
                subtitle="先看统一返回结构路径，再看本接口专属业务字段。"
              />
              {doc.response.path?.length ? (
                <div className="response-path">
                  {doc.response.path.map((segment, index) => (
                    <span className="response-path-segment" key={`${segment}-${index}`}>
                      {index > 0 ? <span>→</span> : null}
                      <code>{segment}</code>
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="response-index" aria-label="返回参数分组索引">
                <section className="response-index-group">
                  <strong>统一结构</strong>
                  <div>
                    {responseCommonGroups.map((group) => (
                      <a href={`#${group.anchorId}`} key={group.anchorId}>
                        {group.title}
                      </a>
                    ))}
                  </div>
                </section>
                <section className="response-index-group">
                  <strong>业务字段</strong>
                  <div>
                    {responseBusinessGroups.map((group) => (
                      <a href={`#${group.anchorId}`} key={group.anchorId}>
                        {group.title}
                      </a>
                    ))}
                  </div>
                </section>
              </div>
              <div className="response-layout">
                <section className="response-section" id="response-common-root">
                  <div className="response-section-head">
                    <strong>统一结构</strong>
                    <p>所有结构化 OCR 接口共用的返回容器、FieldList 路径和辅助字段。</p>
                  </div>
                  <div className="response-note">{doc.response.overview}</div>
                  <div className="response-stack">
                    {responseCommonGroups.map((group) => (
                      <FieldGroupBlock anchorId={group.anchorId} group={group} key={group.anchorId} />
                    ))}
                  </div>
                </section>
                <section className="response-section" id="response-business-root">
                  <div className="response-section-head">
                    <strong>业务字段</strong>
                    <p>当前接口真正需要读取的业务结果字段，按票面或证件结构分组展开。</p>
                  </div>
                  <div className="response-stack">
                    {responseBusinessGroups.map((group) => (
                      <FieldGroupBlock anchorId={group.anchorId} group={group} key={group.anchorId} />
                    ))}
                  </div>
                </section>
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

            <section className="section-block" id="examples">
              <SectionTitle
                icon={<Network size={20} />}
                title="请求 / 返回示例"
                subtitle="用脱敏占位结构快速拼出调用报文和结果读取路径。"
              />
              <ExampleSection doc={doc} />
            </section>
          </article>
        </div>
      </div>
    </main>
  );
}

function RequestSkeleton({ doc }: { doc: OcrInterfaceDoc }) {
  const requestExample = buildRequestExample(doc);
  const headerExample = JSON.stringify(requestExample.header, null, 2);
  const bodyExample = JSON.stringify(requestExample.body, null, 2);
  const headerSummary = buildObjectSummaryRows(requestExample.header);
  const bodySummary = buildObjectSummaryRows(requestExample.body);

  return (
    <div className="request-skeleton">
      <section className="request-skeleton-block">
        <div className="request-skeleton-head">
          <strong>Header</strong>
          <CopyTextButton text={headerExample} />
        </div>
        <CodeSummaryRows items={headerSummary} />
        <pre>
          <code>{headerExample}</code>
        </pre>
      </section>
      <section className="request-skeleton-block">
        <div className="request-skeleton-head">
          <strong>Body</strong>
          <CopyTextButton text={bodyExample} />
        </div>
        <CodeSummaryRows items={bodySummary} />
        <pre>
          <code>{bodyExample}</code>
        </pre>
      </section>
    </div>
  );
}

function HeroAssetActions({ asset }: { asset: DownloadAsset }) {
  return (
    <div className="hero-asset-actions">
      <a download={asset.fileName} href={asset.href} title={`下载 ${asset.title}`}>
        <Download size={16} />
        下载本接口 PDF
      </a>
    </div>
  );
}

function EndpointRow({
  label,
  url,
}: {
  label: string;
  url: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="endpoint-row">
      <div className="endpoint-row-head">
        <span>{label}</span>
      </div>
      <button onClick={handleCopy} type="button">
        <Copy size={15} />
        {copied ? "已复制" : "复制"}
      </button>
      <code>{url}</code>
    </div>
  );
}

function ExampleSection({ doc }: { doc: OcrInterfaceDoc }) {
  const requestPayload = buildRequestExample(doc);
  const responsePayload = buildResponseExample(doc);
  const requestExample = JSON.stringify(requestPayload, null, 2);
  const responseExample = JSON.stringify(responsePayload, null, 2);
  const responseStatus =
    isPlainRecord(responsePayload) && "errCode" in responsePayload ? responsePayload.errCode : "0000";
  const responseCoreFields = doc.fieldGroups
    .flatMap((group) => group.fields)
    .filter((field) => field.tags.includes("业务核心"))
    .slice(0, 4)
    .map((field) => field.label)
    .join(" / ");

  return (
    <div className="example-layout">
      <ExampleCodeCard
        title="请求示例"
        description="按 Header 与 Body 的真实边界组织最小调用报文。"
        code={requestExample}
        summaryItems={[
          { label: "Header", value: describeSummaryValue(requestPayload.header) },
          { label: "Body", value: describeSummaryValue(requestPayload.body) },
        ]}
      />
      <ExampleCodeCard
        title="返回示例"
        description="示例只保留读取到 FieldList 的最小路径和核心字段。"
        code={responseExample}
        summaryItems={[
          { label: "状态", value: describeSummaryValue(responseStatus) },
          { label: "读取路径", value: doc.response.path?.join(" > ") ?? "FieldList" },
          { label: "核心字段", value: responseCoreFields || "FieldList" },
        ]}
      />
    </div>
  );
}

function ExampleCodeCard({
  title,
  description,
  code,
  summaryItems = [],
}: {
  title: string;
  description: string;
  code: string;
  summaryItems?: CodeSummaryItem[];
}) {
  return (
    <section className="example-card">
      <header>
        <div>
          <strong>{title}</strong>
          <p>{description}</p>
        </div>
        <CopyTextButton text={code} />
      </header>
      <CodeSummaryRows className="example-summary-list" items={summaryItems} />
      <div className="example-raw-head">
        <span>原始 JSON</span>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </section>
  );
}

type CodeSummaryItem = {
  label: string;
  value: string;
};

function CodeSummaryRows({
  className = "mobile-code-summary",
  items,
}: {
  className?: string;
  items: CodeSummaryItem[];
}) {
  if (!items.length) {
    return null;
  }

  return (
    <dl className={className}>
      {items.map((item) => (
        <div key={`${item.label}-${item.value}`}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function buildObjectSummaryRows(value: unknown) {
  if (!isPlainRecord(value)) {
    return [{ label: "内容", value: describeSummaryValue(value) }];
  }

  return Object.entries(value)
    .slice(0, 4)
    .map(([key, item]) => ({
      label: key,
      value: describeSummaryValue(item),
    }));
}

function describeSummaryValue(value: unknown): string {
  if (Array.isArray(value)) {
    return `${value.length} 项列表`;
  }

  if (isPlainRecord(value)) {
    const keys = Object.keys(value).slice(0, 4);
    return keys.length ? keys.join(" / ") : "对象";
  }

  if (value === null || value === undefined) {
    return "-";
  }

  return String(value);
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function CopyTextButton({
  text,
  idleLabel = "复制",
  copiedLabel = "已复制",
}: {
  text: string;
  idleLabel?: string;
  copiedLabel?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button className="copy-action-button" onClick={handleCopy} type="button">
      <Copy size={15} />
      {copied ? copiedLabel : idleLabel}
    </button>
  );
}

function buildRequestExample(doc: OcrInterfaceDoc) {
  if (doc.requestExample) {
    return doc.requestExample;
  }

  return {
    header: {
      Authorization: "Bearer <your-signature>",
      "Content-Type": doc.endpoints.contentType,
    },
    body: {
      data: {
        requestID: "demo-request-20260601-0001",
        picBase64: "<base64-image-payload>",
      },
    },
  };
}

function buildResponseExample(doc: OcrInterfaceDoc) {
  if (doc.responseExample) {
    return doc.responseExample;
  }

  const coreFields = doc.fieldGroups
    .flatMap((group) => group.fields)
    .filter((field) => field.tags.includes("业务核心"))
    .slice(0, 5)
    .map((field) => ({
      key: field.key,
      chn_key: field.label,
      value: getExampleValue(field),
      score: 99.1,
    }));

  return {
    errCode: "0000",
    errInfo: "success",
    data: {
      Result: [
        {
          ResultList: [
            {
              FieldList: coreFields,
            },
          ],
        },
      ],
    },
  };
}

function getExampleValue(field: FieldDef) {
  if (field.formatHint?.includes("YYYY")) {
    return field.formatHint;
  }

  if (field.tags.includes("枚举")) {
    return "<enum>";
  }

  if (field.label.includes("金额") || field.label.includes("税额") || field.label.includes("价格")) {
    return "100.00";
  }

  if (field.label.includes("号码") || field.label.includes("编号") || field.label.includes("识别号")) {
    return "<sample-id>";
  }

  return `<${field.label}>`;
}

function FieldGroupBlock({
  anchorId,
  group,
}: {
  anchorId?: string;
  group: { title: string; description: string; fields: FieldDef[] };
}) {
  return (
    <section className="field-group" id={anchorId}>
      <div className="field-group-head">
        <div>
          <h3>{group.title}</h3>
          <p>{group.description}</p>
        </div>
        <span>{group.fields.length} 字段</span>
      </div>
      <FieldTable fields={group.fields} compact />
    </section>
  );
}

function FieldTable({ fields, compact }: { fields: FieldDef[]; compact: boolean }) {
  return (
    <>
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
      <div className={`field-card-list ${compact ? "compact" : ""}`}>
        {fields.map((field) => (
          <article className="field-card" key={`card-${field.key}`}>
            <div className="field-card-head">
              <div className="field-card-title">
                <strong>{field.label}</strong>
                <code>{field.key}</code>
              </div>
              <span>{field.type}</span>
            </div>
            <TagRow field={field} />
            <div className="field-card-body">
              <p>{field.description}</p>
              {field.formatHint ? <em>{field.formatHint}</em> : null}
            </div>
          </article>
        ))}
      </div>
    </>
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

function getThumbnailSrc(item: InterfaceCard) {
  const thumbnailSlug = item.slug as ThumbnailSlug;
  return (
    thumbnailAssetsBySlug[thumbnailSlug] ??
    thumbnailAssetsBySlug[fallbackThumbnailByKind[item.visualKind]]
  );
}

function getRecordId(item: InterfaceCard) {
  return recordIdBySlug[item.slug] ?? "UNK-000";
}

export default App;
