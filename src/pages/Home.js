import React from 'react'
import APIInput from '../components/APIInput'

export default function Home(props) {
    return (
        <div>
            <APIInput {...props}  token={props.token} />
        </div>
    )
}
