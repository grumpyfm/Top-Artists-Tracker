import React from 'react';
import {Link, Redirect} from "react-router-dom";

const Dashboard=(props)=> {
        if (props.toSearchList === true) {
            return <Redirect to='/searchResult'/>
        } else if (props.toSearchItem === true) {
            return <Redirect to={`/artist/${props.artistPath}`}/>
        }
        if (props.atistsList.length !== 0) {
            return (
                props.atistsList.map((el, index) =>
                    <div className='artistItem ' key={index}>
                        <Link to={{pathname: `/artist/${el.name}`}}
                              onClick={() => props.handleArtistClick(el.name)}>
                            <div>
                                <img className='songListImg' alt='' src={el.image[2]['#text'] !== '' ? (el.image[2]['#text']) : (props.defaultImage)}/>
                            </div>
                            <p> {el.name}</p>
                        </Link>
                        <i key={index} onClick={() => {
                            props.addRemoveFavorite(el)
                        }} className={`fas fa-heart heartIcon ${checkIfFav(el) ? ('red') : ('')}`}/>
                    </div>
                ))
        } else {
            return (<div>List is empty</div>
            )
        }

  function checkIfFav(artist){
        return props.favoriteArtists.find((el) => el.name === artist.name);
    }

};

export default Dashboard;
