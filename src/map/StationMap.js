import React ,{ Component } from 'react';
import 'leaflet/dist/leaflet.css'
import { Circle, Map, TileLayer, FeatureGroup } from 'react-leaflet'

import './StationMap.css';

class StationMap extends Component {
    center = [28.6126463,77.2314619]
    render() {
        return (
            <Map center={this.center} zoom={12}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://api.mapbox.com/styles/v1/upperwal/ck06t68u40ckc1do50ods3tqe/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidXBwZXJ3YWwiLCJhIjoiY2lxNmVvcGo4MDA3MGZ2bTY1b255OW14dSJ9.h18VG_xCO7yQXMajIqKyHg"
                    />
                <FeatureGroup fillColor="#507AFF" fillOpacity={0.8} stroke={false}>
                    <Circle center={[28.6126463,77.2314619]} radius={1000}/>
                    <Circle center={[28.6106793,77.1966676]} radius={650}/>
                    <Circle center={[28.6532077,77.3330656]} radius={243}/>
                    <Circle center={[28.5764754,77.3555968]} radius={548}/>
                    <Circle center={[28.781172,77.1177814]} radius={428}/>
                    <Circle center={[28.8003859,77.3262338]} radius={1100}/>
                    <Circle center={[28.4763612,77.2249974]} radius={854}/>
                </FeatureGroup>
            </Map>
        )
    }
}

export default StationMap