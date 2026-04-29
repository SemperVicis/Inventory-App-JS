import { beforeEach, describe, expect, it } from "vitest"
import Storage from "../src/js/storage.js"
import { installLocalStorageMock } from "./testUtils.js"

describe("Storage", () => {
    beforeEach(() => {
        installLocalStorageMock()
    })

    it("returns empty collections when no data has been persisted", () => {
        expect(Storage.getProducts).toEqual([])
        expect(Storage.getCategories()).toEqual([])
        expect(Storage.getAuditEvents()).toEqual([])
    })

    it("returns empty collections when stored JSON is corrupted", () => {
        localStorage.setItem("products", "{invalid-json")
        localStorage.setItem("categories", "{invalid-json")

        expect(Storage.getProducts).toEqual([])
        expect(Storage.getCategories()).toEqual([])
    })

    it("filters malformed products and categories when reading from storage", () => {
        localStorage.setItem("products", JSON.stringify([
            { id: 1, title: "Keyboard", quantity: "3", location: "BDG", category: "Hardware" },
            { id: "bad-id", title: "Invalid product" },
            null,
        ]))
        localStorage.setItem("categories", JSON.stringify([
            { id: 2, title: "Hardware", description: "Devices" },
            { id: 3, title: "   ", description: "Invalid category" },
        ]))

        expect(Storage.getProducts).toEqual([
            { id: 1, title: "Keyboard", quantity: "3", location: "BDG", category: "Hardware" },
        ])
        expect(Storage.getCategories()).toEqual([
            { id: 2, title: "Hardware", description: "Devices" },
        ])
    })

    it("injects timestamps when saving products and categories", () => {
        Storage.saveProducts([
            { id: 1, title: "Keyboard", quantity: 2, location: "BDG", category: "Hardware" },
        ])
        Storage.saveCategories([
            { id: 2, title: " Hardware ", description: undefined },
        ])

        const savedProducts = JSON.parse(localStorage.getItem("products"))
        const savedCategories = JSON.parse(localStorage.getItem("categories"))

        expect(savedProducts[0]).toMatchObject({
            id: 1,
            title: "Keyboard",
            quantity: 2,
            location: "BDG",
            category: "Hardware",
        })
        expect(savedProducts[0].createdAt).toEqual(expect.any(String))
        expect(savedProducts[0].updatedAt).toEqual(expect.any(String))
        expect(savedCategories[0]).toMatchObject({
            id: 2,
            title: "Hardware",
            description: "",
        })
        expect(savedCategories[0].createdAt).toEqual(expect.any(String))
        expect(savedCategories[0].updatedAt).toEqual(expect.any(String))
    })

    it("removes a product and logs a deletion audit event", () => {
        Storage.saveProducts([
            { id: 1, title: "Keyboard", quantity: 2, location: "BDG", category: "Hardware" },
            { id: 2, title: "Mouse", quantity: 1, location: "JKT", category: "Hardware" },
        ])

        Storage.removeProduct(1)

        expect(Storage.getProducts.map((product) => product.id)).toEqual([2])
        expect(Storage.getAuditEvents()).toHaveLength(1)
        expect(Storage.getAuditEvents()[0]).toMatchObject({
            type: "product_deleted",
            productId: 1,
        })
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

    it("ignores invalid deletion requests and invalid audit events", () => {
        Storage.saveProducts([
            { id: 1, title: "Keyboard", quantity: 2, location: "BDG", category: "Hardware" },
        ])

        Storage.removeProduct(999)
        Storage.addAuditEvent({ type: "", timestamp: "" })

        expect(Storage.getProducts).toHaveLength(1)
        expect(Storage.getAuditEvents()).toEqual([])
    })

    it("normalizes non-array save inputs to empty persisted arrays", () => {
        Storage.saveProducts(null)
        Storage.saveCategories(null)

        expect(JSON.parse(localStorage.getItem("products"))).toEqual([])
        expect(JSON.parse(localStorage.getItem("categories"))).toEqual([])
    })
})
