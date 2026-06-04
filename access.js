/** Přístup po zaplacení — sdílené pro dekujeme, stahnout, app */
(function (global) {
  const KEY = "klid-ma-pristup";

  global.KLID_ACCESS = {
    grant: function () {
      try {
        localStorage.setItem(KEY, "1");
        sessionStorage.setItem(KEY, "1");
      } catch (e) {}
    },
    has: function () {
      try {
        return localStorage.getItem(KEY) === "1" || sessionStorage.getItem(KEY) === "1";
      } catch (e) {
        return false;
      }
    },
  };
})(window);