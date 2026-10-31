import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'om' | 'am' | 'ar';

interface Translations {
  [key: string]: {
    en: string;
    om: string;
    am: string;
    ar: string;
  };
}

const translations: Translations = {
  'settings.familyReligion': { en: 'Family Religion', om: 'Amantii Maatii', am: 'የቤተሰብ ሃይማኖት', ar: 'دين العائلة' },
  'settings.religion': { en: 'Religion', om: 'Amantii', am: 'ሃይማኖት', ar: 'الدين' },
  'settings.chooseReligion': { en: 'Select religion', om: 'Amantii filadhu', am: 'ሃይማኖት ይምረጡ', ar: 'اختر الدين' },
  'settings.islam': { en: 'Islam', om: 'Islaama', am: 'እስልምና', ar: 'الإسلام' },
  'settings.christianity': { en: 'Christianity', om: 'Kiristaanaa', am: 'ክርስትና', ar: 'المسيحية' },
  'settings.otherReligion': { en: 'Other', om: 'Kan biraa', am: 'ሌላ', ar: 'آخر' },
  'settings.preferNot': { en: 'Prefer not to say', om: 'Himuu hin barbaadu', am: 'መግለጽ አልፈልግም', ar: 'أفضل عدم الإفصاح' },
  'settings.religionHint': { en: 'Choosing Islam enables Islamic Learning for you and all children linked to your family.', om: 'Islaama filachuun barnoota Islaamaa siif fi ijoollee maatii keetti hidhataniif bana.', am: 'እስልምናን መምረጥ ለእርስዎና ከቤተሰብዎ ጋር ለተገናኙ ልጆች ሁሉ እስላማዊ ትምህርትን ያስችላል።', ar: 'اختيار الإسلام يتيح التعلم الإسلامي لك ولجميع الأطفال المرتبطين بعائلتك.' },
  'settings.saveReligion': { en: 'Save Family Religion', om: 'Amantii Maatii Olkaa’i', am: 'የቤተሰብ ሃይማኖትን ያስቀምጡ', ar: 'حفظ دين العائلة' },
  'settings.savingReligion': { en: 'Saving…', om: 'Olkaa’aa jira…', am: 'በማስቀመጥ ላይ…', ar: 'جارٍ الحفظ…' },
  'settings.religionSaved': { en: 'Family religion saved', om: 'Amantiin maatii olkaa’ame', am: 'የቤተሰብ ሃይማኖት ተቀምጧል', ar: 'تم حفظ دين العائلة' },
  'settings.religionError': { en: 'Could not save family religion. Please try again.', om: 'Amantii maatii olkaa’uu hin dandeenye. Irra deebi’ii yaali.', am: 'የቤተሰብ ሃይማኖትን ማስቀመጥ አልተቻለም። እንደገና ይሞክሩ።', ar: 'تعذر حفظ دين العائلة. يرجى المحاولة مرة أخرى.' },
  // Navigation
  'nav.home': {
    en: 'Home',
    om: 'Mana',
    am: 'ቤት',
    ar: 'الرئيسية',
  },
  'nav.dashboard': {
    en: 'Dashboard',
    om: 'Daashboordii',
    am: 'ዳሽቦርድ',
    ar: 'لوحة القيادة',
  },
  'nav.students': {
    en: 'Students',
    om: 'Barattootaa',
    am: 'ተማሪዎች',
    ar: 'الطلاب',
  },
  'nav.academics': {
    en: 'Academics',
    om: 'Barnootaa',
    am: 'ትምህርት',
    ar: 'الأكاديمية',
  },
  'nav.guidance': {
    en: 'University Guidance',
    om: 'Qajeelfama Yunivarsiitii',
    am: 'የዩኒቨርሲቲ መመሪያ',
    ar: 'توجيه الجامعة',
  },
  'nav.history': {
    en: 'Personal History',
    om: 'Seenaa Dhuunfaa',
    am: 'የግል ታሪክ',
    ar: 'التاريخ الشخصي',
  },
  'nav.login': {
    en: 'Login',
    om: 'Seeni',
    am: 'ግባ',
    ar: 'تسجيل الدخول',
  },
  'nav.signup': {
    en: 'Sign Up',
    om: 'Galmahi',
    am: 'ተመዝገብ',
    ar: 'التسجيل',
  },
  
  // Hero Section
  'hero.title': {
    en: 'Nurture Your Family\'s Academic Journey',
    om: 'Imala Barnootaa Maatii Keessanii Guddisi',
    am: 'የቤተሰብዎን የትምህርት ጉዞ ያሳድጉ',
    ar: 'رعاية رحلة عائلتك الأكاديمية',
  },
  'hero.subtitle': {
    en: 'Track performance, guide futures, and celebrate achievements together.',
    om: 'Raawwii hordofi, fuula dura qajeelchi, milkaa\'ina waliin kabaji.',
    am: 'አፈጻጸምን ይከታተሉ፣ ወደፊትን ይምሩ፣ እና ስኬቶችን አብረው ያክብሩ።',
    ar: 'تتبع الأداء، ووجه المستقبل، واحتفل بالإنجازات معًا.',
  },
  'hero.cta': {
    en: 'Get Started',
    om: 'Jalqabi',
    am: 'ጀምር',
    ar: 'ابدأ الآن',
  },
  'hero.learn': {
    en: 'Learn More',
    om: 'Dabalata Barbaadi',
    am: 'ተጨማሪ እወቅ',
    ar: 'اعرف المزيد',
  },

  // Features
  'features.title': {
    en: 'Everything Your Family Needs',
    om: 'Waan Maatii Keessanii Barbaadu Hunda',
    am: 'ቤተሰብዎ የሚያስፈልገውን ሁሉ',
    ar: 'كل ما تحتاجه عائلتك',
  },
  'features.tracking.title': {
    en: 'Performance Tracking',
    om: 'Hordoffii Raawwii',
    am: 'የአፈጻጸም ክትትል',
    ar: 'تتبع الأداء',
  },
  'features.tracking.desc': {
    en: 'Monitor grades, attendance, and progress across all subjects and years.',
    om: 'Qabxii, argama fi tarkaanfii barnoota hundaa fi waggaa hundaa hordofi.',
    am: 'ደረጃዎችን፣ ተገኝቶን እና በሁሉም ትምህርቶች እና ዓመታት ላይ ያለውን ሂደት ይከታተሉ።',
    ar: 'راقب الدرجات والحضور والتقدم عبر جميع المواد والسنوات.',
  },
  'features.guidance.title': {
    en: 'University Guidance',
    om: 'Qajeelfama Yunivarsiitii',
    am: 'የዩኒቨርሲቲ መመሪያ',
    ar: 'توجيه الجامعة',
  },
  'features.guidance.desc': {
    en: 'Get personalized department recommendations based on real performance.',
    om: 'Gorsa damee dhuunfaa raawwii dhugaa irratti hundaa\'e argadhu.',
    am: 'በእውነተኛ አፈጻጸም ላይ የተመሰረተ ግላዊ የክፍል ምክሮችን ያግኙ።',
    ar: 'احصل على توصيات قسم مخصصة بناءً على الأداء الحقيقي.',
  },
  'features.history.title': {
    en: 'Personal Stories',
    om: 'Seenaa Dhuunfaa',
    am: 'የግል ታሪኮች',
    ar: 'قصص شخصية',
  },
  'features.history.desc': {
    en: 'Preserve memories, achievements, and milestones in a private family timeline.',
    om: 'Yaadannoo, milkaa\'ina fi bu\'aawwan sarara maatii dhuunfaa keessatti eegi.',
    am: 'ትውስታዎችን፣ ስኬቶችን እና ድንቅ ነገሮችን በግል የቤተሰብ ጊዜ መስመር ውስጥ ያስቀምጡ።',
    ar: 'احتفظ بالذكريات والإنجازات والمعالم في جدول زمني عائلي خاص.',
  },
  'features.multilingual.title': {
    en: 'Multilingual Support',
    om: 'Deeggarsa Afaanota Hedduu',
    am: 'ብዙ ቋንቋ ድጋፍ',
    ar: 'دعم متعدد اللغات',
  },
  'features.multilingual.desc': {
    en: 'Use the app in English, Afaan Oromo, Amharic, or Arabic.',
    om: 'Appii kana Ingilizii, Afaan Oromoo, Amaariffaa ykn Arabiffaan fayyadami.',
    am: 'መተግበሪያውን በእንግሊዝኛ፣ በአፋን ኦሮሞ፣ በአማርኛ ወይም በአረብኛ ይጠቀሙ።',
    ar: 'استخدم التطبيق باللغة الإنجليزية أو الأورومية أو الأمهرية أو العربية.',
  },

  // Auth
  'auth.welcome': {
    en: 'Welcome Back',
    om: 'Baga Nagaan Deebitee',
    am: 'እንኳን ደህና መጡ',
    ar: 'مرحبًا بعودتك',
  },
  'auth.createAccount': {
    en: 'Create Your Family Account',
    om: 'Herrega Maatii Kee Uumi',
    am: 'የቤተሰብ መለያዎን ይፍጠሩ',
    ar: 'أنشئ حساب عائلتك',
  },
  'auth.email': {
    en: 'Email',
    om: 'Imeelii',
    am: 'ኢሜይል',
    ar: 'البريد الإلكتروني',
  },
  'auth.password': {
    en: 'Password',
    om: 'Jecha Iccitii',
    am: 'የይለፍ ቃል',
    ar: 'كلمة المرور',
  },
  'auth.familyName': {
    en: 'Family Name',
    om: 'Maqaa Maatii',
    am: 'የቤተሰብ ስም',
    ar: 'اسم العائلة',
  },
  'auth.role': {
    en: 'I am a',
    om: 'Ani',
    am: 'እኔ ነኝ',
    ar: 'أنا',
  },
  'auth.parent': {
    en: 'Parent / Guardian',
    om: 'Maatii / Kunuunsaa',
    am: 'ወላጅ / ሞግዚት',
    ar: 'ولي الأمر',
  },
  'auth.student': {
    en: 'Student',
    om: 'Barataa',
    am: 'ተማሪ',
    ar: 'طالب',
  },

  // Dashboard
  'dashboard.welcome': {
    en: 'Welcome',
    om: 'Baga Nagaan Dhuftan',
    am: 'እንኳን ደህና መጡ',
    ar: 'مرحبا',
  },
  'dashboard.overview': {
    en: 'Family Overview',
    om: 'Ibsa Waligalaa Maatii',
    am: 'የቤተሰብ አጠቃላይ እይታ',
    ar: 'نظرة عامة على الأسرة',
  },
  'dashboard.performance': {
    en: 'Performance Summary',
    om: 'Cuunfaa Raawwii',
    am: 'የአፈጻጸም ማጠቃለያ',
    ar: 'ملخص الأداء',
  },
  'dashboard.average': {
    en: 'Average Score',
    om: 'Qabxii Giddu-galeessa',
    am: 'አማካይ ውጤት',
    ar: 'متوسط الدرجة',
  },
  'dashboard.courses': {
    en: 'Active Courses',
    om: 'Koorsiiwwan Hojii Irra Jiran',
    am: 'ንቁ ኮርሶች',
    ar: 'الدورات النشطة',
  },
  'dashboard.students': {
    en: 'Students',
    om: 'Barattootaa',
    am: 'ተማሪዎች',
    ar: 'الطلاب',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  languages: { code: Language; name: string; nativeName: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const languages = [
  { code: 'en' as Language, name: 'English', nativeName: 'English' },
  { code: 'om' as Language, name: 'Afaan Oromo', nativeName: 'Afaan Oromoo' },
  { code: 'am' as Language, name: 'Amharic', nativeName: 'አማርኛ' },
  { code: 'ar' as Language, name: 'Arabic', nativeName: 'العربية' },
];

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language] || translation.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages }}>
      <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
