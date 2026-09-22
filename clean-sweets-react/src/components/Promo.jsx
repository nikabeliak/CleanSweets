import ContactForm from './ContactForm';
import { useTitle } from '../utils';

const GALLERY = [
  '/images/49aa8c_0901d33216174d70a701a553b095ad09_mv2.jpg',
  '/images/49aa8c_b2f5401c43e14a4195bb32c512baa06f_mv2.jpg',
  '/images/49aa8c_8ee443cb0e5f4ce1997baad5b8c45959_mv2.jpg',
  '/images/49aa8c_991f40525f2d4dfbafff9a1c653b0cfc_mv2.jpg',
];

export default function Promo() {
  useTitle('הנחה ניצת הדובדבן');

  return (
    <>
      <section className="hero wrap">
        <h1>קוד מועדון להנחה בניצת הדובדבן</h1>
        <div className="promo">
          <div className="code">600161</div>
          <p>5% הנחה על כל המוצרים</p>
          <p>כולל כפל מבצעים</p>
          <p>הקוד תקף לכולם וניתן למימוש בכל סניפי ניצת הדובדבן ובאונליין</p>
          <p>כל מה שעליכם לעשות זה לתת את קוד המועדון בקופה בסיום הרכישה או להקליד אותו בהערות להזמנה בהזמנות באונליין</p>
        </div>
      </section>
      <section className="section wrap">
        <div className="split section--tight">
          {GALLERY.map((src) => (
            <img key={src} loading="lazy" src={src} alt="" />
          ))}
        </div>
        <p>אני מאמינה בשקיפות מלאה</p>
        <p>אז מה אני מקבלת מזה?</p>
        <p>בסוף כל חודש, אם סל הקניות של כולנו ביחד מגיע לסכום מסוים, אני מקבלת נקודות זיכוי בניצת הדובדבן לקניות שלי. הזיכוי הזה יעזור לי לרכוש עוד חומרי גלם ולפתח עוד המון מתכונים בריאים וטעימים בשבילכם.</p>
        <p>אז אם אתם רוצים לחסוך קצת בקנייה הבאה שלכם, ועל הדרך רוצים לתמוך בי כיוצרת כדי שאוכל להמשיך להשקיע בעמוד ולעזור לכם חזרה, מוזמנים באהבה להשתמש בקוד המועדון שלי. זה באמת עוזר לי להמשיך לעשות את מה שאני עושה.</p>
        <p>תודה ענקית לכם, זה ממש לא מובן מאליו!</p>
        <p>יש לכם שאלה על מוצר מסוים, על ערכים תזונתיים או על מתכון, תרגישו חופשי לכתוב לי כאן למטה או ברשתות החברתיות, אני תמיד כאן בשבילכם :)</p>
      </section>
      <section className="newsletter">
        <div className="wrap">
          <h2>פה כדי להקשיב לכם</h2>
          <p>מוזמנים לשתף אותי פה בשאלות, הצעות ובקשות לתכנים</p>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
