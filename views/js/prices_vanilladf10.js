/* global $, local_vars */


function forEach(array, fn) {
	for (var i = 0; i < array.length; i++)
		fn(array[i], i);
}

function fadeOut(el) {
	el.style.opacity = 1;

	(function fade() {
		if ((el.style.opacity -= .1) < 0) {
			el.style.display = "none";
		} else {
			requestAnimationFrame(fade);
		}
	})();
}

function fadeIn(el, display) {
	el.style.opacity = 0;
	el.style.display = display || "block";

	(function fade() {
		var val = parseFloat(el.style.opacity);
		if (!((val += .1) > 1)) {
			el.style.opacity = val;
			requestAnimationFrame(fade);
		}
	})();
}

function connect() {
	var host = 'wss://prices.vitalmarkets.com/ws';

	var websocket = new ReconnectingWebSocket(host);

	websocket.onopen = function (evt) { };
	websocket.onmessage = function (evt) {
		var price = JSON.parse(evt.data);
		var symbol = price['SYMBOL'];

		[].forEach.call(document.querySelectorAll('.np-pr-quote[data-symbol="' + symbol + '"]'), function (el) {
			var dir_bid = price['BID_DIR'] == '1' ? "np-pr-green" : "np-pr-red";
			var dir_ask = price['ASK_DIR'] == '1' ? "np-pr-green" : "np-pr-red";

			el.querySelector('.np-pr-bid').classList.remove("np-pr-green");
			el.querySelector('.np-pr-bid').classList.remove("np-pr-red");
			el.querySelector('.np-pr-bid').classList.add(dir_bid);
			el.querySelector('.np-pr-bid').innerHTML = price['BID'];

			el.querySelector('.np-pr-ask').classList.remove("np-pr-green");
			el.querySelector('.np-pr-ask').classList.remove("np-pr-red");
			el.querySelector('.np-pr-ask').classList.add(dir_ask);
			el.querySelector('.np-pr-ask').innerHTML = price['ASK'];

			el.querySelector('.np-pr-spread').innerHTML = price['SPREAD'];

			var arrow_bid = price['BID_DIR'] == '1' ? "np-pr-arrow-up" : "np-pr-arrow-down";

			el.querySelector('.np-pr-direction').classList.remove("np-pr-arrow-up");
			el.querySelector('.np-pr-direction').classList.remove("np-pr-arrow-down");
			el.querySelector('.np-pr-direction').classList.add(arrow_bid);
		});
	};
	websocket.onerror = function (evt) { };
};

document.addEventListener('DOMContentLoaded', function () {
	[].forEach.call(document.querySelectorAll('.np-pr-container:not(.full) .np-pr-quotes-tabs li'), function (el) {
		el.addEventListener('click', function () {
			// console.log(el);
			// var str = document.querySelector('li.np-pr-active').textContent;
			// console.log(str);
			// var btn = document.querySelector('div.btn.dropdown-toggle');
			// btn.innerHTML = str;
			[].forEach.call(document.querySelectorAll('.np-pr-container:not(.full) .np-pr-quotes-tabs li'), function (el2) {
				el2.classList.remove("np-pr-active");
			});

			el.classList.add("np-pr-active");

			var str = el.textContent;
			console.log(str);
			var btn = document.querySelector('div.btn.dropdown-toggle');
			btn.innerHTML = str;

			var id = el.getAttribute("data-type");

			[].forEach.call(document.querySelectorAll('.np-pr-tabs-container div.np-pr-active'), function (el3) {
				el3.style.display = "none";
				el3.classList.remove("np-pr-active");
				document.getElementById("np-pr-table-" + id).classList.add("np-pr-active");
				fadeIn(document.getElementById("np-pr-table-" + id), "block");
			});
		});
	});

	var request = new XMLHttpRequest();
	var ts = Math.round((new Date()).getTime() / 1000);

	request.open('GET', 'https://prices.vitalmarkets.com/static/data/prices.log?ts=' + ts, true);

	request.onreadystatechange = function () {
		if (this.readyState === 4) {
			if (this.status >= 200 && this.status < 400) {
				// Success
				var data = this.responseText;

				var all_prices = data.split('\n');

				forEach(all_prices, function (val, index) {
					var price = val.split('|');

					var symbol = price[0];

					[].forEach.call(document.querySelectorAll('.np-pr-quote[data-symbol="' + symbol + '"]'), function (el) {
						el.querySelector('.np-pr-bid').innerHTML = price[1];
						el.querySelector('.np-pr-ask').innerHTML = price[2];
						el.querySelector('.np-pr-spread').innerHTML = price[3];
					});
				});

				connect();
			}
		}
	};

	request.send();
	request = null;
});

