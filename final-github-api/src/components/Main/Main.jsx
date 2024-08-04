import { useEffect, useState } from "react";
import styles from "./Main.module.css";
import ModalUser from "../ModalUser/ModalUser";
import { fetchUserRepos, fetchUsers } from "../../api/api";

export default function Main() {
  const [username, setUsername] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [users, setUsers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const fetchUsersData = async () => {
    if (username.trim() === "") {
      setUsers([]);
      return;
    }

    setIsLoading(true);

    try {
      setUsers([]);
      const usersData = await fetchUsers(username);

      const usersWithRepos = await Promise.all(
        usersData.map(async (user) => {
          const reposData = await fetchUserRepos(user.login);
          return { ...user, repos: reposData };
        })
      );

      usersWithRepos.sort((a, b) =>
        sortOrder === "asc"
          ? a.repos.length - b.repos.length
          : b.repos.length - a.repos.length
      );

      setUsers(usersWithRepos);
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, [sortOrder]);

  const handleSearch = () => {
    fetchUsersData();
  };

  const openModalUser = (user) => {
    console.log(user);
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModalUser = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <>
      {/* Поиск */}
      <div className={styles.searchContainer}>
        <div onClick={handleSearch} className={styles.searchImg}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={styles.searchImgSvg}
          >
            <path
              fillRule="evenodd"
              d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <input
          className={styles.inputSearch}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Введите имя пользователя"
        />
      </div>

      {/* Фильтры */}
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

      {/* Контент */}
      <div className={styles.container}>
        {isLoading ? (
          <div className={styles.loader}></div>
        ) : (
          currentUsers.map((user) => (
            <div
              key={user.id}
              className={styles.userItem}
              onClick={() => openModalUser(user)}
            >
              <img
                src={user.avatar_url}
                alt="userImg"
                className={styles.userImg}
              ></img>
              <div className={styles.userInfo}>
                <div className={styles.username}>{user.login}</div>
                <div className={styles.infoLine}></div>

                <div className={styles.userDescription}>
                  Кол-во репозиториев: {user?.repos.length}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

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

      {isModalOpen && (
        <ModalUser user={selectedUser} closeModalUser={closeModalUser} />
      )}
    </>
  );
}
