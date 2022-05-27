const FILE_PATH = "media/components/icons/default/",
  ICON_CLOSE_NAME = "ic-close.svg";

if ($(".lite-picker").length) {
  $('body').append('<div class="litepicker-backdrop"></div>')
}

(function () {
  if (typeof Event !== "function") {
    window.Event = CustomEvent;
  }
})();

var today = new Date(),
  curYear = new Date().getFullYear();
today = new Date().setDate(today.getDate());

var lp = [],
  lpr = [];

var opts = {
  format: "DD/MM/YYYY",
  plugins: window.innerWidth <= 480 ? ["mobilefriendly"] : "",
  lang: "vi-VN",
  dropdowns: {
    minYear: curYear - 2,
    maxYear: curYear,
    months: true,
    years: true,
  },
  tooltipText: {
    one: "ngày",
    other: "ngày",
  },
  mobilefriendly: {
    breakpoint: 480,
  },
};

var optsRange = {
  singleMode: false,
  numberOfColumns: window.innerWidth > 768 ? 2 : 1,
  numberOfMonths: window.innerWidth > 768 ? 2 : 1,
};

var optsRange2ndInput = {
  singleMode: false,
  numberOfColumns: window.innerWidth > 768 ? 2 : 1,
  numberOfMonths: window.innerWidth > 768 ? 2 : 1,
  allowRepick: true,
  minDate: today,
  maxDate: null,
  resetButton: true,
};

function isStartDateAddActive(start, end, className) {
  start.classList.remove(className);
  end.classList.remove(className);

  isStartDate ? start.classList.add(className) : end.classList.add(className);
}

function camelCase(input) {
  return input.toLowerCase().replace(/-(.)/g, function (match, group1) {
    return group1.toUpperCase();
  });
}

function mergeObjects(obj1, obj2) {
  return { ...obj1, ...obj2 };
}

function getLightpickOption(el) {
  let attr = el.attributes,
    overideOpts = {
      element: el,
    };
  if (el.getAttribute("lp-single-mode") == "false") {
    overideOpts = mergeObjects(optsRange, overideOpts);
  }
  for (var key in attr) {
    let element = attr[key];

    if (typeof element !== "object") continue;
    if (element.name.indexOf("lp-")) continue;

    let name = camelCase(element.name.replace("lp-", "")),
      val = element.value;
    val = val == "true" ? true : false;
    overideOpts[name] = val;
  }
  return mergeObjects(opts, overideOpts);
}

[].forEach.call(document.querySelectorAll(".lite-picker"), function (el, i, a) {
  let lpOptions = getLightpickOption(el);
  lpicker = new Litepicker(lpOptions)
    .on("hide", function (element) {
      el.dispatchEvent(new Event("input", { bubbles: true }));
      BNS.off();
      document.querySelector("body").classList.remove("litepicker-open");
    })
    .on("mobilefriendly.show", function (el) {
      BNS.on();
    })
    .on("render:day", function (day, date) {

      if (day.classList.contains("is-start-date")) {
        day.setAttribute("lpcurrent", "true");
        day.setAttribute("lpstart", "true");
      }
      if (day.classList.contains("is-end-date")) {
        day.setAttribute("lpcurrent", "true");
        day.setAttribute("lpend", "true");
      }
    })
    .on("render", function (ui) {
      if (window.innerWidth <= opts.mobilefriendly.breakpoint) {
        let title = el.getAttribute("header-text");

        ui.querySelector(".container__months").insertAdjacentHTML(
          "afterbegin",
          `<div class="litepicker-mobile-header">
            <div class="litepicker-mobile-header--main">
              <div class="row row-0 align-items-center">
                <div class="col">
                  <div class="litepicker-mobile-header-title"> ${title}</div>
                </div>
                <div class="col-auto">
                  <button type="button" class="litepicker__close-action dropdown-close">
                    <img src="${FILE_PATH + ICON_CLOSE_NAME}" alt="">
                  </button>
                </div>
              </div>
            </div
          </div>`
        );

        ui.querySelector(".litepicker__close-action").addEventListener(
          "click", function () {
            lp[i].hide();
          }
        );
      }
    });
  lp.push(lpicker);
});

var isStartDate = false;

function getDayOfTheWeek(el, i, a, lp) {
  if (lp.getDate()) {
    let startDateDofW = lp.getDate().dateInstance.toLocaleString(opts.lang, { weekday: 'short' });
    el.value = el.value.replace('LL', startDateDofW)
  }

  if (lp.getEndDate()) {
    let endDateDofW = lp.getEndDate().dateInstance.toLocaleString(opts.lang, { weekday: 'short' });
    a[i + 1].value = a[i + 1].value.replace('LL', endDateDofW);
  }
}

function GetFormattedDate(date) {
  let fullDate = date.dateInstance,
    day = fullDate.getDate(),
    month = fullDate.getMonth() + 1,
    year = fullDate.getFullYear();
  return day + "/" + (month < 10 ? "0" + month : month) + "/" + year;
}

