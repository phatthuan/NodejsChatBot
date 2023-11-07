
var sendForm = document.querySelector("#chatform"),
    textInput = document.querySelector(".chatbox"),
    chatList = document.querySelector(".chatlist"),
    userBubble = document.querySelectorAll(".userInput"),
    botBubble = document.querySelectorAll(".bot__output"),
    animateBotBubble = document.querySelectorAll(".bot__input--animation"),
    overview = document.querySelector(".chatbot__overview"),
    animationCounter = 1,
    animationBubbleDelay = 600,
    input,
    previousInput,
    chatbotButton = document.querySelector(".submit-button");
var possibleInput, questionAndAnswer
var reloadHistory = document.querySelector('#reloadHistory')
reloadHistory.addEventListener("click", async function (e) {
    e.preventDefault()
    var deleteUserInput = document.querySelectorAll("li.userInput");
    deleteUserInput.forEach(function (x) {
        x.remove();
    });
    var deleteChatOutput = document.querySelectorAll("li.bot__output.bot__output--failed")
    deleteChatOutput.forEach(function (x) {
        x.remove();
    })
    await axios.get('/history')
        .then(response => {
            questionAndAnswer = response.data.questionAndAnswer
        })
        .catch(error => {
            console.log(error)
        })
    function ReloadQuestion(question){
        let chatBubbleReload = document.createElement("li");
        chatBubbleReload.classList.add("userInput");
        chatBubbleReload.innerHTML = question
        chatList.appendChild(chatBubbleReload);
    }
    function ReloadAnswer(answer){
        let resultBubbleReload = document.createElement("li");
        resultBubbleReload.classList.add("bot__output");
        resultBubbleReload.classList.add("bot__output--failed");
        resultBubbleReload.innerHTML = answer;
        animateBotOutput();
        chatList.scrollTop = chatList.scrollHeight;
        animationCounter = 1;
        chatList.appendChild(resultBubbleReload);
    }
    for (let i = 0; i < questionAndAnswer.length; i++) {
        ReloadQuestion(questionAndAnswer[i].question)
        ReloadAnswer(questionAndAnswer[i].answer)
    }
})
async function sendQuestion(inputQuestion) {
    await axios.post('/', { question: inputQuestion }, {
        headers: { 'Content-Type': 'application/json' }
    })
        .then((response) => {
            possibleInput = response.data
        })
        .catch((error) => {
            console.log(error);
        });
}
sendForm.onkeydown = function (e) {
    if (e.keyCode == 13) {
        e.preventDefault();

        //No mix ups with upper and lowercases
        var input = textInput.value.toLowerCase();

        //Empty textarea fix
        if (input.length > 0) {
            createBubble(input)
        }
    }
};

sendForm.addEventListener("submit", function (e) {
    //so form doesnt submit page (no page refresh)
    e.preventDefault();

    //No mix ups with upper and lowercases
    var input = textInput.value.toLowerCase();

    //Empty textarea fix
    if (input.length > 0) {
        createBubble(input)
    }
}); //end of eventlistener

async function saveHistory(question, answer) {
    await axios.post('/save', { question, answer })
}

var createBubble = async function (input) {
    //create input bubble
    var chatBubble = document.createElement("li");
    chatBubble.classList.add("userInput");

    //adds input of textarea to chatbubble list item
    chatBubble.innerHTML = input;
    chatList.appendChild(chatBubble);
    await sendQuestion(input)
    if (typeof possibleInput === 'undefined' || possibleInput == '') {
        possibleInput = "Xin lỗi, tôi không hiểu ý bạn"
        printResult(possibleInput)
    } else {
        printResult(possibleInput)
    }
    saveHistory(input, possibleInput)
};


function printResult(result) {
    // animationCounter = 1;

    //create response bubble
    let resultBubble = document.createElement("li");

    resultBubble.classList.add("bot__output");
    resultBubble.classList.add("bot__output--failed");

    //Add text to resultBubble
    resultBubble.innerHTML = result; //adds input of textarea to chatbubble list item

    //add list item to chatlist
    chatList.appendChild(resultBubble); //adds chatBubble to chatlist

    animateBotOutput();

    // reset text area input
    textInput.value = "";

    //Sets chatlist scroll to bottom
    chatList.scrollTop = chatList.scrollHeight;

    animationCounter = 1;
}

//change to SCSS loop
function animateBotOutput() {
    chatList.lastElementChild.style.animationDelay =
        animationCounter * animationBubbleDelay + "ms";
    animationCounter++;
    chatList.lastElementChild.style.animationPlayState = "running";
}
