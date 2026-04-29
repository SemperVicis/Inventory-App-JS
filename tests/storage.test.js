import { beforeEach, describe, expect, it, vi } from "vitest"
import Storage from "../src/js/storage.js"

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

describe("Storage", () => {
    beforeEach(() => {
        vi.stubGlobal("localStorage", new LocalStorageMock())
    })

    it("returns an empty product list when stored JSON is corrupted", () => {
        localStorage.setItem("products", "{invalid-json")

        expect(Storage.getProducts).toEqual([])
    })

    it("filters malformed products when reading from storage", () => {
        localStorage.setItem("products", JSON.stringify([
            {
                id: 1,
                title: "Keyboard",
                quantity: "3",
                location: "BDG",
                category: "Hardware",
            },
            {
                id: "bad-id",
                title: "Invalid product",
            },
            null,
        ]))

        expect(Storage.getProducts).toEqual([
            {
                id: 1,
                title: "Keyboard",
                quantity: "3",
                location: "BDG",
                category: "Hardware",
            },
        ])
    })

    it("returns an empty category list when stored JSON is corrupted", () => {
        localStorage.setItem("categories", "{invalid-json")

        expect(Storage.getCategories()).toEqual([])
    })

    it("injects timestamps when saving products", () => {
        Storage.saveProducts([
            {
                id: 2,
                title: "Monitor",
                quantity: 1,
                location: "JKT",
                category: "Hardware",
            },
        ])

        const savedProducts = JSON.parse(localStorage.getItem("products"))

        expect(savedProducts).toHaveLength(1)
        expect(savedProducts[0].createdAt).toEqual(expect.any(String))
        expect(savedProducts[0].updatedAt).toEqual(expect.any(String))
    })

    it("validates categories and preserves optional descriptions", () => {
        Storage.saveCategories([
            {
                id: 10,
                title: "Stationery",
            },
            {
                id: 11,
                title: "   ",
                description: "Invalid category",
            },
        ])

        const savedCategories = JSON.parse(localStorage.getItem("categories"))

        expect(savedCategories).toHaveLength(1)
        expect(savedCategories[0]).toMatchObject({
            id: 10,
            title: "Stationery",
            description: "",
        })
        expect(savedCategories[0].createdAt).toEqual(expect.any(String))
        expect(savedCategories[0].updatedAt).toEqual(expect.any(String))
    })

    it("logs an audit event when a product is deleted", () => {
        Storage.saveProducts([
            {
                id: 3,
                title: "Mouse",
                quantity: 1,
                location: "MLG",
                category: "Hardware",
            },
        ])

        Storage.removeProduct(3)

        expect(Storage.getProducts).toEqual([])
        expect(Storage.getAuditEvents()).toHaveLength(1)
        expect(Storage.getAuditEvents()[0]).toMatchObject({
            type: "product_deleted",
            productId: 3,
        })
        expect(Storage.getAuditEvents()[0].timestamp).toEqual(expect.any(String))
    })

    it("clears all persisted application data", () => {
        localStorage.setItem("products", JSON.stringify([{ id: 1 }]))
        localStorage.setItem("categories", JSON.stringify([{ id: 2 }]))
        localStorage.setItem("auditEvents", JSON.stringify([{ type: "test", timestamp: "now" }]))

        Storage.reset()

        expect(localStorage.getItem("products")).toBeNull()
        expect(localStorage.getItem("categories")).toBeNull()
        expect(localStorage.getItem("auditEvents")).toBeNull()
    })
})
