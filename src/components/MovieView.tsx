import React, { ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector, } from "react-redux";
import { Container, Grid, List, ListItem, ListItemText, SnackbarContent, ListItemAvatar, Box } from "@material-ui/core";
import InfiniteScroll from 'react-infinite-scroll-component';
import { makeStyles } from "@material-ui/core";
import './MovieView.scss';
import { RootType } from "../store";
import { setBriefMovies, MovieState, setCurrentMovie } from "../slices/movie-slice";
import { Search, BriefMovie } from "../models/Search";
import { Constants } from "../constants";
import { Movie } from "../models/Movie";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper
    },
    snackBarDiv: {
        maxWidth: 600,
        '& > * + *': {
          marginTop: theme.spacing(2),
        },
        margin: '0 auto'
      }
}));

export const MovieView = (): ReactElement => {
    const [hasData, setData] = useState(true);
    const classes = useStyles();
    const movieState = useSelector<RootType>(state => state.Movie) as MovieState;
    const dispatch = useDispatch();

    useEffect(() => {
        setData(true);  //prevent all data had been loaded with previous keyword and so hasData would be false, scrollable won't work anymore
    }, [movieState.keyword]);

    const fetchMovieTitlesMore = async() => {
        if (movieState.totalItems <= movieState.briefMovies.length) {
            setData(false);
            return;
        }

        let list = movieState.briefMovies;

        try {
            const response = await fetch(`${Constants.BASE_URL}?s=${movieState.keyword}&page=${movieState.currentPage + 1}&apikey=${Constants.API_KEY}`);

            if (response.ok) {
                const data = await response.json();
                const addedList = Array.from((data as Search).Search);

                if (addedList.length === 0) {
                    setData(false);
                    return;
                }

                list = list.concat(addedList);

                dispatch(setBriefMovies([list, movieState.keyword, movieState.currentPage + 1, movieState.totalItems]));
            }
        } catch {
            setData(false);
            return;
        }
    }

    const handleSelectMovie = async (event: any, index: number) => {
        try {
            const briefMovie = movieState.briefMovies[index];
            const response = await fetch(`${Constants.BASE_URL}?i=${briefMovie.imdbID}&plot=full&apikey=${Constants.API_KEY}`);

            if (response.ok) {
                const data = await response.json();
                dispatch(setCurrentMovie([index, data as Movie]));
            }
        } catch (err) {

        }
    }

    /**
     * Render brief movies list to UI
     * @returns 
     */
     const renderBriefMovies = () => {
        return (
            <Box id='box-brief-movies-list' style={{ minHeight: 300, maxHeight: 700, marginBottom: 30, overflow: 'auto' }}>
                <List component="nav" aria-label="brief movies list">
                    <InfiniteScroll dataLength={movieState.briefMovies.length}
                        next={fetchMovieTitlesMore}
                        hasMore={hasData}
                        scrollThreshold={0.6}
                        loader={<h4>Loading...</h4>}
                        scrollableTarget="box-brief-movies-list">
                        {movieState.briefMovies.map((m: BriefMovie, index: number) =>
                            <ListItem key={index} alignItems="flex-start" button selected={movieState.selectedIndex === index}
                                onClick={(event) => handleSelectMovie(event, index)}>
                                <ListItemAvatar>
                                    <img src={m.Poster} alt={m.Title} style={{ maxWidth: 50, maxHeight: 50, objectFit: 'cover' }} />
                                </ListItemAvatar>
                                <ListItemText primary={m.Title} secondary={m.Year} />
                            </ListItem>
                        )}
                    </InfiniteScroll>
                </List>
            </Box>
        )
    }

    return (
        <Container className='main-container'>
            <Grid container direction='row' style={{ padding: 30 }}>
                <Grid item sm={12} lg={3} className={classes.root} >
                    {movieState.briefMovies.length === 0 ? <h2>Type movie title for search...</h2> : renderBriefMovies()}
                </Grid>

                <Grid item sm={12} lg={9}>
                    {movieState.briefMovies.length === 0 ? <div></div>
                        : movieState.selectedIndex === -1 ?
                            <Grid container direction='row'>
                                <Grid item sm={12} className={classes.snackBarDiv}>
                                    <SnackbarContent
                                        message={
                                            <Grid item sm={12} style={{ textAlign: 'center', margin: '0 auto', lineHeight: 2 }}>
                                                <h1>Pick any movie that you want to find out &nbsp; *_*</h1>
                                                <h3>We are ready</h3>
                                            </Grid>
                                        }
                                    />
                                </Grid>
                            </Grid>
                            :
                            <Grid container direction="row">
                                <Grid item sm={12} style={{ textAlign: 'center', margin: '0 auto', marginBottom: 30 }}>
                                    <h1>{movieState?.currentMovie?.Title}</h1>
                                </Grid>
                                <Grid container direction='row'>
                                    <Grid item sm={12} lg={3} style={{ textAlign: 'center', margin:'0 auto', marginBottom: 30, paddingLeft: 30 }}>
                                        <img className='thumbnail' src={movieState?.currentMovie?.Poster} alt={movieState?.currentMovie?.Title} />
                                    </Grid>
                                    <Grid item sm={12} lg={9} id='grid-info' style={{ textAlign: 'left', lineHeight: 2, marginBottom: 30, paddingLeft: 30 }}>
                                        <p>- Released: {movieState?.currentMovie?.Released}</p>
                                        <p>- {movieState?.currentMovie?.Genre?.indexOf(',') !== -1 ? 'Genres' : 'Genre'}:
                                            {<ul>
                                                {movieState?.currentMovie?.Genre?.split(',').map(m => <li>{m.trim()}</li>)}
                                            </ul>}
                                        </p>
                                        <p>- {movieState?.currentMovie?.Director?.indexOf(',') !== -1 ? 'Directors' : 'Director'}:
                                            {<ul>
                                                {movieState?.currentMovie?.Director?.split(',').map(m => <li>{m.trim()}</li>)}
                                            </ul>}
                                        </p>
                                        <p>- {movieState?.currentMovie?.Writer?.indexOf(',') !== -1 ? 'Writers' : 'Writer'}:
                                            {<ul>
                                                {movieState?.currentMovie?.Writer?.split(',').map(m => <li>{m.trim()}</li>)}
                                            </ul>}
                                        </p>
                                        <p>- Actors:
                                            <ul>
                                                {movieState?.currentMovie?.Actors?.split(',').map(m => <li>{m.trim()}</li>)}
                                            </ul>
                                        </p>
                                        <p>- Ratings:
                                            <ul>
                                                {movieState?.currentMovie?.Ratings?.map(m => <li>{m?.Source + ' (' + m?.Value + ')'}</li>)}
                                            </ul>
                                        </p>
                                        <p>- Awards: {movieState?.currentMovie?.Awards}</p>
                                        <p>- {movieState?.currentMovie?.Language?.indexOf(',') !== -1 ? 'Languages' : 'Language'}:
                                            {<ul>
                                                {movieState?.currentMovie?.Language?.split(',').map(m => <li>{m.trim()}</li>)}
                                            </ul>}
                                        </p>
                                        <p>- Plot: {movieState?.currentMovie?.Plot}</p>
                                        <p>- {movieState?.currentMovie?.Country?.indexOf(',') !== -1 ? 'Countries' : 'Country'}:
                                            {<ul>
                                                {movieState?.currentMovie?.Country?.split(',').map(m => <li>{m.trim()}</li>)}
                                            </ul>}
                                        </p>
                                        <p>- Website: {movieState?.currentMovie?.Website?.startsWith('http') ? <a href={movieState?.currentMovie?.Website} rel='noreferrer' target='_blank'>
                                                                                                                <button >{movieState?.currentMovie?.Website}</button>
                                                                                                            </a>
                                                                                                          : movieState?.currentMovie?.Website}
                                        </p>
                                    </Grid>
                                </Grid>
                            </Grid>}
                </Grid>
            </Grid>
        </Container>
    )
}