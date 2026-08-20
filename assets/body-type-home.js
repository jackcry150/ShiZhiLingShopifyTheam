if (!customElements.get('body-type-quiz-popup')) {
  customElements.define(
    'body-type-quiz-popup',
    class BodyTypeQuizPopup extends HTMLElement {
      connectedCallback() {
        this.dialog = this.querySelector('dialog');
        if (!this.dialog || this.dataset.initialized === 'true') return;

        this.dataset.initialized = 'true';
        this.storageKey = this.dataset.storageKey || 'bt-quiz-prompt';
        this.closeButtons = this.querySelectorAll('[data-quiz-prompt-close]');
        this.closeButtons.forEach((button) => button.addEventListener('click', () => this.dismiss()));
        this.dialog.addEventListener('cancel', () => this.remember());
        this.dialog.addEventListener('close', () => this.remember());

        if (this.hasBeenSeen() && !window.Shopify?.designMode) return;

        const delay = window.Shopify?.designMode ? 500 : Number(this.dataset.delay || 8000);
        this.timer = window.setTimeout(() => this.show(), delay);
      }

      disconnectedCallback() {
        window.clearTimeout(this.timer);
      }

      hasBeenSeen() {
        try {
          return window.sessionStorage.getItem(this.storageKey) === 'seen';
        } catch (error) {
          return false;
        }
      }

      remember() {
        try {
          window.sessionStorage.setItem(this.storageKey, 'seen');
        } catch (error) {
          // The prompt still works when browser storage is unavailable.
        }
      }

      show() {
        if (!this.dialog.open) this.dialog.showModal();
      }

      dismiss() {
        this.remember();
        if (this.dialog.open) this.dialog.close();
      }
    }
  );
}
