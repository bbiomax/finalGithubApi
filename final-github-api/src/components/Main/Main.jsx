import { useEffect, useState } from "react";
import styles from "./Main.module.css";
import ModalUser from "../ModalUser/ModalUser";
import { fetchUserRepos, fetchUsers } from "../../api/api";
import Search from "../Search/Search";
import Filters from "../Filters/Filters";
import Pagination from "../Pagination/Pagination";

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
      <Search
        handleSearch={handleSearch}
        username={username}
        setUsername={setUsername}
      />

      {/* Фильтры */}
      <Filters setSortOrder={setSortOrder} sortOrder={sortOrder} />

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

      <Pagination
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />

      {isModalOpen && (
        <ModalUser user={selectedUser} closeModalUser={closeModalUser} />
      )}
    </>
  );
}
