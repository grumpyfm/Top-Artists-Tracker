import React, {Component} from 'react';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import './App.css';
import ArtistDetail from './components/artistDetail';
import Autocomplete from 'react-autocomplete';
import {Form, Nav, Navbar} from 'react-bootstrap';
import Dashboard from './components/dashboard';
import {DragDropContext} from 'react-beautiful-dnd';
import Favorite from './components/favorites';

class App extends Component {
    state = {
        KEY: '86ef0c95113dbb5b722096388d0efd20',
        defaultImage: 'http://warnerclassics.de.457elmp30.blackmesh.com/img_style/default_cover_m.jpg',
        fetchPage: 12,
        hasMore: true,

        ukraineTopArtists: [],
        favoriteArtists: [],
        artistDetail: [],
        searchResult: [],
        suggest: [],

        artistPath: '',
        searchItem: '',
        value: '',

        toSearchList: false,
        toSearchItem: false,
    };


    render() {
        return (
            <Router>
                <div className='container-fluid'>
                    <Navbar bg='light' expand='lg'>
                        <Navbar.Toggle aria-controls='basic-navbar-nav'/>
                        <Navbar.Collapse id='basic-navbar-nav'>
                            <Nav className='mr-auto'>
                                <Link className='navbar-brand' onClick={this.cleanSearchValue} to='/'>Artists</Link>
                                <Link className='navbar-brand' onClick={this.cleanSearchValue}
                                      to='/favorites'>Favorites</Link>
                            </Nav>
                            <Form inline onSubmit={(e) => this.handleSubmit(e)}>
                                <div className='mr-sm-2 searchForm'>
                                    <Autocomplete
                                        autoHighlight={false}
                                        value={this.state.value}
                                        items={this.state.suggest}
                                        shouldItemRender={(item, value) => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1}
                                        getItemValue={item => item.name}
                                        renderItem={(item, highlighted) =>
                                            <div
                                                key={item.id}
                                                style={{backgroundColor: highlighted ? '#eee' : 'transparent'}}
                                            >
                                                {item.name}
                                            </div>
                                        }
                                        onSelect={value => {
                                            this.setState({value});
                                            this.handleSelect(value)
                                        }}
                                        onChange={e => {
                                            this.handleChange(e)
                                        }}/>
                                </div>
                            </Form>
                        </Navbar.Collapse>
                    </Navbar>
                    <div className=' '>
                        <Route exact path='' component={this.homePage}/>
                        <Route exact path={'/searchResult'} component={this.searchResultPage}/>
                        <Route exact path={'/favorites'} component={this.favoritesPage}/>
                        <Route exact path={`/artist/${this.state.artistPath}`} component={this.artistDetailPage}/>
                    </div>
                </div>
            </Router>
        );
    }

    homePage = () => {
        return (
            <Dashboard
                hasMore={this.state.hasMore}
                fetchMoreData={this.fetchMoreData}
                artistPath={this.state.artistPath}
                defaultImage={this.state.defaultImage}
                favoriteArtists={this.state.favoriteArtists}
                addRemoveFavorite={this.addRemoveFavorite}
                toSearchItem={this.state.toSearchItem}
                toSearchList={this.state.toSearchList}
                handleArtistClick={this.handleArtistClick}
                atistsList={this.state.ukraineTopArtists}/>
        )
    };
    searchResultPage = () => {
        return (
            <Dashboard
                artistPath={this.state.artistPath}
                defaultImage={this.state.defaultImage}
                toSearchItem={this.state.toSearchItem}
                toSearchList={false}
                favoriteArtists={this.state.favoriteArtists}
                atistsList={this.state.searchResult}
                handleArtistClick={this.handleArtistClick}
                addRemoveFavorite={this.addRemoveFavorite}
            />)
    };
    favoritesPage = () => {
        return (
            <DragDropContext
                onDragEnd={this.onDragEnd}>
                <Favorite
                    getFavoriteFromStorage={this.getFavoriteFromStorage}
                    artistPath={this.state.artistPath}
                    defaultImage={this.state.defaultImage}
                    favoriteArtists={this.state.favoriteArtists}
                    addRemoveFavorite={this.addRemoveFavorite}
                    toSearchItem={this.state.toSearchItem}
                    toSearchList={this.state.toSearchList}
                    handleArtistClick={this.handleArtistClick}
                    atistsList={this.state.favoriteArtists}/>
            </DragDropContext>)

    };
    artistDetailPage = () => {
        return (
            <ArtistDetail
                artistPath={this.state.artistPath}
                handleArtistClick={this.handleArtistClick}
                addRemoveFavorite={this.addRemoveFavorite}
                favoriteArtists={this.state.favoriteArtists}
                toSearchList={this.state.toSearchList}
                updateArtistDetails={this.updateArtistDetails}
                artistDetail={this.state.artistDetail}
                handleArtistDetails={this.handleArtistDetails}/>)
    };

