import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'

class NoteForm extends Component {
  state = {
    title: "",
    text: "",
    tags: "",
    editing: false
  }

  componentDidMount() {
    if (this.props.noteUpdate) {
      this.setState({
        editing: true,
        title: this.props.noteUpdate.title,
        text: this.props.noteUpdate.text,
        tags: JSON.parse(this.props.noteUpdate.tags)
      })
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { id } = this.props.match.params
    const formattedTags = JSON.stringify(this.state.tags.split(',').map(word => word.trim().toLocaleLowerCase()))
    if (this.state.editing) {
      const updatedNote = {
        id: this.props.noteUpdate.id,
        title: this.state.title,
        text: this.state.text,
        tags: formattedTags
      }
      axios.put(`https://lsnotes-timh1203.herokuapp.com/notes/${id}/edit`, updatedNote)
        .then(resp => console.log(resp))
        .catch(err => console.log(err))
      this.props.history.push("/")
      this.setState({ editing: false })
    }
    else if (this.state.text.length > 50) {
      const newNote = {
        title: this.state.title,
        text: this.state.text,
        tags: formattedTags,
      }
      const emptyNote = {
        title: '',
        text: '',
        tags: ''
      }
      axios.post('https://lsnotes-timh1203.herokuapp.com/notes', newNote)
        .then(resp => console.log(resp))
        .catch(err => console.log(err))
      this.setState(emptyNote)
      this.props.history.push("/")
    }
    else if (this.state.text.length < 50) {
      alert("Minimum of 50 characters required for the text area.")
    }
  }

  render() {
    return (
      <Div className="NoteForm">
        <H2>{this.state.editing ? "Edit Note: " : "Create New Note"}</H2>
        <Form onSubmit={(e) => this.handleSubmit(e)}>
          <Input1
            name="title"
            type="text"
            placeholder="Title"
            value={this.state.title}
            onChange={this.handleChange}
            maxLength="15"
            required
          />
          <Textarea
            name="text"
            type="text"
            placeholder="Text"
            value={this.state.text}
            onChange={this.handleChange}
            pattern=".{50, 0}"
            title="50 characters minimum"
            required
          />
          <Input2
            name="tags"
            type="text"
            placeholder="Tags (with commas)"
            value={this.state.tags}
            onChange={this.handleChange}
            required
          />
          <Button1>{this.state.editing ? "Update" : "Save"}</Button1>
        </Form>
      </Div>
    )
  }
}

const Div = styled.div`
  padding: 1% 3%;
  border: 2px solid #DADCE0;
  border-radius: 10px;
  `
const H2 = styled.h2``
const Form = styled.form`
  display: flex;
  flex-direction: column;
`
const Input1 = styled.input`
  width: 60%;
  font-size: 1.6rem;
  padding: 2%;
  margin: 2% 0;
  border-radius: 2px;
  font-family: 'Average Sans';
`
const Input2 = styled.input`
  width: 100%;
  font-size: 1.6rem;
  padding: 2%;
  margin: 2% 0;
  border-radius: 2px;
  font-family: 'Average Sans';
`
const Textarea = styled.textarea`
  width: 100%;
  font-size: 1.6rem;
  padding: 2%;
  margin: 2% 0;
  height: 300px;
  border-radius: 2px;
  font-family: 'Average Sans';
`
const Button1 = styled.button`
  padding: 2%;
  width: 100%;
  max-width: 100px;
  text-align: center;
  margin: 0 auto;
  font-family: 'Average Sans';
`

export default withRouter(NoteForm)
