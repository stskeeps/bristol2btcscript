
const fs = require('fs');
const process = require('process');
const msgpack = require("@msgpack/msgpack");

const arr = msgpack.decode(fs.readFileSync(process.argv[2]));

function arr2circuit(arr) {
	let p = 0;

	let n = arr[p];
	++p;
	let m = arr[p];
	++p;
	let q = arr[p];
	

	let O = Array(m).fill(0);
	let A = Array(q).fill(0);
	let B = Array(q).fill(0); 
	let G = Array(q).fill(0);
	
	let i;
	for (i = 0; i < q; i++) {
		++p;
		A[i] = arr[p];
	}
	for (i = 0; i < q; i++) {
		++p;
		B[i] = arr[p];
	}
	for (i = 0; i < q; i++) {
		++p;
		switch (arr[p]) {
			case 8: G[i] = "AND"; break;
			case 6: G[i] = "XOR"; break;
			case 3: G[i] = "NOT"; break;
			case 15: G[i] = "ONE"; break;
			case 14: G[i] = "OR"; break;
			default: throw "unknown gate: " + arr[p];		
		}
	}
	for (i = 0; i < m; i++) {
		++p;
		O[i] = arr[p];
	}
	return { m, n, q, O, A, B, G, dummy: n }
}

const circuit = arr2circuit(arr);

let stackToWire = []

for (let i = 0; i < circuit.n; i++) {
    stackToWire.unshift(i); 
    console.log("// input: " + i);
    console.log("<0>");
}

console.log("// output wires: " + JSON.stringify(circuit.O));

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