[].forEach.call(document.querySelectorAll('.lite-picker-range-2nd'), function (el, i, a) {
  if (i % 2 == 0 || i == 0) {
    el.classList.add('lite-picker-range-2nd-start')
    var lpOptions = getLightpickOption(el);
    lpOptions['elementEnd'] = a[i + 1];
    lpOptions = mergeObjects(optsRange2ndInput, lpOptions);
    lpicker = new Litepicker(lpOptions).on('hide', function (element) {
      getDayOfTheWeek(el, i, a, lpr[i / 2]);
      el.dispatchEvent(new Event('change', { bubbles: true }));
      a[i + 1].dispatchEvent(new Event('change', { bubbles: true }));
      el.classList.remove('light-pick-focus');
      a[i + 1].classList.remove('light-pick-focus');
    }).on('render:day', function (day, date) {

      let dayClass = Array.from(day.classList),
        litePickerClass = ['is-in-range', 'is-start-date', 'is-end-date'];

      if (dayClass.some(item => litePickerClass.includes(item))) {
        day.setAttribute("lpcurrent", "true")
      }
      if (day.classList.contains('is-start-date')) {
        day.setAttribute("lpstart", "true")
      }
      if (day.classList.contains('is-end-date')) {
        day.setAttribute("lpend", "true")
      }
    }).on('show', function (el) {
      if (lpr[i / 2].ui.offsetLeft + lpr[i / 2].ui.offsetWidth >= window.innerWidth) {
        lpr[i / 2].ui.style.left = '';
        lpr[i / 2].ui.style.right = '10px';
      }
    }).on('before:show', function (el) {

      let getMindate = lpr[i / 2].getStartDate() ? lpr[i / 2].getStartDate() : optsRange2ndInput.minDate,
        getMaxdate = lpr[i / 2].getEndDate() ? lpr[i / 2].getEndDate() : optsRange2ndInput.maxDate;

      el.classList.add('light-pick-focus');

      if (el.classList.contains('lite-picker-range-2nd-start')) {
        isStartDate = true;
        a[i + 1].classList.remove('light-pick-focus');
        if (optsRange2ndInput.allowRepick) {
          lpr[i / 2].setOptions({ minDate: optsRange2ndInput.minDate, maxDate: getMaxdate })
        }
      }
      else {
        isStartDate = false;
        a[i].classList.remove('light-pick-focus');
        if (optsRange2ndInput.allowRepick) {
          lpr[i / 2].setOptions({ maxDate: optsRange2ndInput.maxDate, minDate: getMindate })
        }
      }
    }).on('preselect', function (date1, date2) {
      isStartDateAddActive(a[i + 1], el, 'light-pick-focus');
      if (window.innerWidth < opts.mobilefriendly.breakpoint) {
        if (optsRange2ndInput.allowRepick) {
          if (isStartDate) {
            lpr[i / 2].ui.classList.add('litepicker-start-date')
          }
          else {
            lpr[i / 2].ui.classList.remove('litepicker-start-date')
          }
          var startDateEl = lpr[i / 2].ui.querySelector('.litepicker-mobile-date-from'),
            endDateEl = lpr[i / 2].ui.querySelector('.litepicker-mobile-date-to');
          isStartDateAddActive(endDateEl, startDateEl, 'active');
        }
      }
    }).on('mobilefriendly.show', function (el) {
      if (!el.classList.contains('lite-picker-range-2nd-start')) {
        setTimeout(function () {
          lpr[i / 2].gotoDate(lpr[i / 2].getEndDate())
        }, 0)
      }
    }).on('render', function (ui) {
      getDayOfTheWeek(el, i, a, lpr[i / 2]);

      let title = isStartDate ? el.getAttribute('header-text') : a[i + 1].getAttribute('header-text');

      if (window.innerWidth < opts.mobilefriendly.breakpoint) {

        let startDate = lpr[i / 2].getStartDate() ? GetFormattedDate(lpr[i / 2].getStartDate()) : 'dd/mm/yyyy',
          endDate = lpr[i / 2].getEndDate() ? GetFormattedDate(lpr[i / 2].getEndDate()) : 'dd/mm/yyyy';

        ui.querySelector('.container__months').insertAdjacentHTML(
          "afterbegin",
          `<div class="litepicker-mobile-header">
            <div class="litepicker-mobile-header--main">
              <div class="row row-0 align-items-center">
                <div class="col">
                  <div class="litepicker-mobile-header-title h3">${title}</div>
                </div>
                <div class="col-auto">
                  <button type="button" class="litepicker__close-action dropdown-close">
                    <img src=" ${FILE_PATH + ICON_CLOSE_NAME}" alt="">
                  </button>
                </div>
              </div>
            </div>
            <div class="litepicker-mobile-header-content">
              <div class="row row-8">
                <div class="col">
                  <div class="litepicker-mobile-date litepicker-mobile-date-from">
                    <div class="date">${startDate}</div>
                  </div>
                </div>
                <div class="col-auto dflex align-center">
                  -
                </div>
                <div class="col">
                  <div class="litepicker-mobile-date litepicker-mobile-date-to">
                    <div class="date">${endDate}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `);

        ui.querySelector('.litepicker__close-action').addEventListener('click', function () {
          lpr[i / 2].hide();
        });

        if (optsRange2ndInput.allowRepick) {

          startDate ? lpr[i / 2].ui.classList.add('litepicker-start-date') : lpr[i / 2].ui.classList.remove('litepicker-start-date');

          let startDateEl = lpr[i / 2].ui.querySelector('.litepicker-mobile-date-from'),
            endDateEl = lpr[i / 2].ui.querySelector('.litepicker-mobile-date-to');

          isStartDateAddActive(startDateEl, endDateEl, 'active');

          startDateEl.addEventListener('click', function () {
            a[i].dispatchEvent(new Event('click', { bubbles: true }))
          });

          endDateEl.addEventListener('click', function () {
            a[i + 1].dispatchEvent(new Event('click', { bubbles: true }))
          })
        }
      }
    });
    lpr.push(lpicker)
  }
});