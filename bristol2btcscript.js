
const fs = require('fs');
const process = require('process');

const lines = fs.readFileSync(process.argv[2]).toString("utf8").replaceAll("\r", "").split("\n");

const numGatesAndWires = lines.shift().split(" ").map((x) => Number(x));
const numInputsOutputs = lines.shift().split(" ").map((x) => Number(x));

const numWires = numGatesAndWires[1];
const numInput1 = numInputsOutputs[0];
const numInput2 = numInputsOutputs[1];
const numOutputs = numInputsOutputs[2];

lines.shift(); // empty line

let stackToWire = []

for (let i = 0; i < numInput1; i++) {
    stackToWire.push(i);
    console.log("<1>");
}

for (let i = numInput1; i < numInput1 + numInput2; i++) {
    stackToWire.push(i);
    console.log("<1>");
}

function findWireValueOnStack(stackToWire, wire) {
   for (let i = 0; i < stackToWire.length; i++) {
       if (stackToWire[i] == wire) {
           return i;
       }
   }
   throw "wire value " + wire + " not found";
}

function findWireValueOnStackNoThrow(stackToWire, wire) {
   for (let i = 0; i < stackToWire.length; i++) {
       if (stackToWire[i] == wire) {
           return i;
       }
   }
   return -1;
}



function pushWireValueOnStack(stackToWire, wire) {
//   console.log("// pushing " + wire);
//   console.log("// before: " + JSON.stringify(stackToWire));
   stackToWire.unshift(wire);
//   console.log("// after:  " + JSON.stringify(stackToWire));
   if (stackToWire.length > 900) {
    console.log(stackToWire);
    throw "too high stack";
   }
}

function removeWireValueFromStack(stackToWire, wire) {
//   console.log("// removing: " + wire);
//   console.log("// before: " + JSON.stringify(stackToWire));
   stackToWire.splice(findWireValueOnStack(stackToWire, wire), 1); 
//   console.log("// after:  " + JSON.stringify(stackToWire));
}

let gates = [];

while (lines.length > 0) {
    const gate = lines.shift().split(" ");
    if (gate.length == 1) {
     continue;
    }
    
    if (["AND", "OR", "XOR"].includes(gate[gate.length - 1])) {
        gates.push({ type: gate[gate.length - 1], inputs: [Number(gate[2]), Number(gate[3])], output: Number(gate[4])});
    } else if (["INV"].includes(gate[gate.length - 1])) {
        gates.push({ type: gate[gate.length - 1], inputs: [Number(gate[2])], output: Number(gate[3]) });
    } else {
        throw "unknown wire type " + gate[gate.length - 1] + " " + JSON.stringify(gate);
    }
}


for (let i = 0; i < gates.length; i++) {
    const gate = gates[i];
    if (["AND", "OR", "XOR"].includes(gate.type)) {
         let left_found = false;
         let right_found = false;
  
         for (let j = i + 1; j < gates.length; j++) {
             if (gates[j].inputs.includes(gate.inputs[0])) {
                left_found = true;
             }
             if (gates[j].inputs.includes(gate.inputs[1])) {
                right_found = true;
             }
         }
         console.log("// " + JSON.stringify(gate));
         console.log("// " + JSON.stringify({left_found, right_found}));
         const leftWireOnStack = findWireValueOnStack(stackToWire, gate.inputs[0]);
         console.log("<" + (leftWireOnStack + 0) + ">");
         console.log("OP_PICK");
         const rightWireOnStack = findWireValueOnStack(stackToWire, gate.inputs[1]);
         console.log("<" + (rightWireOnStack + 1) + ">");
         console.log("OP_PICK");
         
         if (gate.type == "AND") {
           console.log("OP_BOOLAND");
         } else if (gate.type == "OR") {
           console.log("OP_BOOLOR");
         } else if (gate.type == "XOR") {
           console.log("// OP_BOOLXOR start");
           console.log("OP_NUMNOTEQUAL");
           console.log("// OP_BOOLXOR end");
           
         }
         // if we don't use it anymore, get rid of it
    /*     if (gate.inputs[0] == gate.inputs[1] && !left_found) {
            if (gate.inputs[0] > numWires - numOutputs && gate.inputs[0] < numWires + 1) {
              console.log("// refusing to get rid of output " + gate.inputs[0]);
            } else {
              console.log("// get rid of wire " + gate.inputs[0]);
              console.log("<" + leftWireOnStack + ">");
              console.log("OP_ROLL");
              console.log("OP_DROP"); 
              removeWireValueFromStack(stackToWire, gate.inputs[0]);
            }
         } else if (!left_found) {
            if (gate.inputs[0] > numWires - numOutputs && gate.inputs[0] < numWires + 1) {
              console.log("// refusing to get rid of output " + gate.inputs[0]);
            } else { 
              console.log("// get rid of wire " + gate.inputs[0]);
              console.log("<" + leftWireOnStack + ">");
              console.log("OP_ROLL");
              console.log("OP_DROP"); 
              removeWireValueFromStack(stackToWire, gate.inputs[0]);
           }
         }
         if (!right_found && gate.inputs[0] != gate.inputs[1]) {
            if (gate.inputs[1] > numWires - numOutputs && gate.inputs[1] < numWires + 1) {
              console.log("// refusing to get rid of right output " + gate.inputs[1]);
            } else { 
              const newWire = findWireValueOnStack(stackToWire, gate.inputs[1]);
              console.log("// get rid of wire right " + gate.inputs[1]);
              console.log("<" + newWire + ">");
              console.log("OP_ROLL");
              console.log("OP_DROP"); 
              removeWireValueFromStack(stackToWire, gate.inputs[1]);
           }
         } */
         pushWireValueOnStack(stackToWire, gate.output);
         console.log("// end gate");
    } else if (["INV"].includes(gate.type)) {
         const leftWireOnStack = findWireValueOnStack(stackToWire, gate.inputs[0]);

         let left_found = false;
         for (let j = i + 1; j < gates.length; j++) {
             if (gates[j].inputs.includes(gate.inputs[0])) {
                left_found = true;
             }
         }
         console.log("// " + JSON.stringify(gate));         
         console.log("<" + leftWireOnStack + ">");
         console.log("OP_PICK");
         console.log("OP_NOT");
/*         if (!left_found) {
            if (gate.inputs[0] > numWires - numOutputs && gate.inputs[0] < numWires + 1) {
               console.log("// refusing to get rid of output " + gate.inputs[0]);
            } else {
               console.log("// get rid of wire " + gate.inputs[0]);
               console.log("<" + leftWireOnStack + ">");
               console.log("OP_ROLL");
               console.log("OP_DROP"); 
               removeWireValueFromStack(stackToWire, gate.inputs[0]);
            }
         }
  */       pushWireValueOnStack(stackToWire, gate.output);
         console.log("// end gate");
    }
}

for (let i = numWires - numOutputs; i < numWires; i++) {
   console.log("// get output " + i + " wire: " + (i));
   console.log("<" + findWireValueOnStack(stackToWire, i) + ">");
   console.log("OP_ROLL");
   removeWireValueFromStack(stackToWire, i);
   pushWireValueOnStack(stackToWire, i);
}

for (let i = 0; i < numInput1 + numInput2; i++) {
   const index = findWireValueOnStackNoThrow(stackToWire, i);
   if (index != -1) {
       console.log("// get rid of unused input wire " + i);
       console.log("<" + index + ">");
       console.log("OP_ROLL");
       console.log("OP_DROP");
       removeWireValueFromStack(stackToWire, i);
   }
}

//console.log(JSON.stringify(stackToWire));

