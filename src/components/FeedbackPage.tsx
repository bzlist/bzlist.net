import React from "react";

import {api, storage} from "../lib";
import {Link} from "react-router-dom";

interface State{
  feedback: string;
  message: string;
  authed: boolean;
}

export class FeedbackPage extends React.Component<any, State>{
  constructor(props: any){
    super(props);

    this.state = {
      feedback: "",
      message: "",
      authed: false
    };

    this.checkAuth();
  }

  async checkAuth(): Promise<void>{
    const data = await api("users/", undefined, "GET", {
      "Authorization": `Bearer ${storage.get("token")}`
    });

    if(!data || data.error){
      if(data && data.error){
        console.error("error checking token:", data.error);
      }
      return;
    }

    this.setState({authed: true});
  }

  async submit(): Promise<void>{
    const data = await api("feedback", {feedback: this.state.feedback}, "POST", {
      "Authorization": `Bearer ${storage.get("token")}`
    });
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
        <h1>Feedback</h1>
        {this.state.authed ?
          <p>
            <textarea placeholder="Share your thoughts, ideas, or report a bug" value={this.state.feedback} onChange={(e) => this.setState({feedback: e.target.value})}></textarea><br/><br/>
            <button className="btn btn-primary" onClick={() => this.submit()}>Submit</button>
            {this.state.message !== "" && <span>&nbsp;&nbsp;{this.state.message}</span>}
          </p>
        :
          <p>To prevent spam, you must be <Link to="/account">signed in</Link> to leave feedback.</p>
        }
      </div>
    );
  }
}
