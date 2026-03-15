export const getUser = () => {
  const id = localStorage.getItem("userId");
  let name = localStorage.getItem("user_nama");

  if (name === null) {
    name = "User";
  }

  return { id, nama: name };
};

// Status Login
export const isLoggedIn = () => {
  const id = localStorage.getItem("userId");

  if (id !== null) {
    return true;
  } else {
    return false;
  }
};

export const clearSession = () => {
  localStorage.clear();
};