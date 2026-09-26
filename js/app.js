/**
 * Royal Indian Wedding Application Logic
 * Vaishnavi Shrivastava & Nikhil Saurabh (25th November 2026)
 */

// SafeStorage wrapper preventing SecurityError or QuotaExceededError in file:// or private browsing
const SafeStorage = {
  _mem: {},
  getItem(key) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      // Insecure context or local file restriction fallback
    }
    return this._mem[key] || null;
  },
  setItem(key, val) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, val);
        return;
      }
    } catch (e) {
      // Fallback in-memory
    }
    this._mem[key] = String(val);
  }
};

// Apply saved theme immediately (Defaults to 'emerald' - Royal Imperial Emerald & Gold)
(function() {
  const savedTheme = SafeStorage.getItem('vn_wedding_theme') || 'emerald';
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Petal Canvas
  const petalCanvasInstance = new window.PetalCanvas('petal-canvas');

  // 2. Countdown Timer to November 25, 2026
  initCountdown();

  // 3. Royal Envelope Open Trigger
  initEnvelopeOpener();

  // 4. Floating Controls (Music, Petals, Share)
  initFloatingControls(petalCanvasInstance);

  // 5. Diya Blessing Counter
  initDiyaCounter();

  // 6. Interactive Guestbook & Blessings
  initGuestbook();

  // 7. Save to Calendar (.ics and Google Calendar)
  initCalendarButtons();

  // 8. Mobile Navigation Menu
  initMobileNav();

  // 9. Interactive Siblings Clan
  initSiblingsClan();

  // 10. Ceremony-Specific Music Switcher
  initCeremonyMusicSwitcher();

  // 11. Photo Gallery & Fullscreen Lightbox
  initPhotoGalleryAndLightbox();

  // 12. Royal Theme Selector
  initThemeManager();
});

/* ==========================================================================
   1. COUNTDOWN TIMER
   ========================================================================== */
function initCountdown() {
  // Target: November 25, 2026 09:00:00 (Local Time)
  const weddingDate = new Date(2026, 10, 25, 9, 0, 0).getTime(); // Note: Month is 0-indexed (10 = November)

  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minutesEl = document.getElementById('count-mins');
  const secondsEl = document.getElementById('count-secs');

  function update() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      if (daysEl) daysEl.innerText = "00";
      if (hoursEl) hoursEl.innerText = "00";
      if (minutesEl) minutesEl.innerText = "00";
      if (secondsEl) secondsEl.innerText = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   2. ROYAL ENVELOPE OPENER
   ========================================================================== */
function initEnvelopeOpener() {
  const overlay = document.getElementById('envelope-overlay');
  const openSeal = document.getElementById('open-seal-btn');
  const musicBtn = document.getElementById('music-toggle-btn');

  function openInvitation() {
    if (!overlay) return;
    overlay.classList.add('opened');

    // Auto-start ambient wedding music on user invitation click
    if (window.weddingSoundtrack && !window.weddingSoundtrack.isPlaying) {
      const playing = window.weddingSoundtrack.toggle();
      if (musicBtn && playing) {
        musicBtn.classList.add('music-spinning');
      }
    }

    showToast("🙏 Welcome! Received Divine Blessings for Vaishnavi & Nikhil");
  }

  const bigBtn = document.getElementById('open-envelope-btn');
  if (openSeal) {
    openSeal.addEventListener('click', openInvitation);
  }
  if (bigBtn) {
    bigBtn.addEventListener('click', openInvitation);
  }
}

/* ==========================================================================
   3. FLOATING DOCK CONTROLS (Music, Petals, WhatsApp Share)
   ========================================================================== */
function initFloatingControls(petalCanvas) {
  const musicBtn = document.getElementById('music-toggle-btn');
  const petalsBtn = document.getElementById('petals-toggle-btn');
  const shareBtn = document.getElementById('share-invite-btn');

  // Music Toggle
  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      if (window.weddingSoundtrack) {
        const isPlaying = window.weddingSoundtrack.toggle();
        if (isPlaying) {
          musicBtn.classList.add('music-spinning');
          showToast("🎵 Playing Auspicious Shehnai & Sitar Melody");
        } else {
          musicBtn.classList.remove('music-spinning');
          showToast("🔇 Music Paused");
        }
      }
    });
  }

  // Petals Shower Toggle
  if (petalsBtn) {
    petalsBtn.addEventListener('click', () => {
      if (petalCanvas) {
        const active = petalCanvas.toggle();
        petalsBtn.style.opacity = active ? "1" : "0.5";
        showToast(active ? "🌸 Rose & Marigold Petals Resumed" : "🍂 Petals Paused");
      }
    });
  }

  // WhatsApp Share
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const pageUrl = window.location.href;
      const shareText = encodeURIComponent(
        `💐 Wedding Invitation: Vaishnavi Shrivastava Weds Nikhil Saurabh 💐\n\n` +
        `With the divine blessings of Lord Ganesha, we cordially invite you to celebrate the wedding union on Wednesday, 25th November 2026.\n\n` +
        `📍 Venue: Behind Rajendra Hostel, Near Chandmari, Motihari\n\n` +
        `Please join us and grace the occasion with your presence and blessings:\n${pageUrl}`
      );
      window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
    });
  }
}

