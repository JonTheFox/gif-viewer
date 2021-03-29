import React, { Suspense, lazy } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import UserState from "./store/UserState.js";
import { useRecoilValue } from "recoil";

import GlowingLoader from "./components/GlowingLoader/GlowingLoader.jsx";

const LazyMain = lazy(() =>
	import(/* webpackChunkName: "LazyMain" */ "./pages/Main/Main.js")
);
const LazyLogin = lazy(() =>
	import(/* webpackChunkName: "LazyLogin" */ "./pages/Login/Login.jsx")
);
const LazySignup = lazy(() =>
	import(/* webpackChunkName: "LazySignup" */ "./pages/Signup/Signup.js")
);
const LazyHistory = lazy(() =>
	import(/* webpackChunkName: "LazyHistory" */ "./pages/History/History.js")
);

const baseRoute = "/";

const AppRoutes = (props) => {
	const { route } = props;
	const { location } = route;
	const user = useRecoilValue(UserState);

	if (!user) {
		return (
			<Suspense fallback={<GlowingLoader />}>
				<Route path={`${baseRoute}signup`}>
					<LazySignup route={route} />
				</Route>
				<Route path={`${baseRoute}login`}>
					<LazyLogin route={route} />
				</Route>

				<Redirect to={`${baseRoute}login`} />
			</Suspense>
		);
	}

	return (
		<Suspense fallback={<GlowingLoader />}>
			<Switch location={location}>
				<Route path={`${baseRoute}signup`}>
					<LazySignup route={route} />
				</Route>
				<Route path={`${baseRoute}login`}>
					<LazyLogin route={route} />
				</Route>

				<Route path={`${baseRoute}main`}>
					<LazyMain route={route} />
				</Route>
				<Route path={`${baseRoute}history`}>
					<LazyHistory route={route} />
				</Route>
				<Route path={`${baseRoute}loading`}>
					<GlowingLoader route={route} />
				</Route>
				<Redirect to={`${baseRoute}main`} />
			</Switch>
		</Suspense>
	);
};

export default AppRoutes;
