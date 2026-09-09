// ============================================================
// GABBIE JANE — LUXURY AFRICAN COUTURE JAVASCRIPT
// WCAG 2.1 Conforming Interactive Logic
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // -------------------------------------------------------
  // 1. Navbar scroll effect & Active Nav Spy (WCAG 1.3.1)
  // -------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link based on scroll position
    let currentSection = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
      const href = link.getAttribute('href');
      if (href === `#${currentSection}`) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // -------------------------------------------------------
  // 2. Mobile menu toggle (WCAG 4.1.2)
  // -------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileToggle && mobileMenu) {
    const toggleMobileMenu = (open) => {
      const isOpen = open !== undefined ? open : !mobileMenu.classList.contains('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileMenu.classList.toggle('open', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      document.body.style.overflow = isOpen ? 'hidden' : '';

      if (isOpen) {
        const firstLink = mobileMenu.querySelector('a');
        if (firstLink) firstLink.focus();
      } else {
        mobileToggle.focus();
      }
    };

    mobileToggle.addEventListener('click', () => toggleMobileMenu());

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMobileMenu(false));
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        toggleMobileMenu(false);
      }
    });
  }

  // -------------------------------------------------------
  // 3. Smooth scroll for anchor links
  // -------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth'
        });
        // Set focus to landmark/target for keyboard navigators
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });

  // -------------------------------------------------------
  // 4. Scroll reveal animations (Respects Reduced Motion)
  // -------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    revealElements.forEach(el => el.classList.add('revealed'));
  } else if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // -------------------------------------------------------
  // 5. Lookbook Category Filtering & ARIA Tabs (WCAG 4.1.2)
  // -------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const lookbookCards = document.querySelectorAll('.lookbook-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      lookbookCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = '';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // -------------------------------------------------------
  // 6. Lightbox Modal Dialog (WCAG 2.1.1, 2.1.2, 2.4.3, 4.1.2)
  // -------------------------------------------------------
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCat = document.getElementById('lightbox-cat');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxInquireBtn = document.getElementById('lightbox-inquire-btn');
  const lightboxWhatsappBtn = document.getElementById('lightbox-whatsapp-btn');
  let previouslyFocusedElement = null;

  const openLightbox = (imgSrc, title, type, triggerEl) => {
    if (!lightboxModal) return;
    previouslyFocusedElement = triggerEl || document.activeElement;

    lightboxImg.src = imgSrc;
    lightboxImg.alt = `${title} - ${type}`;
    lightboxTitle.textContent = title;
    lightboxCat.textContent = type;

    // Dynamic WhatsApp inquiry message
    if (lightboxWhatsappBtn) {
      const waMsg = encodeURIComponent(`Hello Gabbie Jane, I would like to inquire about the "${title}" (${type}) from the lookbook.`);
      lightboxWhatsappBtn.href = `https://wa.me/?text=${waMsg}`;
    }

    lightboxModal.classList.add('open');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button on open
    setTimeout(() => {
      if (lightboxClose) lightboxClose.focus();
    }, 100);

    // Inquire for this look action
    if (lightboxInquireBtn) {
      lightboxInquireBtn.onclick = (e) => {
        e.preventDefault();
        closeLightbox();

        const inquirySection = document.getElementById('inquiry');
        const ideaTextarea = document.getElementById('form-idea');
        const serviceSelect = document.getElementById('form-service');
        const nameInput = document.getElementById('form-name');

        if (ideaTextarea) {
          ideaTextarea.value = `Hello, I would like to inquire about the "${title}" (${type}) from the lookbook.`;
        }

        if (serviceSelect && type) {
          const typeLower = type.toLowerCase();
          if (typeLower.includes('kimono') || typeLower.includes('bubu')) {
            serviceSelect.value = 'Ready-to-Wear Kimonos & Bubus';
          } else if (typeLower.includes('bespoke') || typeLower.includes('couture') || typeLower.includes('gala')) {
            serviceSelect.value = 'Bespoke Tailoring (Couture / Bridal)';
          } else if (typeLower.includes('made-to-order') || typeLower.includes('order')) {
            serviceSelect.value = 'Made-to-Order Pieces';
          }
        }

        if (inquirySection) {
          inquirySection.scrollIntoView({ behavior: 'smooth' });
        }

        setTimeout(() => {
          if (nameInput) {
            nameInput.focus();
          }
        }, 500);
      };
    }
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('open');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Restore focus to previously focused element (WCAG 2.4.3)
    if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
      previouslyFocusedElement.focus();
    }
  };

  // Click and keyboard triggers for Lookbook Cards (WCAG 2.1.1)
  lookbookCards.forEach(card => {
    const triggerCard = () => {
      const imgSrc = card.getAttribute('data-img');
      const title = card.getAttribute('data-title');
      const type = card.getAttribute('data-type');
      openLightbox(imgSrc, title, type, card);
    };

    card.addEventListener('click', triggerCard);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerCard();
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  // Keyboard navigation & Focus Trapping inside modal (WCAG 2.1.2)
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('open')) return;

    if (e.key === 'Escape') {
      closeLightbox();
      return;
    }

    if (e.key === 'Tab') {
      const focusableElements = lightboxModal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  });

  // -------------------------------------------------------
  // 7. Inquiry Form Validation & ARIA Feedback (WCAG 3.3.1, 3.3.2)
  // -------------------------------------------------------
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const clearBtn = document.getElementById('form-clear-btn');
  const formDate = document.getElementById('form-date');

  // Constrain to future dates
  if (formDate) {
    const today = new Date().toISOString().split('T')[0];
    formDate.setAttribute('min', today);
  }

  if (form) {
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const phoneInput = document.getElementById('form-phone');
    const serviceInput = document.getElementById('form-service');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const phoneError = document.getElementById('phone-error');
    const serviceError = document.getElementById('service-error');

    const inputsWithErrors = [
      { input: nameInput, error: nameError },
      { input: emailInput, error: emailError },
      { input: phoneInput, error: phoneError },
      { input: serviceInput, error: serviceError }
    ];

    // Clear validation on input
    inputsWithErrors.forEach(item => {
      if (item.input && item.error) {
        item.input.addEventListener('input', () => {
          item.input.parentElement.classList.remove('has-error');
          item.input.removeAttribute('aria-invalid');
          item.error.textContent = '';
        });
      }
    });

    // Clear form handler
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        form.reset();
        inputsWithErrors.forEach(item => {
          if (item.error) item.error.textContent = '';
          if (item.input) {
            item.input.parentElement.classList.remove('has-error');
            item.input.removeAttribute('aria-invalid');
          }
        });
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      let firstInvalidInput = null;
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const phone = phoneInput.value.trim();
      const service = serviceInput.value;

      // Reset errors
      inputsWithErrors.forEach(item => {
        if (item.error) item.error.textContent = '';
        if (item.input) {
          item.input.parentElement.classList.remove('has-error');
          item.input.removeAttribute('aria-invalid');
        }
      });

      // Name validation
      if (!name) {
        nameError.textContent = 'Please enter your full name.';
        nameInput.parentElement.classList.add('has-error');
        nameInput.setAttribute('aria-invalid', 'true');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = nameInput;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        emailError.textContent = 'Please enter your email address.';
        emailInput.parentElement.classList.add('has-error');
        emailInput.setAttribute('aria-invalid', 'true');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = emailInput;
      } else if (!emailRegex.test(email)) {
        emailError.textContent = 'Please enter a valid email address.';
        emailInput.parentElement.classList.add('has-error');
        emailInput.setAttribute('aria-invalid', 'true');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = emailInput;
      }

      // Phone validation
      if (!phone) {
        phoneError.textContent = 'Please enter your WhatsApp/Phone number.';
        phoneInput.parentElement.classList.add('has-error');
        phoneInput.setAttribute('aria-invalid', 'true');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = phoneInput;
      }

      // Service validation
      if (!service) {
        serviceError.textContent = 'Please select a garment category.';
        serviceInput.parentElement.classList.add('has-error');
        serviceInput.setAttribute('aria-invalid', 'true');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = serviceInput;
      }

      if (!isValid) {
        if (firstInvalidInput) {
          firstInvalidInput.focus();
        }
        if (submitBtn) shakeButton(submitBtn);
        return;
      }

      // Submit feedback
      submitBtn.textContent = 'Transmitting to Atelier...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      setTimeout(() => {
        submitBtn.textContent = '✓ Inquiry Received by Atelier!';
        submitBtn.style.background = '#ffffff';
        submitBtn.style.color = '#000000';
        submitBtn.style.opacity = '1';

        setTimeout(() => {
          form.reset();
          submitBtn.textContent = 'Submit Inquiry';
          submitBtn.disabled = false;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
        }, 4000);
      }, 1200);
    });
  }

  function shakeButton(btn) {
    btn.style.animation = 'shake 0.4s ease';
    setTimeout(() => { btn.style.animation = ''; }, 400);
  }

  // -------------------------------------------------------
  // 8. FAQ Accordion Toggle & ARIA state (WCAG 4.1.2)
  // -------------------------------------------------------
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const faqItem = btn.parentElement;
      const isCurrentlyActive = faqItem.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        const qBtn = item.querySelector('.faq-question');
        if (qBtn) qBtn.setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked
      if (!isCurrentlyActive) {
        faqItem.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // -------------------------------------------------------
  // 9. Back to Top Button (WCAG 2.1.1)
  // -------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      const topTarget = document.getElementById('navbar') || document.body;
      if (topTarget) topTarget.focus({ preventScroll: true });
    });
  }

});
