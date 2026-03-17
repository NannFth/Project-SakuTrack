// ambil data user
export const getUser = () => {
  const id = localStorage.getItem("userId");

  let name = localStorage.getItem("nama");
  let email = localStorage.getItem("email");

  if (name === null) {
    name = "User";
  }

  if (email === null) {
    email = "email@gmail.com";
  }

  return { id, nama: name, email: email };
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