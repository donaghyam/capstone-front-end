import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"

//The puprose of this module is to be a welcome page for the user

export const Plants = () => {
    //zone variable holds initial state
    //setZone() is a function to modify said state
    const [users, setUsers] = useState([])
    const [plants, setPlants] = useState([])
    const [gardens, setGardens] = useState([])
    const [zonePlants, setZonePlants] = useState([])

    //This hook's main purpose is to observe one, or more, 
    //state variables, and then run code when that state changes.
    useEffect(
        () => {
            //Get data from API to pull into application state of users
            fetch("http://localhost:8088/users")
            //Convert JSON encoded string into Javascript
                .then(res => res.json())
                //Invoke setUsers() to set value of user
                .then((data) => {
                    setUsers(data)
                })
        },
        //This array isn't watching any state - it runs when the component is rendered, and never again
        []
    )

    useEffect(
        () => {
            //Get data from API to pull into application state of tickets
            fetch("http://localhost:8088/plants")
                //Convert JSON encoded string into Javascript
                .then(res => res.json())
                //Invoke setUser() to set value of tickets
                .then((data) => {
                    setPlants(data)
                })
        },
        []
    )
    
    //Write function to find user's zoneId
    //Then find plants with matching zoneId
    useEffect(
        () => {

        //get user from local storage
        const localUser = parseInt(localStorage.getItem("garden_user"))

        //find user with userId matching localUser
        const foundUserObject = users.find(
            (userObject) => {
                return parseInt(userObject?.id) === localUser
        })

    
        const newPlantArray = []

        plants.forEach(
            (plantObject) => {
                if (plantObject.zoneId.includes(foundUserObject?.zoneId)) {
                    newPlantArray.push(plantObject)
                }
            }
        )

        setZonePlants(newPlantArray)

    },
    [plants]
    )

    useEffect(
        () => {
            //Get data from API to pull into application state of tickets
            fetch("http://localhost:8088/gardens")
                //Convert JSON encoded string into Javascript
                .then(res => res.json())
                //Invoke setUser() to set value of tickets
                .then((data) => {
                    setGardens(data)
                })
        },
        []
    )


    
    //Write function to add a plant to API
    const addPlantToGarden = (plantObject) => {
        //get local user
        const localUser = parseInt(localStorage.getItem("garden_user"))

        //iterate through gardens to see if localUser's id matches userId in garden 
        const foundGarden = gardens.find(
            (gardenObject) => {
                return parseInt(gardenObject.userId) === localUser
            }
        )

        //Define variable to store new gardenPlant object
        const newGardenPlant = {
            "name": plantObject.name,
            "plantId": plantObject.id,
            "gardenId": foundGarden.id
        }

        
        //Define variable to send object to API
        const fetchOption = {
            //Sending an object = POST
            method: "POST",
            headers: {
                "Content-Type": "application/JSON"
            },
            //Send body of employee form - This must be a string for JSON 
            body: JSON.stringify(newGardenPlant)
        }

        alert(`${newGardenPlant.name} added to your garden.`)

        return fetch("http://localhost:8088/gardenPlants", fetchOption)
            .then(response => response.json())
    }

    return (
        <>
            {
                zonePlants.map(
                    (plantObject) => {
                        return  <div>
                                    <p key={`plant--${plantObject?.id}`}>
                                        Plant: {plantObject?.name}<br></br>
                                    </p>
                                    <button className="addPlantButton" onClick={() => addPlantToGarden(plantObject)}>
                                        Add to garden
                                    </button>
                                </div>
                    }
                )
            }
            <div>
                <Link to="/plantForm">Don't see what you want to grow? Add it here.</Link>
            </div>
        </>
    ) 
}