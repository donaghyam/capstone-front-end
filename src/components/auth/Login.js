import React, { useRef, useState } from "react"
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom"
import "./Auth.css"

export const Login = () => {
    const [email, set] = useState("")
    const existDialog = useRef()
    const history = useHistory()

    const existingUserCheck = () => {
        return fetch(`http://localhost:8088/users?email=${email}`)
            .then(res => res.json())
            .then(user => user.length ? user[0] : false)
    }

    const handleLogin = (e) => {
        e.preventDefault()
        existingUserCheck()
            .then(exists => {
                if (exists) {
                    localStorage.setItem("garden_user", exists.id)
                    history.push("/welcome")
                } else {
                    existDialog.current.showModal()
                }
            })
    }

    return (
        <main className="mainContainerLogin">
            <div id="titleContainer">
            <img id="broccoli" src="https://www.pinclipart.com/picdir/big/540-5403190_broccoli-png-dibujo-de-brocoli-para-colorear-clipart.png" alt="Vegetables Clipart Vegetable Clipart Free Broccoli - Clipart Broccoli@clipartmax.com"></img>
                <div id="title2">
                <h1 id="title">Gardening</h1>
                <h1 id="subtitle">With A Growth Mindset</h1>
                </div>
                <img id="carrot" src="https://www.pinclipart.com/picdir/big/524-5243910_carrot-pictures-free-clipart-vector-freeuse-carrot-free.png" alt="Reindeer Carrots Icon - Carrots For Reindeer Clipart@clipartmax.com"></img>
            </div>

            <dialog className="dialog dialog--auth" ref={existDialog}>
                <div>User does not exist</div>
                <button className="button--close" onClick={e => existDialog.current.close()}>Close</button>
            </dialog>


            <section className="container--login">
                <form className="form--login" onSubmit={handleLogin}>
                    <h1 id="signIn">Please sign in</h1>
                    <fieldset id="inputContainer">
                        <label htmlFor="inputEmail"> Email address </label>
                        <input type="email"
                            onChange={evt => set(evt.target.value)}
                            className="form-control"
                            placeholder="Email address"
                            required autoFocus />
                    </fieldset>
                </form>
                <div id="loginButtonContainer">
                        <button type="submit" id="loginButton" onClick={handleLogin}>
                            Sign in
                        </button>
                </div>
                <div id="link--register">
                    <Link to="/register">Not a member yet?</Link>
                </div>
            </section>
        </main>
    )
}

