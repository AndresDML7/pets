import React, { useState, useEffect} from 'react';
import { isEmpty, size } from 'lodash';
import { addDocument, deleteDocument, getCollection, updateDocument } from './actions';

function App() {

  const [animal, setAnimal] = useState("");
  const [animals, setAnimals] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [id, setId] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      const result = await getCollection("animals");

      if (result.statusResponse) {
        setAnimals(result.data) 
      }
      
      setAnimals(result.data);
    })()
  }, []);

  const validForm = () => {
    let isValid = true;
    setError(null);

    if(isEmpty(animal)) {
      setError("Debes ingresar una mascota.");
      isValid = false;
    }

    return isValid;
  }

  const addAnimal = async (e) => {
    e.preventDefault();

    if(!validForm()) {
      return;
    }

    const result = await addDocument("animals", { name: animal });

    if(!result.statusResponse) {
      setError(result.error);
      return;
    }

    setAnimals([...animals, { id: result.data.id, name: animal }]);
    setAnimal("");
  }

  const saveAnimal = async(e) => {
    e.preventDefault();

    if(!validForm()) {
      return;
    }

    const result = await updateDocument("animals", id, {name: animal} );

    if(!result.statusResponse) {
      setError(result.error);
      return;
    }

    const editedAnimals = animals.map(item => item.id === id ? {id, name: animal} : item)
    setAnimals(editedAnimals);
    setEditMode(false);
    setAnimal("");
    setId("");
  }

  const deleteAnimal = async(id) => {
    const result = await deleteDocument("animals", id);

    if(!result.statusResponse) {
      setError(result.error);
      return;
    }

    const filteredAnimals = animals.filter(animal => animal.id !== id );
    setAnimals(filteredAnimals);
  }

  const editAnimal = (theAnimal) => {
    setAnimal(theAnimal.name);
    setEditMode(true);
    setId(theAnimal.id);
  }

  return (
    <div className="container mt-5">
      <h1>Mascotas</h1>
      <hr/>
      <div className="row">
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

                      <button className="btn btn-danger btn-sm float-right mx-2" 
                        onClick={() => deleteAnimal(animal.id)}>Eliminar</button>

                      <button className="btn btn-warning btn-sm float-right"
                        onClick={() => editAnimal(animal)}>Editar</button>

                    </li>
                  ))
                }
              </ul>
            )
          }

        </div>
        <div className="col-4">
          <h4 className="text-center">{ editMode ? "Modificar Mascota" : "Agreagar Mascota"}</h4>
          <form onSubmit={ editMode ? saveAnimal : addAnimal}>

            <input type="text" className="form-control mb-2" placeholder="Ingrese la mascota..." 
            onChange={(text) => setAnimal(text.target.value) } value={animal}/>

            { error && <span className="text-danger">{error}</span>}

            <button className={editMode ? "btn btn-warning btn-block" : "btn btn-dark btn-block"} 
              type="submit">{ editMode ? "Guardar" : "Agregar"}</button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
