import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";
import axios from "axios";

// Estado inicial para el formulario
const initData = { nombre: "", categoria_id: "", imagen: null };

function SerieFormPage() {
  const { idserie } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(initData);
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);

  // Cargar categorías desde el backend
  useEffect(() => {
    axios
      .get("http://localhost:8000/series/api/v1/categorias/")
      .then((res) =>
        setCategories(Array.isArray(res.data) ? res.data : res.data.results || [])
      )
      .catch(() => setCategories([]));
  }, []);

  // Si es edición, cargar datos de la serie desde el backend
  useEffect(() => {
    if (idserie) {
      axios
        .get(`http://localhost:8000/series/api/v1/series/${idserie}/`)
        .then((res) => {
          setData({
            nombre: res.data.nombre,
            categoria_id: res.data.categoria?.id || "",
            imagen: null, // No pre-cargamos archivo, solo preview
          });
          if (res.data.imagen) {
            setPreview(
              res.data.imagen.startsWith("http")
                ? res.data.imagen
                : `http://localhost:8000${res.data.imagen}`
            );
          }
        })
        .catch(() => {});
    }
  }, [idserie]);

  // onChange para el nombre
  const handleNameChange = (e) =>
    setData((prev) => ({ ...prev, nombre: e.target.value }));

  // onChange para la categoría
  const handleCategoryChange = (e) =>
    setData((prev) => ({ ...prev, categoria_id: e.target.value }));

  // Manejo del input file para previsualizar
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setData((prev) => ({ ...prev, imagen: file }));
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // Enviar datos al backend (PUT para editar, POST para crear)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", data.nombre);
    formData.append("categoria_id", data.categoria_id);
    if (data.imagen) {
      formData.append("imagen", data.imagen);
    }
    try {
      if (idserie) {
        await axios.put(`http://localhost:8000/series/api/v1/series/${idserie}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // Recarga la serie para mostrar la imagen real del backend
        const res = await axios.get(`http://localhost:8000/series/api/v1/series/${idserie}/`);
        if (res.data.imagen) {
          setPreview(
            res.data.imagen.startsWith("http")
              ? res.data.imagen
              : `http://localhost:8000${res.data.imagen}`
          );
        }
        navigate("/series");
      } else {
        await axios.post("http://localhost:8000/series/api/v1/series/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        navigate("/series");
      }
    } catch (err) {
      alert("Error al guardar la serie");
    }
  };

  return (
    <>
      <HeaderComponent />
      <div className="container mt-3 max-w-lg mx-auto px-2 sm:px-4">
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-4 border border-gray-200">
          {/* Nombre */}
          <div className="mb-3">
            <label htmlFor="inputName" className="form-label font-semibold">
              Nombre
            </label>
            <input
              id="inputName"
              type="text"
              className="form-control rounded border-gray-300"
              value={data.nombre}
              onChange={handleNameChange}
              required
            />
          </div>

          {/* Categoría */}
          <div className="mb-3">
            <label htmlFor="inputCategory" className="form-label font-semibold">
              Categoría
            </label>
            <select
              id="inputCategory"
              className="form-select rounded border-gray-300"
              value={data.categoria_id}
              onChange={handleCategoryChange}
              required
            >
              <option value="">Seleccione una opción</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Imagen (archivo) */}
          <div className="mb-3">
            <label htmlFor="inputImage" className="form-label font-semibold">
              Imagen
            </label>
            <input
              id="inputImage"
              type="file"
              className="form-control rounded border-gray-300"
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>

          {/* Previsualización */}
          <div className="mb-3">
            {preview && (
              <img
                className="card-img-top rounded border border-gray-200"
                style={{ maxWidth: "400px", maxHeight: "250px" }}
                src={preview}
                alt="Serie"
              />
            )}
          </div>

          {/* Botones */}
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary bg-blue-600 hover:bg-blue-700 border-0">
              Guardar
            </button>
            <button
              type="button"
              className="btn btn-secondary bg-gray-400 hover:bg-gray-500 border-0"
              onClick={() => navigate("/series")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default SerieFormPage;
