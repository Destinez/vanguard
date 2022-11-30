'use strict';

$(function indexNavFunctionality () {
  var $window = $(window);
  var $menu = $('.inner-nav');
  var $lastSelectedScroll = null;
  var $currentlySelectedLink = null;
  var $menuLinks = $menu.find('li a');
  var $mainHeader = $('.main-header');
  var $targetContent = $('.inner-nav-body');
  var $targetSections = $targetContent.find('section');

  var speed = 400;
  var shouldHandleScroll = true;
  var menuHeight = $menu.height();
  var isMobileView = window.innerWidth <= 980;
  var isMainHeaderSticky = $mainHeader.css('position') === 'fixed';
  var headerHeight = isMainHeaderSticky ? $mainHeader.outerHeight() : 0;
  var innerNavPosition = $menu.offset().top - headerHeight;

  init();

  function init() {
    $window.on('scroll', scrollHandler);
    $menuLinks.on('click', menuLinksClickHandler);

    // reinitialising the currently selected element and the sticky header calculations
    $window.scroll();
  }

  function scrollHandler() {
    var $this = $(this);
    var currentScroll = $this.scrollTop();

    if (!shouldHandleScroll) {
      return;
    }

    if (currentScroll >= innerNavPosition) {
      $menu.addClass('fixed');
      $menu.css('top', headerHeight+ 'px');
      $targetContent.css(
        'margin-top',
        $menu.css('height')
      );
    } else {
      $targetContent.css('margin-top', '0');
      $menu.removeClass('fixed');
    }

    $targetSections.each(function () {
      var $currentSection = $(this);
      var top = $currentSection.offset().top - headerHeight - (parseFloat($currentSection.css('padding-top')));
      var bottom = $currentSection.offset().top + $currentSection.outerHeight();

      if (currentScroll >= top && currentScroll <= bottom) {
        var $elementToActivate = $menu.find(
          'a[data-scroll="' + $currentSection.attr('id') + '"]'
        );

        if (!$elementToActivate.is($currentlySelectedLink)) {
          $currentlySelectedLink = $elementToActivate;
        }
      }
    });

    if (
      $currentlySelectedLink &&
      !$currentlySelectedLink.is($lastSelectedScroll)
    ) {
      $lastSelectedScroll = $currentlySelectedLink;
      $menuLinks.removeClass('active');
      $currentlySelectedLink.addClass('active');

      if (isMobileView && isMainHeaderSticky) {
        var scrollTo =
          $lastSelectedScroll.offset().top -
          window.pageYOffset +
          $menu.scrollTop() -
          parseFloat(headerHeight) -
          menuHeight / 2;

        $menu.animate(
          {
            scrollTop: Math.max(0, scrollTo),
          },
          100
        );
      }
    }
  }

  function menuLinksClickHandler(e) {
    e.preventDefault();

    var $this = $(this);
    var dataScroll = $this.data('scroll');
    var $target = $('#' + dataScroll);
    var targetPos = $target.offset().top - headerHeight - (parseFloat($target.css('padding-top')) / 2);;

    shouldHandleScroll = false;
    scrollTo(targetPos);
    $menuLinks.removeClass('active');
    $this.addClass('active');
  }

  function scrollTo (target) {
    $('html, body').animate(
      {
        scrollTop: target,
      },
      speed
    );

    setTimeout(function () {
      shouldHandleScroll = true;
      $window.scroll();
    }, speed + 100);
  }
});
