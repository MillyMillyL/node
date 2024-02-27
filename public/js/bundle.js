require("@babel/polyfill");
var $cxWVk$axios = require("axios");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

/* eslint-disable no-undef */ 
const $b5876314e451e5db$export$596d806903d1f59e = async (email, password)=>{
    try {
        const res = await (0, ($parcel$interopDefault($cxWVk$axios)))({
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


/* eslint-disable no-undef */ /* eslint-disable no-unused-vars */ const $7590def070dfa4b3$export$4c5dd147b21b9176 = (locations)=>{
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


const $41688f6a8bd7bd47$var$locations = JSON.parse(document.getElementById("map").dataset.locations);
document.querySelector(".form").addEventListener("submit", (e)=>{
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    (0, $b5876314e451e5db$export$596d806903d1f59e)(email, password);
});


//# sourceMappingURL=bundle.js.map
