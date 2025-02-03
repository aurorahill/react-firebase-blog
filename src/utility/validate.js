export const validateTitle = (value) => {
  if (!value.trim()) {
    return "Tytuł jest wymagany.";
  }
  if (value.trim().length < 3) {
    return "Tytuł musi mieć co najmniej 3 znaki.";
  }
  return "";
};

export const validateDescription = (value) => {
  if (!value.trim()) {
    return "Opis jest wymagany.";
  }
  if (value.trim().split(" ").length < 80) {
    return "Opis musi mieć co najmniej 80 słów.";
  }
  return "";
};

export const validateCategory = (value) => {
  if (value === "Wybierz kategorię") {
    return "Kategoria jest wymagana.";
  }
  return "";
};

export const validateImgURL = (value) => {
  if (!value.trim()) {
    return "URL obrazu jest wymagany.";
  }
  return "";
};

export const validatePassword = (value) => {
  if (!value.trim()) {
    return "Hasło jest wymagane.";
  }
  if (value.trim().length < 6) {
    return "Hasło musi mieć co najmniej 6 znaków.";
  }
  return "";
};

export const matchingPasswords = (password1, password2) => {
  if (password1 !== password2) {
    return "Hasła muszą być takie same!";
  }
  return "";
};

export const validateEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email)) {
    return "Wprowadź poprawny adres email!";
  }
  return "";
};

export const validateFirstName = (value) => {
  if (!value.trim()) {
    return "Imię jest wymagane.";
  }
  if (value.trim().length < 3) {
    return "Imię musi mieć co najmniej 3 znaki.";
  }
  return "";
};

export const validateLastName = (value) => {
  if (!value.trim()) {
    return "Nazwisko jest wymagane.";
  }
  if (value.trim().length < 3) {
    return "Nazwisko musi mieć co najmniej 3 znaki.";
  }
  return "";
};
