import React, { Component } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

export class Counter extends Component {
  static displayName = Counter.name;

  constructor(props) {
    super(props);
    this.state = { nick: "", currentCount: 0, hubConnection: null };
    this.incrementCounter = this.incrementCounter.bind(this);
  }

  componentDidMount = () => {
    const nick = window.prompt('Your name:', 'John');

    const hubConnection = new HubConnectionBuilder()
    .withUrl("/chat")
    .configureLogging(LogLevel.Information)
    .withAutomaticReconnect()
    .build();


    this.setState({ nick, hubConnection }, () => {
      this.state.hubConnection
        .start()
        .then(() => console.log('Connection started!'))
        .catch(err => console.log('Error while establishing connection :('));

        hubConnection.on("ReceiveMessage", (user, message) => {
          console.log(user + " says " + message);

          this.setState({ currentCount: parseInt(message) })
      });

    });
  };

  sendMessage = (currentCount) => {
    this.state.hubConnection
      .invoke('SendMessage', this.state.nick, currentCount + "")
      .catch(err => console.error(err));    
  };

  incrementCounter() {
    const currentCount = this.state.currentCount + 1
    this.setState({ currentCount });

    this.sendMessage(currentCount)
  }

  render() {
    return (
      <div>
        <h1>Counter</h1>

        <p>This is a simple example of a React component.</p>

        <p aria-live="polite">Current count: <strong>{this.state.currentCount}</strong></p>

        <button className="btn btn-primary" onClick={this.incrementCounter}>Increment</button>
      </div>
    );
  }
}
