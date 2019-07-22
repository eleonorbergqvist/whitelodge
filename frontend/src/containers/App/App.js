import React from 'react';
import { Switch, Route, BrowserRouter } from "react-router-dom";
import ApolloClient, { gql } from "apollo-boost";
import { ApolloProvider, Query } from "react-apollo";
import Register from "../Register/Register";
import Login from "../Login/Login";
import './App.css';

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql"
});


const App = () => {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App__Header">
          <ListUsers />
        </header>
        <BrowserRouter>
          <Switch>
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
          </Switch>
        </BrowserRouter>
      </div>
    </ApolloProvider>
  );
}

const ListUsers = () => (
  <Query
    query={gql`
      {
        users {
          userName
          firstName
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return data.users.map(({ userName }) => (
        <div key={userName}>
          <p>{userName}</p>
        </div>
      ));
    }}
  </Query>
)

export default App;
