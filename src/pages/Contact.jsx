import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { toast } from 'react-hot-toast'

const INFO_CARDS = [
  {
    icon: 'flaticon-location',
    title: 'Visit Us',
    lines: ['171/C/1 Binay Singh Colony,', 'Picnic Garden Road,', 'Kolkata 700039, West Bengal'],
  },
  {
    icon: 'flaticon-phone-call',
    title: 'Call Us',
    lines: ['+91 7980781793'],
    sub: 'Mon – Sat: 10AM – 8PM',
  },
  {
    icon: 'flaticon-mail',
    title: 'Email Us',
    lines: ['support@boujeebazar.in'],
    sub: 'We reply within 24 hours',
  },
  {
    icon: 'flaticon-clock',
    title: 'Store Hours',
    lines: ['Mon – Sat: 10AM – 8PM', 'Sunday: 11AM – 6PM'],
  },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleInput = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    const { name, email, message } = form
    if (!name || !email || !message) { toast.error('Please fill in name, email, and message'); return }
    setSending(true)
    try {
      const { error } = await supabase.from('contacts').insert([{ ...form, created_at: new Date().toISOString() }])
      if (error) throw error
      setSent(true)
      toast.success("Message sent! We'll get back to you soon.")
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err) {
      console.error(err)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <main>
      {/* BREADCRUMB */}
      <div className="ul-container">
        <div className="ul-breadcrumb">
          <h2 className="ul-breadcrumb-title">Contact Us</h2>
          <div className="ul-breadcrumb-nav">
            <Link to="/"><i className="flaticon-home"></i> Home</Link>
            <i className="flaticon-arrow-point-to-right"></i>
            <span className="current-page">Contact</span>
          </div>
        </div>
      </div>

      {/* COVER BANNER */}
      <div className="ul-about-cover-img" style={{ marginBottom: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=80"
          alt="Contact Boujee Bazar"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.42)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px' }}>
          <span className="ul-section-sub-title" style={{ color: '#f5d97e' }}>We're Here for You</span>
          <h2 style={{ color: '#fff', fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900, margin: '8px 0 16px', letterSpacing: '-0.02em' }}>
            Let's Start a Conversation
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 'clamp(14px, 1vw, 17px)', maxWidth: '520px', lineHeight: 1.7 }}>
            Have a question about your order, our products, or anything else? Our team is ready to help.
          </p>
        </div>
      </div>

      {/* INFO CARDS */}
      <div className="ul-container">
        <div className="ul-inner-container" style={{ paddingTop: 'clamp(40px, 4vw, 70px)', paddingBottom: 0 }}>
          <div className="row ul-bs-row row-cols-lg-4 row-cols-sm-2 row-cols-1">
            {INFO_CARDS.map(card => (
              <div key={card.title} className="col">
                <div style={{
                  background: '#fff',
                  border: '1.5px solid #ede8e0',
                  borderRadius: '20px',
                  padding: 'clamp(24px, 2.1vw, 36px) clamp(20px, 1.6vw, 28px)',
                  height: '100%',
                  textAlign: 'center',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                }}>
                  <div style={{
                    width: '64px', height: '64px',
                    background: 'linear-gradient(135deg, #f5f0e8 0%, #ede4d0 100%)',
                    borderRadius: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 18px',
                  }}>
                    <i className={card.icon} style={{ fontSize: '26px', color: '#c8961e' }}></i>
                  </div>
                  <h4 style={{ fontWeight: 800, fontSize: '15px', marginBottom: '10px', color: '#1a1a1a' }}>{card.title}</h4>
                  {card.lines.map(line => (
                    <p key={line} style={{ color: '#555', fontSize: '13.5px', margin: '0 0 2px', lineHeight: 1.75 }}>{line}</p>
                  ))}
                  {card.sub && <p style={{ color: '#999', fontSize: '12px', marginTop: '6px', margin: 0 }}>{card.sub}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FORM + SOCIAL */}
      <div className="ul-container">
        <div className="ul-inner-container" style={{ paddingBottom: 'clamp(50px, 5vw, 90px)' }}>
          <div className="row ul-bs-row" style={{ alignItems: 'flex-start', marginTop: 'clamp(40px, 4vw, 60px)' }}>

            {/* LEFT — intro + social */}
            <div className="col-lg-4 col-md-5">
              <div style={{ paddingRight: 'clamp(0px, 2vw, 32px)', paddingTop: '8px' }}>
                <span className="ul-section-sub-title">Get In Touch</span>
                <h2 className="ul-section-title" style={{ marginBottom: '16px' }}>
                  We'd Love to Hear From You
                </h2>
                <p style={{ color: '#666', lineHeight: 1.9, fontSize: '14px', marginBottom: '32px' }}>
                  Whether you have a question about a product, need help with an order, or just want to say hello — fill out the form and we'll be in touch within 24 hours.
                </p>

                {/* Social links */}
                <div style={{ marginBottom: '32px' }}>
                  <h5 style={{ fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px', color: '#1a1a1a' }}>Follow Us</h5>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {[
                      { icon: 'flaticon-instagram',          label: 'Instagram' },
                      { icon: 'flaticon-facebook-app-symbol', label: 'Facebook'  },
                      { icon: 'flaticon-youtube',             label: 'YouTube'   },
                    ].map(({ icon, label }) => (
                      <a key={label} href="#" title={label} style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        background: '#1a1a1a', color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '17px', textDecoration: 'none', transition: 'background 0.2s',
                      }}>
                        <i className={icon}></i>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Quick note */}
                <div style={{ background: '#fdf8ef', border: '1.5px solid #ede4ca', borderRadius: '16px', padding: '20px 22px' }}>
                  <i className="flaticon-delivery-truck" style={{ fontSize: '22px', color: '#c8961e', display: 'block', marginBottom: '10px' }}></i>
                  <h5 style={{ fontWeight: 800, fontSize: '14px', marginBottom: '6px' }}>Order Support</h5>
                  <p style={{ color: '#666', fontSize: '13px', lineHeight: 1.7, margin: 0 }}>
                    For order tracking, returns, or exchange requests, please include your order ID in your message for faster assistance.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT — form */}
            <div className="col-lg-8 col-md-7">
              <div style={{
                background: '#faf8f5',
                border: '1.5px solid #ede8e0',
                borderRadius: '24px',
                padding: 'clamp(28px, 3vw, 48px)',
              }}>
                {sent ? (
                  <div style={{ textAlign: 'center', padding: '48px 0' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#edf9f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                      <i className="flaticon-check" style={{ fontSize: '36px', color: '#27ae60' }}></i>
                    </div>
                    <h3 style={{ fontWeight: 800, marginBottom: '12px' }}>Message Sent!</h3>
                    <p style={{ color: '#666', fontSize: '15px', maxWidth: '380px', margin: '0 auto 28px', lineHeight: 1.7 }}>
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                    <button onClick={() => setSent(false)} className="ul-btn">
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 style={{ fontWeight: 800, fontSize: 'clamp(18px, 1.6vw, 24px)', marginBottom: '28px', color: '#1a1a1a' }}>
                      Send Us a Message
                    </h3>
                    <form onSubmit={handleSubmit}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                        {[
                          { field: 'name',    label: 'Your Name *',      type: 'text',  full: false },
                          { field: 'email',   label: 'Email Address *',  type: 'email', full: false },
                          { field: 'phone',   label: 'Phone Number',     type: 'tel',   full: false },
                          { field: 'subject', label: 'Subject',          type: 'text',  full: false },
                        ].map(({ field, label, type }) => (
                          <div key={field}>
                            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#444' }}>
                              {label}
                            </label>
                            <input
                              name={field} type={type} value={form[field]} onChange={handleInput}
                              placeholder={label.replace(' *', '')}
                              style={{
                                width: '100%', padding: '13px 16px',
                                border: '1.5px solid #ddd', borderRadius: '10px',
                                fontSize: '14px', background: '#fff', outline: 'none',
                                boxSizing: 'border-box', transition: 'border-color 0.2s',
                                fontFamily: 'inherit', color: '#1a1a1a',
                              }}
                              onFocus={e => (e.target.style.borderColor = '#c8961e')}
                              onBlur={e => (e.target.style.borderColor = '#ddd')}
                            />
                          </div>
                        ))}

                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#444' }}>
                            Your Message *
                          </label>
                          <textarea
                            name="message" value={form.message} onChange={handleInput}
                            placeholder="How can we help you? Tell us about your query..."
                            rows={5}
                            style={{
                              width: '100%', padding: '13px 16px',
                              border: '1.5px solid #ddd', borderRadius: '10px',
                              fontSize: '14px', background: '#fff', outline: 'none',
                              resize: 'vertical', boxSizing: 'border-box',
                              fontFamily: 'inherit', color: '#1a1a1a', transition: 'border-color 0.2s',
                            }}
                            onFocus={e => (e.target.style.borderColor = '#c8961e')}
                            onBlur={e => (e.target.style.borderColor = '#ddd')}
                          />
                        </div>
                      </div>

                      <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <button type="submit" disabled={sending} className="ul-btn" style={{ opacity: sending ? 0.7 : 1 }}>
                          {sending ? 'Sending…' : 'Send Message'} <i className="flaticon-up-right-arrow"></i>
                        </button>
                        <p style={{ color: '#999', fontSize: '12px', margin: 0 }}>
                          We usually respond within 24 hours
                        </p>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* MAP SECTION */}
      <div style={{ background: '#f5f2ed', paddingTop: 'clamp(40px, 4vw, 70px)', paddingBottom: 'clamp(40px, 4vw, 70px)' }}>
        <div className="ul-container">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(28px, 2.5vw, 44px)' }}>
            <span className="ul-section-sub-title">Find Us</span>
            <h2 className="ul-section-title">Our Location</h2>
          </div>
          <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 30px rgba(0,0,0,0.1)', border: '1.5px solid #ede8e0', aspectRatio: '16/5', minHeight: '260px' }}>
            <iframe
              title="Boujee Bazar Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3685.948673282498!2d88.37868707502563!3d22.519832979520855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0271c7b2c22345%3A0x1c2e8b6d23456789!2sPicnic%20Garden%2C%20Kolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1699000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block', minHeight: '260px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

    </main>
  )
}
