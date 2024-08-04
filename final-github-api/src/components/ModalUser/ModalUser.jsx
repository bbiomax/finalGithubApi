import styles from "./ModalUser.module.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useEffect, useState } from "react";
import { fetchUserRepos } from "../../api/api";

export default function ModalUser({ user, closeModalUser }) {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    const getRepos = async () => {
      try {
        const reposData = await fetchUserRepos(user.login);
        setRepos(reposData);
      } catch (error) {
        console.error("Ошибка при загрузке репозиториев: ", error);
      }
    };

    getRepos();
  }, [user.login]);

  const settingsIfManyRepos = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };

  const settingsIfNotManyRepos = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const settings =
    repos.length >= 12 ? settingsIfManyRepos : settingsIfNotManyRepos;

  return (
    <div className={styles.wrapper} onClick={closeModalUser}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <section className={styles.headerModal} onClick={closeModalUser}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={styles.closeSvg}
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </section>
        <div className={styles.headerLine}></div>

        <div className={styles.userInfo}>
          <div className={styles.userInfoBox}>
            <section className={styles.userView}>
              <img
                className={styles.userImg}
                src={user.avatar_url}
                alt="userAvatar"
              />
              <div className={styles.userId}>ID: {user.id}</div>
            </section>

            <section className={styles.userDescription}>
              <span style={{ fontSize: "60px" }}>{user.login}</span>
              <span style={{ fontSize: "16px" }}>
                Количество репозиториев: {repos.length}
              </span>
            </section>
          </div>

          <section className={styles.sliderBox}>
            <Slider {...settings} className={styles.slider}>
              {repos.map((repo) => (
                <div key={repo.id} className={styles.repoItem}>
                  <h3 className={styles.repoName}>{repo.name}</h3>
                  <p className={styles.repoDate}>
                    {new Date(repo.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </Slider>
          </section>
        </div>
      </div>
    </div>
  );
}
