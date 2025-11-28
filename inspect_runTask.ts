const mod = await import("@corespeed/zypher");
const ZypherAgent = mod.ZypherAgent;
console.log('runTask function type:', typeof ZypherAgent.prototype.runTask);
console.log(ZypherAgent.prototype.runTask.toString().slice(0, 1000));
