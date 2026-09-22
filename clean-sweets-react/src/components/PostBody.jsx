import { assetUrl, headingLike } from '../utils';

function NutritionBlock({ block }) {
  return (
    <div className="nutrition-block">
      {block.heading && <h3 className="nutrition-title">{block.heading}</h3>}
      {block.caption && <p className="nutrition-note">{block.caption}</p>}
      {(block.tables || []).map((table, i) => {
        const rows = table.rows || [];
        if (!rows.length) return null;
        return (
          <div key={i}>
            {table.label && <p className="nutrition-sub">{table.label}</p>}
            <table className="nutrition">
              <thead>
                <tr>
                  {rows[0].map((cell, c) => (
                    <th key={c}>{cell}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(1).map((row, r) => (
                  <tr key={r}>
                    {row.map((cell, c) => (
                      <td key={c}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

export default function PostBody({ body = [] }) {
  return (
    <div className="post__body wrap">
      {body.map((block, i) => {
        if (block.type === 'image') {
          return (
            <figure key={i}>
              <img loading="lazy" src={assetUrl(block.src)} alt={block.alt || ''} />
            </figure>
          );
        }
        if (block.type === 'nutrition') {
          return <NutritionBlock key={i} block={block} />;
        }
        if (block.type === 'heading') {
          return <h2 key={i}>{block.text}</h2>;
        }
        if (block.type === 'list') {
          const Tag = block.ordered ? 'ol' : 'ul';
          return (
            <Tag key={i}>
              {(block.items || []).map((item, j) => (
                <li key={j}>{typeof item === 'string' ? item : item}</li>
              ))}
            </Tag>
          );
        }
        if (block.type === 'table') {
          const rows = block.rows || [];
          if (!rows.length) return null;
          return (
            <table key={i} className="nutrition">
              <thead>
                <tr>
                  {rows[0].map((cell, c) => (
                    <th key={c}>{cell}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(1).map((row, r) => (
                  <tr key={r}>
                    {row.map((cell, c) => (
                      <td key={c}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          );
        }
        const text = block.text || '';
        if (headingLike(text)) {
          return <h3 key={i}>{text}</h3>;
        }
        return <p key={i}>{text}</p>;
      })}
    </div>
  );
}
