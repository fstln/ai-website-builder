import { Component } from '../utils/component-base.js';

/**
 * Countdown Timer Component
 * Displays a countdown to a specific date or for a fixed duration
 * 
 * Usage:
 * <countdown-timer data-deadline="2023-12-31T23:59:59" data-expired-message="Offer ended"></countdown-timer>
 */
export class CountdownTimer extends Component {
  constructor() {
    super();
    this.timerInterval = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.startTimer();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopTimer();
  }

  startTimer() {
    const deadlineAttr = this.dataset.deadline;
    if (!deadlineAttr) return;

    let targetTime = new Date(deadlineAttr).getTime();

    if (isNaN(targetTime)) {
      console.error('Invalid deadline format');
      return;
    }

    this.updateDisplay(targetTime);

    // Use requestAnimationFrame for smooth millisecond updates
    const animate = () => {
      this.updateDisplay(targetTime);
      this.timerFrame = requestAnimationFrame(animate);
    };
    this.timerFrame = requestAnimationFrame(animate);
  }

  stopTimer() {
    if (this.timerFrame) {
      cancelAnimationFrame(this.timerFrame);
      this.timerFrame = null;
    }
  }

  updateDisplay(targetTime) {
    const now = new Date().getTime();
    const distance = targetTime - now;

    if (distance < 0) {
      this.stopTimer();
      this.innerHTML = `<div class="text-error font-medium">${this.dataset.expiredMessage || 'Offer ended'}</div>`;
      return;
    }

    // Calculate time components
    // Days are converted to hours
    const hours = Math.floor(distance / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    const milliseconds = Math.floor((distance % 1000) / 10); // Show first 2 digits of ms

    // Update DOM elements if they exist
    const hoursEl = this.querySelector('[data-hours]');
    const minutesEl = this.querySelector('[data-minutes]');
    const secondsEl = this.querySelector('[data-seconds]');
    const msEl = this.querySelector('[data-milliseconds]');

    if (hoursEl && minutesEl && secondsEl) {
      hoursEl.textContent = this.formatNumber(hours);
      minutesEl.textContent = this.formatNumber(minutes);
      secondsEl.textContent = this.formatNumber(seconds);
      if (msEl) {
        msEl.textContent = this.formatNumber(milliseconds);
      }
    } else {
      // Fallback simple render
      this.textContent = `${hours}:${this.formatNumber(minutes)}:${this.formatNumber(seconds)}.${this.formatNumber(milliseconds)}`;
    }
  }

  formatNumber(num) {
    return num < 10 ? `0${num}` : num;
  }
}

if (!customElements.get('countdown-timer')) {
  customElements.define('countdown-timer', CountdownTimer);
}
