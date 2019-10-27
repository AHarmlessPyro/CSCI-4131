/// Misc Region ///

function clamp(num, clamp) {
    if (num < clamp) {
        return num;
    } return clamp;
}

function formatDate(date) {
    var d = date,
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function randomString(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function NatoToKey(NatoKey) {
    key = "";
    NatoKey.forEach(element => {
        key += keyInfo[element];
    });
    return key;
}

function keyToNato(key, dict) {
    let val = [];
    for (let i = 0; i < key.length; i++) {
        val.push(dict[key.charAt(i)]);
    }
    return val;
}

/// Startup Region ///
const SIZEOFVALUES = 10;

var map;
var infowindows = [];
var markers = [];
var circles = [];

var workingSetPos = [];
var workingSet = [];
var workingSetPromises = [];
var BasicHeader;

var bearerToken;
var cityInfo;
var keyInfo;


function initMap() {
    map = new google.maps.Map(document.getElementById('mapsDiv'), {
        center: { lat: 39.83334, lng: -98.58334 },
        gestureHandling: 'auto',
        zoomControl: 'false',
        zoom: 8
    });
    let southWest = new google.maps.LatLng(24.9493, -125.0011);
    let northEast = new google.maps.LatLng(49.5904, -66.9326);
    let bounds = new google.maps.LatLngBounds(southWest, northEast);
    map.fitBounds(bounds);
}

/// Further Work ///

window.onload = function () {
    fetch('./data/dat.json')
        .then(response => {
            response.json()
                .then(data => { cityInfo = data; })
                .then(() => {
                    fetch('./data/keyMap.json')
                        .then(response => {
                            response.json()
                                .then(data => { keyInfo = data; })
                                .then(() => {
                                    let text = `Basic ${btoa(`${NatoToKey(consumerKey)}:${NatoToKey(consumerSecret)}`)}`
                                    fetch("https://evening-badlands-84665.herokuapp.com/https://api.twitter.com/oauth2/token", {
                                        method: 'POST',
                                        headers: {
                                            'Authorization': text,
                                            'Content-Type': `application/x-www-form-urlencoded;charset=UTF-8`,
                                            'Accept-Encoding': 'gzip'
                                        },
                                        body: 'grant_type=client_credentials'
                                    }, error => { console.log(error); })
                                        .then(response => {
                                            response.json()
                                                .then(dat => {
                                                    bearerToken = dat.access_token;
                                                    createMap();
                                                });
                                        }, error => { console.log(error); })
                                }, error => { console.log(error); });
                        })
                });
        })
}

function mapExtras_Neue(city) {
    let tmp = city.data;
    let text = '<div class="content">';
    if (tmp.length > 0) {
        for (let element in tmp) {
            text += createPopUp(tmp[element].text ? tmp[element].text : tmp[element].retweeted_status.text, `twitter.com/text/status/${tmp[element].id_str}`, `twitter.com/i/user/${tmp[element].user.id}`, tmp[element].user.profile_image_url);
        };
    } else { 
        text+=`Nothing Here !`
    }
    let infowindow = new google.maps.InfoWindow({
        content: text
    });

    let marker = new google.maps.Marker({
        position: city.center,
        map: map,
        title: city.city
    });

    let cityCircle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        center: city.center,
        radius: clamp(Math.log(Math.pow(city.data.length, 2)), 300) * 10000
    });

    //console.log(`For ${city.data.length} objects, the size is ${clamp(Math.log(Math.pow(city.data.length, 2)), 300) * 10000} when it should be ${Math.log(Math.pow(city.data.length, 2)) * 10000} `)

    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });

    markers.push(marker);
    infowindows.push(infowindow);
    circles.push(cityCircle);

}

