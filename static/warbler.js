
const BASE_URL = "http://localhost:5000";

const $body = $("body");

// Handle like/dislike via ajax:
$body.on("click", ".fa-heart", async function(evt) {
    evt.preventDefault();

    // grabbing the action from the grandparent:
    let action = $(this).parent().parent().attr("action");

    // make the post request:
    const response = await $.post(BASE_URL + action);

    // toggle the class to like/unlike:
    if (response.status === 'liked') {
        $(this).removeClass('far').addClass('fas');
    }
    else {
        $(this).removeClass('fas').addClass('far');
    }
    
});

$("#add-warble-form").on("submit", async function(evt) {
    evt.preventDefault();

    // Create ajax post:
    const response = await $.ajax({
        type: "POST",
        url: BASE_URL + '/messages/new',
        // need to serialize 'this' for post body:
        data: $(this).serialize(),
        // do a windows reload to close modal and
        // display new warbles
        success: function(data) {
            window.location.reload();
        },
        // To make wtforms CSRF check happy:
        headers: {
            "X-CSRFToken": "{{ form.csrf_token._value() }}"
        }
    })
    
})

$("#new-warble-btn").on("click", async function(evt) {
    evt.preventDefault();

    const response = await $.get(BASE_URL + '/messages/new');
    //x$("#add-warble-form").append(response.token);

    // response.form.csrf_token
    // response.form.text
    // response.form.errors [array]

    $("#add-warble-div").append(response.form.csrf_token);
    $text_element = $(response.form.text).attr("placeholder", "What's happening?").attr("class", "form-control").attr("rows", 3).attr("id", "warble-text");
    $("#add-warble-div").append($text_element);
    if (response.form.errors.length > 0) {
        let err_html = ''
        for (let err of response.form.errors) {
            err_html += `<span class="text-danger">${err}</span>`
        }
        $("#add-warble-div").append(err_html);
    }
    
})
