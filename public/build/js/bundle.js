require("@babel/polyfill");
var $ghRSA$axios = require("axios");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

/* eslint-disable no-undef */ 
const $70af9284e599e604$export$596d806903d1f59e = async (email, password)=>{
    try {
        const res = await (0, ($parcel$interopDefault($ghRSA$axios)))({
            method: "POST",
            url: "http://127.0.0.1:3000/api/v1/users/login",
            data: {
                email: email,
                password: password
            }
        });
        if (res.data.status === "success") {
            alert("Logged in successfully");
            window.setTimeout(()=>{
                location.assign("/");
            }, 1500);
        }
    } catch (error) {
        alert(error.response.data.message);
    }
};


/* eslint-disable no-undef */ /* eslint-disable no-unused-vars */ const $f60945d37f8e594c$export$4c5dd147b21b9176 = (locations)=>{
    mapboxgl.accessToken = "pk.eyJ1IjoibW1sbG1tIiwiYSI6ImNsc3oybGN1czBsM2wyb21uNm1yY3p4bGcifQ.aFAbWIHZ30OxWryyQghicg";
    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mmllmm/clsz83voc01es01p64lnedg60",
        scrollZoom: false
    });
    const bounds = new mapboxgl.LngLatBounds();
    locations.forEach((loc)=>{
        // create marker
        const el = document.createElement("div");
        el.className = "marker";
        //add marker
        new mapboxgl.Marker({
            element: el,
            anchor: "bottom"
        }).setLngLat(loc.coordinates).addTo(map);
        //add popup
        new mapboxgl.Popup({
            offset: 30
        }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`).addTo(map);
        //extend map bounds to include current location
        bounds.extend(loc.coordinates);
    });
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });
};


console.log("hello from parcel");
//DOM elements
const $d0f7ce18c37ad6f6$var$mapBox = document.getElementById("map");
const $d0f7ce18c37ad6f6$var$loginForm = document.querySelector(".form");
//values
const $d0f7ce18c37ad6f6$var$email = document.getElementById("email").value;
const $d0f7ce18c37ad6f6$var$password = document.getElementById("password").value;
//delegation
if ($d0f7ce18c37ad6f6$var$loginForm) $d0f7ce18c37ad6f6$var$loginForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    (0, $70af9284e599e604$export$596d806903d1f59e)($d0f7ce18c37ad6f6$var$email, $d0f7ce18c37ad6f6$var$password);
});
if ($d0f7ce18c37ad6f6$var$mapBox) {
    const locations = JSON.parse($d0f7ce18c37ad6f6$var$mapBox.dataset.locations);
    (0, $f60945d37f8e594c$export$4c5dd147b21b9176)(locations);
}


//# sourceMappingURL=bundle.js.map
