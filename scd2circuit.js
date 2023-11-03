const msgpack = require("@msgpack/msgpack");
const fs = require("fs");
const process = require("process");

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

console.log(JSON.stringify(arr2circuit(arr)));
