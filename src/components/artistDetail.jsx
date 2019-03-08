import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';


class ArtistDetail extends Component {

    render() {
        if (this.props.toSearchList === true) {
            return <Redirect to='/searchResult'/>
        } else if (this.props.toSearchItem === true) {
            return <Redirect to={`/artist/${this.props.artistPath}`}/>
        }
        if (this.props.artistDetail.length !== 0) {
            let text = this.props.artistDetail.bio.summary.split('<a');
            let newSummary = text[0] + '.';
            return (
                <div>
                    <div className='d-flex justify-content-around flex-wrap'>
                        <div className='artistDetailBlock'><img src={this.props.artistDetail.image[4]['#text']} alt=''/>
                            <i key={this.props.artistDetail.name} onClick={() => {
                                this.props.addRemoveFavorite(this.props.artistDetail)
                            }}
                               className={`fas fa-heart heartIcon ${this.checkIfFav(this.props.artistDetail) ? ('red') : ('')}`}/>
                        </div>
                        <div>{newSummary}</div>
                    </div>
                    <h3>Similar artists:</h3>
                    <div
                        className=' d-flex justify-content-around flex-wrap'>{this.props.artistDetail.similar.artist.map((el, index) =>
                        <div className='artistItem' key={index}>
                            <Link to={{pathname: `/artist/${el.name}`}}
                                  onClick={() => this.props.handleArtistClick(el.name)}>
                                <div><img className='songListImg' alt=''
                                          src={el.image[2]['#text'] !== '' ? (el.image[2]['#text']) : (this.props.defaultImage)}/>
                                </div>
                                <p> {el.name}</p>
                            </Link>
                        </div>)}
                    </div>
                </div>)
        } else {
            return (<div></div>)
        }
    }

    componentWillMount() {
        this.props.updateArtistDetails([])
    }

    componentDidMount() {
        this.props.handleArtistDetails();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.artistPath !== this.props.artistPath) {
            this.props.handleArtistDetails();
        }
    }

    checkIfFav = (artist) => {
        if (this.props.favoriteArtists.length !== 0) {
            return this.props.favoriteArtists.find((el) => el.name === artist.name);
        }
    };

}

export default ArtistDetail;