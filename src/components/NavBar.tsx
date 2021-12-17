import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { alpha, makeStyles } from '@material-ui/core/styles';
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import InfoIcon from '@material-ui/icons/Info';
import MoreIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import { Link } from 'react-router-dom';
import { setBriefMovies } from '../slices/movie-slice';
import { RootType } from '../store';
import { Constants } from '../constants';
import './NavBar.scss'
import { Search } from '../models/Search';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    }
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  tooltip: {
    fontSize: '1em',
    letterSpacing: '0.1em'
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 0.4),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonDesktop: {
    marginRight: 30
  }
}));

export const NavBar = ():ReactElement => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<any>): void => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-navbar';
  const renderMenu = (
    <Menu anchorEl={anchorEl} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} id={menuId}
          keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMenuOpen} onClose={handleMenuClose}>
      <MenuItem onClick={handleMenuClose}>Home page</MenuItem>
      <MenuItem onClick={handleMenuClose}>About</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-navbar-mobile';
  const renderMobileMenu = (
    <Menu anchorEl={mobileMoreAnchorEl} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} id={mobileMenuId}
          keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMobileMenuOpen} onClose={handleMobileMenuClose}>
      <MenuItem>
        <IconButton aria-label='Home'>
          <Link to='/'>
            <HomeIcon style={{color: '#000'}} />
            <h5>Home</h5>
          </Link>
        </IconButton>
      </MenuItem>

      {/* <MenuItem>
        <IconButton aria-label='About'>
          <Link to='/about'>
            <InfoIcon style={{color: '#000'}} />
            <h5>About</h5>
          </Link>
        </IconButton>
      </MenuItem> */}
    </Menu>
  );

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      dispatch(setBriefMovies([[], '', 1, 0])); //to make List scrollbar to top

      const title = (document.querySelector('#search-box') as HTMLInputElement)?.value.trim();
      let response = await fetch(`${Constants.BASE_URL}?s=${title}&apikey=${Constants.API_KEY}`);

      if (response.ok) {
        let data = await response.json();
        let search = data as Search;
        let briefMovies = Array.from(search.Search);
        let currentPage = 1;

        //if the number of data > 10, try to get more to make vertical scrollbar visible
        if (briefMovies.length < parseInt(search.totalResults)) {
          response = await fetch(`${Constants.BASE_URL}?s=${title}&page=2&apikey=${Constants.API_KEY}`);

          if (response.ok) {
            data = await response.json();
            search = data as Search;

            briefMovies = briefMovies.concat(Array.from(search.Search));
            currentPage = 2;
          }
        }

        dispatch(setBriefMovies([briefMovies, title, currentPage, parseInt(search.totalResults)]));
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div id='main-nav-bar' className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="open drawer">
          </IconButton>

          <Typography className={classes.title} variant="h6" noWrap>
            Movie for you
          </Typography>

          <form onSubmit={e => handleSubmit(e)}>
            <div className={classes.search} style={{ display: 'flex' }}>
              <input type='text' id='search-box' style={{ fontSize: '18px' }} />
              <input type='submit' value='Search' style={{ width: '80px' }} />
            </div>
          </form>

          <div className={classes.grow} />

          <div id='section-desktop' className={classes.sectionDesktop}>
            <IconButton aria-label='Home' className={classes.iconButtonDesktop}>
              <Link to='/'>
                <Tooltip title='Home' placement='bottom' classes={{tooltip: classes.tooltip}}>
                  <HomeIcon style={{color: '#fff'}} />
                </Tooltip>
              </Link>
            </IconButton>
            {/* <IconButton aria-label='About' className={classes.iconButtonDesktop}>
              <Link to='/about'>
                <Tooltip title='About' placement='bottom' classes={{tooltip: classes.tooltip}}>
                  <InfoIcon style={{color: '#fff'}} />
                </Tooltip>
              </Link>
            </IconButton> */}
          </div>
          <div className={classes.sectionMobile}>
            <IconButton aria-label="Show more" aria-controls={mobileMenuId} aria-haspopup="true"
                        onClick={handleMobileMenuOpen} color="inherit">
                <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}