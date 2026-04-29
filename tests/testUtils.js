class LocalStorageMock {
    constructor() {
        this.store = new Map()
    }

    getItem(key) {
        return this.store.has(key) ? this.store.get(key) : null
    }

    setItem(key, value) {
        this.store.set(key, String(value))
    }

    removeItem(key) {
        this.store.delete(key)
    }

    clear() {
        this.store.clear()
    }
}

export function installLocalStorageMock() {
    const storage = new LocalStorageMock()
    Object.defineProperty(globalThis, "localStorage", {
        value: storage,
        configurable: true,
    })
    Object.defineProperty(window, "localStorage", {
        value: storage,
        configurable: true,
    })
    return storage
}
