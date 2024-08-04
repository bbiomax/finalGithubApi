import styles from "./Pagination.module.css";

export default function Pagination({
  totalPages,
  setCurrentPage,
  currentPage,
}) {
  return (
    <div className={styles.pagination}>
      {Array.from({ length: totalPages }, (_, index) => {
        return (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={
              currentPage === index + 1
                ? styles.activePageButton
                : styles.pageButton
            }
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
}
