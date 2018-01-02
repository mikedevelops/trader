import * as React from 'react';
import * as io from 'socket.io-client';

const gdaxSocket = io();

export default class App extends React.Component {
    public render () {
        return <pre>Hello, World!!!</pre>;
    }
}
