import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import React, { Component } from 'react';

export function withSignalr(WrappedComponent) {
    return class extends React.Component {
        constructor(props) {
          super(props);
          this.handleSendMessage = this.handleSendMessage.bind(this);
          this.state = {
            clientName: props.clientName,
            hubConnection: null,
            message: ""
          };
        }
    
        componentDidMount() {
            const hubConnection = new HubConnectionBuilder()
                .withUrl("/chat")
                .configureLogging(LogLevel.Information)
                .withAutomaticReconnect()
                .build();

            this.setState({hubConnection}, () => {
                this.state.hubConnection
                    .start()
                    .then(() => console.log('Connection started!'))
                    .catch(err => console.log('Error while establishing connection :('));
        
                this.state.hubConnection.on("ReceiveMessage", (user, message) => {
                  console.log(user + " says " + message);
        
                  this.setState({ message })
                });
            });
          // ... that takes care of the subscription...
          //DataSource.addChangeListener(this.handleChange);
        }
    
        componentWillUnmount() {
            this.state.hubConnection.off("ReceiveMessage");
            this.state.hubConnection.stop();
        }
    
        handleSendMessage(message) {
          this.setState.hubConnection
          .invoke("SendMessage", this.setState.clientName, message)
          .catch(err => console.error(err)); ;
        }
    
        render() {
          // ... and renders the wrapped component with the fresh data!
          // Notice that we pass through any additional props
          return <WrappedComponent signalrMessage={this.state.message} {...this.props} />;
        }
      };

}
