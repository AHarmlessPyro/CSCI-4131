let globalWordDictionary;

let passwordLengthMax = document.getElementById("passwordLength");
let wordLengthMax = document.getElementById("wordLength");
let wordLengthMin = 2;

passwordLengthMax.addEventListener('keyup', (event) => {
    if (event.code === "Enter" || event.keyCode === 13) {
        fillDiv();
    }
})

wordLengthMax.addEventListener('keyup', (event) => {
    if (event.code === "Enter" || event.keyCode === 13) {
        fillDiv();
    }
})

fetch('./dat/JSONFile.json')
    .then(
        function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                return;
            }

            // Examine the text in the response
            response.json().then(function (data) {
                globalWordDictionary = data;
            });
        }
    )
    .catch(function (err) {
        console.log('Fetch Error :-S', err);
    });

function fillDiv() {
    document.getElementById("wordListDiv").innerHTML = "";
    var wordListDiv = document.getElementById("wordListDiv");
    for (i = 0; i < 20; i++) {
        let words = figureOutWord(globalWordDictionary);
        let wordSpan =
            `<div class="fadebox">
                <span class="fadeInWord" style="animation-delay:${i * 300}ms;" id="textSpan${i}">
                    ${words}
                </span>
            </div>
            <br>`;
        wordListDiv.insertAdjacentHTML('beforeend', wordSpan);
        document.getElementById(`textSpan${i}`).addEventListener('click',
            // copy from element solution taken from http://jsfiddle.net/jdhenckel/km7prgv4/3
            // which was taken from a comment on stackoverflow :
            // (https://stackoverflow.com/questions/36639681/how-to-copy-text-from-a-div-to-clipboard/48020189#comment82602447_36639681)

            // from my understanding, copying from elements other than textareas is considered unsafe. So in order to perform copy,
            // some sort of copy event must be triggered. So a temporary copy event is attached, a copy event is triggered (and with
            // there being only one local and temporary copy event listener, only that gets triggered). Even there, once copied to a
            // "local clipboard", the default copy action needs to be stopped (via the prevent default method) which then triggers a
            // copying to the system/global clipboard from the "local clipboard".

            // this is a stupid amount of work for something as trivial as copy.
            (str) => {
                function listener(e) {
                    e.clipboardData.setData("text/html", str.target.innerHTML);
                    e.clipboardData.setData("text/plain", str.target.innerHTML);
                    e.preventDefault();
                }
                document.addEventListener("copy", listener);
                document.execCommand("copy");
                document.removeEventListener("copy", listener);
                document.getElementById("textPromptWord").innerHTML = str.target.innerHTML;
                document.getElementById("textPrompt").classList.remove("fadeOutPrompt");
                setTimeout(() => {
                    document.getElementById("textPrompt").classList.add("fadeOutPrompt");
                }, 1)
            });
    }
}

function figureOutWord(dictToUse) {
    let wordLengthCurr = 0;
    let word = "";
    while (wordLengthCurr < passwordLengthMax.value) {
        let wordLengthTemp = randLength(
            wordLengthMin, (((passwordLengthMax.value - wordLengthCurr) < wordLengthMax.value) ?
                (passwordLengthMax.value - wordLengthCurr) :
                wordLengthMax.value)
        );
        let wordT = getRandomWordFromDict(dictToUse, wordLengthTemp);
        if (wordT === "") {
            wordLengthCurr++;
        }
        wordLengthCurr += wordT.length;
        word += wordT + "-";
    }
    word = word.slice(0, word.length - 1);
    let inputSubs = document.getElementsByClassName("inputSub");
    let outputSubs = document.getElementsByClassName("outputSub");
    //console.log(inputSubs)
    for (var i in inputSubs) {
        if (!((inputSubs[i].value === "") || (outputSubs[i].value === "")) && inputSubs.hasOwnProperty(i)) {
            console.log("Word before " + word);
            word = word.replace(new RegExp(`${inputSubs[i].value}`,"g"), outputSubs[i].value);
            console.log("Word After " + word);
        }
    }
    return word;
}

function getRandomWordFromDict(dict, index) {
    try {
        let doDouble = !document.getElementById("preferDouble").checked;
        let simRandTot = dict["" + index].rep.length + dict["" + index].non_rep.length - 1;
        // let t = (randLength(0, simRandTot));
        // let c = t > dict["" + index].non_rep.length
        let doRepeatedWord = doDouble ? (randLength(0, 100) > 25 ? true : false) : ((randLength(0, simRandTot) > dict["" + index].non_rep.length));
        let dictIndex = doRepeatedWord ? dict["" + index].rep : dict["" + index].non_rep;
        let randItem = randLength(0, dictIndex.length - 1);
        if (index == NaN) {
            throw new EvalError("Index was not a number");
        }
        if (dictIndex[randItem] == undefined) {
            debugger;
        }
        return dictIndex[randItem];
    } catch (e) {
        console.log("Returning empty value");
        return dict[0].rep[0];
    }
}

function randLength(min, max) {
    if (max < min) {
        return NaN;
    }
    return (Math.floor(Math.random() * (max - min + 1) + min));
}