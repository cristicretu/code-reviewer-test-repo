import { useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify({ name, email, message }),
    });
    setSubmitted(true);
  }

  return (
    <form onSubmit={submit}>
      <input name="name" value={name} onChange={(e) => setName(e.target.value)} />
      <input name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <textarea name="message" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button type="submit">Send</button>
      {submitted && <p>Thanks!</p>}
    </form>
  );
}
