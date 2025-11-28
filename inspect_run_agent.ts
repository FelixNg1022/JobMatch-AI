const mod = await import("@corespeed/zypher");
const fn = mod.runAgentInTerminal;
console.log('runAgentInTerminal type:', typeof fn);
console.log(fn.toString().slice(0, 400));
