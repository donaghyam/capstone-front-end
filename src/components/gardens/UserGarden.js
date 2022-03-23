import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import "./UserGarden.css"

//The purpose of this module is to show the plants the user has selected from the plant list

export const Garden = () => {
    //gardenPlants variable holds initial state
    //setGardenPlants() is a function to modify said state
    const [gardens, setGarden] = useState([])
    const [gardenPlants, setGardenPlants] = useState([1])
    const [userZone, setUserZone] = useState([])

    const history = useHistory()

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

    useEffect(
        () => {
            getPlants()
        },
        [userZone]
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
                    plantsInGardenCheck(data)
                    setGardenPlants(data)
                })
    }

    //Write function to remove a plant from the user's garden (and API)
    const removePlant = (id) => {
        //Get data from API to pull into application state
        fetch(`http://localhost:8088/gardenPlants/${id}`, {
            //delete the ticket
            method: "DELETE"
        })
        //then run the getTickets function to update list without the deleted items
        .then(getPlants())
    }

    //Write a function to check if there is a frost date associated with the user's zone
    const frostDateCheck = () => {
        if (userZone.zone?.hasOwnProperty('firstFrostDate')){
            return <div id="frostDate">
                    <p>The <b>first frost</b> date in Zone {userZone.zone?.id} is expected to be <b>{userZone.zone?.firstFrostDate}</b>. </p>
                    <p>The <b>last frost</b> date is expected to be <b>{userZone.zone?.lastFrostDate}</b>.</p>
                    <p>As an extra precaution, it is a good idea to assume a difference of two weeks from scheduled frost dates so that you are not caught off-guard. This means acting under the assumption that the last frost date of the spring will happen two weeks later than calculated, and the first frost date of the fall will happen two weeks earlier than the estimate.</p>
                </div>
        }
    }

    //Write function to check if there are existing plants in the user's garden. If not, redirect to plants page.
    const plantsInGardenCheck = (array) => {

        if (array.length === 0 && gardens.length > 0){
            alert ("Oops. Looks like there's nothing in your garden yet. Redirecting...")
            history.push("/plants")
        }
    }

    // Function to invoke when datePlanted is selected by the user
    const addDatePlanted = (event, gardenPlantObject) => {

        // Construct a new object to replace the existing one in the API
        const updatedGardenPlant = {
            "name": gardenPlantObject.plant?.name,
            "plantId": gardenPlantObject?.plantId,
            "gardenId": gardenPlantObject?.gardenId,
            "datePlanted": Date.parse(event.target.value)
        }

        // Perform the PUT HTTP request to replace the resource
        fetch(`http://localhost:8088/gardenPlants/${gardenPlantObject.id}`, {
            //PUT method - insert/replace
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            //Send body of service ticket request - This must be a string for JSON 
            body: JSON.stringify(updatedGardenPlant)
        })
    }

    // Function to check whether or not the datePlanted property exists on a gardenPlantObject
    const datePlantedCheck = (currentGardenPlantObject) => {
        
        //Check if datePlanted property exists on current object
        if (currentGardenPlantObject.datePlanted){
            return  <>
                    <div>
                    <p className="gardenPlantParameter">
                        <b>Date planted:</b></p>
                    <p className="gardenPlantParameterData"> {new Date(currentGardenPlantObject.datePlanted).toDateString()}</p><br></br>
                    </div>
                    {calculateHarvest(currentGardenPlantObject)}
                    </>
        } else {
            return  <div>
                        <section className="dateInput">
                            <label id="datePlantedLabel" htmlFor="date"><b>Date planted:</b></label>
                            <input 
                                type="date" 
                                id="datePlanted" 
                                value="<?php echo date('Y-m-d');?>" 
                                min="2022-01-01"
                                onChange={
                                    (event) => {
                                        addDatePlanted(event, currentGardenPlantObject)
                                    }
                                } />
                        </section>
                    </div>
        }
    }

    //Write function to count down the days until harvest
    const calculateHarvest = (currentGardenPlantObject) => {

        //Define variable to store days to harvest
        const daysToHarvest = (parseInt(currentGardenPlantObject.plant.daysToHarvest)) * (1000 * 60 * 60 * 24)

        const datePlanted = parseInt(currentGardenPlantObject.datePlanted)

        //Define variabe to store harvest date
        const harvestDate = datePlanted + daysToHarvest

        const harvestDateHtml =   <div>
                                        <p className="gardenPlantParameter">
                                        <b>Estimated harvest date:</b></p>
                                        <p className="gardenPlantParameterData"> {new Date(harvestDate).toDateString()}</p><br></br>
                                    </div>

        return harvestDateHtml
    }


    return (
        <>
        <section className="mainContainer">
            <section id="gardenTitle">
                <h1>
                    Your Garden
                </h1>
            </section>
            <section id="frostDateContainer">
                <h1 className="contentTitles">
                    Frost Dates
                </h1>
                {frostDateCheck()}
            </section>
        <div id="gardenContainer">
            <section id="gardenFruitSection">
                <h1 className="contentTitles">Fruit</h1>
                {
                    gardenPlants.map(
                        (gardenPlantObject) => {
                            if (gardenPlantObject?.plant?.type === "Fruit" && gardenPlantObject !== 1){
                                return <div>
                                            <section className="gardenPlant" key={`plant--${gardenPlantObject?.id}`}>
                                                <p className="gardenPlantParameter"><b>Common name:</b></p> <p className="gardenPlantParameterData"> {gardenPlantObject.plant?.name}</p><br></br>
                                                <p className="gardenPlantParameter"><b>Sowing season:</b></p> <p className="gardenPlantParameterData"> {gardenPlantObject.plant?.sowingSeason}</p><br></br>
                                                <p className="gardenPlantParameter"><b>Start indoors:</b></p> <p className="gardenPlantParameterData"> {gardenPlantObject.plant?.startIndoors ? "✅" : "❌ " }</p><br></br>
                                                <p className="gardenPlantParameter"><b>Planting depth:</b></p> <p className="gardenPlantParameterData"> {gardenPlantObject.plant?.plantingDepth}</p><br></br>
                                                <p className="gardenPlantParameter"><b>Sun exposure:</b></p> <p className="gardenPlantParameterData"> {gardenPlantObject.plant?.sun}</p><br></br>
                                                <p className="gardenPlantParameter"><b>Watering:</b></p> <p className="gardenPlantParameterData"> {gardenPlantObject.plant?.watering}</p><br></br>
                                                <p className="gardenPlantParameter"><b>Soil Ph:</b></p> <p className="gardenPlantParameterData"> {gardenPlantObject.plant?.soilPH}</p><br></br>
                                                {datePlantedCheck(gardenPlantObject)}
                                            </section>
                                            <button className="removePlantButton" onClick={() => {
                                                removePlant(gardenPlantObject.id)
                                            }}><b>X </b>Remove {gardenPlantObject.plant?.name}
                                            </button>
                                        </div>
                        }
                    }
                        )
                    }
            </section>
            <section id="gardenVegetableContainer">
                <h1 className="contentTitles">Vegetables</h1>
                {
                    gardenPlants.map(
                        (gardenPlantObject) => {
                            if (gardenPlantObject?.plant?.type === "Vegetable" && gardenPlantObject !== 1){
                                return <div>
                                            <section className="gardenPlant" key={`plant--${gardenPlantObject?.id}`}>
                                                <p className="gardenPlantParameter"><b>Common name:</b></p> <p className="gardenPlantParameterData"> {gardenPlantObject.plant?.name}</p><br></br>
                                                <p className="gardenPlantParameter"><b>Sowing season:</b></p> <p className="gardenPlantParameterData"> {gardenPlantObject.plant?.sowingSeason}</p><br></br>
                                                <p className="gardenPlantParameter"><b>Start indoors:</b></p> <p className="gardenPlantParameterData"> {gardenPlantObject.plant?.startIndoors ? "✅" : "❌ " }</p><br></br>
                                                <p className="gardenPlantParameter"><b>Planting depth:</b></p> <p className="gardenPlantParameterData"> {gardenPlantObject.plant?.plantingDepth}</p><br></br>
                                                <p className="gardenPlantParameter"><b>Sun exposure:</b></p> <p className="gardenPlantParameterData"> {gardenPlantObject.plant?.sun}</p><br></br>
                                                <p className="gardenPlantParameter"><b>Watering:</b></p> <p className="gardenPlantParameterData"> {gardenPlantObject.plant?.watering}</p><br></br>
                                                <p className="gardenPlantParameter"><b>Soil Ph:</b></p> <p className="gardenPlantParameterData"> {gardenPlantObject.plant?.soilPH}</p><br></br>
                                                {datePlantedCheck(gardenPlantObject)}
                                            </section>
                                            <button className="removePlantButton" onClick={() => {
                                                removePlant(gardenPlantObject.id)
                                            }}><b>X </b>Remove {gardenPlantObject.plant?.name}
                                            </button>
                                        </div>
                        }
                    }
                        )
                    }
            </section>
            <section id="gardenHerbContainer">
                <h1 className="contentTitles">Herbs</h1>
                {
                    gardenPlants.map(
                        (gardenPlantObject) => {
                            if (gardenPlantObject?.plant?.type === "Herb" && gardenPlantObject !== 1){
                                return <div>
                                            <section className="gardenPlant" key={`plant--${gardenPlantObject?.id}`}>
                                                <p className="gardenPlantParameter"><b>Common name:</b></p> <p className="gardenPlantParameterData"> {gardenPlantObject.plant?.name}</p><br></br>
                                                <p className="gardenPlantParameter"><b>Sowing season:</b></p> <p className="gardenPlantParameterData"> {gardenPlantObject.plant?.sowingSeason}</p><br></br>
                                                <p className="gardenPlantParameter"><b>Start indoors:</b></p> <p className="gardenPlantParameterData"> {gardenPlantObject.plant?.startIndoors ? "✅" : "❌ " }</p><br></br>
                                                <p className="gardenPlantParameter"><b>Planting depth:</b></p> <p className="gardenPlantParameterData"> {gardenPlantObject.plant?.plantingDepth}</p><br></br>
                                                <p className="gardenPlantParameter"><b>Sun exposure:</b></p> <p className="gardenPlantParameterData"> {gardenPlantObject.plant?.sun}</p><br></br>
                                                <p className="gardenPlantParameter"><b>Watering:</b></p> <p className="gardenPlantParameterData"> {gardenPlantObject.plant?.watering}</p><br></br>
                                                <p className="gardenPlantParameter"><b>Soil Ph:</b></p> <p className="gardenPlantParameterData"> {gardenPlantObject.plant?.soilPH}</p><br></br>
                                                {datePlantedCheck(gardenPlantObject)}
                                            </section>
                                            <button className="removePlantButton" onClick={() => {
                                                removePlant(gardenPlantObject.id)
                                            }}><b>X </b>Remove {gardenPlantObject.plant?.name}
                                            </button>
                                        </div>
                        }
                    }
                        )
                    }
            </section>
        </div>
        </section>
        </>
    ) 
}