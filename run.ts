if (Deno.args.length !== 1) {
  console.error("Please provide a file path as an argument");
  Deno.exit(1);
}

const encoder = new TextEncoder();
const imports = {
  env: {
    log: (arg: number) => console.log(arg),
    log_int: (arg: number) => console.log(arg),
    log_f32: (arg: number) => console.log(arg),
    log_float: (arg: number) => console.log(arg),
    print_char: (cp: number) =>
      Deno.stdout.writeSync(encoder.encode(String.fromCodePoint(cp))),
    random: () => Math.random(),
  },
};

let start = performance.mark("start");
const filePath = Deno.args[0];
const wasmCode = await Deno.readFile(filePath);
const wasmInstance = await WebAssembly.instantiate(wasmCode, imports);
const main = (wasmInstance.instance.exports["main"] ??
  wasmInstance.instance.exports["main::main"]) as CallableFunction;
main();
let perf = performance.measure("runtime", "start");
console.log(`${perf.duration.toFixed(2)}ms`);
