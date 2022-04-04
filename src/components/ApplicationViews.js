import React from "react"
import { Route } from "react-router-dom"
import { Welcome } from "./users/Welcome"
import { Plants } from "./plants/PlantList"
import { Garden } from "./gardens/UserGarden"
import { AddPlant } from "./plants/PlantForm"
import { AllGardens } from "./gardens/AllGardens"
import { Login } from "./auth/Login"

//The purpose of this component is to set up the individual routes, and which component should be displayed
//when a particular browser route has been changed in the URL

//ApplicationViews will be listening for the change event from when the URL was changed in NavBar

export const ApplicationViews = () => {
    return (
        <>
            {/* These routes are listening for the event from NavBar */}
            <Route exact path="/login">
                <Login />
            </Route>
            <Route exact path="/welcome">
                {/* When the URL changes to /welcome, display Welcome component to the user */}
                <Welcome />
            </Route>
            <Route exact path="/plants">
                <Plants />
            </Route>
            <Route exact path="/garden">
                <Garden />
            </Route>
            <Route exact path="/viewGardens">
                <AllGardens />
            </Route>
            <Route exact path="/plantForm">
                <AddPlant />
            </Route>
        </>
    )
}

//Application views will be implemented in Gardeing.js