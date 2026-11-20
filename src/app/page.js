export default function Home() {
  return (
    <div className="site-shell">
      <header className="navbar">
        <a className="brand" href="#" aria-label="Beranda Eventa">
          <span className="brand-mark">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 3v4M18 3v4M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
            </svg>
          </span>
          eventa
        </a>
        <nav className="nav-links" aria-label="Navigasi utama">
          <a className="active" href="#">Beranda</a>
          <a href="#events">Cari Event</a>
          <a href="#categories">Kategori</a>
        </nav>
        <div className="nav-actions">
          <button className="icon-button" aria-label="Buka pencarian">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="6" />
              <path d="m16 16 4 4" />
            </svg>
          </button>
          <a className="login-link" href="#">Masuk</a>
          <a className="primary-button small" href="#">Daftar</a>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">Temukan pengalaman terbaikmu</span>
            <h1>Event seru, <span>cerita tak terlupakan.</span></h1>
            <p>Temukan konser, festival, workshop, dan berbagai event menarik di kotamu.</p>
            <div className="search-box">
              <div className="search-field">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="11" cy="11" r="6" />
                  <path d="m16 16 4 4" />
                </svg>
                <input aria-label="Cari event" placeholder="Cari event, artis, atau venue" />
              </div>
              <div className="location-field">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                <select aria-label="Lokasi">
                  <option>Jakarta</option>
                  <option>Bandung</option>
                  <option>Surabaya</option>
                </select>
              </div>
              <button className="primary-button search-button">Cari Event</button>
            </div>
          </div>
          <div className="hero-art" aria-label="Pengunjung menikmati festival musik">
            <img
              src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=85"
              alt="Festival musik di malam hari"
            />
            <div className="live-badge">
              <span className="live-dot"></span>
              <div>
                <strong>Hari Ini</strong>
                <small>12 Event tersedia</small>
              </div>
            </div>
            <div className="hero-stat">
              <strong>50K+</strong>
              <span>Pengunjung bahagia</span>
            </div>
          </div>
        </section>

        <section className="categories" id="categories">
          <div className="category-item">
            <span className="category-icon purple">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V5l10-2v13M9 9l10-2M5 21h.01M5 17h.01M5 13h.01M5 9h.01" /><circle cx="6" cy="18" r="3" /><circle cx="16" cy="16" r="3" /></svg>
            </span>
            <div><strong>Musik</strong><small>128 Event</small></div>
          </div>
          <div className="category-item">
            <span className="category-icon orange">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V10l8-6 8 6v10M8 20v-6h8v6M3 20h18" /></svg>
            </span>
            <div><strong>Festival</strong><small>86 Event</small></div>
          </div>
          <div className="category-item">
            <span className="category-icon blue">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M3 12h18" /><circle cx="12" cy="12" r="7" /></svg>
            </span>
            <div><strong>Workshop</strong><small>64 Event</small></div>
          </div>
          <div className="category-item">
            <span className="category-icon pink">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m9 9 6 3-6 3Z" /></svg>
            </span>
            <div><strong>Seni &amp; Teater</strong><small>42 Event</small></div>
          </div>
        </section>

        <section className="events-section" id="events">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Pilihan terbaik</span>
              <h2>Event Populer</h2>
            </div>
            <a href="#">Lihat semua <span aria-hidden="true">→</span></a>
          </div>

          <div className="event-grid">
            <article className="event-card">
              <div className="card-image">
                <img src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=900&q=85" alt="Konser musik" />
                <span className="card-tag">Musik</span>
                <button className="heart-button" aria-label="Simpan event">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" /></svg>
                </button>
              </div>
              <div className="card-body">
                <div className="date-box"><strong>24</strong><span>JAN</span></div>
                <div className="card-content">
                  <h3>Jakarta Music Festival 2026</h3>
                  <p><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg> GBK Hall, Jakarta</p>
                  <p><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg> 18.00 — 23.00 WIB</p>
                </div>
              </div>
              <div className="card-footer">
                <div><small>Mulai dari</small><strong>Rp 350.000</strong></div>
                <a href="#">Lihat Tiket</a>
              </div>
            </article>

            <article className="event-card">
              <div className="card-image">
                <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=85" alt="Festival outdoor" />
                <span className="card-tag orange-tag">Festival</span>
                <button className="heart-button" aria-label="Simpan event">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" /></svg>
                </button>
              </div>
              <div className="card-body">
                <div className="date-box"><strong>31</strong><span>JAN</span></div>
                <div className="card-content">
                  <h3>Jakarta Kuliner Festival</h3>
                  <p><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg> Lapangan Banteng</p>
                  <p><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg> 11.00 — 21.00 WIB</p>
                </div>
              </div>
              <div className="card-footer">
                <div><small>Mulai dari</small><strong>Rp 75.000</strong></div>
                <a href="#">Lihat Tiket</a>
              </div>
            </article>

            <article className="event-card">
              <div className="card-image">
                <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=85" alt="Acara seminar" />
                <span className="card-tag blue-tag">Workshop</span>
                <button className="heart-button" aria-label="Simpan event">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" /></svg>
                </button>
              </div>
              <div className="card-body">
                <div className="date-box"><strong>08</strong><span>FEB</span></div>
                <div className="card-content">
                  <h3>Creative Digital Summit</h3>
                  <p><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg> JCC, Jakarta</p>
                  <p><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg> 09.00 — 16.00 WIB</p>
                </div>
              </div>
              <div className="card-footer">
                <div><small>Mulai dari</small><strong>Rp 220.000</strong></div>
                <a href="#">Lihat Tiket</a>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
