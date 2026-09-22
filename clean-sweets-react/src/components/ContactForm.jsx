import { useState } from 'react';

export default function ContactForm({ variant = 'plain' }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const footer = variant === 'footer';

  function handleSubmit(event) {
    event.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 500);
  }

  if (sent) {
    return <p className={footer ? 'footer-thanks' : ''} style={footer ? undefined : { color: '#ececdb', fontSize: '1.1rem' }}>תודה! ההודעה נשלחה בהצלחה.</p>;
  }

  return (
    <form className={footer ? 'form form--footer' : 'form'} onSubmit={handleSubmit}>
      <div className={footer ? 'form__row' : undefined}>
        <label>
          כתובת מייל *
          <input type="email" name="email" required />
        </label>
        <label>
          שם מלא *
          <input name="name" required />
        </label>
      </div>
      <label>
        {footer ? null : 'הודעה'}
        <textarea name="message" placeholder={footer ? 'מוזמנים לשתף אותי פה בשאלות, הצעות ובקשות לתכנים' : undefined} />
      </label>
      <button className={footer ? 'btn btn--send' : 'btn'} type="submit" disabled={sending}>
        {sending ? 'שולח...' : 'שלח'}
      </button>
    </form>
  );
}
