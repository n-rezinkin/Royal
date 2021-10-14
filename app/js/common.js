var form_files = document.querySelectorAll('.form-file');
Array.prototype.forEach.call(form_files, function(wrap) {
  var input = wrap.getElementsByClassName('form-file__input')[0],
    span = wrap.getElementsByClassName('form-file__files')[0],
    spanVal = span.innerHTML;

  input.addEventListener('change', function(e) {
    var fileName = '';
    if (this.files && this.files.length > 1)
      fileName = 'Selected files: ' + this.files.length;
    else
      fileName = e.target.value.split('\\').pop();

    if (fileName) {
      span.innerHTML = fileName;
      wrap.classList.add('selected');
    } else {
      span.innerHTML = spanVal;
      wrap.classList.remove('selected');
    }
  });
});

jQuery(document).ready(function($) {

  var scrollWidth = window.innerWidth - document.documentElement.clientWidth;

  $('img, a').on('dragstart', function(event) {
    event.preventDefault();
  });

  function fixHeader() {
    if ($(this).scrollTop() > 0) $('.header__wrapper').addClass('_fixed');
    else $('.header__wrapper').removeClass('_fixed');
  }
  $(window).on('load scroll', function() {
    fixHeader();
  });

  $('select').each(function() {
    var select = $(this),
      placeholder = select.attr('data-placeholder');

    if (!select.attr('multiple') && placeholder) {
      select.prepend('<option selected disabled>' + placeholder + '</option>');
    }

    select.SumoSelect({
      placeholder: (placeholder) ? placeholder : 'Select items',
    });
  });

  $('.js-reg-form').submit(function() {
    var form = $(this);
    var formData = new FormData(form[0]);
    var btn = form.find('button');

    if (form.find('[name="pass"]').length > 0 && form.find('[name="pass-2"]').length > 0) {
      if (form.find('[name="pass"]').val() != form.find('[name="pass-2"]').val()) {
        alert('Password mismatch!')
        return false;
      }
    }

    $.ajax({
      url: 'php/mysql.php',
      type: 'POST',
      data: formData,
      contentType: false,
      processData: false,
      beforeSend: function(data) {
        btn.prop('disabled', true);
      },
      success: function(data) {
        window.location.href = "thanks.html";
        form.trigger("reset");
        btn.prop('disabled', false);
      },
    });

    return false;
  });

  // Sliders

  new Swiper('.gallery-slider', {
    effect: 'coverflow',
    loop: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflowEffect: {
      rotate: 0,
      stretch: 200,
      depth: 120,
      modifier: 2,
      slideShadows: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction',
      renderFraction: function(currentClass, totalClass) {
        return '<span class="' + currentClass + '"></span> From <span class="' + totalClass + '"></span>';
      }
    },
    breakpoints: {
      1539: {
				coverflowEffect: {
		      rotate: 0,
		      stretch: 170,
		      depth: 120,
		      modifier: 2,
		      slideShadows: true,
		    },
      },
			767: {
				coverflowEffect: {
		      rotate: 0,
		      stretch: 120,
		      depth: 120,
		      modifier: 2,
		      slideShadows: true,
		    },
			}
    }
  });

	new Swiper('.reviews-slider', {
    effect: 'coverflow',
    loop: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    watchSlidesProgress: true,
    watchSlidesVisibility: true,
    coverflowEffect: {
      rotate: 0,
      stretch: -115,
      depth: 380,
      modifier: 2,
      slideShadows: false,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction',
      renderFraction: function(currentClass, totalClass) {
        return '<span class="' + currentClass + '"></span> From <span class="' + totalClass + '"></span>';
      }
    },
    breakpoints: {
      1539: {
				coverflowEffect: {
					rotate: 0,
		      stretch: 0,
		      depth: 380,
		      modifier: 2,
		      slideShadows: false,
		    },
      },
			1039: {
				coverflowEffect: {
					rotate: 0,
		      stretch: 115,
		      depth: 380,
		      modifier: 2,
		      slideShadows: false,
		    },
			},
			767: {
				coverflowEffect: {
					rotate: 0,
		      stretch: -40,
		      depth: 120,
		      modifier: 2,
		      slideShadows: false,
		    },
			}
    }
  });

  // Sliders END

	$('#page').append('<div id="page__tooltip" class="content"></div>');
	$("[data-tooltip]").mouseenter(function (e) {
		var html = $(this).attr("data-tooltip");
		var top = $(this).offset().top + $(this).outerHeight();
		var left = $(this).offset().left + $(this).outerWidth();
		var width = $('#page__tooltip').outerWidth();

		if($(window).width() - left < width) left = left - $(this).outerWidth() - width;

		$("#page__tooltip").text(html).css({
			"top": top,
			"left": left
		}).addClass('_show');
	}).mouseleave(function () {
		$("#page__tooltip").removeClass('_show');
	});

  $('.header__toggle').click(function() {
    $(this).toggleClass('active');
    $('.header__menu').toggleClass('_show');
  });

	$('.header__user-toggle').click(function() {
    $('.header__user-wrap').toggleClass('_show');
	});

  $('.search-form__btn').click(function() {
    var wrap = $('.search-form');
    var input = wrap.find('.form-field');

    if (!wrap.hasClass('active')) {

      wrap.addClass('active');

      input.focus().focusout(function() {
        wrap.removeClass('active');
        input.val('');
      });

    }
  });

  // Services select

  var $serviceSelect_1 = $('select[name="services-1[]"]');
  var $serviceSelect_2 = $('select[name="services-2[]"]');
  var servicesJson;

  function servicesSelectInit() {
    var serviceSelect_1 = $serviceSelect_1[0].sumo;
    var serviceSelect_2 = $serviceSelect_2[0].sumo;

    serviceSelect_2.disable();

    $.ajax({
      url: '/json/services.json',
      type: 'post',
      dataType: 'json',
      success: function(data) {
        servicesJson = data;

        var options_arr = [];
        $.each(servicesJson, function(index, option) {
          if ($.inArray(option.service, options_arr) == -1) {
            options_arr.push(option.service);
            serviceSelect_1.add(option.service);
          }
        });
      },
      error: function(data) {
        console.log('Error ajax loading!');
      }
    });

    $serviceSelect_1.on('change', function() {
      for (var i = $serviceSelect_2.find('option').length; i >= 1; i--) {
        serviceSelect_2.remove(i - 1);
      }

      $.each($serviceSelect_1.val(), function(index, service) {
        var options_arr = [];
        $.each(servicesJson, function(index, option) {
          if ($.inArray(option.subservice, options_arr) == -1 && option.service == service) {
            options_arr.push(option.subservice);
            serviceSelect_2.add(option.subservice);
          }
        });
      });

      if ($serviceSelect_1.val()) {
        serviceSelect_2.enable();
        serviceSelect_2.selectAll();
      } else {
        serviceSelect_2.disable();
      }
    })
  }
  if ($serviceSelect_1.length > 0 && $serviceSelect_2.length > 0) servicesSelectInit();

  // Services select END

  $('.js-services-more').each(function() {
    var btn = $(this);
    var text = btn.text();
    var textClose = btn.attr('data-close');
    btn.click(function() {
      $('.services__grid').toggleClass('active');
      if ($('.services__grid').hasClass('active')) btn.text(textClose);
      else btn.text(text);
    });
  });

	$('.faq-item__btn').click(function() {
		$(this).toggleClass('active');
		$(this).siblings('.faq-item__hidden').slideToggle();
	});

	$('.acc__aside-toggle').click(function() {
		$(this).find('.sandwich').toggleClass('active');
		$(this).closest('.acc__aside').toggleClass('_show');
		if ( window.matchMedia('(max-width: 575px)').matches ) {
			$(this).siblings('.acc__aside-wrap').slideToggle();
		}
	});

	$('.acc-company__main .edit-btn').click(function() {
		$(this).closest('.acc-company__main').toggleClass('_show');
	});

	$('.acc-company__time .edit-btn').click(function() {
		var wrap = $(this).closest('.acc-company__time');

		wrap.toggleClass('_show');

		if(wrap.hasClass('_show')) wrap.find('input').prop('disabled', false);
		else wrap.find('input').prop('disabled', true);
	});

});
