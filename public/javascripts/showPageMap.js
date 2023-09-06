mapboxgl.accessToken = mapToken;//4.6
const map = new mapboxgl.Map({
    container: 'map',
    // style: 'mapbox://styles/mapbox/light-v10',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: campground.geometry.coordinates, //5.3
    zoom: 10
});//4.6

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()//5.1
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map)