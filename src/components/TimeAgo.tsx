import React from "react";

// time constants
const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

interface Props{
  timestamp: number;
}

interface State{
  text: string;
}

export class TimeAgo extends React.Component<Props, State>{
  timer: any;

  constructor(props: Props){
    super(props);

    this.state = {
      text: ""
    };
  }

  componentDidMount(): void{
    this.update();
  }

  componentWillUnmount(): void{
    window.clearTimeout(this.timer);
  }

  update = (): void => {
    // convert from timestamp to time ago
    const value = new Date().getTime() / 1000 - this.props.timestamp;
    let time = "just now";

    if(value < 0){
      time = "never";
    }else if(value >= DAY * 2){
      time = `${Math.floor(value / DAY)} days ago`;
    }else if (value >= DAY){
      time = "a day ago";
    }else if (value >= HOUR * 2){
      time = `${Math.floor(value / HOUR)} hours ago`;
    }else if (value >= HOUR) {
      time = "an hour ago";
    }else if (value >= MINUTE * 2){
      time = `${Math.floor(value / MINUTE)} minutes ago`;
    }else if (value >= MINUTE){
      time = "a minute ago";
    }

    this.setState({text: time});
    // create timer
    this.timer = setTimeout(this.update, Number.isNaN(this.props.timestamp) ? 1000 : this.getSecondsUntilUpdate(value) * 1000);
  }

  private getSecondsUntilUpdate(seconds: number): number{
    if(seconds < MINUTE){
      // less than 1 min, update every 5 seconds
      return 5;
    }else if(seconds < HOUR){
      // less than an hour, update every 30 seconds
      return 30;
    }else if(seconds < DAY){
      // less then a day, update every 5 minutes
      return MINUTE * 5;
    }

    // update every hour
    return HOUR;
  }

  render(): JSX.Element{
    return (
      <span>{this.state.text}</span>
    );
  }
}
