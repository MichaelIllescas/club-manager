import FormPage, { RemoteList } from "../Components/FormPage";
import { useState, useEffect } from "react";
import apiClient from "../Config/axiosConfig";

const UpdateCategory = () => {
  const [reload, setReload] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get("/api/categories");
        setCategories(response.data);
      } catch (err) {
        console.error("Error al cargar las categorías:", err);
        setError("No se pudieron cargar las categorías. Intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSelectChange = (e) => {
    const categoryId = e.target.value;
    const selected = categories.find(
      (category) => category.id === parseInt(categoryId, 10),
    );
    setSelectedCategory(selected);
    setFormData({ name: selected.name, description: selected.description });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      setMessage({
        text: "Por favor, selecciona una categoría.",
        type: "error",
      });
      return;
    }

    try {
      const updatedCategory = {
        name: formData.name,
        description: formData.description,
      };

      await apiClient.put(
        `/api/categories/${selectedCategory.id}`,
        updatedCategory,
      );

      setMessage({ text: "Categoría actualizada con éxito.", type: "success" });
      setReload((n) => n + 1);

      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat.id === selectedCategory.id
            ? {
                ...cat,
                name: formData.name,
                description: formData.description,
              }
            : cat,
        ),
      );

      setSelectedCategory(null);
      setFormData({ name: "", description: "" });
    } catch (err) {
      console.error("Error al actualizar la categoría:", err);
      setMessage({
        text:
          err.response?.data?.error ||
          "Error al actualizar la categoría. Intente nuevamente.",
        type: "error",
      });
    }
  };

  return (
    <>
      <FormPage
        title="Actualizar categoría"
        intro="Elegí la categoría y corregí su nombre o descripción. Los jugadores asignados la mantienen."
        side={
          <RemoteList
            url="/api/categorias"
            title="Categorías actuales"
            empty="Todavía no hay categorías registradas."
            reload={reload}
            toItem={(c) => ({
              id: c.id,
              name: c.name,
              detail: c.description,
              value: null,
            })}
          />
        }
      >
        {loading ? (
          <p className="text-center">Cargando categorías...</p>
        ) : error ? (
          <p className="text-center text-danger">{error}</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="categorySelect" className="form-label">
                Selecciona una categoría
              </label>
              <select
                id="categorySelect"
                className="form-select"
                onChange={handleSelectChange}
                defaultValue=""
                required
              >
                <option value="" disabled>
                  -- Selecciona --
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedCategory && (
              <div className="mb-3">
                <p>
                  <strong>Categoría actual:</strong> {selectedCategory.name}
                </p>
                <p>
                  <strong>Descripción actual:</strong>{" "}
                  {selectedCategory.description}
                </p>
              </div>
            )}

            {selectedCategory && (
              <>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Nuevo nombre:
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Nueva descripción:
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
              </>
            )}

            {message && (
              <p
                className={`fw-bold text-center ${
                  message.type === "success" ? "text-success" : "text-danger"
                }`}
              >
                {message.text}
              </p>
            )}

            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!selectedCategory}
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        )}
      </FormPage>
    </>
  );
};

export default UpdateCategory;
