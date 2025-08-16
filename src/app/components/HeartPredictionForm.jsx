'use client';

import { useState } from 'react';
import PredictionResult from "./PredictionResult"; 

function HeartPredictionForm() {
    const [formData, setFormData] = useState({
        fullName: '',
        age: '',
        sex: '',
        chestPainType:'',
        restingBP:'',
        cholesterol:'',
        fastingBS:'',
        maxHR:'',
        exerciseAngina:'',
        restingECG:'',
        oldPeak:'',
        st_Slope:''
    });

    const [errors, setErrors] = useState({});
    const [result, setResult] = useState(null);

    function handleChange(e) {
    let { name, value } = e.target;

    // If the value contains '/' or '\', take only the part before
    if (value.includes('/') || value.includes('\\')) {
        value = value.split(/[/\\]/)[0];
    }

    // List of numeric fields
    const numericFields = [
        "age", "restingBP", "cholesterol", "maxHR", "oldPeak"
    ];

    let finalValue = value;

    if (numericFields.includes(name)) {
        finalValue = value ? Number(value) : '';
    }

    setFormData({
        ...formData,
        [name]: finalValue
    });

    // Clear error when user starts typing
    if (errors[name]) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });
    }
}

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.age) newErrors.age = 'Age is required';
        if (formData.sex === '') newErrors.sex = 'Please select your gender';
        if (!formData.chestPainType) newErrors.chestPainType = 'Please select chest pain type';
        if (!formData.restingBP) newErrors.restingBP = 'Resting blood pressure is required';
        if (!formData.cholesterol) newErrors.cholesterol = 'Cholesterol level is required';
        if (formData.fastingBS === '') newErrors.fastingBS = 'Please select fasting blood sugar status';
        if (!formData.restingECG) newErrors.restingECG = 'Please select resting ECG results';
        if (!formData.maxHR) newErrors.maxHR = 'Maximum heart rate is required';
        if (formData.exerciseAngina === '') newErrors.exerciseAngina = 'Please select exercise angina status';
        
        // Fixed Old Peak validation
        if (!formData.oldPeak) {
            newErrors.oldPeak = 'Old peak value is required';
        } else {
            const oldPeakValue = parseFloat(formData.oldPeak);
            if (isNaN(oldPeakValue)) {
                newErrors.oldPeak = 'Please enter a valid number';
            } else if (oldPeakValue < 0 || oldPeakValue > 6.7) {
                newErrors.oldPeak = 'Value must be between 0 and 6.7';
            }
        }
        
        if (!formData.st_Slope) newErrors.st_Slope = 'Please select ST slope';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                console.error('Server error:', res.status);
                return;
            }

            const data = await res.json();
            setResult(data);
        } catch (error) {
            console.error('Request failed:', error);
        }
    };

    const handleNewPrediction = () => {
        setResult(null);
        setFormData({
            fullName: '',
            age: '',
            sex: '',
            chestPainType:'',
            restingBP:'',
            cholesterol:'',
            fastingBS:'',
            maxHR:'',
            exerciseAngina:'',
            restingECG:'',
            oldPeak:'',
            st_Slope:''
        });
    };

    return (
        <div className="w-full">
            {result ? (
                <div className="pt-8">
                    <PredictionResult 
                        name={formData.fullName} 
                        probability={result.probability} 
                        prediction={result.prediction} 
                    />
                    <div className="text-center mt-8">
                        <button
                            onClick={handleNewPrediction}
                            className="bg-purple-600 hover:bg-purple-800 text-white py-3 px-8 rounded-lg transition duration-200 text-lg font-medium"
                        >
                            Make New Prediction
                        </button>
                    </div>
                </div>
            ) : (
                <div className="pt-4 sm:pt-8 mx-auto max-w-xl">
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
                            Heart Disease Prediction
                        </h1>
                        <p className="text-center text-gray-600 mt-2">
                            Enter your details below to assess your heart disease risk
                        </p>
                    </div>
                    
                    <form 
                        onSubmit={handleSubmit}
                        className="bg-white rounded-lg shadow-md p-4 sm:p-6"
                        noValidate
                    >
                        {/* Full Name */}
                        <div className="mb-4">
                            <label 
                                htmlFor="name"
                                className="block text-gray-700 font-semibold mb-2"
                            >
                                Full Name
                            </label>
                            <input 
                                id='name'
                                type="text"
                                name='fullName'
                                value={formData.fullName}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.fullName && (
                                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                            )}
                        </div>

                        {/* Age */}
                        <div className="mb-4">
                            <label 
                                htmlFor="age"
                                className="block text-gray-700 font-semibold mb-2"
                            >
                                Age
                            </label>
                            <input 
                                id='age'
                                type="number"
                                name='age'
                                min='18'
                                value={formData.age}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.age ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.age && (
                                <p className="text-red-500 text-sm mt-1">{errors.age}</p>
                            )}
                        </div>

                        {/* Gender */}
                        <div className="mb-4">
                            <label 
                                className="block text-gray-700 font-semibold mb-2"
                            >
                                Gender
                            </label>
                            <div className="flex space-x-6">
                                <label className="flex items-center space-x-2">
                                    <input 
                                        type="radio" 
                                        name="sex" 
                                        value="1" 
                                        checked={formData.sex === "1"}
                                        onChange={handleChange}
                                        className="form-radio text-purple-600"
                                    />
                                    <span>Male</span>
                                </label>

                                <label className="flex items-center space-x-2">
                                    <input 
                                        type="radio" 
                                        name="sex" 
                                        value="0"
                                        checked={formData.sex ==="0"}
                                        onChange ={handleChange}
                                        className="form-radio text-purple-600"
                                    />
                                    <span>Female</span>
                                </label>
                            </div>
                            {errors.sex && (
                                <p className="text-red-500 text-sm mt-1">{errors.sex}</p>
                            )}
                        </div>

                        {/* Chest Pain Types */}
                        <div className="mb-4">
                            <label 
                                className="block text-gray-700 font-semibold mb-2"
                            >
                                Chest Pain Types
                            </label>
                            <select 
                                name="chestPainType"
                                value={formData.chestPainType} 
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.chestPainType ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                                <option value="">Select</option>
                                <option value='0'>TA: Typical Angina</option>
                                <option value="1">ATA: Atypical Angina</option>
                                <option value="2">NAP: Non- Angina Pain</option>
                                <option value="3">ASY: Asymptomatic</option>
                            </select>
                            {errors.chestPainType && (
                                <p className="text-red-500 text-sm mt-1">{errors.chestPainType}</p>
                            )}
                        </div>

                        {/* Resting Blood Pressure */}
                        <div className="mb-4">
                            <label 
                                htmlFor="restingBlood"
                                className="block text-gray-700 font-semibold mb-2"
                            >
                                Resting Blood Pressure (mm/Hg)
                            </label>
                            <input 
                                id='restingBlood'
                                type="text" 
                                name='restingBP'
                                value={formData.restingBP}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.restingBP ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.restingBP && (
                                <p className="text-red-500 text-sm mt-1">{errors.restingBP}</p>
                            )}
                        </div>

                        {/* Cholesterol Level */}
                        <div className="mb-4">
                            <label 
                                className="block text-gray-700 font-semibold mb-2"
                                htmlFor="cholesterol"
                            >
                                Cholesterol Level (mm/dl)
                            </label>
                            <input 
                                id='cholesterol'
                                type="text" 
                                name='cholesterol'
                                value={formData.cholesterol}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.cholesterol ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.cholesterol && (
                                <p className="text-red-500 text-sm mt-1">{errors.cholesterol}</p>
                            )}
                        </div>

                        {/* Fasting Blood Sugar */}
                        <div className="mb-4">
                            <label 
                                className="block text-gray-700 font-semibold mb-2"
                            >
                                Is Fasting Blood Pressure &gt; 120 mg/dl?
                            </label>
                            <div className="flex space-x-6">
                                <label className="flex items-center space-x-2">
                                    <input 
                                        type="radio" 
                                        name="fastingBS" 
                                        value="1"
                                        checked={formData.fastingBS==="1"} 
                                        onChange={handleChange}
                                        className="form-radio text-purple-600"
                                    />
                                    <span>Yes</span>
                                </label>

                                <label className="flex items-center space-x-2">
                                    <input 
                                        type="radio" 
                                        name="fastingBS"
                                        value="0"
                                        checked={formData.fastingBS==="0"}
                                        onChange={handleChange}
                                        className="form-radio text-purple-600"
                                    />
                                    <span>No</span>
                                </label>
                            </div>
                            {errors.fastingBS && (
                                <p className="text-red-500 text-sm mt-1">{errors.fastingBS}</p>
                            )}
                        </div>

                        {/* Resting ECG */}
                        <div className="mb-4">
                            <label 
                                className="block text-gray-700 font-semibold mb-2"
                            >
                                Resting Electro Cardio Graphic Results
                            </label>
                            <select 
                                name="restingECG"
                                value={formData.restingECG}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.restingECG ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                                <option value="">Select</option>
                                <option value="0">Normal</option>
                                <option value="1">ST-T wave abnormality (ST)</option>
                                <option value="2">Left Ventricular Hypertrophy (LVH)</option>
                            </select>
                            {errors.restingECG && (
                                <p className="text-red-500 text-sm mt-1">{errors.restingECG}</p>
                            )}
                        </div>

                        {/* Max Heart Rate */}
                        <div className="mb-4">
                            <label 
                                htmlFor="maxHR"
                                className="block text-gray-700 font-semibold mb-2"
                            >
                                Maximum Heart Rate Achieved:
                            </label>
                            <input
                                id='maxHR'
                                type="number"
                                name='maxHR'
                                min="60"
                                max="202"
                                value={formData.maxHR} 
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.maxHR ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.maxHR && (
                                <p className="text-red-500 text-sm mt-1">{errors.maxHR}</p>
                            )}
                        </div>

                        {/* Exercise Angina */}
                        <div className="mb-4">
                            <label 
                                className="block text-gray-700 font-semibold mb-2"
                            >
                                Does Exercise Induce Angina?
                            </label>
                            <div className="flex space-x-6">
                                <label className="flex items-center space-x-2">
                                    <input 
                                        type="radio" 
                                        name="exerciseAngina"
                                        value="1"
                                        checked={formData.exerciseAngina==="1"} 
                                        onChange={handleChange}
                                        className="form-radio text-purple-600"
                                    />
                                    <span>Yes</span>
                                </label>

                                <label className="flex items-center space-x-2">
                                    <input 
                                        type="radio"
                                        name="exerciseAngina"
                                        value="0"
                                        checked={formData.exerciseAngina==="0"} 
                                        onChange={handleChange}
                                        className="form-radio text-purple-600"
                                    />
                                    <span>No</span>
                                </label>
                            </div>
                            {errors.exerciseAngina && (
                                <p className="text-red-500 text-sm mt-1">{errors.exerciseAngina}</p>
                            )}
                        </div>

                        {/* Old Peak */}
                        <div className="mb-4">
                            <label 
                                className="block text-gray-700 font-semibold mb-2"
                            >
                                Old Peak (ST depression induced by exercise related to rest)
                                <span className="text-sm text-gray-500 ml-1">(0 - 6.7)</span>
                            </label>
                            <input
                                name='oldPeak'
                                type="number"
                                min="0"
                                max="6.7"
                                step="0.1"
                                value={formData.oldPeak}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.oldPeak ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.oldPeak && (
                                <p className="text-red-500 text-sm mt-1">{errors.oldPeak}</p>
                            )}
                        </div>

                        {/* ST Slope */}
                        <div className="mb-6">
                            <label 
                                className="block text-gray-700 font-semibold mb-2"
                            >
                                Slope of the peak exercise ST segment
                            </label>
                            <select 
                                name='st_Slope'
                                value={formData.st_Slope}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.st_Slope ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                                <option value="">Select</option>
                                <option value="0">Up: Upsloping</option>
                                <option value="1">Flat</option>
                                <option value="2">Down: Downsloping</option>
                            </select>
                            {errors.st_Slope && (
                                <p className="text-red-500 text-sm mt-1">{errors.st_Slope}</p>
                            )}
                        </div>

                        <button 
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-800 text-white py-3 px-4 rounded transition duration-200 text-lg font-medium"
                        >
                            Predict
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default HeartPredictionForm;
