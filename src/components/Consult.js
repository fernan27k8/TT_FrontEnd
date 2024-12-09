//Consult.js
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "../styles/Consult.css";
import Switch from "react-switch";


function Consult() {
  const history = useHistory();
  const [isApiOne, setIsApiOne] = useState(true);
  const [formData, setFormData] = useState({
    startPoint: "", // Inicialmente vacío
    endPoint: "", // Inicialmente vacío
    placeOfInterest: [],
  });


  const [loading, setLoading] = useState(false); // Para indicar si está cargando
  const [error, setError] = useState(null); // Para mostrar errores, si los hay

  const handleToggle = () => {
    setIsApiOne(!isApiOne); // Cambia entre las dos APIs
  };

  const handleChangeDate = (event) => {
    const { name, value } = event.target; // Captura el nombre y el valor del campo
  
    // Crear un objeto Date a partir del valor seleccionado
    const localDate = new Date(value);
  
    // Convertir al formato ISO 8601 sin zona horaria
    const isoDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16); // Obtener hasta minutos (YYYY-MM-DDTHH:mm)
  
    // Actualizar el estado
    setFormData({
      ...formData,
      [name]: isoDate, // Guardar el valor formateado en el estado
    });
  };
  
  
  const handleChange = (e) => {
    const { name, options } = e.target;
    const selectedOptions = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);

    setFormData({
      ...formData,
      [name]: selectedOptions,
    });
  };

  const handleRemovePlace = (place) => {
    setFormData({
      ...formData,
      placeOfInterest: formData.placeOfInterest.filter(p => p !== place),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Muestra indicador de carga
    setError(null); // Reinicia cualquier error anterior

    try {
      setLoading(true);
      const endpoint = isApiOne ? "http://34.172.62.81:5000/datos" : "http://34.172.62.81:5000/stay_points"; // Seleccionar API basado en el interruptor

      // Enviar datos a la API
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Lugares: formData.placeOfInterest,
          archivo: false,
          start_time: formData.startPoint,
          end_time: formData.endPoint,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status} - ${responseData.error || 'Sin mensaje de error'}`);
      }

      const { task_id } = responseData;
      console.log("task_id recibido:", task_id);

      // Verificar el estado de la tarea usando el task_id
      let taskResult = null;
      while (!taskResult) {
        const statusResponse = await fetch(`http://34.172.62.81:5000/results/${task_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const statusData = await statusResponse.json();

        if (!statusResponse.ok) {
          throw new Error(`Error en la API (GET /results): ${statusResponse.status} - ${statusData.error || 'Sin mensaje de error'}`);
        }

        console.log("Estado de la tarea:", statusData);

        if (statusData.state === "SUCCESS") {
          taskResult = statusData.result; // Obtener el resultado
        } else if (statusData.state === "FAILURE") {
          throw new Error(`Error en el procesamiento: ${statusData.status}`);
        } else {
          // Si el estado es PENDING, esperar unos segundos antes de volver a consultar
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }

      // Redirigir con el resultado al dashboard
      history.push({
        pathname: "/dashboard",
        state: { geojson: taskResult }, // Pasa el resultado como estado a la ruta
      });

    } catch (err) {
      setError(err.message); // Muestra el error
    } finally {
      setLoading(false); // Detiene indicador de carga
    }
  };   

  const handleLogout = () => {
    history.push("/");
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <button
          className="logout-button"
          onClick={handleLogout}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "#ff4d4f",
            color: "black",
            border: "none",
            padding: "5px 10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Cerrar Sesión
        </button>
        <h2>Consulta</h2>
        <form onSubmit={handleSubmit}>
        <div>
            <h3>Selecciona el Endpoint</h3>
            <label >
              <Switch
                onChange={handleToggle}
                checked={isApiOne}
                uncheckedIcon={false}
                checkedIcon={false}
              />
            </label>
            {/* Texto informativo que cambia dinámicamente */}
            <p style={{ fontSize: "18px", marginTop: "10px" }}>
              {isApiOne
                ? "Endpoint 1 está activa. Esta consulta puede determinar las trayectorias que pasaron por un lugar de interes."
                : "Endpoint 2 está activa. Esta consulta obtiene las trayectorias que tuvieron paradas en un tiempo mayor a 10 en un radio de 100 metros del lugare de interes."}
            </p>
          </div>
          <label htmlFor="startPoint">Hora Inicial</label>
          <input
            id="startPoint"
            name="startPoint"
            type="datetime-local"
            value={formData.startPoint} // Muestra la fecha/hora del estado
            onChange={handleChangeDate}
            className="input-field"
            min="2020-01-01T00:00"
            max="2020-01-03T23:59"
          />

          <label htmlFor="endPoint">Hora Final</label>
          <input
            id="endPoint"
            name="endPoint"
            type="datetime-local"
            value={formData.endPoint} // Muestra la fecha/hora del estado
            onChange={handleChangeDate}
            className="input-field"
            min="2020-01-01T00:00"
            max="2020-01-03T23:59"
          />

          <label htmlFor="placeOfInterest">Lugar de Interés</label>
          <select
            id="placeOfInterest"
            name="placeOfInterest"
            multiple
            value={formData.placeOfInterest}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Seleccione uno lugar o varios lugares</option>
            <optgroup label="Atizapán">
                <option>Museo Hacienda de Santa Monica</option>
                <option>Mundo E</option>
                <option>Parque canino Bella vista</option>
                <option>IMSS UMF 58</option>
                <option>Hospital Atizapán de Zaragoza</option>
                <option>Cruz Roja Zaragoza</option>
                <option>Teatro Zaragoza</option>
            </optgroup>
            <optgroup label="Centros Comerciales">
                <option>Centro Acuatico Emiliano Zapata</option>
                <option>Patio Santa Fe</option>
                <option>Plaza Reforma Santa Fe</option>
                <option>Perisur</option>
                <option>Antara Polanco</option>
                <option>Plaza Polanco</option>
                <option>Plaza Moliere</option>
                <option>Pasaje Polanco</option>
                <option>Galeria Plaza Reforma</option>
                <option>Reforma 222</option>
                <option>Parque Delta</option>
                <option>Tienda ISSTE</option>
                <option>Galerias Insurgentes</option>
                <option>Pabellon Cuauhtemoc</option>
                <option>Plaza Universidad</option>
                <option>Parque Lindavista</option>
                <option>Centro Comercial El Rosario</option>
                <option>Toreo Parque Central</option>
                <option>Parque Tezontle</option>
                <option>Plaza Oriente</option>
                <option>Plaza Satelite</option>
                <option>Plaza Carso</option>
                <option>Plaza Cuicuilco</option>
                <option>Paseo Acoxpa</option>
                <option>Gran Sur</option>
                <option>Mundo E</option>
                <option>Oasis Coyoacan</option>
                <option>Forum Buenavista</option>
                <option>Pericentro</option>
                <option>Plaza Inn</option>
                <option>Plaza Inn2</option>
                <option>Parque Via Vallejo</option>
                <option>Plaza Azcapotzalco</option>
                <option>Plaza Tepeyac</option>
                <option>DIAGONAL cUITLAHUAC</option>
            </optgroup>
            <optgroup label="Ecatepec">
                <option>Plaza las Americas</option>
                <option>Centro Cultural y de artes Ecatepec</option>
                <option>Parque Americas IV</option>
                <option>Parque Las Americas</option>
                <option>Hospital Gneral Ecatepec Las Americas</option>
                <option>Deportivo ALfredo del Mazo</option>
                <option>Casa de Morelos</option>
                <option>Mercado San Martin Caballero</option>
                <option>Mercado de Villas</option>
                <option>Paseo Ventura</option>
                <option>Mercado de Bosques</option>
                <option>Parque Ehecatl</option>
                <option>Macroplaza Heroes Tecamac</option>
                <option>Mercado de Piedra</option>
                <option>Clinica Valle de Aragon ISSTE</option>
                <option>imss HGZ 76</option>
                <option>UMF 67</option>
                <option>Plaza Gran Patio Ecatepec</option>
                <option>Casa de la Cultura Los Heroes Tecamac</option>
                <option>Placio Municipal de Ecatepec</option>
                <option>Hospital Gneral de Zona UMF 68</option>
                <option>Centreo de Salud ISEM Santa Maria Tultepec</option>
                <option>Mercado de las fuentes</option>
                <option>Hospital Genereal Dr Jose Maria Rodrigez</option>
                <option>Centro Cultural y Recreativo Ecatepec</option>
                <option>Centro de Autismo Teleton Ecatepec</option>
                <option>Hospital General Regional no 196 Fidel Velazquez</option>
                <option>Multiplaza Aragon</option>
                <option>Jardin Guadalupano</option>
                <option>Centro de Salud San Pedro Xalostoc</option>
            </optgroup>
            <optgroup label="Gobiernos">
                <option>Palacio Nacional</option>
                <option>Palacio Legislativo de San Lazaro</option>
                <option>Congreso de la ciudad de Mexico</option>
                <option>Suprema Corte de Justicia de la Nacion</option>
                <option>Secretaria de Gibernacion</option>
                <option>Instituto Nacional de Bellas Artes y Literatura</option>
                <option>Procuradoria General de la Republica</option>
                <option>Procuradoria General de la Republica 2</option>
                <option>PGR</option>
                <option>banjercito</option>
                <option>Servicio de AdministraciÃ³n Tributaria</option>
                <option>Sistema Nacional de Fomento Musical</option>
                <option>Secretaria de relaciones exteriores</option>
                <option>Antigua Aduana de la Ciudad de Mexico</option>
                <option>Secretaria de Educacion Publica</option>
                <option>Palacio de la escuela de Medicina</option>
                <option>Secretaria de digusion de CUltura de la escuela Nacional Preparatoria</option>
                <option>Secretaria de Comuniacaiones y Transporte</option>
                <option>Secretaria del medio ambiente</option>
                <option>Secretaria de Trabajo y Fomento al Empleto</option>
                <option>Tribunal Federal de Conciliacion y Arbitraje</option>
                <option>Unidad de Atencion y PRevencion de la Violencia Familiar</option>
                <option>Secretaria de Trabajo y Fomento al Empleo 2</option>
                <option>Senado de la Republica</option>
                <option>Secretaria de Gobernacion2</option>
                <option>Alcaldia Cuauhtemoc</option>
            </optgroup>
            <optgroup label="Hospitales">
                <option>Hospital de Jesus</option>
                <option>IMSS UMF 11</option>
                <option>IMSS UMF 20</option>
                <option>IMSS UMF 9</option>
                <option>imss umf 40</option>
                <option>imss umf 33</option>
                <option>imss umf 33</option>
                <option>imss umf 37</option>
                <option>imss umf 16</option>
                <option>imss umf 5</option>
                <option>imss umf 06</option>
                <option>imss umf 35</option>
                <option>Hospital Churubusco</option>
                <option>imss umf 43</option>
                <option>Centro Medico Nacional La Raza</option>
                <option>Hospital Pediatrico Peralvillo</option>
                <option>Hospital San Angel I9nn Chapultepec</option>
                <option>Hospital Obregon</option>
                <option>imss umf 01</option>
                <option>Hospital Los Angeles Clincia Londres</option>
                <option>imss umf 4</option>
                <option>Hospital Gneral de Mexico</option>
                <option>Hospital Infantil Federico Gomez</option>
                <option>Centro Medico Nacional Siglo XXI</option>
                <option>Hospital Dermatologico Ladislao Pascua</option>
                <option>imss umf 38</option>
                <option>Hsopital Trinidad</option>
                <option>Hospital Los Angeles Metropolitano</option>
                <option>Hospital de Mexico</option>
                <option>Clinica CIME</option>
                <option>Centro de Salud Mixcoac</option>
                <option>Clinica Mexicana de Autismo y Alteraciones</option>
                <option>Hospital Gneral DR Fernando Quiroz</option>
                <option>Centro Medico ABC</option>
                <option>Hospital Militar de Zona Constituyentes</option>
                <option>Hospital Maria Jose</option>
                <option>Centro de sALUD dr d oRVAÃ‘OS</option>
                <option>hOSPITAL gNERAL DE zONA NO 24</option>
                <option>Hospital Juarez de Mexico</option>
                <option>Hospital de Ginecologia</option>
                <option>Hospital 1 de Octubre ISSTE</option>
                <option>Hospital los Angeles Lindavitsa</option>
                <option>imss umf 15</option>
            </optgroup>
            <optgroup label="Metros">
                <option>Metro Allende 4 Caminos</option>
                <option>Metro Allende Taxqueña</option>
                <option>Metro Indios Verdes</option>
                <option>Metro Deportivo 18 de marzo</option>
                <option>Metro Potrero</option>
                <option>Metro Tlatelolco</option>
                <option>Metro Guerrero</option>
                <option>Metro Hidalgo</option>
                <option>Metro Bellas Artes</option>
                <option>Metro Isabel la Catolica</option>
                <option>Metro Salto del agua</option>
                <option>Metro Salto del agua 2</option>
                <option>Metro Balderas</option>
                <option>Metro Cuauhtemoc</option>
                <option>Metro Insurgentes</option>
                <option>Metro Sevilla</option>
                <option>Metro Juanacatlan</option>
                <option>Metro Juanacatlan</option>
                <option>Metro Tacubaya</option>
                <option>Metro Observatorio</option>
                <option>Metro 4 Caminos</option>
                <option>Metro Tacuba</option>
                <option>Metro Cuitlahuac</option>
                <option>Metro Cuitlahuac2</option>
                <option>Metro Popotla</option>
                <option>Metro Popotla 2</option>
                <option>Metro Colegio Militar</option>
                <option>Metro Normal</option>
                <option>Metro Normal</option>
                <option>Metro San Cosme</option>
                <option>Metro San Cosme 2</option>
                <option>Metro Revolucion</option>
                <option>Metro Revolucion 2</option>
                <option>Metro Universidad</option>
                <option>Metro Copilco</option>
                <option>Metro Miguel Angel de Quevedo</option>
                <option>Metro Coyoacan</option>
                <option>Metro Zapata</option>
                <option>Metro Zapata 2</option>
                <option>Metro Eugenia</option>
                <option>Metro Eugenia 2</option>
                <option>Metro Etiopia</option>
                <option>Metro Centro Medico</option>
                <option>Metro Hospital General</option>
                <option>Metro Hospital Gneral 2</option>
                <option>Metro Niños Heroes</option>
                <option>Metro Juarez</option>
                <option>Metro Juarez 2</option>
                <option>Metro Martin Carrera</option>
                <option>Metro Talisman</option>
                <option>Metro Bondojito</option>
                <option>Metro Consulado</option>
                <option>Metro Canal del norte</option>
                <option>Metro Morelos</option>
                <option>Metro Fray Servando</option>
                <option>Metro Jamaica</option>
                <option>Metro Santa Anita</option>
                <option>Metro Politecnico</option>
                <option>Metro Instituto del Petroleo</option>
                <option>Metro Autobuses del Norte</option>
                <option>Metro Eduardo Molina</option>
                <option>Metro Aragon</option>
                <option>Metro Oceania</option>
                <option>Metro Hangares</option>
                <option>Metro Pantitlan L9 Y A</option>
                <option>Metro El rosario</option>
                <option>Metro Tezozomoc</option>
                <option>Metro Azcapotzalco</option>
                <option>Metro Azcapotzalco 2</option>
                <option>Metro Ferreria</option>
                <option>Metro Norte 45</option>
                <option>Metro Vallejo</option>
                <option>Metro La villa</option>
                <option>Metro Aquiles Serdan</option>
                <option>Metro Camarones</option>
                <option>Metro Camarones2</option>
                <option>Metro Refineria</option>
                <option>Metro San Joaquin</option>
                <option>Metro Polanco</option>
                <option>Metro Auditorio</option>
                <option>Metro Auditorio2</option>
                <option>Metro Constituyentes</option>
                <option>Metro cONSTITUCION DE 1917</option>
                <option>Metro San Lazaro</option>
                <option>Metro Doctores</option>
                <option>Metro Doctores</option>
                <option>Metro Obrera</option>
                <option>Metro Chabacano</option>
                <option>Metro La viga</option>
                <option>Metro Patriotismo</option>
                <option>Metro Chilpancingo</option>
                <option>Metro Lazaro Cardenas</option>
                <option>Metro Mixuca</option>
                <option>Metro Velodromo</option>
                <option>Metro Ciudad deportiva</option>
                <option>Metro Puebla</option>
                <option>Metro Agricola Oriental</option>
                <option>Metro Canal de San Juan</option>
                <option>Metro Tepalcates</option>
                <option>Metro Guelatao</option>
                <option>Metro Peñon Viejo</option>
                <option>Metro Acatitla</option>
                <option>Metro Santa Marta</option>
                <option>Metro Los Reyes</option>
                <option>Metro La Paz</option>
                <option>Metro Ciudad Azteca</option>
                <option>Metro Plaza Aragon</option>
                <option>Metro Olimpica</option>
                <option>Metro Ecatepec</option>
                <option>Metro Muzquiz</option>
                <option>Metro Rio de los remedios</option>
                <option>Metro Impulsora</option>
                <option>Metro Nezahualcoyotl</option>
                <option>Metro Villa de Aragon</option>
                <option>Metro Bosques de Aragon</option>
                <option>Metro Deportivo Oceania</option>
                <option>Metro Romero Rubio</option>
                <option>Metro Ricardo Flores Magon</option>
                <option>Metro Tepito</option>
                <option>Metro Lagunilla</option>
                <option>Metro Mixcoac</option>
                <option>Metro Insurgentes sur</option>
                <option>Metro Insurgentes sur 2</option>
                <option>Metro Hospital 20 de noviembre</option>
                <option>Metro Parque de los venados</option>
                <option>Metro Eje central</option>
                <option>Metro Ermita</option>
                <option>Metro Mexicaltzingo</option>
                <option>Metro Atlalilco</option>
                <option>Metro Culhuacan</option>
                <option>Metro San Andrés Tomatlan</option>
                <option>Metro Lomas Estrella</option>
                <option>Metro General Anaya</option>
                <option>Metro Portales</option>
                <option>Metro Nativitas</option>
                <option>Metro Villa de cortez</option>
                <option>Metro Xola</option>
                <option>Metro Viaducto</option>
                <option>Metro San Antonio Avad</option>
                <option>Metro Zocalo</option>
              </optgroup>
            <optgroup label="Museos">
                <option>Museo Nacional de Antropología</option>
                <option>Anfibium</option>
                <option>Museo Nacional de Historia Castillo de chapultepec</option>
                <option>Museo Tamayo Arte Contemporaneo</option>
                <option>Foro Cultural Chapultepec</option>
                <option>Galeria Oscar Roman</option>
                <option>Museo Frida Khalo</option>
                <option>Museo de Arte Moderno</option>
                <option>Museo Soumaya</option>
                <option>Museo Jumex</option>
                <option>Museo de Historia Natural y Cultura Ambiental</option>
                <option>pALACIO DE bELLAS aRTES</option>
                <option>Museo Nacional de Arte</option>
                <option>Museo Interactivo de Economia</option>
                <option>Museo de la Tortura</option>
                <option>Museo del Estanquillo</option>
                <option>Museo Mexicano del Diseño</option>
                <option>Museo de la Caricatura</option>
                <option>Templo Mayor</option>
                <option>Museo del Templo Mayor</option>
                <option>Museo UNAM Hoy</option>
                <option>Museo Jose Luis Cuevas</option>
                <option>Museo de la Luz</option>
                <option>Antiguo Colegio de San Idelfonso</option>
                <option>Museo de las Constituciones</option>
                <option>Museo Nacional de las C</option>
                <option>Museo Salon de Cabildos</option>
                <option>Palacio de Mineria</option>
                <option>Museo Franz Mayer</option>
                <option>Museo Kaluz</option>
                <option>Museo Panteon de San Fernando</option>
                <option>Museo Britanico Americano</option>
                <option>Museo de la Revolucion Mexicana</option>
                <option>Museo Experimental el eco</option>
                <option>Museo de Ripley</option>
                <option>Museo Memoria y toleracina</option>
                <option>Museo de arte pupular</option>
                <option>Museo del objeto del objeto</option>
                <option>Galeria Omir</option>
                <option>Galeria Aguafuerte</option>
                <option>Museo nacional de la cartografia</option>
                <option>Museo de la geofisica de la UNAM</option>
                <option>Mapoteca</option>
                <option>Museo Nacional de la Estampa</option>
                <option>Museo Universitario de Arte Contemporaneo</option>
                <option>Museo Nacional de San Carlos</option>
                <option>Museo Dolores Olmedo</option>
                <option>Museo Universitario del Chopo</option>
                <option>Museo Nacional de la Acuarela</option>
                <option>Museo Indigena</option>
            </optgroup>
            <optgroup label="Naucalpan">
                <option>Parqeu Naucalli</option>
                <option>Hospital de Traumatologia de Lomas Verdes</option>
                <option>SuperISSTE Naucalpan</option>
                <option>Bazar Lomas Verdes</option>
                <option>Parqeu La Hoja</option>
                <option>Cruz Roja Naucalpan</option>
                <option>DireccionGeneral de Medio Ambiente Naucalpan</option>
                <option>imss umf 194</option>
                <option>iCentro de Salud San Augistin ISEM</option>
                <option>pLAZA lAS tORRES</option>
                <option>Parque Circuitos Musicos</option>
                <option>Plaza Satelite</option>
                <option>Centro Quirurjico Satelite</option>
                <option>Hospital Ciudad Satelite</option>
                <option>Unidad Cuauhtemoc IMSS</option>
                <option>Plaza San Mateo</option>
            </optgroup>
            <optgroup label="Nezahualcoyotl">
                <option>Hospital Vivo Jardin Bicentenario</option>
                <option>Plaza Ciudad Jardin</option>
                <option>Hospital General Gustavo Baz</option>
                <option>Centro Penitenciario Nezahualcoyotl</option>
                <option>Palacio de Justicia de Nezahualcoyotl</option>
                <option>Palacio Municipal de Nezahualcoyotl</option>
                <option>Centro Cultural el Castillo</option>
                <option>cruz roja mexicana la perla</option>
                <option>Hospital de la perla Nezahualcoyotl</option>
                <option>Centro de Salud Metropolitano</option>
                <option>Mercado Nuevo Evolucion</option>
                <option>Mercado Lazaro Cardenas</option>
                <option>museo del Gerrero Chimalli</option>
            </optgroup>
            <optgroup label="Parques y plazas">
                <option>1A seccion Bosque de chapultepec</option>
                <option>2A Seccion del Bosque de Chapultepec</option>
                <option>3A Seccion del Bosque de Chapultepec</option>
                <option>Parque Rosareio Castellanos</option>
                <option>Parque de la amistad Mexico Azerbaiyan</option>
                <option>Plaza de la lectura Jose Saramago</option>
                <option>Parque Olof Palme</option>
                <option>Plaza Melchor Ocampo</option>
                <option>Jardin del arte</option>
                <option>Plaza Luis Pasteur</option>
                <option>Parque Jesus Reyes Heroes</option>
                <option>Plaza Giordano Bruno</option>
                <option>Parque Alexande Pushkin</option>
                <option>Plaza de Cibeles</option>
                <option>Jardin Juan Rulfo</option>
                <option>Parque EspaÃ±a</option>
                <option>Parque Mexico</option>
                <option>Jardin Lopez Velarde</option>
                <option>Jardin Artes Graficas</option>
                <option>Parque Lazaro Cardenas</option>
                <option>Jardin Dr Igancio Chavez</option>
                <option>Plaza Romita</option>
                <option>Parque Balderas</option>
                <option>Plaza Julio Antonio Mella</option>
                <option>Alameda Central</option>
                <option>Plaza Francisco Zarco</option>
                <option>Plaza de la Merced</option>
                <option>Plaza de la concepcion</option>
                <option>Plaza Santa Catarina</option>
                <option>Plaza del estudiante</option>
                <option>Plaza Torres Quintero</option>
                <option>Plaza de la Santisima</option>
                <option>Plaza Vizcainas</option>
                <option>Jardin del arbol</option>
                <option>Plaza Juan Jose</option>
                <option>Plaza San Pablo</option>
                <option>Plaza San Salvador El Verde</option>
                <option>Plaza Santa Cruz</option>
                <option>Plaza Rio de Janeiro</option>
                <option>Plaza Luis Cabrera</option>
                <option>Parque Maria Enriqueta</option>
                <option>Jardin Esparza Oteo</option>
                <option>Parque Miraflores</option>
                <option>Plaza Orozco</option>
                <option>Parque Luis G. Urbina</option>
                <option>Parque San Lorenzo</option>
                <option>Jardin del Arte Tlacoquemecatl</option>
                <option>Plaza Augustin Jauregi</option>
                <option>Parque Ecologico Las Aguilas</option>
                <option>Ecologico Japon</option>
                <option>Parque Rosita</option>
                <option>Jardin Hidalgo</option>
                <option>Parque Bicentenario</option>
                <option>Azctl Paqui</option>
                <option>Parque de la China</option>
                <option>Parque CaÃ±itas</option>
                <option>Parque de los venados</option>
                <option>Parque Benito Juarez</option>
                <option>Parque de la bombilla</option>
                <option>Parque Protasio Tagle</option>
                <option>Plaza de San Jacinto</option>
                <option>Viveros de Coyoacan</option>
                <option>Bioparque San antiono</option>
                <option>Parque Ruben Dario</option>
                <option>Plaza de la Cuidadela</option>
                <option>Plaza Carlos Pacheco</option>
                <option>Parque Nacional El Tepeyac</option>
                <option>Parque del Mestizaje</option>
                <option>Bosque San Juan de Aragon</option>
            </optgroup>
            <optgroup label="Tlanepantla">
                <option>ISSEMYM Regional Tlanepantla</option>
                <option>imss umf 186</option>
                <option>Parque Adolfo Lopez Mateos</option>
                <option>Centro de Salud Prado Ixtacala</option>
                <option>Museo Xolotl</option>
                <option>Encuentro Tlanepantla</option>
                <option>Plaza Tlane Fashion mall</option>
                <option>Teatro Centenario</option>
                <option>Hospital Star Medica Tlanepantla</option>
                <option>Centro Convenciones Tlanepantla</option>
                <option>Hospital Elizur</option>
                <option>Museo Municipal Tlanepantla</option>
                <option>Teatro Algarabia</option>
                <option>imss subdelegacion Tlanepantla</option>
                <option>Hospital Regional No 72</option>
                <option>Acuario Valle Dorado</option>
                <option>Multiplaza Arboledas</option>
                <option>imss umf 64</option>
                <option>Zona Arqueologica Santa Cecilia Acatitlan</option>
                <option>CFE Tenayuca</option>
                <option>Hospital General de Tlanepantla</option>
                <option>imss umf 79</option>
                <option>imss umf 95</option>
            </optgroup>
            <optgroup label="PRUEBAS">
            <option>Secretaría de Salud</option>
                <option>Secretaría de Desarrollo Agrario</option>
                <option>Secretaría de Desarrollo Social</option>
                <option>Secretaría de Desarrollo Urbano y Vivienda</option>
                <option>Secretaría de Economía</option>
                <option>Secretaría de Economía 2</option>
                <option>Secretaría de Economía 3</option>
                <option>INEA</option>
                <option>Consulado de Rusia</option>
                <option>Embajada Rusa</option>
                <option>Embajada de los Estados Unidos</option>
                <option>Secretaría de Energía</option>
                <option>Secretaría de Medio Ambiente y Recursos Naturales</option>
                <option>Secretaría de Agricultura y Desarrollo Rural</option>
                <option>Alcaldía Benito Juárez</option>
                <option>PGJDF Benito Juárez</option>
                <option>Secretaría de Obras y Servicios</option>
                <option>Secretaría de la Función Pública</option>
                <option>Secretaría de Turismo</option>
                <option>Fiscalía General de la República</option>
                <option>Planta de Tratamiento de Aguas Residuales</option>
                <option>Alcaldía Miguel Hidalgo</option>
                <option>Comisión Nacional de Protección y Defensa de Usuarios de Servicios Financieros</option>
                <option>CONEVAL</option>
                <option>Instituto Federal de Telecomunicaciones</option>
                <option>Comisión Nacional de Hidrocarburos</option>
                <option>Comisión Nacional de Seguridad Nuclear</option>
                <option>Comisión Nacional de los Derechos Humanos</option>
                <option>Auditoría Superior de la Federación</option>
                <option>Fiscalía General de la República</option>
                <option>Secretaría de Seguridad Ciudadana de la Ciudad de México</option>
                <option>Bolsa Mexicana de Valores</option>
                <option>Embajada de Japón</option>
                <option>Aculco</option>
                <option>4.7082E+11</option>
                <option>Almoloya de Alquisiras</option>
                <option>01941 18.8719847202225</option>
                <option>Almoloya de Juárez</option>
                <option>8.4736E+11</option>
                <option>Apaxco</option>
                <option>Capulhuac</option>
                <option>Cuautitlán</option>
                <option>1637019704578 19.7458988900365</option>
                <option>Ecatzingo</option>
                <option>Isidro Fabela</option>
                <option>99.3759359393708 19.5795492296276</option>
                <option>Ixtapan del Oro</option>
                <option>Jaltenco</option>
                <option>Jilotzingo</option>
                <option>3</option>
                <option>Joquicingo</option>
                <option>Malinalco</option>
                <option>9.4301685407862 18.8718525617099</option>
                <option>Ocoyoacac</option>
                <option>Ocuilan</option>
                <option>891351 18.9997671699094</option>
                <option>Ozumba</option>
                <option>98.8396008496674 18.9780290201963</option>
                <option>San Antonio la Isla</option>
                <option>San Simón de Guerrero</option>
                <option>Tecámac</option>
                <option>7.12262E+11</option>
                <option>Tultitlán</option>
                <option>19.68749245</option>
                <option>Zinacantepec</option>
                <option>5</option>
                <option>Zumpahuacán</option>
                <option>4</option>
                <option>Zumpango</option>
                <option>9668896535</option>
                <option>Valle de Bravo</option>
                <option>76714169</option>
                <option>Villa de Allende</option>
                <option>797438</option>
                <option>Villa del Carbón</option>
                <option>1282599258 19.6148648203569</option>
                <option>Villa Guerrero</option>
                <option>00033 18.8635244204399</option>
                <option>Villa Victoria</option>
                <option>19.30122206</option>
                <option>Xonacatlán</option>
                <option>Zacazonapan</option>
                <option>Zacualpan</option>
                <option>95487</option>
                <option>Cuautitlán Izcalli</option>
                <option>19.69070722</option>
                <option>San José del Rincón</option>
                <option>58712626401 19.5228131059178</option>
                <option>Acolman</option>
                <option>-98.9368576495155 19.6754805502997</option>
                <option>Amanalco</option>
                <option>6979825 19.2985432803913</option>
                <option>Atenco</option>
                <option>Atizapán de Zaragoza</option>
                <option>56098303595</option>
                <option>Jilotepec</option>
                <option>881989</option>
                <option>Nextlalpan</option>
                <option>Axapusco</option>
                <option>8.6390175986488 19.6731170502402</option>
                <option>139986900278 19.6602883497203</option>
                <option>Otzoloapan</option>
                <option>Otzolotepec</option>
                <option>03 19.4102730211156</option>
                <option>San Mateo Atenco</option>
                <option>Tejupilco</option>
                <option>99</option>
                <option>Temascalapa</option>
                <option>Temascaltepec</option>
                <option>9.97359E+11</option>
                <option>Tenango del Aire</option>
                <option>Tenango del Valle</option>
                <option>19.03213934</option>
                <option>Teoloyucan</option>
                <option>Teotihuacán</option>
                <option>-98.9331587503077 19.7039884301668</option>
                <option>Tepetlaoxtoc</option>
                <option>54</option>
                <option>Tepotzotlán</option>
                <option>19.65155385</option>
                <option>Texcaltitlán</option>
                <option>Texcalyacac</option>
                <option>Tezoyuca</option>
                <option>Almoloya del Río</option>
                <option>Juchitepec</option>
                <option>San Felipe del Progreso</option>
                <option>0.55839192</option>
                <option>Amecameca</option>
                <option>792289199 19.0765371998052</option>
                <option>Valle de Chalco Solidaridad</option>
                <option>Azcapotzalco</option>
                <option>Coyoacán</option>
                <option>Cuajimalpa de Morelos</option>
                <option>96994514</option>
                <option>Gustavo A. Madero</option>
                <option>57979136 19.52887352014117</option>
                <option>Iztacalco</option>
                <option>Iztapalapa</option>
                <option>5.85484E+13</option>
                <option>La Magdalena Contreras</option>
                <option>64260019115</option>
                <option>Milpa Alta</option>
                <option>Álvaro Obregón</option>
                <option>59544974045</option>
                <option>Tláhuac</option>
                <option>28974098 19.286702319617614</option>
                <option>Tlalpan</option>
                <option>5893413 19.226649910546435</option>
                <option>Xochimilco</option>
                <option>6741073465</option>
                <option>Benito Juárez</option>
                <option>Cuauhtémoc</option>
                <option>Miguel Hidalgo</option>
                <option>2.6751E+11</option>
                <option>Venustiano Carranza</option>

            </optgroup>
          </select>
          {formData.placeOfInterest.length > 0 && (
          <div className="selected-places">
            <h3>Lugares seleccionados:</h3>
            <ul>
              {formData.placeOfInterest.map((place, index) => (
                <li key={index}>
                  {place}
                  <button type="button" onClick={() => handleRemovePlace(place)}>❌</button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Cargando..." : "Calcular"}
        </button>
        {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Consult;


