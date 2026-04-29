import { beforeEach, describe, expect, it, vi } from "vitest"
import ProductView from "../src/js/productView.js"
import Storage from "../src/js/storage.js"
import { installLocalStorageMock } from "./testUtils.js"

function renderProductForm() {
    document.body.innerHTML = `
        <input id="productTitle" />
        <button id="incQty" class="toggleBtn" type="button">Increase</button>
        <button id="decQty" class="toggleBtn" type="button">Decrease</button>
        <select id="productLocations">
            <option value="none">- select location -</option>
            <option value="BDG">BDG</option>
            <option value="JKT">JKT</option>
        </select>
        <select id="categoriesSelect">
            <option value="none">- select category -</option>
            <option value="Hardware">Hardware</option>
            <option value="Stationery">Stationery</option>
        </select>
        <button id="addNewProductBtn" type="button">Add Product</button>
        <span id="productQuantity">0</span>
        <input id="searchInput" />
        <select id="sort">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="A-Z">A-Z</option>
            <option value="Z-A">Z-A</option>
        </select>
        <ul id="productsCenter"></ul>
    `
}

function seedProducts() {
    Storage.saveProducts([
        { id: 1, title: "Notebook", quantity: 5, location: "BDG", category: "Stationery", createdDate: "2026-01-01" },
        { id: 3, title: "Adapter", quantity: 2, location: "JKT", category: "Hardware", createdDate: "2026-01-03" },
        { id: 2, title: "Cable", quantity: 1, location: "BDG", category: "Hardware", createdDate: "2026-01-02" },
    ])
}

describe("ProductView", () => {
    beforeEach(() => {
        installLocalStorageMock()
        renderProductForm()
    })

    it("adds a valid product, resets the form, and renders the new item", () => {
        const view = new ProductView()
        document.querySelector("#productTitle").value = " Keyboard "
        document.querySelector("#productLocations").value = "BDG"
        document.querySelector("#categoriesSelect").value = "Hardware"
        view.setProductQuantity(3)

        document.querySelector("#addNewProductBtn").click()

        const savedProduct = Storage.getProducts[0]
        expect(savedProduct).toMatchObject({
            title: "Keyboard",
            quantity: 3,
            location: "BDG",
            category: "Hardware",
        })
        expect(document.querySelector("#productTitle").value).toBe("")
        expect(document.querySelector("#productQuantity").textContent).toBe("0")
        expect(document.querySelector("#productsCenter").textContent).toContain("Keyboard")
    })

    it("rejects invalid submissions with DOM-based error feedback", () => {
        const view = new ProductView()
        const titleInput = document.querySelector("#productTitle")
        titleInput.value = "A"
        const focusSpy = vi.spyOn(titleInput, "focus").mockImplementation(() => {})

        view.addNewProduct()

        expect(Storage.getProducts).toEqual([])
        expect(document.querySelector("#productFormFeedback").textContent).toBe("Product title must be at least 2 characters.")
        expect(titleInput.getAttribute("aria-invalid")).toBe("true")
        expect(focusSpy).toHaveBeenCalled()
    })

    it("blocks missing location and category selections", () => {
        const view = new ProductView()
        document.querySelector("#productTitle").value = "Keyboard"

        view.addNewProduct()
        expect(document.querySelector("#productFormFeedback").textContent).toBe("Please select a valid product location.")

        document.querySelector("#productLocations").value = "BDG"
        view.addNewProduct()
        expect(document.querySelector("#productFormFeedback").textContent).toBe("Please select a product category.")
    })

    it("rejects negative quantities when validation receives one", () => {
        const view = new ProductView()
        document.querySelector("#productTitle").value = "Keyboard"
        document.querySelector("#productLocations").value = "BDG"
        document.querySelector("#categoriesSelect").value = "Hardware"
        view.getCurrentQuantity = () => -1

        expect(view.validateProductForm()).toMatchObject({
            isValid: false,
            message: "Product quantity cannot be negative.",
        })
    })

    it("keeps quantity non-negative and disables decrement at zero", () => {
        const view = new ProductView()

        expect(document.querySelector("#decQty").disabled).toBe(false)
        view.setupApp()
        expect(document.querySelector("#decQty").disabled).toBe(true)

        document.querySelector("#incQty").click()
        document.querySelector("#incQty").click()
        document.querySelector("#decQty").click()

        expect(document.querySelector("#productQuantity").textContent).toBe("1")
        expect(document.querySelector("#decQty").disabled).toBe(false)

        document.querySelector("#decQty").click()
        document.querySelector("#decQty").click()
        expect(document.querySelector("#productQuantity").textContent).toBe("0")
        expect(document.querySelector("#decQty").disabled).toBe(true)
    })

    it("renders malicious titles as harmless text and deletes products through semantic buttons", () => {
        Storage.saveProducts([
            {
                id: 10,
                title: "<img src=x onerror=alert(1)>",
                quantity: 1,
                location: "BDG",
                category: "Hardware",
                createdDate: "2026-01-10",
            },
        ])
        const view = new ProductView()

        view.renderProducts()
        const deleteButton = document.querySelector(".pdt-dlt-btn")

        expect(document.querySelector("#productsCenter img")).toBeNull()
        expect(document.querySelector("#productsCenter").textContent).toContain("<img src=x onerror=alert(1)>")
        expect(deleteButton.tagName).toBe("BUTTON")
        expect(deleteButton.getAttribute("aria-label")).toBe("Delete product <img src=x onerror=alert(1)>")

        deleteButton.click()
        expect(Storage.getProducts).toEqual([])
        expect(Storage.getAuditEvents()[0]).toMatchObject({
            type: "product_deleted",
            productId: 10,
        })
    })

    it("filters and sorts products through a deterministic pipeline", () => {
        seedProducts()
        const view = new ProductView()
        const visibleTitles = () => [...document.querySelectorAll("#productsCenter li p:first-child")]
            .map((element) => element.textContent.trim())

        view.searchProducts("a")
        view.sortBySelect("A-Z")
        expect(visibleTitles()).toEqual(["Adapter", "Cable"])

        view.sortBySelect("Z-A")
        expect(visibleTitles()).toEqual(["Cable", "Adapter"])

        view.searchProducts("")
        view.sortBySelect("newest")
        expect(visibleTitles()).toEqual(["Adapter", "Cable", "Notebook"])

        view.sortBySelect("oldest")
        expect(visibleTitles()).toEqual(["Notebook", "Cable", "Adapter"])

        view.sortBySelect("unsupported")
        expect(visibleTitles()).toEqual(["Notebook", "Adapter", "Cable"])
    })

    it("filters malformed stored products before rendering", () => {
        const view = new ProductView()
        const visibleProducts = view.getVisibleProducts([
            { id: 1, title: "Valid", quantity: "bad", location: "BDG", category: "Hardware" },
            { id: 2, title: "", quantity: 1, location: "BDG", category: "Hardware" },
            { id: "bad", title: "Invalid", quantity: 1, location: "BDG", category: "Hardware" },
            { id: 3, title: "No category", quantity: 1, location: "BDG", category: "none" },
        ], "", "newest")

        expect(visibleProducts).toEqual([
            expect.objectContaining({
                id: 1,
                title: "Valid",
                quantity: 0,
            }),
        ])
    })
})
