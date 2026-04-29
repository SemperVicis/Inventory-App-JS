export default class Storage {
    static productsKey = "products"
    static categoriesKey = "categories"
    static auditEventsKey = "auditEvents"

    static get getProducts() {
        return this.safeReadArray(this.productsKey).filter((product) => this.isValidProduct(product))
    }

    static getCategories() {
        return this.safeReadArray(this.categoriesKey).filter((category) => this.isValidCategory(category))
    }

    static saveProducts(productsList) {
        const timestamp = new Date().toISOString()
        const products = Array.isArray(productsList) ? productsList : []
        const normalizedProducts = products
            .filter((product) => this.isValidProduct(product))
            .map((product) => this.withTimestamps(product, timestamp))

        localStorage.setItem(this.productsKey, JSON.stringify(normalizedProducts))
    }

    static saveCategories(categoriesList) {
        const timestamp = new Date().toISOString()
        const categories = Array.isArray(categoriesList) ? categoriesList : []
        const normalizedCategories = categories
            .filter((category) => this.isValidCategory(category))
            .map((category) => ({
                ...this.withTimestamps(category, timestamp),
                title: category.title.trim(),
                description: typeof category.description === "string" ? category.description : "",
            }))

        localStorage.setItem(this.categoriesKey, JSON.stringify(normalizedCategories))
    }

    static removeProduct(deletedId) {
        const productId = Number(deletedId)
        const products = this.getProducts
        const productExists = products.some((product) => product.id === productId)
        const updatedProducts = products.filter((product) => product.id !== productId)

        this.saveProducts(updatedProducts)

        if (productExists) {
            this.addAuditEvent({
                type: "product_deleted",
                productId,
                timestamp: new Date().toISOString(),
            })
        }
    }

    static getAuditEvents() {
        return this.safeReadArray(this.auditEventsKey).filter((event) => this.isValidAuditEvent(event))
    }

    static addAuditEvent(event) {
        if (!this.isValidAuditEvent(event)) return

        const auditEvents = this.getAuditEvents()
        auditEvents.push(event)
        localStorage.setItem(this.auditEventsKey, JSON.stringify(auditEvents))
    }

    static clearAll() {
        localStorage.removeItem(this.productsKey)
        localStorage.removeItem(this.categoriesKey)
        localStorage.removeItem(this.auditEventsKey)
    }

    static reset() {
        this.clearAll()
    }

    static safeReadArray(key) {
        try {
            const rawValue = localStorage.getItem(key)
            if (!rawValue) return []

            const parsedValue = JSON.parse(rawValue)
            return Array.isArray(parsedValue) ? parsedValue : []
        } catch {
            return []
        }
    }

    static withTimestamps(record, timestamp) {
        return {
            ...record,
            createdAt: this.isNonEmptyString(record.createdAt) ? record.createdAt : timestamp,
            updatedAt: timestamp,
        }
    }

    static isValidProduct(product) {
        return this.isPlainObject(product)
            && typeof product.id === "number"
            && this.isNonEmptyString(product.title)
            && (typeof product.quantity === "number" || typeof product.quantity === "string")
            && typeof product.location === "string"
            && typeof product.category === "string"
    }

    static isValidCategory(category) {
        return this.isPlainObject(category)
            && typeof category.id === "number"
            && this.isNonEmptyString(category.title)
            && (typeof category.description === "undefined" || typeof category.description === "string")
    }

    static isValidAuditEvent(event) {
        return this.isPlainObject(event)
            && this.isNonEmptyString(event.type)
            && this.isNonEmptyString(event.timestamp)
    }

    static isPlainObject(value) {
        return value !== null && typeof value === "object" && !Array.isArray(value)
    }

    static isNonEmptyString(value) {
        return typeof value === "string" && value.trim().length > 0
    }

}
