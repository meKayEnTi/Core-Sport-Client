// Header.tsx

import { AppBar, Badge, Box, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart } from "@mui/icons-material";
// import { useAppSelector } from "../store/configureStore";
import { useEffect } from "react";
// import SignedInMenu from "./SignedInMenu";

const navLinks = [
    { title: "Home", path: "/" },
    { title: "Store", path: "/store" },
    { title: "Contact", path: "/contact" },
];

const accountLinks = [
    { title: "Login", path: "/login" },
    { title: "Register", path: "/register" },
];

const navStyles = {
    color: "inherit",
    typography: "h6",
    textDecoration: "none",
    "&:hover": {
        color: "secondary.main",
    },
    "&:active": {
        color: "text.secondary",
    },
};

interface Props {
    darkMode: boolean;
    handleThemeChange: () => void;
}

export default function Header({ darkMode, handleThemeChange }: Props) {
    // const { basket } = useAppSelector(state => state.basket);
    // const { user } = useAppSelector(state => state.account);
    // console.log('Basket:', basket);
    // useEffect(() => {
    //     console.log('Basket Items:', basket?.items);
    // }, [basket]);

    // const temp = basket;
    // console.log(temp?.items);
    // console.log('Basket Items:', basket?.items);
    // const itemCount = basket?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return (
        <AppBar position="sticky" sx={{ width:'100vw', mb: 4, top: 0, zIndex: 9999 }}>
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Box display="flex" alignItems="center">
                    <Typography
                        component={NavLink}
                        variant="h6"
                        to="/"
                        sx={navStyles}
                    >
                        Sports Center
                    </Typography>
                    <Switch checked={darkMode} onChange={handleThemeChange} />
                </Box>

                <List sx={{ display: "flex" }}>
                    {navLinks.map(({ title, path }) => (
                        <ListItem
                            component={NavLink}
                            to={path}
                            key={path}
                            sx={navStyles}
                        >
                            {title}
                        </ListItem>
                    ))}
                </List>
                <Box display="flex" alignItems="center">
                    <IconButton size="large" edge ="start" color="inherit" sx={{ mr: 2 }}>
                        <Badge badgeContent="4" color="secondary">
                            <ShoppingCart />
                        </Badge>
                    </IconButton>
                    <List sx={{ display: "flex" }}>
                        {accountLinks.map(({ title, path }) => (
                            <ListItem
                                component={NavLink}
                                to={path}
                                key={path}
                                sx={navStyles}
                            >
                                {title}
                            </ListItem>
                        ))}
                    </List>
                </Box>
                {/* <Box display="flex" alignItems="center">
                    <IconButton
                        component={Link}
                        to="/basket"
                        size="large"
                        edge="start"
                        color="inherit"
                        sx={{ mr: 2 }}
                    >
                        <Badge badgeContent={itemCount} color="secondary">
                            <ShoppingCart />
                        </Badge>
                    </IconButton>
                    {user ? (
                        <SignedInMenu />
                    ) : (
                        <List sx={{ display: "flex" }}>
                            {accountLinks.map(({ title, path }) => (
                                <ListItem
                                    component={NavLink}
                                    to={path}
                                    key={path}
                                    sx={navStyles}
                                >
                                    {title}
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box> */}
            </Toolbar>
        </AppBar>
    );
}

