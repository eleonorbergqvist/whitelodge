import React, { Component } from "react";
import { 
  Formik,
  Form, 
  Field, 
  ErrorMessage,
} from 'formik';
import  * as Yup from 'yup';
import "./RegisterForm.css";

const validationSchema = Yup.object().shape({
  userName: Yup.string()
    .required("Username is required!"),
  email: Yup.string()
    .email("E-mail is not valid!")
    .required("E-mail is required!"),
  password: Yup.string()
    .min(6, "Password has to be longer than 6 characters!")
    .required("Password is required!"),
});

class RegisterForm extends Component {
  render() {
    const onSubmit = this.props.onSubmit;
    return (
      <div className="RegisterForm">
        <Formik
          initialValues={{
            userName: '',
            email: '',
            password: ''
          }}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            onSubmit(
              {
                userName: values.userName,
                password: values.password,
                email: values.email,
              },
              actions
            );
          }}
          render={({ errors, status, touched, isSubmitting }) => {
            console.log("render");
            console.log(errors);
            console.log(status);
            return (
              <Form>
                <div className="field">
                  <label className="label">Username</label>
                  <div className="control">
                    <Field className="input" name="userName" />
                    <ErrorMessage className="help is-danger" name="userName" component="p" />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Email</label>
                  <div className="control">
                    <Field className="input" type="email" name="email" />
                    <ErrorMessage className="help is-danger" name="email" component="p" />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Password</label>
                  <div className="control">
                    <Field className="input" type="password" name="password" />
                    <ErrorMessage className="help is-danger" name="password" component="p" />
                  </div>
                </div>

                <button className="button" type="submit">
                  Submit
                </button>
              </Form>
            )
          }}
        />
      </div>
    )
  }
}

export default RegisterForm;