/* ==========================================================================
   4. DIYA BLESSING COUNTER
   ========================================================================== */
function initDiyaCounter() {
  const diyaBtn = document.getElementById('light-diya-btn');
  const countEl = document.getElementById('diya-count-number');
  const diyaIcon = document.getElementById('diya-icon-anim');

  // Initialize from SafeStorage or default to 108 auspicious count
  let count = parseInt(SafeStorage.getItem('vn_wedding_diya_blessings') || '108', 10);
  if (countEl) countEl.innerText = count.toLocaleString();

  if (diyaBtn) {
    diyaBtn.addEventListener('click', () => {
      count++;
      SafeStorage.setItem('vn_wedding_diya_blessings', count);
      if (countEl) countEl.innerText = count.toLocaleString();

      if (diyaIcon) {
        diyaIcon.style.transform = 'scale(1.3) rotate(15deg)';
        setTimeout(() => {
          diyaIcon.style.transform = 'scale(1) rotate(0deg)';
        }, 400);
      }

      showToast("🪔 You lit a sacred Diya for Vaishnavi & Nikhil's prosperous life!");
    });
  }
}

/* ==========================================================================
   5. INTERACTIVE BLESSINGS GUESTBOOK
   ========================================================================= */
function initGuestbook() {
  const form = document.getElementById('blessings-form');
  const wall = document.getElementById('blessings-wall-container');

  const defaultBlessings = [
    {
      name: "Amritraj Shrivastava",
      relation: "Proud Brother",
      message: "To my dearest sister Vaishnavi and brother Nikhil: You deserve every ounce of joy and love in this universe. Watching my sister step into this sacred chapter fills our home with pride. May your love grow stronger with every passing sunrise!",
      time: "Just now"
    },
    {
      name: "The Shrivastava Family",
      relation: "Bride's Family",
      message: "May Lord Ganesha shower His divine grace, and Radha-Krishna bless our darling Vaishnavi and dear Nikhil with lifelong harmony, good health, and infinite happiness.",
      time: "Auspicious Day"
    },
    {
      name: "The Saurabh Family",
      relation: "Groom's Family",
      message: "With warm hearts and open arms, we eagerly await welcoming Vaishnavi into our family as our beloved daughter and Nikhil's soulmate.",
      time: "Heartfelt Wishes"
    }
  ];

  // Load blessings from SafeStorage
  let savedBlessings = [];
  try {
    const raw = SafeStorage.getItem('vn_wedding_guest_blessings');
    if (raw) savedBlessings = JSON.parse(raw);
  } catch (e) {
    savedBlessings = [];
  }

  const allBlessings = [...savedBlessings, ...defaultBlessings];
  renderBlessings(allBlessings);

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('guest-name').value.trim();
      const relation = document.getElementById('guest-relation').value;
      const message = document.getElementById('guest-message').value.trim();

      if (!name || !message) {
        showToast("⚠️ Please enter your name and a heartfelt blessing");
        return;
      }

      const newBlessing = {
        name,
        relation,
        message,
        time: "Just now"
      };

      savedBlessings.unshift(newBlessing);
      SafeStorage.setItem('vn_wedding_guest_blessings', JSON.stringify(savedBlessings));

      renderBlessings([...savedBlessings, ...defaultBlessings]);
      form.reset();

      showToast("🌸 Thank you! Your Ashirwad has been inscribed on the wall.");
    });
  }

  function renderBlessings(list) {
    if (!wall) return;
    wall.innerHTML = list.map(b => `
      <div class="blessing-card">
        <div class="blessing-author-box">
          <span class="blessing-author">${escapeHtml(b.name)}</span>
          <span class="blessing-relation-pill">${escapeHtml(b.relation)}</span>
        </div>
        <p class="blessing-message">“${escapeHtml(b.message)}”</p>
        <div class="blessing-time">🪷 ${escapeHtml(b.time)}</div>
      </div>
    `).join('');
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

/* ==========================================================================
   6. CALENDAR EVENT GENERATION (.ICS & GOOGLE CALENDAR)
   ========================================================================== */
function initCalendarButtons() {
  const gcalBtn = document.getElementById('add-gcal-btn');
  const icsBtn = document.getElementById('download-ics-btn');

  const eventDetails = {
    title: "Wedding of Vaishnavi Shrivastava & Nikhil Saurabh",
    description: "Shubh Vivah celebration of Vaishnavi & Nikhil. Join us to bestow your auspicious blessings on the sacred union.",
    location: "Behind Rajendra Hostel, Near Chandmari, Motihari, Bihar",
    start: "20261125T033000Z", // 25 Nov 2026 09:00 AM IST in UTC
    end: "20261125T183000Z"    // 25 Nov 2026 12:00 Midnight IST in UTC
  };

  if (gcalBtn) {
    gcalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.start}/${eventDetails.end}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;
      window.open(url, '_blank');
    });
  }

  if (icsBtn) {
    icsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const icsData = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Vaishnavi & Nikhil Wedding//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `SUMMARY:${eventDetails.title}`,
        `DESCRIPTION:${eventDetails.description}`,
        `LOCATION:${eventDetails.location}`,
        `DTSTART:${eventDetails.start}`,
        `DTEND:${eventDetails.end}`,
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'Vaishnavi_Nikhil_Wedding_Nov25_2026.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("📅 Saved to Calendar!");
    });
  }
}

