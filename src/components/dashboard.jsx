import React, {Component,} from 'react';
import {Link, Redirect} from "react-router-dom";

class Dashboard extends Component {

    render() {
        if (this.props.toDashboard === true) {
            return <Redirect to='/searchResult'/>
        }
        if (this.props.atistsList.length !== 0) {
            return (

                this.props.atistsList.map((el, index) =>
                    <div className='artistItem' key={index}>
                        <Link to={{pathname: `/${el.name}`}}
                              onClick={() => this.props.handleArtistClick(el.name)}>
                            <div><img className='songListImg'
                                      src={el.image[2]['#text'] !== '' ? (el.image[2]['#text']) : (this.props.defaultImage)}/>
                            </div>
                            <p> {el.name}</p>
                        </Link>
                        <i key={index} onClick={() => {
                            this.props.addRemoveFavorite(el)
                        }} className={`fas fa-heart heartIcon ${this.checkIfFav(el) ? ('red') : ('')}`}/>
                    </div>
                ))
        } else {
            return (<div>Add some Artists </div>
            )
        }
    }

    checkIfFav = (obj) => {
        return this.props.favoriteArtists.find((el) => el === obj);

    };

}

export default Dashboard;
