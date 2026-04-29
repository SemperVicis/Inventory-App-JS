import ProductView from "./productView.js";
import CategoryView from "./categoryView.js";
import BaselineCompliance from "./baselineCompliance.js";


document.addEventListener("DOMContentLoaded", ()=>{
    const baselineCompliance = new BaselineCompliance()
    baselineCompliance.setupApp()

    const hasInventoryForm = document.querySelector("#productTitle") && document.querySelector("#categoryTitle")
    if (hasInventoryForm) {
        const productView = new ProductView()
        const categoryView = new CategoryView()
        categoryView.setupApp()
        productView.setupApp()
        baselineCompliance.applyCurrentLanguage()
    }
})
