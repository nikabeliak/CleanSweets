import { Link } from 'react-router-dom';
import { useTitle } from '../utils';

export default function NotFound() {
  useTitle('העמוד לא נמצא');

  return (
    <section className="hero wrap">
      <h1>העמוד לא נמצא</h1>
      <p>נראה שהגעתם לכתובת שלא קיימת.</p>
      <p><Link className="btn btn--solid" to="/">חזרה לבית</Link></p>
    </section>
  );
}
