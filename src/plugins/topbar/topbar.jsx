import React, { PropTypes } from "react"

//import "./topbar.less"
import Logo from "./logo_small.png"

export default class Topbar extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      url: props.specSelectors.url(),
      authUser: props.specSelectors.authUser(),
      authPassword: props.specSelectors.authPassword(),
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ url: nextProps.specSelectors.url() })
  }

  onUrlChange =(e)=> {
    let {target: {value}} = e
    this.setState({url: value})
  }

  onAuthUserChange =(e)=> {
    let {target: {value}} = e
    this.setState({authUser: value})
  }

  onAuthPasswordChange =(e)=> {
    let {target: {value}} = e
    this.setState({authPassword: value})
  }

  downloadUrl = () => {
    console.log(this.state)
    this.props.specActions.updateUrl(this.state.url)
    let auth
    if (this.state.authUser && this.state.authPassword) {
      const cred = btoa(`${this.state.authUser}:${this.state.authPassword}`)
      auth = `Basic ${cred}`
    }
    this.props.specActions.download(this.state.url, auth)
  }

  render() {
    let { getComponent, specSelectors } = this.props
    const Button = getComponent("Button")
    const Link = getComponent("Link")

    let isLoading = specSelectors.loadingStatus() === "loading"
    let isFailed = specSelectors.loadingStatus() === "failed"

    let inputStyle = {}
    if(isFailed) inputStyle.color = "red"
    if(isLoading) inputStyle.color = "#aaa"
    return (
        <div className="topbar">
          <div className="wrapper">
            <div className="topbar-wrapper">
              <Link href="#" title="Swagger UX">
              </Link>
              <div className="download-url-wrapper">
                <input className="download-url-input" type="text" onChange={ this.onUrlChange } value={this.state.url} disabled={isLoading} style={inputStyle} />
                <input className="download-url-input" type="text" onChange={ this.onAuthUserChange } value={this.state.authUser} disabled={isLoading} style={inputStyle} />
                <input className="download-url-input" type="text" onChange={ this.onAuthPasswordChange } value={this.state.authPassword} disabled={isLoading} style={inputStyle} />
                <Button className="download-url-button" onClick={ this.downloadUrl }>Explore</Button>
              </div>
            </div>
          </div>
        </div>

    )
  }
}

Topbar.propTypes = {
  specSelectors: PropTypes.object.isRequired,
  specActions: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired
}
