import React from 'react';
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Register from "../Register/Register";
import Login from "../Login/Login";
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App__Header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
      </header>
      <BrowserRouter>
        <Switch>
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
