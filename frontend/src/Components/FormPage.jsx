import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import apiClient from "../Config/axiosConfig";
import Header from "../Navbar/Header";
import Footer from "../Pages/Footer";
import "./FormPage.css";

// Shared layout for create and edit screens:
// the form on the left and, when there is one, context on the right.
const FormPage = ({ title, intro, side, wide = false, children }) => (
  <>
    <Header />
    <main className={`container form-page ${side ? "" : wide ? "form-page--wide" : "form-page--single"}`}>
      <section className="panel form-page__panel">
        <h1 className="form-page__title">{title}</h1>
        {intro && <p className="form-page__intro">{intro}</p>}
        {children}
      </section>
      {side}
    </main>
    <Footer />
  </>
);

FormPage.propTypes = {
  title: PropTypes.string.isRequired,
  intro: PropTypes.node,
  side: PropTypes.node,
  wide: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

// Side list with the existing records (newest first)
export const SideList = ({ title, items, empty, highlightId, limit = 8 }) => {
  const visibleItems = [...items].reverse().slice(0, limit);

  return (
    <aside className="panel form-page__panel">
      <h2 className="form-page__list-title">{title}</h2>
      <p className="form-page__list-subtitle">
        {items.length === 1 ? "1 registro" : `${items.length} registros`}
        {items.length > limit ? ` · se muestran los últimos ${limit}` : ""}
      </p>
      {items.length === 0 ? (
        <p className="form-page__empty">{empty}</p>
      ) : (
        <ul className="form-page__list">
          {visibleItems.map((item) => (
            <li
              key={item.id}
              className={`form-page__item ${item.id === highlightId ? "form-page__item--new" : ""}`}
            >
              <span>
                <span className="form-page__item-name">{item.name}</span>
                {item.detail && <span className="form-page__item-detail">{item.detail}</span>}
              </span>
              {item.value && <span className="form-page__item-value">{item.value}</span>}
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

SideList.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.node.isRequired,
      detail: PropTypes.node,
      value: PropTypes.node,
    })
  ).isRequired,
  empty: PropTypes.string.isRequired,
  highlightId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  limit: PropTypes.number,
};

// Side list that loads its own data and reloads when "reload" changes
export const RemoteList = ({ url, toItem, reload = 0, ...props }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    apiClient
      .get(url)
      .then((response) => setItems(response.data.map(toItem)))
      .catch(() => setItems([]));
    // toItem comes from the screen; only url and reload trigger a reload
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, reload]);

  return <SideList items={items} {...props} />;
};

RemoteList.propTypes = {
  url: PropTypes.string.isRequired,
  toItem: PropTypes.func.isRequired,
  reload: PropTypes.number,
  title: PropTypes.string.isRequired,
  empty: PropTypes.string.isRequired,
};

// Side text panel, for screens without a list to show
export const SideNote = ({ title, children }) => (
  <aside className="panel form-page__panel">
    <h2 className="form-page__list-title">{title}</h2>
    <div className="form-page__note">{children}</div>
  </aside>
);

SideNote.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default FormPage;
