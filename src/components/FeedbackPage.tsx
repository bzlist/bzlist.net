import React from "react";

import {api, storage, user} from "../lib";
import {Link} from "react-router-dom";

interface State{
  feedback: string;
  message: string;
}

export class FeedbackPage extends React.PureComponent<any, State>{
  constructor(props: any){
    super(props);

    this.state = {
      feedback: "",
      message: ""
    };
  }

  async submit(): Promise<void>{
    const data = await api("feedback", {feedback: this.state.feedback}, "POST", {
      "Authorization": `Bearer ${storage.get("token")}`
    });

    if(!data){
      this.setState({message: `Unknown error`});
    }

    if(data.error){
      return this.setState({message: `Error: ${data.error}`});
    }

    this.setState({message: data.message});
  }

  render(): JSX.Element{
    return (
      <div className="wrapper">
        <h1>Feedback</h1>
        {user.bzid !== "" ?
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
