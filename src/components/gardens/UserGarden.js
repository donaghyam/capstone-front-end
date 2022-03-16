import React, { useEffect, useState } from "react"

//The puprose of this module is to be a welcome page for the user

export const Garden = () => {
    //gardenPlants variable holds initial state
    //setGardenPlants() is a function to modify said state
    const [gardens, setGarden] = useState([])
    const [gardenPlants, setGardenPlants] = useState([])
    const [userZone, setUserZone] = useState([])

    //get user from local storage
    const localUser = parseInt(localStorage.getItem("garden_user"))
    

    //This hook's main purpose is to observe one, or more, 
    //state variables, and then run code when that state changes.
    useEffect(
        () => {
            //Get data from API to pull into application state of tickets
            fetch("http://localhost:8088/gardens")
            //Convert JSON encoded string into Javascript
                .then(res => res.json())
                //Invoke setUser() to set value of tickets
                .then((data) => {
                    setGarden(data)
                })
        },
        //This array isn't watching any state - it runs when the component is rendered, and never again
        []
    )

    //useEffect for finding user's Zone
    useEffect(
        () => {
            //Get data from API to pull into application state of tickets
            fetch(`http://localhost:8088/users/${localUser}?_expand=zone`)
            //Convert JSON encoded string into Javascript
                .then(res => res.json())
                //Invoke setUser() to set value of tickets
                .then((data) => {
                    setUserZone(data)
                })
        },
        [gardens]
    )
    
    const getPlants = () => {
            //get user from local storage
            const localUser = parseInt(localStorage.getItem("garden_user"))

            let foundGardenObject = {}

            for (const gardenObject of gardens) {
                if (parseInt(gardenObject.userId) === localUser) {
                    foundGardenObject = gardenObject
                }
            }

            //Get data from API to pull into application state of tickets
            fetch(`http://localhost:8088/gardenPlants?gardenId=${foundGardenObject.id}&_expand=plant`)
                //Convert JSON encoded string into Javascript
                .then(res => res.json())
                //Invoke setUser() to set value of tickets
                .then((data) => {
                    setGardenPlants(data)
                })
    }

    useEffect(
        () => {
            getPlants()
        },
        [gardens]
    )

    //Write function to remove a plant from the user's garden (and API)
    const removePlant = (id) => {
        //Get data from API to pull into application state of tickets
        fetch(`http://localhost:8088/gardenPlants/${id}`, {
            //delete the ticket
            method: "DELETE"
        })
        //then run the getTickets function to update list without the deleted items
        .then(getPlants())
    }

    console.log(userZone.zone?.id)

    return (
        <>
        <section>
            <p>The last frost date in Zone {userZone.zone?.id} is ""</p>
        </section>
        <section>
            {
                gardenPlants.map(
                    (gardenPlantObject) => {
                        return <div>
                                    <p key={`plant--${gardenPlantObject?.id}`}>
                                        Common name: {gardenPlantObject.plant?.name}<br></br>
                                        Sowing season: {gardenPlantObject.plant?.sowingSeason}<br></br>
                                        Planting depth: {gardenPlantObject.plant?.plantingDepth}<br></br>
                                        Sun exposure: {gardenPlantObject.plant?.sun}<br></br>
                                        Watering: {gardenPlantObject.plant?.watering}<br></br>
                                        soilPh: {gardenPlantObject.plant?.soilPH}<br></br>
                                    </p>
                                    <button onClick={() => {
                                        removePlant(gardenPlantObject.id)
                                        }}>Remove plant
                                    </button>
                                </div>
                    }
                )
            }
        </section>
        </>
    ) 
}