# סבב 7 — פריימים לרזולוציית דסקטופ

הסבב הזה לא בא לשנות שום קומפוזיציה שאושרה. הוא בא לפתור בעיה אחת נמדדת:
**התמונות של פנחס קטנות מכדי למלא מסך דסקטופ מודרני.**

## המדידה (2026-08-29)

כל דיוקן באתר נחתך מקובץ ברוחב ~1000px. מסך לפטופ מודרני הוא 2x — הוא מבקש
מהדפדפן פי שניים פיקסלים ממה שכתוב ב־CSS. מה שיוצא:

| מקום | תיבה בפועל (2x) | הקובץ | מתיחה |
|---|---|---|---|
| הירו של "יצירת קשר" ב־1440 | 1496×862 | 1000×908 | **1.50x** |
| הירו של "יצירת קשר" ב־1920 | 1994×878 | 1000×908 | **1.99x** |
| הדיוקן ברצועת ההצהרה (עמוד הבית) | 1690×1676 | 1000×908 | **1.85x** |
| אותה תמונת קשר בטלפון (390@3x) | 1170×1062 | 1000×908 | 1.17x |

זו בדיוק התחושה: **בטלפון חד, בדסקטופ מרוח.** בטלפון הקובץ כמעט בגודלו
הטבעי; בדסקטופ הדפדפן מותח אותו פי אחד וחצי עד פי שניים. שום CSS לא מתקן את
זה — רק פיקסלים.

## מה כבר מוכן בקוד

`photo()` יודע להגיש **קובץ דסקטופ נפרד** ברגע שהוא קיים. הכלל:

> קובץ בשם `<שם>-wide.webp` + `<שם>-wide.jpg` בתוך `site/public/assets/img/`
> יוגש אוטומטית לכל מסך רחב מ־860px. אין מה לשנות בקוד. אין קובץ — האתר ממשיך
> לעבוד בדיוק כמו היום.

כלומר: מייצרים, ממירים, זורקים לתיקייה, מריצים `node build.mjs`. זהו.

## כללי ברזל לכל התמונות בסבב

1. **חובה לצרף את תמונת הייחוס של פנחס.** בלי ייחוס יוצא אדם אחר. פסילה
   ראשונה היא תמיד סטיית זהות בפנים.
2. **אותו לבוש בדיוק** כמו בתמונות הקיימות: חליפה כחולה כהה, חולצה לבנה,
   עניבה בורדו, כיפה שחורה. התמונות יושבות זו לצד זו באותו אתר.
3. **בלי משרד.** ללקוח אין משרד שמקבל קהל — ספרייה, שולחן ישיבות או אדם נוסף
   ברקע מרמזים על מקום שלא קיים. (הכלל הזה מ־PHOTO-BRIEF.md, והוא עדיין תקף.)
4. **פלטה מרוסנת:** חום, פחם, עץ כהה, עור חם. לא רווי. רקע כהה `#14120f`,
   ברונזה `#7f633d`.
5. **אור חלון טבעי מהצד.** בלי פלאש, בלי רקע לבן חלק.

## Negative prompt — לכל הפריימים בסבב

```
gavel, judge hammer, scales of justice, law books, bookshelf, courtroom, office desk, meeting table, second person, computer screen, papers with readable text, hebrew text, letters, signage, watermark, logo, bright saturated colors, flash lighting, white background, wide smile, teeth, extra fingers, deformed hands, distorted face, plastic skin, oversharpened
```

---

## 1. `contact-hero-wide` — הכי דחוף

**גודל פלט: 2400×1350 (16:9). לא פחות.**
זה מה שמכסה גם מסך 1920 ברזולוציה כפולה בלי מתיחה.

התיבה בדסקטופ נעה בין 1.74:1 (ב־1440) ל־2.27:1 (ב־1920) — הפריים ייחתך
בגובה בשתי הצורות. לכן: **ראש בשליש העליון, אוויר משני הצדדים**, ושום דבר
חשוב לא נוגע בקצה העליון או התחתון.

