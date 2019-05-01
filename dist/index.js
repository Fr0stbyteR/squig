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
  // Data init
  var squig = {};
  var w = 1280;
  var h = 720;
  squig.canvas = document.getElementById("main-canvas");
  var colorSelects = document.getElementsByClassName("color-select");
  squig.lines = {};
  squig.tempLine = {
    color: "black",
    points: []
  };
  squig.canvas.width = w;
  squig.canvas.height = h;
  squig.ctx = squig.canvas.getContext("2d");
  squig.raf = 0;
  window.squig = squig;

  var drawLine = (ctx, line) => {
    if (!line.points.length) return;
    ctx.save();
    ctx.strokeStyle = line.color;
    ctx.beginPath();
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
    var ctx = squig.ctx;
    var lines = squig.lines;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);

    for (var id in lines) {
      var line = lines[id];
      drawLine(ctx, line);
    }

    drawLine(ctx, squig.tempLine);
    window.squig.raf = requestAnimationFrame(draw);
  };

  draw();

  var handleClickColor = e => {
    var color = window.getComputedStyle(e.currentTarget).getPropertyValue("background-color");
    squig.tempLine.color = color;
  };

  for (var i = 0; i < colorSelects.length; i++) {
    var e = colorSelects[i];
    e.addEventListener("click", handleClickColor);
    e.addEventListener("touchstart", handleClickColor);
  }

  colorSelects[0].click();

  var handleMove = e => {
    var rect = squig.canvas.getBoundingClientRect();
    var x = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
    var y = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY;
    squig.tempLine.points.push({
      x: x / rect.width * w,
      y: y / rect.height * h
    });
  };

  var handleEnd = () => {
    squig.lines[new Date().getTime()] = squig.tempLine;
    squig.tempLine = {
      color: squig.tempLine.color,
      points: []
    };
    var canvas = squig.canvas;
    canvas.removeEventListener("mousemove", handleMove);
    canvas.removeEventListener("touchmove", handleMove);
    canvas.removeEventListener("mouseup", handleEnd);
    canvas.removeEventListener("touchend", handleEnd);
  };

  var handleStart = e => {
    var canvas = squig.canvas;
    var rect = canvas.getBoundingClientRect();
    var x = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
    var y = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY;
    squig.tempLine.points = [{
      x: x / rect.width * w,
      y: y / rect.height * h
    }];
    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("touchmove", handleMove);
    canvas.addEventListener("mouseup", handleEnd);
    canvas.addEventListener("touchend", handleEnd);
  };

  squig.canvas.addEventListener("mousedown", handleStart);
  squig.canvas.addEventListener("touchstart", handleStart);
});

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsInNxdWlnIiwidyIsImgiLCJjYW52YXMiLCJnZXRFbGVtZW50QnlJZCIsImNvbG9yU2VsZWN0cyIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJsaW5lcyIsInRlbXBMaW5lIiwiY29sb3IiLCJwb2ludHMiLCJ3aWR0aCIsImhlaWdodCIsImN0eCIsImdldENvbnRleHQiLCJyYWYiLCJ3aW5kb3ciLCJkcmF3TGluZSIsImxpbmUiLCJsZW5ndGgiLCJzYXZlIiwic3Ryb2tlU3R5bGUiLCJiZWdpblBhdGgiLCJmaXJzdFBvaW50IiwibW92ZVRvIiwieCIsInkiLCJpIiwicG9pbnQiLCJsaW5lVG8iLCJzdHJva2UiLCJyZXN0b3JlIiwiZHJhdyIsImZpbGxTdHlsZSIsImZpbGxSZWN0IiwiaWQiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJoYW5kbGVDbGlja0NvbG9yIiwiZSIsImdldENvbXB1dGVkU3R5bGUiLCJjdXJyZW50VGFyZ2V0IiwiZ2V0UHJvcGVydHlWYWx1ZSIsImNsaWNrIiwiaGFuZGxlTW92ZSIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJNb3VzZUV2ZW50IiwicGFnZVgiLCJ0b3VjaGVzIiwicGFnZVkiLCJwdXNoIiwiaGFuZGxlRW5kIiwiRGF0ZSIsImdldFRpbWUiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiaGFuZGxlU3RhcnQiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FB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QVlRLFVBQWIsR0FBMEJSLENBQUMsQ0FBQ1MsS0FBNUIsR0FBb0NULENBQUMsQ0FBQ1UsT0FBRixDQUFVLENBQVYsRUFBYUQsS0FBM0Q7QUFDQSxRQUFNckIsQ0FBQyxHQUFHWSxDQUFDLFlBQVlRLFVBQWIsR0FBMEJSLENBQUMsQ0FBQ1csS0FBNUIsR0FBb0NYLENBQUMsQ0FBQ1UsT0FBRixDQUFVLENBQVYsRUFBYUMsS0FBM0Q7QUFDQWpELFNBQUssQ0FBQ1EsUUFBTixDQUFlRSxNQUFmLEdBQXdCLENBQUM7QUFBRWUsT0FBQyxFQUFFQSxDQUFDLEdBQUdtQixJQUFJLENBQUNqQyxLQUFULEdBQWlCVixDQUF0QjtBQUF5QnlCLE9BQUMsRUFBRUEsQ0FBQyxHQUFHa0IsSUFBSSxDQUFDaEMsTUFBVCxHQUFrQlY7QUFBOUMsS0FBRCxDQUF4QjtBQUNBQyxVQUFNLENBQUNKLGdCQUFQLENBQXdCLFdBQXhCLEVBQXFDNEMsVUFBckM7QUFDQXhDLFVBQU0sQ0FBQ0osZ0JBQVAsQ0FBd0IsV0FBeEIsRUFBcUM0QyxVQUFyQztBQUNBeEMsVUFBTSxDQUFDSixnQkFBUCxDQUF3QixTQUF4QixFQUFtQ29ELFNBQW5DO0FBQ0FoRCxVQUFNLENBQUNKLGdCQUFQLENBQXdCLFVBQXhCLEVBQW9Db0QsU0FBcEM7QUFDSCxHQVZEOztBQVdBbkQsT0FBSyxDQUFDRyxNQUFOLENBQWFKLGdCQUFiLENBQThCLFdBQTlCLEVBQTJDd0QsV0FBM0M7QUFDQXZELE9BQUssQ0FBQ0csTUFBTixDQUFhSixnQkFBYixDQUE4QixZQUE5QixFQUE0Q3dELFdBQTVDO0FBQ0gsQ0FsRkQsRSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiaW1wb3J0ICogYXMgU29ja2V0SU8gZnJvbSBcInNvY2tldC5pby1jbGllbnRcIjtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4ge1xuICAgIC8vIERhdGEgaW5pdFxuICAgIGNvbnN0IHNxdWlnOiBTcXVpZyA9IHt9O1xuICAgIGNvbnN0IHcgPSAxMjgwO1xuICAgIGNvbnN0IGggPSA3MjA7XG4gICAgc3F1aWcuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluLWNhbnZhc1wiKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICBjb25zdCBjb2xvclNlbGVjdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY29sb3Itc2VsZWN0XCIpIGFzIEhUTUxDb2xsZWN0aW9uT2Y8SFRNTERpdkVsZW1lbnQ+O1xuICAgIHNxdWlnLmxpbmVzID0ge307XG4gICAgc3F1aWcudGVtcExpbmUgPSB7IGNvbG9yOiBcImJsYWNrXCIsIHBvaW50czogW10gfTtcbiAgICBzcXVpZy5jYW52YXMud2lkdGggPSB3O1xuICAgIHNxdWlnLmNhbnZhcy5oZWlnaHQgPSBoO1xuICAgIHNxdWlnLmN0eCA9IHNxdWlnLmNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgc3F1aWcucmFmID0gMDtcbiAgICB3aW5kb3cuc3F1aWcgPSBzcXVpZztcblxuICAgIGNvbnN0IGRyYXdMaW5lID0gKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBsaW5lOiBUTGluZSkgPT4ge1xuICAgICAgICBpZiAoIWxpbmUucG9pbnRzLmxlbmd0aCkgcmV0dXJuO1xuICAgICAgICBjdHguc2F2ZSgpO1xuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBsaW5lLmNvbG9yO1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGNvbnN0IGZpcnN0UG9pbnQgPSBsaW5lLnBvaW50c1swXTtcbiAgICAgICAgY3R4Lm1vdmVUbyhmaXJzdFBvaW50LngsIGZpcnN0UG9pbnQueSk7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbGluZS5wb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHBvaW50ID0gbGluZS5wb2ludHNbaV07XG4gICAgICAgICAgICBjdHgubGluZVRvKHBvaW50LngsIHBvaW50LnkpO1xuICAgICAgICB9XG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9O1xuICAgIGNvbnN0IGRyYXcgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGN0eCA9IHNxdWlnLmN0eDtcbiAgICAgICAgY29uc3QgbGluZXMgPSBzcXVpZy5saW5lcztcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIjtcbiAgICAgICAgY3R4LmZpbGxSZWN0KDAsIDAsIHcsIGgpO1xuICAgICAgICBmb3IgKGNvbnN0IGlkIGluIGxpbmVzKSB7XG4gICAgICAgICAgICBjb25zdCBsaW5lID0gbGluZXNbaWRdO1xuICAgICAgICAgICAgZHJhd0xpbmUoY3R4LCBsaW5lKTtcbiAgICAgICAgfVxuICAgICAgICBkcmF3TGluZShjdHgsIHNxdWlnLnRlbXBMaW5lKTtcbiAgICAgICAgd2luZG93LnNxdWlnLnJhZiA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3KTtcbiAgICB9O1xuICAgIGRyYXcoKTtcblxuICAgIGNvbnN0IGhhbmRsZUNsaWNrQ29sb3IgPSAoZTogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgY29sb3IgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlLmN1cnJlbnRUYXJnZXQgYXMgSFRNTERpdkVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoXCJiYWNrZ3JvdW5kLWNvbG9yXCIpO1xuICAgICAgICBzcXVpZy50ZW1wTGluZS5jb2xvciA9IGNvbG9yO1xuICAgIH07XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb2xvclNlbGVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZSA9IGNvbG9yU2VsZWN0c1tpXTtcbiAgICAgICAgZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlQ2xpY2tDb2xvcik7XG4gICAgICAgIGUuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgaGFuZGxlQ2xpY2tDb2xvcik7XG4gICAgfVxuICAgIGNvbG9yU2VsZWN0c1swXS5jbGljaygpO1xuXG4gICAgY29uc3QgaGFuZGxlTW92ZSA9IChlOiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCkgPT4ge1xuICAgICAgICBjb25zdCByZWN0ID0gc3F1aWcuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCB4ID0gZSBpbnN0YW5jZW9mIE1vdXNlRXZlbnQgPyBlLnBhZ2VYIDogZS50b3VjaGVzWzBdLnBhZ2VYO1xuICAgICAgICBjb25zdCB5ID0gZSBpbnN0YW5jZW9mIE1vdXNlRXZlbnQgPyBlLnBhZ2VZIDogZS50b3VjaGVzWzBdLnBhZ2VZO1xuICAgICAgICBzcXVpZy50ZW1wTGluZS5wb2ludHMucHVzaCh7IHg6IHggLyByZWN0LndpZHRoICogdywgeTogeSAvIHJlY3QuaGVpZ2h0ICogaCB9KTtcbiAgICB9O1xuICAgIGNvbnN0IGhhbmRsZUVuZCA9ICgpID0+IHtcbiAgICAgICAgc3F1aWcubGluZXNbbmV3IERhdGUoKS5nZXRUaW1lKCldID0gc3F1aWcudGVtcExpbmU7XG4gICAgICAgIHNxdWlnLnRlbXBMaW5lID0geyBjb2xvcjogc3F1aWcudGVtcExpbmUuY29sb3IsIHBvaW50czogW10gfTtcbiAgICAgICAgY29uc3QgY2FudmFzID0gc3F1aWcuY2FudmFzO1xuICAgICAgICBjYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBoYW5kbGVNb3ZlKTtcbiAgICAgICAgY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgaGFuZGxlTW92ZSk7XG4gICAgICAgIGNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBoYW5kbGVFbmQpO1xuICAgICAgICBjYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGhhbmRsZUVuZCk7XG4gICAgfTtcbiAgICBjb25zdCBoYW5kbGVTdGFydCA9IChlOiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCkgPT4ge1xuICAgICAgICBjb25zdCBjYW52YXMgPSBzcXVpZy5jYW52YXM7XG4gICAgICAgIGNvbnN0IHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGNvbnN0IHggPSBlIGluc3RhbmNlb2YgTW91c2VFdmVudCA/IGUucGFnZVggOiBlLnRvdWNoZXNbMF0ucGFnZVg7XG4gICAgICAgIGNvbnN0IHkgPSBlIGluc3RhbmNlb2YgTW91c2VFdmVudCA/IGUucGFnZVkgOiBlLnRvdWNoZXNbMF0ucGFnZVk7XG4gICAgICAgIHNxdWlnLnRlbXBMaW5lLnBvaW50cyA9IFt7IHg6IHggLyByZWN0LndpZHRoICogdywgeTogeSAvIHJlY3QuaGVpZ2h0ICogaCB9XTtcbiAgICAgICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgaGFuZGxlTW92ZSk7XG4gICAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIGhhbmRsZU1vdmUpO1xuICAgICAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgaGFuZGxlRW5kKTtcbiAgICAgICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBoYW5kbGVFbmQpO1xuICAgIH07XG4gICAgc3F1aWcuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgaGFuZGxlU3RhcnQpO1xuICAgIHNxdWlnLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBoYW5kbGVTdGFydCk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiIn0=