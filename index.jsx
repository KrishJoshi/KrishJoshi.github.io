import React from "react";
import ReactDOM from "react-dom";
import Header from './components/Header'

const profile = {
    name: "Krish Joshi",
    email: "me@krishj.com",
    number: "7794438962"
}

class App extends React.Component {
    render() {
        return <div>
            <Header profile={profile}/>
            <div className="container">
                <h1>Hello {this.props.name}</h1>
            </div>
        </div>
    }
}
ReactDOM.render(<App />, document.getElementById("app"));