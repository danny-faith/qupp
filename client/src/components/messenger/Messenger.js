import React from 'react'
import { Textarea } from 'react-materialize';

export default function Chat() {
    return (
        <div>
            <p className="message message--recipient text-right">R.Federer</p>
            <p className="message message--recipient">R.Doom</p>
            <p className="message message--recipient">R.Doom</p>
            <Textarea placeholder="Message" />
        </div>
    )
}
