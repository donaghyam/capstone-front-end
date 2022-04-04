import React, { useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import "./PlantList.css"

//The puprose of this module is to be a welcome page for the user

export const Plants = () => {
    //zone variable holds initial state
    //setZone() is a function to modify said state
    const [users, setUsers] = useState([])
    const [plants, setPlants] = useState([])
    const [gardens, setGardens] = useState([])
    const [plantZones, setPlantZones] = useState([])
    const [foundPlantZones, setFoundPlantZones] = useState([])
    const [foundPlants, setFoundPlants] = useState([])

    const history = useHistory()

    //Fetch users
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

    //Fetch plants after users state has changed
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
        [users]
    )
    
    //Fetch plantZones after plants state has changed
    useEffect(
        () => {
            //Get data from API to pull into application state of tickets
            fetch("http://localhost:8088/plantZones")
                //Convert JSON encoded string into Javascript
                .then(res => res.json())
                //Invoke setUser() to set value of tickets
                .then((data) => {
                    setPlantZones(data)
                })
        },
        [plants]
    )

    //Write useEffect to find user's zoneId
    //Then find plantZones with matching zoneId
    //Initiate after plantZones state has changed
    useEffect(
        () => {

        //get user from local storage
        const localUser = parseInt(localStorage.getItem("garden_user"))

        //find user with userId matching localUser
        const foundUserObject = users.find(
            (userObject) => {
                return parseInt(userObject.id) === localUser
        })

        const foundPlantZonesArray = plantZones.filter(
            (plantZoneObject) => {
                //check if the plantZone.zoneId matches plantZones.zoneId
                return plantZoneObject?.zoneId === foundUserObject?.zoneId
            }
        )

        setFoundPlantZones(foundPlantZonesArray)

        },
        [plantZones]
    )

    //Write useEffect to set plants in the user's zone
    //Initiate after the foundPlantsZones state has changed
    useEffect(
        () => {

        const userPlantsArray = []

        //find plants with id matching the plantId in foundPlantZonesArray
        foundPlantZones.forEach(
            (foundPlantZoneObject) => {
                const foundPlant = plants.find(
                    (plantObject) => {
                        return plantObject.id === foundPlantZoneObject.plantId
                    }
                )
                userPlantsArray.push(foundPlant)
            }
        )
            
        setFoundPlants(userPlantsArray)

        },
        [foundPlantZones]
    )

    //Fetch gardens after foundPlants state has changed
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
        [foundPlants]
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

    //Write function to check if there are plants in the API matching the users zone. If not, redirect to add plant form. 
    const zoneCheck = () => {

        //get user from local storage
        const localUser = parseInt(localStorage.getItem("garden_user"))

        //find user with userId matching localUser
        const foundUserObject = users.find(
            (userObject) => {
                return parseInt(userObject?.id) === localUser
        })      

        if (foundPlants.length === 0 && foundUserObject !== undefined){
            alert (`Our database doesn't show any common plants suitable for Zone ${foundUserObject?.zoneId}. You will be redirected to a form where plants may be added.`)
            history.push("/plantForm")
        }
    }

    useEffect(
        () => {
        zoneCheck()
    },
    [foundPlants]
    )


    return (
        <>
        <div className="mainContainer">
            <section id="fruitContainer">
            <h1 className="contentTitles">Fruit</h1>
                {
                    foundPlants.map(
                        (plantObject) => {
                            if (plantObject?.type === "Fruit" && plantObject !== undefined){
                                return  <div>
                                            <p className="plant" key={`plant--${plantObject?.id}`}>
                                                {plantObject?.name}<br></br>
                                            </p>
                                            <div className="imageContainer">
                                                <img className="plantImage" src={plantObject?.img} alt={plantObject?.name}></img>
                                            </div>
                                            <button className="addPlantButton" onClick={() => addPlantToGarden(plantObject)}>
                                                <b>+ </b>Add to garden
                                            </button>
                                        </div>
                            }
                        }
                    )
                }
            </section>
            <section id="vegetableContainer">
                <h1 className="contentTitles">Vegetables</h1>
                {
                    foundPlants.map(
                        (plantObject) => {
                            if (plantObject?.type === "Vegetable" && plantObject !== undefined){
                                return  <div>
                                            <p className="plant" key={`plant--${plantObject?.id}`}>
                                                {plantObject?.name}<br></br>
                                            </p>
                                            <div className="imageContainer">
                                                <img className="plantImage" src={plantObject?.img} alt={plantObject?.name}></img>
                                            </div>
                                            <button className="addPlantButton" onClick={() => addPlantToGarden(plantObject)}>
                                                <b>+ </b>Add to garden
                                            </button>
                                        </div>
                            }
                        }
                    )
                }
            </section>
            <section id="herbContainer">
            <h1 className="contentTitles">Herbs</h1>
                {
                    foundPlants.map(
                        (plantObject) => {
                            if (plantObject?.type === "Herb" && plantObject !== undefined){
                                return  <div>
                                            <p className="plant" key={`plant--${plantObject?.id}`}>
                                                {plantObject?.name}<br></br>
                                            </p>
                                            <div className="imageContainer">
                                                <img className="plantImage" src={plantObject?.img} alt={plantObject?.name}></img>
                                            </div>
                                            <button className="addPlantButton" onClick={() => addPlantToGarden(plantObject)}>
                                                <b>+ </b>Add to garden
                                            </button>
                                        </div>
                            }
                        }
                    )
                }
            </section>
                <div id="addPlant">
                    <Link to="/plantForm" id="addPlantLink">Don't see what you want to grow?<br></br>Add it here.</Link>
                </div>
        </div>
        </>
    ) 
}