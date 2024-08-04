import styles from "./Filters.module.css";

export default function Filters({setSortOrder, sortOrder}) {
  return (
    <div className={styles.filterContainer}>
      <span>Filters for Repositories:</span>
      <div className={styles.filtersBox}>
        <select
          onChange={(e) => setSortOrder(e.target.value)}
          value={sortOrder}
        >
          <option value="asc">По возрастанию</option>
          <option value="desc">По убыванию</option>
        </select>
      </div>
    </div>
  );
}
