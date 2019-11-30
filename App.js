class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pad: [
        { id: 'clear', value: 'AC' },
        { id: 'zero', value: '0' },
        { id: 'one', value: '1' },
        { id: 'two', value: '2' },
        { id: 'three', value: '3' },
        { id: 'four', value: '4' },
        { id: 'five', value: '5' },
        { id: 'six', value: '6' },
        { id: 'seven', value: '7' },
        { id: 'height', value: '8' },
        { id: 'nine', value: '9' },
        { id: 'decimal', value: '.' },
        { id: 'add', value: '+' },
        { id: 'substract', value: '-' },
        { id: 'multiply', value: 'x' },
        { id: 'divide', value: '/' },
        { id: 'equals', value: '=' }
      ],
      result: "0",
      operator: ""
    }
  }

  clickPad = (id) => {
    let previousResult = this.state.result;
    let newResult = this.state.result;
    let currentValue = this.state.pad.filter(element => element.id == id)[0].value;

    switch (id) {
      case "clear":
        newResult = "0";
        break;
      case "zero":
      case "one":
      case "two":
      case "three":
      case "four":
      case "five":
      case "six":
      case "seven":
      case "height":
      case "nine":
        (previousResult != "0") ?
          newResult = previousResult.toString().concat(currentValue)
          : newResult = previousResult.toString().concat(currentValue).slice(1);
        break;
      case "decimal":
        (!RegExp(/\./).test(previousResult)) ?
          newResult = previousResult.toString().concat(currentValue)
          : newResult = previousResult;
        break;
      case "add":



    }

    this.setState({ result: newResult })
  }

  render() {
    return (
      <div className="App container-fluid">
        <Calculator pad={this.state.pad} clickpad={this.clickPad.bind(this)} result={this.state.result} />
      </div>
    );
  }
}

class Calculator extends React.Component {
  handleClick = (id) => this.props.clickpad(id);

  render() {
    let buildPad = this.props.pad.map(item => {
      return (
        <button key={item.id} id={item.id} className="btn btn-light btn-lg" onClick={this.handleClick.bind(this, item.id)}>{item.value}</button>)
    });

    return (
      <div className="card d-flex flex-column p-3 shadow">
        <input id="display" type="text" readOnly className="form-control-plaintext bg-secondary text-white text-right p-1" value={this.props.result}></input>
        <div className="calcPad">
          {buildPad}
        </div>
      </div>
    );
  }
}

// Render Application in html page
ReactDOM.render(<App />, document.querySelector("#root"));
