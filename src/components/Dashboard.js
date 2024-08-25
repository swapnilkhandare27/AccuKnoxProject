import React, { useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./Dashboard.css";

const Dashboard = () => {
  const initialCategories = {
    CSPM: [],
    CWPP: [],
    Registry: [],
  };

  const [categories, setCategories] = useState(initialCategories);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCards, setSelectedCards] = useState([]);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardName, setNewCardName] = useState("");
  const [chartType, setChartType] = useState("Pie Chart");
  const [fields, setFields] = useState([{ name: "", color: "#000000", percentage: 0 }]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setSelectedCategory(""); // Reset selected category when sidebar is toggled
    setSelectedCards([]); // Clear selected cards
    setIsAddingCard(false); // Reset adding card state
    setNewCardName(""); // Clear new card name input
    setChartType("Pie Chart"); // Reset chart type
    setFields([{ name: "", color: "#000000", percentage: 0 }]); // Reset fields
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setSelectedCards([]); // Clear selected cards when changing category
    setIsAddingCard(false); // Reset adding card state
    setNewCardName(""); // Clear new card name input
    setChartType("Pie Chart"); // Reset chart type
    setFields([{ name: "", color: "#000000", percentage: 0 }]); // Reset fields
  };

  const handleCardNameChange = (e) => {
    setNewCardName(e.target.value);
  };

  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
  };

  const handleFieldChange = (index, e) => {
    const newFields = [...fields];
    newFields[index][e.target.name] = e.target.value;
    setFields(newFields);
  };

  const handleColorChange = (index, e) => {
    const newFields = [...fields];
    newFields[index].color = e.target.value;
    setFields(newFields);
  };

  const handlePercentageChange = (index, e) => {
    const newFields = [...fields];
    newFields[index].percentage = e.target.value;
    setFields(newFields);
  };

  const addField = () => {
    setFields([...fields, { name: "", color: "#000000", percentage: 0 }]);
  };

  const removeField = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  const addCard = () => {
    if (newCardName.trim() !== "" && selectedCategory) {
      setCategories({
        ...categories,
        [selectedCategory]: [
          ...categories[selectedCategory],
          {
            name: newCardName,
            type: chartType,
            fields: fields.filter((field) => field.name.trim() !== ""),
          },
        ],
      });
      setNewCardName(""); // Clear input after adding
      setChartType("Pie Chart"); // Reset chart type
      setFields([{ name: "", color: "#000000", percentage: 0 }]); // Reset fields
      setIsAddingCard(false); // Close the input field
    }
  };

  const handleAddButtonClick = () => {
    setIsAddingCard(true);
  };

  const handleCardSelect = (card) => {
    if (selectedCards.includes(card)) {
      setSelectedCards(selectedCards.filter((item) => item !== card));
    } else {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const deleteSelectedCards = () => {
    if (selectedCategory && selectedCards.length > 0) {
      setCategories({
        ...categories,
        [selectedCategory]: categories[selectedCategory].filter(
          (card) => !selectedCards.includes(card)
        ),
      });
      setSelectedCards([]); // Clear selected cards after deletion
    }
  };

  const renderChart = (type, fields) => {
    const labels = fields.map((field) => field.name);
    const data = fields.map((field) => field.percentage);
    const backgroundColor = fields.map((field) => field.color);

    switch (type) {
      case "Pie Chart":
        return (
          <Pie
            data={{
              labels,
              datasets: [
                {
                  data,
                  backgroundColor,
                },
              ],
            }}
          />
        );
      case "Bar Chart":
        return (
          <Bar
            data={{
              labels,
              datasets: [
                {
                  data,
                  backgroundColor,
                },
              ],
            }}
            options={{ scales: { y: { beginAtZero: true, max: 100 } } }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <button className="add-widget-btn" onClick={toggleSidebar}>
        Add Widget
      </button>
      {Object.keys(categories).map((category, index) => (
        <div key={index} className="category">
          <h2>{category}</h2>
          <div className="widgets">
            {categories[category].map((widget, i) => (
              <div key={i} className="card">
                <h3>{widget.name}</h3>
                <div className="chart-container">
                  {renderChart(widget.type, widget.fields)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {isSidebarOpen && (
        <div className="sidebar">
          <span className="close-btn" onClick={toggleSidebar}>
            &times;
          </span>
          <div className="category-selector">
            {Object.keys(categories).map((category) => (
              <button
                key={category}
                className={`category-btn ${
                  selectedCategory === category ? "selected" : ""
                }`}
                onClick={() => selectCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          {selectedCategory && (
            <div className="cards-list">
              {categories[selectedCategory].map((card, index) => (
                <div key={index} className="card-item">
                  <input
                    type="checkbox"
                    checked={selectedCards.includes(card)}
                    onChange={() => handleCardSelect(card)}
                  />
                  {card.name}
                </div>
              ))}
            </div>
          )}
          {isAddingCard && (
            <div className="add-card-input">
              <input
                type="text"
                value={newCardName}
                onChange={handleCardNameChange}
                placeholder="Enter card name"
              />
              <select value={chartType} onChange={handleChartTypeChange}>
                <option value="Pie Chart">Pie Chart</option>
                <option value="Bar Chart">Bar Chart</option>
              </select>
              {fields.map((field, index) => (
                <div key={index} className="field-input">
                  <input
                    type="text"
                    name="name"
                    value={field.name}
                    onChange={(e) => handleFieldChange(index, e)}
                    placeholder={`Field ${index + 1} Name`}
                  />
                  <input
                    type="color"
                    value={field.color}
                    onChange={(e) => handleColorChange(index, e)}
                  />
                  <input
                    type="number"
                    name="percentage"
                    value={field.percentage}
                    onChange={(e) => handlePercentageChange(index, e)}
                    placeholder="Percentage"
                    max="100"
                    min="0"
                  />
                  <button onClick={() => removeField(index)}>Remove</button>
                </div>
              ))}
              <button className="add-field-btn" onClick={addField}>
                Add Field
              </button>
              <button className="add-card-btn" onClick={addCard}>
                Add Card
              </button>
            </div>
          )}
          {selectedCategory && !isAddingCard && (
            <div className="sidebar-buttons">
              <button
                className="delete-widget-sidebar-btn"
                onClick={deleteSelectedCards}
              >
                Delete Selected
              </button>
              <button
                className="add-widget-sidebar-btn"
                onClick={handleAddButtonClick}
              >
                Add to {selectedCategory}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
