import { Link } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import { useTitle } from '../utils';

const CATEGORY_META = [
  { name: 'דל בקלוריות', slug: 'דל-בקלוריות' },
  { name: 'לסכרתיים וקטוגנים', slug: 'לקטוגנים-לסכרתיים' },
  { name: 'ללא לקטוז', slug: 'ללא-לקטוז' },
  { name: 'עשיר בחלבון', slug: 'עשיר-בחלבון' },
];

export default function Categories() {
  const { categories } = usePosts();
  useTitle('קטגוריות');

  const items = CATEGORY_META.filter((c) => categories.includes(c.name));

  return (
    <>
      <section className="hero wrap">
        <h1>Categories List</h1>
      </section>
      <section className="section wrap">
        <div className="cat-grid">
          {items.map((cat) => (
            <Link key={cat.name} className="cat" to={`/blog?cat=${encodeURIComponent(cat.name)}`}>
              {cat.name}
              <small>{cat.slug}</small>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
