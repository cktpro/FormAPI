import React, { memo, useCallback, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./form.css";
import axios from "axios";
const REGISTER_STEP = {
  EMAIL_STEP: 1,
  INFO_STEP: 2,
  LOGIN_STEP: 3,
  SUCCESS_STEP: 4,
};
const info = {
  email: "",
  name: "",
  password: "",
};
function Form(props) {
  const registerEmail = (data) => {
    const url = "https://64a5087500c3559aa9bef155.mockapi.io/User";
    // Promise
    axios
      .post(url, data)
      .then((result) => {
        console.log(result.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const checkEmail = (email) => {
    const url = "https://64a5087500c3559aa9bef155.mockapi.io/User";
    // Promise
    axios
      .get(url)
      .then((result) => {
        const user = result.data;

        const found = user.find((obj) => {
          return obj.email === email;
        });
        if (found) {
          info.email = found.email;
          info.name = found.name;
          info.password = found.password;
          setCurrentStep((step) => step + 2);
        } else {
          setCurrentStep((step) => step + 1);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const checkLogin = (data) => {
    const url = "https://64a5087500c3559aa9bef155.mockapi.io/User";
    // Promise
    axios
      .get(url)
      .then((result) => {
        const user = result.data;

        const found = user.find((obj) => {
          return obj.password === data.password;
        });
        if (found) {
          setCurrentStep((step) => step + 1);
        } else {
          document.getElementById("invalid-feedback").innerHTML="Đăng nhập thất bại";
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const [currentStep, setCurrentStep] = useState(REGISTER_STEP.EMAIL_STEP);

  const validationEmail = useFormik({
    initialValues: {
      email: "",
    },

    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format").required("Required!"),
    }),
    onSubmit: (values) => {
      const { email } = values;
      // step 1: call Api and verify email
      // step 2: nếu thành công thì  chuyển sang step tiếp theo
      // step 2: nếu thất bại => hiển thị lỗi
      // setCurrentStep(REGISTER_STEP.INFO_STEP);
      checkEmail(email);
    },
  });
  const validationLogin = useFormik({
    initialValues: {
      password: "",
    },

    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Minimum 8 characters")
        .required("Password is Required!"),
    }),

    onSubmit: (values) => {
      const { password } = values;
      const data = {
        email: validationEmail.values.email,
        password: password,
      };
      checkLogin(data);
      // step 1: call Api and verify email
      // step 2: nếu thành công thì  chuyển sang step tiếp theo
      // step 2: nếu thất bại => hiển thị lỗi
      // setCurrentStep(REGISTER_STEP.INFO_STEP);
    },
  });
  const validationInfo = useFormik({
    initialValues: {
      name: "",
      password: "",
    },

    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Mininum 3 characters")
        .max(20, "Maximum 20 characters")
        .required("Name is Required!"),
      password: Yup.string()
        .min(8, "Minimum 8 characters")
        .required("Password is Required!"),
    }),

    onSubmit: (values) => {
      const { name, password } = values;
      // const { email, password } = values;

      const data = {
        email: validationEmail.values.email,
        name: name,
        password: password,
      };
      registerEmail(data);
      // onSubmitAsync({ email, password })

      setCurrentStep(REGISTER_STEP.SUCCESS_STEP);
    },
  });

  const buttonContent = useMemo(() => {
    switch (currentStep) {
      case REGISTER_STEP.EMAIL_STEP:
        return "Continue";

      case REGISTER_STEP.INFO_STEP:
        return "Agree and continue";
      case REGISTER_STEP.LOGIN_STEP:
        return "Login";

      default:
        return "Continue";
    }
  }, [currentStep]);

  const onClickButton = useCallback(
    (e) => {
      e.preventDefault();

      if (currentStep === REGISTER_STEP.EMAIL_STEP) {
        validationEmail.handleSubmit();
      }

      if (currentStep === REGISTER_STEP.INFO_STEP) {
        validationInfo.handleSubmit();
      }
      if (currentStep === REGISTER_STEP.LOGIN_STEP) {
        validationLogin.handleSubmit();
      }
    },
    [currentStep, validationEmail, validationInfo, validationLogin]
  );

  const getTitle = useMemo(() => {
    switch (currentStep) {
      case REGISTER_STEP.EMAIL_STEP:
        return <h1 className="h3 text-white mb-3 fw-normal">Hi! </h1>;

      case REGISTER_STEP.INFO_STEP:
        return <h1 className="h3 text-white mb-3 fw-normal">Sign up</h1>;
      case REGISTER_STEP.LOGIN_STEP:
        return <h1 className="h3 text-white mb-3 fw-normal">Login</h1>;

      default:
        return;
    }
  }, [currentStep]);

  const isErrorEmail = useMemo(() => {
    if (validationEmail.errors?.email && validationEmail.touched?.email) {
      return true;
    }
    return false;
  }, [validationEmail.errors?.email, validationEmail.touched?.email]);
  const isErrorLogin = useMemo(() => {
    if (validationLogin.errors?.password && validationLogin.touched?.password) {
      return true;
    }
    return false;
  }, [validationLogin.errors?.password, validationLogin.touched?.password]);

  const isErrorInfo = (fieldName) => {
    if (validationInfo.errors[fieldName] && validationInfo.touched[fieldName]) {
      return true;
    }
    return false;
  };
  // return begin
  return (
    <div className="box">
      <div className="child">
        <div className=" form-signin w-100">
          {getTitle}

          {currentStep === REGISTER_STEP.EMAIL_STEP && (
            <>
              <div className="input-group d-block has-validation mb-3">
                <div
                  className={`form-floating ${isErrorEmail && "is-invalid"}`}
                >
                  <input
                    type="text"
                    className={`form-control ${isErrorEmail && "is-invalid"}`}
                    id="floatingEmail"
                    placeholder="name@example.com"
                    name="email"
                    value={validationEmail.values.email}
                    onChange={validationEmail.handleChange}
                    onBlur={validationEmail.handleBlur}
                  />

                  <label htmlFor="floatingEmail">Email</label>
                </div>
                {isErrorEmail && (
                  <div className="invalid-feedback fs-6 mt-3">
                    {validationEmail.errors?.email}
                  </div>
                )}
              </div>
            </>
          )}

          {currentStep === REGISTER_STEP.INFO_STEP && (
            <>
              <div className="term text-start my-3">
                Look like you don't have an account.
                <br />
                Let create new account for
                <br />
                <span className="fw-bolder">
                  {validationEmail.values.email}
                </span>
              </div>
              <div className="input-group d-block has-validation mb-3">
                <div
                  className={`form-floating ${
                    isErrorInfo("name") && "is-invalid"
                  }`}
                >
                  <input
                    type="text"
                    className={`form-control ${
                      isErrorInfo("name") && "is-invalid"
                    }`}
                    id="floatingName"
                    placeholder="Name"
                    name="name"
                    value={validationInfo.values.name}
                    onChange={validationInfo.handleChange}
                    onBlur={validationInfo.handleBlur}
                  />

                  <label htmlFor="floatingName">Name</label>
                </div>
                {isErrorInfo("name") && (
                  <div className="invalid-feedback fs-6 mt-3">
                    {validationInfo.errors?.name}
                  </div>
                )}
              </div>

              <div className="input-group d-block has-validation mb-3">
                <div
                  className={`form-floating ${
                    isErrorInfo("password") && "is-invalid"
                  }`}
                >
                  <input
                    type="password"
                    className={`form-control ${
                      isErrorInfo("password") && "is-invalid"
                    }`}
                    id="floatingPass"
                    placeholder="***"
                    name="password"
                    value={validationInfo.values.password}
                    onChange={validationInfo.handleChange}
                    onBlur={validationInfo.handleBlur}
                  />

                  <label htmlFor="floatingPass">Password</label>
                </div>
                {isErrorInfo("password") && (
                  <div className="invalid-feedback fs-6 mt-3">
                    {validationInfo.errors?.password}
                  </div>
                )}
              </div>
              <div className="term text-start my-3">
                By selecting Agree and continue below,
                <br />I agree to{" "}
                <a className="link" href="">
                  Terms of Services and Privacy Policy
                </a>
              </div>
            </>
          )}
          {currentStep === REGISTER_STEP.LOGIN_STEP && (
            <>
            <div className="term text-start my-3">
                {info.name}
                <br />
                  <span className="fw-bold">{info.email}</span>
              </div>
              <div className="input-group d-block has-validation mb-3">
                <div
                  className={`form-floating ${isErrorLogin && "is-invalid"}`}
                >
                  <input
                    type="password"
                    className={`form-control ${isErrorLogin && "is-invalid"}`}
                    id="floatingEmail"
                    placeholder="password"
                    name="password"
                    value={validationLogin.values.password}
                    onChange={validationLogin.handleChange}
                    onBlur={validationLogin.handleBlur}
                  />

                  <label htmlFor="floatingEmail">Password</label>
                </div>
                {isErrorLogin && (
                  <div  className="fs-6 invalid-feedback mt-3">
                    {validationLogin.errors?.password}
                  </div>
                )}
                {
                  !validationLogin.errors.password &&(
                    <div id="invalid-feedback" className="fs-6 text-danger mt-3"></div>
                  )
                }
                
              </div>
            </>
          )}
          {currentStep === REGISTER_STEP.SUCCESS_STEP && (
            <>
              <div className="p-3 alert alert-success">
                Success!!!
              </div>
            </>
          )}

          {currentStep !== REGISTER_STEP.SUCCESS_STEP && (
            <button
              className="btn btn-green w-100 py-3"
              type="submit"
              onClick={onClickButton}
            >
              {/* {
          currentStep === REGISTER_STEP.EMAIL_STEP ? 'Continue' : '| Agree and continue'
        } */}
              {buttonContent}
            </button>
          )}
          {currentStep === REGISTER_STEP.LOGIN_STEP && (
            <div className="term text-start my-3">
              <a className="link" href="">
                Forgot your password?
              </a>
            </div>
          )}
          {currentStep === REGISTER_STEP.EMAIL_STEP && (
            <>
              <div className="my-2 text-white">
                <h5>or</h5>
              </div>
              <button className="btn btn-white w-100 py-3 mb-3">
                <img
                  className="logo"
                  src={require("assets/cover/facebook.png")}
                  alt="logo-facebook"
                />
                Continue with Facebook
              </button>
              <button className="btn btn-white w-100 py-3 mb-3">
                <img
                  className="logo"
                  src={require("assets/cover/google.png")}
                  alt="logo-google"
                />
                Continue with Google
              </button>
              <button className="btn btn-white w-100 py-3">
                <img
                  className="logo"
                  src={require("assets/cover/apple.png")}
                  alt="logo-apple"
                />
                Continue with Apple
              </button>
              <div className="term text-start my-3">
                <p className="text-white mb-0">
                  Don't have an account?{" "}
                  <a className="link" href="#">
                    Sign up
                  </a>
                </p>
                <p>
                  <a className="link" href="#">
                    Forgot your password?
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(Form);
