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
            email: '',
            password: ''
          }}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            onSubmit(
              {
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
                <div class="field">
                  <label class="label">Email</label>
                  <div className="control">
                    <Field className="input" type="email" name="email" />
                    <ErrorMessage className="help is-danger" name="email" component="p" />
                  </div>
                </div>

                <div class="field">
                  <label class="label">Password</label>
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
