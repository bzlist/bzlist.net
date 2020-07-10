import React from "react";
import "./Dialog.scss";
import {Icon} from "components";

export const Dialog = (props: {open: boolean; title: string; onClose: () => void; children: React.ReactNode}): JSX.Element | null =>
  props.open ?
    <div className="dialog">
      <span className="dialog__overlay" onClick={() => props.onClose()}></span>
      <div>
        <div className="dialog__header">
          <h3>{props.title}</h3>
          <div className="close"><button className="btn icon" onClick={() => props.onClose()}>{Icon("close")}</button></div>
        </div>
        <div className="dialog__inner">
          {props.children}
        </div>
      </div>
    </div> : null
;
