// Turns assets served by this site into data URLs, so exported files never
// point back at internal paths (/images/..., /fonts/...) behind the login gate.

// Displayed at ~124px; twice that keeps it sharp on retina screens and print.
const AVATAR_EXPORT_SIZE = 256;

export const isInternalPath = (src) => typeof src === 'string' && src.startsWith('/') && !src.startsWith('//');

export const fetchAsDataUrl = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Could not load ${url} (${response.status})`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
    });
};

const loadImage = (src) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load image ${src}`));
    img.src = src;
});

// Center-crops to a square and shrinks it: the source photo can be several MB.
const shrinkAvatar = async (src) => {
    const img = await loadImage(src);
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    const canvas = document.createElement('canvas');
    canvas.width = AVATAR_EXPORT_SIZE;
    canvas.height = AVATAR_EXPORT_SIZE;
    canvas.getContext('2d').drawImage(
        img,
        (img.naturalWidth - side) / 2,
        (img.naturalHeight - side) / 2,
        side,
        side,
        0,
        0,
        AVATAR_EXPORT_SIZE,
        AVATAR_EXPORT_SIZE
    );
    return canvas.toDataURL('image/jpeg', 0.9);
};

// Internal avatar paths become an embedded image; external URLs and existing
// data URLs are kept. An internal image that fails to load is dropped rather
// than leaking its path.
export const toPortableAvatar = async (avatar) => {
    if (!isInternalPath(avatar)) {
        return avatar ?? '';
    }
    try {
        return await shrinkAvatar(avatar);
    } catch {
        return '';
    }
};
