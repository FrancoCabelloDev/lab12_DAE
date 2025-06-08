import HeaderComponent from "../components/HeaderComponent";
import { useState, useEffect } from "react";
import axios from "axios";

function CategoryPage() {
    const [categories, setCategories] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");
    const [newName, setNewName] = useState("");
    const [showForm, setShowForm] = useState(false);

    // Cargar categorías desde el backend
    const fetchCategories = () => {
        axios.get("http://localhost:8000/series/api/v1/categorias/")
            .then(res => setCategories(Array.isArray(res.data) ? res.data : (res.data.results || [])))
            .catch(() => setCategories([]));
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Crear nueva categoría
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        try {
            await axios.post(
                "http://localhost:8000/series/api/v1/categorias/",
                { nombre: newName },
                { headers: { "Content-Type": "application/json" } }
            );
            setNewName("");
            setShowForm(false);
            fetchCategories();
        } catch {
            alert("Error al crear la categoría");
        }
    };

    // Eliminar categoría
    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
            try {
                await axios.delete(`http://localhost:8000/series/api/v1/categorias/${id}/`);
                fetchCategories();
            } catch {
                alert("Error al eliminar la categoría");
            }
        }
    };

    // Iniciar edición
    const handleEdit = (cat) => {
        setEditId(cat.id);
        setEditName(cat.nombre);
    };

    // Guardar edición
    const handleEditSave = async () => {
        try {
            await axios.put(`http://localhost:8000/series/api/v1/categorias/${editId}/`, { nombre: editName });
            setEditId(null);
            setEditName("");
            fetchCategories();
        } catch {
            alert("Error al editar la categoría");
        }
    };

    // Cancelar edición
    const handleEditCancel = () => {
        setEditId(null);
        setEditName("");
    };

    return (
        <>
            <HeaderComponent />
            <div className="container mt-3 max-w-7xl mx-auto px-2 sm:px-4">
                <div className="d-flex flex-col sm:flex-row justify-content-between border-bottom pb-3 mb-3 items-center gap-2">
                    <h3 className="text-2xl font-bold text-blue-700">Categorías</h3>
                    <div>
                        <button 
                            className="btn btn-primary bg-blue-600 hover:bg-blue-700 border-0 w-full sm:w-auto" 
                            onClick={() => setShowForm(true)}
                        >
                            Nuevo
                        </button>
                    </div>
                </div>

                {showForm && (
                    <div className="card mb-4 shadow border border-gray-200 max-w-lg mx-auto">
                        <div className="card-body">
                            <form onSubmit={handleCreate}>
                                <div className="mb-3">
                                    <label className="form-label font-semibold">Nombre de la categoría</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ingrese el nombre de la categoría"
                                        value={newName}
                                        onChange={e => setNewName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="d-flex gap-2 flex-col sm:flex-row">
                                    <button 
                                        type="submit" 
                                        className="btn btn-success bg-green-600 hover:bg-green-700 border-0 w-full sm:w-auto"
                                    >
                                        Guardar
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary bg-gray-400 hover:bg-gray-500 border-0 w-full sm:w-auto" 
                                        onClick={() => { setShowForm(false); setNewName(""); }}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {categories.length === 0 ? (
                    <div className="alert alert-info">No hay categorías registradas.</div>
                ) : (
                    <div className="card shadow border border-gray-200">
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-striped mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="font-semibold px-4 py-3">Nombre</th>
                                            <th className="text-center font-semibold px-4 py-3" style={{ width: "150px" }}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-4 py-3">
                                                    {editId === item.id ? (
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={editName}
                                                            onChange={e => setEditName(e.target.value)}
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        <span className="font-medium">{item.nombre}</span>
                                                    )}
                                                </td>
                                                <td className="text-center px-4 py-3">
                                                    {editId === item.id ? (
                                                        <div className="d-flex gap-2 justify-content-center">
                                                            <button 
                                                                className="btn btn-success btn-sm bg-green-600 hover:bg-green-700 border-0" 
                                                                onClick={handleEditSave} 
                                                                type="button"
                                                            >
                                                                <i className="bi bi-check-lg"></i>
                                                            </button>
                                                            <button 
                                                                className="btn btn-secondary btn-sm bg-gray-400 hover:bg-gray-500 border-0" 
                                                                onClick={handleEditCancel} 
                                                                type="button"
                                                            >
                                                                <i className="bi bi-x-lg"></i>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="d-flex gap-2 justify-content-center">
                                                            <button 
                                                                className="btn btn-outline-primary btn-sm hover:bg-blue-50" 
                                                                onClick={() => handleEdit(item)} 
                                                                type="button"
                                                            >
                                                                <i className="bi bi-pencil-square"></i>
                                                            </button>
                                                            <button 
                                                                className="btn btn-outline-danger btn-sm hover:bg-red-50" 
                                                                onClick={() => handleDelete(item.id)} 
                                                                type="button"
                                                            >
                                                                <i className="bi bi-trash-fill"></i>
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default CategoryPage;