/** Мягкое появление блоков при прокрутке. Уважает prefers-reduced-motion. */
import { prefersReducedMotion, qsa } from '../core/dom.js';

export function initReveal(selector = '[data-reveal]') {
  const nodes = qsa(selector);

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    nodes.forEach((node) => node.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => entry.target.classList.add('is-revealed'), index * 60);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

  nodes.forEach((node) => observer.observe(node));
}
