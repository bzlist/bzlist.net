import React from "react";
import "./Checkbox.scss";

interface Props{
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

interface State{
  checked: boolean;
}

export class Checkbox extends React.Component<Props, State>{
  constructor(props: Props){
    super(props);

    this.state = {
      checked: this.props.checked
    };
  }

  toggle(): void{
    this.props.onChange(!this.state.checked);
    this.setState({checked: !this.state.checked});
  }

  render(): JSX.Element{
    return (
      <label className="checkbox" data-checked={this.state.checked} onClick={() => this.toggle()}>
        <div className="checkbox__inner-container">
          <span className="checkox__background">
            <svg className="checkbox__checkmark" xmlSpace="preserve" focusable="false" version="1.1" viewBox="0 0 24 24">
              <path d="M4.1,12.7 9,17.6 20.3,6.3" fill="none" stroke="white" strokeWidth="2"></path>
            </svg>
          </span>
        </div>
        <span className="checkbox__label">{this.props.label}</span>
      </label>
    );
  }
}
