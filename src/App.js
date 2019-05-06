import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import "./assets/css/style.css";
import Home from "./components/home";
import Gallery from "./components/gallery.js";
import Error from "./components/error.js";


class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route path='/' component={Home} exact />
            <Route path='/gallery' component={Gallery} />
            <Route component={Error} />
            <Route path='/errorPage' component={Error} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
