//======================== Input Clear ========================//
$(document).ready(function() {
	//input clear
	$('.input-ic-clear').on('mousedown', function () {
		var input = $(this).closest('.input-inner-wrap').find('.input');
		input.val('')
		input.trigger('input');
	})
	$('.input-has-clear').on('paste keyup change', function () {
		var inputClear = $(this).closest('.input-inner-wrap').find('.input-ic-clear');
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