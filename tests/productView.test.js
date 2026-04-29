import { beforeEach, describe, expect, it, vi } from "vitest"
import ProductView from "../src/js/productView.js"
import Storage from "../src/js/storage.js"
import { installLocalStorageMock } from "./testUtils.js"

function installInnerTextShim() {
    if ("innerText" in HTMLElement.prototype) return

    Object.defineProperty(HTMLElement.prototype, "innerText", {
        get() {
            return this.textContent
        },
        set(value) {
            this.textContent = String(value)
        },
        configurable: true,
    })
}

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
        { id: 1, title: "Notebook", quantity: "5", location: "BDG", category: "Stationery", persianDate: "1403/01/01" },
        { id: 3, title: "Adapter", quantity: "2", location: "JKT", category: "Hardware", persianDate: "1403/01/03" },
        { id: 2, title: "Cable", quantity: "1", location: "BDG", category: "Hardware", persianDate: "1403/01/02" },
    ])
}

describe("ProductView", () => {
    beforeEach(() => {
        installInnerTextShim()
        installLocalStorageMock()
        renderProductForm()
        vi.spyOn(window, "alert").mockImplementation(() => {})
    })

    it("adds a valid product, resets the form, and renders the new item", () => {
        const view = new ProductView()
        document.querySelector("#productTitle").value = " Keyboard "
        document.querySelector("#productQuantity").innerText = "3"
        document.querySelector("#productLocations").value = "BDG"
        document.querySelector("#categoriesSelect").value = "Hardware"

        document.querySelector("#addNewProductBtn").click()

        const savedProduct = Storage.getProducts[0]
        expect(savedProduct).toMatchObject({
            title: "Keyboard",
            quantity: "3",
            location: "BDG",
            category: "Hardware",
        })
        expect(document.querySelector("#productTitle").value).toBe(" ")
        expect(document.querySelector("#productQuantity").innerText).toBe("0")
        expect(document.querySelector("#productsCenter").textContent).toContain("Keyboard")
    })

    it("rejects short product titles without mutating storage", () => {
        const view = new ProductView()
        document.querySelector("#productTitle").value = "A"

        view.addNewProduct()

        expect(window.alert).toHaveBeenCalledWith("your entered title for category must be at least 2 characters!!!")
        expect(Storage.getProducts).toEqual([])
    })

    it("updates the visible quantity when increment and decrement buttons are clicked", () => {
        const view = new ProductView()

        document.querySelector("#incQty").click()
        document.querySelector("#incQty").click()
        document.querySelector("#decQty").click()

        expect(document.querySelector("#productQuantity").innerText).toBe("1")
    })

    it("renders products and removes the clicked delete control from storage", () => {
        seedProducts()
        const view = new ProductView()

        view.showListedProducts(Storage.getProducts)
        document.querySelector("[id='2'].pdt-dlt-btn").dispatchEvent(new MouseEvent("click", { bubbles: true }))

        expect(Storage.getProducts.map((product) => product.id)).toEqual([1, 3])
        expect(document.querySelector("#productsCenter").textContent).not.toContain("Cable")
    })

    it("filters visible products by the search input", () => {
        seedProducts()
        const view = new ProductView()

        view.searchProducts("note")

        expect(document.querySelector("#productsCenter").textContent).toContain("Notebook")
        expect(document.querySelector("#productsCenter").textContent).not.toContain("Adapter")
    })

    it("sorts products by every supported sort option", () => {
        seedProducts()
        const view = new ProductView()
        const visibleTitles = () => [...document.querySelectorAll("#productsCenter li p:first-child")]
            .map((element) => element.textContent.trim())

        view.sortBySelect("newest")
        expect(visibleTitles()).toEqual(["Adapter", "Cable", "Notebook"])

        view.sortBySelect("oldest")
        expect(visibleTitles()).toEqual(["Notebook", "Cable", "Adapter"])

        view.sortBySelect("A-Z")
        expect(visibleTitles()).toEqual(["Adapter", "Cable", "Notebook"])

        view.sortBySelect("Z-A")
        expect(visibleTitles()).toEqual(["Notebook", "Cable", "Adapter"])

        view.sortBySelect("unsupported")
        expect(visibleTitles()).toEqual(["Notebook", "Adapter", "Cable"])
    })
})
