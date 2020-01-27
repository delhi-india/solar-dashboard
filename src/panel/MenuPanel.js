import React ,{ Component } from 'react';
import Switch from '@material-ui/core/Switch';

import './MenuPanel.css';
import Cube from './cube.svg'

class Header extends Component {

    /* handler(val) {
        this.props.switchHandler(val)
    } */
    
    render() {
        return(
            <div className="menu-container">
            <img src={Cube} alt=""/>
            Map
            <Switch
                checked={this.props.switchChecked}
                onChange={this.props.switchHandler.bind(this)}
                value="checkedA"
                color="primary"
                size="small"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
            </div>
        )
    }
}

export default Header