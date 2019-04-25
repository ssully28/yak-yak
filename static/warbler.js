
const BASE_URL = "http://localhost:5000";

const $body = $("body");
console.log($body)

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