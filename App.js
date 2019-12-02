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
      output: "0",
      input: "",
    }
  }

  parseExpr = (expr) => {
    let result = expr.split('x')
      .map(expr1 => expr1.split('/')
        .map(expr2 => expr2.split('-')
          .map(expr3 => expr3.split('+')
            .reduce((a, b) => (Number(a) + Number(b)))
          )
          .reduce((a, b) => (Number(a) - Number(b)))
        )
        .reduce((a, b) => (Number(a) / Number(b)))
      )
      .reduce((a, b) => (Number(a) * Number(b)));
    result = Math.round(result * 10000) / 10000; // round 4 decimal after dot
    return result;
  }

  clickPad = (id) => {
    let previousOutput = this.state.output;
    let newOutput = this.state.output;
    let previousInput = this.state.input;
    let newInput = this.state.input;
    let currentValue = this.state.pad.filter(element => element.id == id)[0].value;

    switch (id) {
      case "clear":
        newOutput = "0";
        newInput = "";
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
        if (RegExp(/=/).test(previousInput)) {
          newOutput = currentValue;
          newInput = "";
        } else if (previousOutput == "0") {
          newOutput = currentValue;
        } else if (RegExp(/[-+x\/]/).test(previousOutput)) {
          newOutput = previousOutput.slice(1).concat(currentValue);
          newInput = previousInput.concat(previousOutput);
        } else {
          newOutput = previousOutput.concat(currentValue);
        }
        break;

      case "decimal":
        if (RegExp(/=/).test(previousInput)) {
          newOutput = "0".concat(currentValue);
          newInput = "";
        } else if (!RegExp(/\./).test(previousOutput)) {
          newOutput = previousOutput.concat(currentValue);
        } else {
          newOutput = previousOutput;
        }
        break;

      case "add":
      case "multiply":
      case "divide":
        if (RegExp(/=/).test(previousInput)) {
          newOutput = currentValue;
          newInput = previousInput.match(RegExp(/=(.+)/))[1];
        } else if (RegExp(/[-+x\/]/).test(previousOutput)) {
          newOutput = currentValue;
        } else {
          newOutput = currentValue;
          newInput = previousInput.concat(previousOutput);
        }
        break;

      case "substract":
        if (RegExp(/=/).test(previousInput)) {
          newOutput = currentValue;
          newInput = previousInput.match(RegExp(/=(.+)/))[1];
        } else if (previousOutput == "-") {
        } else {
          newOutput = currentValue;
          newInput = previousInput.concat(previousOutput);
        }
        break;

      case "equals":
        if (RegExp(/=/).test(previousInput)) {
        } else {
          newOutput = this.parseExpr(previousInput.concat(previousOutput));
          newInput = previousInput.concat(previousOutput).concat(currentValue).concat(newOutput);
        }
        break;
    }

    this.setState({
      input: newInput,
      output: newOutput,
    });
  }

  render() {
    return (
      <div className="App container-fluid">
        <Calculator pad={this.state.pad} clickpad={this.clickPad.bind(this)} output={this.state.output} input={this.state.input} />
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
        <div id="display">
          <input type="text" readOnly className="form-control-plaintext bg-secondary text-white text-right p-1" value={this.props.input}></input>
          <input type="text" readOnly className="form-control-plaintext bg-secondary text-white text-right p-1" value={this.props.output}></input>
        </div>
        <div className="calcPad">
          {buildPad}
        </div>
      </div>
    );
  }
}

// Render Application in html page
ReactDOM.render(<App />, document.querySelector("#root"));
