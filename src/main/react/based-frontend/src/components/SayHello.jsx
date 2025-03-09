import {useState, useEffect} from "react";

export default function SayHello(){
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch('http://localhost:8080')
        .then(response => response.text())
        .then(data => setMessage(data))
        .catch(error => console.error("Error fetching message", error))
    }, [])

    console.log(message);

    return(
        <div>
            <h1>{message}</h1>
        </div>
    );
}

