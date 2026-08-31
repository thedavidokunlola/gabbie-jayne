// ============================================================
// INKBORN — Tattoo Studio Landing Page JavaScript
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // -------------------------------------------------------
  // Navbar scroll effect
  // -------------------------------------------------------
  const navbar = document.getElementById('navbar');

  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run on load

  // -------------------------------------------------------
  // Mobile menu toggle
  // -------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // -------------------------------------------------------
  // Smooth scroll for anchor links
  // -------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // -------------------------------------------------------
  // Scroll reveal animations (IntersectionObserver)
  // -------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: just show everything
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // -------------------------------------------------------
  // Active nav link highlighting
  // -------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  const highlightNav = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = '#1B8A7A';
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  // -------------------------------------------------------
  // Contact form validation & submission
  // -------------------------------------------------------
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const formDate = document.getElementById('form-date');

  // Prevent selecting past dates on date picker
  if (formDate) {
    const today = new Date().toISOString().split('T')[0];
    formDate.setAttribute('min', today);
  }

  if (form) {
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');

    // Clear errors on input
    nameInput.addEventListener('input', () => {
      nameInput.parentElement.classList.remove('has-error');
      nameError.textContent = '';
    });

    emailInput.addEventListener('input', () => {
      emailInput.parentElement.classList.remove('has-error');
      emailError.textContent = '';
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();

      // Clear previous error messages
      nameError.textContent = '';
      emailError.textContent = '';
      nameInput.parentElement.classList.remove('has-error');
      emailInput.parentElement.classList.remove('has-error');

      // Validate name
      if (!name) {
        nameError.textContent = 'Please enter your name.';
        nameInput.parentElement.classList.add('has-error');
        isValid = false;
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        emailError.textContent = 'Please enter your email address.';
        emailInput.parentElement.classList.add('has-error');
        isValid = false;
      } else if (!emailRegex.test(email)) {
        emailError.textContent = 'Please enter a valid email address.';
        emailInput.parentElement.classList.add('has-error');
        isValid = false;
      }

      if (!isValid) {
        shakeButton(submitBtn);
        return;
      }

      // Simulate submission
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      setTimeout(() => {
        submitBtn.textContent = '✓ Request Sent!';
        submitBtn.style.background = '#1B8A7A';
        submitBtn.style.borderColor = '#1B8A7A';
        submitBtn.style.opacity = '1';

        setTimeout(() => {
          form.reset();
          submitBtn.textContent = 'Send Request';
          submitBtn.disabled = false;
          submitBtn.style.background = '';
          submitBtn.style.borderColor = '';
        }, 3000);
      }, 1500);
    });
  }

  function shakeButton(btn) {
    btn.style.animation = 'shake 0.4s ease';
    setTimeout(() => { btn.style.animation = ''; }, 400);
  }

  // Add shake keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-8px); }
      50% { transform: translateX(8px); }
      75% { transform: translateX(-4px); }
    }
  `;
  document.head.appendChild(style);

  // -------------------------------------------------------
  // FAQ Accordion Toggle
  // -------------------------------------------------------
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const faqItem = btn.parentElement;
      const isActive = faqItem.classList.contains('active');

      // Close all active items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });

      // Toggle clicked item
      if (!isActive) {
        faqItem.classList.add('active');
      }
    });
  });

  // -------------------------------------------------------
  // Back to Top Button
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
    });
  }

  // -------------------------------------------------------
  // Parallax-lite on hero background
  // -------------------------------------------------------
  const heroBg = document.querySelector('.hero-bg img');

  if (heroBg && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.3}px) scale(1.05)`;
      }
    }, { passive: true });
  }

  // -------------------------------------------------------
  // Portfolio image hover tilt (subtle)
  // -------------------------------------------------------
  document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const img = item.querySelector('img');
      if (img) {
        img.style.transform = `scale(1.08) translate(${x * 8}px, ${y * 8}px)`;
      }
    });

    item.addEventListener('mouseleave', () => {
      const img = item.querySelector('img');
      if (img) {
        img.style.transform = '';
      }
    });
  });

});
