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
  var colorSelects = document.getElementsByClassName("color-select"); // Data init

  var color;
  var lines = {};
  var tempLine = {
    color,
    points: []
  };
  var raf;
  var w = 1280;
  var h = 720;
  canvas.width = w;
  canvas.height = h;
  var ctx = canvas.getContext("2d");

  var drawLine = (ctx, line) => {
    if (!line.points.length) return;
    ctx.save();
    ctx.strokeStyle = line.color;
    var firstPoint = line.points[0];
    ctx.moveTo(firstPoint.x, firstPoint.y);

    for (var i = 1; i < line.points.length; i++) {
      var point = line.points[i];
      ctx.lineTo(point.x, point.y);
    }

    ctx.stroke();
    ctx.restore();
  };

  var draw = () => {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);

    for (var id in lines) {
      var line = lines[id];
      drawLine(ctx, line);
    }

    drawLine(ctx, tempLine);
    raf = requestAnimationFrame(draw);
  };

  draw();

  var handleClickColor = e => {
    color = window.getComputedStyle(e.currentTarget).getPropertyValue("background-color");
    tempLine.color = color;
  };

  for (var i = 0; i < colorSelects.length; i++) {
    var e = colorSelects[i];
    e.addEventListener("click", handleClickColor);
    e.addEventListener("touchstart", handleClickColor);
  }

  colorSelects[0].click();

  var handleMove = e => {
    var rect = canvas.getBoundingClientRect();
    var x = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
    var y = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY;
    tempLine.points.push({
      x: x / rect.width * w,
      y: y / rect.height * h
    });
  };

  var handleEnd = () => {
    canvas.removeEventListener("mousemove", handleMove);
    canvas.removeEventListener("touchmove", handleMove);
    canvas.removeEventListener("mouseup", handleEnd);
    canvas.removeEventListener("touchend", handleEnd);
  };

  var handleStart = e => {
    var rect = canvas.getBoundingClientRect();
    var x = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
    var y = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY;
    tempLine.points = [{
      x: x / rect.width * w,
      y: y / rect.height * h
    }];
    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("touchmove", handleMove);
    canvas.addEventListener("mouseup", handleEnd);
    canvas.addEventListener("touchend", handleEnd);
  };

  canvas.addEventListener("mousedown", handleStart);
  canvas.addEventListener("touchstart", handleStart);
});

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImNhbnZhcyIsImdldEVsZW1lbnRCeUlkIiwiY29sb3JTZWxlY3RzIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsImNvbG9yIiwibGluZXMiLCJ0ZW1wTGluZSIsInBvaW50cyIsInJhZiIsInciLCJoIiwid2lkdGgiLCJoZWlnaHQiLCJjdHgiLCJnZXRDb250ZXh0IiwiZHJhd0xpbmUiLCJsaW5lIiwibGVuZ3RoIiwic2F2ZSIsInN0cm9rZVN0eWxlIiwiZmlyc3RQb2ludCIsIm1vdmVUbyIsIngiLCJ5IiwiaSIsInBvaW50IiwibGluZVRvIiwic3Ryb2tlIiwicmVzdG9yZSIsImRyYXciLCJmaWxsU3R5bGUiLCJmaWxsUmVjdCIsImlkIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiaGFuZGxlQ2xpY2tDb2xvciIsImUiLCJ3aW5kb3ciLCJnZXRDb21wdXRlZFN0eWxlIiwiY3VycmVudFRhcmdldCIsImdldFByb3BlcnR5VmFsdWUiLCJjbGljayIsImhhbmRsZU1vdmUiLCJyZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiTW91c2VFdmVudCIsInBhZ2VYIiwidG91Y2hlcyIsInBhZ2VZIiwicHVzaCIsImhhbmRsZUVuZCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJoYW5kbGVTdGFydCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdF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LEVBQXFDb0QsV0FBckM7QUFDQW5ELFFBQU0sQ0FBQ0QsZ0JBQVAsQ0FBd0IsWUFBeEIsRUFBc0NvRCxXQUF0QztBQUNILENBMUVELEUiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsImltcG9ydCAqIGFzIFNvY2tldElPIGZyb20gXCJzb2NrZXQuaW8tY2xpZW50XCI7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IHtcbiAgICAvLyBVSSBpbml0XG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluLWNhbnZhc1wiKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICBjb25zdCBjb2xvclNlbGVjdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY29sb3Itc2VsZWN0XCIpIGFzIEhUTUxDb2xsZWN0aW9uT2Y8SFRNTERpdkVsZW1lbnQ+O1xuICAgIC8vIERhdGEgaW5pdFxuICAgIGxldCBjb2xvcjogc3RyaW5nO1xuICAgIGNvbnN0IGxpbmVzOiBUTGluZXMgPSB7fTtcbiAgICBjb25zdCB0ZW1wTGluZTogVExpbmUgPSB7IGNvbG9yLCBwb2ludHM6IFtdIH07XG4gICAgbGV0IHJhZjogbnVtYmVyO1xuICAgIGNvbnN0IHcgPSAxMjgwO1xuICAgIGNvbnN0IGggPSA3MjA7XG4gICAgY2FudmFzLndpZHRoID0gdztcbiAgICBjYW52YXMuaGVpZ2h0ID0gaDtcbiAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgIGNvbnN0IGRyYXdMaW5lID0gKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBsaW5lOiBUTGluZSkgPT4ge1xuICAgICAgICBpZiAoIWxpbmUucG9pbnRzLmxlbmd0aCkgcmV0dXJuO1xuICAgICAgICBjdHguc2F2ZSgpO1xuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBsaW5lLmNvbG9yO1xuICAgICAgICBjb25zdCBmaXJzdFBvaW50ID0gbGluZS5wb2ludHNbMF07XG4gICAgICAgIGN0eC5tb3ZlVG8oZmlyc3RQb2ludC54LCBmaXJzdFBvaW50LnkpO1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGxpbmUucG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBwb2ludCA9IGxpbmUucG9pbnRzW2ldO1xuICAgICAgICAgICAgY3R4LmxpbmVUbyhwb2ludC54LCBwb2ludC55KTtcbiAgICAgICAgfVxuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfTtcbiAgICBjb25zdCBkcmF3ID0gKCkgPT4ge1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xuICAgICAgICBjdHguZmlsbFJlY3QoMCwgMCwgdywgaCk7XG4gICAgICAgIGZvciAoY29uc3QgaWQgaW4gbGluZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSBsaW5lc1tpZF07XG4gICAgICAgICAgICBkcmF3TGluZShjdHgsIGxpbmUpO1xuICAgICAgICB9XG4gICAgICAgIGRyYXdMaW5lKGN0eCwgdGVtcExpbmUpO1xuICAgICAgICByYWYgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XG4gICAgfTtcbiAgICBkcmF3KCk7XG5cbiAgICBjb25zdCBoYW5kbGVDbGlja0NvbG9yID0gKGU6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgIGNvbG9yID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZS5jdXJyZW50VGFyZ2V0IGFzIEhUTUxEaXZFbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKFwiYmFja2dyb3VuZC1jb2xvclwiKTtcbiAgICAgICAgdGVtcExpbmUuY29sb3IgPSBjb2xvcjtcbiAgICB9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sb3JTZWxlY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGUgPSBjb2xvclNlbGVjdHNbaV07XG4gICAgICAgIGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUNsaWNrQ29sb3IpO1xuICAgICAgICBlLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIGhhbmRsZUNsaWNrQ29sb3IpO1xuICAgIH1cbiAgICBjb2xvclNlbGVjdHNbMF0uY2xpY2soKTtcblxuICAgIGNvbnN0IGhhbmRsZU1vdmUgPSAoZTogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3QgeCA9IGUgaW5zdGFuY2VvZiBNb3VzZUV2ZW50ID8gZS5wYWdlWCA6IGUudG91Y2hlc1swXS5wYWdlWDtcbiAgICAgICAgY29uc3QgeSA9IGUgaW5zdGFuY2VvZiBNb3VzZUV2ZW50ID8gZS5wYWdlWSA6IGUudG91Y2hlc1swXS5wYWdlWTtcbiAgICAgICAgdGVtcExpbmUucG9pbnRzLnB1c2goeyB4OiB4IC8gcmVjdC53aWR0aCAqIHcsIHk6IHkgLyByZWN0LmhlaWdodCAqIGggfSk7XG4gICAgfTtcbiAgICBjb25zdCBoYW5kbGVFbmQgPSAoKSA9PiB7XG4gICAgICAgIGNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGhhbmRsZU1vdmUpO1xuICAgICAgICBjYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCBoYW5kbGVNb3ZlKTtcbiAgICAgICAgY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIGhhbmRsZUVuZCk7XG4gICAgICAgIGNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgaGFuZGxlRW5kKTtcbiAgICB9O1xuICAgIGNvbnN0IGhhbmRsZVN0YXJ0ID0gKGU6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGNvbnN0IHggPSBlIGluc3RhbmNlb2YgTW91c2VFdmVudCA/IGUucGFnZVggOiBlLnRvdWNoZXNbMF0ucGFnZVg7XG4gICAgICAgIGNvbnN0IHkgPSBlIGluc3RhbmNlb2YgTW91c2VFdmVudCA/IGUucGFnZVkgOiBlLnRvdWNoZXNbMF0ucGFnZVk7XG4gICAgICAgIHRlbXBMaW5lLnBvaW50cyA9IFt7IHg6IHggLyByZWN0LndpZHRoICogdywgeTogeSAvIHJlY3QuaGVpZ2h0ICogaCB9XTtcbiAgICAgICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgaGFuZGxlTW92ZSk7XG4gICAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIGhhbmRsZU1vdmUpO1xuICAgICAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgaGFuZGxlRW5kKTtcbiAgICAgICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBoYW5kbGVFbmQpO1xuICAgIH07XG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgaGFuZGxlU3RhcnQpO1xuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBoYW5kbGVTdGFydCk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiIn0=