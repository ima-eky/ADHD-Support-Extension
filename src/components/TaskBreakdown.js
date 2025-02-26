import React, {useState} from 'react';
import predefinedSubtasks from '../predefinedSubtasks.json';
import taskSynonyms from '../taskSynonyms.json';
import stringSimilarity from 'string-similarity';


const TaskBreakdown = () => {
    const [inputText, setInputText] = useState('');
    const [subtasks, setSubtasks] = useState([]);

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const findBestTaskMatch = (taskInput) => {
        let taskKey = taskInput.toLowerCase().trim();
    
        // Step 1: Check if input directly exists in predefinedSubtasks
        if (predefinedSubtasks[taskKey]) {
            return taskKey;
        }
    
        // Step 2: Check if input is a synonym for a known task
        for (const [mainTask, synonyms] of Object.entries(taskSynonyms)) {
            if (synonyms.includes(taskKey) || mainTask === taskKey) {
                return mainTask;
            }
        }
    
        // Step 3: Apply fuzzy matching across both task names and synonyms
        const allPossibleKeys = Object.keys(predefinedSubtasks);
        const allPossibleMatches = allPossibleKeys.concat(
            Object.values(taskSynonyms).flat()
        );
    
        const bestMatch = stringSimilarity.findBestMatch(taskKey, allPossibleMatches);
    
        if (bestMatch.bestMatch.rating > 0.5) {
            // Find the actual predefined task that matches this synonym
            for (const [mainTask, synonyms] of Object.entries(taskSynonyms)) {
                if (synonyms.includes(bestMatch.bestMatch.target) || mainTask === bestMatch.bestMatch.target) {
                    return mainTask;
                }
            }
            return bestMatch.bestMatch.target; // If no synonym match, return closest task name
        }
    
        return null;
    };
    

    const handleButtonClick = () => {
        const matchedTask = findBestTaskMatch(inputText);

        if (matchedTask && predefinedSubtasks[matchedTask]) {
            setSubtasks(predefinedSubtasks[matchedTask]);
        } else {
            setSubtasks(["No subtasks found"]);
        }
    };

    return (
        <div>
            <h1>Task Breakdown</h1>
            <p>This component will display the breakdown of tasks.</p>
            <input 
                type="text"
                value={inputText}
                onChange={handleInputChange}
                placeholder="Enter a task"
            />
            <button onClick = {handleButtonClick}>Break into subtasks</button>
            <h2>Subtasks</h2>
            <ul>
                {subtasks.map((subtask, index) => (
                    <li key={index}>{subtask}</li>
                ))}
            </ul>
        </div>
    );
};

export default TaskBreakdown;