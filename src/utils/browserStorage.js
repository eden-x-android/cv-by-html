// JSON read/write on localStorage that never throws: private mode or a full
// quota just means nothing is remembered for the next visit.

export const loadStoredJson = (key) => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

export const saveStoredJson = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Storage unavailable or full: the app keeps working for this session.
    }
};
