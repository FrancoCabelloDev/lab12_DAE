import { useNavigate } from "react-router-dom";
import { useState } from "react";

function SerieComponent(props) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const gotoUrl = (codigo) => {
    navigate("/series/edit/" + codigo);
  };

  // Si hay error de imagen o no hay imagen, usa dummyimage
  const imgSrc = !imgError && props.imagen
    ? props.imagen
    : `https://dummyimage.com/400x250/000/fff&text=Sin+Imagen`;

  return (
    <div className="card shadow rounded-lg border border-gray-200 hover:shadow-lg transition mb-4 h-full flex flex-col">
      <img
        className="card-img-top rounded-t-lg object-cover w-full"
        src={imgSrc}
        alt="img"
        style={{ height: "200px", background: "#222" }}
        onError={() => setImgError(true)}
      />
      <div className="card-body p-4 flex flex-col flex-1">
        <h5 className="card-title text-lg font-semibold text-blue-700">{props.nombre}</h5>
        <p className="card-text text-gray-500">{props.categoria}</p>
        <div className="d-flex justify-content-between mt-auto gap-2">
          <button
            onClick={() => gotoUrl(props.codigo)}
            className="btn btn-secondary bg-blue-500 hover:bg-blue-600 text-white border-0 w-full sm:w-auto"
          >
            Editar
          </button>
          <button className="btn btn-danger bg-red-500 hover:bg-red-600 text-white border-0 w-full sm:w-auto">Eliminar</button>
        </div>
      </div>
    </div>
  );
}

export default SerieComponent;
