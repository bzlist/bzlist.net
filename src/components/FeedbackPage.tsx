import React from "react";

import {api, storage} from "../lib";

interface State{
  feedback: string;
  message: string;
}

export class FeedbackPage extends React.Component<any, State>{
  constructor(props: any){
    super(props);

    this.state = {
      feedback: "",
      message: ""
    };
  }

  async submit(): Promise<void>{
    const data = await api("feedback", {callsign: storage.get("callsign"), token: storage.get("token"), feedback: this.state.feedback});
    if(!data){
      return;
    }

    if(data.error){
      this.setState({message: `Error: ${data.error}`});
      return;
    }

    this.setState({message: data.message});
  }

  render(): JSX.Element{
    return (
      <div className="wrapper">
        <h1>Feedback</h1><br/>
        {storage.get("bzid") !== "" ?
          <div>
            <textarea placeholder="Share your thoughts, ideas, or report a bug" value={this.state.feedback} onChange={(e) => this.setState({feedback: e.target.value})}></textarea><br/>
            <button className="btn btn-primary" onClick={() => this.submit()}>Submit</button>
            {this.state.message !== "" ?
              <span>&nbsp;&nbsp;{this.state.message}</span>
            : null}
          </div>
        :
          <div>To prevent spam, you must be signed in to leave feedback.</div>
        }
      </div>
    );
  }
}
