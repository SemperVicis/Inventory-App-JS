"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.TRANSLATIONS = exports.LocalPreferenceStore = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var LANGUAGE_STORAGE_KEY = "app_lang";
var CONSENT_STORAGE_KEY = "cookie_consent";
var TRANSLATIONS = exports.TRANSLATIONS = {
  en: {
    documentTitle: "Inventory App | Abolfazl Rahmati",
    metaDescription: "Manage inventory categories, product quantities, locations, and searchable product lists in a lightweight JavaScript inventory app.",
    appTitle: "Inventory App With JS & TailwindCSS",
    languageLabel: "Language",
    languageEnglish: "English",
    languageChinese: "中文",
    addNewCategory: "Add New Category",
    addNewProduct: "Add New Product",
    titleLabel: "Title",
    descriptionLabel: "Description",
    quantityLabel: "Quantity",
    locationLabel: "Location",
    categoryLabel: "Category",
    cancelButton: "Cancel",
    addCategoryButton: "Add Category",
    addProductButton: "Add Product",
    selectLocationOption: "- select location -",
    selectCategoryOption: "- select category -",
    productsList: "Products List",
    searchPlaceholder: "Search...",
    sortNewest: "Newest",
    sortOldest: "Oldest",
    sortAz: "A-Z",
    sortZa: "Z-A",
    footerNotice: "This application stores inventory preferences locally in your browser.",
    privacyPolicyLink: "Privacy Policy",
    consentRegionLabel: "Cookie and local storage notice",
    consentMessage: "This app uses local storage to remember your language preference, consent choice, categories, and products on this device.",
    acceptConsent: "Accept",
    declineConsent: "Decline",
    privacyDocumentTitle: "Privacy Policy | Inventory App",
    privacyMetaDescription: "Privacy Policy for the Inventory App, including local storage and basic data handling practices.",
    privacyPageTitle: "Privacy Policy",
    privacyIntro: "This Privacy Policy explains how the Inventory App handles information while you use this browser-based application.",
    privacyLocalStorageTitle: "Local Storage Usage",
    privacyLocalStorageText: "The app stores inventory data, category data, language preferences, and consent choices in your browser local storage. This information remains on your device unless you clear browser data or reset the application.",
    privacyDataHandlingTitle: "Data Handling",
    privacyDataHandlingText: "The app does not require an account and does not intentionally transmit your inventory entries to an external server. Any deployment platform may still process basic technical information such as IP address and request logs.",
    privacyChoicesTitle: "Your Choices",
    privacyChoicesText: "You may accept or decline the local storage notice. You can also clear saved data at any time through your browser settings.",
    backToApp: "Back to Inventory App"
  },
  zh: {
    documentTitle: "库存管理应用 | Abolfazl Rahmati",
    metaDescription: "一个轻量级 JavaScript 库存管理应用，可管理分类、产品数量、地点和可搜索的产品列表。",
    appTitle: "JavaScript 与 TailwindCSS 库存管理应用",
    languageLabel: "语言",
    languageEnglish: "English",
    languageChinese: "中文",
    addNewCategory: "新增分类",
    addNewProduct: "新增产品",
    titleLabel: "标题",
    descriptionLabel: "描述",
    quantityLabel: "数量",
    locationLabel: "地点",
    categoryLabel: "分类",
    cancelButton: "取消",
    addCategoryButton: "添加分类",
    addProductButton: "添加产品",
    selectLocationOption: "- 选择地点 -",
    selectCategoryOption: "- 选择分类 -",
    productsList: "产品列表",
    searchPlaceholder: "搜索...",
    sortNewest: "最新",
    sortOldest: "最旧",
    sortAz: "A-Z",
    sortZa: "Z-A",
    footerNotice: "本应用会在你的浏览器本地保存库存偏好。",
    privacyPolicyLink: "隐私政策",
    consentRegionLabel: "Cookie 和本地存储提示",
    consentMessage: "本应用使用本地存储，在此设备上记住你的语言偏好、同意选择、分类和产品。",
    acceptConsent: "接受",
    declineConsent: "拒绝",
    privacyDocumentTitle: "隐私政策 | 库存管理应用",
    privacyMetaDescription: "库存管理应用的隐私政策，包括本地存储和基本数据处理说明。",
    privacyPageTitle: "隐私政策",
    privacyIntro: "本隐私政策说明你使用这个基于浏览器的库存管理应用时，应用如何处理信息。",
    privacyLocalStorageTitle: "本地存储使用",
    privacyLocalStorageText: "应用会在浏览器本地存储中保存库存数据、分类数据、语言偏好和同意选择。这些信息会保留在你的设备上，除非你清除浏览器数据或重置应用。",
    privacyDataHandlingTitle: "数据处理",
    privacyDataHandlingText: "应用不需要账户，也不会主动把你的库存条目传输到外部服务器。部署平台仍可能处理 IP 地址和请求日志等基础技术信息。",
    privacyChoicesTitle: "你的选择",
    privacyChoicesText: "你可以接受或拒绝本地存储提示，也可以随时通过浏览器设置清除已保存的数据。",
    backToApp: "返回库存管理应用"
  }
};
var LocalPreferenceStore = exports.LocalPreferenceStore = /*#__PURE__*/function () {
  function LocalPreferenceStore() {
    _classCallCheck(this, LocalPreferenceStore);
  }
  return _createClass(LocalPreferenceStore, null, [{
    key: "getValue",
    value: function getValue(key) {
      try {
        return window.localStorage.getItem(key);
      } catch (_unused) {
        return null;
      }
    }
  }, {
    key: "setValue",
    value: function setValue(key, value) {
      try {
        window.localStorage.setItem(key, value);
      } catch (_unused2) {
        return false;
      }
      return true;
    }
  }]);
}();
var BaselineCompliance = exports["default"] = /*#__PURE__*/function () {
  function BaselineCompliance() {
    _classCallCheck(this, BaselineCompliance);
    this.languageSelect = document.querySelector("#languageSelect");
    this.currentLanguage = this.getInitialLanguage();
  }
  return _createClass(BaselineCompliance, [{
    key: "setupApp",
    value: function setupApp() {
      this.bindLanguageSelector();
      this.applyCurrentLanguage();
      this.renderConsentBanner();
    }
  }, {
    key: "getInitialLanguage",
    value: function getInitialLanguage() {
      var savedLanguage = LocalPreferenceStore.getValue(LANGUAGE_STORAGE_KEY);
      return Object.prototype.hasOwnProperty.call(TRANSLATIONS, savedLanguage) ? savedLanguage : "en";
    }
  }, {
    key: "bindLanguageSelector",
    value: function bindLanguageSelector() {
      var _this = this;
      if (!this.languageSelect) return;
      this.languageSelect.value = this.currentLanguage;
      this.languageSelect.addEventListener("change", function (event) {
        _this.setLanguage(event.target.value);
      });
    }
  }, {
    key: "setLanguage",
    value: function setLanguage(language) {
      if (!Object.prototype.hasOwnProperty.call(TRANSLATIONS, language)) return;
      this.currentLanguage = language;
      LocalPreferenceStore.setValue(LANGUAGE_STORAGE_KEY, language);
      this.applyCurrentLanguage();
    }
  }, {
    key: "applyCurrentLanguage",
    value: function applyCurrentLanguage() {
      var _this2 = this;
      document.documentElement.lang = this.currentLanguage === "zh" ? "zh-CN" : "en";
      document.querySelectorAll("[data-i18n]").forEach(function (element) {
        element.textContent = _this2.translate(element.dataset.i18n);
      });
      document.querySelectorAll("[data-i18n-placeholder]").forEach(function (element) {
        element.setAttribute("placeholder", _this2.translate(element.dataset.i18nPlaceholder));
      });
      document.querySelectorAll("[data-i18n-content]").forEach(function (element) {
        element.setAttribute("content", _this2.translate(element.dataset.i18nContent));
      });
      document.querySelectorAll("[data-i18n-aria-label]").forEach(function (element) {
        element.setAttribute("aria-label", _this2.translate(element.dataset.i18nAriaLabel));
      });
      this.translateKnownOptions();
      if (this.languageSelect) this.languageSelect.value = this.currentLanguage;
    }
  }, {
    key: "translateKnownOptions",
    value: function translateKnownOptions() {
      this.updateOptionText("#productLocations option[value='none']", "selectLocationOption");
      this.updateOptionText("#categoriesSelect option[value='none']", "selectCategoryOption");
      this.updateOptionText("#sort option[value='newest']", "sortNewest");
      this.updateOptionText("#sort option[value='oldest']", "sortOldest");
      this.updateOptionText("#sort option[value='A-Z']", "sortAz");
      this.updateOptionText("#sort option[value='Z-A']", "sortZa");
    }
  }, {
    key: "updateOptionText",
    value: function updateOptionText(selector, translationKey) {
      var option = document.querySelector(selector);
      if (option) option.textContent = this.translate(translationKey);
    }
  }, {
    key: "renderConsentBanner",
    value: function renderConsentBanner() {
      if (LocalPreferenceStore.getValue(CONSENT_STORAGE_KEY)) return;
      if (document.querySelector("#cookieConsentBanner")) return;
      var banner = document.createElement("section");
      banner.id = "cookieConsentBanner";
      banner.className = "fixed bottom-4 left-4 right-4 z-50 mx-auto flex max-w-3xl flex-col gap-3 rounded-xl border border-green-600 bg-[#1a262d] p-4 text-stone-100 shadow-xl ww:flex-row ww:items-center ww:justify-between";
      banner.setAttribute("role", "region");
      banner.setAttribute("data-i18n-aria-label", "consentRegionLabel");
      var message = document.createElement("p");
      message.className = "text-sm leading-6";
      message.setAttribute("data-i18n", "consentMessage");
      var buttonGroup = document.createElement("div");
      buttonGroup.className = "flex shrink-0 gap-2";
      var declineButton = this.createConsentButton("declined", "declineConsent", "border border-green-600 text-green-500");
      var acceptButton = this.createConsentButton("accepted", "acceptConsent", "border border-green-600 bg-green-600 text-main");
      buttonGroup.append(declineButton, acceptButton);
      banner.append(message, buttonGroup);
      document.body.append(banner);
      this.applyCurrentLanguage();
    }
  }, {
    key: "createConsentButton",
    value: function createConsentButton(value, translationKey, className) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "".concat(className, " rounded-lg px-4 py-2 text-sm font-semibold");
      button.setAttribute("data-i18n", translationKey);
      button.addEventListener("click", function () {
        LocalPreferenceStore.setValue(CONSENT_STORAGE_KEY, value);
        var banner = document.querySelector("#cookieConsentBanner");
        if (banner) banner.remove();
      });
      return button;
    }
  }, {
    key: "translate",
    value: function translate(key) {
      return TRANSLATIONS[this.currentLanguage][key] || TRANSLATIONS.en[key] || key;
    }
  }]);
}();
