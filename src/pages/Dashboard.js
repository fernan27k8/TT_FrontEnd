import React from "react";
import KeplerMap from "../components/KeplerMap";
import { useLocation } from "react-router-dom"

const Dashboard = () => {
  const location = useLocation();
  const geojson = location.state?.geojson;
  return (
    <div>
      {geojson ? (
        <KeplerMap geojson={geojson} />
      ) : (
        <p>No se proporcionaron datos GeoJSON.</p>
      )}
    </div>
  );
};

export default Dashboard;





