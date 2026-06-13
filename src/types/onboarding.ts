// ── Onboarding type definitions ──

export type ToneType = "professional" | "friendly" | "humorous" | "warm" | "luxury";
export type ChannelKey = "facebook" | "tiktok" | "shopee" | "zalo" | "web";
export type AIProvider = "openai" | "gemini" | "openrouter" | "";

export interface Product {
  name: string;
  price: number;
}

export interface OnboardingData {
  // Step 1: Shop
  shopName: string;
  shopDesc: string;
  shopCategory: string;

  // Step 2: Products
  products: Product[];

  // Step 3: Bot
  botName: string;
  botTone: ToneType;
  botRules: string[];

  // Step 4: Channels
  channels: Record<ChannelKey, boolean>;

  // Step 5: AI Provider (configure in Settings after onboarding)
  aiProvider: AIProvider;
  aiKey: string;

  // Step 6: Deploy (read-only summary)
}

export const STEPS = [
  { id: "shop",     titleVI: "Thiết lập Shop",  titleEN: "Shop Setup" },
  { id: "products", titleVI: "Sản phẩm",         titleEN: "Products" },
  { id: "bot",      titleVI: "Tạo Bot",          titleEN: "Create Bot" },
  { id: "channels", titleVI: "Kết nối Kênh",     titleEN: "Connect Channels" },
  { id: "playground", titleVI: "Dùng thử",       titleEN: "Playground" },
  { id: "deploy",   titleVI: "Hoàn tất",         titleEN: "Deploy" },
];

export const CATEGORIES = [
  "Thời trang", "Điện tử", "Nhà cửa & Đời sống", "Mỹ phẩm",
  "Thực phẩm", "Mẹ & Bé", "Thể thao", "Khác",
];

export const TONES: { id: ToneType; labelVI: string; labelEN: string; descVI: string; descEN: string }[] = [
  { id: "professional", labelVI: "Chuyên nghiệp", labelEN: "Professional", descVI: "Lịch sự, trang trọng", descEN: "Polite, formal" },
  { id: "friendly",     labelVI: "Thân thiện",    labelEN: "Friendly",    descVI: "Ấm áp, gần gũi",    descEN: "Warm, approachable" },
  { id: "humorous",     labelVI: "Hài hước",      labelEN: "Humorous",    descVI: "Vui vẻ, trẻ trung",  descEN: "Fun, youthful" },
  { id: "warm",         labelVI: "Ấm áp",         labelEN: "Warm",        descVI: "Tình cảm, chu đáo",  descEN: "Caring, thoughtful" },
  { id: "luxury",       labelVI: "Sang trọng",    labelEN: "Luxury",      descVI: "Cao cấp, lịch lãm",  descEN: "Premium, elegant" },
];

export const CHANNELS: { key: ChannelKey; labelVI: string; labelEN: string; icon: string }[] = [
  { key: "facebook", labelVI: "Facebook Messenger", labelEN: "Facebook Messenger", icon: "f" },
  { key: "tiktok",   labelVI: "TikTok Shop",        labelEN: "TikTok Shop",        icon: "🎵" },
  { key: "shopee",   labelVI: "Shopee",             labelEN: "Shopee",             icon: "🛍" },
  { key: "zalo",     labelVI: "Zalo OA",            labelEN: "Zalo OA",            icon: "💬" },
  { key: "web",      labelVI: "Web Widget",         labelEN: "Web Widget",         icon: "🌐" },
];

export const DEFAULT_RULES = [
  "Luôn trả lời tiếng Việt",
  "Thu thập SĐT khách hàng",
  "Không tự ý giảm giá",
];

export function emptyOnboardingData(): OnboardingData {
  return {
    shopName: "",
    shopDesc: "",
    shopCategory: "",
    products: [],
    botName: "",
    botTone: "friendly",
    botRules: [...DEFAULT_RULES],
    channels: { facebook: false, tiktok: false, shopee: false, zalo: false, web: false },
    aiProvider: "",
    aiKey: "",
  };
}
