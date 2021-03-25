import React, { useState, useContext, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import Home from "@material-ui/icons/Home";
import Refresh from "@material-ui/icons/Refresh";
import MenuIcon from "@material-ui/icons/Menu";
import Chat from "@material-ui/icons/Chat";
import Close from "@material-ui/icons/Close";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { fade, makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/styles";
import { withRouter } from "react-router";
import { AppContext } from "../../store/AppContext.js";
import { DeviceContext } from "../../store/DeviceContext.js";

import "./_Appbar.scss";

const APP_ROUTE = "/";

const mainLinks = [{ title: "Home", path: `${APP_ROUTE}`, Icon: Home }];

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
  title: {
    flexGrow: 1,
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
    width: "100%",
    height: "var(--appbar-height)",
    position: "relative",
  },
  loginBtn: {
    fontSize: "0.75rem",
  },
  avatar: {
    marginRight: "calc(2 * var(--spacing))",
    backgroundColor: "var(--secondary)",
    width: "24px",
    height: "24px",
  },
}));

const renderListItem = (title = "") => (
  <ListItemText
    primary={title}
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
  const [appUtils, appState] = useContext(AppContext);
  const { Logger, PromiseKeeper, navigateTo, DURATIONS } = appUtils;

  const mediaContext = useContext(DeviceContext);
  const classes = useStyles(mediaContext);

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

  useEffect(() => {
    const logger = new Logger({ label });
    logg = logger.logg;
    loggError = logger.loggError;
    promiseKeeper = new PromiseKeeper({ label });
    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [Logger, PromiseKeeper]);

  useEffect(() => {
    const { searchables } = appState;
    if (!searchables) {
      loggError("No searchables items in appState ?");
      return;
    }

    if (!appState.searchables.options.length) {
      const linkList = [];
      [mainLinks, secondaryLinks].forEach((linkGroup, i) => {
        for (let [linkName, link] of Object.entries(linkGroup)) {
          link.groupName = i === 0 ? "Main Links" : "Secondary Links";
          linkList.push(link);
        }
      });

      //if there are no searchable items, add the various screens (pages) as searchable items
      appState.setSearchables({
        options: linkList,
        selected: linkList[0],
        getOptionLabel: (option) => option.title,
        onChange: (option) => {
          if (!option) return;
          navigateTo(`${match.path}${option.path}`, props.history);
        },
      });
    }
  }, [appState, match.path, navigateTo, props.history]);

  const renderMenuList = useCallback(
    (menuItems, secondary = false) => {
      return menuItems.map(
        ({ title, path, Icon, adminOnly, callback }, index) => {
          return (
            <ListItem
              button
              key={title}
              className={`menu-item menu-item--${
                path ? path.slice(4) : "basic"
              }`}
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
              {renderListItem(title)}
            </ListItem>
          );
        }
      );
    },
    [classes.icon, match.path, handleLinkClick]
  );

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
          <Typography
            className={clsx(
              `title nowrap ${classes.appBarText} readable`,
              classes.title
            )}
            color="inherit"
            noWrap
            // onClick={() => handleLinkClick(`${match.path}${APP_ROUTE}`)}
          >
            Shopping List
          </Typography>
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

/*open menu:

 <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={handleDrawerToggle}
            className={clsx(classes.iconButton, mobileOpen && "menu--open")}
          >
            <MenuIcon className={classes.menuButton} />
          </IconButton>


*/
