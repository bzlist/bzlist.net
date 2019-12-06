import React from "react";
import "./Dropdown.scss";

import {Icon} from ".";

interface Props{
  items: string[];
  selected: string;
  onChange: (value: string) => void;
}

interface State{
  show: boolean;
  label: string;
}

export class Dropdown extends React.Component<Props, State>{
  isOpen = false;

  constructor(props: Props){
    super(props);

    this.state = {
      show: false,
      label: this.props.selected
    };
  }

  componentDidMount(): void{
    window.addEventListener("click", this.windowClick);
  }

  componentWillUnmount(): void{
    window.removeEventListener("click", this.windowClick);
  }

  componentDidUpdate(prevProps: Props): void{
    if(prevProps.selected !== this.props.selected){
      this.setState({label: this.props.selected});
    }
  }

  windowClick = (): void =>{
    if(this.isOpen){
      this.setState({show: false});
      this.isOpen = false;
    }else if(this.state.show){
      this.isOpen = true;
    }
  }

  select(item: string): void{
    this.setState({label: item, show: false});
    this.isOpen = false;
    this.props.onChange(item);
  }

  render(): JSX.Element{
    return (
      <div>
        <div className="dropdown" onClick={() => this.setState({show: !this.state.show})}>
          <span className="dropdown__title">{this.state.label}</span>
          {/* <span className="icon dropdown__caret">&#xE70D;</span> */}
          <span className="icon dropdown__caret">{Icon("dropdown")}</span>
        </div>
        {
          this.state.show ? <div className="dropdown__content">
            {this.props.items.map((item: string) =>
              <div key={item} className="dropdown__option" onClick={() => this.select(item)}>{item}</div>
            )}
          </div> : null
        }
      </div>
    );
  }
}
