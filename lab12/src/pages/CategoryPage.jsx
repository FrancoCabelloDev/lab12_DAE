import HeaderComponent from "../components/HeaderComponent";
import { useState, useEffect } from "react";
import axios from "axios";

function CategoryPage() {
    const [categories, setCategories] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");
    const [newName, setNewName] = useState("");

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
            fetchCategories();
        } catch {
            alert("Error al crear la categoría");
        }
    };

    // Eliminar categoría
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/series/api/v1/categorias/${id}/`);
            fetchCategories();
        } catch {
            alert("Error al eliminar la categoría");
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
            <div className="container mt-3">
                <div className="border-bottom pb-3 mb-3">
                    <h3 className="fw-bold text-primary">Categorías</h3>
                </div>
                <form className="mb-3 row g-2" onSubmit={handleCreate}>
                    <div className="col-sm">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nueva categoría"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-auto">
                        <button type="submit" className="btn btn-primary">Crear</button>
                    </div>
                </form>
                <div className="table-responsive">
                    <table className="table table-striped border rounded">
                        <thead>
                            <tr>
                                <th className="fw-semibold">Nombre</th>
                                <th className="text-center fw-semibold" style={{ width: "100px" }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        {editId === item.id ? (
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editName}
                                                onChange={e => setEditName(e.target.value)}
                                                autoFocus
                                            />
                                        ) : (
                                            item.nombre
                                        )}
                                    </td>
                                    <td className="text-center">
                                        {editId === item.id ? (
                                            <>
                                                <button className="btn btn-success btn-sm me-2" onClick={handleEditSave} type="button">
                                                    <i className="bi bi-check-lg"></i>
                                                </button>
                                                <button className="btn btn-secondary btn-sm" onClick={handleEditCancel} type="button">
                                                    <i className="bi bi-x-lg"></i>
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="btn btn-secondary me-2 btn-sm" onClick={() => handleEdit(item)} type="button">
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)} type="button">
                                                    <i className="bi bi-trash-fill"></i>
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default CategoryPage;
