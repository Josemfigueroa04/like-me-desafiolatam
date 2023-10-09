function Form({ setTitulo, setImg, setDescripcion, agregarPost }) {
    return (
      <div className="form">
        <div className="mb-2">
          <h6>Agregar post</h6>
          <label>Título</label>
          <input
            onChange={(event) => setTitulo(event.target.value)}
            className="form-control"
          />
        </div>
        <div className="mb-2">
          <label>URL de la imagen</label>
          <input
          type="file"
            onChange={(event) => setImg(event.target.files[0])}
            className="form-control"
            name="img"
            accept="image/*"
          />
        </div>
        <div className="mb-3">
          <label>Descripción</label> <br />
          <textarea
            onChange={(event) => setDescripcion(event.target.value)}
            className="form-control"
          ></textarea>
        </div>
        <div className="d-flex">
          <button onClick={agregarPost} className="btn btn-light m-auto">
            Agregar
          </button>
        </div>
      </div>
    );
  }
  
  export default Form;