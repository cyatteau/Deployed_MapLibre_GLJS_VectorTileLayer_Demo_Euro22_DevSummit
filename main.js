import maplibregl from "maplibre-gl";

const apiKey = import.meta.env.VITE_SOME_KEY;

const basemapEnum = "ArcGIS:Community";

const map = new maplibregl.Map({
  container: "map",
  style: `https://basemaps-api.arcgis.com/arcgis/rest/services/styles/${basemapEnum}?type=style&token=${apiKey}`,
  center: [-122.675, 45.5051], // starting position [lng, lat]
  zoom: 12,
});

const layers = [
  {
    id: "treefair",
    type: "circle",
    source: "pdx",
    "source-layer": "PDX Trees",
    filter: ["==", "_symbol", 0],
    minzoom: 9,
    layout: {},
    paint: {
      "circle-color": "#38A800",
      "circle-radius": {
        stops: [
          [2, 10],
          [5, 8],
          [10, 3],
        ],
      },
    },
  },
  {
    id: "treegood",
    type: "circle",
    source: "pdx",
    "source-layer": "PDX Trees",
    filter: ["==", "_symbol", 1],
    minzoom: 9,
    layout: {},
    paint: {
      "circle-color": "#267300",
      "circle-radius": 3,
    },
  },
  {
    id: "treepoor",
    type: "circle",
    source: "pdx",
    "source-layer": "PDX Trees",
    filter: ["==", "_symbol", 2],
    minzoom: 9,
    layout: {},
    paint: {
      "circle-color": "#E6E600",
      "circle-radius": 3,
    },
  },
  {
    id: "treedead",
    type: "circle",
    source: "pdx",
    "source-layer": "PDX Trees",
    filter: ["==", "_symbol", 3],
    minzoom: 9,
    layout: {},
    paint: {
      "circle-color": "#ED5151",
      "circle-radius": 3,
    },
  },
];

const popup = new maplibregl.Popup({
  closeButton: false,
  closeOnClick: false,
});

map.once("load", () => {
  map.addSource("pdx", {
    type: "vector",
    tiles: [
      "https://vectortileservices8.arcgis.com/87xMVlxSyDt491tZ/arcgis/rest/services/treevtl_demo/VectorTileServer/tile/{z}/{y}/{x}.pbf",
    ],
  });
  layers.forEach((layer) => {
    map.addLayer(layer);
    map.on("mouseover", layer.id, (e) => {
      map.getCanvas().style.cursor = "pointer";
      const feature = e.features[0];
      popup
        .setLngLat(e.lngLat)
        .setHTML(
          `<b>Common Name: </b>${
            feature.properties.Common
          }<br/><b>Condition: </b>${feature.properties.Condition.toLowerCase()}`
        )
        .addTo(map);
    });
    map.on("mouseenter", layer.id, () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", layer.id, (e) => {
      map.getCanvas().style.cursor = "";
      popup.remove();
    });
  });
});
