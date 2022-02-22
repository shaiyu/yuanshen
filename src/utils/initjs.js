export default {
    init(){
        (function (root, factory) {
            if (typeof define === 'function' && define.amd) {
              define(['exports'], factory)
            } else if (typeof exports === 'object') {
              factory(exports)
              if (typeof module === 'object' && module !== null) {
                module.exports = exports = exports.sleep
              }
            } else {
              factory(window)
            }
          }(this, function (exports) {
            exports.sleep = function sleep(ms) {
              var start = new Date().getTime()                       
              while (new Date().getTime() < start + ms);
            }
          }));
    }
}