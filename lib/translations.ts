export type Lang = "en" | "bn";

export interface Translations {
  logoTag: string;
  badge: string;
  heroTitle: string;
  heroTitleBn: boolean;
  heroSub: string;
  findBtn: string;
  addHero: string;
  sl1: string;
  sl2: string;
  sl3: string;
  back: string;
  locate: string;
  addMap: string;
  mTitle: string;
  mSub: string;
  lName: string;
  lPhone: string;
  lArea: string;
  lSvc: string;
  lHours: string;
  lDays: string;
  lPhotos: string;
  opt: string;
  photoOpt: string;
  uploadTxt: string;
  uploadHint: string;
  cancel: string;
  submit: string;
  locStrip: string;
  locating: string;
  locFail: string;
  searchPH: string;
  toastOk: string;
  toastErr: string;
  toastPhotoErr: string;
  toastSizeErr: string;
  uploading: string;
  saving: string;
  loadingTxt: string;
  footerContribute: string;
  footerContributeDesc: string;
  footerBilingual: string;
  footerBilingualDesc: string;
  openLabel: string;
  closedLabel: string;
  awayLabel: string;
  callBtn: string;
  directionsBtn: string;
  noResults: string;
  resultCount: string;
  sortedByDist: string;
  filterAll: string;
  newBadge: string;
  namePH: string;
  phonePH: string;
  areaPH: string;
  servicesPH: string;
  hoursPH: string;
  daysPH: string;
}

