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
                min: 1000,
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

    //check form edit food
    $("#formEditFood").validate({
        rules: {
            nameFood: "required",
            price: {
                required: true,
                digits: true,
                min: 1000,
                max: 100000000
            },
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

    //add method check user name
    $.validator.addMethod("checkUserName", function (value, element) {
        return /^[A-Za-z][A-Za-z0-9]{5,15}$/.test(value);
    }, "Tên đăng nhập từ 6 - 15 kí tự và bắt đầu bằng chữ cái!")
    //add method check password
    $.validator.addMethod("checkPassword", function (value, element) {
        return /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{6,15}$/.test(value);
    }, "Mật khẩu từ 6 - 15 kí tự bao gồm chữ và số!")
    // //add method checkExists
    // $.validator.addMethod("checkExists", function (value, element) {
    //     var inputElem = $('#formAddStaff :input[name="userName"]'),
    //         data = { "userName": inputElem.val() };
    //     var check = true

    //     $.ajax(
    //         {
    //             type: "POST",
    //             url: "/admin/checkExists",
    //             dataType: "json",
    //             data: data,
    //             success: function (returnData) {
    //                 if (returnData !== true) {
    //                     return false;
    //                 }
    //                 else {
    //                     return true;
    //                 }
    //             },
    //             error: function (xhr, textStatus, errorThrown) {
    //                 alert('ajax loading error... ... ' + url + query);
    //                 return false;
    //             }
    //         });
    //     // return check;

    // }, 'Tên đăng nhập đã tồn tại, vui lòng chọn tên khác!');

    //check form edit food
    $("#formAddStaff").validate({
        rules: {
            name: "required",
            phoneNumber: {
                required: true,
                digits: true,
                minlength: 10,
                maxlength: 11,
            },
            userName: {
                required: true,
                checkUserName: true,
                remote: {
                    url: "/admin/checkExists",
                    type: "post",
                    data: {
                      userName: function() {
                        return $( "#userName" ).val();
                      }
                    }
                  }
                },
                password:
                {
                    required: true,
                    checkPassword: true
                },
                rePassword: {
                    required: true,
                    equalTo: "#password"
                },
                address: "required",
            },
            messages: {
                name: "Vui lòng nhập vào họ và tên nhân viên!",
                userName: {
                    required: "Vui lòng nhập vào tên đăng nhập cho nhân viên!",
                    remote: "Tên đăng nhập đã tồn tại, vui lòng chọn tên khác!"
                },
                password: {
                    required: "Vui lòng nhập vào mật khẩu nhân viên!",
                },
                rePassword: {
                    required: "Vui lòng nhập lại mật khẩu cho nhân viên!",
                    equalTo: "Mật khẩu nhập lại không đúng!"
                },
                address: "Vui lòng nhập vào địa chỉ cho nhân viên!",
                phoneNumber: {
                    required: "Vui lòng nhập vào số điện thoại!",
                    digits: "Vui lòng nhập vào đúng cú pháp số điện thoại!",
                    minlength: "Số điện thoại quá ngắn!",
                    maxlength: "Số điện thoại quá dài",
                },

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
                $(form).submit();
            },
        });

    //check form book table
    $("#formBookTable").validate({
        rules: {
            name: "required",
            phoneNumber: {
                required: true,
                digits: true,
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

