import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"

//The puprose of this module is to be a welcome page for the user

export const Welcome = () => {
    //users variable holds initial state
    //setUser() is a function to modify said state
    const [user, setUser] = useState({})

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
                    setUser(data)
                })
        },
        //This array isn't watching any state - it runs when the component is rendered, and never again
        []
    )

    return (
        <>
            {/* Display welcome message */}
            <div>
                <p id="welcomeMessage">
                    Welcome, {user.name}
                </p>
                <p id="beginGardening">
                    <Link to="/plants">
                        Begin gardening
                    </Link>
                </p>
                <p>
                    or
                </p>
                <p id="beginGardening">
                    <Link to="/garden">
                            Enter your existing garden
                    </Link>
                </p>
            </div>
        </>
    ) 
}


