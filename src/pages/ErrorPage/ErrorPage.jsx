import React, { Component } from "react";
import View from "../../components/layout/View.jsx";
import Logger from "../../lib/logg.js";

const label = "ErrorBoundary";
const { loggError } = new Logger({ label });

const reloadPage = () => {
  window.location.reload(true);
};

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    console.log("Something went wrong! Displaying fallback UI", error, info);
  }

  render() {
    const { debug } = this.props;
    if (this.state.hasError || debug) {
      return (
        <View animateChildren={true} responsive={true} key="error-view">
          Whoopy... Something is off. Try{" "}
          <button onClick={reloadPage}>reloading</button> the page
        </View>
      );
    }

    //no error, so show normal pages
    return this.props.children;
  }
}

export default ErrorBoundary;
