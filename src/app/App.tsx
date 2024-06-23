import React from 'react';
import AuthProvider from "./context/auth";
import SignIn from "../components/SignIn/SignIn";
import Register from "../components/Register/Register";

function App() {
    return (
        <AuthProvider>
            <div className="App">
                <h1>Firebase Authentication</h1>
                <SignIn />
                <Register />
            </div>
        </AuthProvider>
    );
}

export default App;
