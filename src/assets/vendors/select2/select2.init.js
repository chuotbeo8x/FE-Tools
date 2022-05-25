//====================SELECT2 INIT=================//

// lang vi
!function () { var n; jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd && (n = jQuery.fn.select2.amd), n.define("select2/i18n/vi", [], function () { return { inputTooLong: function (n) { return "Vui lòng xóa bớt " + (n.input.length - n.maximum) + " ký tự" }, inputTooShort: function (n) { return "Vui lòng nhập thêm từ " + (n.minimum - n.input.length) + " ký tự trở lên" }, loadingMore: function () { return "Đang lấy thêm kết quả…" }, maximumSelected: function (n) { return "Chỉ có thể chọn được " + n.maximum + " lựa chọn" }, noResults: function () { return "Không tìm thấy kết quả" }, searching: function () { return "Đang tìm…" }, removeAllItems: function () { return "Xóa tất cả các mục" } } }), n.define, n.require }();
// end lang vi

$.fn.select2.amd.define("CustomSelectionAdapter", [
  "select2/utils",
  "select2/selection/multiple",
  "select2/selection/placeholder",
  "select2/selection/eventRelay",
  "select2/selection/single",
],
  function (Utils, MultipleSelection, Placeholder, EventRelay, SingleSelection) {
    // Decorates MultipleSelection with Placeholder
    var adapter = Utils.Decorate(MultipleSelection, Placeholder);
    // Decorates adapter with EventRelay - ensures events will continue to fire
    // e.g. selected, changed
    adapter = Utils.Decorate(adapter, EventRelay);
    adapter.prototype.render = function () {
      // Use selection-box from SingleSelection adapter
      // This implementation overrides the default implementation
      var $selection = MultipleSelection.prototype.render.call(this);
      return $selection;
    };

    adapter.prototype.update = function (data) {
      // copy and modify SingleSelection adapter
      this.clear();
      var $rendered = this.$selection.find('.select2-selection__rendered');
      var noItemsSelected = data.length === 0;
      var formatted = "";
      if (noItemsSelected) {
        formatted = '<span class="select2-selection__placeholder">' + this.options.get("placeholder") || "" + '</span>';
      } else {
        var itemsData = {
          selected: data || [],
          all: this.$element.find("option") || []
        };
        // Pass selected and all items to display method
        // which calls templateSelection
        formatted = this.display(itemsData, $rendered);
      }
      $rendered.empty().append(formatted);
      $rendered.prop('title', formatted);
    };
    return adapter;
  }
);
//custom select-2-template
function templateMultipleSelection(data) {
  return 'Đã chọn ' + data.selected.length + ' trên ' + (data.all.length - 1);
};
function templateImg(img) {
  if (!img.id) { return img.text; }
  if (img.element.attributes.dataimgClass) {
    return $img = $('<div class="select-tpl-img-wrap"><div class="row row-16 align-items-center"><div class="col-auto"><div class="select-tpl-img ' + img.element.attributes.dataimgClass.value + '" style="background-image: url(\'' + img.element.attributes.dataimg.value + '\')"></div></div><div class="col text-truncate"><div class="select-tpl-txt text-truncate">' + img.text + '</div></div></div></div>');
  } else {
    return $img = $('<div class="select-tpl-img-wrap"><div class="row row-16 align-items-center"><div class="col text-truncate"><div class="select-tpl-txt text-truncate">' + img.text + '</div></div></div></div>');
  }
};
function templateImgRes(img) {
  if (!img.id) { return img.text; }
  if (img.element.attributes.dataimgClass) {
    return $img = $('<div class="select-tpl-img-wrap"><div class="row row-16 align-items-center"><div class="col-auto"><div class="select-tpl-img ' + img.element.attributes.dataimgClass.value + '" style="background-image: url(\'' + img.element.attributes.dataimg.value + '\')"></div></div><div class="col col-li-value"><div class="select-tpl-txt b">' + img.text + '</div><div class="select-tpl-txt-sub h7 color-default-3">' + img.element.attributes.datasub.value + '</div></div></div></div>');
  } else {
    return $img = $('<div class="select-tpl-img-wrap"><div class="row row-16 align-items-center"><div class="col"><div class="select-tpl-txt b">' + img.text + '</div><div class="select-tpl-txt-sub h7 color-default-3">' + img.element.attributes.datasub.value + '</div></div></div></div>');
  }
};
//end: custom select-2-template
function closeSelect() {
  $('.select-2').select2('close');
}
function select2_search(term) {
  var $search = $('.select2-container--open').siblings(".select-2[multiple]").data('select2').dropdown.$search || $('.select2-container--open').siblings(".select-2[multiple]").data('select2').selection.$search;
  $search.val(term);
  $search.trigger('keyup');
}

function selectAll() {
  var selectEl = $('.select2-container--open').siblings(".select-2[multiple]");
  selectEl.find("option:not(:empty)").prop("selected", true);
  selectEl.trigger("change");
  $("li.select2-results__option").attr('aria-selected', 'true');
}

function deselectAll() {
  if ($(".select2-results__options").children(".select2-results__message").length > 0) {
    closeSelect();
  }
  $('.select2-container--open').siblings(".select-2[multiple]").find("option").prop("selected", false);
  $('.select2-container--open').siblings(".select-2[multiple]").find("option").find('option').prop('selected', false);
  $('.select2-container--open').siblings(".select-2[multiple]").trigger("change");
  $("li.select2-results__option").attr('aria-selected', 'false');
}

