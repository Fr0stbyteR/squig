/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

document.addEventListener("DOMContentLoaded", () => {
  // UI init
  var canvas = document.getElementById("main-canvas");
  var colorSelects = document.getElementsByClassName("color-select");
  var color;

  var handleClickColor = e => {
    color = window.getComputedStyle(e.currentTarget).getPropertyValue("background-color");
  };

  for (var i = 0; i < colorSelects.length; i++) {
    var e = colorSelects[i];
    e.addEventListener("click", handleClickColor);
    e.addEventListener("touchstart", handleClickColor);
  }

  colorSelects[0].click(); // Data init

  var lines = {};
  var raf;
  var w = 1280;
  var h = 720;
  canvas.width = w;
  canvas.height = h;
  var ctx = canvas.getContext("2d");

  var draw = () => {
    var rect = canvas.getBoundingClientRect();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);

    for (var id in lines) {
      var line = lines[id];
      ctx.strokeStyle = line.color;
      var firstPoint = line.points[0];
      ctx.moveTo(firstPoint.x, firstPoint.y);

      for (var _i = 1; _i < line.points.length; _i++) {
        var point = line.points[_i];
        ctx.lineTo(point.x, point.y);
      }

      ctx.stroke();
    }

    raf = requestAnimationFrame(draw);
  };

  draw();
});

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImNhbnZhcyIsImdldEVsZW1lbnRCeUlkIiwiY29sb3JTZWxlY3RzIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsImNvbG9yIiwiaGFuZGxlQ2xpY2tDb2xvciIsImUiLCJ3aW5kb3ciLCJnZXRDb21wdXRlZFN0eWxlIiwiY3VycmVudFRhcmdldCIsImdldFByb3BlcnR5VmFsdWUiLCJpIiwibGVuZ3RoIiwiY2xpY2siLCJsaW5lcyIsInJhZiIsInciLCJoIiwid2lkdGgiLCJoZWlnaHQiLCJjdHgiLCJnZXRDb250ZXh0IiwiZHJhdyIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJmaWxsU3R5bGUiLCJmaWxsUmVjdCIsImlkIiwibGluZSIsInN0cm9rZVN0eWxlIiwiZmlyc3RQb2ludCIsInBvaW50cyIsIm1vdmVUbyIsIngiLCJ5IiwicG9pbnQiLCJsaW5lVG8iLCJzdHJva2UiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJ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IFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiaW1wb3J0ICogYXMgU29ja2V0SU8gZnJvbSBcInNvY2tldC5pby1jbGllbnRcIjtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4ge1xuICAgIC8vIFVJIGluaXRcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW4tY2FudmFzXCIpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xuICAgIGNvbnN0IGNvbG9yU2VsZWN0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjb2xvci1zZWxlY3RcIikgYXMgSFRNTENvbGxlY3Rpb25PZjxIVE1MRGl2RWxlbWVudD47XG4gICAgbGV0IGNvbG9yOiBzdHJpbmc7XG4gICAgY29uc3QgaGFuZGxlQ2xpY2tDb2xvciA9IChlOiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCkgPT4ge1xuICAgICAgICBjb2xvciA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGUuY3VycmVudFRhcmdldCBhcyBIVE1MRGl2RWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZShcImJhY2tncm91bmQtY29sb3JcIik7XG4gICAgfTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbG9yU2VsZWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBlID0gY29sb3JTZWxlY3RzW2ldO1xuICAgICAgICBlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVDbGlja0NvbG9yKTtcbiAgICAgICAgZS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBoYW5kbGVDbGlja0NvbG9yKTtcbiAgICB9XG4gICAgY29sb3JTZWxlY3RzWzBdLmNsaWNrKCk7XG5cbiAgICAvLyBEYXRhIGluaXRcbiAgICBjb25zdCBsaW5lczogVExpbmVzID0ge307XG5cbiAgICBsZXQgcmFmOiBudW1iZXI7XG4gICAgY29uc3QgdyA9IDEyODA7XG4gICAgY29uc3QgaCA9IDcyMDtcbiAgICBjYW52YXMud2lkdGggPSB3O1xuICAgIGNhbnZhcy5oZWlnaHQgPSBoO1xuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgY29uc3QgZHJhdyA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIjtcbiAgICAgICAgY3R4LmZpbGxSZWN0KDAsIDAsIHcsIGgpO1xuICAgICAgICBmb3IgKGNvbnN0IGlkIGluIGxpbmVzKSB7XG4gICAgICAgICAgICBjb25zdCBsaW5lID0gbGluZXNbaWRdO1xuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gbGluZS5jb2xvcjtcbiAgICAgICAgICAgIGNvbnN0IGZpcnN0UG9pbnQgPSBsaW5lLnBvaW50c1swXTtcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oZmlyc3RQb2ludC54LCBmaXJzdFBvaW50LnkpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBsaW5lLnBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50ID0gbGluZS5wb2ludHNbaV07XG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbyhwb2ludC54LCBwb2ludC55KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgfVxuICAgICAgICByYWYgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XG4gICAgfTtcbiAgICBkcmF3KCk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiIn0=