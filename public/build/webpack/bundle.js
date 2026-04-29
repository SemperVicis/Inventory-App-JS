(() => {
    "use strict";

    class Storage {
        static get getProducts() {
            return JSON.parse(localStorage.getItem("products")) || [];
        }

        static getCategories() {
            return JSON.parse(localStorage.getItem("categories")) || [];
        }

        static saveProducts(productsList) {
            localStorage.setItem("products", JSON.stringify(productsList));
        }

        static saveCategories(categoriesList) {
            localStorage.setItem("categories", JSON.stringify(categoriesList));
        }

        static removeProduct(deletedId) {
            const updatedProducts = this.getProducts.filter((product) => Number(product.id) !== deletedId);
            this.saveProducts(updatedProducts);
        }
    }

    class CategoryView {
        constructor() {
            this.ctgTitleInput = document.querySelector("#categoryTitle");
            this.ctgDescInput = document.querySelector("#categoryDescription");
            this.ctgCacelBtn = document.querySelector("#categoryCanelBtn");
            this.ctgAddBtn = document.querySelector("#categoryAddNewBtn");
            this.ctgSelect = document.querySelector("#categoriesSelect");
            this.categoryFeedback = this.createFeedbackElement();

            this.ctgAddBtn.addEventListener("click", () => {
                this.addNewCategory();
            });
            this.ctgCacelBtn.addEventListener("click", () => {
                this.ctgTitleInput.value = " ";
                this.ctgDescInput.value = " ";
            });
        }

        setupApp() {
            this.instantCtgUpdate(Storage.getCategories());
        }

        addNewCategory() {
            if (this.ctgTitleInput.value.trim().length >= 2) {
                const newCategroy = {
                    id: new Date().getTime(),
                    title: this.ctgTitleInput.value,
                    description: this.ctgDescInput.value,
                };
                this.ctgTitleInput.value = " ";
                this.ctgDescInput.value = " ";
                const savedCategories = Storage.getCategories();
                const existedItem = savedCategories.find((c) => c.title === newCategroy.title);
                if (existedItem) {
                    existedItem.title = newCategroy.title;
                    existedItem.description = newCategroy.description;
                    this.showCategoryFeedback("This category already exists. The category workflow will handle description updates.");
                    return;
                } else {
                    newCategroy.id = new Date().getTime();
                    newCategroy.createdAt = new Date().toISOString();
                    savedCategories.push(newCategroy);
                }
                Storage.saveCategories(savedCategories);
                this.instantCtgUpdate(savedCategories);
            } else {
                this.showCategoryFeedback("Category title must be at least 2 characters.");
            }
        }

        instantCtgUpdate(categories) {
            const ctgListTitles = categories.map((obj) => obj.title.trim());
            const defaultOption = document.createElement("option");
            defaultOption.selected = true;
            defaultOption.value = "none";
            defaultOption.textContent = "- select category -";
            this.ctgSelect.replaceChildren(defaultOption);
            ctgListTitles.forEach((option) => {
                const newOption = document.createElement("option");
                newOption.value = option;
                newOption.textContent = option;
                this.ctgSelect.append(newOption);
            });
        }

        createFeedbackElement() {
            const feedback = document.createElement("div");
            feedback.id = "categoryFormFeedback";
            feedback.className = "category-error-message";
            feedback.setAttribute("role", "alert");
            feedback.setAttribute("aria-live", "polite");
            feedback.hidden = true;
            feedback.style.color = "#fca5a5";
            feedback.style.marginTop = "0.75rem";
            feedback.style.fontSize = "0.875rem";
            this.ctgAddBtn.parentElement.after(feedback);
            return feedback;
        }

        showCategoryFeedback(message) {
            this.categoryFeedback.textContent = message;
            this.categoryFeedback.hidden = false;
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
            this.searchTerm = "";
            this.productFeedback = this.createFeedbackElement();

            this.pdtAddNew.addEventListener("click", () => {
                this.addNewProduct();
            });
            this.toggleBtns.forEach((btn) => {
                btn.addEventListener("click", (e) => {
                    this.toggleProductQty(e);
                });
            });
            this.searchInput.addEventListener("input", (e) => {
                this.searchProducts(e.target.value);
            });
            this.sortSelect.addEventListener("change", (e) => {
                this.sortBySelect(e.target.value);
            });
        }

        setupApp() {
            this.setProductQuantity(0);
            this.renderProducts();
        }

        addNewProduct() {
            const validation = this.validateProductForm();
            if (!validation.isValid) {
                this.showProductError(validation.message, validation.field);
                return;
            }

            const pdtList = Storage.getProducts;
            pdtList.push({
                id: new Date().getTime(),
                title: validation.product.title,
                quantity: validation.product.quantity,
                location: validation.product.location,
                category: validation.product.category,
                createdDate: this.formatProductDate(new Date()),
            });
            Storage.saveProducts(pdtList);
            this.resetProductForm();
            this.renderProducts();
        }

        showListedProducts(productList) {
            this.productCenter.replaceChildren();

            if (!productList.length) {
                const emptyItem = document.createElement("li");
                emptyItem.className = "w-full py-2 text-stone-100 ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px]";
                emptyItem.textContent = "No products found.";
                this.productCenter.append(emptyItem);
                return;
            }

            productList.forEach((product) => {
                this.productCenter.append(this.createProductListItem(product));
            });
        }

        productsAction() {
            this.renderProducts();
        }

        toggleProductQty(e) {
            switch (e.currentTarget.id) {
                case "incQty":
                    this.setProductQuantity(this.getCurrentQuantity() + 1);
                    break;
                case "decQty":
                    this.setProductQuantity(this.getCurrentQuantity() - 1);
                    break;
            }
        }

        deleteProduct(e) {
            const productId = Number(e.currentTarget.dataset.productId);
            Storage.removeProduct(productId);
            this.renderProducts();
        }

        searchProducts(searchTerm) {
            this.searchTerm = searchTerm;
            this.renderProducts();
        }

        sortBySelect(sortType) {
            this.showListedProducts(this.getVisibleProducts(Storage.getProducts, this.searchTerm, sortType));
        }

        renderProducts() {
            this.showListedProducts(this.getVisibleProducts(Storage.getProducts, this.searchTerm, this.sortSelect.value));
        }

        getVisibleProducts(products, searchTerm, sortType) {
            const validProducts = products
                .map((product) => this.normalizeStoredProduct(product))
                .filter(Boolean);
            const normalizedSearchTerm = searchTerm.toLowerCase().trim();
            const filteredProducts = validProducts.filter((product) =>
                product.title.toLowerCase().includes(normalizedSearchTerm)
            );
            return this.sortProducts(filteredProducts, sortType);
        }

        sortProducts(products, sortType) {
            if (sortType === "newest") {
                return products.slice().sort((a, b) => b.id - a.id);
            } else if (sortType === "oldest") {
                return products.slice().sort((a, b) => a.id - b.id);
            } else if (sortType === "A-Z") {
                return products.slice().sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
            } else if (sortType === "Z-A") {
                return products.slice().sort((a, b) => b.title.toLowerCase().localeCompare(a.title.toLowerCase()));
            }
            return products.slice();
        }

        validateProductForm() {
            const title = this.pdtTitle.value.trim();
            const location = this.pdtLocation.value;
            const category = this.ctgSelect.value;
            const quantity = this.getCurrentQuantity();

            if (title.length < 2) {
                return {
                    isValid: false,
                    field: this.pdtTitle,
                    message: "Product title must be at least 2 characters.",
                };
            }

            if (!location || location === "none") {
                return {
                    isValid: false,
                    field: this.pdtLocation,
                    message: "Please select a valid product location.",
                };
            }

            if (!category || category === "none") {
                return {
                    isValid: false,
                    field: this.ctgSelect,
                    message: "Please select a product category.",
                };
            }

            if (quantity < 0) {
                return {
                    isValid: false,
                    field: this.pdtDecQty,
                    message: "Product quantity cannot be negative.",
                };
            }

            return {
                isValid: true,
                product: {
                    title,
                    quantity,
                    location,
                    category,
                },
            };
        }

        normalizeStoredProduct(product) {
            const title = String(product.title ?? "").trim();
            const location = String(product.location ?? "").trim();
            const category = String(product.category ?? "").trim();
            const quantity = Number(product.quantity);
            const id = Number(product.id);
            const fallbackDate = Number.isFinite(id) ? this.formatProductDate(new Date(id)) : String(product.persianDate ?? "");
            const createdDate = String(product.createdDate ?? fallbackDate).trim();

            if (!title || !location || location === "none" || !category || category === "none" || !Number.isFinite(id)) {
                return null;
            }

            return {
                ...product,
                id,
                title,
                location,
                category,
                createdDate,
                quantity: Number.isFinite(quantity) ? Math.max(0, quantity) : 0,
            };
        }

        createProductListItem(product) {
            const item = document.createElement("li");
            item.className = "flex items-center justify-between  w-full py-2 bg-blue-400/ text-white font-medium ss:min-w-[500px] ss:overflow-x-auto ";

            item.append(
                this.createProductTextCell(product.title, "basis-[16%] ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px] ", true),
                this.createProductTextCell(product.location),
                this.createProductTextCell(product.category),
                this.createProductTextCell(product.createdDate, "basis-[16%] ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px] "),
                this.createProductTextCell(String(product.quantity), "border-2 border-slate-400 p-1 rounded-2xl ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px] "),
                this.createDeleteButton(product)
            );

            return item;
        }

        createProductTextCell(value, className = "basis-[16%] ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px] ", shouldWrap = false) {
            const cell = document.createElement("p");
            cell.className = className;
            cell.textContent = String(value ?? "");
            if (shouldWrap) {
                cell.style.overflowWrap = "anywhere";
                cell.style.wordBreak = "break-word";
                cell.style.lineHeight = "1.35";
            }
            return cell;
        }

        formatProductDate(date) {
            return date.toISOString().slice(0, 10);
        }

        createDeleteButton(product) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "pdt-dlt-btn stroke-red-500 dd:h-6 dd:w-6 ss:h-5 ss:w-5 cursor-pointer";
            button.dataset.productId = String(product.id);
            button.setAttribute("aria-label", `Delete product ${product.title}`);
            button.style.background = "transparent";
            button.style.border = "0";
            button.style.padding = "0";
            button.style.display = "flex";
            button.style.alignItems = "center";
            button.style.justifyContent = "center";
            button.style.color = "#ef4444";
            button.append(this.createDeleteIcon());
            button.addEventListener("click", (e) => this.deleteProduct(e));
            return button;
        }

        createDeleteIcon() {
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("fill", "none");
            svg.setAttribute("viewBox", "0 0 24 24");
            svg.setAttribute("stroke-width", "1.5");
            svg.setAttribute("stroke", "currentColor");
            svg.setAttribute("aria-hidden", "true");
            svg.setAttribute("focusable", "false");

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("stroke-linecap", "round");
            path.setAttribute("stroke-linejoin", "round");
            path.setAttribute("d", "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0");
            svg.append(path);
            return svg;
        }

        getCurrentQuantity() {
            const quantity = Number(this.pdtQty.textContent);
            return Number.isFinite(quantity) ? Math.max(0, quantity) : 0;
        }

        setProductQuantity(quantity) {
            const safeQuantity = Math.max(0, Number(quantity) || 0);
            this.pdtQty.textContent = String(safeQuantity);
            this.pdtDecQty.disabled = safeQuantity === 0;
            this.pdtDecQty.setAttribute("aria-disabled", String(safeQuantity === 0));
        }

        resetProductForm() {
            this.clearProductFeedback();
            this.pdtTitle.value = "";
            this.pdtLocation.value = "none";
            this.ctgSelect.value = "none";
            this.setProductQuantity(0);
        }

        createFeedbackElement() {
            const feedback = document.createElement("div");
            feedback.id = "productFormFeedback";
            feedback.className = "product-error-message";
            feedback.setAttribute("role", "alert");
            feedback.setAttribute("aria-live", "polite");
            feedback.hidden = true;
            feedback.style.color = "#fca5a5";
            feedback.style.marginTop = "0.75rem";
            feedback.style.fontSize = "0.875rem";
            this.pdtAddNew.parentElement.after(feedback);
            return feedback;
        }

        showProductError(message, field) {
            this.clearProductFeedback();
            this.productFeedback.textContent = message;
            this.productFeedback.hidden = false;
            if (field) {
                field.setAttribute("aria-invalid", "true");
                field.setAttribute("aria-describedby", this.productFeedback.id);
                field.focus();
            }
        }

        clearProductFeedback() {
            this.productFeedback.textContent = "";
            this.productFeedback.hidden = true;
            [this.pdtTitle, this.pdtLocation, this.ctgSelect, this.pdtDecQty].forEach((field) => {
                field.removeAttribute("aria-invalid");
                field.removeAttribute("aria-describedby");
            });
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        const productView = new ProductView();
        const categoryView = new CategoryView();
        categoryView.setupApp();
        productView.setupApp();
    });
})();
