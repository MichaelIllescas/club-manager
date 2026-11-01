import { useEffect, useState } from "react";
import Header from "../Navbar/Header";
import TableGeneric from "../Components/TableGeneric";
import apiClient from "../Config/axiosConfig";
import UpdateMember from "./UpdateMember";
import Footer from "../Pages/Footer";

function ViewMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [memberId, setMemberId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await apiClient.get("/api/members");
        setMembers(response.data);
      } catch (err) {
        setError("Error al obtener los datos.");
        console.error("Error al obtener los socios:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleEditClick = (row) => {
    setMemberId(row.id);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setMemberId(null);
  };

  const handleUpdate = async () => {
    try {
      const response = await apiClient.get("/api/members");
      setMembers(response.data);
    } catch (err) {
      console.error("Error al actualizar la lista de socios:", err);
    }
  };

  const actions = [
    {
      label: "Editar",
      className: "btn-warning m-auto",
      onClick: handleEditClick,
    },
  ];

  return (
    <>
      <Header />
      <div className="container mt-4 mx-auto pt-3 pb-5">
        <div
          className="d-flex flex-column align-items-center justify-content-start pb-5"
          style={{
            marginTop: "20px",
          }}
        >
          <div className="w-100">
            {loading ? (
              <p>Cargando datos...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : (
              <TableGeneric
                columns={[
                  "id",
                  "firstName",
                  "lastName",
                  "dni",
                  "phone",
                  "email",
                  "memberNumber",
                  "registrationDate",
                  "address",
                  "status",
                ]}
                emptyMessage="Todavía no hay socios registrados."
                title={"Socios"}
                data={members}
                actions={actions}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />

      {showModal && memberId && (
        <UpdateMember
          memberId={memberId}
          onClose={handleModalClose}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
}

export default ViewMembers;
