import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { gql } from "apollo-boost";
import { Mutation } from "react-apollo";
import RegisterForm from "../../components/RegisterForm/RegisterForm";
import "./Register.css";

const REGISTER_USER = gql`
  mutation registerUser($userName: String!, $email: String!, $password: String!) {
    registerUser(userName: $userName, email: $email, password: $password) {
      userName,
      email,
    }
  }
`;


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
      <Mutation mutation={REGISTER_USER}>
        {(registerUser, { data, error, loading, called, ...rest}) => (
          <div className="Register container">
            {error && <p>Error: {error.message}</p>}
            <h1>Register</h1>
            <RegisterForm onSubmit={(values, actions) => {
              //console.log(values);
              registerUser({ variables: values });
            }}/>
          </div>
        )}
      </Mutation>
    )
  }
}

export default Register;
