(function ($) {
    // "use strict";
    $(".nav-link").on("click", function () {
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });




    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();


    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('sticky-top shadow-sm');
        } else {
            $('.navbar').removeClass('sticky-top shadow-sm');
        }
    });

    //check form login
    $("#formLogin").validate({
        rules: {
            userLogin: "required",
            passwordLogin: "required",
        },
        messages: {
            userLogin: "Vui lòng điền vào tên đăng nhập!",
            passwordLogin: "Vui lòng điền vào mật khẩu!",

        },
        errorElement: "div",
        errorPlacement: function (error, element) {
            error.addClass("invalid-feedback");
            error.insertAfter(element);
        },
        highlight: function (element) {
            $(element).removeClass('is-valid').addClass('is-invalid');
        },
        unhighlight: function (element) {
            $(element).removeClass('is-invalid').addClass('is-valid');
        },
        submitHandler: function (form) {
            form.submit();
        },
    });

    //check form add food
    $("#formAddFood").validate({
        rules: {
            nameFood: "required",
            price: {
                required: true,
                digits: true,
                min:1000,
                max: 100000000
            },
            image: "required",
            description: "required",
        },
        messages: {
            nameFood: "Vui lòng nhập vào tên thức ăn/thức uống!",
            price: {
                required: "Vui lòng nhập vào giá!",
                digits: "Vui lòng nhập vào số!",
                min: "Nhập vào giá lớn hơn 1000!",
                max: "Nhập vào giá nhỏ hơn 100.000.000đ!"
            },
            image: "Vui lòng chọn hình ảnh!",
            description: "Vui lòng nhập vào mô tả!",

        },
        errorElement: "div",
        errorPlacement: function (error, element) {
            error.addClass("invalid-feedback");
            error.insertAfter(element);
        },
        highlight: function (element) {
            $(element).removeClass('is-valid').addClass('is-invalid');
        },
        unhighlight: function (element) {
            $(element).removeClass('is-invalid').addClass('is-valid');
        },
        submitHandler: function (form) {
            form.submit();
        },
    });

    //check form book table
    $("#formBookTable").validate({
        rules: {
            name: "required",
            phoneNumber: {
                required: true,
                digits: true,
                // matches: "[0-9]+",
                minlength: 10,
                maxlength: 11,
            },
            timeBook: "required",
        },
        messages: {
            name: "Vui lòng nhập vào họ và tên",
            phoneNumber: {
                required: "Vui lòng nhập vào số điện thoại!",
                digits: "Vui lòng nhập vào đúng cú pháp số điện thoại!",
                // matches: "Số điện thoại bắt đầu bằng 0",
                minlength: "Số điện thoại quá ngắn!",
                maxlength: "Số điện thoại quá dài",
            },
            timeBook: "Vui lòng chọn thời gian!",

        },
        errorElement: "div",
        errorPlacement: function (error, element) {
            error.addClass("invalid-feedback");
            error.insertAfter(element);
        },
        highlight: function (element) {
            $(element).removeClass('is-valid').addClass('is-invalid');
        },
        unhighlight: function (element) {
            $(element).removeClass('is-invalid').addClass('is-valid');
        },
        submitHandler: function (form) {
            form.submit();
        },
    });

    //check form book ship
    $("#formShip").validate({
        rules: {
            name: "required",
            phoneNumber: {
                required: true,
                digits: true,
                // matches: "[0-9]+",
                minlength: 10,
                maxlength: 11,
            },
            note: "required",
        },
        messages: {
            name: "Vui lòng nhập vào họ và tên!",
            phoneNumber: {
                required: "Vui lòng nhập vào số điện thoại!",
                digits: "Vui lòng nhập vào đúng cú pháp số điện thoại!",
                // matches: "Số điện thoại bắt đầu bằng 0",
                minlength: "Số điện thoại quá ngắn!",
                maxlength: "Số điện thoại quá dài",
            },
            note: "Vui lòng điền vào món gọi!",

        },
        errorElement: "div",
        errorPlacement: function (error, element) {
            error.addClass("invalid-feedback");
            error.insertAfter(element);
        },
        highlight: function (element) {
            $(element).removeClass('is-valid').addClass('is-invalid');
        },
        unhighlight: function (element) {
            $(element).removeClass('is-invalid').addClass('is-valid');
        },
        submitHandler: function (form) {
            form.submit();
        },
    });
    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";

    $(window).on("load resize", function () {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
                function () {
                    const $this = $(this);
                    $this.addClass(showClass);
                    $this.find($dropdownToggle).attr("aria-expanded", "true");
                    $this.find($dropdownMenu).addClass(showClass);
                },
                function () {
                    const $this = $(this);
                    $this.removeClass(showClass);
                    $this.find($dropdownToggle).attr("aria-expanded", "false");
                    $this.find($dropdownMenu).removeClass(showClass);
                }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        margin: 24,
        dots: true,
        loop: true,
        nav: false,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            }
        }
    });

})(jQuery);

