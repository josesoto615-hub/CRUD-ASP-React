import React, {useState, useEffect} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';

function App() {
  const baseUrl='https://localhost:5001/api/vehiculos';
  const [data, setData]=useState([]);
  const [modalInsertar, setModalInsertar]=useState(false);
  const [modalEditar, setModalEditar]=useState(false);
  const [modalEliminar, setModalEliminar]=useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado]=useState({
    dominio: '',
    marca: '',
    modelo: '',
    anio: '',
    color: ''
  });

  const handleChange=e=>{
    const {name, value}=e.target;
    setVehiculoSeleccionado({
      ...vehiculoSeleccionado,
      [name]: value
    });
    console.log(vehiculoSeleccionado);
  }

  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPost=async()=>{
    delete vehiculoSeleccionado.id;
    vehiculoSeleccionado.anio=parseInt(vehiculoSeleccionado.anio);
    await axios.post(baseUrl,vehiculoSeleccionado)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPut=async()=>{
    vehiculoSeleccionado.anio=parseInt(vehiculoSeleccionado.anio);
    await axios.put(baseUrl+"/"+vehiculoSeleccionado.id, vehiculoSeleccionado)
    .then(response=>{
      var respuesta=response.data;
      var dataAuxiliar=data;
      dataAuxiliar.map(vehiculo=>{
        if(vehiculo.id===vehiculoSeleccionado.id){
          vehiculo.dominio=respuesta.dominio;
          vehiculo.marca=respuesta.marca;
          vehiculo.modelo=respuesta.modelo;
          vehiculo.anio=vehiculoSeleccionado.anio;
          vehiculo.color=respuesta.color;
        }
      })
      abrirCerrarModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionDelete=async()=>{
    await axios.delete(baseUrl+"/"+vehiculoSeleccionado.id)
    .then(response=>{
      setData(data.filter(vehiculo=>vehiculo.id!==response.data));
      abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const seleccionarVehiculo=(vehiculo, caso)=>{
    setVehiculoSeleccionado(vehiculo);
    (caso==="Editar")?
    abrirCerrarModalEditar(): abrirCerrarModalEliminar();
  }

  useEffect(()=>{
    peticionGet();
  },{})

  return (
    <div className="App">
      <br /><br />
      <button onClick={()=>abrirCerrarModalInsertar()} className="btn btn-success">Insertar Nuevo Vehículo</button>
      <br /><br />

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Dominio</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Anio</th>
            <th>Color</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
        {data.map(vehiculo=>(
          <tr key={vehiculo.id}>
            <td>{vehiculo.id}</td>
            <td>{vehiculo.dominio}</td>
            <td>{vehiculo.marca}</td>
            <td>{vehiculo.modelo}</td>
            <td>{vehiculo.anio}</td>
            <td>{vehiculo.color}</td>
            <td>
              <button className="btn btn-primary" onClick={()=>seleccionarVehiculo(vehiculo, "Editar")}>Editar</button> {"  "}
              <button className="btn btn-danger" onClick={()=>seleccionarVehiculo(vehiculo, "Eliminar")}>Eliminar</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>


      <Modal isOpen={modalInsertar}>
        <ModalHeader>Insertar Datos de Vehículo</ModalHeader>
        <ModalBody>
          <div className="from-froup">
            <label>Dominio: </label>
            <br />
            <input type="text" className="form-control" name="dominio" onChange={handleChange}/>
            <br  />
            <label>Marca: </label>
            <br />
            <input type="text" className="form-control" name="marca" onChange={handleChange}/>
            <br  />
            <label>Modelo: </label>
            <br />
            <input type="text" className="form-control" name="modelo" onChange={handleChange}/>
            <br  />
            <label>Año: </label>
            <br />
            <input type="text" className="form-control" name="anio" onChange={handleChange}/>
            <br  />
            <label>Color: </label>
            <br />
            <input type="text" className="form-control" name="color" onChange={handleChange}/>
            <br  />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>peticionPost()}>Insertar</button>{"  "}
          <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Datos de Vehículo</ModalHeader>
        <ModalBody>
          <div className="from-froup">
            <label>Id: </label>
            <br />
            <input type="text" className="form-control" name="id" readonly value={vehiculoSeleccionado && vehiculoSeleccionado.id}/>
            <br  />
            <label>Dominio: </label>
            <br />
            <input type="text" className="form-control" name="dominio"  onChange={handleChange} value={vehiculoSeleccionado && vehiculoSeleccionado.dominio}/>
            <br  />
            <label>Marca: </label>
            <br />
            <input type="text" className="form-control" name="marca" onChange={handleChange} value={vehiculoSeleccionado && vehiculoSeleccionado.marca}/>
            <br  />
            <label>Modelo: </label>
            <br />
            <input type="text" className="form-control" name="modelo" onChange={handleChange} value={vehiculoSeleccionado && vehiculoSeleccionado.modelo}/>
            <br  />
            <label>Año: </label>
            <br />
            <input type="text" className="form-control" name="anio" onChange={handleChange} value={vehiculoSeleccionado && vehiculoSeleccionado.anio}/>
            <br  />
            <label>Color: </label>
            <br />
            <input type="text" className="form-control" name="color" onChange={handleChange} value={vehiculoSeleccionado && vehiculoSeleccionado.color}/>
            <br  />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>peticionPut()}>Editar</button>{"  "}
          <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEliminar}>
        <ModalBody>
          ¿Está segurio de elimninar vehículo {vehiculoSeleccionado && vehiculoSeleccionado.dominio}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>peticionDelete()}>Sí</button>
          <button className="btn btn-secondary" onClick={()=>abrirCerrarModalEliminar()}>No</button>
        </ModalFooter>
      </Modal>


    </div>
  );
}

export default App;