function fetchEverything() {
    while (workingSetPos.length < SIZEOFVALUES) {
        let temp = Math.floor(Math.random() * cityInfo.length);
        if (!workingSetPos.includes(temp)) {
            workingSetPos.push(temp);
        } else {
            continue;
        }
    }
    for (let temp = 0; temp < workingSetPos.length; temp++) {
        let date = new Date();
        date.setDate(date.getDate() - 1);
        fetch(`https://evening-badlands-84665.herokuapp.com/https://api.twitter.com/1.1/search/tweets.json?q=${document.getElementById('topicBox').value}&geocode=${cityInfo[temp].center.lat},${cityInfo[temp].center.lng},${Math.ceil(Math.sqrt(cityInfo[temp]["city size in km"]))}km&since=${formatDate(date)}&result_type=recent&count=100`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${bearerToken}`,
                    'Accept-Encoding': 'gzip',
                    'x-requested-with': 'localhost'
                }
            })
            .then(
                response => {
                    response.json()
                        .then(dat => {
                            let obj = {
                                "center": {
                                    "lat": cityInfo[workingSetPos[temp]].center.lat,
                                    "lng": cityInfo[workingSetPos[temp]].center.lng
                                },
                                "city": cityInfo[workingSetPos[temp]].city,
                                "city size in km": cityInfo[workingSetPos[temp]]["city size in km"],
                                "data": dat.statuses
                            };
                            workingSet.push(obj);
                            mapExtras_Neue(obj);
                        }
                        )
                }, (error) => { console.log(error); }
            );
    }
};

function createMap() {
    let createScript = document.createElement('script');
    createScript.src = `https://maps.googleapis.com/maps/api/js?key=${
        NatoToKey(keyFakeGoogle)}&callback=initMap`;
    createScript.defer = true;
    document.body.insertAdjacentElement("beforeend", createScript);
};

function createPopUp(text, url, user, image) {
    var subcontent =
        `<div class = "subcontent" style="display:grid;grid-template-columns:15% 85%;">` +
        `<a href="${'https://' + user}">
            <div class="profile-image" style="background-image:url(${image})"> </div>
        </a>` +
        `<a href="${'https://' + url}">
            <div>${text}</div>
        </a>` +
        `</div>`;
    return subcontent;
}


/// A lot of extra information ///
const keyFakeGoogle = [
    "Alpha",
    "India",
    "zulu",
    "alpha",
    "Sierra",
    "yankee",
    "Delta",
    "kilo",
    "Quebec",
    "Underscore",
    "Zero",
    "Underscore",
    "Kilo",
    "hotel",
    "X-ray",
    "India",
    "victor",
    "foxtrot",
    "Whiskey",
    "Mike",
    "Sierra",
    "papa",
    "hotel",
    "Juliett",
    "echo",
    "romeo",
    "India",
    "november",
    "Victor",
    "Dash",
    "quebec",
    "mike",
    "Foxtrot",
    "Seven",
    "Zero",
    "Six",
    "Kilo",
    "Hotel",
    "India"
]
const consumerKey = [
    'quebec',
    'Zulu',
    'india',
    'tango',
    'november',
    'Sierra',
    'Kilo',
    'bravo',
    'papa',
    'lima',
    'Victor',
    'Oscar',
    'Nine',
    'Oscar',
    'Uniform',
    'Sierra',
    'delta',
    'Zulu',
    'quebec',
    'Six',
    'yankee',
    'tango',
    'Delta',
    'oscar',
    'Papa']
const consumerSecret = [
    'Alpha',
    'Uniform',
    'Charlie',
    'november',
    'lima',
    'bravo',
    'Seven',
    'Charlie',
    'Sierra',
    'Lima',
    'Sierra',
    'Victor',
    'November',
    'victor',
    'x-ray',
    'Eight',
    'bravo',
    'hotel',
    'Sierra',
    'alpha',
    'lima',
    'charlie',
    'Echo',
    'Seven',
    'whiskey',
    'Papa',
    'yankee',
    'Lima',
    'Five',
    'Yankee',
    'Charlie',
    'Yankee',
    'Four',
    'delta',
    'Eight',
    'delta',
    'Tango',
    'lima',
    'whiskey',
    'whiskey',
    'november',
    'Zero',
    'whiskey',
    'alpha',
    'Seven',
    'sierra',
    'zulu',
    'One',
    'delta',
    'delta']
const accessToken = [
    'Seven',
    'Three',
    'Eight',
    'Five',
    'Three',
    'Five',
    'Two',
    'Zero',
    'Six',
    'One',
    'Nine',
    'Zero',
    'Two',
    'One',
    'One',
    'Zero',
    'Seven',
    'Two',
    'Dash',
    'hotel',
    'Zulu',
    'whiskey',
    'Five',
    'Zero',
    'bravo',
    'delta',
    'oscar',
    'Sierra',
    'whiskey',
    'Echo',
    'Yankee',
    'alpha',
    'Mike',
    'india',
    'india',
    'sierra',
    'delta',
    'delta',
    'Uniform',
    'papa',
    'papa',
    'Yankee',
    'echo',
    'Seven',
    'whiskey',
    'Six',
    'whiskey',
    'Papa',
    'mike',
    'Alpha']
const tokenSecret = [
    'One',
    'One',
    'Zulu',
    'Foxtrot',
    'Lima',
    'hotel',
    'Alpha',
    'Eight',
    'uniform',
    'whiskey',
    'Hotel',
    'Kilo',
    'romeo',
    'alpha',
    'Sierra',
    'Papa',
    'Alpha',
    'papa',
    'Uniform',
    'whiskey',
    'november',
    'Mike',
    'hotel',
    'kilo',
    'alpha',
    'Echo',
    'juliett',
    'lima',
    'mike',
    'lima',
    'Tango',
    'Nine',
    'romeo',
    'Alpha',
    'oscar',
    'November',
    'Zulu',
    'quebec',
    'One',
    'yankee',
    'Seven',
    'foxtrot',
    'Papa',
    'foxtrot',
    'Zero']
