import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./dark.css";
import data from "./data/nutrition_training_app_en.json";

const days = [
  "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"
];

const dayLabels = {
  sunday: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday"
};

const App = () => {
  const todayIndex = new Date().getDay();
  const today = days[todayIndex];
  const [selectedDay, setSelectedDay] = useState(today);
  const [view, setView] = useState("nutrition"); // NEW

  const lunchData = data.nutrition.daily_plan.lunch;
  const getLunch = () => {
    if (["monday", "tuesday"].includes(selectedDay)) return lunchData.monday_tuesday;
    if (["tuesday", "wednesday"].includes(selectedDay)) return lunchData.tuesday_wednesday;
    if (["wednesday", "thursday"].includes(selectedDay)) return lunchData.wednesday_thursday;
    if (["thursday", "friday"].includes(selectedDay)) return lunchData.thursday_friday;
    return null;
  };

  const lunch = getLunch();
  const trainingDay = data.training[selectedDay] || [];

  const [trainingTab, setTrainingTab] = useState("training"); // "warmup" | "training" | "stretching"
  const trainingBlocks = data.training?.[selectedDay] ?? [];

  const warmupList =
    data.training_menu?.[selectedDay]?.warmup ??
    data.training_menu?.default?.warmup ??
    [];

  const stretchingList =
    data.training_menu?.[selectedDay]?.stretching ??
    data.training_menu?.default?.stretching ??
    [];



  return (
    <div className="bg-dark text-light min-vh-100 py-3">
      <div className="container px-3">
        <h2 className="text-center mb-4" style={{ fontWeight: 500 }}>Nutrition & Training Planner</h2>

        {/* Day buttons */}
        <div className="d-flex justify-content-center flex-wrap gap-1 mb-3">
          {days.map(day => {
            let variant = "outline-light";
            if (day === selectedDay) {
              variant = "light";
            } else if (day === today) {
              variant = "success";
            }

            return (
              <button
                key={day}
                className={`btn btn-sm btn-${variant} rounded-pill px-3`}
                onClick={() => setSelectedDay(day)}
              >
                {dayLabels[day].substring(0, 3)}
              </button>
            );
          })}
        </div>

        {/* View Switch Buttons */}
        <div className="d-flex justify-content-center gap-2 mb-3">
          <button
            className={`btn btn-sm ${view === "nutrition" ? "btn-light" : "btn-outline-light"}`}
            onClick={() => setView("nutrition")}
          >
            Nutrition
          </button>
          <button
            className={`btn btn-sm ${view === "training" ? "btn-light" : "btn-outline-light"}`}
            onClick={() => setView("training")}
          >
            Training
          </button>
        </div>

        {/* Nutrition Card */}
        {view === "nutrition" && (
          <div className="card bg-secondary text-white shadow-sm rounded-4 mb-3">
            <div className="card-header bg-success rounded-top-4 text-white py-2 px-3" style={{ fontSize: "1rem" }}>
              Nutrition
            </div>
            <div className="card-body small px-3 py-2">
              <p>📅 <strong>{dayLabels[selectedDay]}</strong></p>
              {lunch ? (
                <>
                  <p className="mb-1"><strong>{lunch.name}</strong></p>
                  <p className="mb-1">Calories: {lunch.approx_calories} kcal</p>
                  <ul className="mb-2 ps-3">
                    {lunch.ingredients.map((item, idx) => (
                      <li key={idx}>{item.quantity} {item.name}</li>
                    ))}
                  </ul>
                  <p className="mb-1"><strong>Prep:</strong> {lunch.preparation}</p>
                  <p><strong>Macros:</strong> {lunch.nutrition.protein} / {lunch.nutrition.carbs} / {lunch.nutrition.fats}</p>
                </>
              ) : (
                <p>No lunch data available.</p>
              )}
            </div>
          </div>
        )}

        {/* Training Card */}
        {view === "training" && (
          <>
            {/* WARM-UP (rojo) */}
            <div className="card bg-secondary text-white shadow-sm rounded-4 mb-3">
              <div className="card-header bg-danger rounded-top-4 text-white py-2 px-3" style={{ fontSize: "1rem" }}>
                Warm-up
              </div>
              <div className="card-body small px-3 py-2">
                <p>📅 <strong>{dayLabels[selectedDay]}</strong></p>
                {warmupList.length === 0 ? (
                  <p>⚠️ No warm-up defined.</p>
                ) : (
                  <ul className="mb-0 ps-3">
                    {warmupList.map((it, i) => <li key={i}>{it}</li>)}
                  </ul>
                )}
              </div>
            </div>

            {/* TRAINING (celeste) */}
            <div className="card bg-secondary text-white shadow-sm rounded-4 mb-3">
              <div className="card-header bg-info rounded-top-4 text-white py-2 px-3" style={{ fontSize: "1rem" }}>
                Training
              </div>
              <div className="card-body small px-3 py-2">
                <p>📅 <strong>{dayLabels[selectedDay]}</strong></p>
                {trainingBlocks.length === 0 ? (
                  <p>🏋️ No training data for this day.</p>
                ) : (
                  trainingBlocks.map((block, i) => (
                    <div key={i} className="mb-3">
                      <p className="mb-1">
                        <span className="badge bg-light text-dark me-2">{block.muscle_group}</span>
                      </p>
                      <ul className="mb-0 ps-3">
                        {block.exercises.map((ex, idx) => (
                          <li key={idx}>{ex}</li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* STRETCHING (amarillo) */}
            <div className="card bg-secondary text-white shadow-sm rounded-4 mb-3">
              <div className="card-header bg-warning rounded-top-4 text-dark py-2 px-3" style={{ fontSize: "1rem" }}>
                Stretching
              </div>
              <div className="card-body small px-3 py-2">
                <p>📅 <strong>{dayLabels[selectedDay]}</strong></p>
                {stretchingList.length === 0 ? (
                  <p>🧘 No stretching defined.</p>
                ) : (
                  <ul className="mb-0 ps-3">
                    {stretchingList.map((it, i) => <li key={i}>{it}</li>)}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
