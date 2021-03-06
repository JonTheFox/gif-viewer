import React, { useContext, useEffect, useCallback } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import View from "../../components/layout/View.jsx";
import { useRecoilState } from "recoil";
import userState from "../../store/UserState.js";
import navigateTo from "../../lib/navigateTo.js";
import localStorageKeys from "../../constants/localstorageKeys.js";
import firebase from "../../firebase/firebase.js";

import Copyright from "../../components/Copyright/Copyright.js";

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

let animationFrame;

export default function SignIn(props) {
	const { route } = props;
	const { history } = route;
	const classes = useStyles();

	const [user, setUser] = useRecoilState(userState);

	const submitForm = useCallback(
		async (ev) => {
			ev.preventDefault();

			try {
				const formData = new FormData(ev.target);
				const email = formData.get("email");
				const password = formData.get("password");
				// const rememberMe = formData.get("remember");
				debugger;
				firebase
					.auth()
					.signInWithEmailAndPassword(email, password)
					.then((userCredential) => {
						// Signed in
						const loggedInUser = {
							email,
							password,
						};

						debugger;

						//setUserInLocalStorage
						window.localStorage.setItem(
							localStorageKeys.user,
							JSON.stringify(loggedInUser)
						);

						setUser(loggedInUser);
						console.log(`logged in user ${email}`);
					})
					.catch((error) => {
						debugger;

						const errorCode = error.code;
						const errorMessage = error.message;
						const doesntExist = errorCode === "auth/user-not-found";
						console.log("Login failed. ", errorMessage);
						//todo: show feedback message to user
					});

				// animationFrame = window.requestAnimationFrame(() => {
				// 	navigateTo("/main", history);
				// });
			} catch (err) {
				console.log(err);
				debugger;
			}
		},
		[history, navigateTo, setUser]
	);

	if (user) {
		animationFrame = window.requestAnimationFrame(() => {
			navigateTo("/main", history);
		});
	}

	return (
		<View animate={false} className="login-page">
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Log in
					</Typography>
					<form className={classes.form} onSubmit={submitForm}>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
						/>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							Sign In
						</Button>
						<Grid container>
							<Grid item xs>
								<Link href="/" variant="body2">
									Forgot password?
								</Link>
							</Grid>
							<Grid item>
								<Link href="/signup" variant="body2">
									{"Don't have an account? Sign Up"}
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>
				<Box mt={8}>
					<Copyright />
				</Box>
			</Container>
		</View>
	);
}
