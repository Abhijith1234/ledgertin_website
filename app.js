/**
 * LedgerTin (ledgertin.in) - Slack-Style Interactive Engine
 * 1. Interactive Feature Switcher (Tabs switching live panels)
 * 2. Live Interactive Counter Bill Simulator (Keyboard shortcuts & Audio-like feedback)
 * 3. FAQ Accordion
 */

document.addEventListener('DOMContentLoaded', () => {

  // ───────────────────────────────────────────────────────────────────────────
  // 1. Interactive Counter POS Bill Simulator (Integrated Hero Cockpit)
  // ───────────────────────────────────────────────────────────────────────────
  const SAMPLE_PRODUCTS = [
    { id: 'dolo', key: '1', name: 'Dolo 650mg Tab', meta: 'Strip of 15 • Paracetamol', price: 32.50, gstRate: 0.12 },
    { id: 'aug', key: '2', name: 'Augmentin 625 Duo', meta: 'Strip of 10 • Antibiotic', price: 201.70, gstRate: 0.12 },
    { id: 'pand', key: '3', name: 'Pan-D Capsule', meta: 'Strip of 15 • Antacid', price: 199.00, gstRate: 0.12 },
    { id: 'azith', key: '4', name: 'Azithral 500mg', meta: 'Pack of 5 • Broad Spectrum', price: 119.50, gstRate: 0.12 },
    { id: 'vitc', key: '5', name: 'Limcee Vitamin C', meta: 'Strip of 15 • Chewable', price: 28.50, gstRate: 0.18 },
    { id: 'ors', key: '6', name: 'Electral ORS 21g', meta: 'Sachet • WHO Formula', price: 22.00, gstRate: 0.05 }
  ];

  let cart = [
    { id: 'dolo', name: 'Dolo 650mg Tab', qty: 2, price: 32.50, gstRate: 0.12 },
    { id: 'aug', name: 'Augmentin 625 Duo', qty: 1, price: 201.70, gstRate: 0.12 }
  ];

  // Render or Bind Product Quick-Tap Shelf Cards
  function renderProductList() {
    const containers = [
      document.getElementById('heroProductList'),
      document.getElementById('simProductList')
    ].filter(Boolean);

    if (containers.length === 0) return;

    containers.forEach(container => {
      const existingCards = container.querySelectorAll('.hero-shelf-card');
      if (existingCards.length > 0) {
        existingCards.forEach(card => {
          const key = card.getAttribute('data-key');
          const prod = SAMPLE_PRODUCTS.find(p => p.key === key);
          if (prod) {
            card.addEventListener('click', () => {
              addToCart(prod);
              card.style.transform = 'scale(0.96)';
              setTimeout(() => { card.style.transform = ''; }, 120);
            });
          }
        });
        return;
      }

      container.innerHTML = '';
      SAMPLE_PRODUCTS.forEach((prod) => {
        const card = document.createElement('div');
        card.className = 'hero-shelf-card';
        card.setAttribute('data-key', prod.key);
        card.setAttribute('title', `Click to add ${prod.name} or press key [${prod.key}]`);
        card.innerHTML = `
          <div class="card-left">
            <span class="card-key">${prod.key}</span>
            <div class="card-details">
              <span class="card-name">${prod.name}</span>
              <span class="card-meta">${prod.meta}</span>
            </div>
          </div>
          <div class="card-price">₹${prod.price.toFixed(2)}</div>
        `;

        card.addEventListener('click', () => {
          addToCart(prod);
          card.style.transform = 'scale(0.96)';
          setTimeout(() => { card.style.transform = ''; }, 120);
        });

        container.appendChild(card);
      });
    });
  }

  // Keyboard shortcut listener (Press 1–6 to tap medicines like a real cashier)
  window.addEventListener('keydown', (e) => {
    // Only trigger if not focused in an input
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    const match = SAMPLE_PRODUCTS.find(p => p.key === e.key);
    if (match) {
      addToCart(match);
      const cards = document.querySelectorAll(`.hero-shelf-card[data-key="${match.key}"]`);
      cards.forEach(card => {
        card.style.transform = 'scale(0.95)';
        card.style.borderColor = '#00c4f5';
        card.style.background = '#f0faff';
        setTimeout(() => {
          card.style.transform = '';
          card.style.borderColor = '';
          card.style.background = '';
        }, 180);
      });
    }
  });

  function addToCart(prod) {
    const existing = cart.find(item => item.id === prod.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...prod, qty: 1 });
    }

    // Dynamic rapid checkout velocity feedback
    const heroSpeed = document.getElementById('heroLiveSpeed');
    if (heroSpeed) {
      const randSpeed = (0.71 + Math.random() * 0.08).toFixed(2);
      heroSpeed.textContent = `${randSpeed}s`;
    }

    renderReceipt();
  }

  function renderReceipt() {
    const receiptLists = [
      document.getElementById('heroReceiptItems'),
      document.getElementById('simReceiptItems')
    ].filter(Boolean);

    const subtotalEls = [
      document.getElementById('heroSubtotal'),
      document.getElementById('simSubtotal')
    ].filter(Boolean);

    const gstEls = [
      document.getElementById('heroGst'),
      document.getElementById('simGst')
    ].filter(Boolean);

    const grandTotalEls = [
      document.getElementById('heroGrandTotal'),
      document.getElementById('simGrandTotal')
    ].filter(Boolean);

    if (cart.length === 0) {
      receiptLists.forEach(list => {
        list.innerHTML = '<div style="text-align:center; color:#64748b; font-size:0.75rem; padding: 2rem 0;">No items on bill.<br>Tap medicines on shelf to add.</div>';
      });
      subtotalEls.forEach(el => el.textContent = '₹0.00');
      gstEls.forEach(el => el.textContent = '₹0.00');
      grandTotalEls.forEach(el => el.textContent = '₹0.00');
      return;
    }

    let subtotal = 0;
    let totalGst = 0;

    receiptLists.forEach(list => {
      list.innerHTML = '';
      cart.forEach(item => {
        const lineTaxable = item.price * item.qty;
        const lineGst = lineTaxable * item.gstRate;
        const lineTotal = lineTaxable + lineGst;

        const row = document.createElement('div');
        row.className = 'invoice-item-row';
        row.innerHTML = `
          <span class="i-name">${item.qty}x ${item.name}</span>
          <span class="i-amt">₹${lineTotal.toFixed(2)}</span>
        `;
        list.appendChild(row);
      });
      list.scrollTop = list.scrollHeight;
    });

    cart.forEach(item => {
      const lineTaxable = item.price * item.qty;
      const lineGst = lineTaxable * item.gstRate;
      subtotal += lineTaxable;
      totalGst += lineGst;
    });

    const grandTotal = Math.round(subtotal + totalGst);

    subtotalEls.forEach(el => el.textContent = `₹${subtotal.toFixed(2)}`);
    gstEls.forEach(el => el.textContent = `₹${totalGst.toFixed(2)}`);
    grandTotalEls.forEach(el => el.textContent = `₹${grandTotal.toFixed(2)}`);
  }

  // 1-Click Multi-Channel Dispatch Actions
  const heroPrintBtn = document.getElementById('heroPrintBtn');
  const heroWaBtn = document.getElementById('heroWaBtn');
  const heroDispatchToast = document.getElementById('heroDispatchToast');

  function showDispatchFeedback(htmlContent, triggerBtn) {
    if (!heroDispatchToast) return;
    heroDispatchToast.style.display = 'block';
    heroDispatchToast.innerHTML = htmlContent;

    if (triggerBtn) {
      triggerBtn.disabled = true;
      triggerBtn.style.opacity = '0.7';
      setTimeout(() => {
        triggerBtn.disabled = false;
        triggerBtn.style.opacity = '1';
      }, 3000);
    }
  }

  if (heroPrintBtn) {
    heroPrintBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Please tap at least one medicine on the left first!');
        return;
      }
      const grandTotal = document.getElementById('heroGrandTotal')?.textContent || '₹0.00';
      showDispatchFeedback(`
        <strong>🖨️ Thermal Print Dispatched (0.3s):</strong><br>
        Receipt for <strong>${grandTotal}</strong> sent to POS printer with GST breakdown & UPI QR code.
      `, heroPrintBtn);
    });
  }

  if (heroWaBtn) {
    heroWaBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Please tap at least one medicine on the left first!');
        return;
      }
      const grandTotal = document.getElementById('heroGrandTotal')?.textContent || '₹0.00';
      showDispatchFeedback(`
        <strong>💬 Sent via ₹0 WhatsApp (0.2s):</strong><br>
        Tax invoice for <strong>${grandTotal}</strong> sent silently to customer (+91 98765 43210).
      `, heroWaBtn);
    });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 4. FAQ Accordion Toggle
  // ───────────────────────────────────────────────────────────────────────────
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other open FAQ items & update ARIA
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherBtn = other.querySelector('.faq-question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      } else {
        questionBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 5. Official Launch Announcement Modal (Releasing on 30th Sept)
  // ───────────────────────────────────────────────────────────────────────────
  const launchModal = document.getElementById('launchModal');
  const launchBackdrop = document.getElementById('launchModalBackdrop');
  const closeLaunchBtn = document.getElementById('closeLaunchModal');
  const btnDoneClose = document.getElementById('btnDoneClose');
  const btnDismissModal = document.getElementById('btnDismissModal');
  const launchStepForm = document.getElementById('launchStepForm');
  const launchStepSuccess = document.getElementById('launchStepSuccess');
  const confettiCanvas = document.getElementById('launchConfettiCanvas');

  const ticketIdDisplay = document.getElementById('ticketIdDisplay');
  const ticketPhoneDisplay = document.getElementById('ticketPhoneDisplay');

  // Live Countdown Timer to 30th September 2026 (09:00:00 AM IST)
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMins = document.getElementById('cdMins');
  const cdSecs = document.getElementById('cdSecs');
  let countdownTimerInterval = null;

  function updateCountdown() {
    const targetDate = new Date('2026-09-30T09:00:00+05:30').getTime();
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      if (cdDays) cdDays.textContent = '00';
      if (cdHours) cdHours.textContent = '00';
      if (cdMins) cdMins.textContent = '00';
      if (cdSecs) cdSecs.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (cdDays) cdDays.textContent = String(days).padStart(2, '0');
    if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
    if (cdMins) cdMins.textContent = String(minutes).padStart(2, '0');
    if (cdSecs) cdSecs.textContent = String(seconds).padStart(2, '0');
  }

  // Initialize countdown values statically once
  updateCountdown();

  function openLaunchModal() {
    if (!launchModal) return;
    launchModal.classList.add('active');
    launchModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Always show the 30th Sept release announcement & animation
    if (launchStepForm) launchStepForm.classList.add('active');
    if (launchStepSuccess) launchStepSuccess.classList.remove('active');

    // Update countdown immediately and run timer only while modal is open
    updateCountdown();
    if (!countdownTimerInterval) {
      countdownTimerInterval = setInterval(updateCountdown, 1000);
    }

    // Fire celebratory confetti animation
    fireConfetti();
  }

  function closeLaunchModal() {
    if (!launchModal) return;
    launchModal.classList.remove('active');
    launchModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Stop timer to save CPU when modal is closed
    if (countdownTimerInterval) {
      clearInterval(countdownTimerInterval);
      countdownTimerInterval = null;
    }
  }

  // Bind all download/reserve buttons directly
  const downloadTriggers = document.querySelectorAll('a[href="#download"], .download-trigger, .btn-hero.download-trigger');
  downloadTriggers.forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openLaunchModal();
    });
  });

  // Event delegation safety net: ensures any element triggering download opens modal
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('a[href="#download"], .download-trigger');
    if (trigger) {
      e.preventDefault();
      openLaunchModal();
      return;
    }

    if (e.target.closest('#closeLaunchModal, #launchModalBackdrop, #btnDoneClose, #btnDismissModal')) {
      e.preventDefault();
      closeLaunchModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && launchModal && launchModal.classList.contains('active')) {
      closeLaunchModal();
    }
  });

  // Confetti Animation Engine
  function fireConfetti() {
    if (!confettiCanvas) return;
    const ctx = confettiCanvas.getContext('2d');
    const width = (confettiCanvas.width = confettiCanvas.offsetWidth);
    const height = (confettiCanvas.height = confettiCanvas.offsetHeight);

    const colors = ['#00c4f5', '#38d6ff', '#10b981', '#34d399', '#f59e0b', '#ffffff'];
    const particles = [];
    const count = 90;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: width / 2 + (Math.random() - 0.5) * 60,
        y: height / 2 + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 12 - 4,
        size: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.01
      });
    }

    let animId;
    function render() {
      ctx.clearRect(0, 0, width, height);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.vx *= 0.98; // drag
        p.rotation += p.rotSpeed;
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      });

      if (alive) {
        animId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animId);
        ctx.clearRect(0, 0, width, height);
      }
    }
    render();
  }

  function showConfirmedTicket(ticket, triggerConfetti = true) {
    if (ticketIdDisplay) ticketIdDisplay.textContent = ticket.id;
    if (ticketPhoneDisplay) ticketPhoneDisplay.textContent = `+91 ${ticket.phone}`;

    if (launchStepForm) launchStepForm.classList.remove('active');
    if (launchStepSuccess) launchStepSuccess.classList.add('active');

    if (triggerConfetti) {
      setTimeout(fireConfetti, 100);
    }
  }
  // ───────────────────────────────────────────────────────────────────────────
  // 6. Comprehensive Pharmacy Suite (Interactive Feature Mosaic & Gliding Tooltip)
  // ───────────────────────────────────────────────────────────────────────────
  const featureChips = document.querySelectorAll('.features-mosaic .feature-chip');
  const floatTooltip = document.getElementById('chipFloatTooltip');
  const tipBodyInner = document.getElementById('tipBodyInner');
  const tipIcon = document.getElementById('tipIcon');
  const tipTitle = document.getElementById('tipTitle');
  const tipBadge = document.getElementById('tipBadge');
  const tipDesc = document.getElementById('tipDesc');

  let currentHoveredChip = null;
  let hideTooltipTimeout = null;

  function updateTooltipContent(chip) {
    const title = chip.getAttribute('data-title');
    const icon = chip.getAttribute('data-icon');
    const badge = chip.getAttribute('data-badge');
    const desc = chip.getAttribute('data-desc');

    if (tipIcon && icon) tipIcon.textContent = icon;
    if (tipTitle && title) tipTitle.textContent = title;
    if (tipBadge && badge) tipBadge.textContent = badge;
    if (tipDesc && desc) tipDesc.textContent = desc;
  }

  function showTooltipForChip(chip) {
    if (!chip || !floatTooltip) return;

    // Clear any scheduled hide to prevent flicker during handoff between chips
    if (hideTooltipTimeout) {
      clearTimeout(hideTooltipTimeout);
      hideTooltipTimeout = null;
    }

    const isAlreadyActive = floatTooltip.classList.contains('active');

    // Smooth subtle crossfade if switching between chips
    if (isAlreadyActive && currentHoveredChip !== chip && tipBodyInner) {
      tipBodyInner.classList.add('fading');
      setTimeout(() => {
        updateTooltipContent(chip);
        tipBodyInner.classList.remove('fading');
      }, 70);
    } else {
      updateTooltipContent(chip);
    }

    // Calculate bounding rect
    const rect = chip.getBoundingClientRect();
    const tooltipWidth = 310;
    const tooltipHeight = floatTooltip.offsetHeight || 120;

    // Determine vertical placement (prefer above chip)
    const spaceAbove = rect.top;
    floatTooltip.classList.remove('arrow-bottom', 'arrow-top');

    let topPos, leftPos;

    if (spaceAbove >= tooltipHeight + 16) {
      // Place directly above chip
      topPos = rect.top - tooltipHeight - 14;
      floatTooltip.classList.add('arrow-bottom');
    } else {
      // Place directly below chip
      topPos = rect.bottom + 14;
      floatTooltip.classList.add('arrow-top');
    }

    // Horizontally center with chip, bounded within viewport
    leftPos = rect.left + (rect.width / 2) - (tooltipWidth / 2);
    const minLeft = 14;
    const maxLeft = window.innerWidth - tooltipWidth - 14;
    leftPos = Math.max(minLeft, Math.min(leftPos, maxLeft));

    floatTooltip.style.top = `${topPos}px`;
    floatTooltip.style.left = `${leftPos}px`;

    // Position arrow smoothly aligned with chip center
    const arrowEl = floatTooltip.querySelector('.tooltip-arrow');
    if (arrowEl) {
      const chipCenterX = rect.left + (rect.width / 2);
      const relativeArrowLeft = chipCenterX - leftPos;
      arrowEl.style.left = `${Math.max(18, Math.min(relativeArrowLeft, tooltipWidth - 18))}px`;
    }

    floatTooltip.classList.add('active');

    featureChips.forEach(c => c.classList.remove('is-hovered'));
    chip.classList.add('is-hovered');
    currentHoveredChip = chip;
  }

  function hideTooltip(immediate = false) {
    if (!floatTooltip) return;
    if (hideTooltipTimeout) {
      clearTimeout(hideTooltipTimeout);
      hideTooltipTimeout = null;
    }

    if (immediate) {
      floatTooltip.classList.remove('active');
      if (currentHoveredChip) {
        currentHoveredChip.classList.remove('is-hovered');
        currentHoveredChip = null;
      }
    } else {
      // Grace period (120ms) so moving across chips glides seamlessly without blinking
      hideTooltipTimeout = setTimeout(() => {
        floatTooltip.classList.remove('active');
        if (currentHoveredChip) {
          currentHoveredChip.classList.remove('is-hovered');
          currentHoveredChip = null;
        }
      }, 120);
    }
  }

  featureChips.forEach(chip => {
    chip.addEventListener('mouseenter', () => {
      showTooltipForChip(chip);
    });
    chip.addEventListener('mouseleave', () => {
      hideTooltip(false);
    });
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentHoveredChip === chip && floatTooltip.classList.contains('active')) {
        hideTooltip(true);
      } else {
        showTooltipForChip(chip);
      }
    });
  });

  // Hide tooltip when clicking anywhere outside
  document.addEventListener('click', (e) => {
    if (floatTooltip && !floatTooltip.contains(e.target) && !e.target.closest('.feature-chip')) {
      hideTooltip(true);
    }
  });



  // Initialize
  renderProductList();
  renderReceipt();
});
