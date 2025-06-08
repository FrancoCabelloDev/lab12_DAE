import HeaderComponent from "../components/HeaderComponent"
import SerieComponent from "../components/SerieComponent"
import { useEffect, useState } from "react"
import axios from "axios"

function SeriePage() {
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ nombre: "", categoria_id: "", imagen: null });
    const [preview, setPreview] = useState(null);

    // Cargar series desde el backend
    const fetchSeries = () => {
        setLoading(true);
        axios.get("http://localhost:8000/series/api/v1/series/")
            .then(res => {
                const data = res.data;
                setSeries(Array.isArray(data) ? data : (data.results || []));
            })
            .catch(() => setError("Error al cargar series"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchSeries();
        axios.get("http://localhost:8000/series/api/v1/categorias/")
            .then(res => setCategories(Array.isArray(res.data) ? res.data : (res.data.results || [])))
            .catch(() => setCategories([]));
    }, []);

    // Manejo de formulario
    const handleFormChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "imagen") {
            setForm(f => ({ ...f, imagen: files[0] }));
            setPreview(files[0] ? URL.createObjectURL(files[0]) : null);
        } else {
            setForm(f => ({ ...f, [name]: value }));
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("nombre", form.nombre);
        formData.append("categoria_id", form.categoria_id);
        if (form.imagen) formData.append("imagen", form.imagen);
        try {
            await axios.post("http://localhost:8000/series/api/v1/series/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setShowForm(false);
            setForm({ nombre: "", categoria_id: "", imagen: null });
            setPreview(null);
            fetchSeries();
        } catch {
            alert("Error al crear la serie");
        }
    };

    return (
        <>
            <HeaderComponent />
            <div className="container mt-3 max-w-7xl mx-auto px-2 sm:px-4">
                <div className="d-flex flex-col sm:flex-row justify-content-between border-bottom pb-3 mb-3 items-center gap-2">
                    <h3 className="text-2xl font-bold text-blue-700">Series</h3>
                    <div>
                        <button className="btn btn-primary bg-blue-600 hover:bg-blue-700 border-0 w-full sm:w-auto" onClick={() => setShowForm(true)}>Nuevo</button>
                    </div>
                </div>
                {showForm && (
                    <div className="card mb-4 shadow border border-gray-200 max-w-lg mx-auto">
                        <div className="card-body">
                            <form onSubmit={handleFormSubmit}>
                                <div className="mb-3">
                                    <label className="form-label font-semibold">Nombre</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="nombre"
                                        value={form.nombre}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label font-semibold">Categoría</label>
                                    <select
                                        className="form-select"
                                        name="categoria_id"
                                        value={form.categoria_id}
                                        onChange={handleFormChange}
                                        required
                                    >
                                        <option value="">Seleccione una opción</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label font-semibold">Imagen</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        name="imagen"
                                        accept="image/*"
                                        onChange={handleFormChange}
                                    />
                                </div>
                                {preview && (
                                    <div className="mb-3 flex justify-center">
                                        <img
                                            src={preview}
                                            alt="preview"
                                            className="rounded border border-gray-200"
                                            style={{ maxWidth: "400px", maxHeight: "250px" }}
                                        />
                                    </div>
                                )}
                                <div className="d-flex gap-2 flex-col sm:flex-row">
                                    <button type="submit" className="btn btn-success bg-green-600 hover:bg-green-700 border-0 w-full sm:w-auto">Guardar</button>
                                    <button type="button" className="btn btn-secondary bg-gray-400 hover:bg-gray-500 border-0 w-full sm:w-auto" onClick={() => { setShowForm(false); setPreview(null); }}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {loading && <div>Cargando...</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                {!loading && !error && series.length === 0 && (
                    <div className="alert alert-info">No hay series registradas.</div>
                )}
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
                    {series.map((serie) => (
                        <div key={serie.id} className="col flex">
                            <SerieComponent
                                codigo={serie.id}
                                nombre={serie.nombre}
                                categoria={serie.categoria?.nombre}
                                imagen={
                                    serie.imagen && (serie.imagen.startsWith("http://") || serie.imagen.startsWith("https://") || serie.imagen.startsWith("/media/"))
                                        ? (serie.imagen.startsWith("http") ? serie.imagen : `http://localhost:8000${serie.imagen}`)
                                        : `https://dummyimage.com/400x250/000/fff&text=${serie.imagen || "Sin+Imagen"}`
                                }
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default SeriePage