/* ==========================================================================
   7. MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle-btn');
  const links = document.getElementById('nav-links-menu');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('active');
    });

    links.querySelectorAll('a').forEach(anchor => {
      anchor.addEventListener('click', () => {
        links.classList.remove('active');
      });
    });
  }
}

/* ==========================================================================
   8. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(msg) {
  let toast = document.getElementById('royal-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'royal-toast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerText = msg;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* ==========================================================================
   9. INTERACTIVE SIBLINGS CLAN (Completely Deleteable & Extensible)
   ========================================================================== */
function initSiblingsClan() {
  const container = document.getElementById('siblings-list-container');
  const addBtn = document.getElementById('add-sibling-btn');
  const nameInput = document.getElementById('new-sibling-name');
  const roleSelect = document.getElementById('new-sibling-role');
  const resetBtn = document.getElementById('reset-siblings-btn');

  const defaultSiblings = [
    { name: "Shreya", role: "Sister" },
    { name: "Pankhuri", role: "Sister" },
    { name: "Amritraj", role: "Brother" }
  ];

  let siblingsList = [];
  try {
    const raw = SafeStorage.getItem('vn_wedding_active_siblings');
    if (raw) {
      siblingsList = JSON.parse(raw);
    } else {
      siblingsList = [...defaultSiblings];
      SafeStorage.setItem('vn_wedding_active_siblings', JSON.stringify(siblingsList));
    }
  } catch (e) {
    siblingsList = [...defaultSiblings];
  }

  function render() {
    if (!container) return;

    if (siblingsList.length === 0) {
      container.innerHTML = `
        <div style="padding: 16px; color: var(--text-muted); font-style: italic; width: 100%; text-align: center;">
          No names currently listed. Enter a sister or brother name below to add to the clan!
        </div>
      `;
      return;
    }

    container.innerHTML = siblingsList.map((s, idx) => `
      <div class="sibling-pill">
        <span class="sibling-pill-role">${escapeHtml(s.role)}</span>
        <span class="sibling-pill-name">${escapeHtml(s.name)}</span>
        <button class="sibling-pill-delete" data-idx="${idx}" title="Remove ${escapeHtml(s.name)} from clan">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    `).join('');

    // Attach delete listeners to every sibling pill
    container.querySelectorAll('.sibling-pill-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        if (!isNaN(idx) && idx >= 0 && idx < siblingsList.length) {
          const removed = siblingsList.splice(idx, 1);
          SafeStorage.setItem('vn_wedding_active_siblings', JSON.stringify(siblingsList));
          render();
          showToast(`🗑️ Removed ${removed[0]?.name || 'name'} from family clan`);
        }
      });
    });
  }

  render();

  if (addBtn && nameInput) {
    addBtn.addEventListener('click', () => {
      const name = nameInput.value.trim();
      const role = roleSelect ? roleSelect.value : "Sibling";
      if (!name) {
        showToast("⚠️ Please enter a name to add to the family clan");
        return;
      }

      siblingsList.push({ name, role });
      SafeStorage.setItem('vn_wedding_active_siblings', JSON.stringify(siblingsList));
      render();
      nameInput.value = "";
      showToast(`💖 Added ${name} (${role}) to the loving siblings clan!`);
    });

    nameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addBtn.click();
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      siblingsList = [
        { name: "Shreya", role: "Sister" },
        { name: "Pankhuri", role: "Sister" },
        { name: "Amritraj", role: "Brother" }
      ];
      SafeStorage.setItem('vn_wedding_active_siblings', JSON.stringify(siblingsList));
      render();
      showToast("🔄 Restored original siblings: Shreya, Pankhuri & Amritraj");
    });
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

