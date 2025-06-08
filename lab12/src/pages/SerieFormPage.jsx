import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";

// 3. Estructura inicial para el estado
const initData = { cod: "", nom: "", cat: "", img: "" };

// lista de series inicial
const defaultSeriesList = [
  { cod: 1, nom: "Friends",             cat: "Comedy", img: "friends.png" },
  { cod: 2, nom: "Law & Order",         cat: "Drama",  img: "law-and-order.png" },
  { cod: 3, nom: "The Big Bang Theory", cat: "Comedy", img: "the-big-bang-theory.png" },
  { cod: 4, nom: "Stranger Things",     cat: "Horror", img: "stranger-things.png" },
  { cod: 5, nom: "Dr. House",           cat: "Drama",  img: "dr-house.png" },
  { cod: 6, nom: "The X-Files",         cat: "Drama",  img: "the-x-files.png" },
];

// lista de categorías inicial
const defaultCategoriesList = [
  { cod: 1, nom: "Horror" },
  { cod: 2, nom: "Comedy" },
  { cod: 3, nom: "Action" },
  { cod: 4, nom: "Drama" },
];

function SerieFormPage() {
  const { idserie } = useParams();
  const navigate = useNavigate();

  // 4. Estado único para todo el formulario
  const [data, setData] = useState(initData);

  // Obtener lista de series de localStorage o usar la predeterminada
  const getSeriesList = () => {
    const stored = localStorage.getItem("seriesList");
    return stored ? JSON.parse(stored) : defaultSeriesList;
  };

  // Obtener lista de categorías de localStorage o usar la predeterminada
  const getCategoriesList = () => {
    const stored = localStorage.getItem("categoriesList");
    return stored ? JSON.parse(stored) : defaultCategoriesList;
  };

  const [categories, setCategories] = useState(getCategoriesList());

  // Actualizar categorías si cambian en localStorage (por ejemplo, si se vuelve a esta página)
  useEffect(() => {
    setCategories(getCategoriesList());
  }, []);

  // 14. Al montar, cargo los valores iniciales
  useEffect(() => {
    const codeNum = Number(idserie);
    const list = getSeriesList();
    const found = list.find((s) => s.cod === codeNum);
    if (found) {
      setData(found);
    }
  }, [idserie]);

  // 6. onChange para el nombre
  const handleNameChange = (e) =>
    setData((prev) => ({ ...prev, nom: e.target.value }));

  // 7. onChange para la categoría
  const handleCategoryChange = (e) =>
    setData((prev) => ({ ...prev, cat: e.target.value }));

  // Manejo del input file para previsualizar
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setData((prev) => ({ ...prev, img: preview }));
  };

  // 9. Al enviar, actualiza localStorage y vuelve al listado
  const handleSubmit = (e) => {
    e.preventDefault();
    const list = getSeriesList();
    const idx = list.findIndex((s) => s.cod === Number(idserie));
    if (idx !== -1) {
      // Si la imagen es un blob, no la guardes en localStorage, usa el nombre anterior si es necesario
      let imgValue = data.img;
      if (data.img.startsWith("blob:")) {
        imgValue = list[idx].img;
      }
      list[idx] = { ...data, cod: Number(idserie), img: imgValue };
      localStorage.setItem("seriesList", JSON.stringify(list));
    }
    navigate("/series");
  };

  return (
    <>
      <HeaderComponent />
      <div className="container mt-3">
        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="mb-3">
            <label htmlFor="inputName" className="form-label">
              Nombre
            </label>
            <input
              id="inputName"
              type="text"
              className="form-control"
              value={data.nom}
              onChange={handleNameChange}
              required
            />
          </div>

          {/* Categoría */}
          <div className="mb-3">
            <label htmlFor="inputCategory" className="form-label">
              Categoría
            </label>
            <select
              id="inputCategory"
              className="form-select"
              value={data.cat}
              onChange={handleCategoryChange}
              required
            >
              <option value="">Seleccione una opción</option>
              {categories.map(cat => (
                <option key={cat.cod} value={cat.nom}>{cat.nom}</option>
              ))}
            </select>
          </div>

          {/* Imagen (archivo) */}
          <div className="mb-3">
            <label htmlFor="inputImage" className="form-label">
              Imagen
            </label>
            <input
              id="inputImage"
              type="file"
              className="form-control"
              onChange={handleImageChange}
            />
          </div>

          {/* Previsualización */}
          <div className="mb-3">
            <img
              className="card-img-top"
              style={{ maxWidth: "400px", maxHeight: "250px" }}
              src={
                data.img.startsWith("blob:")
                  ? data.img
                  : `https://dummyimage.com/400x250/000/fff&text=${data.img}`
              }
              alt="Serie"
            />
          </div>

          {/* Botones */}
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              Guardar
            </button>
            <button
              type="button"
              className="btn btn-secondary"
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
