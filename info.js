async function postData(url = "", data = {}) {
    const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
    });
    return response.json();
}
const populateUsingGpt = (input) => {
    postData("/api", { input: input }).then((data) => {
        document.querySelector(".chats").innerHTML = document.querySelector(".chats").innerHTML + `<div class="card my-4 mx-2 ">
        <div class="card-body">
          <h5 class="card-title">Start Chats with Voice GPT</h5>
          <p class="card-text chats alert-info ">
          <div><strong>Query:</strong> ${input}</div>
          <div><strong>Voice GPT Response:</strong> ${data.message}</div>
          <hr>
          </p>
        </div>`

    });
}
let speech = true;
let globalTranscript;
window.SpeechRecognition = window.SpeechRecognition
    || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;

recognition.addEventListener('result', e => {
    const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')

    globalTranscript = transcript
});

start.addEventListener("click", () => {
    if (speech == true) {
        recognition.start();
        recognition.addEventListener('end', () => {
            console.log(globalTranscript)
            if (globalTranscript !== "") {
                populateUsingGpt(globalTranscript)
            }
            globalTranscript = ""
        });
    }
})