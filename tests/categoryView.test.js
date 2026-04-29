import { beforeEach, describe, expect, it, vi } from "vitest"
import CategoryView from "../src/js/categoryView.js"
import Storage from "../src/js/storage.js"
import { installLocalStorageMock } from "./testUtils.js"

function renderCategoryForm() {
    document.body.innerHTML = `
        <input id="categoryTitle" />
        <textarea id="categoryDescription"></textarea>
        <button id="categoryCanelBtn" type="button">Cancel</button>
        <button id="categoryAddNewBtn" type="button">Add Category</button>
        <select id="categoriesSelect"></select>
    `
}

describe("CategoryView", () => {
    beforeEach(() => {
        vi.useFakeTimers()
        installLocalStorageMock()
        renderCategoryForm()
    })

    it("adds a trimmed category and immediately syncs the product category dropdown", () => {
        new CategoryView()
        document.querySelector("#categoryTitle").value = " Hardware "
        document.querySelector("#categoryDescription").value = " Physical inventory items "

        document.querySelector("#categoryAddNewBtn").click()

        const savedCategory = Storage.getCategories()[0]
        expect(savedCategory).toMatchObject({
            title: "Hardware",
            description: "Physical inventory items",
        })
        expect(document.querySelector("#categoryTitle").value).toBe("")
        expect(document.querySelector("#categoryDescription").value).toBe("")
        expect(document.querySelector("#categoriesSelect").options[1].textContent).toBe("Hardware")
        expect(document.querySelector("#categoryFormFeedback").textContent).toBe("Category added successfully.")
    })

    it("rejects invalid category titles with non-blocking feedback", () => {
        const view = new CategoryView()
        const titleInput = document.querySelector("#categoryTitle")
        titleInput.value = " "
        const focusSpy = vi.spyOn(titleInput, "focus").mockImplementation(() => {})

        view.addNewCategory()

        expect(Storage.getCategories()).toEqual([])
        expect(document.querySelector("#categoryFormFeedback").textContent).toBe("Category title must be at least 2 characters.")
        expect(focusSpy).toHaveBeenCalled()
    })

    it("updates duplicate categories using case-insensitive matching", () => {
        Storage.saveCategories([{ id: 1, title: "Hardware", description: "Old description" }])
        const view = new CategoryView()
        document.querySelector("#categoryTitle").value = "hardware"
        document.querySelector("#categoryDescription").value = "Updated description"

        view.addNewCategory()

        expect(Storage.getCategories()).toHaveLength(1)
        expect(Storage.getCategories()[0]).toMatchObject({
            title: "hardware",
            description: "Updated description",
        })
        expect(document.querySelector("#categoryFormFeedback").textContent).toBe("Category already exists. Description was updated.")
    })

    it("clears category inputs when the cancel button is clicked", () => {
        new CategoryView()
        document.querySelector("#categoryTitle").value = "Hardware"
        document.querySelector("#categoryDescription").value = "Inventory devices"

        document.querySelector("#categoryCanelBtn").click()

        expect(document.querySelector("#categoryTitle").value).toBe("")
        expect(document.querySelector("#categoryDescription").value).toBe("")
    })

    it("hides feedback after the timeout expires", () => {
        const view = new CategoryView()

        view.showCategoryFeedback("Saved.", "success")
        expect(document.querySelector("#categoryFormFeedback").hidden).toBe(false)

        vi.advanceTimersByTime(3500)
        vi.advanceTimersByTime(200)

        expect(document.querySelector("#categoryFormFeedback").hidden).toBe(true)
        expect(document.querySelector("#categoryFormFeedback").textContent).toBe("")
    })
})
