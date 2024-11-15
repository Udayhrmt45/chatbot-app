import { createContext } from "react";
import run from "../config/gemini";
import { useState } from "react";

export const Context = createContext();

const ContextProvider = (props) =>{

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [previousPrompts, setPreviousPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delayPara = (index,nextWord)=>{
        setTimeout(() => {
            setResultData(prev=>prev+nextWord);
        },75*index);
    }

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
    }

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);
        let response;
        if(prompt !== undefined){
            response = await run(prompt);
            setRecentPrompt(prompt);
        }else{
            setPreviousPrompts(prev=>[...prev,input]);
            setRecentPrompt(input);
            response = await run(input);
        }
        let responseArray = response.split("**");
        let newResponse = "";
        for(let i=0;i<responseArray.length;i++){
            if(i%2==0 || i%2 !== 1){
                newResponse += responseArray[i];
            }else{
                newResponse += "<b>"+responseArray[i]+"</b>";
            }
        }  
        let newResponse2 = newResponse.split("*").join("</br>");  
        // setResultData(newResponse2);
        let newResponseArray = newResponse2.split(" ");
        for(let i = 0;i<newResponseArray.length;i++){
            const newWord = newResponseArray[i];
            delayPara(i,newWord+" ");
        }
        setLoading(false);
        setInput("");

    }
    // onSent("What is reactjs?");

    const contextValue = {
        previousPrompts,
        setPreviousPrompts,
        onSent,
        recentPrompt,
        setRecentPrompt,
        input,
        setInput,
        showResult,
        loading,
        resultData,
        newChat
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;