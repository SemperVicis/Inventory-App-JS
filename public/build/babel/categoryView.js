"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _storage = _interopRequireDefault(require("./storage.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var CategoryView = exports["default"] = /*#__PURE__*/function () {
  function CategoryView() {
    var _this = this;
    _classCallCheck(this, CategoryView);
    this.ctgTitleInput = document.querySelector("#categoryTitle");
    this.ctgDescInput = document.querySelector("#categoryDescription");
    this.ctgCacelBtn = document.querySelector("#categoryCanelBtn");
    this.ctgAddBtn = document.querySelector("#categoryAddNewBtn");
    this.ctgSelect = document.querySelector("#categoriesSelect");
    this.feedbackElement = this.createFeedbackElement();
    this.feedbackTimer = null;
    this.feedbackHideTimer = null;
    this.ctgAddBtn.addEventListener("click", function () {
      _this.addNewCategory();
    });
    this.ctgCacelBtn.addEventListener("click", function () {
      _this.resetCategoryForm();
      _this.hideCategoryFeedback();
    });
  }
  return _createClass(CategoryView, [{
    key: "setupApp",
    value: function setupApp() {
      this.instantCtgUpdate(_storage["default"].getCategories());
    }
  }, {
    key: "addNewCategory",
    value: function addNewCategory() {
      var _this2 = this;
      var title = this.ctgTitleInput.value.trim();
      var description = this.ctgDescInput.value.trim();
      if (title.length < 2) {
        this.showCategoryFeedback("Category title must be at least 2 characters.", "error");
        this.ctgTitleInput.focus();
        return;
      }
      var savedCategories = _storage["default"].getCategories();
      var normalizedTitle = this.normalizeCategoryTitle(title);
      var existedItem = savedCategories.find(function (category) {
        return _this2.normalizeCategoryTitle(category && category.title) === normalizedTitle;
      });
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
      var newCategory = {
        id: new Date().getTime(),
        title: title,
        description: description,
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
  }, {
    key: "saveCategories",
    value: function saveCategories(categories) {
      try {
        _storage["default"].saveCategories(categories);
        return true;
      } catch (_unused) {
        this.showCategoryFeedback("Category could not be saved. Please try again.", "error");
        return false;
      }
    }
  }, {
    key: "instantCtgUpdate",
    value: function instantCtgUpdate() {
      var _this$ctgSelect;
      var categories = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var selectedValue = this.ctgSelect.value;
      var defaultOption = document.createElement("option");
      defaultOption.selected = true;
      defaultOption.value = "none";
      defaultOption.textContent = "- select category -";
      var categoryOptions = categories.map(function (category) {
        return String(category && category.title || "").trim();
      }).filter(Boolean).map(function (option) {
        var newOption = document.createElement("option");
        newOption.value = option;
        newOption.textContent = option;
        return newOption;
      });
      (_this$ctgSelect = this.ctgSelect).replaceChildren.apply(_this$ctgSelect, [defaultOption].concat(_toConsumableArray(categoryOptions)));
      var stillAvailable = _toConsumableArray(this.ctgSelect.options).some(function (option) {
        return option.value === selectedValue;
      });
      if (stillAvailable) this.ctgSelect.value = selectedValue;
    }
  }, {
    key: "normalizeCategoryTitle",
    value: function normalizeCategoryTitle(title) {
      return String(title || "").trim().toLowerCase();
    }
  }, {
    key: "resetCategoryForm",
    value: function resetCategoryForm() {
      this.ctgTitleInput.value = "";
      this.ctgDescInput.value = "";
    }
  }, {
    key: "createFeedbackElement",
    value: function createFeedbackElement() {
      var feedbackElement = document.createElement("div");
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
  }, {
    key: "showCategoryFeedback",
    value: function showCategoryFeedback(message) {
      var _this3 = this;
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "success";
      window.clearTimeout(this.feedbackTimer);
      window.clearTimeout(this.feedbackHideTimer);
      this.feedbackElement.textContent = message;
      this.feedbackElement.dataset.type = type;
      this.feedbackElement.style.color = type === "error" ? "#fca5a5" : "#22c55e";
      this.feedbackElement.hidden = false;
      window.requestAnimationFrame(function () {
        _this3.feedbackElement.style.opacity = "1";
      });
      this.feedbackTimer = window.setTimeout(function () {
        _this3.hideCategoryFeedback();
      }, 3500);
    }
  }, {
    key: "hideCategoryFeedback",
    value: function hideCategoryFeedback() {
      var _this4 = this;
      window.clearTimeout(this.feedbackTimer);
      window.clearTimeout(this.feedbackHideTimer);
      this.feedbackElement.style.opacity = "0";
      this.feedbackHideTimer = window.setTimeout(function () {
        _this4.feedbackElement.hidden = true;
        _this4.feedbackElement.textContent = "";
      }, 200);
    }
  }]);
}();
