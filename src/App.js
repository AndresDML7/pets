import React, { useState, useEffect} from 'react';
import { isEmpty, size } from 'lodash';
import { addDocument, deleteDocument, getCollection, updateDocument } from './actions';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [animal, setAnimal] = useState({
    name: "",
    type: ""
  });
  const [animals, setAnimals] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [id, setId] = useState("");
  const [error, setError] = useState(null);

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
    setError(null);

    if(isEmpty(animal)) {
      setError("Asegúrate de ingresar todos los datos.");
      isValid = false;
    }

    return isValid;
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setAnimal({ ...animal, [name]: value });
  }

  const addAnimal = async (e) => {
    e.preventDefault();

    if(!validForm()) {
      return;
    }

    console.log(animal);
    const result = await addDocument("animals", {name: animal.name, type: animal.type});

    if(!result.statusResponse) {
      setError(result.error);
      return;
    }

    setAnimals([...animals, { id: result.data.id, name: animal.name, type: animal.type }]);
    setAnimal({
      name: "",
      type: ""
    });
    toggleOpenModal();
  }

  const saveAnimal = async(e) => {
    e.preventDefault();

    if(!validForm()) {
      return;
    }

    const result = await updateDocument("animals", id, {name: animal.name, type: animal.type} );

    if(!result.statusResponse) {
      setError(result.error);
      return;
    }

    const editedAnimals = animals.map(item => item.id === id ? {id, name: animal.name, type: animal.type} : item);
    setAnimals(editedAnimals);
    setEditMode(false);
    setAnimal({
      name: "",
      type: ""
    });
    setId("");
    toggleOpenModal();
  }

  const deleteAnimal = async() => {
    const result = await deleteDocument("animals", id);

    if(!result.statusResponse) {
      setError(result.error);
      return;
    }

    const filteredAnimals = animals.filter(animal => animal.id !== id );
    setAnimals(filteredAnimals);
    toggleDeleteModal("");
  }

  const editAnimal = (theAnimal) => {

    setAnimal({name: theAnimal.name, type: theAnimal.type});
    setEditMode(true);
    setId(theAnimal.id);
    toggleOpenModal();
  }

  const detailAnimal = (theAnimal) => {

    setAnimal({name: theAnimal.name, type: theAnimal.type});
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
    setAnimal({
      name: "",
      type: ""
    });
    setId("");
    toggleOpenModal();
  }

  const cancelDetailModal = () => {
    setEditMode(false);
    setAnimal({
      name: "",
      type: ""
    });
    setId("");
    toggleDetailModal();
  }

  return (
    <div className="container mt-5">
      <h1>Mascotas</h1>
      <hr/>
      <div>
        <div className="col-8">
          <h4 className="text-center">Lista de Mascotas</h4>

          {
            size(animals) === 0 ? (
              <li className="list-group-item">Aún no hay mascotas ingresadas.</li>
            ) : (
              <ul className="list-group">
                {
                  animals.map((animal) => (
                    <li className="list-group-item" key={animal.id}>
                      {animal.name}

                      <button className="btn btn-danger btn-sm float-right" 
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

                  <label>Nombre: </label>
                  <input type="text" className="form-control mb-2" name="name" 
                  placeholder="Ingrese el nombre de la mascota..." onChange={ handleChange } value={animal.name}/>

                  <label>Tipo: </label>
                  <input type="text" className="form-control mb-2" name="type" 
                  placeholder="Ingrese el tipo de mascota..." onChange={ handleChange } value={animal.type}/>

                  { error && <span className="text-danger">{error}</span>}

                </div>
            </ModalBody>
            <ModalFooter>
            <button className={editMode ? "btn btn-warning btn-block" : "btn btn-success btn-block"} 
              type="submit">{ editMode ? "Guardar" : "Agregar"}</button>
            <button className="btn btn-danger" type="button" onClick={()=> cancelOpenModal()}>Cancelar</button>
            </ModalFooter>
          </form>
        </Modal>

        <Modal isOpen={detailModal}>
          <ModalHeader>Datos de la Mascota</ModalHeader>
            <ModalBody>
                <div className="form-group">

                  <label>Nombre: </label>
                  <input type="text" className="form-control mb-2" value={animal.name} readOnly/>

                  <label>Tipo: </label>
                  <input type="text" className="form-control mb-2" value={animal.type} readOnly/>

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
            <button className="btn btn-secondary" onClick={()=> toggleDeleteModal("")}>No</button>
            <button className="btn btn-danger" onClick={()=> deleteAnimal(id)}>Si</button>
          </ModalFooter>
        </Modal>

      </div>
    </div>
  );
}

export default App;
