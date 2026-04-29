import { beforeEach, describe, expect, it } from "vitest"
import BaselineCompliance, { LocalPreferenceStore } from "../src/js/baselineCompliance.js"
import { installLocalStorageMock } from "./testUtils.js"

function renderComplianceDom() {
    document.body.innerHTML = `
        <label for="languageSelect" data-i18n="languageLabel">Language</label>
        <select id="languageSelect">
            <option value="en" data-i18n="languageEnglish">English</option>
            <option value="zh" data-i18n="languageChinese">中文</option>
        </select>
        <h1 data-i18n="appTitle">Inventory App With JS & TailwindCSS</h1>
        <input id="searchInput" data-i18n-placeholder="searchPlaceholder" placeholder="Search..." />
        <meta name="description" data-i18n-content="metaDescription" content="Manage inventory categories, product quantities, locations, and searchable product lists in a lightweight JavaScript inventory app.">
        <select id="productLocations">
            <option value="none">- select location -</option>
        </select>
        <select id="categoriesSelect">
            <option value="none">- select category -</option>
        </select>
        <select id="sort">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="A-Z">A-Z</option>
            <option value="Z-A">Z-A</option>
        </select>
    `
}

describe("BaselineCompliance", () => {
    beforeEach(() => {
        installLocalStorageMock()
        renderComplianceDom()
    })

    it("applies saved language preferences and persists language changes", () => {
        localStorage.setItem("app_lang", "zh")
        const compliance = new BaselineCompliance()

        compliance.setupApp()

        expect(document.documentElement.lang).toBe("zh-CN")
        expect(document.querySelector("[data-i18n='appTitle']").textContent).toBe("JavaScript 与 TailwindCSS 库存管理应用")
        expect(document.querySelector("#searchInput").placeholder).toBe("搜索...")

        document.querySelector("#languageSelect").value = "en"
        document.querySelector("#languageSelect").dispatchEvent(new Event("change"))

        expect(localStorage.getItem("app_lang")).toBe("en")
        expect(document.documentElement.lang).toBe("en")
    })

    it("renders consent controls once and persists accept or decline choices", () => {
        const compliance = new BaselineCompliance()

        compliance.setupApp()
        expect(document.querySelector("#cookieConsentBanner")).not.toBeNull()

        document.querySelector("#cookieConsentBanner button:last-child").click()
        expect(localStorage.getItem("cookie_consent")).toBe("accepted")
        expect(document.querySelector("#cookieConsentBanner")).toBeNull()

        compliance.renderConsentBanner()
        expect(document.querySelector("#cookieConsentBanner")).toBeNull()
    })

    it("falls back safely for unsupported languages and blocked local storage", () => {
        const compliance = new BaselineCompliance()

        compliance.setLanguage("unsupported")
        expect(document.documentElement.lang).toBe("en")

        Object.defineProperty(window, "localStorage", {
            get() {
                throw new Error("Storage is blocked")
            },
            configurable: true,
        })

        expect(LocalPreferenceStore.getValue("app_lang")).toBeNull()
        expect(LocalPreferenceStore.setValue("app_lang", "zh")).toBe(false)
    })
})
