/* Home page content (October 12 restructure). Everything here already exists elsewhere on the
   site in the client's own words, or is a fact from the About page; nothing
   is invented. Fields marked `managed` are Manager Site slots on the live
   home page: keep their data-manager-text marker on the element that holds
   that text, exactly once per page. */

import { BIZ } from '../site.mjs';

const HOME_FAQS = [
  {
    q: 'אני קונה דירה מקבלן.\nצריך עורך דין מטעמי?',
    a: 'כן. עורך הדין של הקבלן מייצג את הקבלן.\n\nחשוב לבדוק את תנאי ההסכם, מועדי המסירה, הערבויות ותנאי התשלום.',
  },
  {
    q: 'מה ההבדל בין צו ירושה לצו קיום צוואה?',
    a: 'כשאין צוואה, החלוקה נעשית לפי חוק הירושה ומוגשת בקשה לצו ירושה. כשיש צוואה, מגישים בקשה לצו קיום צוואה שנותן לה תוקף. שתי הבקשות מוגשות לרשם לענייני ירושה, ובמקרים מסוימים מועברות לבית המשפט לענייני משפחה.',
  },
  {
    q: 'מתי כדאי לערוך ייפוי כוח מתמשך?',
    a: 'אפשר לערוך אותו כל עוד האדם כשיר ומבין את משמעות המסמך. הוא מאפשר לקבוע מראש מי יטפל בענייניכם ואילו הנחיות יחולו.',
  },
  {
    q: 'שילמתי מס שבח. אפשר לקבל החזר?',
    a: 'לעיתים כן. החזרים נובעים בדרך כלל מפטורים שלא נוצלו, מחישוב לינארי, מפריסת מס או מהוצאות מוכרות שלא נכללו בדיווח המקורי. להגשת השגה קבועים בחוק מועדים, ולכן כדאי לבדוק מוקדם.',
  },
  {
    q: 'באילו אזורים אתה מטפל?',
    a: `${BIZ.areaServed.slice(0, 6).join(', ')} ויתר אזור גוש דן והמרכז. חלק ניכר מהעבודה ממילא מתנהל מול לשכות רישום, רשות המסים ורשם הירושות, ולכן המרחק פחות קריטי ממה שנדמה.`,
  },
];

export const HERO = {
  name: 'עו״ד פנחס רצון',
  services: 'מקרקעין, מיסוי, צוואות וירושות',
  /* managed: hero.subtitle. The live slot still reads "ליווי אישי בקנייה
     ובמכירה של נכס, / מהבדיקות לפני החתימה ועד לרישום הזכויות."; this
     version also speaks to the family visitor and would ship as a
     managed-text-updates.json migration. The \n is a deliberate line break. */
  subtitle: 'ליווי אישי בעסקאות נכסים, בירושות ובצוואות,\nמהבדיקה הראשונה ועד לרישום הזכויות.',
  subtitleMarker: 'hero.subtitle',
  location: `${BIZ.city} והמרכז`,
  link: { href: '#situations', label: 'איפה אתם עומדים' },
};

/* The practice areas grouped by the visitor's life moment instead of a
   numbered list of six. Each item links to its practice page. */
export const SITUATIONS = {
  id: 'situations',
  label: 'תחומי עיסוק',
  h2: 'איפה אתם עומדים',
  groups: [
    {
      title: 'נכס',
      note: 'קנייה, מכירה, מס ורישום',
      items: [
        { slug: 'real-estate-transactions', title: 'קנייה או מכירה של נכס', line: 'בדיקת הנכס וההסכם, טיפול במס וליווי עד רישום הזכויות.' },
        { slug: 'real-estate-tax', title: 'מיסוי מקרקעין', line: 'בדיקת המס לפני החתימה, פטורים אפשריים, דיווח לרשויות והחזרי מס.' },
        { slug: 'condominium-registration', title: 'רישום בית משותף', line: 'רישום ותיקון צו בית משותף, כולל חניות ומחסנים הצמודים לדירות.' },
        { slug: 'partition-receivership', title: 'נכס בבעלות משותפת', line: 'מחלוקת בין שותפים בנכס: הסכם, פירוק שיתוף או הליך כינוס נכסים.' },
      ],
    },
    {
      title: 'משפחה וירושה',
      note: 'צוואה, ירושה ותכנון מראש',
      items: [
        { slug: 'wills-inheritance', title: 'צוואות וירושות', line: 'עריכת צוואה, צו ירושה או צו קיום צוואה, והסכמות בין יורשים.' },
        { slug: 'enduring-power-of-attorney', title: 'ייפוי כוח מתמשך', line: 'מסמך שקובע מראש מי יטפל בענייניכם אם תזדקקו לכך. מוסמך מטעם האפוטרופוס הכללי.' },
      ],
    },
  ],
  /* Two of the client's own sentences (practice index lead, About page). */
  together: 'כשבתיק אחד יש כמה נושאים, אני בודק אותם יחד. לדוגמה, מכירת דירה שהתקבלה בירושה נוגעת גם לזכויות בנכס, למיסוי ולרישום.',
};

