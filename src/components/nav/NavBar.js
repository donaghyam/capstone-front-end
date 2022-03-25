import React from "react"
import { Link } from "react-router-dom"
import "./NavBar.css"

//This component builds the navigation bar for UI

export const NavBar = (props) => {
    return (
        <>
        <div id="navContainer">
            <div id="titleContainer">
                <img id="broccoli" src="https://www.pinclipart.com/picdir/big/540-5403190_broccoli-png-dibujo-de-brocoli-para-colorear-clipart.png" alt="Vegetables Clipart Vegetable Clipart Free Broccoli - Clipart Broccoli@clipartmax.com"></img>
                <div id="title2">
                <h1 id="title">Gardening</h1>
                <h1 id="subtitle">With A Growth Mindset</h1>
                </div>
                <img id="carrot" src="https://www.pinclipart.com/picdir/big/524-5243910_carrot-pictures-free-clipart-vector-freeuse-carrot-free.png" alt="Reindeer Carrots Icon - Carrots For Reindeer Clipart@clipartmax.com"></img>
            </div>
                <ul className="navbar">
                    <li className="navbar__item active">
                        {/* Link component generates anchor tags 
                                -the "to="" attribute is going to be the href attribute 
                                of the anchor tag it's goingt to create
                                -this link component is what broadcasts that the URL has changed */}
                        <Link className="navbar__link" to="/garden">My Garden</Link>
                    </li>
                    <li className="navbar__item active">
                        <Link className="navbar__link" to="/plants">Plants</Link>
                    </li>
                    <li className="navbar__item active">
                        <Link className="navbar__link" to="/viewGardens">View Gardens</Link>
                    </li>
                        {/* Link to logout. This removes the customer object from local storage. */}
                    <li className="navbar__item active">
                        <Link className="navbar__link" to="#" onClick={
                            () => {localStorage.removeItem("garden_user")}}>
                            Logout
                        </Link>
                    </li>
                </ul>
        </div>
        </>
    )
}

//Whenever a link is clicked, the browser broadcasts an event the URL was changed
//  -the ApplicationViews component will be listening for this event