for (let i = 0; i < circuit.q; i++) {
    const outputWire = circuit.n + 1 + i;
    const gateType = circuit.G[i];
    if (["AND", "OR", "XOR"].includes(gateType)) {
      
         console.log("// " + JSON.stringify({a: circuit.A[i], b: circuit.B[i], gate: gateType, output: outputWire})); 
         const leftWireOnStack = findWireValueOnStack(stackToWire, circuit.A[i]);
         console.log("<" + (leftWireOnStack) + ">");
         console.log("OP_PICK");
         stackToWire.unshift(0xFFFFFFF);
         const rightWireOnStack = findWireValueOnStack(stackToWire, circuit.B[i]);
         console.log("<" + (rightWireOnStack) + ">");
         console.log("OP_PICK");
          if (gateType == "AND") {
           console.log("OP_BOOLAND");
         } else if (gateType == "OR") {
           console.log("OP_BOOLOR");
         } else if (gateType == "XOR") {
           console.log("// OP_BOOLXOR start");
           console.log("OP_NUMNOTEQUAL");
           console.log("// OP_BOOLXOR end");
         }
         stackToWire.shift();
         pushWireValueOnStack(stackToWire, outputWire);

         /*
         let left_found = false;
         let right_found = false;
  
         for (let j = i + 1; j < circuit.q; j++) {
             if (circuit.gates[j].inputs.includes(gate.inputs[0])) {
                left_found = true;
             }
             if (gates[j].inputs.includes(gate.inputs[1])) {
                right_found = true;
             }
         }



         console.log("// " + JSON.stringify(gate));
         console.log("// " + JSON.stringify({left_found, right_found}));
         const leftWireOnStack = findWireValueOnStack(stackToWire, gate.inputs[0]);
         console.log("<" + (leftWireOnStack) + ">");
         console.log("OP_PICK");
         // stack: [left wire]
         stackToWire.unshift(0xFFFFFFF);
         const rightWireOnStack = findWireValueOnStack(stackToWire, gate.inputs[1]);
         console.log("<" + (rightWireOnStack) + ">");
         console.log("OP_PICK");
         stackToWire.unshift(0xFFFFFFF);
         // stack: 0: [right wire] 1: [left wire]
         if (gate.type == "AND") {
           console.log("OP_BOOLAND");
         } else if (gate.type == "OR") {
           console.log("OP_BOOLOR");
         } else if (gate.type == "XOR") {
           console.log("// OP_BOOLXOR start");
           console.log("OP_NUMNOTEQUAL");
           console.log("// OP_BOOLXOR end");
           
          }
          stackToWire.shift();
          stackToWire.shift();
          // stack: 0: [right op left] 
 
          pushWireValueOnStack(stackToWire, gate.output);
         
         // if we don't use it anymore, get rid of it
         if (gate.inputs[0] == gate.inputs[1] && !left_found) {
            if (gate.inputs[0] > numWires - numOutputs + 1 && gate.inputs[0] < numWires) {
              console.log("// refusing to get rid of output " + gate.inputs[0]);
            } else {
              console.log("// get rid of wire " + gate.inputs[0]);
              const leftWireOnStack = findWireValueOnStack(stackToWire, gate.inputs[0]);
              console.log("<" + leftWireOnStack + ">");
              console.log("OP_ROLL");
              console.log("OP_DROP"); 
              removeWireValueFromStack(stackToWire, gate.inputs[0]);
            }
         } else if (!left_found) {
            if (gate.inputs[0] > numWires - numOutputs + 1 && gate.inputs[0] < numWires) {
              console.log("// refusing to get rid of output " + gate.inputs[0]);
            } else { 
              console.log("// get rid of wire " + gate.inputs[0]);
              const leftWireOnStack = findWireValueOnStack(stackToWire, gate.inputs[0]);
              console.log("<" + leftWireOnStack + ">");
              console.log("OP_ROLL");
              console.log("OP_DROP"); 
              removeWireValueFromStack(stackToWire, gate.inputs[0]);
           }
         }
         if (!right_found && gate.inputs[0] != gate.inputs[1]) {
            if (gate.inputs[1] > numWires - numOutputs - 1 && gate.inputs[1] < numWires) {
              console.log("// refusing to get rid of right output " + gate.inputs[1]);
            } else { 
              const newWire = findWireValueOnStack(stackToWire, gate.inputs[1]);
              console.log("// get rid of wire right " + gate.inputs[1]);
              console.log("<" + newWire + ">");
              console.log("OP_ROLL");
              console.log("OP_DROP"); 
              removeWireValueFromStack(stackToWire, gate.inputs[1]);
           }
         }
         */
         console.log("// end gate");
    } else if (["NOT"].includes(gateType)) {
         console.log("// " + JSON.stringify({a: circuit.A[i], b: circuit.B[i], gate: circuit.G[i], output: outputWire})); 
         if (circuit.A[i] == circuit.dummy) {
            throw "left side is using dummy wire";
         }
         const leftWireOnStack = findWireValueOnStack(stackToWire, circuit.A[i]);
         console.log("<" + (leftWireOnStack) + ">");
         console.log("OP_PICK");
         console.log("OP_NOT");
         pushWireValueOnStack(stackToWire, outputWire); 
         console.log("// end gate");
    } else {
      throw "unknown gate type: " + gateType;
    }
    
    function gcWire(stackToWire, index, circuit, wire) {
       let found = false;
       if (circuit.dummy == wire) {
          return;
       }
       if (circuit.O.includes(wire)) {
          return;
       }
       for (let j = index + 1; j < circuit.q; j++) { 
          if (circuit.A[j] == wire || circuit.B[j] == wire) {
             found = true;
             break;
          }
       }
       if (found) {
          return;
       }
       let stackIndex = findWireValueOnStackNoThrow(stackToWire, wire);
       if (stackIndex !== -1) {
          console.log("// GC'ing wire " + wire);
          console.log("<" + (stackIndex) + ">");
          console.log("OP_ROLL");
          console.log("OP_DROP");
          removeWireValueFromStack(stackToWire, wire);
       }
    }

    gcWire(stackToWire, i, circuit, circuit.A[i]);
    gcWire(stackToWire, i, circuit, circuit.B[i]);
}

/* for (let i = 0; i < circuit.q; i++) {
    const outputWire = circuit.n + 1 + i;
    if (!circuit.O.includes(outputWire)) {
       const leftWireOnStack = findWireValueOnStack(stackToWire, outputWire);
       removeWireValueFromStack(stackToWire, outputWire);
       console.log("// removing non-final output wire " + outputWire);
       console.log("<" + leftWireOnStack + ">");
       console.log("OP_ROLL");
       console.log("OP_DROP");
    }
} */

for (let i = 0; i < circuit.n; i++) {
    if (!circuit.O.includes(i)) {
       const leftWireOnStack = findWireValueOnStackNoThrow(stackToWire, i);
       if (leftWireOnStack == -1) {
          continue;
       }
       removeWireValueFromStack(stackToWire, i);
       console.log("// removing unused?? non-output input wire " + i);
       console.log("<" + leftWireOnStack + ">");
       console.log("OP_ROLL");
       console.log("OP_DROP");
    }
}
