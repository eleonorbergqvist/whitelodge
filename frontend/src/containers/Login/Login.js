import React, { Component } from 'react';
import { Link } from "react-router-dom";
import LoginForm from "../../components/LoginForm/LoginForm";
import "./Login.css";

class Login extends Component {

  handleSubmit = async (values, actions) => {
    // actions.setSubmitting(true);

    console.log('SUBMIT');
    console.log(values);

    // const response: ApiResponse<any> = await api.register({
    //   "email": values.email,
    //   "password": values.password,
    // })

    // actions.setSubmitting(false);

    // if (!response.ok) {
    //   let errors = response.data
    //   if (response.status === 404) {
    //     errors = { general: "Service not available, please try again" }
    //   }

    //   if (response.status === 500) {
    //     errors = { general: "Service not available, please try again" }
    //   }

    //   if(!errors) {
    //     errors = { general: "Service not available, please try again" }
    //   }

    //   actions.setErrors(errors);
    //   return;
    // }
  }

  render() {
    return (
      <div className="Login container">
        <h1>Login</h1>
        <LoginForm onSubmit={this.handleSubmit}/>
      </div>
    )
  }
}

export default Login;
