import { useState } from 'react';

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 500);
  }

  if (sent) {
    return <p style={{ color: '#ececdb', fontSize: '1.1rem' }}>תודה! ההודעה נשלחה בהצלחה.</p>;
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label htmlFor="c-name">שם מלא *</label>
      <input id="c-name" name="name" required />
      <label htmlFor="c-email">כתובת מייל *</label>
      <input id="c-email" type="email" name="email" required />
      <label htmlFor="c-msg">הודעה</label>
      <textarea id="c-msg" name="message" />
      <button className="btn" type="submit" disabled={sending}>
        {sending ? 'שולח...' : 'שלח'}
      </button>
    </form>
  );
}
