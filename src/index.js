import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Gardening } from './components/Gardening';
import { BrowserRouter, Route } from "react-router-dom"

ReactDOM.render(
  <React.StrictMode>
    {/* Router handles rendering of different components when the user clicks on navigation items.
      - this allows the user to bookmark specific places within a single web application
      - Here we are enabling routing for the ENTIRE application */}
    <BrowserRouter>
    {/* invoke function  */}
      <Gardening />
      <Route path="/map"
        component={() => {
          window.location.replace('https://planthardiness.ars.usda.gov/');
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

