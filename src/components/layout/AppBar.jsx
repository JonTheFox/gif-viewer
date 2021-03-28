import React, {
  useState,
  useContext,
  useCallback,
  useEffect,
  useRef,
} from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Home from "@material-ui/icons/Home";
import Refresh from "@material-ui/icons/Refresh";
import MenuIcon from "@material-ui/icons/Menu";
import FilterDrama from "@material-ui/icons/FilterDrama";
import Chat from "@material-ui/icons/Chat";
import Close from "@material-ui/icons/Close";
import ListIcon from "@material-ui/icons/List";

import TextField from "@material-ui/core/TextField";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import { fade, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import FormatListNumbered from "@material-ui/icons/FormatListNumbered";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { useTheme } from "@material-ui/styles";
import { withRouter } from "react-router";
import { AppContext } from "../../store/AppContext.js";
import { DeviceContext } from "../../store/DeviceContext.js";
import userState from "../../store/UserState.js";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import "./_Appbar.scss";

const APP_ROUTE = "/";

const mainLinks = [
  { title: "Main", path: `${APP_ROUTE}`, Icon: Home },
  {
    title: "History",
    path: `${APP_ROUTE}history`,
    Icon: ListIcon,
    adminOnly: false,
  },
];

const secondaryLinks = [
  {
    title: "Reload",
    callback: () => window.location.reload(true),
    Icon: Refresh,
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  // menuButton: {
  //   marginRight: theme.spacing(2)
  // },
  title: {
    flexGrow: 1,

    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.primary.main, 0.025),
    "&:hover": {
      backgroundColor: fade(theme.palette.primary.main, 0.075),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  autoComplete: {
    transition: theme.transitions.create("width"),
    width: "100%",

    [theme.breakpoints.up("sm")]: {
      width: 200,
      "&:focus": {
        width: 800,
      },
    },
  },
  searchIcon: {
    width: theme.spacing(7),

    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
    // paddingLeft: theme.spacing(0, 0, 0, 2)
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: 120,
      "&:focus": {
        width: 200,
      },
    },
  },

  drawer: {
    width: theme.layout.drawerWidth,
    flexShrink: 0,
    // fontSize: "1.25rem"
  },
  drawerPaper: {
    width: theme.layout.drawerWidth,
  },
  appBar: ({ device }) => ({
    width: "100%",
    marginLeft: 0,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.primary.main,
  }),
  appBarText: {
    // width: "45%", //just so it doesn't get clippeed by the login button on the right
    // fontSize: "1rem",
    flexGrow: 1,
    color: "inherit",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    // textOverflow: "hidden"
  },
  iconButton: {
    marginRight: theme.spacing(2),
    display: "block",
  },
  toolbar: theme.mixins.toolbar,

  icon: {
    fill: theme.palette.secondary.main,
  },
  settings_bar: {
    width: "100%", //as much as available, so that it reaches all the way to the right end
    height: "var(--appbar-height)",
    position: "relative",
  },
  loginBtn: {
    fontSize: "0.75rem",
  },
  avatar: {
    // marginRight: "calc(2 * var(--spacing))",
    // backgroundColor: "var(--secondary)",
    width: "32px",
    height: "32px",
  },
}));

const renderPrimaryListItemText = (title = "") => (
  <ListItemText
    primary={title}
    className={title.length > 7 ? "long-text" : "short-text"}
  />
);
const renderSecondaryListItemText = (title = "") => (
  <ListItemText
    secondary={title}
    className={title.length > 7 ? "long-text" : "short-text"}
  />
);

let logg;
let loggError;
let animationFrame;
let promiseKeeper;
const label = "AppBar";

