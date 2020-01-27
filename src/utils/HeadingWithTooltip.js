import React ,{ Component } from 'react';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';

import './HeadingWithTooltip.css';

class HeadingWithTooltip extends Component {
    render() {
        return(
            <h5 className="HeadingWithTooltip-h5">
                {this.props.content} 
                <Tooltip title={
                    <React.Fragment>
                        <Typography color="inherit">{this.props.tooltip_title}</Typography>
                <p className="tooltip-html-p">{this.props.tooltip_content}</p>
                    </React.Fragment>
                }>
                    <IconButton aria-label="delete">
                        <InfoIcon />
                    </IconButton>
                </Tooltip>
            </h5>
        )
    }
}

export default HeadingWithTooltip