    componentDidMount() {
        this.getFavoriteFromStorage();
        this.fetchMoreData()

    }

    componentDidUpdate(prevState) {
        if (prevState.favoriteArtists !== this.state.favoriteArtists) {
            localStorage.setItem('favoriteArtists', JSON.stringify(this.state.favoriteArtists));
        }
    }

    onDragEnd = (result) => {
        const {destination, source} = result;

        if (!destination) {
            return;
        }
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }
        const favorite = this.state.favoriteArtists;
        let item = favorite[source.index];
        favorite.splice(source.index, 1);
        favorite.splice(destination.index, 0, item);
        this.setState({favoriteArtists: favorite});

    };
    fetchMoreData = () => {
        fetch(`http://ws.audioscrobbler.com/2.0/?method=geo.gettopartists&country=ukraine&limit=12}&page=${this.state.fetchPage}&api_key=${this.state.KEY}&format=json`)
            .then(
                response => {
                    response.json()
                        .then((data) => {
                            let res = this.state.ukraineTopArtists;
                            data.topartists.artist.forEach(artist => res.push(artist));
                            this.setState({ukraineTopArtists: res});
                            let page = this.state.fetchPage + 1;
                            this.setState({fetchPage: page});
                            if (data.topartists.artist.length < 12) {
                                this.setState({hasMore: false});

                            }
                        })
                }
            )
    };

    getFavoriteFromStorage = () => {
        let favorite = JSON.parse(localStorage.getItem('favoriteArtists'));
        this.setState({favoriteArtists: favorite});
    };

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.value !== '') {
            this.setState({
                toSearchList: true,
            });
            fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${this.state.value}&api_key=${this.state.KEY}&format=json`)
                .then(response => {
                    response.json()
                        .then((data) => {
                            this.setState({
                                searchResult: data.results.artistmatches.artist
                            });
                        })
                })
        }
    };

    handleChange = (event) => {
        this.setState({
            value: event.target.value
        });
        if (event.target.value !== '') {
            fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${event.target.value}&limit=10&api_key=${this.state.KEY}&format=json`)
                .then(response => {
                    response.json()
                        .then((data) => {
                            let res = (data.results.artistmatches.artist).map((el) => ({id: el.name, name: el.name}));
                            this.setState({
                                suggest: res
                            });
                        })
                })
        }
    };

    cleanSearchValue = () => {
        this.setState({
            toSearchList: false
        });
        this.setState({
            value: ''
        });
        this.setState({
            toSearchItem: false
        });

    };

    handleSelect = (value) => {
        if (this.state.value !== '') {
            this.setState({
                artistPath: value
            });
            this.setState({
                toSearchItem: true,

            });
            this.setState({
                toSearchList: false,

            });

        }
    };

    addRemoveFavorite = (atist) => {
        let exist = this.state.favoriteArtists.filter((obj => {
            return obj.name === atist.name
        }));
        let res = this.state.favoriteArtists;

        if (exist.length === 0) {
            res.push(atist);
        } else {
            let index = res.map(function (itsm) {
                return itsm.name;
            }).indexOf(exist[0].name);
            res.splice(index, 1);
        }
        this.setState({favoriteArtists: res})
    };

    handleArtistClick = (name) => {
        this.setState({artistPath: name});
        this.setState({
            toSearchList: false
        });
    };

    updateArtistDetails = (artist) => {
        this.setState({artistDetail: artist});

    };

    handleArtistDetails = () => {
        fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${this.state.artistPath}&api_key=${this.state.KEY}&format=json`)
            .then(
                response => {
                    response.json()
                        .then((data) => {
                            this.updateArtistDetails(data.artist);
                        })
                });

    }

}

export default App;