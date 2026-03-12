/**
 * IDR — Institute of Digital Risk
 * script.js  |  Vanilla JavaScript, No Libraries
 *
 * Features:
 * 1. Sticky header — shadow + class on scroll
 * 2. Mobile hamburger menu toggle
 * 3. Close mobile menu on nav-link click
 * 4. Smooth scroll (CSS handles it; JS adds offset for fixed nav)
 * 5. Scroll-reveal animations via IntersectionObserver
 * 6. Active nav-link highlight on scroll
 * 7. Contact form validation & submission feedback
 */

'use strict';

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


/* ─────────────────────────────────────────
   1. Sticky Header — scroll shadow
───────────────────────────────────────── */
const header = $('#site-header');

function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 20);
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load


/* ─────────────────────────────────────────
   2. Mobile Hamburger Toggle
───────────────────────────────────────── */
const hamburger = $('#hamburger');
const navMenu = $('#nav-menu');

function openMenu() {
    hamburger.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('open');
    document.body.style.overflow = 'hidden'; // prevent background scroll
}

function closeMenu() {
    hamburger.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
});

// Close when clicking a nav link (mobile)
$$('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Close when clicking outside the menu
document.addEventListener('click', (e) => {
    if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)
    ) {
        closeMenu();
    }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMenu();
        hamburger.focus();
    }
});


/* ─────────────────────────────────────────
   3. Smooth Scroll with Nav-height offset
───────────────────────────────────────── */
$$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href');
        if (id === '#') return;

        const target = $(id);
        if (!target) return;

        e.preventDefault();

        const navHeight = header.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({ top, behavior: 'smooth' });

        // Update focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
    });
});


/* ─────────────────────────────────────────
   4. Scroll-Reveal Animation
───────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const el = entry.target;

            // Stagger children with same class inside the same parent
            const siblings = $$(
                '.reveal',
                el.parentElement
            ).filter(s => !s.classList.contains('visible'));

            const idx = siblings.indexOf(el);
            const delay = Math.min(idx * 90, 360); // cap stagger at 360ms

            setTimeout(() => {
                el.classList.add('visible');
            }, delay);

            revealObserver.unobserve(el);
        });
    },
    {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
    }
);

$$('.reveal').forEach(el => revealObserver.observe(el));


/* ─────────────────────────────────────────
   5. Active Nav-Link Highlight on Scroll
───────────────────────────────────────── */
const sections = $$('section[id], div[id]');
const navLinks = $$('.nav-link');

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const id = entry.target.id;
            navLinks.forEach(link => {
                const isActive = link.getAttribute('href') === `#${id}`;
                link.classList.toggle('active', isActive);
                link.setAttribute('aria-current', isActive ? 'true' : 'false');
            });
        });
    },
    {
        rootMargin: `-${header.offsetHeight + 10}px 0px -55% 0px`,
        threshold: 0,
    }
);

sections.forEach(s => sectionObserver.observe(s));


/* ─────────────────────────────────────────
   6. Contact Form — Validation & Feedback
───────────────────────────────────────── */
const form = $('#contact-form');
const formStatus = $('#form-status');

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Clear previous status
        formStatus.textContent = '';
        formStatus.className = 'form-status';

        // Gather values
        const fname = $('#fname').value.trim();
        const lname = $('#lname').value.trim();
        const email = $('#email').value.trim();

        // Basic validation
        const errors = [];

        if (!fname) errors.push('First name is required.');
        if (!lname) errors.push('Last name is required.');

        if (!email) {
            errors.push('Email address is required.');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push('Please enter a valid email address.');
        }

        if (errors.length > 0) {
            formStatus.textContent = errors[0];
            formStatus.classList.add('error');
            return;
        }

        // Simulate submission (replace with real fetch/API call)
        const submitBtn = form.querySelector('.btn-submit');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';

        // Fake async delay (200–800ms) — replace with real API call
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message →';

            formStatus.textContent = '✓ Thank you! We\'ll be in touch shortly.';
            formStatus.classList.add('success');

            form.reset();

            // Clear success message after 5 s
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }, 5000);

        }, 600);
    });
}