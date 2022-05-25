//======================== Input Clear ========================//
$(document).ready(function() {
	//input clear
	var inputclears = document.querySelectorAll(".form-control");
	[].forEach.call(inputclears, function (inputclear) {
		inputclear.insertAdjacentHTML("afterend",
		'<button type="button" class="btn-clearform"></button>');
	});
	$('.btn-clearform').on('mousedown', function () {
		var input = $(this).closest('.form-clear').find('.form-control');
		input.val('')
		input.trigger('input');
    $(this).removeClass('show')
	})
	$('.form-control').on('paste keyup change', function () {
		var inputClear = $(this).closest('.form-clear').find('.btn-clearform');
		if ($(this).val()) {
			inputClear.addClass('show');
		}
		else {
			inputClear.removeClass('show');
		}
	});
	//end input clear
});
//======================== Input Clear ========================//