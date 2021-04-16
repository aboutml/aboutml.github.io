$(function () {
    $(
        "#contactForm input,#contactForm textarea,#contactForm button"
    ).jqBootstrapValidation({
        preventSubmit: true,
        submitError: function ($form, event, errors) {
            // additional error messages or events
        },
        submitSuccess: function ($form, event) {
            event.preventDefault(); // prevent default submit behaviour
            // get values from FORM
            var firstName = $("input#firstName").val();
            var lastName = $("input#lastName").val();
            var email = $("input#email").val();
            if (firstName.indexOf(" ") >= 0) {
                firstName = firstName.split(" ").slice(0, -1).join(" ");
            }
            if (lastName.indexOf(" ") >= 0) {
                lastName = lastName.split(" ").slice(0, -1).join(" ");
            }
            $this = $("#sendMessageButton");
            $this.prop("disabled", true); // Disable submit button until AJAX call is complete to prevent duplicate messages
            $.ajax({
                url: "https://d6buibultk.execute-api.us-east-1.amazonaws.com/dev/payment-form",
                type: "POST",
                dataType: "json",
                crossDomain: true,
                data: JSON.stringify({
                    FirstName: firstName,
                    LastName: lastName,
                    Email: email,
                    DateTime: new Date().toISOString(),
                    TimezoneOffset: new Date().getTimezoneOffset()
                }),
                headers: { "X-API-KEY": "aMzdMGag8D5jn35BiGfeI6gBJ5lO63Uz6y4SuNOS" },
                cache: false,
                success: function () {
                    // Success message
                    $("#success").html("<div class='alert alert-success'>");
                    $("#success > .alert-success")
                        .html(
                            "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;"
                        )
                        .append("</button>");
                    $("#success > .alert-success").append(
                        "<strong>Your message has been sent. </strong>"
                    );
                    $("#success > .alert-success").append("</div>");
                    // clear all fields
                    $("#contactForm").trigger("reset");
                    // open modal dialogue
                    $('#paymentModal').modal('show');
                    gtag('event', 'click', {'event_category': 'button', 'event_label': 'payment_form_button_click'});
                },
                error: function () {
                    // Fail message
                    $("#success").html("<div class='alert alert-danger'>");
                    $("#success > .alert-danger")
                        .html(
                            "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;"
                        )
                        .append("</button>");
                    $("#success > .alert-danger").append(
                        $("<strong>").text(
                            "Sorry " +
                                firstName +
                                ", it seems that my mail server is not responding. Please try again later!"
                        )
                    );
                    $("#success > .alert-danger").append("</div>");
                    //clear all fields
                    $("#contactForm").trigger("reset");
                },
                complete: function () {
                    setTimeout(function () {
                        $this.prop("disabled", false); // Re-enable submit button when AJAX call is complete
                    }, 1000);
                },
            });
        },
        filter: function () {
            return $(this).is(":visible");
        },
    });

    $('a[data-toggle="tab"]').click(function (e) {
        e.preventDefault();
        $(this).tab("show");
    });
});

/*When clicking on Full hide fail/success boxes */
$("#firstName").focus(function () {
    $("#success").html("");
});