/* "How I work": the statement's managed title and three managed paragraphs,
   each now under its principle's heading. */
export const METHOD = {
  label: 'דרך העבודה',
  title: 'מה בודקים לפני החתימה?',
  titleMarker: 'content.statement.title',
  steps: [
    { h3: 'בדיקה לפני התחייבות', marker: 'content.statement.paragraph1', body: 'אני מתחיל בבדיקת המסמכים: הזכויות בנכס, המצב התכנוני וההתחייבויות בהסכם.' },
    { h3: 'מס בשלב התכנון', marker: 'content.statement.paragraph2', body: 'בהמשך נבדקים המיסוי ורישום הזכויות. אם יש פרט שצריך לברר או להסדיר, חשוב לטפל בו לפני שמתחייבים לעסקה.' },
    { h3: 'ליווי עד הרישום', marker: 'content.statement.paragraph3', body: 'אני מטפל גם בהסכם ובדיווחים לרשויות, ומלווה את העסקה עד לרישום הזכויות.' },
  ],
};

export const ABOUT = {
  label: 'אודות',
  h2: 'עם מי תעבדו',
  lead: 'אני עורך דין מאז 2011. עיקר העבודה שלי הוא בעסקאות מקרקעין, במיסוי מקרקעין, בצוואות ובירושות.',
  leadMarker: 'about.home.lead',
  note: 'לאורך הטיפול אפשר לפנות אליי ישירות.',
  noteMarker: 'about.home.note',
  /* Facts from the About page's credentials list. Prose or a quiet list,
     never a trust strip or vanity numbers. */
  credentials: [
    `חבר לשכת עורכי הדין בישראל משנת ${BIZ.founded}`,
    'תואר ראשון במשפטים (LL.B), הקריה האקדמית אונו',
    'מוסמך לעריכת ייפוי כוח מתמשך מטעם האפוטרופוס הכללי',
    'עברית ואנגלית',
  ],
  office: `${BIZ.reception} · ${BIZ.addressHuman}`,
  link: { href: '/about/', label: 'עוד עליי' },
};

export const FAQ = {
  h2: 'שאלות נפוצות',
  description: 'על קניית דירה, מיסוי, צוואות וירושות.',
  descriptionMarker: 'faq.home.title',
  items: HOME_FAQS, // { q, a } with \n line breaks inside q and \n\n paragraph breaks inside a
  more: { href: '/faq/', label: 'לכל השאלות' },
};

/* The closing: reassurance first (the contact page's own three steps), then
   the channels, then the one button. */
export const CLOSING = {
  h2: 'נדבר על המקרה שלכם',
  sub: 'אפשר להתקשר אליי או להשאיר פרטים. אחזור אליכם לשיחה.',
  stepsTitle: 'מה קורה אחרי שפונים',
  steps: [
    { h3: 'שיחה קצרה', body: 'נברר מה נדרש, אם יש מועד קרוב לטיפול ואילו מסמכים נמצאים ברשותכם.' },
    { h3: 'בדיקה והצעת שכר טרחה', body: 'אברר מה צריך לבדוק ואציג את סדר הפעולות והצעת שכר הטרחה לפני תחילת הטיפול.' },
    { h3: 'טיפול בתיק', body: 'בעסקת מקרקעין אני מלווה את הבדיקות, ההסכם והרישום. בתיקים אחרים הטיפול נקבע לפי העניין.' },
  ],
  office: `${BIZ.reception} · ${BIZ.addressHuman}`,
  phone: BIZ.phone,
  telHref: `tel:${BIZ.phoneE164}`,
  whatsapp: BIZ.whatsapp,
  email: BIZ.email,
  cta: { href: '/contact/', label: 'להשארת פרטים' }, // must carry class "closing-cta" (opens the lead dialog) and "btn"
};

export const META = {
  title: `עורך דין מקרקעין וצוואות ב${BIZ.city} | ${BIZ.shortName}`,
  description: `עו״ד פנחס רצון, ${BIZ.yearsExperience} שנות ניסיון בעסקאות מקרקעין, מיסוי, רישום בתים משותפים, צוואות וירושות ב${BIZ.city} ובמרכז.`,
};
