// Creating the map object
let myMap = L.map("map", {
    center: [39.8283, -98.5795], // Corrected the longitude
    zoom: 3
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Use this link to get the GeoJSON data.
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Getting GeoJSON data
d3.json(link).then(function (data) {
    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            // Marker for each earthquake
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 5, 
                fillColor: getColor(feature.properties.mag), 
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function (feature, layer) {
            // Popup information for each earthquake
            layer.bindPopup("<h3>" + feature.properties.place +
                "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
        }
    }).addTo(myMap);
}).catch(function (error) {
    console.error("Error fetching GeoJSON data:", error);
});

// Color of the marker based on magnitude
function getColor(magnitude) {
    return magnitude > 5 ? "#f06b6b" :
        magnitude > 4 ? "#f0936b" :
            magnitude > 3 ? "#f0db4f" :
                magnitude > 2 ? "#bada55" :
                    "#bada55"; 
}
// Create a legend control
let legend = L.control({ position: 'bottomright' });

// Function to generate legend content
legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend');
    let grades = [0, 2, 3, 4, 5];
    let colors = ["#bada55", "#f0db4f", "#f0936b", "#f06b6b", "#f06b6b"];

    // Loop through the grades and generate a label with a colored square for each interval
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + (grades[i + 1] - 1) + '<br>' : '+');
    }

    return div;
};

// Add legend to the map
legend.addTo(myMap);


