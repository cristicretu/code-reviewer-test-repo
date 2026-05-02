import { useState } from "react";
import { supabase } from "./supabase";
import "./App.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Waitlist() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError("Please enter a valid email.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.from("waitlist").insert({ email });
      if (error) throw error;
      setDone(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="waitlist" onSubmit={submit}>
      <div className="waitlist-row">
        <input
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email address"
        />
        <button className="btn btn-primary" disabled={loading}>
          {done ? "On the list ✓" : "Join waitlist"}
        </button>
      </div>
      {error && <p className="waitlist-error">{error}</p>}
    </form>
  );
}

const features = [
  {
    title: "Focus sessions",
    description:
      "Block distractions across every device with a single tap. Halcyon syncs your focus state so notifications stay quiet until you're done.",
  },
  {
    title: "Ambient soundscapes",
    description:
      "Forty hand-recorded environments — from rainy cafés to alpine forests — engineered to keep you in flow without fatigue.",
  },
  {
    title: "Weekly reflections",
    description:
      "A two-minute review every Friday surfaces the patterns behind your best work, so you can do more of it next week.",
  },
];

const plans = [
  {
    name: "Solo",
    price: "$8",
    period: "/month",
    blurb: "For individuals who want their best hours back.",
    features: ["Unlimited focus sessions", "All soundscapes", "Weekly reflections"],
    cta: "Start free trial",
    featured: false,
  },
  {
    name: "Team",
    price: "$14",
    period: "/seat / month",
    blurb: "Shared focus rituals for small teams that ship.",
    features: ["Everything in Solo", "Team focus rooms", "Admin & SSO"],
    cta: "Talk to sales",
    featured: true,
  },
];

function App() {
  return (
    <div className="page">
      <header className="nav">
        <a className="brand" href="#top">
          <span className="brand-mark" aria-hidden />
          Halcyon
        </a>
        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#story">Story</a>
        </nav>
        <a className="nav-cta" href="#pricing">
          Get Halcyon
        </a>
      </header>

      <main>
        <section className="hero" id="top">
          <span className="eyebrow">Now in public beta</span>
          <h1>
            Deep work,
            <br />
            on demand.
          </h1>
          <p className="lede">
            Halcyon is the calm operating layer for your workday. Block the noise,
            tune the room, and ship the thing you've been putting off.
          </p>
          <Waitlist />
          <p className="hero-meta">
            Loved by 14,000+ builders at Linear, Vercel, Figma, and more.
          </p>
        </section>

        <section className="features" id="features">
          <h2>Built for the way good work actually happens.</h2>
          <div className="feature-grid">
            {features.map((f) => (
              <article key={f.title} className="feature">
                <h3>{f.title}</h3>
                <p>{f.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="story" id="story">
          <blockquote>
            "I used to start my day with email. Now I start it with a Halcyon
            session and twenty minutes of rain on a tin roof. I get more done
            before lunch than I used to in a week."
          </blockquote>
          <cite>— Mira Okafor, Staff Engineer at Northwind</cite>
        </section>

        <section className="pricing" id="pricing">
          <h2>Simple pricing. Cancel anytime.</h2>
          <div className="plans">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`plan${plan.featured ? " plan-featured" : ""}`}
              >
                <h3>{plan.name}</h3>
                <p className="plan-price">
                  <span className="amount">{plan.price}</span>
                  <span className="period">{plan.period}</span>
                </p>
                <p className="plan-blurb">{plan.blurb}</p>
                <ul>
                  {plan.features.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <a
                  className={`btn ${plan.featured ? "btn-primary" : "btn-ghost"}`}
                  href="#"
                >
                  {plan.cta}
                </a>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <span>© {new Date().getFullYear()} Halcyon Labs, Inc.</span>
          <span className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="mailto:hello@halcyon.app">hello@halcyon.app</a>
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
