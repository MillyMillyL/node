/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibW1sbG1tIiwiYSI6ImNsc3oybGN1czBsM2wyb21uNm1yY3p4bGcifQ.aFAbWIHZ30OxWryyQghicg';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mmllmm/clsz83voc01es01p64lnedg60',
    scrollZoom: false,
    //   center: [-74.3093438, 40.6975399],
    //   zoom: 8,
    //   interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // create marker
    const el = document.createElement('div');
    el.className = 'marker';

    //add marker
    new mapboxgl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //add popup
    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    //extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
