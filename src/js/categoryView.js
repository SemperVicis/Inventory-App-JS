import Storage from "./storage.js";

export default class CategoryView {
    constructor() {
        this.ctgTitleInput = document.querySelector("#categoryTitle")
        this.ctgDescInput = document.querySelector("#categoryDescription")
        this.ctgCacelBtn = document.querySelector("#categoryCanelBtn")
        this.ctgAddBtn = document.querySelector("#categoryAddNewBtn")
        this.ctgSelect = document.querySelector("#categoriesSelect")
        this.feedbackElement = this.createFeedbackElement()
        this.feedbackTimer = null
        this.feedbackHideTimer = null

        this.ctgAddBtn.addEventListener("click", () => {
            this.addNewCategory()
        })
        this.ctgCacelBtn.addEventListener("click", () => {
            this.resetCategoryForm()
            this.hideCategoryFeedback()
        })
    }

    setupApp() {
        this.instantCtgUpdate(Storage.getCategories())
    }

    addNewCategory() {
        const title = this.ctgTitleInput.value.trim()
        const description = this.ctgDescInput.value.trim()

        if (title.length < 2) {
            this.showCategoryFeedback("Category title must be at least 2 characters.", "error")
            this.ctgTitleInput.focus()
            return
        }

        const savedCategories = Storage.getCategories()
        const normalizedTitle = this.normalizeCategoryTitle(title)
        const existedItem = savedCategories.find((category) =>
            this.normalizeCategoryTitle(category && category.title) === normalizedTitle
        )

        if (existedItem) {
            existedItem.title = title
            existedItem.description = description
            existedItem.updatedAt = new Date().toISOString()

            if (!this.saveCategories(savedCategories)) return

            this.resetCategoryForm()
            this.instantCtgUpdate(savedCategories)
            this.showCategoryFeedback("Category already exists. Description was updated.", "success")
            return
        }

        const newCategory = {
            id: new Date().getTime(),
            title,
            description,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        savedCategories.push(newCategory)

        if (this.saveCategories(savedCategories)) {
            this.resetCategoryForm()
            this.instantCtgUpdate(savedCategories)
            this.showCategoryFeedback("Category added successfully.", "success")
        }
    }

    saveCategories(categories) {
        try {
            Storage.saveCategories(categories)
            return true
        } catch {
            this.showCategoryFeedback("Category could not be saved. Please try again.", "error")
            return false
        }
    }

    instantCtgUpdate(categories = []) {
        const selectedValue = this.ctgSelect.value
        const defaultOption = document.createElement("option")
        defaultOption.selected = true
        defaultOption.value = "none"
        defaultOption.textContent = "- select category -"

        const categoryOptions = categories
            .map((category) => String((category && category.title) || "").trim())
            .filter(Boolean)
            .map((option) => {
                const newOption = document.createElement("option")
                newOption.value = option
                newOption.textContent = option
                return newOption
            })

        this.ctgSelect.replaceChildren(defaultOption, ...categoryOptions)

        const stillAvailable = [...this.ctgSelect.options].some((option) => option.value === selectedValue)
        if (stillAvailable) this.ctgSelect.value = selectedValue
    }

    normalizeCategoryTitle(title) {
        return String(title || "").trim().toLowerCase()
    }

    resetCategoryForm() {
        this.ctgTitleInput.value = ""
        this.ctgDescInput.value = ""
    }

    createFeedbackElement() {
        const feedbackElement = document.createElement("div")
        feedbackElement.id = "categoryFormFeedback"
        feedbackElement.className = "category-feedback-message"
        feedbackElement.setAttribute("role", "status")
        feedbackElement.setAttribute("aria-live", "polite")
        feedbackElement.hidden = true
        feedbackElement.style.marginTop = "1rem"
        feedbackElement.style.fontWeight = "600"
        feedbackElement.style.transition = "opacity 180ms ease"
        feedbackElement.style.opacity = "0"

        this.ctgAddBtn.parentElement.insertAdjacentElement("afterend", feedbackElement)
        return feedbackElement
    }

    showCategoryFeedback(message, type = "success") {
        window.clearTimeout(this.feedbackTimer)
        window.clearTimeout(this.feedbackHideTimer)

        this.feedbackElement.textContent = message
        this.feedbackElement.dataset.type = type
        this.feedbackElement.style.color = type === "error" ? "#fca5a5" : "#22c55e"
        this.feedbackElement.hidden = false
        window.requestAnimationFrame(() => {
            this.feedbackElement.style.opacity = "1"
        })

        this.feedbackTimer = window.setTimeout(() => {
            this.hideCategoryFeedback()
        }, 3500)
    }

    hideCategoryFeedback() {
        window.clearTimeout(this.feedbackTimer)
        window.clearTimeout(this.feedbackHideTimer)

        this.feedbackElement.style.opacity = "0"
        this.feedbackHideTimer = window.setTimeout(() => {
            this.feedbackElement.hidden = true
            this.feedbackElement.textContent = ""
        }, 200)
    }
}