const ResponsiveDrawer = (props) => {
  const { match } = props;

  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();

  const [searchOptions, setSearchOptions] = useState([]);
  const [getOptionLabel, setGetOptionLabel] = useState(() => {});

  const sharedRefs = useRef(props.sharedRefs?.current || {});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const mediaContext = useContext(DeviceContext);
  const [visible, setVisible] = useState(true);
  const classes = useStyles(mediaContext);
  debugger;
  const res = useContext(AppContext);
  const [appUtils, appState] = res;
  const {
    Logger,
    PromiseKeeper,
    navigateTo,
    DURATIONS,
    request,
    getRandomUpTo,
    DEBUGGING,
  } = appUtils;

  const [user, setUser] = useRecoilState(userState);

  const handleDrawerToggle = () => {
    animationFrame = window.requestAnimationFrame(() => {
      setMobileOpen((prevState) => !prevState);
    });
  };

  const closeLink = {
    title: "",
    path: "",
    Icon: Close,
    callback: handleDrawerToggle,
  };

  const handleLinkClick = (path) => {
    setMobileOpen(false);
    if (!path || !props.history) return null;
    promiseKeeper.stall(DURATIONS.exit, "navigate to page").then(() => {
      animationFrame = window.requestAnimationFrame(() => {
        navigateTo(path, props.history);
      });
    });
  };

  const handleUserMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenuNav = (ev) => {
    const menuitem = ev.target.getAttribute("menuitem");
    handleUserMenuClose();
    promiseKeeper.stall(DURATIONS.exit || 300, "user menu nav").then(() => {
      animationFrame = window.requestAnimationFrame(() => {
        switch (menuitem) {
          case "logout":
            // handleLinkClick("/login");
            // appState.setUser(null);
            setUser(null);
            navigateTo("/login", props.history);
            break;
        }
      });
    });
  };

  useEffect(() => {
    const logger = new Logger({ label });
    logg = logger.logg;
    loggError = logger.loggError;
    promiseKeeper = new PromiseKeeper({ label });
    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  const renderMenuList = useCallback((menuItems, secondary = false) => {
    return menuItems.map(
      ({ title, path, Icon, adminOnly, callback }, index) => {
        if (adminOnly && !(user && user.role === "admin")) return null;
        return (
          <ListItem
            button
            key={title}
            className={`menu-item menu-item--${path ? path.slice(4) : "basic"}`}
            onClick={(ev) => {
              path
                ? handleLinkClick(`${match.path}${path}`)
                : callback
                ? callback(ev)
                : logg(
                    `No path or callback function were provided for menu item titled "${title}"`
                  );
            }}
          >
            <ListItemIcon>
              <Icon
                className={`${classes.icon} menu-item--icon ${
                  secondary ? "secondary" : "primary"
                }-menu-icon`}
              />
            </ListItemIcon>
            {secondary
              ? renderSecondaryListItemText(title)
              : renderPrimaryListItemText(title)}
          </ListItem>
        );
      }
    );
  });

  const drawer = (
    <div className={"appbar--drawer"}>
      <div
        className={`appbar--drawer--bar ${classes.drawer}`}
        onClick={(ev) => ev.stopPropagation()}
      >
        {renderMenuList([closeLink])}
      </div>

      <Divider />
      <List>{renderMenuList(mainLinks)}</List>
      <Divider />
      {renderMenuList(secondaryLinks, "secondary")}
    </div>
  );

  return (
    <div className={clsx("appbar-container unselectable")}>
      <AppBar className={`${classes.appBar} appbar`} elevation={1}>
        <Toolbar className={"appbar--toolbar"}>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={handleDrawerToggle}
            className={clsx(classes.iconButton, mobileOpen && "menu--open")}
          >
            <MenuIcon className={classes.menuButton} />
          </IconButton>

          <Typography
            className={clsx(
              `title nowrap ${classes.appBarText} readable`,
              classes.title
            )}
            color="inherit"
            noWrap
            onClick={() => handleLinkClick(`${match.path}${APP_ROUTE}`)}
          >
            Weiss
          </Typography>

          {user ? (
            <div>
              <IconButton
                aria-label="user account"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleUserMenuClick}
                color="inherit"
              >
                <div
                  className={clsx("settings_bar", classes.settings_bar)}
                ></div>
                <Avatar
                  alt={user?.first_name}
                  src={user?.profile_pic_url}
                  className={classes.avatar}
                  style={{ paddingTop: 0, paddingBottom: 0 }}
                  // onClick={() => handleLinkClick("/login")}
                />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleUserMenuClose}
              >
                <MenuItem disabled onClick={handleUserMenuClose}>
                  Profile
                </MenuItem>
                <MenuItem disabled onClick={handleUserMenuClose}>
                  My account
                </MenuItem>
                <MenuItem menuitem="logout" onClick={handleUserMenuNav}>
                  Log out
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <Button
              className={clsx("login-btn", classes.loginBtn)}
              color="inherit"
              variant="outlined"
              size="small"
              onClick={() => handleLinkClick(`${match.path}${APP_ROUTE}login`)}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <nav className={clsx("appbar--nav", classes.drawer)}>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        {/* phone & tablet */}
        <Hidden xlUp implementation="css">
          <Drawer
            variant="temporary"
            container={props.container}
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={(ev) => setMobileOpen(false)}
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
};

ResponsiveDrawer.propTypes = {
  history: PropTypes.object,
};

export default withRouter(ResponsiveDrawer);

/*
 <div className={clsx("settings_bar", classes.settings_bar)}> </div>
 <Avatar
                alt={user.first_name}
                src={user.avatar}
                className={classes.avatar}
                onClick={() => handleLinkClick("/login")}
              />
*/

/*
<InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              inputProps={{ "aria-label": "search" }}
            />
*/
