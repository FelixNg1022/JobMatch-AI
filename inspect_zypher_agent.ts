const mod = await import("@corespeed/zypher");
const ZypherAgent = mod.ZypherAgent;
console.log("ZypherAgent prototype keys:", Object.getOwnPropertyNames(ZypherAgent.prototype));
type ZypherAgentConstructorType = Record<string, unknown>;
console.log("ZypherAgent constructor keys:", Object.getOwnPropertyNames(ZypherAgent).filter(k => typeof (ZypherAgent as unknown as ZypherAgentConstructorType)[k as string] === 'function'));
