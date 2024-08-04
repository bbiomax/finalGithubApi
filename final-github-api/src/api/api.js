const token = "";

export const fetchUsers = async (username) => {
  if (username.trim() === "") {
    return [];
  }

  const response = await fetch(
    `https://api.github.com/search/users?q=${username}`,
    {
      headers: {
        Authorization: `token ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error("Ошибка при получении данных");

  const data = await response.json();
  return data.items;
};

export const fetchUserRepos = async (username) => {
  const reposResponse = await fetch(
    `https://api.github.com/users/${username}/repos`,
    {
      headers: {
        Authorization: `token ${token}`,
      },
    }
  );

  if (!reposResponse.ok) throw new Error("Ошибка при получении репозиториев");

  const reposData = await reposResponse.json();
  return reposData;
};
