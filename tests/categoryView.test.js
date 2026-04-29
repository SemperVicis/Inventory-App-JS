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
        installLocalStorageMock()
        renderCategoryForm()
        vi.spyOn(console, "log").mockImplementation(() => {})
        vi.spyOn(window, "alert").mockImplementation(() => {})
    })

    it("adds a valid category and immediately syncs the product category dropdown", () => {
        const view = new CategoryView()
        document.querySelector("#categoryTitle").value = " Hardware "
        document.querySelector("#categoryDescription").value = "Physical inventory items"

        document.querySelector("#categoryAddNewBtn").click()

        const savedCategory = Storage.getCategories()[0]
        expect(savedCategory).toMatchObject({
            title: " Hardware ",
            description: "Physical inventory items",
        })
        expect(document.querySelector("#categoriesSelect").options).toHaveLength(2)
        expect(document.querySelector("#categoriesSelect").options[1].textContent).toBe("Hardware")
    })

    it("rejects invalid category titles and leaves storage unchanged", () => {
        const view = new CategoryView()
        document.querySelector("#categoryTitle").value = " "

        view.addNewCategory()

        expect(window.alert).toHaveBeenCalledWith("your entered title for category must be at least 2 characters!!!")
        expect(Storage.getCategories()).toEqual([])
    })

    it("warns when a duplicate category title is submitted", () => {
        Storage.saveCategories([{ id: 1, title: "Hardware", description: "Old description" }])
        const view = new CategoryView()
        document.querySelector("#categoryTitle").value = "Hardware"
        document.querySelector("#categoryDescription").value = "Updated description"

        view.addNewCategory()

        expect(window.alert).toHaveBeenCalledWith("this category name has been added before so we will update the category description!")
        expect(Storage.getCategories()).toHaveLength(1)
    })

    it("clears category inputs when the cancel button is clicked", () => {
        const view = new CategoryView()
        document.querySelector("#categoryTitle").value = "Hardware"
        document.querySelector("#categoryDescription").value = "Inventory devices"

        document.querySelector("#categoryCanelBtn").click()

        expect(document.querySelector("#categoryTitle").value).toBe(" ")
        expect(document.querySelector("#categoryDescription").value).toBe(" ")
    })
})