$(document).ready(function () {
  $(document).on('focus', '.select2.select2-container', function (e) {
    // only open on original attempt - close focus event should not fire open
    if (e.originalEvent && $(this).find(".select2-selection--single").length > 0) {
      $(this).siblings('select:enabled').select2('open')
    }
  });
  var select2Timeout;
  if ($('.select-2').length) {
    $('body').append('<div class="select-2-backdrop"></div>')
  }
  $('.select-2-backdrop').on('click', function () {
    $('.select-2').select2('close');
  })

  // contructor select-2 not multiple
  $('.select-2:not([multiple])').select2({
    width: '100%',
    closeOnSelect: $(window).width() < 768 ? false : true,
  }).on("select2:opening", function () {
    if ($(window).width() <= 767) {
      clearTimeout(select2Timeout);
    }
  }).on("select2:open", function () {
    $(this).parents('.form-group').addClass('input-focus')
    $(".select2-search--dropdown .select2-search__field").attr("placeholder", "Tìm kiếm...");
    if ($(window).width() >= 789) {
      if (navigator.userAgent.indexOf('MSIE') !== -1
        || navigator.appVersion.indexOf('Trident/') > -1) {
        $('.select2-search input').prop('focus', false);
      }
    }
    if ($(window).width() < 789) {
      $('.select2-search input').prop('focus', false);
    }
    if ($(window).width() <= 767) {
      clearTimeout(select2Timeout);
      console.log($(this))
      BNS.on()
      $('.close-select').remove();
      var x = $(this).eq(0).attr('header-text');
      $('body > .select2-container .select2-dropdown').prepend('<div class="close-select"><div class="close-select__btn" href="javascript:void(0)" onclick="closeSelect()"></div>' + x + '</div>');
      $('body > .select2-container .select2-dropdown').addClass('top-0');
      $('.select-2-backdrop').addClass('show');
    }
    $('.select2-ult-section').remove();
  }).on("select2:closing", function () {
    $('.select-2-backdrop').removeClass('show');
    if ($(window).width() <= 767) {
      BNS.off()
      $('body > .select2-container .select2-dropdown').removeClass('top-0');
    }
  }).on("select2:select", function () {
    if ($(window).width() <= 767) {
      $('.select-2-backdrop').removeClass('show');
      $('body > .select2-container .select2-dropdown').removeClass('top-0');
      select2Timeout = setTimeout(function () {
        $('.select-2').select2('close');
      }, 320)
    }
  }).on("select2:close", function () {
    $(this).parents('.form-group').removeClass('input-focus')
  });
  // end: contructor select-2 not multiple

  // contructor select-2 multiple
  $('.select-2[multiple]').select2({
    width: '100%',
    closeOnSelect: false,
    language: 'vi',
    selectionAdapter: $.fn.select2.amd.require("CustomSelectionAdapter"),
    templateSelection: templateMultipleSelection,
  }).on("select2:opening", function () {
    if ($(window).width() <= 767) {
      clearTimeout(select2Timeout);
    }
  }).on("select2:open", function () {
    $(this).parents('.form-group').addClass('input-focus')
    $(".select2-search--dropdown .select2-search__field").attr("placeholder", "Tìm kiếm...");
    if ($(window).width() < 789) {
      $('.select2-search input').prop('focus', false);
    }
    if ($(window).width() <= 767) {
      clearTimeout(select2Timeout);
      BNS.on()
      $('.close-select').remove();
      $('.unselect-all').remove();
      $('.select2-search-container').remove();
      var x = $(this).eq(0).attr('header-text');
      if ($(this).attr('data-minimum-results-for-search')) {
        $('body > .select2-container .select2-dropdown').prepend('<div class="close-select"><div class="close-select__btn" href="javascript:void(0)" onclick="closeSelect()"></div>' + x + '</div>');
      }
      else {
        $('body > .select2-container .select2-dropdown').prepend('<div class="close-select"><div class="close-select__btn" href="javascript:void(0)" onclick="closeSelect()"></div>' + x + '</div><span class="no-pb select2-search select2-search-container select2-search--dropdown"><input placeholder="Tìm kiếm" id="select-2-search-multiple" class="select2-search__field" type="search" tabindex="0" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox"></span>');
        $("#select-2-search-multiple").keyup(function () {
          select2_search($("#select-2-search-multiple").val());
        });
      }
      $('body > .select2-container .select2-dropdown').addClass('top-0');
      $('.select-2-backdrop').addClass('show');
    }

    $('.select2-ult-section').remove();
    $('body > .select2-container .select2-search--dropdown').append('<div class="select2-ult-section"><div class="select-all" onclick="selectAll()">Chọn tất cả</div><div class="unselect-all" onclick="deselectAll()">Bỏ chọn tất cả</div></div>');
  }).on("select2:closing", function () {
    $('.select-2-backdrop').removeClass('show');
    if ($(window).width() <= 767) {
      BNS.off()
      $('body > .select2-container .select2-dropdown').removeClass('top-0');
    }
  }).on("select2:close", function () {
    $(this).parents('.form-group').removeClass('input-focus')
  })
  // end: contructor select-2 multiple

  // contructor select-2-template not multiple
  $('.select-2-template').select2({
    templateResult: templateImgRes,
    templateSelection: templateImg,
    width: '100%'
  });
  // end:contructor select-2-template not multiple

  // contructor select-2-template multiple
  $('.select-2-template[multiple]').select2({
    templateResult: templateImgRes,
    language: 'vi',
    selectionAdapter: $.fn.select2.amd.require("CustomSelectionAdapter"),
    templateSelection: templateMultipleSelection,
    closeOnSelect: false,
    width: '100%'
  });
  // end:contructor select-2-template multiple

  if (iOS()) {
    if ($(window).width() < 992 && deviceIsMobile) {
      $(document).on('touchstart', '.select2-results', function (e) {
        setTimeout(function () {
          $('input').blur();
        }, 100)
      });
    }
  }
});
//====================END SELECT2 INIT=================//