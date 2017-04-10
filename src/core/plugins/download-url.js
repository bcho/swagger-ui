/* global Promise */

import { createSelector } from "reselect"
import { Map } from "immutable"
const parseUrl = require('url').parse

export default function downloadUrlPlugin (toolbox) {
  let { fn } = toolbox

  const actions = {
    download: (url, auth)=> ({ errActions, specSelectors, specActions }) => {
      let { fetch } = fn
      url = url || specSelectors.url()
      const parsedUrl = parseUrl(url)

      const headers = {
        "Accept": "application/json"
      }
      if (parsedUrl.auth) {
        headers['Authorization'] = `Basic ${btoa(parsedUrl.auth)}`
      }
      if (auth) {
        headers['Authorization'] = auth
      }

      console.log(headers)
      specActions.updateLoadingStatus("loading")
      fetch({
        url,
        loadSpec: true,
        headers,
      }).then(next,next)

      function next(res) {
        if(res instanceof Error || res.status >= 400) {
          specActions.updateLoadingStatus("failed")
          return errActions.newThrownErr( new Error(res.statusText + " " + url) )
        }
        specActions.updateLoadingStatus("success")
        specActions.updateSpec(res.text)
        specActions.updateUrl(url)
      }

    },

    updateLoadingStatus: (status) => {
      let enums = [null, "loading", "failed", "success", "failedConfig"]
      if(enums.indexOf(status) === -1) {
        console.error(`Error: ${status} is not one of ${JSON.stringify(enums)}`)
      }

      return {
        type: "spec_update_loading_status",
        payload: status
      }
    }
  }

  let reducers = {
    "spec_update_loading_status": (state, action) => {
      return (typeof action.payload === "string")
        ? state.set("loadingStatus", action.payload)
        : state
    }
  }

  let selectors = {
    loadingStatus: createSelector(
      state => {
        return state || Map()
      },
      spec => spec.get("loadingStatus") || null
    )
  }

  return {
    statePlugins: {
      spec: { actions, reducers, selectors }
    }
  }
}
