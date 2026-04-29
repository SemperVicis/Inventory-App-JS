(() => {
    "use strict";

    class Storage {
        static get getProducts() {
            return JSON.parse(localStorage.getItem("products")) || [];
        }

        static getCategories() {
            try {
                const categories = JSON.parse(localStorage.getItem("categories")) || [];
                return Array.isArray(categories) ? categories : [];
            } catch {
                return [];
            }
        }

        static saveProducts(productsList) {
            localStorage.setItem("products", JSON.stringify(productsList));
        }

        static saveCategories(categoriesList) {
            localStorage.setItem("categories", JSON.stringify(categoriesList));
        }

        static removeProduct(deletedId) {
            const UpdatedProducts = this.getProducts.filter((product) => product.id !== deletedId);
            this.saveProducts(UpdatedProducts);
        }
    }

    class ProductView {
        constructor() {
            this.pdtTitle = document.querySelector("#productTitle");
            this.pdtIncQty = document.querySelector("#incQty");
            this.pdtDecQty = document.querySelector("#decQty");
            this.pdtLocation = document.querySelector("#productLocations");
            this.ctgSelect = document.querySelector("#categoriesSelect");
            this.pdtAddNew = document.querySelector("#addNewProductBtn");
            this.pdtQty = document.querySelector("#productQuantity");
            this.productCenter = document.querySelector("#productsCenter");
            this.toggleBtns = document.querySelectorAll(".toggleBtn");
            this.searchInput = document.querySelector("#searchInput");
            this.sortSelect = document.querySelector("#sort");

            this.pdtAddNew.addEventListener("click", () => {
                this.addNewProduct();
            });
            this.toggleBtns.forEach((btn) => {
                btn.addEventListener("click", (e) => {
                    this.toggleProductQty(e);
                });
            });
            this.searchInput.addEventListener("keyup", (e) => {
                this.searchProducts(e.target.value);
            });
            this.sortSelect.addEventListener("change", (e) => {
                this.sortBySelect(e.target.value);
            });
        }

        setupApp() {
            this.showListedProducts(Storage.getProducts);
            this.sortBySelect(this.sortSelect.value);
        }

        addNewProduct() {
            if (this.pdtTitle.value.trim().length >= 2) {
                const newProduct = {
                    id: new Date().getTime(),
                    title: this.pdtTitle.value.trim(),
                    quantity: this.pdtQty.innerText,
                    location: this.pdtLocation.value,
                    category: this.ctgSelect.value,
                    persianDate: new Date().toLocaleDateString("fa-IR")
                };

                this.pdtTitle.value = " ";
                this.pdtQty.innerText = 0;
                this.pdtLocation.value = "none";
                this.ctgSelect.value = "none";

                const pdtList = Storage.getProducts;
                pdtList.push(newProduct);
                Storage.saveProducts(pdtList);
                this.sortBySelect(this.sortSelect.value);
                this.showListedProducts(pdtList);
            } else {
                alert("your entered title for category must be at least 2 characters!!!");
            }
        }

        showListedProducts(productList) {
            let output = " ";
            productList.forEach((product) => {
                output += `
                <li class="flex items-center justify-between  w-full py-2 bg-blue-400/ text-white font-medium ss:min-w-[500px] ss:overflow-x-auto ">
                    <p class="  basis-[16%] ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px] ">${product.title}</p>
                    <p class="  basis-[16%] ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px] ">${product.location}</p>
                    <p class="  basis-[16%] ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px] ">${product.category}</p>
                    <p class="  basis-[16%] font-vazir ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px] ">${product.persianDate}</p>
                    <p class="  border-2 border-slate-400 p-1 rounded-2xl ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px] ">${product.quantity}</p>
                    <svg id="${product.id}" class=" pdt-dlt-btn stroke-red-500 dd:h-6 dd:w-6 ss:h-5 ss:w-5 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </li>
            `;
            });
            this.productCenter.innerHTML = output;
            this.productsAction();
        }

        productsAction() {
            const removeBtns = [...document.querySelectorAll(".pdt-dlt-btn")];
            removeBtns.forEach((btn) => {
                btn.addEventListener("click", (e) => {
                    this.deleteProduct(e);
                });
            });
        }

        toggleProductQty(e) {
            switch (e.currentTarget.id) {
                case "incQty":
                    this.pdtQty.innerText++;
                    break;
                case "decQty":
                    this.pdtQty.innerText--;
                    break;
            }
        }

        deleteProduct(e) {
            const productId = Number(e.currentTarget.id);
            Storage.removeProduct(productId);
            this.showListedProducts(Storage.getProducts);
            this.sortBySelect(this.sortSelect.value);
        }

        searchProducts(searchTerm) {
            const addedProducts = Storage.getProducts;
            const normalizedSearchTerm = searchTerm.toLowerCase().trim();
            const filteredProducts = addedProducts.filter((product) =>
                product.title.toLowerCase().trim().includes(normalizedSearchTerm)
            );
            this.sortBySelect(this.sortSelect.value);
            this.showListedProducts(filteredProducts);
        }

        sortBySelect(sortType) {
            const saveProducts = Storage.getProducts;
            let sortedProducts = [];
            if (sortType === "newest") {
                sortedProducts = saveProducts.slice().sort((a, b) => b.id - a.id);
            } else if (sortType === "oldest") {
                sortedProducts = saveProducts.slice().sort((a, b) => a.id - b.id);
            } else if (sortType === "A-Z") {
                sortedProducts = saveProducts.slice().sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
            } else if (sortType === "Z-A") {
                sortedProducts = saveProducts.slice().sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase())).reverse();
            } else {
                sortedProducts = saveProducts.slice();
            }
            this.showListedProducts(sortedProducts);
        }
    }

    class CategoryView {
        constructor() {
            this.ctgTitleInput = document.querySelector("#categoryTitle");
            this.ctgDescInput = document.querySelector("#categoryDescription");
            this.ctgCacelBtn = document.querySelector("#categoryCanelBtn");
            this.ctgAddBtn = document.querySelector("#categoryAddNewBtn");
            this.ctgSelect = document.querySelector("#categoriesSelect");
            this.feedbackElement = this.createFeedbackElement();
            this.feedbackTimer = null;
            this.feedbackHideTimer = null;

            this.ctgAddBtn.addEventListener("click", () => {
                this.addNewCategory();
            });
            this.ctgCacelBtn.addEventListener("click", () => {
                this.resetCategoryForm();
                this.hideCategoryFeedback();
            });
        }

        setupApp() {
            this.instantCtgUpdate(Storage.getCategories());
        }

        addNewCategory() {
            const title = this.ctgTitleInput.value.trim();
            const description = this.ctgDescInput.value.trim();

            if (title.length < 2) {
                this.showCategoryFeedback("Category title must be at least 2 characters.", "error");
                this.ctgTitleInput.focus();
                return;
            }

            const savedCategories = Storage.getCategories();
            const normalizedTitle = this.normalizeCategoryTitle(title);
            const existedItem = savedCategories.find((category) =>
                this.normalizeCategoryTitle(category && category.title) === normalizedTitle
            );

            if (existedItem) {
                existedItem.title = title;
                existedItem.description = description;
                existedItem.updatedAt = new Date().toISOString();

                if (!this.saveCategories(savedCategories)) return;

                this.resetCategoryForm();
                this.instantCtgUpdate(savedCategories);
                this.showCategoryFeedback("Category already exists. Description was updated.", "success");
                return;
            }

            const newCategory = {
                id: new Date().getTime(),
                title,
                description,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            savedCategories.push(newCategory);

            if (this.saveCategories(savedCategories)) {
                this.resetCategoryForm();
                this.instantCtgUpdate(savedCategories);
                this.showCategoryFeedback("Category added successfully.", "success");
            }
        }

        saveCategories(categories) {
            try {
                Storage.saveCategories(categories);
                return true;
            } catch {
                this.showCategoryFeedback("Category could not be saved. Please try again.", "error");
                return false;
            }
        }

        instantCtgUpdate(categories = []) {
            const selectedValue = this.ctgSelect.value;
            const defaultOption = document.createElement("option");
            defaultOption.selected = true;
            defaultOption.value = "none";
            defaultOption.textContent = "- select category -";

            const categoryOptions = categories
                .map((category) => String((category && category.title) || "").trim())
                .filter(Boolean)
                .map((option) => {
                    const newOption = document.createElement("option");
                    newOption.value = option;
                    newOption.textContent = option;
                    return newOption;
                });

            this.ctgSelect.replaceChildren(defaultOption, ...categoryOptions);

            const stillAvailable = [...this.ctgSelect.options].some((option) => option.value === selectedValue);
            if (stillAvailable) this.ctgSelect.value = selectedValue;
        }

        normalizeCategoryTitle(title) {
            return String(title || "").trim().toLowerCase();
        }

        resetCategoryForm() {
            this.ctgTitleInput.value = "";
            this.ctgDescInput.value = "";
        }

        createFeedbackElement() {
            const feedbackElement = document.createElement("div");
            feedbackElement.id = "categoryFormFeedback";
            feedbackElement.className = "category-feedback-message";
            feedbackElement.setAttribute("role", "status");
            feedbackElement.setAttribute("aria-live", "polite");
            feedbackElement.hidden = true;
            feedbackElement.style.marginTop = "1rem";
            feedbackElement.style.fontWeight = "600";
            feedbackElement.style.transition = "opacity 180ms ease";
            feedbackElement.style.opacity = "0";

            this.ctgAddBtn.parentElement.insertAdjacentElement("afterend", feedbackElement);
            return feedbackElement;
        }

        showCategoryFeedback(message, type = "success") {
            window.clearTimeout(this.feedbackTimer);
            window.clearTimeout(this.feedbackHideTimer);

            this.feedbackElement.textContent = message;
            this.feedbackElement.dataset.type = type;
            this.feedbackElement.style.color = type === "error" ? "#fca5a5" : "#22c55e";
            this.feedbackElement.hidden = false;
            window.requestAnimationFrame(() => {
                this.feedbackElement.style.opacity = "1";
            });

            this.feedbackTimer = window.setTimeout(() => {
                this.hideCategoryFeedback();
            }, 3500);
        }

        hideCategoryFeedback() {
            window.clearTimeout(this.feedbackTimer);
            window.clearTimeout(this.feedbackHideTimer);

            this.feedbackElement.style.opacity = "0";
            this.feedbackHideTimer = window.setTimeout(() => {
                this.feedbackElement.hidden = true;
                this.feedbackElement.textContent = "";
            }, 200);
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        const productView = new ProductView();
        const categoryView = new CategoryView();
        categoryView.setupApp();
        productView.setupApp();
    });
})();
