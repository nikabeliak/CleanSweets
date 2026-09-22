import { useState, useEffect } from 'react';

const CATEGORIES = ['דל בקלוריות', 'לסכרתיים וקטוגנים', 'ללא לקטוז', 'עשיר בחלבון'];

const ARTICLES = [
  {
    id: 'tips',
    slug: 'טיפים-להמרת-מתכונים-רגילים',
    title: 'טיפים להמרת מתכונים רגילים לקינוחים בריאים ללא קמח וללא סוכר',
    excerpt: 'אל תתנו לקמח ולסוכר להגביל אתכם – כך תהפכו כל מתכון קלאסי לקינוח בריא שמתאים בדיוק לתזונה שלכם',
    image: '/images/49aa8c_d8ced704b7a9456c9206801e1dfb4f5b_mv2.jpg',
  },
  {
    id: 'gelatin',
    slug: 'גלטין-הסוד-הטעים',
    title: "ג'לטין: הסוד הטעים לעור זוהר ומפרקים חזקים",
    excerpt: 'מדוע ג\'לטין קיבל מוניטין שלילי, למה אני מקפידה לצרוך אותו, ואיך הוא תורם לבריאות העור, המפרקים והמעיים',
    image: '/images/49aa8c_ef5fee79ea4f40ee883ef64473f7a2ae_mv2.png',
  },
  {
    id: 'desk-life',
    slug: 'צעדים-פשוטים-חיים-משרדיים',
    title: 'כמה צעדים פשוטים שיהפכו את החיים המשרדיים שלכם לבריאים יותר',
    excerpt: 'להרגיש טוב גם אחרי יום מול המחשב',
    image: '/images/49aa8c_47b5134f049e4899ad280b6090e089d9_mv2.png',
  },
  {
    id: 'ricotta',
    slug: 'ריקוטה-גבינת-האלים',
    title: 'ריקוטה: "גבינת האלים" שאתם חייבים להכיר',
    excerpt: 'היא עדינה, היא מתקתקה, והיא הסוד השמור של חובבי התזונה הבריאה. אם עדיין לא הכרתם את גבינת הריקוטה – הגיע הזמן להתאהב',
    image: '/images/49aa8c_bc2c0c8d1b0d405db72e159bf3d693df_mv2.jpg',
  },
  {
    id: 'cocoa',
    slug: 'אבקת-קקאו-בריאה',
    title: 'האם הייתם רוצים להשתמש באבקת קקאו שהיא גם בריאה',
    excerpt: 'המספרים שמסתתרים מאחורי האריזות',
    image: '/images/49aa8c_59e01b01bf3c44a69abb4ce9269f5489_mv2.png',
  },
  {
    id: 'sweeteners',
    slug: 'הממתיקים-שמתויגים-כבריאים',
    title: 'הממתיקים שמתויגים כבריאים מי נגד מי ואיזה מתאים לכם',
    excerpt: 'בואו נעשה קצת סדר בין הסטיביה, הדבש, האריתריטול ופרי הנזירים',
    image: '/images/49aa8c_b53d1f3a35d940ef832b88b08b537113_mv2.jpg',
  },
];

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/posts.json')
      .then((r) => r.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { posts, loading, categories: CATEGORIES };
}

export function useArticles() {
  return ARTICLES;
}