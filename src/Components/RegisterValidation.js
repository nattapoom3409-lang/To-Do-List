function Validation(values) {
  let error = {};
  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;   // ใช้ regex แบบยืดหยุ่นกว่า
  const password_pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  if (values.firstname === "") {
    error.firstname = "* Please Input Your First Name";
  } else {
    error.firstname = "";
  }

  if (values.lastname === "") {
    error.lastname = "* Please Input Your Last Name";
  } else {
    error.lastname = "";
  }

  if (values.email === "") {
    error.email = "* Please Input Email";
  } else if (!email_pattern.test(values.email)) {
    error.email = "* Email Invalid";
  } else {
    error.email = "";
  }

  if (values.password === "") {
    error.password = "* Please Input Password";
  } else if (!password_pattern.test(values.password)) {
    error.password = "* Password Invaid";   
  } else {
    error.password = "";
  }

  return error;
}

export default Validation;
