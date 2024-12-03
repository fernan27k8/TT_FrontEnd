import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "../styles/Consult.css";

function Consult() {
  const history = useHistory();

  const [formData, setFormData] = useState({
    startPoint: "", // Inicialmente vacío
    endPoint: "", // Inicialmente vacío
    placeOfInterest: "",
  });


  const [loading, setLoading] = useState(false); // Para indicar si está cargando
  const [error, setError] = useState(null); // Para mostrar errores, si los hay

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'datetime-local' ? e.target.valueAsDate : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Muestra indicador de carga
    setError(null); // Reinicia cualquier error anterior

    try {
      // Enviar datos a la API
      const response = await fetch("http://tu-api.com/endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startPoint: formData.startPoint,
          endPoint: formData.endPoint,
          placeOfInterest: formData.placeOfInterest,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status}`);
      }

      // Obtener datos GeoJSON de la respuesta
      const geojson = await response.json();

      // Almacena el GeoJSON en el estado o redirige al Dashboard con los datos
      history.push({
        pathname: "/dashboard",
        state: { geojson }, // Pasa el GeoJSON como estado a la ruta
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
          <label htmlFor="startPoint">Hora Inicial</label>
          <input
            id="startPoint"
            name="startPoint"
            type="datetime-local"
            value={formData.startPoint} // Muestra la fecha/hora del estado
            onChange={handleChange}
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
            onChange={handleChange}
            className="input-field"
            min="2020-01-01T00:00"
            max="2020-01-03T23:59"
          />

          <label htmlFor="placeOfInterest">Lugar de Interés</label>
          <select
            id="placeOfInterest"
            name="placeOfInterest"
            value={formData.placeOfInterest}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Seleccione un lugar</option>
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
          </select>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Cargando..." : "Calcular"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Consult;


