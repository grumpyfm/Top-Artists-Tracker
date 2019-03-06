import React, {Component} from 'react';
import {Redirect} from "react-router-dom";


class ArtistDetail extends Component {
    render() {
        console.log('render');

        if (this.props.toDashboard === true) {
            return <Redirect to='/searchResult'/>
        }
        return (
            this.props.artistDetail.length !== 0 && (
                <div>
                    <div><img src={this.props.artistDetail.image[3]['#text']} alt=""/></div>
                    {this.props.artistDetail.bio.content}
                </div>)
        )
    }

    componentDidMount() {
        this.props.handleArtistDetails();
    }

    componentWillMount() {
        this.props.updateArtistDetails([])
    }

}

export default ArtistDetail;