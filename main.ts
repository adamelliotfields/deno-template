/**
 * @example
 * ```sh
 * deno compile -A --output=dat main.ts
 * ./dat README.md
 * cat README.md | ./dat
 * ```
 */
import { parse as parseArgs } from "std/flags/mod.ts";
import { resolve } from "std/path/mod.ts";

// get the path the deno process is running in and "resolve" it with the path provided
// if instead you "join" the paths you'd get `/home/user/foo/home/user/foo/bar.txt` if the user provided an absolute path
const getFilePathFromArg = (arg: string | number): string =>
  resolve(Deno.cwd(), String(arg));

// get file info but don't actually read the contents of the file so it's fast
const getFileInfoFromArg = (arg: string | number): Promise<Deno.FileInfo> => {
  const path = getFilePathFromArg(arg);
  // note that this will always follow symlinks (`fileInfo.isSymlink` will always be false)
  return Deno.stat(path);
};

// help message
const VERSION = "0.0.1";
const USAGE = `USAGE:
  dat <ARGS>
  dat <FLAGS>`;
const ARGS = `ARGS:
  file           The file to dat. Exits on error. Can pipe to stdin if no args passed.`;
const FLAGS = `FLAGS:
  -h, --help     Prints help information
  -v, --version  Prints version information`;
const EXAMPLES = `EXAMPLES:
  dat file.txt
  dat file1.txt file2.txt
  echo who | dat
  dat --help`;
const HELP = `dat ${VERSION}
Deno cat. Concatenate and print files.

${USAGE}

${ARGS}

${FLAGS}

${EXAMPLES}`;

// parse command-line args
const { _: args, help, version } = parseArgs(Deno.args, {
  boolean: ["help", "version"],
  alias: {
    help: "h",
    version: "v",
  },
});

// prevent the pipe from closing stdout if we need to write to it multiple times
const pipeInToOut = (preventClose = false) =>
  Deno.stdin.readable.pipeTo(Deno.stdout.writable, { preventClose });

// loop through args and check that each is a file
// if any arg is not a file, print an error and exit
const statFiles = async () => {
  for (const arg of args) {
    const fileInfo = await getFileInfoFromArg(arg);
    if (!fileInfo.isFile) {
      console.error(
        `${arg} is not a file. dat only accepts files as arguments.`,
      );
      Deno.exit(1);
    }
  }
};

// loop through args and stream each file to stdout
const pipeFilesToOut = async () => {
  for (const arg of args) {
    const path = getFilePathFromArg(arg);
    const file = await Deno.open(path, { read: true });
    await file.readable.pipeTo(Deno.stdout.writable, {
      preventClose: true,
    });
  }
};

// if there are no args, we only read from stdin if it is not a TTY
const hasArgs = args.length > 0;
const isTTY = Deno.isatty(Deno.stdin.rid);
const shouldPrintHelp = help || (!hasArgs && isTTY);
const shouldPipeStdin = !hasArgs && !isTTY;
const shouldPipeFiles = hasArgs && isTTY;
const shouldPipeStdinAndFiles = hasArgs && !isTTY;

switch (true) {
  case shouldPrintHelp:
    console.log(HELP);
    break;
  case version:
    console.log(VERSION);
    break;
  case shouldPipeStdin:
    await pipeInToOut(false);
    break;
  case shouldPipeFiles:
    await statFiles();
    await pipeFilesToOut();
    break;
  case shouldPipeStdinAndFiles:
    await statFiles();
    await pipeInToOut(true);
    await pipeFilesToOut();
}

Deno.exit(0);
