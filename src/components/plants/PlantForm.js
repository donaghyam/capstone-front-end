import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom";
import "./PlantForm.css"
//The puprose of this module is to be a welcome page for the user

export const AddPlant = () => {
    //zone variable holds initial state
    //setZone() is a function to modify said state
    const [plants, setPlants] = useState([])
    const [zones, setZones] = useState([])
    const [userZones, setUserZones] = useState([])
    const [newPlant, setNewPlant] = useState({
        "name": "",
        "type": "",
        "sowingSeason": "",
        "startIndoors": false,
        "plantingDepth": "",
        "sun": "",
        "watering": "",
        "soilPH": ""
    })

    const history = useHistory()

    useEffect(
        () => {
            //Get data from API to pull into application state of tickets
            fetch("http://localhost:8088/zones")
                //Convert JSON encoded string into Javascript
                .then(res => res.json())
                //Invoke setUser() to set value of tickets
                .then((data) => {
                    setZones(data)
                })
        },
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

    //Write function so the user can input a new plant that's not listed
    //This function will also create a newPlantZone for each zone selected
    const addNewPlant = (event) => {

        event.preventDefault()

        //Define variable to store new plant object
        const newPlantObject = {
            "name": newPlant.name,
            "type": newPlant.type,
            "sowingSeason": newPlant.sowingSeason,
            "startIndoors": false,
            "plantingDepth": newPlant.plantingDepth,
            "sun": newPlant.sun,
            "watering": newPlant.watering,
            "soilPH": newPlant.soilPH,
            "daysToHarvest": newPlant.daysToHarvest,
            "img": newPlant.img
        }

        alert(`${newPlantObject?.name} sucessfully added.`)

        addNewPlantZone()

        //Define variable to send object to API
        const fetchOptionPlant = {
            //Sending an object = POST
            method: "POST",
            headers: {
                "Content-Type": "application/JSON"
            },
            //Send body of employee form - This must be a string for JSON 
            body: JSON.stringify(newPlantObject)
        }

        return fetch("http://localhost:8088/plants", fetchOptionPlant)
            .then(response => response.json())
            .then(() => {
                //Use history mechanism from react-router-dom
                //This allows us to push to our browser history (this looks like an array method, but is not)
                //When this triggers, the user will be redirected to the plants page
                history.push("/plants")
        })

    }

    const addNewPlantZone = () => {

        const newPlantId = plants.length + 1

        //Create new plantZone for each zone selected
        const newPlantZoneArray = userZones.map(
            (zone) => {
                return {"plantId": newPlantId,
                        "zoneId": zone.id
                }
            }
        )
        
        
        newPlantZoneArray.forEach(
            (plantZoneObject) => {
                const fetchOption = {
                    //Sending an object = POST
                    method: "POST",
                    headers: {
                        "Content-Type": "application/JSON"
                    },
                    body: JSON.stringify(plantZoneObject)
                }
        
                return fetch("http://localhost:8088/plantZones", fetchOption)
                    .then(response => response.json())
            }
        )
    }

    return (
        <>
        {/* The data the user enters will be transient state until the button is clicked and it will be sent to the API */}
        <form className="addPlantForm">
            <h2 id="addPlantForm__title">Add new plant</h2>
            {/* Add name */}
            <fieldset>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        required autoFocus
                        type="text"
                        className="form-control"
                        //Create an event listner for when state changes
                        onChange={
                            //Capture event passed to us as an argument by the browser
                            (event) => {
                                //Since you cannot directly modify state in React, 
                                //you must first copy the existing state.
                                //Use object spread operator to copy of the current state
                                //The copy variable will be a brand new object with all of the values
                                //copied from state
                                const copy = {...newPlant}
                                //Modify the copy and update the name to user input
                                copy.name = event.target.value
                                //Make the copy the new state via setNewPlant() function
                                setNewPlant(copy)
                            }
                        } />
                </div>
            </fieldset>

            {/* Plant type */}
            <fieldset>
                <div className="form-group">
                    <label htmlFor="plantType">Type:</label>
                    <select className="minimal" defaultValue={"0"}
                        onChange={
                            (event) => {
                                const copy = {...newPlant}
                                copy.type = event.target.value
                                setNewPlant(copy)
                            }
                        }>
                        <option value="0">Select type</option>
                        <option value="Fruit">Fruit</option>
                        <option value="Vegetable">Vegetable</option>
                        <option value="Herb">Herb</option>
                    </select>
                </div>
            </fieldset>

            {/* Select zone(s) */}
            <fieldset>
                <div className="form-group">
                    <label htmlFor="zone">Zone(s):</label>
                    {
                        zones.map( 
                            (zone) => {
                                return <>
                                    <label id="zoneCheckboxNumber" htmlFor="zoneCheckbox">{zone.id}</label>
                                    <input type="checkbox" value={zone.id} id="zoneCheckbox"
                                            onChange={
                                                (event) => {
                                                    const zone = {"id":""}
                                                    zone.id = parseInt(event.target.value)
                                                    userZones.push(zone)
                                                }
                                            }>
                                    </input>
                                </>
                            }
                        )
                    }
                </div>
            </fieldset>

            {/* Sowing season */}
            <fieldset>
                <div className="form-group">
                    <label htmlFor="sowingSeason">Sowing season:</label>
                    <select className="minimal" defaultValue={"0"}
                        onChange={
                            (event) => {
                                const copy = {...newPlant}
                                copy.sowingSeason = event.target.value
                                setNewPlant(copy)
                            }
                        }>
                        <option value="0">Select season</option>
                        <option value="Fall">Fall</option>
                        <option value="Spring - before last frost">Spring - before last frost</option>
                        <option value="Spring - after last frost">Spring - after last frost</option>
                    </select>
                </div>
            </fieldset>

            {/* Start indoors? */}
            <fieldset>
                <div className="form-group">
                    <label htmlFor="startIndoors">Start indoors?</label>
                    <input type="checkbox"
                        onChange={
                            (event) => {
                                const copy = {...newPlant}
                                copy.startIndoors = event.target.checked
                                setNewPlant(copy)
                            }
                        } />
                </div>
            </fieldset>

            {/* Planting depth */}
            <fieldset>
                <div className="form-group">
                    <label htmlFor="plantingDepth">Planting depth:</label>
                    <select className="minimal" defaultValue={"0"}
                        onChange={
                            (event) => {
                                const copy = {...newPlant}
                                copy.plantingDepth = event.target.value
                                setNewPlant(copy)
                            }
                        }>
                        <option value="0">Select depth</option>
                        <option value="Soil surface">Soil surface</option>
                        <option value="0.5-1.0 in. (from seed)">0.5-1.0 in. (from seed)</option>
                        <option value="1.0-1.5 in. (from seed)">1.0-1.5 in. (from seed)</option>
                        <option value="1.5-2.0 in. (from seed)">1.5-2.0 in. (from seed)</option>
                        <option value="1-2 in. (from crown)">1-2 in. (from crown)</option>
                        <option value="2-3 in. (from crown)">2-3 in. (from crown)</option>
                        <option value="3-4 in. (from crown)">3-4 in. (from crown)</option>
                        <option value="4-5 in. (from crown)">4-5 in. (from crown)</option>
                        <option value="5-6 in. (from crown)">5-6 in. (from crown)</option>
                        <option value="6-7 in. (from crown)">6-7 in. (from crown)</option>
                        <option value="7-8 in. (from crown)">7-8 in. (from crown)</option>
                        <option value="8-9 in. (from crown)">8-9 in. (from crown)</option>
                        <option value="9-10 in. (from crown)">9-10 in. (from crown)</option>
                        <option value="10-11 in. (from crown)">10-11 in. (from crown)</option>
                        <option value="11-12 in. (from crown)">11-12 in. (from crown)</option>
                    </select>
                </div>
            </fieldset>

            {/* Sun exposure */}
            <fieldset>
                <div className="form-group">
                    <label htmlFor="sun">Sun exposure:</label>
                    <select className="minimal" defaultValue={"0"}
                        onChange={
                            (event) => {
                                const copy = {...newPlant}
                                copy.sun = event.target.value
                                setNewPlant(copy)
                            }
                        }>
                        <option value="0">Select sun exposure</option>
                        <option value="Shade">Shade</option>
                        <option value="6+ hours">6+ hours</option>
                        <option value="8+ hours">8+ hours</option>
                    </select>
                </div>
            </fieldset>

            {/* Watering */}
            <fieldset>
                <div className="form-group">
                    <label htmlFor="watering">Watering:</label>
                    <select className="minimal" defaultValue={"0"}
                        onChange={
                            (event) => {
                                const copy = {...newPlant}
                                copy.watering = event.target.value
                                setNewPlant(copy)
                            }
                        }>
                        <option value="0">Select watering amount</option>
                        <option value="0.5 in. per week">0.5 in. per week</option>
                        <option value="1.0 in. per week">1.0 in. per week</option>
                        <option value="1.5 in. per week">1.5 in. per week</option>
                        <option value="2.0 in. per week">2.0 in. per week</option>
                        <option value="2.5 in. per week">2.5 in. per week</option>
                        <option value="3.0 in. per week">3.0 in. per week</option>
                    </select>
                </div>
            </fieldset>


            {/* soil Ph */}
            <fieldset>
                <div className="form-group">
                    <label htmlFor="soilPH">Soil pH:</label>
                    <select className="minimal" defaultValue={"0"}
                        onChange={
                            (event) => {
                                const copy = {...newPlant}
                                copy.soilPH = event.target.value
                                setNewPlant(copy)
                            }
                        }>
                        <option value="0">Select pH</option>
                        <option value="3.0-3.5">3.0-3.5</option>
                        <option value="3.5-4.0">3.5-4.0</option>
                        <option value="4.0-4.5">4.0-4.5</option>
                        <option value="4.5-5.0">4.5-5.0</option>
                        <option value="5.0-5.5">5.0-5.5</option>
                        <option value="5.5-6.0">5.5-6.0</option>
                        <option value="6.0-6.5">6.0-6.5</option>
                        <option value="6.5-7.0">6.5-7.0</option>
                        <option value="7.0-7.5">7.0-7.5</option>
                    </select>
                </div>
            </fieldset>

            <fieldset>
                <div className="form-group">
                    <label htmlFor="daysToHarvest">Days to harvest:</label>
                    <input
                        required autoFocus
                        type="text"
                        className="form-control"
                        //Create an event listner for when state changes
                        onChange={
                            //Capture event passed to us as an argument by the browser
                            (event) => {
                                //Since you cannot directly modify state in React, 
                                //you must first copy the existing state.
                                //Use object spread operator to copy of the current state
                                //The copy variable will be a brand new object with all of the values
                                //copied from state
                                const copy = {...newPlant}
                                //Modify the copy and update the name to user input
                                copy.daysToHarvest = parseInt(event.target.value)
                                //Make the copy the new state via setNewPlant() function
                                setNewPlant(copy)
                            }
                        } />
                </div>
            </fieldset>

            <fieldset>
                <div className="form-group">
                    <label htmlFor="imageUrl">Image URL:</label>
                    <input
                        required autoFocus
                        type="text"
                        className="form-control"
                        //Create an event listner for when state changes
                        onChange={
                            //Capture event passed to us as an argument by the browser
                            (event) => {
                                //Since you cannot directly modify state in React, 
                                //you must first copy the existing state.
                                //Use object spread operator to copy of the current state
                                //The copy variable will be a brand new object with all of the values
                                //copied from state
                                const copy = {...newPlant}
                                //Modify the copy and update the name to user input
                                copy.img = event.target.value
                                //Make the copy the new state via setNewPlant() function
                                setNewPlant(copy)
                            }
                        } />
                </div>
            </fieldset>

            <div id="addPlantButtonContainer">
                <button id="addPlantButton" onClick={addNewPlant}>
                    Add plant
                </button>
            </div>
        </form>
        </>
    )
}