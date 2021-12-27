import React, { ReactElement } from "react";
import { Grid } from "@material-ui/core";
import { IMovieProps } from "../models/IMovieProps";
import "./MovieInfo.scss";

export const MovieInfo = (props: React.PropsWithChildren<IMovieProps>): ReactElement => {
    const { movie } = props;

    return (
        <Grid container direction="row">
            <Grid item sm={12} style={{ textAlign: 'center', margin: '0 auto', marginBottom: 30, paddingLeft: 30 }}>
                <h1>{movie?.Title}</h1>
            </Grid>
            <Grid container direction='row'>
                <Grid item sm={12} lg={3} style={{ textAlign: 'center', margin: '0 auto', marginBottom: 30, paddingLeft: 30 }}>
                    <img className='thumbnail' src={movie?.Poster} alt={movie?.Title} />
                </Grid>
                <Grid item sm={12} lg={9} id='grid-info' style={{ textAlign: 'left', lineHeight: 2, marginBottom: 30, paddingLeft: 30 }}>
                    <p>- Released: {movie?.Released}</p>
                    <p>- {movie?.Genre?.indexOf(',') !== -1 ? 'Genres' : 'Genre'}:
                        {<ul>
                            {movie?.Genre?.split(',').map(m => <li>{m.trim()}</li>)}
                        </ul>}
                    </p>
                    <p>- {movie?.Director?.indexOf(',') !== -1 ? 'Directors' : 'Director'}:
                        {<ul>
                            {movie?.Director?.split(',').map(m => <li>{m.trim()}</li>)}
                        </ul>}
                    </p>
                    <p>- {movie?.Writer?.indexOf(',') !== -1 ? 'Writers' : 'Writer'}:
                        {<ul>
                            {movie?.Writer?.split(',').map(m => <li>{m.trim()}</li>)}
                        </ul>}
                    </p>
                    <p>- Actors:
                        <ul>
                            {movie?.Actors?.split(',').map(m => <li>{m.trim()}</li>)}
                        </ul>
                    </p>
                    <p>- Ratings:
                        <ul>
                            {movie?.Ratings?.map(m => <li>{m?.Source + ' (' + m?.Value + ')'}</li>)}
                        </ul>
                    </p>
                    <p>- Awards: {movie?.Awards}</p>
                    <p>- {movie?.Language?.indexOf(',') !== -1 ? 'Languages' : 'Language'}:
                        {<ul>
                            {movie?.Language?.split(',').map(m => <li>{m.trim()}</li>)}
                        </ul>}
                    </p>
                    <p>- Plot: {movie?.Plot}</p>
                    <p>- {movie?.Country?.indexOf(',') !== -1 ? 'Countries' : 'Country'}:
                        {<ul>
                            {movie?.Country?.split(',').map(m => <li>{m.trim()}</li>)}
                        </ul>}
                    </p>
                    <p>- Website: {movie?.Website?.startsWith('http') ? <a href={movie?.Website} rel='noreferrer' target='_blank'>
                        <button >{movie?.Website}</button>
                    </a>
                        : movie?.Website}
                    </p>
                </Grid>
            </Grid>
        </Grid>
    )
}