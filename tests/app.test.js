import { beforeEach, describe, expect, it, vi } from "vitest"
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

function renderApplicationDom() {
    document.body.innerHTML = `
        <input id="categoryTitle" />
        <textarea id="categoryDescription"></textarea>
        <button id="categoryCanelBtn" type="button">Cancel</button>
        <button id="categoryAddNewBtn" type="button">Add Category</button>
        <input id="productTitle" />
        <button id="incQty" class="toggleBtn" type="button">Increase</button>
        <button id="decQty" class="toggleBtn" type="button">Decrease</button>
        <select id="productLocations">
            <option value="none">- select location -</option>
        </select>
        <select id="categoriesSelect"></select>
        <button id="addNewProductBtn" type="button">Add Product</button>
        <span id="productQuantity">0</span>
        <input id="searchInput" />
        <select id="sort">
            <option value="newest">Newest</option>
        </select>
        <ul id="productsCenter"></ul>
    `
}

describe("Application bootstrap", () => {
    beforeEach(() => {
        vi.resetModules()
        installInnerTextShim()
        installLocalStorageMock()
        renderApplicationDom()
        vi.spyOn(console, "log").mockImplementation(() => {})
    })

    it("initializes category and product views on DOMContentLoaded", async () => {
        localStorage.setItem("categories", JSON.stringify([
            { id: 1, title: "Hardware", description: "Devices" },
        ]))
        localStorage.setItem("products", JSON.stringify([]))

        await import("../src/js/app.js")
        document.dispatchEvent(new Event("DOMContentLoaded"))

        expect(document.querySelector("#categoriesSelect").textContent).toContain("Hardware")
        expect(document.querySelector("#productsCenter").textContent).toContain("No products found.")
    })

    it("initializes baseline compliance on pages without inventory forms", async () => {
        document.body.innerHTML = `
            <select id="languageSelect">
                <option value="en">English</option>
                <option value="zh">中文</option>
            </select>
            <h1 data-i18n="privacyPageTitle">Privacy Policy</h1>
        `

        await import("../src/js/app.js?privacy")
        document.dispatchEvent(new Event("DOMContentLoaded"))

        expect(document.querySelector("[data-i18n='privacyPageTitle']").textContent).toBe("Privacy Policy")
        expect(document.querySelector("#cookieConsentBanner")).not.toBeNull()
    })
})
