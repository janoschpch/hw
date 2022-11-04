import React, { ChangeEventHandler } from "react";
import './Input.css';

interface IInputComponentProps {
    type: string,
    placeholder: string,
    key?: string,
    onChange: ChangeEventHandler
}

interface IInputComponentState {
    type: string,
    placeholder: string,
    key?: string,
    onChange: ChangeEventHandler
}

export default class Input extends React.Component<IInputComponentProps, IInputComponentState> {
    constructor(props: IInputComponentProps) {
        super(props);
        this.state = {
            type: this.props.type,
            placeholder: this.props.placeholder,
            key: this.props.key,
            onChange: this.props.onChange
        }
    }
    render() {
        let id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        if(this.state.key) {
            return (
                <div className="input-form">
                    <input type={this.props.type} name={id} autoComplete="off" onChange={this.props.onChange} key={this.state.key} required/>
                    <label className="input-label-input" htmlFor={id}>
                        <span className="input-content-input">{this.props.placeholder}</span>
                    </label>
                </div>
            );
        }
        return (
            <div className="input-form">
                <input type={this.props.type} name={id} autoComplete="off" onChange={this.props.onChange} id={id} required/>
                <label className="input-label-input" htmlFor={id}>
                    <span className="input-content-input">{this.props.placeholder}</span>
                </label>
            </div>
        );
    }
}