import React, { Component, Button } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

export class FetchData extends Component {
  static displayName = FetchData.name;

  constructor(props) {
    super(props);
      this.state = { reads: [], loading: true, transactionId: "", hubConnection: null  };
  }

   componentDidMount() {
       const hubConnection = new HubConnectionBuilder()
           .withUrl("/MessageHub")
           .configureLogging(LogLevel.Information)
           .withAutomaticReconnect()
           .build();
       this.setState({ hubConnection }, () => {
           this.state.hubConnection
               .start()
               .then(() => console.log('Connection started!'))
               .catch(err => console.log('Error while establishing connection :('));

           hubConnection.on("ReceiveMessage", (transactionId) => {
               console.log("ReceiveMessage get Transaction Id" + transactionId);

               this.setState({ transactionId }, () => this.populateWeatherData());
           });
       });
   }

  componentDidUpdate(prevProps) {
    if (this.props.signalrMessage && this.props.signalrMessage !== prevProps.signalrMessage) {
      this.populateWeatherData();
    }
    }

    handleClick(id) {
        let reads = this.state.reads;
        reads.map(read => read.match = (read.transactionId == id) ? 1 : 2);
        this.setState({ reads });
    }


   renderForecastsTable(reads) {
    return (
      <table className='table' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Plate</th>
            <th>Patch Image</th>
            <th>Overview Image</th>
          </tr>
        </thead>
        <tbody>
                {reads.map(read =>
                    <tr key={read.transactionId} onClick={() => this.handleClick(read.transactionId)} className={(read.match == 1) ? "table-primary" :""} >
                  <td>{read.licencePlate}</td>
                  <td><img src={'data:image/jpeg;base64,' + read.platePatch}/></td>
                        <td><img src={'data:image/jpeg;base64,' + read.image} style={{ height: "80px" }}/></td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Waiting for signal to load...</em></p>
      : this.renderForecastsTable(this.state.reads);

    return (
      <div>
            <h1 id="tabelLabel" >Which is your car?</h1>
            <p>Please select your car among the possible matches</p> 
            {contents}
            <button className="btn btn-primary" onClick={() => this.submitMatch()}>Submit</button>
      </div>
    );
  }

    async populateWeatherData() {
        const response = await fetch('Reads/GetPossibleMatches/' + this.state.transactionId);
    const data = await response.json();
    this.setState({ reads: data, loading: false });
    }

    async submitMatch() {
        const url = 'Reads/SetMatch/' + this.state.transactionId;
        const match = this.state.reads.find((read) => read.match == 1);
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(match)
        })
        this.setState({ reads: [], loading: true });
    }
}
