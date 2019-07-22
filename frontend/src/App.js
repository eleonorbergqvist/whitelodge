import React from 'react';
import logo from './logo.svg';
import ApolloClient, { gql } from "apollo-boost";
import { ApolloProvider, Query } from "react-apollo";
import './App.css';

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql"
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
            <ListUsers />
          </a>
        </header>
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
