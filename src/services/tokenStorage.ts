export const STORAGE_KEY = 'auth_tokens';
export const isAuthenticated = 'is_authenticated' 
export const saveTokens = async (tokens: {
    tempToken?: string;
    accessToken?: string;
    refreshToken?: string;
}) => {
    try {

        const existing = await loadTokens();

        const newTokens = {
            tempToken:
                tokens.accessToken && tokens.refreshToken
                    ? null
                    : tokens.tempToken ?? existing?.tempToken ?? null,
            accessToken: tokens.accessToken ?? existing?.accessToken ?? null,
            refreshToken: tokens.refreshToken ?? existing?.refreshToken ?? null,
        };

        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newTokens));
        sessionStorage.setItem(isAuthenticated, 'true');
    } catch (e) {
    }
};


export const loadTokens = () => {
    try {
        const data = sessionStorage.getItem(STORAGE_KEY);
        if (data) return JSON.parse(data);
        return null;
    } catch (e) {
        return null;
    }
};

export const clearTokens = async () => {
    try {
        await sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {
    }
};
