const KEY = "mentorlagbe_jwt";

export const setJWT = (t: string) => localStorage.setItem(KEY, t);
export const getJWT = () => (typeof window === "undefined" ? null : localStorage.getItem(KEY));
export const clearJWT = () => localStorage.removeItem(KEY);