import React, { useState, useEffect } from 'react';
import predefinedSubtasks from '../predefinedSubtasks.json';
import taskSynonyms from '../taskSynonyms.json';
import stringSimilarity from 'string-similarity';
import nlp from 'compromise';
import * as use from '@tensorflow-models/universal-sentence-encoder';

// Load NLP tools for normalization
function normalizeText(text) {
    return nlp(text).normalize().out('text').toLowerCase().trim();
}

// Stores dynamically learned synonyms
const learnedSynonyms = {};

// Ensure the AI model is loaded once
let model;
async function ensureModelLoaded() {
    if (!model) {
        model = await use.load();
    }
}

// Convert a phrase into an embedding vector
async function getSentenceEmbedding(sentence) {
    await ensureModelLoaded();
    const embeddings = await model.embed([sentence]);
    return embeddings.array();
}

// Cosine Similarity Function for Embeddings
function cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.map((v, i) => v * vecB[i]).reduce((a, b) => a + b, 0);
    const magnitudeA = Math.sqrt(vecA.map(v => v ** 2).reduce((a, b) => a + b, 0));
    const magnitudeB = Math.sqrt(vecB.map(v => v ** 2).reduce((a, b) => a + b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

// AI Task Matching Function (Handles NLP + Embeddings)
async function findBestTaskMatch(taskInput) {
    await ensureModelLoaded(); // Load model before use

    let taskKey = normalizeText(taskInput);

    // Step 1: Direct Match with Predefined Subtasks
    if (predefinedSubtasks[taskKey]) return taskKey;

    // Step 2: Check in Learned Synonyms
    if (learnedSynonyms[taskKey]) return learnedSynonyms[taskKey];

    // Step 3: Check in Predefined Synonyms
    for (const [mainTask, synonyms] of Object.entries(taskSynonyms)) {
        if (synonyms.includes(taskKey) || mainTask === taskKey) return mainTask;
    }

    // Step 4: Normalize and Compare Synonyms
    const normalizedInput = normalizeText(taskKey);
    for (const [mainTask, synonyms] of Object.entries(taskSynonyms)) {
        if (synonyms.some(synonym => normalizeText(synonym) === normalizedInput)) {
            return mainTask;
        }
    }

    // Step 5: String Similarity Matching
    const allPossibleMatches = [
        ...Object.keys(predefinedSubtasks),
        ...Object.keys(taskSynonyms),
        ...Object.values(taskSynonyms).flat(),
    ];
    const bestMatch = stringSimilarity.findBestMatch(taskKey, allPossibleMatches);
    if (bestMatch.bestMatch.rating > 0.5) return bestMatch.bestMatch.target;

    // Step 6: AI Sentence Embeddings for Deep Context Matching
    const inputEmbedding = await getSentenceEmbedding(taskKey);
    let bestEmbeddingMatch = { task: null, score: 0 };

    for (const [task] of Object.entries(predefinedSubtasks)) {
        const taskEmbedding = await getSentenceEmbedding(task);
        const similarityScore = cosineSimilarity(inputEmbedding, taskEmbedding);

        if (similarityScore > bestEmbeddingMatch.score) {
            bestEmbeddingMatch = { task, score: similarityScore };
        }
    }

    return bestEmbeddingMatch.score > 0.7 ? bestEmbeddingMatch.task : null;
}

// Step 7: Auto-Learn User Phrases
function learnNewSynonym(userInput, matchedTask) {
    if (!learnedSynonyms[userInput]) {
        learnedSynonyms[userInput] = matchedTask;
    }
}

// 🚀 **React Component**
const TaskBreakdown = () => {
    const [inputText, setInputText] = useState('');
    const [subtasks, setSubtasks] = useState([]);
    const [loading, setLoading] = useState(false);

    // Ensure model loads when component mounts
    useEffect(() => {
        ensureModelLoaded();
    }, []);

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const handleButtonClick = async () => {
        setLoading(true);
        const matchedTask = await findBestTaskMatch(inputText);

        if (matchedTask && predefinedSubtasks[matchedTask]) {
            setSubtasks(predefinedSubtasks[matchedTask]); // Use predefined subtasks
        } else {
            setSubtasks(["No subtasks found"]);
        }
        setLoading(false);
    };

    return (
        <div>
            <h1>Task Breakdown</h1>
            <p>Enter a task to see its breakdown.</p>
            <input 
                type="text"
                value={inputText}
                onChange={handleInputChange}
                placeholder="Enter a task"
            />
            <button onClick={handleButtonClick} disabled={loading}>
                {loading ? "Processing..." : "Break into Subtasks"}
            </button>
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
