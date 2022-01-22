import React, {Component, useState} from "react";
import {Form, Button, Container, Accordion} from "react-bootstrap";
// import {Collapse} from "react-collapse";
import axios from "axios";
// You can get access to the history object's properties and the closest <Route>'s match via the withRouter
// higher-order component. This makes it easier for us to edit our records.

// export default withRouter(Show);
class Main extends Component {
  // This is the constructor that stores the data.
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      url1: '',
      url2: '',
      text_data: [],
      word_count: 0,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleChange3 = this.handleChange3.bind(this);
    this.handleSubmit2 = this.handleSubmit2.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  // This will get the record based on the id from the database.
  componentDidMount() {}

  handleChange(e) {
    console.log(e.target.value)
    this.setState({url: e.target.value})
  }

  handleChange2(e) {
    console.log(e.target.value)
    this.setState({url1: e.target.value})
  }

  handleChange3(e) {
    console.log(e.target.value)
    this.setState({url2: e.target.value})
  }


  handleSubmit(e) {
    // console.log(e.target.value)
    // this.setState({url: e.target.value})
    console.log(this.state.url)
    // console.log('url: ', this.state.url)
    e.preventDefault();
    this.obtainText();
  }
  handleSubmit2(e) {
    // console.log(e.target.value)
    // this.setState({url: e.target.value})
    console.log(this.state.url1, this.state.url2)
    // console.log('url: ', this.state.url)
    e.preventDefault();
    this.obtainText2();
  }

  obtainText = async () => {
    await axios.post('http://localhost:5000/count', {url: this.state.url}, {}).then(
        response => {
            console.log(response)
            this.setState({text_data: response.data.objs, word_count:response.data.dist});
        }
    )
    console.log(this.state.text_data);
  }
  obtainText2 = async () => {
    await axios.post('http://localhost:5000/count2', {url1: this.state.url1, url2: this.state.url2}, {}).then(
        response => {
          console.log(response)
          // this.setState({text_data: response.data.objs, word_count:response.data.dist});
        }
    )
    // console.log(this.state.text_data);
  }
  // This following section will display the update-form that takes the input from the user to update the data.
  render() {
    return (
        <div>
          <Container>
            <br/><br/>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Enter URL</Form.Label>
                <Form.Control type="url" placeholder="Enter URL" value={this.state.url} onChange={this.handleChange}/>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Container>
          <br/>
          <Container>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="1">
                <Accordion.Header>Extension - 2 links</Accordion.Header>
                <Accordion.Body>
                  <Form onSubmit={this.handleSubmit2}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Enter URL 1:</Form.Label>
                      <Form.Control type="url" placeholder="Enter URL" value={this.state.url1} onChange={this.handleChange2}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Enter URL 2:</Form.Label>
                      <Form.Control type="url" placeholder="Enter URL" value={this.state.url2} onChange={this.handleChange3}/>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Submit
                    </Button>
                  </Form>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Container>
          <Container>
            <br/><br/>
            <h3><i>Total words: </i> {this.state.word_count}</h3>
            <table  className="table table-striped" style={{ marginTop: 20 }}>
              <thead>
              <tr>
                <th>Word</th>
                <th>Count</th>
              </tr>
              </thead>
              <tbody>
              {this.state.text_data.map(item=>(
                  <tr key={item.id}>
                    <td key={1}>{item.word}</td>
                    <td key={2}>{item.count}</td>
                  </tr>
              ))}
              </tbody>
            </table>
          </Container>
        </div>
  );
  }
}
export default Main;