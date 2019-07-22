import React, { Component } from 'react';
import { Link } from "react-router-dom";
import RegisterForm from "../../components/RegisterForm/RegisterForm";
import "./Register.css";

class Register extends Component {

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
      <div className="Register container">
        <h1>Register</h1>
        <RegisterForm onSubmit={this.handleSubmit}/>
      </div>
    )
  }
}

export default Register;
