
const BASE_URL = "http://localhost:5000";

const $body = $("body");
const $ac = $("#autocomplete");
const $dmTo = $("#dm-to");
const $dmDiv = $("#direct-message-div");

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

/*********************************** DIRECTMESSAGE  */
// direct message form : 
$("#direct-message-btn").on("click", async function(evt) {
    evt.preventDefault();
    
    const response = await $.get(BASE_URL + '/directmessage/new');

    //x$("#add-warble-form").append(response.token);

    // response.form.csrf_token
    // response.form.text
    // response.form.errors [array]

    // response.form.text: "<textarea id="text" name="text" required></textarea>"
    // response.form.to_user: "<input id="to_user" name="to_user" required type="text" value="">"

    $dmDiv.empty();
    $dmDiv.append(response.form.csrf_token);
    // TO USER and Auto complete
    
    $to_element = $(response.form.to_user).attr("data-toggle", "dropdown").attr("placeholder", "To...").attr("class", "form-control").attr("type", "search");
    $dmDiv.append($to_element);

    // Then text area
    $text_element = $(response.form.text).attr("placeholder", "What would you like to say?").attr("class", "form-control").attr("rows", 5).attr("cols", 30).attr("id", "dm-message");

    $dmDiv.append($text_element);
    
    
})


$("#direct-message-form").on("submit", async function(evt) {
    evt.preventDefault();


    // Create ajax post:
    const response = await $.ajax({
        type: "POST",
        url: BASE_URL + '/directmessage/new',
        
        // need to serialize 'this' for post body:
        data: $(this).serialize(),
        
        // To make wtforms CSRF check happy:
        headers: {
            "X-CSRFToken": "{{ form.csrf_token._value() }}"
        }
    })

    console.log(response);
    // Display any errors:
    if (response.form.user_error) {
        let err_html = `<span class="text-danger">${response.form.user_error}</span>`;
        $dmDiv.append(err_html);
    }
    else {
        window.location.reload();
    }
    
    
})



/*********************************** AUTOCOMPLETE  */
// Auto complete : Typing regular characters
$dmTo.on("keypress", async function(evt) {

    // Grab the text typed
    let text = $(this).val() + evt.key;
    
    // Grab the array of autocompleted suggestions
    let response = await $.get(`${BASE_URL}/autocomplete`, {subword:text});
    updateAutoCompleteUI(response.autocomplete);

});

// Just for backspace
$dmTo.on("keydown", async function(evt) {
    if (evt.keyCode === 8) {
        let text = $(this).val().slice(0,-1);
        
        // Only show suggestions if the text field is not empty
        if (text.length > 0) { 
            // Grab the array of autocompleted suggestions
            let response = await $.get(`${BASE_URL}/autocomplete`, {subword:text});
            updateAutoCompleteUI(response.autocomplete);
        } else {
            $ac.empty();
        }
    }
})

// Updates the autocomplete UI with an array of usernames
function updateAutoCompleteUI(usernamesArray) {
    $ac.empty();
    for (let username of usernamesArray) {
        let autoForm = $(`<a class="dropdown-item">${username}</a>`);
        $ac.append(autoForm);
    };
}

// Selection from the autocomplete
$ac.on("click", ".dropdown-item", function(evt) {
    evt.preventDefault();
    let text = $(this).text();
    $dmTo.val(text);
})
    
