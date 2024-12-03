// KeplerMap.js
import React, { useEffect } from "react";
import KeplerGl from "kepler.gl"
import keplerGlReducer from "kepler.gl/reducers";
import { taskMiddleware } from "react-palm/tasks";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { addDataToMap } from "kepler.gl/actions";
import { Provider, useDispatch } from "react-redux";
const lineStringConfig = {
  visState: {
    layers: [
      {
        id: 'line-layer',
        type: 'line',
        config: {
          dataId: 'myData',
          label: 'Lineas de ejemplo',
          columns: {
            geojson: '_geojson',
          },
          color: [0, 128, 255],
          thickness: 3,
          opacity: 0.8,
          highlightColor: [255, 255, 0],
        },
        visualChannels: {
          colorField: null,
          colorScale: 'quantile',
          sizeField: null,
          sizeScale: 'linear',
        },
      },
    ],
  },
};

const reducers = combineReducers({
  keplerGl: keplerGlReducer,
});

const store = createStore(reducers, {}, applyMiddleware(taskMiddleware));

export default function KeplerMap({geojson}) {
  return (
    <Provider store={store}>
      <Map geojson={geojson}/>
    </Provider>
  );
}

function Map({geojson}) {
  const dispatch = useDispatch();
  /*
  const { data } = useSwr("geojson", async () => {
    const response = await fetch("/data/3dias_trayectorias_varios_lugares.geojson");
    const data = await response.json();
    return data;
  });*/

  useEffect(() => {
    if (geojson) {
      console.log("Datos listos para agregar a Kepler:", geojson);
      const transformedData = geoJSONToKeplerFormat(geojson);
      dispatch(
        addDataToMap({
          datasets: {
            info: {
              label: "Mis Datos GeoJSON",
              id: "myData",
            },
            data: transformedData,
          },
          option: {
            centerMap: true,
            readOnly: false,
          },
          config: lineStringConfig,
        })
      );
    }
  }, [dispatch, geojson]);

  return (
    <KeplerGl
      id="map"
      width={window.innerWidth}
      height={window.innerHeight}
      mapboxApiAccessToken="pk.eyJ1IjoiZmVybmFuazgiLCJhIjoiY20xendsamN5MGJzdjJrb2M0MHhtc3IxZCJ9.To2VfqQgNMPxtBv62HCWpw"
    />
  );
}

function geoJSONToKeplerFormat(geojson) {
  const fields = [
    { name: "device_id", format: "", type: "string" },
    { name: "timestamps", format: "", type: "string" },
    { name: "coordinates", format: "", type: "geojson" },
  ];

  const rows = geojson.features.map((feature) => {
    const { device_id, timestamps } = feature.properties;
    const coordinates = {
      type: feature.geometry.type,
      coordinates: feature.geometry.coordinates,
    };

    return [device_id, timestamps, coordinates];
  });

  return { fields, rows };
}