/* ==========================================================================
   10. CEREMONY-SPECIFIC MUSIC SWITCHER
   ========================================================================== */
function initCeremonyMusicSwitcher() {
  const trackLabel = document.getElementById('now-playing-track-name');
  const chipButtons = document.querySelectorAll('.ceremony-chip-btn');
  const eventButtons = document.querySelectorAll('.event-music-btn');
  const musicDockBtn = document.getElementById('music-toggle-btn');
  const ceremonyIcon = document.getElementById('ceremony-music-icon');

  // Listen to custom theme change event
  window.addEventListener('weddingThemeChanged', (e) => {
    const { theme, title } = e.detail;
    if (trackLabel) trackLabel.innerText = title;

    // Update active chip state
    chipButtons.forEach(btn => {
      if (btn.getAttribute('data-theme') === theme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (ceremonyIcon) {
      ceremonyIcon.style.animation = 'none';
      setTimeout(() => ceremonyIcon.style.animation = '', 50);
    }
  });

  // Handle chip button clicks
  chipButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      switchAndPlayTheme(theme);
    });
  });

  // Handle event card music buttons
  eventButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const theme = btn.getAttribute('data-theme');
      switchAndPlayTheme(theme);
    });
  });

  function switchAndPlayTheme(theme) {
    if (!window.weddingSoundtrack) return;

    window.weddingSoundtrack.setTheme(theme);

    // If music is paused, start playing
    if (!window.weddingSoundtrack.isPlaying) {
      window.weddingSoundtrack.toggle();
      if (musicDockBtn) musicDockBtn.classList.add('music-spinning');
    }

    const title = window.weddingSoundtrack.themeNames[theme] || theme;
    showToast(`🎶 Playing: ${title}`);
  }

  // Scroll-based auto theme detection
  const ceremonyCards = document.querySelectorAll('.event-card[data-theme]');
  if ('IntersectionObserver' in window && ceremonyCards.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          const theme = entry.target.getAttribute('data-theme');
          if (theme && window.weddingSoundtrack && window.weddingSoundtrack.currentTheme !== theme) {
            window.weddingSoundtrack.setTheme(theme);
            const title = window.weddingSoundtrack.themeNames[theme] || theme;
            showToast(`🎵 Switched to: ${title}`);
          }
        }
      });
    }, {
      threshold: 0.5
    });

    ceremonyCards.forEach(card => observer.observe(card));
  }
}

