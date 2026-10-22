import { useRef } from 'react';
import emailjs from '@emailjs/browser';

export function ContactForm() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      'service_194xhdp',       // Service ID
      'template_yijobd4',      // Template ID
      form.current,
      '3GKBcr-kZRuTzMZn9'        // Public Key
    )
    .then(() => {
      alert('Mesaj gönderildi');
      form.current.reset();
    })
    .catch((err) => {
      alert('Hata oluştu ' + err.text);
    });
  };

  return (
    <form ref={form} onSubmit={sendEmail}>
      <input type="text" name="user_name" placeholder="Adınız" required />
      <input type="email" name="user_email" placeholder="E-posta" required />
      <textarea name="message" placeholder="Mesajınız" required rows="4" />
      <button type="submit">Gönder</button>
    </form>
  );
}