import React, {Component} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {Link, Redirect} from 'react-router-dom';

class Dashboard extends Component {

    render() {
        if (this.props.toSearchList === true) {
            return <Redirect to='/searchResult'/>
        } else if (this.props.toSearchItem === true) {
            return <Redirect to={`/artist/${this.props.artistPath}`}/>
        }
        if (this.props.atistsList.length !== 0) {
            return (
                <div>
                    <InfiniteScroll
                        className='d-flex justify-content-around flex-wrap'
                        dataLength={this.props.atistsList.length}
                        next={this.props.fetchMoreData}
                        hasMore={this.props.hasMore}
                        loader={<h4>Loading...</h4>}>
                        {this.props.atistsList.map((el, index) => (
                            <div className='artistItem ' key={index}>
                                <img className='songListImg' alt=''
                                     src={el.image[3]['#text'] !== '' ? (el.image[3]['#text']) : (this.props.defaultImage)}/>
                                <Link to={{pathname: `/artist/${el.name}`}}
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          this.props.handleArtistClick(el.name)
                                      }}>
                                    <h6 className='artistNameTable'> {el.name}</h6>
                                </Link>
                                <i key={index} onClick={() => {
                                    this.props.addRemoveFavorite(el)
                                }}
                                   className={`fas fa-heart heartIcon ${this.checkIfFav(el) ? ('red') : ('')}`}/>
                            </div>))}
                    </InfiniteScroll>
                </div>
            )
        } else {
            return (<div></div>
            )
        }
    }

    checkIfFav = (artist) => {
        return this.props.favoriteArtists.find((el) => el.name === artist.name);
    }
}

export default Dashboard;