/* ==========================================================================
   11. PHOTO GALLERY FILTER & FULLSCREEN LIGHTBOX
   ========================================================================== */
function initPhotoGalleryAndLightbox() {
  const filterTabs = document.querySelectorAll('.gallery-tab-btn');
  const photoCards = document.querySelectorAll('.wedder-photo-card');
  const lightbox = document.getElementById('wedding-lightbox');
  const lightboxImg = document.getElementById('lightbox-display-img');
  const lightboxCaption = document.getElementById('lightbox-display-caption');
  const closeBtn = document.getElementById('lightbox-close-btn');
  const prevBtn = document.getElementById('lightbox-prev-btn');
  const nextBtn = document.getElementById('lightbox-next-btn');

  let currentList = [];
  let currentIndex = 0;

  // 1. Category Filter Tabs
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      photoCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 2. Collect visible items for Lightbox
  function updateVisibleList() {
    currentList = [];
    document.querySelectorAll('.wedder-photo-card').forEach(card => {
      if (card.style.display !== 'none') {
        currentList.push({
          src: card.getAttribute('data-img'),
          caption: card.getAttribute('data-caption') || ""
        });
      }
    });
  }

  // 3. Lightbox Open
  document.querySelectorAll('.lightbox-trigger').forEach(card => {
    card.addEventListener('click', () => {
      updateVisibleList();
      const clickedSrc = card.getAttribute('data-img');
      currentIndex = currentList.findIndex(item => item.src === clickedSrc);
      if (currentIndex === -1) currentIndex = 0;

      showLightboxPhoto(currentIndex);
      if (lightbox) lightbox.classList.add('active');
    });
  });

  function showLightboxPhoto(index) {
    if (!lightboxImg || currentList.length === 0) return;
    const item = currentList[index];
    lightboxImg.src = item.src;
    if (lightboxCaption) lightboxCaption.innerHTML = item.caption;
  }

  // 4. Navigation
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentList.length === 0) return;
      currentIndex = (currentIndex - 1 + currentList.length) % currentList.length;
      showLightboxPhoto(currentIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentList.length === 0) return;
      currentIndex = (currentIndex + 1) % currentList.length;
      showLightboxPhoto(currentIndex);
    });
  }

  // 5. Close Handlers
  function closeLightbox() {
    if (lightbox) lightbox.classList.remove('active');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-img-wrapper')) {
        closeLightbox();
      }
    });
  }

  // 6. Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
    if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
  });
}

/* ==========================================================================
   12. ROYAL MULTI-THEME MANAGER
   ========================================================================== */
function initThemeManager() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themePanel = document.getElementById('theme-picker-panel');
  const themeOptBtns = document.querySelectorAll('.theme-opt-btn');

  const currentTheme = SafeStorage.getItem('vn_wedding_theme') || 'emerald';
  applyTheme(currentTheme);

  if (themeToggleBtn && themePanel) {
    themeToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      themePanel.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!themePanel.contains(e.target) && e.target !== themeToggleBtn) {
        themePanel.classList.remove('active');
      }
    });
  }

  themeOptBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = btn.getAttribute('data-theme-val');
      if (selected) {
        applyTheme(selected);
        if (themePanel) themePanel.classList.remove('active');
        const themeNames = {
          emerald: "🌿 Imperial Emerald & 24K Gold",
          peacock: "🦚 Royal Peacock Sapphire & Gold",
          crimson: "🌹 Classic Vivah Crimson & Gold",
          rosegold: "🌸 Palace Rose Gold & Champagne"
        };
        showToast(`👑 Switched to ${themeNames[selected] || selected} theme`);
      }
    });
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    SafeStorage.setItem('vn_wedding_theme', theme);
    themeOptBtns.forEach(b => {
      if (b.getAttribute('data-theme-val') === theme) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });
  }
}


