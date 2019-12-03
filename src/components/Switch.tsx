import React from "react";
import "./Switch.scss";

interface Props{
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

interface State{
  checked: boolean;
}

export class Switch extends React.Component<Props, State>{
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
      <label className="switch" data-checked={this.state.checked} onClick={() => this.toggle()}>
        <div>
          <b className="switch__label">{this.props.label}</b>
          <div className="switch__inner-container">
            <div className="switch__slider"></div>
          </div>
        </div>
        {this.props.description ? <small>{this.props.description}.</small> : null}
      </label>
    );
  }
}
