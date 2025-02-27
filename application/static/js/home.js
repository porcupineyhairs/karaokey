
$( document ).ready(function() {
    // preventing modal from closing when backdrop is clicked
    $('#loader').modal({show: false})


    var file

    // capturing file on change
    $('#music').on('change', function(event) {
        $('#box-error').hide();
        file = event.target.files[0]
        if(file){
            $('#file-name').text(file.name)
        }
    });

    // hiding error if consent is accepted.
    $('#consent').on('change', function(event) {
        if($('#consent').is(":checked")){
            $('#consent-error').hide()
        } else {
            $('#consent-error').show()
        }
    });

    $('#upload').on('click', function(event) {
        $('#loader').modal('show');
        event.stopPropagation(); // stop executing futher events
        event.preventDefault(); // stop current event
        console.log("Upload Clicked")
        if(!$('#consent').is(":checked")){
            // showing consent error if consent is not clicked
            $('#consent-error').show();
            $('#loader').modal('hide');
        } else {
            $('#file-form').prop('disabled', true);
            $('#upload').attr("disabled", "disabled");
            // capturing form data
            var data = new FormData();
            data.append('music', file);
            // sending ajax request for separation
            $.ajax({
                url: '/separate',
                type: 'POST',
                data: data,
                cache: false,
                dataType: 'json',
                processData: false, // Stop's file process
                contentType: false, // Stop file processing
                success: function(data, textStatus, jqXHR)
                {
                    if(data.token) {
                        // redirect to the results if successfully separated
                        window.location.replace("/results");
                    }
                    if(data.error) {
                        // show error if separation fails
                        $('#file-form').prop('disabled', false);
                        $('#upload').removeAttr("disabled");
                        $('#loader').modal('hide');
                        $('#box-error').text(data.error)
                        $('#box-error').addClass("");
                        $('#box-error').show();
                    }
                },
                error: function(jqXHR, textStatus, errorThrown)
                {
                    if(data.error) {
                        // show error if separation fails
                        $('#file-form').prop('disabled', false);
                        $('#upload').removeAttr("disabled");
                        $('#loader').modal('hide');
                        $('#box-error').text(errorThrown);
                        $('#box-error').show();
                    }
                }
            });
        }
    });
});
