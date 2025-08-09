export default function PredictionResult({ name, probability, prediction }) {
  const percentage = Math.round(probability * 100);

  // Determine color based on probability range
  let circleColor = "";
  let textColor = "";
  let riskLevel = "";

  if (percentage <= 30) {
    circleColor = "text-green-500";
    textColor = "text-green-700";
    riskLevel = "Low Risk";
  } else if (percentage <= 55) {
    circleColor = "text-yellow-500";
    textColor = "text-yellow-700";
    riskLevel = "Moderate Risk";
  } else {
    circleColor = "text-red-500";
    textColor = "text-red-700";
    riskLevel = "High Risk";
  }

  const predictionText =
    prediction === 1
      ? "likely to have heart disease"
      : "unlikely to have heart disease";

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Heart Disease Prediction
      </h2>

      <div className="flex flex-col items-center">
        {/* Circular progress */}
        <div className="relative w-60 h-60 mb-6">
          <svg className="w-full h-full" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={339.292} // 2 * π * 54
              strokeDashoffset={339.292 * (1 - probability)}
              transform="rotate(-90 60 60)"
              className={circleColor}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-5xl font-bold">{percentage}%</span>
              <div className={`mt-2 text-lg font-semibold ${textColor}`}>
                {riskLevel}
              </div>
            </div>
          </div>
        </div>

        {/* Patient info */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-3">{name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')}'s Assessment</h3>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="font-medium">Probability:</div>
              <div className="font-bold">{percentage}%</div>

              <div className="font-medium">Risk Level:</div>
              <div className={`font-bold ${textColor}`}>{riskLevel}</div>

              <div className="font-medium">Prediction:</div>
              <div className="font-bold">
                {prediction === 1 ? "Positive" : "Negative"}
              </div>
            </div>
          </div>

          <p className="text-gray-700 italic">
            "{name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')} is {predictionText}."
          </p>
        </div>

        {/* Risk level guide */}
        <div className="w-full bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-bold text-gray-700 mb-3 text-center">
            Risk Level Guide
          </h4>
          <div className="flex justify-between">
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 bg-green-500 rounded-full mb-1"></div>
              <span className="text-xs">Low</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 bg-yellow-500 rounded-full mb-1"></div>
              <span className="text-xs">Moderate</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 bg-red-500 rounded-full mb-1"></div>
              <span className="text-xs">High</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
