import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {Draggable, Droppable} from 'react-beautiful-dnd';


class Favorite extends Component {

    render() {
        if (this.props.toSearchList === true) {
            return <Redirect to='/searchResult'/>
        } else if (this.props.toSearchItem === true) {
            return <Redirect to={`/artist/${this.props.artistPath}`}/>
        }
        if (this.props.atistsList.length !== 0) {
            return (
                <div><Droppable droppableId='droppableId_1'>
                    {(provided) => (
                        <div className='container'
                             {...provided.droppableProps}
                             ref={provided.innerRef}>
                            {this.props.atistsList.map((el, index) => (
                                <Draggable key={index} draggableId={el.name} index={index}>
                                    {(provided) => (
                                        <div>
                                            <div className='d-flex bd-highlight align-items-center favItem'
                                                 ref={provided.innerRef}
                                                 {...provided.draggableProps}
                                                 {...provided.dragHandleProps}>
                                                <i key={index} onClick={() => {
                                                    this.props.addRemoveFavorite(el)
                                                }}
                                                   className={`fas fa-heart heartIconFav ${this.checkIfFav(el) ? ('red') : ('')}`}/>
                                                <div className=' favoriteImageBlock'>
                                                    <img className='favoriteImg'
                                                         alt=''
                                                         src={el.image[2]['#text'] !== '' ? (el.image[2]['#text']) : (this.props.defaultImage)}/>
                                                </div>
                                                <div className=''>
                                                    <Link to={{pathname: `/artist/${el.name}`}}
                                                          onClick={(e) => {
                                                              e.stopPropagation();
                                                              this.props.handleArtistClick(el.name)
                                                          }}>
                                                        <h5 className='favName'> {el.name}</h5>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>)}
                                </Draggable>))}
                            {provided.placeholder}
                        </div>)}
                </Droppable>)
                </div>)
        } else {
            return (<div></div>
            )
        }
    }

    changeSummary = (artist) => {
        let text = artist.split('<a');
        let newSummary = text[0] + '.';
        return (newSummary)
    };

    checkIfFav = (artist) => {
        return this.props.favoriteArtists.find((el) => el.name === artist.name);
    }
}

export default Favorite;
