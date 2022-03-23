import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import "./Welcome.css"

//The puprose of this module is to be a welcome page for the user

export const Welcome = () => {
    //currentUser variable holds initial state
    //setCurrentUser() is a function to modify said state
    const [currentUser, setCurrentUser] = useState([])

    //get user from local storage
    const localUser = parseInt(localStorage.getItem("garden_user"))

    //This hook's main purpose is to observe one, or more, 
    //state variables, and then run code when that state changes.
    useEffect(
        () => {
            //Get data from API to pull into application state of tickets
            fetch(`http://localhost:8088/users/${localUser}`)
                //Convert JSON encoded string into Javascript
                .then(res => res.json())
                //Invoke setUser() to set value of tickets
                .then((data) => {
                    setCurrentUser(data)
                })
        },
        //This array isn't watching any state - it runs when the component is rendered, and never again
        []
    )

    return (
        <>
            {/* Display welcome message */}
            <div id="welcomeContainer">
                <p id="welcomeMessage">
                    Welcome, {currentUser.name}.
                </p>
                <p id="welcomeLink">
                    <Link to="/plants">
                        Begin gardening
                    </Link>
                </p>
                <p id="or">
                    -or-
                </p>
                <p id="welcomeLink">
                    <Link to="/garden">
                        Enter your existing garden
                    </Link>
                </p>
            </div>
        </>
    ) 
}


