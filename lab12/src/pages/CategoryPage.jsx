import HeaderComponent from "../components/HeaderComponent";
import { useState, useEffect } from "react";

function CategoryPage() {
    // Leer categorías de localStorage o usar las predeterminadas
    const defaultCategories = [
        { cod: 1, nom: "Horror" },
        { cod: 2, nom: "Comedy" },
        { cod: 3, nom: "Action" },
        { cod: 4, nom: "Drama" },
    ];
    const getCategories = () => {
        const stored = localStorage.getItem("categoriesList");
        return stored ? JSON.parse(stored) : defaultCategories;
    };

    const [categories, setCategories] = useState(getCategories());
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");

    // Sincronizar cambios en localStorage
    useEffect(() => {
        localStorage.setItem("categoriesList", JSON.stringify(categories));
    }, [categories]);

    // Eliminar categoría
    const handleDelete = (cod) => {
        setCategories(categories.filter((cat) => cat.cod !== cod));
    };

    // Iniciar edición
    const handleEdit = (cat) => {
        setEditId(cat.cod);
        setEditName(cat.nom);
    };

    // Guardar edición
    const handleEditSave = () => {
        setCategories(categories.map(cat =>
            cat.cod === editId ? { ...cat, nom: editName } : cat
        ));
        setEditId(null);
        setEditName("");
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
                    <h3>Categorías</h3>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th className="text-center">Id</th>
                            <th className="text-center" style={{ width: "100px" }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((item) => (
                            <tr key={item.cod}>
                                <td>
                                    {editId === item.cod ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editName}
                                            onChange={e => setEditName(e.target.value)}
                                            autoFocus
                                        />
                                    ) : (
                                        item.nom
                                    )}
                                </td>
                                <td className="text-center">{item.cod}</td>
                                <td className="text-center">
                                    {editId === item.cod ? (
                                        <>
                                            <button className="btn btn-success btn-sm me-2" onClick={handleEditSave}>
                                                <i className="bi bi-check-lg"></i>
                                            </button>
                                            <button className="btn btn-secondary btn-sm" onClick={handleEditCancel}>
                                                <i className="bi bi-x-lg"></i>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="btn btn-secondary me-2 btn-sm" onClick={() => handleEdit(item)}>
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.cod)}>
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
        </>
    )
}

export default CategoryPage
