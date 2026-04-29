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
    })

    it("saves and reads products and categories from local storage", () => {
        const products = [{ id: 1, title: "Keyboard", quantity: "2", location: "BDG", category: "Hardware" }]
        const categories = [{ id: 2, title: "Hardware", description: "Devices" }]

        Storage.saveProducts(products)
        Storage.saveCategories(categories)

        expect(Storage.getProducts).toEqual(products)
        expect(Storage.getCategories()).toEqual(categories)
    })

    it("removes only the selected product from persisted data", () => {
        Storage.saveProducts([
            { id: 1, title: "Keyboard", quantity: "2", location: "BDG", category: "Hardware" },
            { id: 2, title: "Mouse", quantity: "1", location: "JKT", category: "Hardware" },
        ])

        Storage.removeProduct(1)

        expect(Storage.getProducts).toEqual([
            { id: 2, title: "Mouse", quantity: "1", location: "JKT", category: "Hardware" },
        ])
    })
})
