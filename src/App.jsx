import { useState } from "react";
import { Button, Heading, Flex, Text } from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

export default function App() {
  const { signOut } = useAuthenticator((context) => [context.user]);

  const [display, setDisplay] = useState("0");
  const [firstNumber, setFirstNumber] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecondNumber, setWaitingForSecondNumber] = useState(false);

  function inputNumber(number) {
    if (waitingForSecondNumber) {
      setDisplay(number);
      setWaitingForSecondNumber(false);
    } else {
      setDisplay(display === "0" ? number : display + number);
    }
  }

  function inputDecimal() {
    if (waitingForSecondNumber) {
      setDisplay("0.");
      setWaitingForSecondNumber(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  }

  function chooseOperator(nextOperator) {
    setFirstNumber(parseFloat(display));
    setOperator(nextOperator);
    setWaitingForSecondNumber(true);
  }

  function calculate() {
    if (firstNumber === null || operator === null) return;

    const secondNumber = parseFloat(display);
    let result;

    switch (operator) {
      case "+":
        result = firstNumber + secondNumber;
        break;
      case "-":
        result = firstNumber - secondNumber;
        break;
      case "×":
        result = firstNumber * secondNumber;
        break;
      case "÷":
        if (secondNumber === 0) {
          setDisplay("Error");
          setFirstNumber(null);
          setOperator(null);
          return;
        }
        result = firstNumber / secondNumber;
        break;
      default:
        return;
    }

    setDisplay(String(result));
    setFirstNumber(null);
    setOperator(null);
    setWaitingForSecondNumber(true);
  }

  function clearCalculator() {
    setDisplay("0");
    setFirstNumber(null);
    setOperator(null);
    setWaitingForSecondNumber(false);
  }

  const calculatorButton = {
    width: "70px",
    height: "55px",
    fontSize: "20px",
  };

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      gap="20px"
    >
      <Heading level={1}>Simple Calculator</Heading>

      <Text>
        A JavaScript calculator deployed using AWS Amplify
      </Text>

      <Flex
        direction="column"
        padding="25px"
        border="1px solid #ccc"
        borderRadius="12px"
        gap="12px"
      >
        <div
          style={{
            width: "310px",
            padding: "15px",
            fontSize: "30px",
            textAlign: "right",
            backgroundColor: "#f5f5f5",
	    color: "#000000",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {display}
        </div>

        <Flex gap="10px">
          <Button
            style={{ ...calculatorButton, width: "230px" }}
            onClick={clearCalculator}
          >
            Clear
          </Button>

          <Button
            style={calculatorButton}
            onClick={() => chooseOperator("÷")}
          >
            ÷
          </Button>
        </Flex>

        <Flex gap="10px">
          <Button style={calculatorButton} onClick={() => inputNumber("7")}>
            7
          </Button>
          <Button style={calculatorButton} onClick={() => inputNumber("8")}>
            8
          </Button>
          <Button style={calculatorButton} onClick={() => inputNumber("9")}>
            9
          </Button>
          <Button
            style={calculatorButton}
            onClick={() => chooseOperator("×")}
          >
            ×
          </Button>
        </Flex>

        <Flex gap="10px">
          <Button style={calculatorButton} onClick={() => inputNumber("4")}>
            4
          </Button>
          <Button style={calculatorButton} onClick={() => inputNumber("5")}>
            5
          </Button>
          <Button style={calculatorButton} onClick={() => inputNumber("6")}>
            6
          </Button>
          <Button
            style={calculatorButton}
            onClick={() => chooseOperator("-")}
          >
            −
          </Button>
        </Flex>

        <Flex gap="10px">
          <Button style={calculatorButton} onClick={() => inputNumber("1")}>
            1
          </Button>
          <Button style={calculatorButton} onClick={() => inputNumber("2")}>
            2
          </Button>
          <Button style={calculatorButton} onClick={() => inputNumber("3")}>
            3
          </Button>
          <Button
            style={calculatorButton}
            onClick={() => chooseOperator("+")}
          >
            +
          </Button>
        </Flex>

        <Flex gap="10px">
          <Button
            style={{ ...calculatorButton, width: "150px" }}
            onClick={() => inputNumber("0")}
          >
            0
          </Button>

          <Button style={calculatorButton} onClick={inputDecimal}>
            .
          </Button>

          <Button style={calculatorButton} onClick={calculate}>
            =
          </Button>
        </Flex>
      </Flex>

      <Button onClick={signOut}>Sign Out</Button>
    </Flex>
  );
}