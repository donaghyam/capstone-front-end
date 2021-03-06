import React, { useEffect, useState } from "react"
import "./AllGardens.css"

//The purpose of this module is to display all users gardens

export const AllGardens = () => {
    const [gardenPlants, setGardenPlants] = useState([])
    const [users, setUsers] = useState([])
    const [fruits, setFruits] = useState([])
    const [vegetables, setVegetables] = useState([])
    const [herbs, setHerbs] = useState([]) 
    const [selectedZone, setSelectedZone] = useState([])
    const [gardenToDisplay, setGardenToDisplay] = useState([])

    //get users
    useEffect(
        () => {
            //Get data from API to pull into application state of tickets
            fetch("http://localhost:8088/users")
            //Convert JSON encoded string into Javascript
                .then(res => res.json())
                //Invoke setUser() to set value of tickets
                .then((data) => {
                    setUsers(data)
                })
        },
        [gardenPlants]
    )

    //get garden plants
    useEffect(
        () => {
            //Get data from API to pull into application state of tickets
            fetch("http://localhost:8088/gardenPlants?_expand=plant&_expand=garden")
            //Convert JSON encoded string into Javascript
                .then(res => res.json())
                //Invoke setUser() to set value of tickets
                .then((data) => {
                    setGardenPlants(data)
                })
        },
        []
    )

    //Sets state with selected zone
    const parseEvent = (event) => {

        const zoneId = parseInt(event.target.value)

        setSelectedZone(zoneId)
    }

    useEffect(
        () => {
            typeFilter()
        },
        [users]
    )

    useEffect(
        () => {
            filterCheck(selectedZone)
        },
        [selectedZone]
    )

    //Function to filter plants by type and set state
    const typeFilter = () => {

        const justFruitArray = gardenPlants.filter(
            (currentPlant) => {
                return currentPlant.plant?.type === "Fruit"
            }
        )

        setFruits(justFruitArray)


        const justVegetableArray = gardenPlants.filter(
            (currentPlant) => {
                return currentPlant.plant?.type === "Vegetable"
            }
        )

        setVegetables(justVegetableArray)

        const justHerbArray = gardenPlants.filter(
            (currentPlant) => {
                return currentPlant.plant?.type === "Herb"
            }
        )

        setHerbs(justHerbArray)
    }

    //Function to take in user as a parameter and produce output of their fruit
    const userFruitFilter = (currentUser) => {

        const foundGarden = gardenPlants.find(
            (currentPlant) => {
                return currentPlant.garden?.userId === currentUser.id
            }
        ) 

        const foundUserFruitArray = fruits.filter(
            (currentFruit) => {
                return currentFruit?.gardenId === foundGarden?.gardenId
            }
        )

        return <div><h1 className="plantTypeTitles">Fruit</h1>
            {foundUserFruitArray.map(
                (currentFruit) => {
                    return <div><p className="individualPlant"><b>{currentFruit.plant?.name}</b></p>
                            {commentParagraphAddition(currentFruit)}</div>
                }
            )}
            </div>

    }

    //Function to take in user as a parameter and produce output of their vegetables
    const userVegetableFilter = (currentUser) => {

        const foundGarden = gardenPlants.find(
            (currentPlant) => {
                return currentPlant.garden?.userId === currentUser.id
            }
        ) 

        const foundUserVegetableArray = vegetables.filter(
            (currentVegetable) => {
                return currentVegetable?.gardenId === foundGarden?.gardenId
            }
        )

        return <div><h1 className="plantTypeTitles">Vegetables</h1>
            {foundUserVegetableArray.map(
                (currentVegetable) => {
                    return <div><p className="individualPlant"><b>{currentVegetable.plant?.name}</b></p>
                            {commentParagraphAddition(currentVegetable)}</div>
                }
            )}
            </div>

    }

    //Function to take in user as a parameter and produce output of their herbs
    const userHerbFilter = (currentUser) => {

        const foundGarden = gardenPlants.find(
            (currentPlant) => {
                return currentPlant.garden?.userId === currentUser.id
            }
        ) 

        const foundUserHerbArray = herbs.filter(
            (currentHerb) => {
                return currentHerb?.gardenId === foundGarden?.gardenId
            }
        )

        return <div><h1 className="plantTypeTitles">Herbs</h1>
            {foundUserHerbArray.map(
                (currentHerb) => {
                    return <div><p className="individualPlant"><b>{currentHerb.plant?.name}</b></p>
                            {commentParagraphAddition(currentHerb)}</div>
                }
            )}
            </div>

    }

    const commentParagraphAddition = (currentPlant) => {
        if (currentPlant.comment){
            return <p className="userComment">Comments: {currentPlant.comment}</p>
        }
    }


    //This function checks if the user selected a zone from the dropdown
    const filterCheck = (foundZone) => {

        //filter users in selected zone
        const filteredUserArray = users.filter(
            (currentUser) => {
                return currentUser?.zoneId === foundZone
            }
        )

        let jsx = []

        //No zone filter if unselected or "See all" selected
        if (foundZone === 0 || foundZone === 14) {
            users.forEach(
                (currentUser) => {
                    jsx.push(
                    <div className="individualGarden">
                        <h1 className="userGardenTitle">{currentUser?.name}'s &nbsp;garden in Zone {currentUser?.zoneId}</h1>
                        <div className="plantSectionContainer">
                            <div className="individualSection">
                                {userFruitFilter(currentUser)}
                            </div>
                            <div className="individualSection">
                                {userVegetableFilter(currentUser)}
                            </div>
                            <div className="individualSection">
                                {userHerbFilter(currentUser)}
                            </div>
                        </div>
                    </div>
                    )
                }
            )
        //Filter by zone if selected
        } else {
            filteredUserArray.forEach(
                (currentUser) => {
                    jsx.push(
                    <div className="individualGarden">
                        <h1 className="userGardenTitle">{currentUser?.name}'s &nbsp;garden</h1>
                        <div className="plantSectionContainer">
                            <div className="individualSection">
                                {userFruitFilter(currentUser)}
                            </div>
                            <div className="individualSection">
                                {userVegetableFilter(currentUser)}
                            </div>
                            <div className="individualSection">
                                {userHerbFilter(currentUser)}
                            </div>
                        </div>
                    </div>
                    )
                }
            )
        }

        //Add found zone === 0
        if (filteredUserArray.length === 0 && foundZone.length !== 0 && foundZone !== 14 && foundZone !== 0){
            jsx.push(<p id="noGardenMessage">There aren't any established gardens in Zone {parseInt(foundZone)} yet.</p>)
        }


        setGardenToDisplay(jsx)
        
    }


    return (
        <>
        <div className="mainContainer">
            <div id="filterContainer">
            <section id="zoneDropdownFilter">
                <fieldset id="zoneFilterFieldset">
                    <label id="zoneSelectLabel" htmlFor="zone"> Filter by zone </label>
                    <select className="minimal" onChange={parseEvent}>
                        <option value="0">Select a zone</option>
                        <option value="1" id="zoneId">1</option>
                        <option value="2" id="zoneId">2</option>
                        <option value="3" id="zoneId">3</option>
                        <option value="4" id="zoneId">4</option>
                        <option value="5" id="zoneId">5</option>
                        <option value="6" id="zoneId">6</option>
                        <option value="7" id="zoneId">7</option>
                        <option value="8" id="zoneId">8</option>
                        <option value="9" id="zoneId">9</option>
                        <option value="10" id="zoneId">10</option>
                        <option value="11" id="zoneId">11</option>
                        <option value="12" id="zoneId">12</option>
                        <option value="13" id="zoneId">13</option>
                        <option value="14" id="zoneId">See all</option>)
                    </select>
                </fieldset>
            </section>
            </div>
            <section id="allGardens">
                {
                    gardenToDisplay.map(
                        (garden) => {
                            if (gardenToDisplay !== 0 || gardenToDisplay !== undefined){
                                return garden
                            }
                        }
                    )
                }
            </section>
        </div>
        </>
    )
}