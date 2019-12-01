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
      hasResult: false
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
    return result;
  }

  clickPad = (id) => {
    let previousOutput = this.state.output;
    let newOutput = this.state.output;
    let previousInput = this.state.input;
    let newInput = this.state.input;
    let hasResult = this.state.hasResult;
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
        if (hasResult) {
          newOutput = currentValue; // reset calculator
          newInput = "";
        } else {
          newOutput = previousOutput.concat(currentValue); // enter numbers
        }
        hasResult = false;
        break;

      case "decimal":
        if (hasResult) {
          newOutput = "0".concat(currentValue); // reset calculator
          newInput = "";
        } else if (!RegExp(/\./).test(previousOutput)) { // check if there is already a dot
          newOutput = previousOutput.concat(currentValue)
        } else {
          newOutput = previousOutput;
        }
        hasResult = false;
        break;

      case "add":
      case "substract":
      case "multiply":
      case "divide":
        if (hasResult) {
          console.log("a travailler");
        }
        else if (previousOutput == "-") { // we already type some symbol
          if (currentValue == "-") { // don't make - -
            previousInput.charAt(previousInput.length - 1) == "-" ?
              newOutput = previousOutput
              : newOutput = "-";
          } else { // replace previous symbol
            newInput = previousInput.slice(0, previousInput.length - 1).concat(currentValue);
          }
        } else { // we entered a new number
          newOutput = currentValue;
          newInput = previousInput.concat(previousOutput);
        }
        hasResult = false;
        break;

      case "equals":
        newOutput = this.parseExpr(previousInput.concat(previousOutput));
        newInput = previousInput.concat(previousOutput).concat(currentValue).concat(newOutput);
        hasResult = true;
        break;
    }

    this.setState({
      input: newInput,
      output: newOutput,
      hasResult: hasResult
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
        <input type="text" readOnly className="form-control-plaintext bg-secondary text-white text-right p-1" value={this.props.input}></input>
        <input id="display" type="text" readOnly className="form-control-plaintext bg-secondary text-white text-right p-1" value={this.props.output}></input>
        <div className="calcPad">
          {buildPad}
        </div>
      </div>
    );
  }
}

// Render Application in html page
ReactDOM.render(<App />, document.querySelector("#root"));
