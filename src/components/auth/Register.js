import React, { useRef, useState, useEffect } from "react"
import { useHistory, Link, Route, Router } from "react-router-dom"
import "./Auth.css"
//This module creates a new user and garden for the user

export const Register = (props) => {
    const [allUsers, setAllUsers] = useState([])
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

    useEffect(
        () => {
            //Define function to get zones from API to pull into application state of zones
            return fetch("http://localhost:8088/users")
                //Convert JSON encoded string into Javascript
                .then(response => response.json())
                //Send the fetched data to setZones() function
                .then((data) => {
                    setAllUsers(data)
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

    const createGarden = () => {
        
        const newUserId = allUsers.length + 1
        

        const newGardenObject = {
            "userId": newUserId
        }
        
        //Define variable to send object to API
        const fetchOption = {
            //Sending an object = POST
            method: "POST",
            headers: {
                "Content-Type": "application/JSON"
            },
            //Send body of employee form - This must be a string for JSON 
            body: JSON.stringify(newGardenObject)
        }

        return fetch("http://localhost:8088/gardens", fetchOption)
            .then(response => response.json())
    }



    return (
        
        <main className="mainContainerLogin">
            <dialog className="dialog dialog--password" ref={conflictDialog}>
                <div>Account with that email address already exists</div>
                <button className="button--close" onClick={e => conflictDialog.current.close()}>Close</button>
            </dialog>
            <div id="titleContainer">
            <img id="broccoli" src="https://www.pinclipart.com/picdir/big/540-5403190_broccoli-png-dibujo-de-brocoli-para-colorear-clipart.png" alt="Vegetables Clipart Vegetable Clipart Free Broccoli - Clipart Broccoli@clipartmax.com"></img>
                <div id="title2">
                <h1 id="title">Gardening</h1>
                <h1 id="subtitle">With A Growth Mindset</h1>
                </div>
                <img id="carrot" src="https://www.pinclipart.com/picdir/big/524-5243910_carrot-pictures-free-clipart-vector-freeuse-carrot-free.png" alt="Reindeer Carrots Icon - Carrots For Reindeer Clipart@clipartmax.com"></img>            </div>

            <form className="form--login" onSubmit={handleRegister}>
                <h1 id="registerHeader">Please register to start gardening</h1>
                <fieldset id="nameFieldset">
                    <label htmlFor="name"> Name </label>
                    <input onChange={updateUser}
                           type="text" id="name" className="form-control"
                           placeholder="Enter your name" required autoFocus />
                </fieldset>
                <fieldset className="loginFieldset">
                    <div id="registerLabelContainer"></div>
                    <label htmlFor="email"> Email address </label>
                    <input onChange={updateUser} type="email" id="email" className="form-control" placeholder="Email address" required />
                </fieldset>
                <fieldset id="zoneFieldset">
                <div id="registerLabelContainer"></div>
                    <label htmlFor="zone"> Agricultural Zone </label>
                    <select className ="minimal" onChange={updateUser}>
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
                        <Link to="/map" target="_blank" id="mapLink">Not sure what zone you live in?</Link>
                </section>
                <fieldset id="registerButtonContainer">
                    <button type="submit" id="registerButton" onClick={createGarden}> Register </button>
                </fieldset>
            </form>
        </main>
    )
}

