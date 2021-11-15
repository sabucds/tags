import React from "react"
import ReactDOM from "react-dom"
import {
  BrowserRouter as Router,
  Route,
  Switch,
  NavLink,
  Redirect
} from "react-router-dom"

import '@yaireo/ui-switch/src/switch.scss'
import "./styles.scss" // basic styles for this demo

import TagifyWithTemplates from "./TagifyWithTemplates"
import CrazyTags from "./CrazyTags"
import MixedModeTagify from "./MixedModeTagify"

function App() {
  return (
    <Router>
      <header>
        <h1>
          <a href="https://github.com/yairEO/tagify">Tagify</a> React Demos:
        </h1>

        <nav>
          <NavLink to="/CrazyTags">Tags</NavLink>
          <NavLink to="/MixedModeTagify">Mix-Mode Tags</NavLink>
          <NavLink to="/TagifyWithTemplates">React Components Templates</NavLink>
        </nav>
      </header>

      <Switch>
        <Route exact path="/TagifyWithTemplates" component={TagifyWithTemplates} />
        <Route exact path="/CrazyTags" component={CrazyTags} />
        <Route exact path="/MixedModeTagify" component={MixedModeTagify} />
        <Redirect exact from="/" to="/CrazyTags" />
      </Switch>
    </Router>
  )
}

ReactDOM.render(<App />, document.getElementById("app"))
