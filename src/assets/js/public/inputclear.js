var inputclears = document.querySelectorAll(".form-control");
[].forEach.call(inputclears, function (inputclear) {
    inputclear.insertAdjacentHTML("afterend",
    '<div class="btn-clipboard"><i class="bi bi-clipboard"></i></div>');
});
(function() {
	var searchForm = document.getElementsByClassName('.form-clear'),
		textInput = inputclears,
		clearBtn = textInput.nextSibling;
	textInput.onkeyup = function() {
		// Show the clear button if text input value is not empty
		clearBtn.style.visibility = (this.value.length) ? "visible" : "hidden";
	};
	// Hide the clear button on click, and reset the input value
	clearBtn.onclick = function() {
		this.style.visibility = "hidden";
		textInput.value = "";
	};
})();