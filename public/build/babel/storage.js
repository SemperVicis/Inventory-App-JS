"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Storage = exports["default"] = /*#__PURE__*/function () {
  function Storage() {
    _classCallCheck(this, Storage);
  }
  return _createClass(Storage, null, [{
    key: "getProducts",
    get: function get() {
      var _this = this;
      return this.safeReadArray(this.productsKey).filter(function (product) {
        return _this.isValidProduct(product);
      });
    }
  }, {
    key: "getCategories",
    value: function getCategories() {
      var _this2 = this;
      return this.safeReadArray(this.categoriesKey).filter(function (category) {
        return _this2.isValidCategory(category);
      });
    }
  }, {
    key: "saveProducts",
    value: function saveProducts(productsList) {
      var _this3 = this;
      var timestamp = new Date().toISOString();
      var products = Array.isArray(productsList) ? productsList : [];
      var normalizedProducts = products.filter(function (product) {
        return _this3.isValidProduct(product);
      }).map(function (product) {
        return _this3.withTimestamps(product, timestamp);
      });
      localStorage.setItem(this.productsKey, JSON.stringify(normalizedProducts));
    }
  }, {
    key: "saveCategories",
    value: function saveCategories(categoriesList) {
      var _this4 = this;
      var timestamp = new Date().toISOString();
      var categories = Array.isArray(categoriesList) ? categoriesList : [];
      var normalizedCategories = categories.filter(function (category) {
        return _this4.isValidCategory(category);
      }).map(function (category) {
        return _objectSpread(_objectSpread({}, _this4.withTimestamps(category, timestamp)), {}, {
          title: category.title.trim(),
          description: typeof category.description === "string" ? category.description : ""
        });
      });
      localStorage.setItem(this.categoriesKey, JSON.stringify(normalizedCategories));
    }
  }, {
    key: "removeProduct",
    value: function removeProduct(deletedId) {
      var productId = Number(deletedId);
      var products = this.getProducts;
      var productExists = products.some(function (product) {
        return product.id === productId;
      });
      var updatedProducts = products.filter(function (product) {
        return product.id !== productId;
      });
      this.saveProducts(updatedProducts);
      if (productExists) {
        this.addAuditEvent({
          type: "product_deleted",
          productId: productId,
          timestamp: new Date().toISOString()
        });
      }
    }
  }, {
    key: "getAuditEvents",
    value: function getAuditEvents() {
      var _this5 = this;
      return this.safeReadArray(this.auditEventsKey).filter(function (event) {
        return _this5.isValidAuditEvent(event);
      });
    }
  }, {
    key: "addAuditEvent",
    value: function addAuditEvent(event) {
      if (!this.isValidAuditEvent(event)) return;
      var auditEvents = this.getAuditEvents();
      auditEvents.push(event);
      localStorage.setItem(this.auditEventsKey, JSON.stringify(auditEvents));
    }
  }, {
    key: "clearAll",
    value: function clearAll() {
      localStorage.removeItem(this.productsKey);
      localStorage.removeItem(this.categoriesKey);
      localStorage.removeItem(this.auditEventsKey);
    }
  }, {
    key: "reset",
    value: function reset() {
      this.clearAll();
    }
  }, {
    key: "safeReadArray",
    value: function safeReadArray(key) {
      try {
        var rawValue = localStorage.getItem(key);
        if (!rawValue) return [];
        var parsedValue = JSON.parse(rawValue);
        return Array.isArray(parsedValue) ? parsedValue : [];
      } catch (_unused) {
        return [];
      }
    }
  }, {
    key: "withTimestamps",
    value: function withTimestamps(record, timestamp) {
      return _objectSpread(_objectSpread({}, record), {}, {
        createdAt: this.isNonEmptyString(record.createdAt) ? record.createdAt : timestamp,
        updatedAt: timestamp
      });
    }
  }, {
    key: "isValidProduct",
    value: function isValidProduct(product) {
      return this.isPlainObject(product) && typeof product.id === "number" && this.isNonEmptyString(product.title) && (typeof product.quantity === "number" || typeof product.quantity === "string") && typeof product.location === "string" && typeof product.category === "string";
    }
  }, {
    key: "isValidCategory",
    value: function isValidCategory(category) {
      return this.isPlainObject(category) && typeof category.id === "number" && this.isNonEmptyString(category.title) && (typeof category.description === "undefined" || typeof category.description === "string");
    }
  }, {
    key: "isValidAuditEvent",
    value: function isValidAuditEvent(event) {
      return this.isPlainObject(event) && this.isNonEmptyString(event.type) && this.isNonEmptyString(event.timestamp);
    }
  }, {
    key: "isPlainObject",
    value: function isPlainObject(value) {
      return value !== null && _typeof(value) === "object" && !Array.isArray(value);
    }
  }, {
    key: "isNonEmptyString",
    value: function isNonEmptyString(value) {
      return typeof value === "string" && value.trim().length > 0;
    }
  }]);
}();
_defineProperty(Storage, "productsKey", "products");
_defineProperty(Storage, "categoriesKey", "categories");
_defineProperty(Storage, "auditEventsKey", "auditEvents");
