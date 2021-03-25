import React, { Suspense, lazy } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import GlowingLoader from "./components/GlowingLoader/GlowingLoader.jsx";

const LayzShoppingListPage = lazy(() =>
	import(
		/* webpackChunkName: "ShoppingList" */ "./components/ShoppingList/ShoppingListPage.js"
	)
);

const baseRoute = "/";

const AppRoutes = (props) => {
	const { route } = props;
	const { location } = route;

	return (
		<Suspense fallback={<GlowingLoader />}>
			<Switch location={location}>
				<Route path={`${baseRoute}`}>
					<LayzShoppingListPage route={route} />
				</Route>
				<Redirect to={`${baseRoute} client-type-select`} />
			</Switch>
		</Suspense>
	);
};

export default AppRoutes;
