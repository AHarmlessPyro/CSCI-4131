var wordList = []
var count = 0;
var lastOccurence = 0;
var currList = wordList;
var placementElement = document.getElementById('wordlist'); //REPLACE ME
var inputElement = document.getElementById('inp'); //REPLACE ME

fetch('./converted.json').then((response) => {
    if (response.status != 200) {
        console.log("Error")
    } else {
        response.json().then((result) => {
            console.log(result);
            wordList = (result);
        });
    }
});

function search(regExString, min = 0, max = Infinity) {
    try {
        reg = new RegExp(`^${regExString}.+`);
        console.log(reg);
        if (inputReg == "") {
            console.log("full list")
            return wordList;
        } else {
            list = [];
            for (item = 0; item < wordList.length; item++) {
                const word = wordList[item];
                const truth = reg.test(word);
                if (truth && word.length > min && word.length < max) {
                    list.push(word);
                }
            }
            return list;
        }
    } catch (error) {
        console.log(error);
        console.log("Input Error, Trying again");
        return search(regExString.slice(0, regExString.length - 1));
    }
}

inputElement.addEventListener('input', (event) => {
    inputReg = document.getElementById('inp').value;
    out = (search(inputReg));
    placementElement.innerHTML = "";
    listOfElements = "";
    currList = out;
    console.log(`Starting at ${(new Date()).getTime()}`);

    render(0, out, placementElement);
    console.log(`Ending at ${(new Date()).getTime()}`);
})

window.addEventListener('wheel', (event) => {
    if ((new Date()).getTime() - lastOccurence > 200) {
        if (event.deltaY > 0) {
            console.log("Mouse went down");
            console.log(`Position : ${window.scrollY} at ${(new Date()).getTime()}`);
            lastOccurence = (new Date()).getTime();
            render(Math.min(count - 10, 0), currList, placementElement);
        } else {
            console.log("Mouse went up");
            console.log(`Position : ${window.scrollY} at ${(new Date()).getTime()}`);
            lastOccurence = (new Date()).getTime()
            render(count + 10, currList, placementElement);
        }
    }
});

function render(pos, list, element) {
    printList = ""
    if (pos >= list.length) {
        pos = list.length - 10 - 1;
    }
    if (pos < 0) {
        pos = 0;
    }
    count = pos;
    console.log("Position is " + count);
    for (i = pos; i < Math.min(pos + 10, list.length - 1); i++) {
        printList += `<div>${list[i]}<div>`;
    }
    element.innerHTML = "";
    element.insertAdjacentHTML('beforeend', printList);
}