// KeplerMap.js
import React, { useEffect } from "react";
import KeplerGl from "kepler.gl"
import keplerGlReducer from "kepler.gl/reducers";
import { taskMiddleware } from "react-palm/tasks";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { addLayer,addDataToMap } from "kepler.gl/actions";
import { Provider, useDispatch } from "react-redux";
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
        })
      );

      dispatch(
        addLayer({
          id: "line-layer",
          type: "line",
          config: {
            dataId: "myData",
            label: "Lineas de ejemplo",
            columns: {
              geojson: "coordinates",
            },
            visConfig: {
              color: [255, 0, 0],
              thickness: 3,
            },
          },
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
    const coordinates = feature.geometry; // GeoJSON espera todo el objeto geometry
    return [device_id, JSON.stringify(timestamps), coordinates];
  });

  return { fields, rows };
}



