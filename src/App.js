// src/App.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const JarContainer = styled.div`
  display: flex;
`;

const Jar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 20px;
`;

const JarTitle = styled.h2`
  margin-bottom: 10px;
`;

const JarContent = styled.div`
  width: 100px;
  height: 200px;
  background-color: #d3d3d3;
  position: relative;
`;

const Fill = styled.div`
  background-color: #4caf50;
  height: ${(props) => props.fillPercentage}%;
  width: 100%;
  position: absolute;
  bottom: 0;
`;

const Input = styled.input`
  margin-top: 10px;
  padding: 5px;
`;

const Button = styled.button`
  margin-top: 10px;
  cursor: pointer;
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
`;

const HistoryContainer = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const EditableHistoryItem = styled.div`
  margin-bottom: 10px;
`;

const App = () => {
  const [jar1Hours, setJar1Hours] = useState(365);
  const [jar2Hours, setJar2Hours] = useState(0);
  const [inputMinutes, setInputMinutes] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Load data from localStorage on component mount
    const storedData = localStorage.getItem("timeTransferData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setJar1Hours(parsedData.jar1Hours);
      setJar2Hours(parsedData.jar2Hours);
      setHistory(parsedData.history);
    }
  }, []); // Empty dependency array ensures this effect runs only once on mount

  useEffect(() => {
    // Save data to localStorage whenever jar1Hours, jar2Hours, or history change
    const dataToStore = { jar1Hours, jar2Hours, history };
    jar1Hours &&
      jar2Hours &&
      history &&
      localStorage.setItem("timeTransferData", JSON.stringify(dataToStore));
  }, [jar1Hours, jar2Hours, history]);

  const handleTransfer = () => {
    const minutes = parseInt(inputMinutes, 10);
    if (isNaN(minutes) || minutes <= 0 || minutes > jar1Hours * 60) {
      // handle invalid input
      return;
    }

    setJar1Hours(jar1Hours - minutes / 60);
    setJar2Hours(jar2Hours + minutes / 60);
    setInputMinutes("");

    // Update history with current date
    const currentDate = new Date().toLocaleString();
    setHistory([...history, { value: minutes, date: currentDate }]);
  };

  const handleEditHistory = (index, newValue) => {
    const updatedHistory = [...history];
    updatedHistory[index] = {
      value: newValue,
      date: new Date().toLocaleString(),
    };

    // Recalculate values based on the edited history item
    const editedMinutes = parseInt(newValue, 10);
    const editedHours = editedMinutes / 60;

    // Update Jar 1 and Jar 2 values
    const jar1TotalHours = updatedHistory.reduce((total, item) => {
      const minutes = parseInt(item.value, 10);
      return total - minutes / 60;
    }, 365);

    setJar1Hours(jar1TotalHours);
    setJar2Hours(
      updatedHistory.reduce((total, item) => {
        const minutes = parseInt(item.value, 10);
        return total + minutes / 60;
      }, 0)
    );

    setHistory(updatedHistory);
  };

  const jar1FillPercentage = (jar1Hours / 365) * 100;
  const jar2FillPercentage = (jar2Hours / 365) * 100;

  return (
    <AppContainer>
      <h1>Read Book For 365 Hrs</h1>
      <img
        src="/logo_time_jar_for_read_book.jpg"
        alt="logo"
        style={{
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          border: "3px solid #4caf50",
        }}
      />

      <JarContainer>
        <Jar>
          <JarTitle>Jar 1</JarTitle>
          <JarContent>
            <Fill fillPercentage={jar1FillPercentage} />
          </JarContent>
          <p>
            {/* convert this into hrs and min */}
            {Math.floor(jar1Hours)} hours {Math.floor((jar1Hours % 1) * 60)}{" "}
            minutes
          </p>
        </Jar>

        <Jar>
          <JarTitle>Jar 2</JarTitle>
          <JarContent>
            <Fill fillPercentage={jar2FillPercentage} />
          </JarContent>
          <p>
            {/* convert this into hrs and min */}
            {Math.floor(jar2Hours)} hours {Math.floor((jar2Hours % 1) * 60)}{" "}
            minutes
          </p>
          <Input
            type="number"
            placeholder="Enter minutes"
            value={inputMinutes}
            onChange={(e) => setInputMinutes(e.target.value)}
          />
          <Button onClick={handleTransfer}>Transfer</Button>
        </Jar>
      </JarContainer>

      <HistoryContainer>
        <h2>History</h2>
        {history
          .slice()
          .reverse()
          .slice(0, 5)
          .map((item, index) => (
            <EditableHistoryItem key={index}>
              {`${item.value} minutes transferred on ${item.date}`}{" "}
              <button
                onClick={() =>
                  handleEditHistory(index, prompt("Edit value:", item.value))
                }
              >
                Edit
              </button>
            </EditableHistoryItem>
          ))}
      </HistoryContainer>
    </AppContainer>
  );
};

export default App;
