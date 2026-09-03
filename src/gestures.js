export const MASK_IDS = ['iron', 'cyber', 'void'];

export function gestureToAction(label) {
  switch (label) {
    case 'Open_Palm': return 'clear';
    case 'Closed_Fist': return 'iron';
    case 'Victory': return 'next';
    case 'ILoveYou': return 'cyber';
    default: return null;
  }
}

export function cycleMask(current, direction, maskIds = MASK_IDS) {
  if (!maskIds.length) return null;
  const start = Math.max(0, maskIds.indexOf(current));
  const next = (start + direction + maskIds.length) % maskIds.length;
  return maskIds[next];
}

export function inferPointDirection(landmarks) {
  if (!landmarks || landmarks.length < 9) return null;
  const pip = landmarks[6];
  const tip = landmarks[8];
  const dx = tip.x - pip.x;
  const dy = tip.y - pip.y;
  if (Math.abs(dx) < Math.abs(dy) * 1.1) return null;
  return dx > 0 ? 'right' : 'left';
}
