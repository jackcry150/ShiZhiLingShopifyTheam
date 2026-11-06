/*
 * THYLING shared UI
 * - <thyling-carousel>: horizontal track with prev/next buttons, optional dots and autoplay.
 * - <thyling-media-stage>: image/video stage; thumbnails swap and play the selected video.
 * - <thyling-dialog>: membership invite / registration dialogs.
 */
(() => {
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!customElements.get('thyling-carousel')) {
    customElements.define(
      'thyling-carousel',
      class ThylingCarousel extends HTMLElement {
        connectedCallback() {
          this.track = this.querySelector('[data-carousel-track]');
          if (!this.track || this.dataset.ready === 'true') return;
          this.dataset.ready = 'true';

          // Buttons may live once in the carousel or inside every slide (e.g. membership slideshow).
          this.prevButtons = Array.from(this.querySelectorAll('[data-carousel-prev]'));
          this.nextButtons = Array.from(this.querySelectorAll('[data-carousel-next]'));
          this.dots = Array.from(this.querySelectorAll('[data-carousel-dot]'));

          this.prevButtons.forEach((button) => button.addEventListener('click', () => this.stepFrom(button, -1, '[data-carousel-prev]')));
          this.nextButtons.forEach((button) => button.addEventListener('click', () => this.stepFrom(button, 1, '[data-carousel-next]')));
          this.dots.forEach((dot, index) => dot.addEventListener('click', () => this.goTo(index)));

          this.onScroll = () => {
            window.cancelAnimationFrame(this.frame);
            this.frame = window.requestAnimationFrame(() => this.update());
          };
          this.track.addEventListener('scroll', this.onScroll, { passive: true });
          this.resizeObserver = new ResizeObserver(() => this.update());
          this.resizeObserver.observe(this.track);

          this.setupAutoplay();
          this.update();
        }

        disconnectedCallback() {
          this.stopAutoplay();
          window.clearTimeout(this.pendingTimer);
          this.resizeObserver?.disconnect();
          this.track?.removeEventListener('scroll', this.onScroll);
          document.removeEventListener('visibilitychange', this.onVisibility);
          this.dataset.ready = 'false';
        }

        get items() {
          return Array.from(this.track.children).filter((item) => !item.hidden);
        }

        get stepSize() {
          const first = this.items[0];
          if (!first) return this.track.clientWidth;
          const gap = parseFloat(getComputedStyle(this.track).columnGap) || 0;
          return first.getBoundingClientRect().width + gap;
        }

        get index() {
          return Math.round(this.track.scrollLeft / this.stepSize);
        }

        get atStart() {
          return this.track.scrollLeft <= 2;
        }

        get atEnd() {
          return this.track.scrollLeft + this.track.clientWidth >= this.track.scrollWidth - 2;
        }

        goTo(index, smooth = true) {
          const max = this.items.length - 1;
          const target = Math.max(0, Math.min(index, max));
          this.pendingTarget = target;
          window.clearTimeout(this.pendingTimer);
          this.pendingTimer = window.setTimeout(() => {
            this.pendingTarget = null;
            this.update();
          }, 900);
          this.track.scrollTo({ left: target * this.stepSize, behavior: smooth && !reducedMotion() ? 'smooth' : 'auto' });
          return target;
        }

        step(direction) {
          const loop = this.dataset.loop === 'true';
          if (direction > 0 && this.atEnd) return loop ? this.goTo(0) : this.index;
          if (direction < 0 && this.atStart) return loop ? this.goTo(this.items.length - 1) : this.index;
          return this.goTo(this.index + direction);
        }

        stepFrom(button, direction, selector) {
          const target = this.step(direction);
          // Keep keyboard focus on the matching control of the newly shown slide.
          if (!this.track.contains(button)) return;
          const item = this.items[target];
          const counterpart = item?.querySelector(selector);
          if (counterpart) {
            item.inert = false;
            counterpart.focus({ preventScroll: true });
          }
        }

        update() {
          const scrollable = this.track.scrollWidth > this.track.clientWidth + 2;
          this.classList.toggle('is-scrollable', scrollable);
          const loop = this.dataset.loop === 'true';
          this.prevButtons.forEach((button) => (button.disabled = !scrollable || (!loop && this.atStart)));
          this.nextButtons.forEach((button) => (button.disabled = !scrollable || (!loop && this.atEnd)));
          const current = this.atEnd ? this.items.length - 1 : this.index;
          if (this.hasAttribute('data-inert-inactive')) {
            const active = this.pendingTarget ?? current;
            this.items.forEach((item, index) => (item.inert = index !== active));
          }
          this.dots.forEach((dot, index) => {
            if (index === current) dot.setAttribute('aria-current', 'true');
            else dot.removeAttribute('aria-current');
          });
          this.items.forEach((item, index) => item.toggleAttribute('data-active', index === current));
        }

        setupAutoplay() {
          const seconds = Number(this.dataset.autoplay || 0);
          if (!seconds || this.items.length < 2 || reducedMotion() || window.Shopify?.designMode) return;
          this.autoplayDelay = seconds * 1000;
          const pause = () => this.stopAutoplay();
          const resume = () => this.startAutoplay();
          this.addEventListener('mouseenter', pause);
          this.addEventListener('mouseleave', resume);
          this.addEventListener('focusin', pause);
          this.addEventListener('focusout', resume);
          this.addEventListener('touchstart', pause, { passive: true });
          this.onVisibility = () => (document.hidden ? pause() : resume());
          document.addEventListener('visibilitychange', this.onVisibility);
          this.startAutoplay();
        }

        startAutoplay() {
          if (!this.autoplayDelay) return;
          this.stopAutoplay();
          this.timer = window.setInterval(() => (this.atEnd ? this.goTo(0) : this.step(1)), this.autoplayDelay);
        }

        stopAutoplay() {
          window.clearInterval(this.timer);
        }
      }
    );
  }

  if (!customElements.get('thyling-media-stage')) {
    customElements.define(
      'thyling-media-stage',
      class ThylingMediaStage extends HTMLElement {
        connectedCallback() {
          if (this.dataset.ready === 'true') return;
          this.dataset.ready = 'true';

          this.player = this.querySelector('[data-stage-player]');
          const posterHost = this.querySelector('[data-stage-poster]');
          this.poster = posterHost?.tagName === 'IMG' ? posterHost : posterHost?.querySelector('img');
          this.playButton = this.querySelector('[data-stage-play]');
          this.thumbs = Array.from(this.querySelectorAll('[data-media-thumb]'));
          this.current = this.mediaFrom(this);

          this.playButton?.addEventListener('click', () => this.play(this.current));
          this.thumbs.forEach((thumb) => {
            thumb.addEventListener('click', (event) => {
              const media = this.mediaFrom(thumb);
              if (!media.video && !media.embed) return;
              event.preventDefault();
              this.select(thumb, media);
              this.play(media);
            });
          });

          if (!this.current.video && !this.current.embed) {
            const firstPlayable = this.thumbs.find((thumb) => thumb.dataset.videoSrc || thumb.dataset.embedSrc);
            if (firstPlayable) this.select(firstPlayable, this.mediaFrom(firstPlayable), false);
          }
          this.updatePlayButton();
        }

        disconnectedCallback() {
          this.stop();
          this.dataset.ready = 'false';
        }

        mediaFrom(element) {
          return {
            video: element.dataset.videoSrc || '',
            embed: element.dataset.embedSrc || '',
            poster: element.dataset.poster || '',
            title: element.dataset.title || '',
          };
        }

        select(thumb, media, updatePoster = true) {
          this.thumbs.forEach((item) => item.setAttribute('aria-pressed', String(item === thumb)));
          this.current = media;
          if (updatePoster && media.poster && this.poster) {
            this.poster.removeAttribute('srcset');
            this.poster.src = media.poster;
          }
          this.updatePlayButton();
        }

        updatePlayButton() {
          if (!this.playButton) return;
          this.playButton.hidden = !(this.current.video || this.current.embed);
          if (this.current.title) this.playButton.setAttribute('aria-label', `Play video: ${this.current.title}`);
        }

        play(media) {
          if (!this.player || (!media.video && !media.embed)) return;
          this.stop();
          let element;
          if (media.video) {
            element = document.createElement('video');
            element.src = media.video;
            element.controls = true;
            element.playsInline = true;
            element.autoplay = true;
            if (media.poster) element.poster = media.poster;
            element.addEventListener('ended', () => this.stop());
          } else {
            element = document.createElement('iframe');
            element.src = media.embed;
            element.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
            element.allowFullscreen = true;
            element.title = media.title || 'Video';
          }
          this.player.replaceChildren(element);
          this.classList.add('is-playing');
          if (element.tagName === 'VIDEO') element.play().catch(() => {});
          element.focus({ preventScroll: true });
        }

        stop() {
          this.player?.replaceChildren();
          this.classList.remove('is-playing');
        }
      }
    );
  }

  /*
   * <thyling-dialog id="..."> wrapping a <dialog>.
   * - data-auto-open="5": open automatically after N seconds, once per browser session (data-session-key).
   * - data-open-on-load: open immediately (e.g. after a form post).
   * - Any [data-dialog-open="<id>"] element or link ending in "#<id>" opens it.
   * - In the theme editor it opens when its section is selected.
   */
  if (!customElements.get('thyling-dialog')) {
    const openers = new Map();
    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-dialog-open], a[href*="#"]');
      if (!trigger) return;
      const id = trigger.dataset.dialogOpen || (trigger.hash ? trigger.hash.slice(1) : '');
      const target = id && openers.get(id);
      if (!target) return;
      event.preventDefault();
      target.open(trigger);
    });

    customElements.define(
      'thyling-dialog',
      class ThylingDialog extends HTMLElement {
        connectedCallback() {
          this.dialog = this.querySelector('dialog');
          if (!this.dialog || this.dataset.ready === 'true') return;
          this.dataset.ready = 'true';
          if (this.id) openers.set(this.id, this);

          this.dialog.addEventListener('click', (event) => {
            if (event.target === this.dialog || event.target.closest('[data-dialog-close]')) this.close();
            // Following a link inside the dialog closes it.
            else if (event.target.closest('a[href]')) this.dialog.close();
          });
          // Esc / native close: restore focus after the browser's own focus handling.
          this.dialog.addEventListener('close', () => {
            this.remember();
            this.restoreFocus();
          });

          this.sectionId = this.dataset.sectionId;
          this.onSelect = (event) => event.detail?.sectionId === this.sectionId && this.open();
          this.onDeselect = (event) => event.detail?.sectionId === this.sectionId && this.close();
          document.addEventListener('shopify:section:select', this.onSelect);
          document.addEventListener('shopify:section:deselect', this.onDeselect);

          if (this.hasAttribute('data-open-on-load')) {
            this.open();
            return;
          }
          const seconds = Number(this.dataset.autoOpen || 0);
          if (seconds > 0 && !window.Shopify?.designMode && !this.seen()) {
            this.timer = window.setTimeout(() => {
              if (!document.querySelector('dialog[open]')) this.open();
            }, seconds * 1000);
          }
        }

        disconnectedCallback() {
          window.clearTimeout(this.timer);
          document.removeEventListener('shopify:section:select', this.onSelect);
          document.removeEventListener('shopify:section:deselect', this.onDeselect);
          if (this.id && openers.get(this.id) === this) openers.delete(this.id);
          this.dataset.ready = 'false';
        }

        open(trigger) {
          window.clearTimeout(this.timer);
          this.returnFocus = trigger || document.activeElement;
          if (!this.dialog.open) this.dialog.showModal();
          this.remember();
        }

        close() {
          if (!this.dialog.open) return;
          this.dialog.close();
          this.remember();
          this.restoreFocus();
        }

        restoreFocus() {
          const target = this.returnFocus;
          this.returnFocus = null;
          if (!target?.isConnected || typeof target.focus !== 'function') return;
          target.focus({ preventScroll: true });
          window.setTimeout(() => {
            if (!this.dialog.open && document.activeElement !== target) target.focus({ preventScroll: true });
          }, 0);
        }

        seen() {
          if (!this.dataset.sessionKey) return false;
          try {
            return window.sessionStorage.getItem(this.dataset.sessionKey) === 'seen';
          } catch (error) {
            return false;
          }
        }

        remember() {
          if (!this.dataset.sessionKey) return;
          try {
            window.sessionStorage.setItem(this.dataset.sessionKey, 'seen');
          } catch (error) {
            // Storage can be unavailable (private mode); the dialog still works.
          }
        }
      }
    );
  }
})();
