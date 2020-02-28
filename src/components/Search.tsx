import React from "react";
import "./Search.scss";

import {Icon} from "components";

interface Props{
  placeholder: string;
  onValueChange: (value: string) => void;
}

interface State{
  query: string;
}

export class Search extends React.PureComponent<Props, State>{
  constructor(props: Props){
    super(props);

    this.state = {
      query: ""
    };
  }

  setQuery(query: string): void{
    this.setState({query});
    this.props.onValueChange(query);
  }

  render(): JSX.Element{
    return (
      <div className="search-box">
        <div className="icon">{Icon("search")}</div>
        <input type="text" placeholder={this.props.placeholder} value={this.state.query} onChange={(e) => this.setQuery(e.target.value)}/>
        {this.state.query !== "" && <button className="btn icon" onClick={() => this.setQuery("")}>{Icon("close")}</button>}
      </div>
    );
  }
}
