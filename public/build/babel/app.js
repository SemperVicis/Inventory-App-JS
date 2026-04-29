"use strict";

var _productView = _interopRequireDefault(require("./productView.js"));
var _categoryView = _interopRequireDefault(require("./categoryView.js"));
var _baselineCompliance = _interopRequireDefault(require("./baselineCompliance.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
document.addEventListener("DOMContentLoaded", function () {
  var baselineCompliance = new _baselineCompliance["default"]();
  baselineCompliance.setupApp();
  var hasInventoryForm = document.querySelector("#productTitle") && document.querySelector("#categoryTitle");
  if (hasInventoryForm) {
    var productView = new _productView["default"]();
    var categoryView = new _categoryView["default"]();
    categoryView.setupApp();
    productView.setupApp();
    baselineCompliance.applyCurrentLanguage();
  }
});
