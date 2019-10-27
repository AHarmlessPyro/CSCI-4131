// var N2K = {
//     'alpha': 'a',
//     'bravo': 'b',
//     'charlie': 'c',
//     'delta': 'd',
//     'echo': 'e',
//     'foxtrot': 'f',
//     'golf': 'g',
//     'hotel': 'h',
//     'india': 'i',
//     'juliett': 'j',
//     'kilo': 'k',
//     'lima': 'l',
//     'mike': 'm',
//     'november': 'n',
//     'oscar': 'o',
//     'papa': 'p',
//     'quebec': 'q',
//     'romeo': 'r',
//     'sierra': 's',
//     'tango': 't',
//     'uniform': 'u',
//     'victor': 'v',
//     'whiskey': 'w',
//     'x-ray': 'x',
//     'yankee': 'y',
//     'zulu': 'z',
//     'Alpha': 'A',
//     'Bravo': 'B',
//     'Charlie': 'C',
//     'Delta': 'D',
//     'Echo': 'E',
//     'Foxtrot': 'F',
//     'Golf': 'G',
//     'Hotel': 'H',
//     'India': 'I',
//     'Juliett': 'J',
//     'Kilo': 'K',
//     'Lima': 'L',
//     'Mike': 'M',
//     'November': 'N',
//     'Oscar': 'O',
//     'Papa': 'P',
//     'Quebec': 'Q',
//     'Romeo': 'R',
//     'Sierra': 'S',
//     'Tango': 'T',
//     'Uniform': 'U',
//     'Victor': 'V',
//     'Whiskey': 'W',
//     'X-ray': 'X',
//     'Yankee': 'Y',
//     'Zulu': 'Z',
//     'One': '1',
//     'Two': '2',
//     'Three': '3',
//     'Four': '4',
//     'Five': '5',
//     'Six': '6',
//     'Seven': '7',
//     'Eight': '8',
//     'Nine': '9',
//     'Zero': '0',
//     'Underscore': '_',
//     'Dash': '-'
// };

// var K2N = {
//     'a': 'alpha',
//     'b': 'bravo',
//     'c': 'charlie',
//     'd': 'delta',
//     'e': 'echo',
//     'f': 'foxtrot',
//     'g': 'golf',
//     'h': 'hotel',
//     'i': 'india',
//     'j': 'juliett',
//     'k': 'kilo',
//     'l': 'lima',
//     'm': 'mike',
//     'n': 'november',
//     'o': 'oscar',
//     'p': 'papa',
//     'q': 'quebec',
//     'r': 'romeo',
//     's': 'sierra',
//     't': 'tango',
//     'u': 'uniform',
//     'v': 'victor',
//     'w': 'whiskey',
//     'x': 'x-ray',
//     'y': 'yankee',
//     'z': 'zulu',
//     'A': 'Alpha',
//     'B': 'Bravo',
//     'C': 'Charlie',
//     'D': 'Delta',
//     'E': 'Echo',
//     'F': 'Foxtrot',
//     'G': 'Golf',
//     'H': 'Hotel',
//     'I': 'India',
//     'J': 'Juliett',
//     'K': 'Kilo',
//     'L': 'Lima',
//     'M': 'Mike',
//     'N': 'November',
//     'O': 'Oscar',
//     'P': 'Papa',
//     'Q': 'Quebec',
//     'R': 'Romeo',
//     'S': 'Sierra',
//     'T': 'Tango',
//     'U': 'Uniform',
//     'V': 'Victor',
//     'W': 'Whiskey',
//     'X': 'X-ray',
//     'Y': 'Yankee',
//     'Z': 'Zulu',
//     '1': 'One',
//     '2': 'Two',
//     '3': 'Three',
//     '4': 'Four',
//     '5': 'Five',
//     '6': 'Six',
//     '7': 'Seven',
//     '8': 'Eight',
//     '9': 'Nine',
//     '0': 'Zero',
//     '_': 'Underscore',
//     '-': 'Dash'
// }
// console.log(keyToNato('11ZFLhA8uwHKraSPApUwnMhkaEjlmlT9rAoNZq1y7fPf0',K2N));

// function keyToNato(key, dict) {
//     let val = [];
//     for (let i = 0; i < key.length; i++) {
//         val.push(dict[key.charAt(i)]);
//     }
//     return val;
// }

try {
    var hmacText = `GET&https://api.twitter.com/1.1/search/tweets.json&` + 
    escape(`oauth_consumer_key=${'qZitnSKbplVO9OUSdZq6ytDoP'}&oauth_nonce=${'kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg'}&oauth_signature_method=${'HMAC-SHA1'}&oauth_timestamp=${Date.now()}&oauth_token=${'738535206190211072-hZw50bdoSwEYaMiisddUppYe7w6wPmA'}&oauth_version=1.0`);
    var hmacTextType = "TEXT";
    var hmacKeyInput = key;
    var hmacKeyInputType = "TEXT";
    var hmacVariant = "SHA-1";
    var hmacOutputType = "B64";
    var hmacObj = new jsSHA(
        hmacVariant.options[hmacVariant.selectedIndex].value,
        hmacTextType.options[hmacTextType.selectedIndex].value
    );
    hmacObj.setHMACKey(
        hmacKeyInput.value,
        hmacKeyInputType.options[hmacKeyInputType.selectedIndex].value
    );
    hmacObj.update(hmacText.value);

    return hmacObj.getHMAC(hmacOutputType.options[hmacOutputType.selectedIndex].value);
} catch (e) {
    return e.message;
}