let flashTimer;

export function createHud() {
  return {
    badge: document.querySelector('#visionBadge'),
    center: document.querySelector('#centerStatus'),
    statusText: document.querySelector('#statusText'),
    flash: document.querySelector('#gestureFlash'),
    flashTitle: document.querySelector('#gestureFlashTitle'),
    flashSubtitle: document.querySelector('#gestureFlashSubtitle'),
    maskName: document.querySelector('#maskName')
  };
}

export function setStatus(hud, text, tone = 'normal') {
  hud.statusText.textContent = text;
  hud.badge.classList.toggle('error', tone === 'error');
  hud.badge.textContent = tone === 'error' ? 'NEEDS ATTENTION' : 'VISION ONLINE';
  hud.center.classList.toggle('ready', tone === 'ready');
}

export function setMaskName(hud, name) { hud.maskName.textContent = name; }

export function flashGesture(hud, title, subtitle) {
  clearTimeout(flashTimer);
  hud.flashTitle.textContent = title;
  hud.flashSubtitle.textContent = subtitle;
  hud.flash.classList.add('show');
  hud.flash.setAttribute('aria-hidden', 'false');
  flashTimer = setTimeout(() => {
    hud.flash.classList.remove('show');
    hud.flash.setAttribute('aria-hidden', 'true');
  }, 900);
}
