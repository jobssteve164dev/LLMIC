export const LEGAL_API_BASE = "https://laws.szlk.ai/api/legal";
export const LEGAL_PRODUCT_ID = "llmic";
export const LEGAL_LOCALE = "zh-CN";

export interface LegalCatalogDocument {
  type: string;
  title: string;
  route_hint: string | null;
  summary: string;
  version: string;
  effective_at: string;
  publication_status: string;
}

export interface LegalCatalog {
  contract_version: string;
  documents: LegalCatalogDocument[];
  product: {
    id: string;
    name: string;
    domain: string;
    category: string;
  };
}

const legalDocumentSummaries: Record<string, string> = {
  terms_of_service: "了解使用 LLMIC 时适用的通用规则与科普内容边界。",
  privacy_policy: "了解访问本站时涉及的数据处理、用途与联系渠道。",
  cookie_policy: "了解本站使用的 Cookie、访问分析与相关技术。",
  refund_cancellation_policy: "LLMIC 当前免费使用；此处说明适用的通用退款与取消规则。",
  data_rights_notice: "了解你的数据权利及通过电子邮件提交请求的方式。",
  do_not_sell_share_notice: "了解 SZLK 对出售、分享个人信息及定向广告的声明。",
};

export interface LegalSection {
  id: string;
  title: string;
  body_markdown: string;
}

export interface ManagedLegalContent {
  type: string;
  title: string;
  version: string;
  effective_at: string;
  publication_status: string;
  governance_status?: string;
  product: {
    id: string;
    name: string;
    domain: string;
    category?: string;
  };
  composition: Array<{
    scope: string;
    sections: LegalSection[];
  }>;
}

interface LegalResponse<T> {
  success: boolean;
  error?: { message?: string };
  catalog?: T;
  document?: T;
  supplement?: T;
  contract_version?: string;
  documents?: LegalCatalogDocument[];
  product?: LegalCatalog["product"];
}

async function requestLegal<T>(path: string, signal?: AbortSignal): Promise<LegalResponse<T>> {
  const response = await fetch(`${LEGAL_API_BASE}${path}`, { signal });
  const payload = await response.json() as LegalResponse<T>;
  if (!response.ok || !payload.success) {
    throw new Error(payload.error?.message || `法律文件暂时无法读取（${response.status}）`);
  }
  return payload;
}

export function getRelevantLegalDocuments(documents: LegalCatalogDocument[]) {
  return documents
    .filter((document) => document.route_hint !== null && document.publication_status === "published")
    .map((document) => ({
      ...document,
      summary: legalDocumentSummaries[document.type] ?? document.summary,
    }));
}

export async function fetchLegalCatalog(signal?: AbortSignal): Promise<LegalCatalog> {
  const payload = await requestLegal<LegalCatalog>(`/catalog?product=${LEGAL_PRODUCT_ID}&locale=${LEGAL_LOCALE}`, signal);
  if (!payload.documents || !payload.product || !payload.contract_version) {
    throw new Error("法律文件目录返回了不完整的数据");
  }
  return {
    contract_version: payload.contract_version,
    documents: getRelevantLegalDocuments(payload.documents),
    product: payload.product,
  };
}

export async function fetchLegalDocument(type: string, signal?: AbortSignal): Promise<ManagedLegalContent> {
  const payload = await requestLegal<ManagedLegalContent>(
    `/document?product=${LEGAL_PRODUCT_ID}&type=${encodeURIComponent(type)}&locale=${LEGAL_LOCALE}`,
    signal,
  );
  if (!payload.document) throw new Error("法律文件正文返回了不完整的数据");
  return payload.document;
}

export async function fetchProductSupplement(signal?: AbortSignal): Promise<ManagedLegalContent> {
  const payload = await requestLegal<ManagedLegalContent>(
    `/product-supplement?product=${LEGAL_PRODUCT_ID}&locale=${LEGAL_LOCALE}`,
    signal,
  );
  if (!payload.supplement) throw new Error("产品补充说明返回了不完整的数据");
  return payload.supplement;
}
