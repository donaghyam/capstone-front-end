import React, { useRef, useState, useEffect } from "react"
import { useHistory, Link, Route, Router } from "react-router-dom"

export const Register = (props) => {
    const [user, setUser] = useState({})
    const [zones, setZones] = useState([])
    const conflictDialog = useRef()

    const history = useHistory()
    
    useEffect(
        () => {
            //Define function to get zones from API to pull into application state of zones
            return fetch("http://localhost:8088/zones")
                //Convert JSON encoded string into Javascript
                .then(response => response.json())
                //Send the fetched data to setZones() function
                .then((data) => {
                    setZones(data)
                })
    },
    []
    )


    const existingUserCheck = () => {
        return fetch(`http://localhost:8088/users?email=${user.email}`)
            .then(res => res.json())
            .then(user => !!user.length)
    }
    
    const handleRegister = (e) => {
        e.preventDefault()
        existingUserCheck()
            .then((userExists) => {
                if (!userExists) {
                    fetch("http://localhost:8088/users", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(user)
                    })
                        .then(res => res.json())
                        .then(createdUser => {
                            if (createdUser.hasOwnProperty("id")) {
                                //localStorage.setItem is a key/value pair
                                //When you register a user and do a POST,
                                //it's going to create a new user in your database
                                //with a primary key, and that new object will be sent back
                                //and stored in local storage - a browser mechanism
                                localStorage.setItem("garden_user", createdUser.id)
                                history.push("/welcome")
                            }
                        })
                }
                else {
                    conflictDialog.current.showModal()
                }
            })
    }

    const updateUser = (evt) => {
        const copy = {...user}
        //Check if id matches the id of the name and email fields
        if (evt.target.id === "name" || evt.target.id === "email"){
            //If true set 
            copy[evt.target.id] = evt.target.value
            setUser(copy)
        } else {
            copy[evt.target.id] = parseInt(evt.target.value)
            setUser(copy)
        }
    }



    return (
        <main style={{ textAlign: "center" }}>
            <dialog className="dialog dialog--password" ref={conflictDialog}>
                <div>Account with that email address already exists</div>
                <button className="button--close" onClick={e => conflictDialog.current.close()}>Close</button>
            </dialog>

            <form className="form--login" onSubmit={handleRegister}>
                <h1 className="h3 mb-3 font-weight-normal">Please Register to start gardening</h1>
                <fieldset>
                    <label htmlFor="name"> Full Name </label>
                    <input onChange={updateUser}
                           type="text" id="name" className="form-control"
                           placeholder="Enter your name" required autoFocus />
                </fieldset>
                <fieldset>
                    <label htmlFor="email"> Email address </label>
                    <input onChange={updateUser} type="email" id="email" className="form-control" placeholder="Email address" required />
                </fieldset>
                <fieldset>
                    <label htmlFor="zone"> Agricultural Zone </label>
                    <select id ="zoneId" onChange={updateUser}>
                        <option>Select a zone</option>
                        {zones.map(
                                zone => 
                                // When user selects an zone, a brand new object will be created
                                // this new object will have the id of the selected zone
                                <option key={`zone--${zone.id}`} value={zone.id} id="zoneId">{zone.id}</option>)
                        }
                    </select>
                </fieldset>
                <section className="link--register">
                        <Link to="/map" target="_blank">Not sure what zone you live in?</Link>
                </section>
                <fieldset>
                    <button type="submit"> Register </button>
                </fieldset>
            </form>
        </main>
    )
}

