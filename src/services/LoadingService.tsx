class LoadingService {
    private static listeners: ((loading: boolean) => void)[] = [];

    static setLoading(loading: boolean) {
        LoadingService.listeners.forEach((listener) => listener(loading));
    }

    static subscribe(listener: (loading: boolean) => void) {
        LoadingService.listeners.push(listener);
        return () => {
            LoadingService.listeners = LoadingService.listeners.filter((l) => l !== listener);
        };
    }
}

export default LoadingService;