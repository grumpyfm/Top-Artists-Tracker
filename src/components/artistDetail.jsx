import React, {Component} from 'react';
import {Redirect} from "react-router-dom";


class ArtistDetail extends Component {
    render() {
        if (this.props.toSearchList === true) {
            return <Redirect to='/searchResult'/>
        } else if (this.props.toSearchItem === true) {
            return <Redirect to={`/artist/${this.props.artistPath}`}/>
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