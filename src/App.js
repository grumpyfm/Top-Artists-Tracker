import React, {Component, lazy, Suspense} from 'react';
import {BrowserRouter as Router, Route, Link, Redirect} from "react-router-dom";
import './App.css';
import {Navbar, Form, FormControl, Button, Nav} from 'react-bootstrap';
import SearchResult from './components/searchResult';
import ArtistDetail from './components/artistDetail';

const Dashboard = lazy(() => import('./components/dashboard'));


class App extends Component {
    state = {
        KEY: '86ef0c95113dbb5b722096388d0efd20',
        defaultImage:'http://warnerclassics.de.457elmp30.blackmesh.com/img_style/default_cover_m.jpg',
        ukraineTopArtists: [],
        favoriteArtists: [],
        artistDetail: [],
        artistName: 'undefined',
        toDashboard: false,
        searchItem: '',
        searchResult: [],
    };

    render() {

        return (
            <Router>
                <div>
                    <Navbar bg="light" expand="lg">
                        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                                <Link className="navbar-brand" onClick={this.updateDashboardState} to="/">Artists</Link>
                                <Link className="navbar-brand" onClick={this.updateDashboardState} to='/favorites'>Favorites</Link>
                            </Nav>
                            <Form inline onSubmit={this.submitHandler}>
                                <FormControl type="text" placeholder="Search"
                                             onChange={this.handleChange}
                                             className="mr-sm-2"/>
                                <Button variant="outline-success" type='sybmit'>Search</Button>
                            </Form>
                        </Navbar.Collapse>
                    </Navbar>
                    <div className=' d-flex justify-content-around flex-wrap'>
                        <Route exact path='' component={this.homePage}/>
                        <Route exact path={'/searchResult'} component={this.searchResultPage}/>
                        <Route exact path={'/favorites'} component={this.favoritesPage}/>
                        <Route exact path={`/${this.state.artistName}`} component={this.artistDetailPage}/>
                    </div>
                </div>
            </Router>
        );
    }


    homePage = () => {
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <Dashboard
                    defaultImage={this.state.defaultImage}
                    favoriteArtists={this.state.favoriteArtists}
                    addRemoveFavorite={this.addRemoveFavorite}
                    toDashboard={this.state.toDashboard}
                    handleArtistClick={this.handleArtistClick}
                    atistsList={this.state.ukraineTopArtists}/>
            </Suspense>)
    };
    searchResultPage = () => {
        return (
            <SearchResult
                defaultImage={this.state.defaultImage}
                toDashboard={this.state.toDashboard}
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
                toDashboard={this.state.toDashboard}
                handleArtistClick={this.handleArtistClick}
                atistsList={this.state.favoriteArtists}/>
        )
    };
    artistDetailPage = () => {
        return (
            <ArtistDetail
                toDashboard={this.state.toDashboard}
                updateArtistDetails={this.updateArtistDetails}
                artistDetail={this.state.artistDetail}
                handleArtistDetails={this.handleArtistDetails}
            />
        )
    };
    handleSearch = () => {
        fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${this.state.searchItem}&api_key=${this.state.KEY}&format=json`)
            .then(response => {
                response.json()
                    .then((data) => {
                        console.log('data',data);
                        this.setState({
                            searchResult: data.results.artistmatches.artist
                        });
                    })
            })
    };
    handleChange = (event) => {
        this.setState({
            searchItem: event.target.value
        });
    };
updateDashboardState=()=>{
    this.setState({
        toDashboard: false
    });
}
    submitHandler = (evt) => {
        evt.preventDefault();
        if (this.state.searchItem !== '') {
            this.setState({
                toDashboard: true
            });
            this.handleSearch();
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

    handleArtistClick = (artist) => {
        this.setState({artistName: artist});
        this.setState({
            toDashboard: false
        });
    };
    updateArtistDetails = (artist) => {
        this.setState({artistDetail: artist});

    };
    handleArtistDetails = () => {
        fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${this.state.artistName}&api_key=${this.state.KEY}&format=json`)
            .then(
                response => {
                    response.json()
                        .then((data) => {
                            this.updateArtistDetails(data.artist);
                        })
                })
    }

}

export default App;