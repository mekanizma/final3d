import type { Locale } from "@/i18n/config";
import { pickLocale } from "@/lib/seo/content/pick-locale";
import type { LocalizedSeoPage } from "@/lib/seo/types";

const hubs: Record<string, LocalizedSeoPage> = {
  "3d-baski-kktc": {
    tr: {
      path: "/3d-baski-kktc",
      metaTitle: "3D Baskı KKTC | Hızlı Üretim ve Teslimat",
      metaDescription:
        "FINAL3D ile KKTC genelinde profesyonel 3D baskı: PLA, ABS, PETG, TPU. Özel parça, prototip ve seri üretim. Teklif alın, kapıda ödeme.",
      h1: "KKTC'de Profesyonel 3D Baskı Hizmeti",
      intro:
        "FINAL3D, Kuzey Kıbrıs'ta FDM filament baskı ile parçanızı hızlı ve kontrollü üretir. Lefkoşa, Girne, Gazimağusa, Güzelyurt ve İskele'ye teslimat sunuyoruz.",
      sections: [
        {
          heading: "Hangi malzemelerle baskı yapıyoruz?",
          body: "PLA (prototip ve sunum), ABS (dayanıklı parça), PETG (kimyasal direnç), TPU (esnek parça) malzemelerinde üretim yapıyoruz. Parçanıza göre katman yüksekliği ve doluluk oranını optimize ediyoruz.",
        },
        {
          heading: "Kimler için uygun?",
          body: "Mimarlık maketleri, yedek parça, endüstriyel prototip, kişiye özel hediye ve üniversite projeleri için idealdir. STL, OBJ ve 3MF dosyalarınızı yükleyerek teklif alabilirsiniz.",
        },
        {
          heading: "Teslimat ve ödeme",
          body: "KKTC genelinde kargo ve kapıda ödeme seçenekleri mevcuttur. Üretim süresi parça boyutuna göre genellikle 24–72 saat arasındadır.",
        },
      ],
      faq: [
        {
          question: "KKTC'de 3D baskı fiyatı nasıl hesaplanır?",
          answer:
            "Fiyat; filament türü, ağırlık, baskı süresi ve adete göre belirlenir. Dosyanızı gönderdiğinizde 24 saat içinde net teklif iletiriz.",
        },
        {
          question: "Hangi dosya formatları kabul ediliyor?",
          answer: "STL, OBJ ve 3MF formatlarını kabul ediyoruz.",
        },
        {
          question: "Minimum sipariş var mı?",
          answer: "Tek parça bile üretebiliriz; seri üretim için indirimli teklif sunuyoruz.",
        },
      ],
      cta: {
        href: "/ozel-baski#talep-form",
        label: "Dosya Gönder & Teklif Al",
        secondaryHref: "/3d-tarama/teklif",
        secondaryLabel: "3D Tarama Teklifi",
      },
      related: [
        { href: "/prototip-uretim-kibris", label: "Prototip üretim" },
        { href: "/kktc/lefkosa-3d-baski", label: "Lefkoşa 3D baskı" },
        { href: "/hizmetler/mimari-maket", label: "Mimari maket" },
      ],
      keywords: [
        "3d baskı kktc",
        "3d printer kıbrıs",
        "hızlı 3d baskı",
        "filament baskı",
      ],
    },
    en: {
      path: "/3d-baski-kktc",
      metaTitle: "3D Printing Cyprus (TRNC) | Fast Production",
      metaDescription:
        "Professional FDM 3D printing across Northern Cyprus. PLA, ABS, PETG, TPU. Custom parts, prototypes, delivery and cash on delivery.",
      h1: "Professional 3D Printing in Northern Cyprus",
      intro:
        "FINAL3D delivers controlled FDM production across TRNC including Nicosia, Kyrenia, Famagusta, Morphou and Trikomo.",
      sections: [
        {
          heading: "Materials we print",
          body: "PLA, ABS, PETG and TPU with optimized infill and layer height for your application.",
        },
        {
          heading: "Use cases",
          body: "Architectural models, spare parts, industrial prototypes, gifts and university projects.",
        },
        {
          heading: "Delivery",
          body: "Island-wide shipping and cash on delivery. Typical lead time 24–72 hours depending on part size.",
        },
      ],
      faq: [
        {
          question: "How is 3D printing priced in TRNC?",
          answer: "Quote is based on material, weight, print time and quantity. Send your file for a quote within 24 hours.",
        },
        {
          question: "Accepted file formats?",
          answer: "STL, OBJ and 3MF.",
        },
        {
          question: "Minimum order?",
          answer: "Single parts are welcome; volume discounts available.",
        },
      ],
      cta: {
        href: "/ozel-baski#talep-form",
        label: "Upload file & get quote",
        secondaryHref: "/3d-tarama/teklif",
        secondaryLabel: "3D scanning quote",
      },
      related: [
        { href: "/prototip-uretim-kibris", label: "Rapid prototyping" },
        { href: "/kktc/lefkosa-3d-baski", label: "Nicosia 3D printing" },
        { href: "/hizmetler/mimari-maket", label: "Architectural models" },
      ],
    },
    ru: {
      path: "/3d-baski-kktc",
      metaTitle: "3D-печать ТРСК | Быстрое производство",
      metaDescription:
        "Профессиональная FDM-печать на Северном Кипре. PLA, ABS, PETG, TPU. Детали, прототипы, доставка.",
      h1: "Профессиональная 3D-печать в ТРСК",
      intro: "FINAL3D — печать филаментом по всему ТРСК с доставкой и прозрачным расчётом.",
      sections: [
        { heading: "Материалы", body: "PLA, ABS, PETG, TPU." },
        { heading: "Применение", body: "Макеты, запчасти, прототипы, подарки." },
        { heading: "Доставка", body: "Доставка по ТРСК, оплата при получении." },
      ],
      faq: [
        { question: "Как рассчитывается цена?", answer: "По материалу, весу и времени печати. Отправьте файл для расчёта." },
        { question: "Форматы файлов?", answer: "STL, OBJ, 3MF." },
        { question: "Минимальный заказ?", answer: "Печатаем от одной детали." },
      ],
      cta: { href: "/ozel-baski#talep-form", label: "Отправить файл", secondaryHref: "/3d-tarama/teklif", secondaryLabel: "Сканирование" },
      related: [{ href: "/prototip-uretim-kibris", label: "Прототипы" }],
    },
    ar: {
      path: "/3d-baski-kktc",
      metaTitle: "طباعة ثلاثية الأبعاد شمال قبرص",
      metaDescription: "طباعة FDM احترافية في شمال قبرص. PLA و ABS و PETG و TPU.",
      h1: "طباعة ثلاثية الأبعاد احترافية في شمال قبرص",
      intro: "FINAL3D — إنتاج بالفلامنت مع التوصيل في شمال قبرص.",
      sections: [
        { heading: "المواد", body: "PLA و ABS و PETG و TPU." },
        { heading: "الاستخدامات", body: "نماذج معمارية وقطع غيار ومشاريع جامعية." },
        { heading: "التوصيل", body: "توصيل على مستوى الجزيرة والدفع عند الاستلام." },
      ],
      faq: [
        { question: "كيف يُحسب السعر؟", answer: "حسب المادة والوزن ووقت الطباعة." },
        { question: "صيغ الملفات؟", answer: "STL و OBJ و 3MF." },
        { question: "حد أدنى للطلب؟", answer: "قطعة واحدة مقبولة." },
      ],
      cta: { href: "/ozel-baski#talep-form", label: "إرسال الملف", secondaryHref: "/3d-tarama/teklif", secondaryLabel: "عرض مسح" },
      related: [{ href: "/prototip-uretim-kibris", label: "نماذج أولية" }],
    },
  },
  "3d-tarama-kktc": {
    tr: {
      path: "/3d-tarama-kktc",
      metaTitle: "3D Tarama KKTC | Stüdyo ve Saha Taraması",
      metaDescription:
        "El tipi 3D tarayıcı ile yüksek çözünürlüklü mesh. Tersine mühendislik, renkli doku, baskı entegrasyonu. FINAL3D KKTC.",
      h1: "KKTC'de Profesyonel 3D Tarama",
      intro:
        "Nesnelerinizi dijitalleştiriyor, STL/OBJ/3MF çıktıları hazırlıyor ve isteğe göre aynı çatı altında 3D baskı üretiyoruz.",
      sections: [
        {
          heading: "Stüdyo ve saha taraması",
          body: "Küçük parçalardan orta ölçekli objelere kadar stüdyomuzda veya adresinizde tarama yapıyoruz.",
        },
        {
          heading: "Çıktı formatları",
          body: "Mesh temizliği sonrası CAD ve slicer uyumlu dosyalar teslim edilir.",
        },
        {
          heading: "Tarama + baskı",
          body: "Tek teklifte tarama ve filament baskı sürecini birleştirebilirsiniz.",
        },
      ],
      faq: [
        {
          question: "3D tarama ne kadar sürer?",
          answer: "Obje boyutuna göre değişir; çoğu proje aynı gün veya ertesi iş günü teslim edilir.",
        },
        {
          question: "Hangi sektörler için uygundur?",
          answer: "Otomotiv yedek parça, mimari, sanat, eğitim ve üretim kalite kontrolü.",
        },
        {
          question: "Renkli tarama var mı?",
          answer: "Evet, RGB doku ile sunum ve arşiv için gerçekçi modeller üretiyoruz.",
        },
      ],
      cta: {
        href: "/3d-tarama/teklif",
        label: "Tarama Teklifi Al",
        secondaryHref: "/3d-tarama",
        secondaryLabel: "Tarama hizmeti",
      },
      related: [
        { href: "/3d-baski-kktc", label: "3D baskı KKTC" },
        { href: "/3d-modelleme-kktc", label: "3D modelleme" },
        { href: "/hizmetler/yedek-parca-uretimi", label: "Yedek parça" },
      ],
    },
    en: {
      path: "/3d-tarama-kktc",
      metaTitle: "3D Scanning Cyprus (TRNC) | Studio & On-site",
      metaDescription:
        "Handheld 3D scanning, clean meshes, reverse engineering. Optional printing. FINAL3D Northern Cyprus.",
      h1: "Professional 3D Scanning in TRNC",
      intro: "We digitize objects and deliver production-ready files with optional FDM printing.",
      sections: [
        { heading: "Studio & on-site", body: "From small parts to medium objects at our studio or your location." },
        { heading: "Deliverables", body: "Clean meshes in STL, OBJ, 3MF for CAD and slicers." },
        { heading: "Scan + print", body: "Combined quote for scanning and printing." },
      ],
      faq: [
        { question: "How long does scanning take?", answer: "Often same day or next business day depending on size." },
        { question: "Industries?", answer: "Automotive, architecture, art, education and QC." },
        { question: "Color capture?", answer: "Yes, RGB texture for presentation models." },
      ],
      cta: { href: "/3d-tarama/teklif", label: "Get scan quote", secondaryHref: "/3d-tarama", secondaryLabel: "Scanning service" },
      related: [{ href: "/3d-baski-kktc", label: "3D printing TRNC" }],
    },
    ru: {
      path: "/3d-tarama-kktc",
      metaTitle: "3D-сканирование ТРСК",
      metaDescription: "Ручное 3D-сканирование, реверс-инжиниринг, печать.",
      h1: "3D-сканирование в ТРСК",
      intro: "Оцифровка объектов и подготовка файлов для печати.",
      sections: [{ heading: "Студия и выезд", body: "Сканирование на месте или в студии." }],
      faq: [{ question: "Сроки?", answer: "Обычно 1–2 рабочих дня." }],
      cta: { href: "/3d-tarama/teklif", label: "Заявка на сканирование" },
      related: [{ href: "/3d-baski-kktc", label: "3D-печать" }],
    },
    ar: {
      path: "/3d-tarama-kktc",
      metaTitle: "مسح ثلاثي الأبعاد شمال قبرص",
      metaDescription: "مسح يدوي عالي الدقة مع إعداد الملفات.",
      h1: "مسح ثلاثي الأبعاد في شمال قبرص",
      intro: "رقمنة الأجسام وملفات جاهزة للطباعة.",
      sections: [{ heading: "استوديو وميداني", body: "مسح في الموقع أو الاستوديو." }],
      faq: [{ question: "المدة؟", answer: "غالباً يوم إلى يومين عمل." }],
      cta: { href: "/3d-tarama/teklif", label: "طلب عرض سعر" },
      related: [{ href: "/3d-baski-kktc", label: "طباعة 3D" }],
    },
  },
  "3d-modelleme-kktc": {
    tr: {
      path: "/3d-modelleme-kktc",
      metaTitle: "3D Modelleme KKTC | Mesh ve CAD Hazırlık",
      metaDescription:
        "Tarama sonrası mesh temizliği, hizalama ve baskıya hazır 3D model. FINAL3D KKTC modelleme hizmeti.",
      h1: "3D Modelleme ve Dosya Hazırlığı",
      intro:
        "Ham tarama verisini üretime uygun modele dönüştürüyoruz: onarım, ölçekleme, delik ve yüzey düzeltmeleri.",
      sections: [
        { heading: "Mesh optimizasyonu", body: "Delik kapatma, normal düzeltme ve baskıya uygun kalınlık kontrolü." },
        { heading: "CAD entegrasyonu", body: "SolidWorks, Fusion 360 ve Blender ile uyumlu çıktılar." },
      ],
      faq: [
        { question: "Sadece modelleme alabilir miyim?", answer: "Evet, tarama veya mevcut dosyanız üzerinden modelleme yapıyoruz." },
      ],
      cta: { href: "/3d-tarama/teklif", label: "Teklif Al", secondaryHref: "/ozel-baski", secondaryLabel: "Özel baskı" },
      related: [{ href: "/3d-tarama-kktc", label: "3D tarama" }],
    },
    en: {
      path: "/3d-modelleme-kktc",
      metaTitle: "3D Modeling TRNC | Mesh to Print-ready",
      metaDescription: "Mesh cleanup and print-ready modeling in Northern Cyprus.",
      h1: "3D Modeling & File Preparation",
      intro: "We turn scan data into production-ready models.",
      sections: [{ heading: "Mesh optimization", body: "Hole filling, normals and wall thickness checks." }],
      faq: [{ question: "Modeling only?", answer: "Yes, we can work from scans or your files." }],
      cta: { href: "/3d-tarama/teklif", label: "Get quote" },
      related: [{ href: "/3d-tarama-kktc", label: "3D scanning" }],
    },
    ru: {
      path: "/3d-modelleme-kktc",
      metaTitle: "3D-моделирование ТРСК",
      metaDescription: "Подготовка mesh и CAD.",
      h1: "3D-моделирование",
      intro: "Подготовка моделей к печати.",
      sections: [],
      faq: [],
      cta: { href: "/3d-tarama/teklif", label: "Расчёт" },
      related: [],
    },
    ar: {
      path: "/3d-modelleme-kktc",
      metaTitle: "نمذجة ثلاثية الأبعاد شمال قبرص",
      metaDescription: "تنظيف الشبكة وإعداد الملفات.",
      h1: "نمذجة ثلاثية الأبعاد",
      intro: "تحويل بيانات المسح إلى نماذج جاهزة للإنتاج.",
      sections: [],
      faq: [],
      cta: { href: "/3d-tarama/teklif", label: "عرض سعر" },
      related: [],
    },
  },
  "prototip-uretim-kibris": {
    tr: {
      path: "/prototip-uretim-kibris",
      metaTitle: "Prototip Üretim Kıbrıs | Hızlı MVP ve Test Parçası",
      metaDescription:
        "KKTC'de hızlı prototipleme: 3D baskı ile test parçası, iterasyon ve küçük seri. FINAL3D.",
      h1: "Kıbrıs'ta Hızlı Prototip Üretimi",
      intro:
        "Ürün geliştirme sürecinizde aynı gün veya 48 saat içinde test parçası üreterek tasarım hatalarını erken yakalarsınız.",
      sections: [
        { heading: "MVP ve test", body: "Fonksiyonel prototip ile montaj ve ergonomi testleri." },
        { heading: "Iterasyon", body: "Revizyonlu dosyalarla hızlı yeniden baskı." },
      ],
      faq: [
        { question: "Prototip ile seri üretim farkı?", answer: "Prototipte hız öncelikli; seri üretimde maliyet ve tekrarlanabilirlik optimize edilir." },
      ],
      cta: { href: "/ozel-baski#talep-form", label: "Prototip Teklifi", secondaryHref: "/3d-baski-kktc", secondaryLabel: "3D baskı" },
      related: [{ href: "/hizmetler/endustriyel-uretim", label: "Endüstriyel üretim" }],
    },
    en: {
      path: "/prototip-uretim-kibris",
      metaTitle: "Rapid Prototyping Cyprus | MVP Parts",
      metaDescription: "Fast prototyping with 3D printing in TRNC. FINAL3D.",
      h1: "Rapid Prototyping in Cyprus",
      intro: "Test parts in 24–48h to validate design early.",
      sections: [{ heading: "MVP", body: "Functional prototypes for fit and assembly tests." }],
      faq: [{ question: "Prototype vs production?", answer: "Prototypes prioritize speed; production optimizes cost at volume." }],
      cta: { href: "/ozel-baski#talep-form", label: "Get prototype quote" },
      related: [],
    },
    ru: {
      path: "/prototip-uretim-kibris",
      metaTitle: "Быстрое прототипирование Кипр",
      metaDescription: "Прототипы на 3D-принтере.",
      h1: "Прототипирование",
      intro: "Быстрые тестовые детали.",
      sections: [],
      faq: [],
      cta: { href: "/ozel-baski#talep-form", label: "Заявка" },
      related: [],
    },
    ar: {
      path: "/prototip-uretim-kibris",
      metaTitle: "نماذج أولية سريعة قبرص",
      metaDescription: "طباعة نماذج أولية.",
      h1: "إنتاج نماذج أولية",
      intro: "قطع اختبار سريعة.",
      sections: [],
      faq: [],
      cta: { href: "/ozel-baski#talep-form", label: "طلب عرض" },
      related: [],
    },
  },
};

export function getHubPage(slug: string, locale: Locale) {
  const page = hubs[slug];
  if (!page) return null;
  return pickLocale(page, locale);
}

export function getAllHubs() {
  return hubs;
}
