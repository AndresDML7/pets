import React, { useState, useEffect} from 'react';
import { isEmpty, size } from 'lodash';
import { addDocument, deleteDocument, getCollection, updateDocument } from './actions';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [animal, setAnimal] = useState({
    name: "",
    type: "",
    breed: "",
    birth_date: "",
    owner_name: "",
    owner_tel: "",
    owner_address: "",
    owner_email: ""
  });
  const [animals, setAnimals] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [id, setId] = useState("");
  const [error, setError] = useState({
    operations: null
  });

  useEffect(() => {
    (async () => {
      const result = await getCollection("animals");

      if (result.statusResponse) {
        setAnimals([...animals, result.data]) 
      }
      
      setAnimals(result.data);
    })()
  }, []);

  const validForm = () => {
    let isValid = true;
    let error = {};

    if(isEmpty(animal.name)) {
      error["name"] = "Por favor, ingresa el nombre de la mascota.";
      isValid = false;
    }

    if(isEmpty(animal.type)) {
      error["type"] = "Por favor, ingresa el tipo de mascota.";
      isValid = false;
    }

    if(isEmpty(animal.breed)) {
      error["breed"] = "Por favor, ingresa la raza de la mascota.";
      isValid = false;
    }

    if(isEmpty(animal.birth_date)) {
      error["birth_date"] = "Por favor, ingresa la fecha de nacimiento de la mascota.";
      isValid = false;
    }

    if(isEmpty(animal.owner_name)) {
      error["owner_name"] = "Por favor, ingresa el nombre del dueño de la mascota";
      isValid = false;
    }

    if(isEmpty(animal.owner_tel)) {
      error["owner_tel"] = "Por favor, ingresa el telefono del dueño de la mascota.";
      isValid = false;
    }

    if(isEmpty(animal.owner_address)) {
      error["owner_address"] = "Por favor, ingresa la dirección del dueño de la mascota";
      isValid = false;
    }

    if(isEmpty(animal.owner_email)) {
      error["owner_email"] = "Por favor, ingresa el e-mail del dueño de la mascota";
      isValid = false;
    }

    setError(error);

    return isValid;
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setAnimal({ ...animal, [name]: value });
    setError({ ...error, [name]: null });

  }

  const addAnimal = async (e) => {
    e.preventDefault();

    if(!validForm()) {
      return;
    }

    const result = await addDocument("animals", {name: animal.name, type: animal.type, 
      breed: animal.breed, birth_date: animal.birth_date, owner_name: animal.owner_name, 
      owner_tel: animal.owner_tel, owner_address: animal.owner_address, owner_email: animal.owner_email});

    if(!result.statusResponse) {
      setError({ ...error, ["operations"]: result.error});
      return;
    }

    setAnimals([...animals, { id: result.data.id, name: animal.name, type: animal.type, 
      breed: animal.breed, birth_date: animal.birth_date, owner_name: animal.owner_name, 
      owner_tel: animal.owner_tel, owner_address: animal.owner_address, owner_email: animal.owner_email }]);

    setAnimal({
      name: "",
      type: "",
      breed: "",
      birth_date: "",
      owner_name: "",
      owner_tel: "",
      owner_address: "",
      owner_email: ""
    });
    toggleOpenModal();
  }

  const saveAnimal = async(e) => {
    e.preventDefault();

    if(!validForm()) {
      return;
    }

    const result = await updateDocument("animals", id, {name: animal.name, type: animal.type, 
      breed: animal.breed, birth_date: animal.birth_date, owner_name: animal.owner_name, 
      owner_tel: animal.owner_tel, owner_address: animal.owner_address, owner_email: animal.owner_email} );

    if(!result.statusResponse) {
      setError({ ...error, ["operations"]: result.error});
      return;
    }

    const editedAnimals = animals.map(item => item.id === id ? {id, name: animal.name, type: animal.type, 
      breed: animal.breed, birth_date: animal.birth_date, owner_name: animal.owner_name, owner_tel: animal.owner_tel, 
      owner_address: animal.owner_address, owner_email: animal.owner_email} : item);

    setAnimals(editedAnimals);
    setEditMode(false);
    setAnimal({
      name: "",
      type: "",
      breed: "",
      birth_date: "",
      owner_name: "",
      owner_tel: "",
      owner_address: "",
      owner_email: ""
    });
    setId("");
    toggleOpenModal();
  }

  const deleteAnimal = async() => {
    const result = await deleteDocument("animals", id);

    if(!result.statusResponse) {
      setError({ ...error, ["operations"]: result.error});
      return;
    }

    const filteredAnimals = animals.filter(animal => animal.id !== id );
    setAnimals(filteredAnimals);
    toggleDeleteModal("");
  }

  const editAnimal = (theAnimal) => {

    setAnimal(theAnimal);
    setEditMode(true);
    setId(theAnimal.id);
    toggleOpenModal();
  }

  const detailAnimal = (theAnimal) => {

    setAnimal(theAnimal);
    setId(theAnimal.id);
    toggleDetailModal();
  }

  const toggleOpenModal = () => {
    setOpenModal(!openModal);
  }

  const toggleDeleteModal = (theId) => {
    setId(theId);
    setDeleteModal(!deleteModal);
  }

  const toggleDetailModal = () => {
    setDetailModal(!detailModal);
  }

  const cancelOpenModal = () => {
    setEditMode(false);
    setError({});
    setAnimal({
      name: "",
      type: "",
      breed: "",
      birth_date: "",
      owner_name: "",
      owner_tel: "",
      owner_address: "",
      owner_email: ""
    });
    setId("");
    toggleOpenModal();
  }

  const cancelDetailModal = () => {
    setEditMode(false);
    setAnimal({
      name: "",
      type: "",
      breed: "",
      birth_date: "",
      owner_name: "",
      owner_tel: "",
      owner_address: "",
      owner_email: ""
    });
    setId("");
    toggleDetailModal();
  }

  const center = {margin: 'auto', padding: 10}

  return (
    <div className="container mt-5" textAlign = "center">
      <h1 className="text-center">Mascotas</h1>
      <hr className="border-1 border-info"/>
      <div>
        <div className="col-10" style={center}>
          <h4 className="text-center">Lista de Mascotas</h4>

          {
            size(animals) === 0 ? (
              <li className="list-group-item">Aún no hay mascotas ingresadas.</li>
            ) : (
              <ul className="list-group border border-1 border-info">
                {
                  animals.map((animal) => (
                    <li className="list-group-item" key={animal.id}>
                      {animal.name}

                      <button className="btn btn-danger btn-sm float-right border border-danger" 
                        onClick={() => toggleDeleteModal(animal.id)}>Eliminar</button>

                      <button className="btn btn-warning btn-sm float-right mx-2"
                        onClick={() => editAnimal(animal)}>Editar</button>

                      <button className="btn btn-info btn-sm float-right"
                        onClick={() => detailAnimal(animal)}>Detalles</button>

                    </li>
                  ))
                }
              </ul>
            )
          }

          <br/>
          <button className="btn btn-success" onClick={()=> toggleOpenModal()}>Nueva Mascota</button>
        </div>

        <Modal isOpen={openModal}>
          <ModalHeader>{ editMode ? "Modificar Mascota" : "Agregar Mascota"}</ModalHeader>
          <form onSubmit={ editMode ? saveAnimal : addAnimal}>
            <ModalBody>
              <div className="form-group">

                <div className="row">

                  <div className="col-6">

                    <div className="form-group">
                      <strong>Nombre: </strong>
                      <input type="text" className="form-control mb-2" name="name" 
                      placeholder="Ingrese un dato..." onChange={ handleChange } value={animal.name}/>
                      <span style={{color: "red"}}>{error["name"]}</span>
                    </div>
                    
                    <div className="form-group">
                      <strong>Tipo: </strong>
                      <input type="text" className="form-control mb-2" name="type" 
                      placeholder="Ingrese un dato..." onChange={ handleChange } value={animal.type}/>
                      <span style={{color: "red"}}>{error["type"]}</span>
                    </div>

                    <div className="form-group">
                      <strong>Raza: </strong>
                      <input type="text" className="form-control mb-2" name="breed" 
                      placeholder="Ingrese un dato..." onChange={ handleChange } value={animal.breed}/>
                      <span style={{color: "red"}}>{error["breed"]}</span>
                    </div>

                    <div className="form-group">
                      <strong>Fecha de nacimiento: </strong>
                      <input type="text" className="form-control mb-2" name="birth_date" 
                      placeholder="Ingrese un dato..." onChange={ handleChange } value={animal.birth_date}/>
                      <span style={{color: "red"}}>{error["birth_date"]}</span>
                    </div>

                  </div>

                  <div className="col-6">

                    <div className="form-group">
                      <strong>Nombre del dueño: </strong>
                      <input type="text" className="form-control mb-2" name="owner_name" 
                      placeholder="Ingrese un dato..." onChange={ handleChange } value={animal.owner_name}/>
                      <span style={{color: "red"}}>{error["owner_name"]}</span>
                    </div>
                    
                    <div className="form-group">
                      <strong>Teléfono del dueño: </strong>
                      <input type="text" className="form-control mb-2" name="owner_tel" 
                      placeholder="Ingrese un dato..." onChange={ handleChange } value={animal.owner_tel}/>
                      <span style={{color: "red"}}>{error["owner_tel"]}</span>
                    </div>
                      
                    <div className="form-group">
                      <strong>Dirección del dueño: </strong>
                      <input type="text" className="form-control mb-2" name="owner_address" 
                      placeholder="Ingrese un dato..." onChange={ handleChange } value={animal.owner_address}/>
                      <span style={{color: "red"}}>{error["owner_address"]}</span>
                    </div>
                      
                    <div className="form-group">
                      <strong>E-mail del dueño: </strong>
                      <input type="text" className="form-control mb-2" name="owner_email" 
                      placeholder="Ingrese un dato..." onChange={ handleChange } value={animal.owner_email}/>
                      <span style={{color: "red"}}>{error["owner_email"]}</span>
                    </div>

                  </div>

                </div>

                {error["operations"] !== null && <span>{error["operations"]}</span>}

              </div>
            </ModalBody>
            <ModalFooter>
              <button className={editMode ? "btn btn-warning btn-block" : "btn btn-success btn-block"} 
              type="submit">{ editMode ? "Guardar" : "Agregar"}</button>
              <button className="btn btn-danger btn-block" type="button" onClick={()=> cancelOpenModal()}>Cancelar</button>
            </ModalFooter>
          </form>
        </Modal>

        <Modal isOpen={detailModal}>
          <ModalHeader>Datos de la Mascota</ModalHeader>
            <ModalBody>
                <div className="form-group">

                  <div className="row">

                    <div className="col-6">

                      <label>Nombre: </label>
                      <input type="text" className="form-control mb-2" value={animal.name} readOnly/>

                      <label>Tipo: </label>
                      <input type="text" className="form-control mb-2" value={animal.type} readOnly/>

                      <label>Raza: </label>
                      <input type="text" className="form-control mb-2" value={animal.breed} readOnly/>

                      <label>Fecha de nacimiento: </label>
                      <input type="text" className="form-control mb-2" value={animal.birth_date} readOnly/>

                    </div>

                    <div className="col-6">

                      <label>Nombre del dueño: </label>
                      <input type="text" className="form-control mb-2" value={animal.owner_name} readOnly/>

                      <label>Teléfono del dueño: </label>
                      <input type="text" className="form-control mb-2" value={animal.owner_tel} readOnly/>

                      <label>Dirección del dueño: </label>
                      <input type="text" className="form-control mb-2" value={animal.owner_address} readOnly/>

                      <label>E-mail del dueño: </label>
                      <input type="text" className="form-control mb-2" value={animal.owner_email} readOnly/>

                    </div>

                  </div>
                </div>
            </ModalBody>
            <ModalFooter>
              <button onClick={cancelDetailModal} className="btn btn-dark btn-block" type="button">Cerrar</button>
            </ModalFooter>
        </Modal>

        <Modal isOpen={deleteModal}>
          <ModalBody>
            ¿Estás seguro que deseas eliminar esta mascota?
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={()=> deleteAnimal(id)}>Si</button>
            <button className="btn btn-secondary" onClick={()=> toggleDeleteModal("")}>No</button>
            {error["operations"] !== null && <span>{error["operations"]}</span>}
          </ModalFooter>
        </Modal>

      </div>
    </div>
  );
}

export default App;
