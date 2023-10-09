function Post({
    post: { id, titulo, img, descripcion, likes },
    like,
    eliminarPost,
    urlBaseServer
  }) {

    const imgUrl = `${urlBaseServer}/${img}`;
    const likeIcon = (
        <img
          src="https://icongr.am/fontawesome/heart.svg?size=20&color=currentColor"
          alt="Me Gusta"
          onClick={() => like(id)}
        />
      );
    return (
      <div className="card col-12 col-sm-4 d-inline mx-0 px-3">
        <div className="card-body d-flex flex-column">
            <div className="text-center mb-3">
          <img className="card-img-top " src={imgUrl}  alt={titulo}/>
          <div className="p-3">
            <h4 className="card-title">{titulo}</h4>
            <p className="card-text">{descripcion}</p>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                {likeIcon}
                <span className="ms-1">{likes}</span>
              </div>
              <button onClick={() => eliminarPost(id)} className="fa-solid fa-x bg-alert">X</button>
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  }
  
  export default Post;
  