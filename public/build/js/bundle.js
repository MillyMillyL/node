import "@babel/polyfill";
import $g3JMS$axios from "axios";

/* eslint-disable no-undef */ 
const $5b1f850b9f4b88b3$export$596d806903d1f59e = async (email, password)=>{
    try {
        const res = await (0, $g3JMS$axios)({
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


/* eslint-disable no-undef */ /* eslint-disable no-unused-vars */ const $b0d576efe2e551a0$export$4c5dd147b21b9176 = (locations)=>{
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



//DOM elements
const $3f924d562161b148$var$mapBox = document.getElementById("map");
const $3f924d562161b148$var$loginForm = document.querySelector(".form");
//values
const $3f924d562161b148$var$email = document.getElementById("email").value;
const $3f924d562161b148$var$password = document.getElementById("password").value;
//delegation
if ($3f924d562161b148$var$loginForm) $3f924d562161b148$var$loginForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    (0, $5b1f850b9f4b88b3$export$596d806903d1f59e)($3f924d562161b148$var$email, $3f924d562161b148$var$password);
});
if ($3f924d562161b148$var$mapBox) {
    const locations = JSON.parse($3f924d562161b148$var$mapBox.dataset.locations);
    (0, $b0d576efe2e551a0$export$4c5dd147b21b9176)(locations);
}


//# sourceMappingURL=bundle.js.map
