import React from "react";
import { Route, Redirect } from "react-router-dom";
import { ApplicationViews } from "./ApplicationViews";
import { NavBar } from "./nav/NavBar";
import { Login } from "./auth/Login";
import { Register } from "./auth/Register";

//The purpose of this component is to determine the general layout of the site 
//  - determines which order components should be displayed


export const Gardening = () => (

  //JSX - Language that looks like HTML 
  //    - React takes JSX, converts its to Javascript, then renders HTML from that
  //    - use {} for Javascript interpolation 

  //Fragment allows you to return one JSX element instead of a parent with mulitple child elements.
  <>

    {/* Router handles rendering of different components when the user clicks on navigation items.
      - this allows the user to bookmark specific places within a single web application */}

    {/* This function determines which component should be rendered based on criteria -
    It's checking if there is currently something in local storage (meaning someone has logged in)
    Otherwise, it will be redirected to login */}
    <Route
      render={() => {
        if (localStorage.getItem("garden_user")) {

          //In any React component that generates HTML, you always need a return statement with ()

          return (
            <>
              <NavBar />
              <ApplicationViews />
            </>
          );
        } else {
          return <Redirect to="/login" />;
        }
      }}
    />

    {/* These routes direct which url the user will be taken to upon clicking the corresponding button */}
    <Route path="/login">
      <Login />
    </Route>
    <Route path="/register">
      <Register />
    </Route>
  </>
);