const T: Record<Lang, Translations> = {
  en: {
    logoTag: "Find a cobbler anytime",
    badge: "Live · Dhaka",
    heroTitle: "Find a <em>Cobbler</em><br/>anytime.",
    heroTitleBn: false,
    heroSub: "Find the nearest cobbler in Dhaka — instantly, for free.",
    findBtn: "📍 Find Cobblers Near Me",
    addHero: "＋ Add a Cobbler",
    sl1: "Cobblers",
    sl2: "Always Free",
    sl3: "Dhaka City",
    back: "← Back",
    locate: "📍 Locate Me",
    addMap: "＋ Add Cobbler",
    mTitle: "Add a Cobbler",
    mSub: "Help your community. Takes 2 minutes.",
    lName: "Cobbler's Name",
    lPhone: "Phone Number",
    lArea: "Location Description",
    lSvc: "Services",
    lHours: "Work Hours",
    lDays: "Work Days",
    lPhotos: "Photos",
    opt: "(optional)",
    photoOpt: "(1–2, max 5MB each)",
    uploadTxt: "Tap to add photos",
    uploadHint: "1 photo of cobbler + 1 of surroundings",
    cancel: "Cancel",
    submit: "Submit",
    locStrip: "📍 Location captured!",
    locating: "Getting your location…",
    locFail: "Location unavailable.",
    searchPH: "Search area (e.g. Mirpur, Dhanmondi…)",
    toastOk: "✓ Cobbler added! Visible to everyone now.",
    toastErr: "Please fill Name, Phone, and Location.",
    toastPhotoErr: "Max 2 photos allowed.",
    toastSizeErr: "Each photo must be under 10MB.",
    uploading: "Uploading photos…",
    saving: "Saving…",
    loadingTxt: "Loading cobblers…",
    footerContribute: "Contribute",
    footerContributeDesc:
      "This is a community-driven project. Help grow our cobbler list and add cobblers from your area.",
    footerBilingual: "Bilingual Support",
    footerBilingualDesc:
      "Join us in your language — we support both Bangla and English. Help your language community grow.",
    openLabel: "Open",
    closedLabel: "Closed",
    awayLabel: "away",
    callBtn: "📞 Call",
    directionsBtn: "🗺 Directions",
    noResults: "No cobblers found. Be the first to add one!",
    resultCount: "cobbler(s) found",
    sortedByDist: "sorted by distance",
    filterAll: "All",
    newBadge: "✦ NEW",
    namePH: "e.g. Rahim Mia",
    phonePH: "01XXXXXXXXX",
    areaPH: "e.g. Mirpur-10, near bus stand",
    servicesPH: "Sole Repair, Polish, Stitching…",
    hoursPH: "e.g. 9 AM – 7 PM",
    daysPH: "Sat – Thu",
  },
  bn: {
    logoTag: "যেকোনো সময় মুচি খুঁজুন",
    badge: "লাইভ · ঢাকা",
    heroTitle: "যেকোনো সময়<br/><em>মুচি</em> খুঁজুন।",
    heroTitleBn: true,
    heroSub: "ঢাকার যেকোনো জায়গা থেকে কাছের মুচি খুঁজুন — মুহূর্তেই, বিনামূল্যে।",
    findBtn: "📍 কাছের মুচি খুঁজুন",
    addHero: "＋ মুচি যোগ করুন",
    sl1: "মুচি",
    sl2: "বিনামূল্যে",
    sl3: "ঢাকা শহর",
    back: "← ফিরে যান",
    locate: "📍 আমার অবস্থান",
    addMap: "＋ মুচি যোগ করুন",
    mTitle: "মুচির তথ্য যোগ করুন",
    mSub: "আপনার এলাকার মুচিকে যোগ করুন। মাত্র ২ মিনিট।",
    lName: "মুচির নাম",
    lPhone: "ফোন নম্বর",
    lArea: "অবস্থানের বিবরণ",
    lSvc: "কাজের ধরন",
    lHours: "কাজের সময়",
    lDays: "কাজের দিন",
    lPhotos: "ছবি",
    opt: "(ঐচ্ছিক)",
    photoOpt: "(১–২টি, সর্বোচ্চ ৫MB)",
    uploadTxt: "ছবি যোগ করতে ট্যাপ করুন",
    uploadHint: "মুচির ১টি + আশেপাশের ১টি ছবি",
    cancel: "বাতিল",
    submit: "জমা দিন",
    locStrip: "📍 অবস্থান পাওয়া গেছে!",
    locating: "অবস্থান নির্ণয় হচ্ছে…",
    locFail: "অবস্থান পাওয়া যায়নি।",
    searchPH: "এলাকা খুঁজুন (যেমন মিরপুর, ধানমন্ডি…)",
    toastOk: "✓ মুচি যোগ হয়েছে! সবাই এখন দেখতে পাচ্ছে।",
    toastErr: "নাম, ফোন ও এলাকা পূরণ করুন।",
    toastPhotoErr: "সর্বোচ্চ ২টি ছবি দেওয়া যাবে।",
    toastSizeErr: "প্রতিটি ছবি ১০MB-এর কম হতে হবে।",
    uploading: "ছবি আপলোড হচ্ছে…",
    saving: "সংরক্ষণ হচ্ছে…",
    loadingTxt: "মুচির তালিকা লোড হচ্ছে…",
    footerContribute: "অবদান রাখুন",
    footerContributeDesc:
      "এটি একটি কমিউনিটি-চালিত প্রকল্প। মুচিদের তালিকা বৃদ্ধিতে সাহায্য করুন এবং আপনার এলাকার মুচি যোগ করুন।",
    footerBilingual: "বহুভাষিক সহায়তা",
    footerBilingualDesc:
      "আপনার ভাষায় যোগ দিন — আমরা বাংলা এবং ইংরেজি উভয়ই সমর্থন করি। আপনার ভাষার কমিউনিটিকে সাহায্য করুন।",
    openLabel: "খোলা",
    closedLabel: "বন্ধ",
    awayLabel: "দূরে",
    callBtn: "📞 কল",
    directionsBtn: "🗺 দিকনির্দেশ",
    noResults: "কাছে কোনো মুচি পাওয়া যায়নি। প্রথম একজন যোগ করুন!",
    resultCount: "জন মুচি পাওয়া গেছে",
    sortedByDist: "দূরত্ব অনুযায়ী সাজানো",
    filterAll: "সব",
    newBadge: "✦ নতুন",
    namePH: "যেমন: রহিম মিয়া",
    phonePH: "০১XXXXXXXXX",
    areaPH: "যেমন: মিরপুর-১০, বাস স্ট্যান্ডের কাছে",
    servicesPH: "সোল মেরামত, পলিশ, সেলাই…",
    hoursPH: "যেমন: সকাল ৯ – সন্ধ্যা ৭",
    daysPH: "শনি – বৃহস্পতি",
  },
};

export default T;
