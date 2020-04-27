import React from "react";

interface Props{
  items: any[];
  increment: number;
  render: (item: any) => JSX.Element;
}

export class List extends React.PureComponent<Props, {}>{
  lastScrollY = 0;

  componentDidMount(): void{
    window.addEventListener("scroll", this.windowScroll);
  }

  componentWillUnmount(): void{
    window.removeEventListener("scroll", this.windowScroll);
  }

  windowScroll = (): void => {
    if(Math.abs(window.scrollY - this.lastScrollY) >= this.props.increment){
      this.forceUpdate();
    }

    this.lastScrollY = window.scrollY;
  }

  render(): JSX.Element{
    return (
      <>
        {this.props.items.filter((item, i) => i * this.props.increment < window.scrollY + window.innerHeight).map((item) => this.props.render(item))}
      </>
    );
  }
}
