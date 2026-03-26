'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Locale = 'en' | 'th';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Navigation
    features: 'Features',
    pricing: 'Pricing',
    contact: 'Contact',
    getStarted: 'Get Started',
    // Hero
    heroTitle: '"Shopify for Auto Repair"',
    heroSubtitle: 'Mobile-first, AI-powered shop management for auto repair shops. Digitize job cards, AI inspect vehicles, manage inventory, and delight customers.',
    startFreeTrial: 'Start Free Trial',
    watchDemo: 'Watch Demo',
    shops: 'Shops',
    acrossThailand: 'Across Thailand',
    // Features
    featuresTitle: 'Everything You Need',
    featuresSubtitle: 'Run your entire shop from your phone or tablet. No expensive hardware, no complicated software.',
    digitalJobCards: 'Digital Job Cards',
    digitalJobCardsDesc: 'Create and manage job cards on the go. Attach photos, notes, and parts lists.',
    aiInspection: 'AI Inspection',
    aiInspectionDesc: 'Let AI help diagnose vehicle issues. Snap a photo, get instant insights.',
    inventoryManagement: 'Inventory Management',
    inventoryManagementDesc: 'Track parts stock, get low stock alerts, and reorder with one tap.',
    customerCommunication: 'Customer Communication',
    customerCommunicationDesc: 'Send updates via LINE, WhatsApp, or SMS. Keep customers informed.',
    paymentTracking: 'Payment Tracking',
    paymentTrackingDesc: 'Track invoices and payments. Send payment links and get notified.',
    analyticsDashboard: 'Analytics Dashboard',
    analyticsDashboardDesc: 'See your shop\'s performance. Track jobs, revenue, and trends.',
    // Benefits
    benefitsTitle: 'Why GarageOS?',
    benefit1: 'Mobile-first design works on any device',
    benefit2: 'AI-powered diagnostics assist mechanics',
    benefit3: 'Reduce paperwork and manual tracking',
    benefit4: 'Increase customer trust with visual reports',
    benefit5: 'Predictive maintenance reminders',
    benefit6: 'Support for LINE, WhatsApp, SMS',
    readyInMinutes: 'Ready in Minutes',
    readyDesc: 'No complicated setup. No expensive hardware. Just sign up, add your shop details, and start managing jobs digitally.',
    setupTime: 'Setup time',
    lessThan5Min: 'Less than 5 minutes',
    trainingNeeded: 'Training needed',
    none: 'None',
    monthlyCost: 'Monthly cost',
    from20: 'From $20',
    // Pricing
    pricingTitle: 'Simple, Transparent Pricing',
    pricingSubtitle: 'Start free, scale as you grow. No hidden fees, no long-term contracts.',
    mostPopular: 'Most Popular',
    smallGarage: 'Small Garage',
    smallGarageDesc: 'Perfect for independent shops',
    mediumShop: 'Medium Shop',
    mediumShopDesc: 'For growing repair shops',
    enterprise: 'Enterprise',
    enterpriseDesc: 'For shop chains',
    getStartedBtn: 'Get Started',
    // Pricing features - Small Garage
    smallGarageFeature1: 'Up to 50 job cards/month',
    smallGarageFeature2: 'Digital job cards',
    smallGarageFeature3: 'Customer messaging',
    smallGarageFeature4: 'Basic AI inspection',
    // Pricing features - Medium Shop
    mediumGarageFeature1: 'Unlimited job cards',
    mediumGarageFeature2: 'Everything in Small',
    mediumGarageFeature3: 'Parts & inventory',
    mediumGarageFeature4: 'Analytics dashboard',
    mediumGarageFeature5: 'Priority support',
    // Pricing features - Enterprise
    enterpriseFeature1: 'Everything in Medium',
    enterpriseFeature2: 'Multi-shop management',
    enterpriseFeature3: 'API access',
    enterpriseFeature4: 'Custom integrations',
    enterpriseFeature5: 'Dedicated account manager',
    // CTA
    ctaTitle: 'Ready to Go Digital?',
    ctaSubtitle: 'Join thousands of auto repair shops in Thailand and Southeast Asia that trust GarageOS.',
    talkToSales: 'Talk to Sales',
    // Footer
    product: 'Product',
    company: 'Company',
    legal: 'Legal',
    integrations: 'Integrations',
    about: 'About',
    blog: 'Blog',
    careers: 'Careers',
    privacy: 'Privacy',
    terms: 'Terms',
    security: 'Security',
    copyright: '© 2026 GarageOS. All rights reserved.',
    footerTagline: 'Mobile-first shop management for auto repair shops.',
  },
  th: {
    // Navigation
    features: 'คุณสมบัติ',
    pricing: 'ราคา',
    contact: 'ติดต่อ',
    getStarted: 'เริ่มต้น',
    // Hero
    heroTitle: '"Shopify สำหรับซ่อมรถยนต์"',
    heroSubtitle: 'ระบบจัดการร้านซ่อมรถยนต์ด้วยมือถือ ใช้ AI ช่วยวินิจฉัย จัดการงาน และดูแลลูกค้า',
    startFreeTrial: 'ทดลองใช้ฟรี',
    watchDemo: 'ดูการสamo',
    shops: 'ร้าน',
    acrossThailand: 'ทั่วประเทศไทย',
    // Features
    featuresTitle: 'ทุกอย่างที่คุณต้องการ',
    featuresSubtitle: 'บริหารร้านทั้งร้านจากโทรศัพท์หรือแท็บเล็ต ไม่ต้องซื้อ hardware แพง ไม่ต้องใช้ software ยุ่งยาก',
    digitalJobCards: 'ใบงานดิจิทัล',
    digitalJobCardsDesc: 'สร้างและจัดการใบงานได้ทุกที่ พร้อมรูปถ่าย บันทึก และรายการอะไหล่',
    aiInspection: 'AI ตรวจสอบ',
    aiInspectionDesc: 'ให้ AI ช่วยวินิจฉัยปัญหารถ ถ่ายรูปแล้วได้ผลวิเคราะห์ทันที',
    inventoryManagement: 'จัดการสินค้าคงคลัง',
    inventoryManagementDesc: 'ติดตามสต็อกอะไหล่ แจ้งเตือนเมื่อใกล้หมด สั่งซื้อได้ในคลิกเดียว',
    customerCommunication: 'สื่อสารกับลูกค้า',
    customerCommunicationDesc: 'ส่งข้อความผ่าน LINE, WhatsApp หรือ SMS ลูกค้าพร้อมรับข้อมูลตลอด',
    paymentTracking: 'ติดตามการชำระเงิน',
    paymentTrackingDesc: 'ติดตามใบแจ้งหนี้และการชำระเงิน ส่งลิงก์ชำระเงินและรับแจ้งเตือน',
    analyticsDashboard: 'แดชบอร์ดวิเคราะห์',
    analyticsDashboardDesc: 'ดูผลประกอบการร้าน ติดตามงาน รายได้ และแนวโน้ม',
    // Benefits
    benefitsTitle: 'ทำไมต้อง GarageOS?',
    benefit1: 'ออกแบบมือถือก่อน ใช้งานได้ทุกอุปกรณ์',
    benefit2: 'AI ช่วยวินิจฉัยปัญหารถ',
    benefit3: 'ลดกระดาษและการติดตามด้วยมือ',
    benefit4: 'เพิ่มความไว้วางใจของลูกค้าด้วยรายงานภาพ',
    benefit5: 'แจ้งเตือนการบำรุงรักษาล่วงหน้า',
    benefit6: 'รองรับ LINE, WhatsApp, SMS',
    readyInMinutes: 'พร้อมใช้งานในไม่กี่นาที',
    readyDesc: 'ไม่ต้องตั้งค่าซับซ้อน ไม่ต้องซื้อ hardware แพง เพียงสมัคร เพิ่มข้อมูลร้าน และเริ่มจัดการงานดิจิทัล',
    setupTime: 'เวลาตั้งค่า',
    lessThan5Min: 'น้อยกว่า 5 นาที',
    trainingNeeded: 'ต้องการฝึกอบรม',
    none: 'ไม่ต้อง',
    monthlyCost: 'ค่าใช้จ่ายรายเดือน',
    from20: 'จาก $20',
    // Pricing
    pricingTitle: 'ราคาเรียบง่าย โปร่งใส',
    pricingSubtitle: 'เริ่มต้นฟรี ขยายได้เมื่อโต ไม่มีค่าใช้จ่ายซ่อนเร้น ไม่มีสัญญาระยะยาว',
    mostPopular: 'ยอดนิยม',
    smallGarage: 'อู่เล็ก',
    smallGarageDesc: 'เหมาะสำหรับอู่อิสระ',
    mediumShop: 'อู่กลาง',
    mediumShopDesc: 'สำหรับร้านซ่อมที่กำลังเติบโต',
    enterprise: 'เอนเตอร์ไพรส์',
    enterpriseDesc: 'สำหรับเครือร้านซ่อม',
    getStartedBtn: 'เริ่มต้น',
    // Pricing features - Small Garage
    smallGarageFeature1: 'ใบงาน 50 ใบ/เดือน',
    smallGarageFeature2: 'ใบงานดิจิทัล',
    smallGarageFeature3: 'ส่งข้อความถึงลูกค้า',
    smallGarageFeature4: 'AI ตรวจสอบพื้นฐาน',
    // Pricing features - Medium Shop
    mediumGarageFeature1: 'ใบงานไม่จำกัด',
    mediumGarageFeature2: 'ทุกอย่างในแพลนเล็ก',
    mediumGarageFeature3: 'อะไหล่และสินค้าคงคลัง',
    mediumGarageFeature4: 'แดชบอร์ดวิเคราะห์',
    mediumGarageFeature5: 'สนับสนุนลำดับความสำคัญ',
    // Pricing features - Enterprise
    enterpriseFeature1: 'ทุกอย่างในแพลนกลาง',
    enterpriseFeature2: 'จัดการหลายร้าน',
    enterpriseFeature3: 'เข้าถึง API',
    enterpriseFeature4: 'การรวมแบบกำหนดเอง',
    enterpriseFeature5: 'ผู้จัดการบัญชีเฉพาะ',
    // CTA
    ctaTitle: 'พร้อมเปลี่ยนเป็นดิจิทัลหรือยัง?',
    ctaSubtitle: 'ร่วมกับร้านซ่อมรถหลายพันแห่งในไทยและเอเชียตะวันออกเฉียงที่ไว้วางใจ GarageOS',
    talkToSales: 'คุยกับทีมขาย',
    // Footer
    product: 'ผลิตภัณฑ์',
    company: 'บริษัท',
    legal: 'กฎหมาย',
    integrations: 'การผสานรวม',
    about: 'เกี่ยวกับ',
    blog: 'บล็อก',
    careers: 'ร่วมงาน',
    privacy: 'ความเป็นส่วนตัว',
    terms: 'ข้อกำหนด',
    security: 'ความปลอดภัย',
    copyright: '© 2026 GarageOS. สงวนลิขสิทธิ์',
    footerTagline: 'ระบบจัดการร้านซ่อมรถยนต์ด้วยมือถือ',
  },
};

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const stored = localStorage.getItem('garageos-site-locale') as Locale | null;
    const browserLocale = navigator.language.startsWith('th') ? 'th' : 'en';
    const initialLocale = stored || browserLocale;
    setLocaleState(initialLocale);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('garageos-site-locale', newLocale);
  };

  const t = (key: string) => translations[locale][key] || key;

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
