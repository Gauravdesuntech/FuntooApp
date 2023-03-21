import EventEmitter from "events";

// import { EventEmitter } from "react-native";

const emitter = new EventEmitter();

emitter.on('error', (err) => {
    console.log('error in emmiter-->', err); 
});

export default emitter;