```
Cinematic photograph, 16:9, ultra high resolution. [use the attached reference image for the man's face and likeness]. The same man from the reference — dark navy tailored suit, white shirt, burgundy tie, black kippah — stands beside a tall window in a quiet interior of dark stained wood. Photographed from the chest up, three-quarter view, turned slightly toward the camera with a calm, open, unhurried expression — approachable rather than posed. His head sits in the UPPER THIRD of the frame with generous empty space on both sides, so the frame can be cropped to anything from 1.7:1 to 2.3:1 without cutting him. Soft warm window light from the side models his face; the background falls into deep near-black shadow with only the faint vertical line of a dark wood panel. Muted palette: charcoal, deep brown, warm skin tones, navy. Photorealistic, 85mm lens, f/2.8, natural light only, restrained, low-key, sharp focus on the eyes.
```

## 2. `closing-portrait-left-wide` — הדיוקן ברצועת ההצהרה

**גודל פלט: 2000×1800 (בערך 1.1:1).**

כאן יש בעיה שנייה מעבר לרזולוציה, וכדאי לפתור את שתיהן במכה אחת: **הדיוקן
הזה כמעט זהה לדיוקן בסקציית "אודות"** שיושבת מסך וחצי מתחתיו — אותה חליפה,
אותו חיוך, אותו רקע. הקורא רואה את אותה תמונה פעמיים.

לכן הפעם **לא דיוקן חזיתי מחייך**, אלא רגע של עבודה:

```
Cinematic photograph, nearly square 1.1:1, ultra high resolution. [use the attached reference image for the man's face and likeness]. The same man from the reference — dark navy suit, white shirt, black kippah, jacket open — stands at a tall dark wood surface, looking DOWN at an unrolled architectural site plan, one hand resting flat on the paper. He is seen from the side in three-quarter profile, absorbed in the document, not looking at the camera. Warm window light rakes across the plan from the left and catches the side of his face; everything behind him drops into deep near-black shadow. The drawing itself is soft and out of focus — lines and hatching only, no readable text. Muted palette: charcoal, deep brown, warm paper, navy. Photorealistic, 85mm lens, f/2.5, shallow depth of field, natural light only, restrained, low-key.
```

אם היוצא לא משכנע — חלופה בטוחה יותר, בלי פנים בכלל: ידיים על תשריט פרוס,
אותו אור, אותה פלטה. פריים כזה גם פותר את הכפילות מיידית.

## 3. `practice-hero-wide` + `about-hero-wide` — כשיהיה זמן

**2400×1350 כל אחד.** אותה בעיה בדיוק (קבצי 1000px), פחות דחוף כי הן לא
העמוד שאליו מגיעים כדי ליצור קשר. אפשר להשתמש באותו פרומפט של סעיף 1 עם
שינוי אחד: ב־`about-hero` מבט ישיר למצלמה, ב־`practice-hero` מבט הצידה.

---

## המרה והכנסה לאתר

לכל תמונה צריך **שני קבצים** — webp ו־jpg. בלי אחד מהם המנגנון לא יופעל
(בכוונה: קובץ בודד היה משאיר גיבוי שבור).

```bash
# מתוך התיקייה שבה נמצאת התמונה שיצאה מהמודל
cwebp -q 80 contact-hero-wide.png -o contact-hero-wide.webp
magick contact-hero-wide.png -quality 82 -strip contact-hero-wide.jpg
```

או, אם `sharp` מותקן:

```bash
npx sharp-cli -i contact-hero-wide.png -o contact-hero-wide.webp -f webp -q 80
npx sharp-cli -i contact-hero-wide.png -o contact-hero-wide.jpg  -f jpeg -q 82
```

יעד משקל: **webp עד 220KB, jpg עד 400KB**. אלה קבצים כפולים בגודלם מהקיימים
ולכן כבדים יותר — זה בסדר, הם נטענים רק בדסקטופ.

אחר כך:

```bash
cp contact-hero-wide.* site/public/assets/img/
cd site && node build.mjs && node check.mjs
```

ולבדיקה שזה באמת נכנס:

```bash
grep -c 'contact-hero-wide' dist/contact/index.html   # אמור להחזיר 2
```

## פסילה

- הפנים לא זהות לייחוס → פסילה מיידית, בלי דיון.
- הפריים יצא קטן מהמידה שרשומה למעלה → פסילה. הקטנה תמיד אפשרית, הגדלה לא.
- טקסט קריא כלשהו בפריים (עברית או אנגלית) → פסילה; המודלים ממציאים אותיות.
- חיוך רחב עם שיניים → לא הטון של האתר.
