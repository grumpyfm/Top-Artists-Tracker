import React, {Component, lazy, Suspense} from 'react';
import {BrowserRouter as Router, Route, Link, Redirect} from "react-router-dom";
import './App.css';
import {Navbar, Form, Nav} from 'react-bootstrap';
import SearchResult from './components/searchResult';
import ArtistDetail from './components/artistDetail';
import Autocomplete from 'react-autocomplete';

const Dashboard = lazy(() => import('./components/dashboard'));

class App extends Component {
    state = {
        KEY: '86ef0c95113dbb5b722096388d0efd20',
        defaultImage: 'http://warnerclassics.de.457elmp30.blackmesh.com/img_style/default_cover_m.jpg',
        ukraineTopArtists: [],
        favoriteArtists: [],
        artistDetail: [],
        artistPath: '',
        toSearchList: false,
        toSearchItem: false,
        searchItem: '',
        searchResult: [],
        value: '',
        suggest: []

    };

    render() {
        return (
            <Router>
                <div>
                    <Navbar bg="light" expand="lg">
                        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                                <Link className="navbar-brand" onClick={this.delSearchValue} to="/">Artists</Link>
                                <Link className="navbar-brand" onClick={this.delSearchValue}
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

                    <div className=' d-flex justify-content-around flex-wrap'>
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
            <Suspense fallback={<div>Loading...</div>}>
                <Dashboard
                    artistPath={this.state.artistPath}
                    defaultImage={this.state.defaultImage}
                    favoriteArtists={this.state.favoriteArtists}
                    addRemoveFavorite={this.addRemoveFavorite}
                    toSearchItem={this.state.toSearchItem}
                    toSearchList={this.state.toSearchList}
                    handleArtistClick={this.handleArtistClick}
                    atistsList={this.state.ukraineTopArtists}/>
            </Suspense>)
    };
    searchResultPage = () => {
        return (
            <SearchResult
                artistPath={this.state.artistPath}
                defaultImage={this.state.defaultImage}
                toSearchItem={this.state.toSearchItem}
                favoriteArtists={this.state.favoriteArtists}
                atistsList={this.state.searchResult}
                handleSearch={this.handleSearch}
                handleArtistClick={this.handleArtistClick}
                addRemoveFavorite={this.addRemoveFavorite}
            />)
    };
    favoritesPage = () => {
        return (
            <Dashboard
                defaultImage={this.state.defaultImage}
                favoriteArtists={this.state.favoriteArtists}
                addRemoveFavorite={this.addRemoveFavorite}
                toSearchItem={this.state.toSearchItem}
                toSearchList={this.state.toSearchList}
                handleArtistClick={this.handleArtistClick}
                atistsList={this.state.favoriteArtists}/>
        )
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
                handleArtistDetails={this.handleArtistDetails}
            />
        )
    };

    componentDidMount() {
        fetch(`http://ws.audioscrobbler.com/2.0/?method=geo.gettopartists&country=ukraine&api_key=${this.state.KEY}&format=json`)
            .then(
                response => {
                    response.json()
                        .then((data) => {
                            this.setState({ukraineTopArtists: data.topartists.artist});
                        })
                }
            );
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.value !== '') {
            this.setState({
                toSearchList: true,

            });
            this.handleSearch();
            this.setState({
                value: ''
            });
        }
    };
    handleSearch = () => {
        fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${this.state.value}&api_key=${this.state.KEY}&format=json`)
            .then(response => {
                response.json()
                    .then((data) => {
                        this.setState({
                            searchResult: data.results.artistmatches.artist
                        });
                    })
            })
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
    delSearchValue = () => {
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

        }
    };
    addRemoveFavorite = (el) => {
        let exist = this.state.favoriteArtists.filter((obj => {
            return obj.name === el.name
        }));
        let res = this.state.favoriteArtists;

        if (exist.length === 0) {
            res.push(el);
        } else {
            let index = res.map(function (e) {
                return e.name;
            }).indexOf(exist[0].name);
            res.splice(index, 1);
        }
        this.setState({favoriteArtists: res})

    };
    handleArtistClick = (name) => {
        console.log(name);
        this.setState({artistPath: name});
        this.setState({
            toSearchList: false
        });
    };
    updateArtistDetails = (artist) => {
        this.setState({artistDetail: artist});

    };
    handleArtistDetails = () => {
        let artist;
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