import { createHighlighterCore, createOnigurumaEngine } from "shiki";

const langs = [
  import("@shikijs/langs/1c-query"),
  import("@shikijs/langs/1c"),
  import("@shikijs/langs/abap"),
  import("@shikijs/langs/actionscript-3"),
  import("@shikijs/langs/ada"),
  import("@shikijs/langs/adoc"),
  import("@shikijs/langs/angular-expression"),
  import("@shikijs/langs/angular-html"),
  import("@shikijs/langs/angular-inline-style"),
  import("@shikijs/langs/angular-inline-template"),
  import("@shikijs/langs/angular-let-declaration"),
  import("@shikijs/langs/angular-template-blocks"),
  import("@shikijs/langs/angular-template"),
  import("@shikijs/langs/angular-ts"),
  import("@shikijs/langs/apache"),
  import("@shikijs/langs/apex"),
  import("@shikijs/langs/apl"),
  import("@shikijs/langs/applescript"),
  import("@shikijs/langs/ara"),
  import("@shikijs/langs/asciidoc"),
  import("@shikijs/langs/asm"),
  import("@shikijs/langs/astro"),
  import("@shikijs/langs/awk"),
  import("@shikijs/langs/ballerina"),
  import("@shikijs/langs/bash"),
  import("@shikijs/langs/bat"),
  import("@shikijs/langs/batch"),
  import("@shikijs/langs/be"),
  import("@shikijs/langs/beancount"),
  import("@shikijs/langs/berry"),
  import("@shikijs/langs/bibtex"),
  import("@shikijs/langs/bicep"),
  import("@shikijs/langs/blade"),
  import("@shikijs/langs/bsl"),
  import("@shikijs/langs/c"),
  import("@shikijs/langs/cadence"),
  import("@shikijs/langs/cairo"),
  import("@shikijs/langs/cdc"),
  import("@shikijs/langs/clarity"),
  import("@shikijs/langs/clj"),
  import("@shikijs/langs/clojure"),
  import("@shikijs/langs/closure-templates"),
  import("@shikijs/langs/cmake"),
  import("@shikijs/langs/cmd"),
  import("@shikijs/langs/cobol"),
  import("@shikijs/langs/codeowners"),
  import("@shikijs/langs/codeql"),
  import("@shikijs/langs/coffee"),
  import("@shikijs/langs/coffeescript"),
  import("@shikijs/langs/common-lisp"),
  import("@shikijs/langs/console"),
  import("@shikijs/langs/coq"),
  import("@shikijs/langs/cpp-macro"),
  import("@shikijs/langs/cpp"),
  import("@shikijs/langs/cql"),
  import("@shikijs/langs/crystal"),
  import("@shikijs/langs/cs"),
  import("@shikijs/langs/csharp"),
  import("@shikijs/langs/css"),
  import("@shikijs/langs/csv"),
  import("@shikijs/langs/cue"),
  import("@shikijs/langs/cypher"),
  import("@shikijs/langs/d"),
  import("@shikijs/langs/dart"),
  import("@shikijs/langs/dax"),
  import("@shikijs/langs/desktop"),
  import("@shikijs/langs/diff"),
  import("@shikijs/langs/docker"),
  import("@shikijs/langs/dockerfile"),
  import("@shikijs/langs/dotenv"),
  import("@shikijs/langs/dream-maker"),
  import("@shikijs/langs/edge"),
  import("@shikijs/langs/elisp"),
  import("@shikijs/langs/elixir"),
  import("@shikijs/langs/elm"),
  import("@shikijs/langs/emacs-lisp"),
  import("@shikijs/langs/erb"),
  import("@shikijs/langs/erl"),
  import("@shikijs/langs/erlang"),
  import("@shikijs/langs/es-tag-css"),
  import("@shikijs/langs/es-tag-glsl"),
  import("@shikijs/langs/es-tag-html"),
  import("@shikijs/langs/es-tag-sql"),
  import("@shikijs/langs/es-tag-xml"),
  import("@shikijs/langs/f"),
  import("@shikijs/langs/f03"),
  import("@shikijs/langs/f08"),
  import("@shikijs/langs/f18"),
  import("@shikijs/langs/f77"),
  import("@shikijs/langs/f90"),
  import("@shikijs/langs/f95"),
  import("@shikijs/langs/fennel"),
  import("@shikijs/langs/fish"),
  import("@shikijs/langs/fluent"),
  import("@shikijs/langs/for"),
  import("@shikijs/langs/fortran-fixed-form"),
  import("@shikijs/langs/fortran-free-form"),
  import("@shikijs/langs/fs"),
  import("@shikijs/langs/fsharp"),
  import("@shikijs/langs/fsl"),
  import("@shikijs/langs/ftl"),
  import("@shikijs/langs/gdresource"),
  import("@shikijs/langs/gdscript"),
  import("@shikijs/langs/gdshader"),
  import("@shikijs/langs/genie"),
  import("@shikijs/langs/gherkin"),
  import("@shikijs/langs/git-commit"),
  import("@shikijs/langs/git-rebase"),
  import("@shikijs/langs/gjs"),
  import("@shikijs/langs/gleam"),
  import("@shikijs/langs/glimmer-js"),
  import("@shikijs/langs/glimmer-ts"),
  import("@shikijs/langs/glsl"),
  import("@shikijs/langs/gnuplot"),
  import("@shikijs/langs/go"),
  import("@shikijs/langs/gql"),
  import("@shikijs/langs/graphql"),
  import("@shikijs/langs/groovy"),
  import("@shikijs/langs/gts"),
  import("@shikijs/langs/hack"),
  import("@shikijs/langs/haml"),
  import("@shikijs/langs/handlebars"),
  import("@shikijs/langs/haskell"),
  import("@shikijs/langs/haxe"),
  import("@shikijs/langs/hbs"),
  import("@shikijs/langs/hcl"),
  import("@shikijs/langs/hjson"),
  import("@shikijs/langs/hlsl"),
  import("@shikijs/langs/hs"),
  import("@shikijs/langs/html-derivative"),
  import("@shikijs/langs/html"),
  import("@shikijs/langs/http"),
  import("@shikijs/langs/hxml"),
  import("@shikijs/langs/hy"),
  import("@shikijs/langs/imba"),
  import("@shikijs/langs/ini"),
  import("@shikijs/langs/jade"),
  import("@shikijs/langs/java"),
  import("@shikijs/langs/javascript"),
  import("@shikijs/langs/jinja-html"),
  import("@shikijs/langs/jinja"),
  import("@shikijs/langs/jison"),
  import("@shikijs/langs/jl"),
  import("@shikijs/langs/js"),
  import("@shikijs/langs/json"),
  import("@shikijs/langs/json5"),
  import("@shikijs/langs/jsonc"),
  import("@shikijs/langs/jsonl"),
  import("@shikijs/langs/jsonnet"),
  import("@shikijs/langs/jssm"),
  import("@shikijs/langs/jsx"),
  import("@shikijs/langs/julia"),
  import("@shikijs/langs/kotlin"),
  import("@shikijs/langs/kql"),
  import("@shikijs/langs/kt"),
  import("@shikijs/langs/kts"),
  import("@shikijs/langs/kusto"),
  import("@shikijs/langs/latex"),
  import("@shikijs/langs/lean"),
  import("@shikijs/langs/lean4"),
  import("@shikijs/langs/less"),
  import("@shikijs/langs/liquid"),
  import("@shikijs/langs/lisp"),
  import("@shikijs/langs/lit"),
  import("@shikijs/langs/llvm"),
  import("@shikijs/langs/log"),
  import("@shikijs/langs/logo"),
  import("@shikijs/langs/lua"),
  import("@shikijs/langs/luau"),
  import("@shikijs/langs/make"),
  import("@shikijs/langs/makefile"),
  import("@shikijs/langs/markdown-vue"),
  import("@shikijs/langs/markdown"),
  import("@shikijs/langs/marko"),
  import("@shikijs/langs/matlab"),
  import("@shikijs/langs/md"),
  import("@shikijs/langs/mdc"),
  import("@shikijs/langs/mdx"),
  import("@shikijs/langs/mediawiki"),
  import("@shikijs/langs/mermaid"),
  import("@shikijs/langs/mips"),
  import("@shikijs/langs/mipsasm"),
  import("@shikijs/langs/mmd"),
  import("@shikijs/langs/mojo"),
  import("@shikijs/langs/move"),
  import("@shikijs/langs/nar"),
  import("@shikijs/langs/narrat"),
  import("@shikijs/langs/nextflow"),
  import("@shikijs/langs/nf"),
  import("@shikijs/langs/nginx"),
  import("@shikijs/langs/nim"),
  import("@shikijs/langs/nix"),
  import("@shikijs/langs/nu"),
  import("@shikijs/langs/nushell"),
  import("@shikijs/langs/objc"),
  import("@shikijs/langs/objective-c"),
  import("@shikijs/langs/objective-cpp"),
  import("@shikijs/langs/ocaml"),
  import("@shikijs/langs/pascal"),
  import("@shikijs/langs/perl"),
  import("@shikijs/langs/perl6"),
  import("@shikijs/langs/php"),
  import("@shikijs/langs/plsql"),
  import("@shikijs/langs/po"),
  import("@shikijs/langs/polar"),
  import("@shikijs/langs/postcss"),
  import("@shikijs/langs/pot"),
  import("@shikijs/langs/potx"),
  import("@shikijs/langs/powerquery"),
  import("@shikijs/langs/powershell"),
  import("@shikijs/langs/prisma"),
  import("@shikijs/langs/prolog"),
  import("@shikijs/langs/properties"),
  import("@shikijs/langs/proto"),
  import("@shikijs/langs/protobuf"),
  import("@shikijs/langs/ps"),
  import("@shikijs/langs/ps1"),
  import("@shikijs/langs/pug"),
  import("@shikijs/langs/puppet"),
  import("@shikijs/langs/purescript"),
  import("@shikijs/langs/py"),
  import("@shikijs/langs/python"),
  import("@shikijs/langs/ql"),
  import("@shikijs/langs/qml"),
  import("@shikijs/langs/qmldir"),
  import("@shikijs/langs/qss"),
  import("@shikijs/langs/r"),
  import("@shikijs/langs/racket"),
  import("@shikijs/langs/raku"),
  import("@shikijs/langs/razor"),
  import("@shikijs/langs/rb"),
  import("@shikijs/langs/reg"),
  import("@shikijs/langs/regex"),
  import("@shikijs/langs/regexp"),
  import("@shikijs/langs/rel"),
  import("@shikijs/langs/riscv"),
  import("@shikijs/langs/rs"),
  import("@shikijs/langs/rst"),
  import("@shikijs/langs/ruby"),
  import("@shikijs/langs/rust"),
  import("@shikijs/langs/sas"),
  import("@shikijs/langs/sass"),
  import("@shikijs/langs/scala"),
  import("@shikijs/langs/scheme"),
  import("@shikijs/langs/scss"),
  import("@shikijs/langs/sdbl"),
  import("@shikijs/langs/sh"),
  import("@shikijs/langs/shader"),
  import("@shikijs/langs/shaderlab"),
  import("@shikijs/langs/shell"),
  import("@shikijs/langs/shellscript"),
  import("@shikijs/langs/shellsession"),
  import("@shikijs/langs/smalltalk"),
  import("@shikijs/langs/solidity"),
  import("@shikijs/langs/soy"),
  import("@shikijs/langs/sparql"),
  import("@shikijs/langs/spl"),
  import("@shikijs/langs/splunk"),
  import("@shikijs/langs/sql"),
  import("@shikijs/langs/ssh-config"),
  import("@shikijs/langs/stata"),
  import("@shikijs/langs/styl"),
  import("@shikijs/langs/stylus"),
  import("@shikijs/langs/svelte"),
  import("@shikijs/langs/swift"),
  import("@shikijs/langs/system-verilog"),
  import("@shikijs/langs/systemd"),
  import("@shikijs/langs/talon"),
  import("@shikijs/langs/talonscript"),
  import("@shikijs/langs/tasl"),
  import("@shikijs/langs/tcl"),
  import("@shikijs/langs/templ"),
  import("@shikijs/langs/terraform"),
  import("@shikijs/langs/tex"),
  import("@shikijs/langs/tf"),
  import("@shikijs/langs/tfvars"),
  import("@shikijs/langs/toml"),
  import("@shikijs/langs/ts-tags"),
  import("@shikijs/langs/ts"),
  import("@shikijs/langs/tsp"),
  import("@shikijs/langs/tsv"),
  import("@shikijs/langs/tsx"),
  import("@shikijs/langs/turtle"),
  import("@shikijs/langs/twig"),
  import("@shikijs/langs/typ"),
  import("@shikijs/langs/typescript"),
  import("@shikijs/langs/typespec"),
  import("@shikijs/langs/typst"),
  import("@shikijs/langs/v"),
  import("@shikijs/langs/vala"),
  import("@shikijs/langs/vb"),
  import("@shikijs/langs/verilog"),
  import("@shikijs/langs/vhdl"),
  import("@shikijs/langs/vim"),
  import("@shikijs/langs/viml"),
  import("@shikijs/langs/vimscript"),
  import("@shikijs/langs/vue-directives"),
  import("@shikijs/langs/vue-html"),
  import("@shikijs/langs/vue-interpolations"),
  import("@shikijs/langs/vue-sfc-style-variable-injection"),
  import("@shikijs/langs/vue"),
  import("@shikijs/langs/vy"),
  import("@shikijs/langs/vyper"),
  import("@shikijs/langs/wasm"),
  import("@shikijs/langs/wenyan"),
  import("@shikijs/langs/wgsl"),
  import("@shikijs/langs/wiki"),
  import("@shikijs/langs/wikitext"),
  import("@shikijs/langs/wit"),
  import("@shikijs/langs/wl"),
  import("@shikijs/langs/wolfram"),
  import("@shikijs/langs/xml"),
  import("@shikijs/langs/xsl"),
  import("@shikijs/langs/yaml"),
  import("@shikijs/langs/yml"),
  import("@shikijs/langs/zenscript"),
  import("@shikijs/langs/zig"),
  import("@shikijs/langs/zsh"),
];

export const highlighter = await createHighlighterCore({
  langs,
  themes: [
    import("@shikijs/themes/one-light"),
    import("@shikijs/themes/tokyo-night"),
  ],
  engine: createOnigurumaEngine(import("shiki/wasm")),
});

export const displayNames = (await Promise.all(langs))
  .reduce((acc, cur) => {
    const item = cur.default[0];

    for (const ft of [item.name, ...item.fileTypes ?? []]) {
      if (item.displayName) {
        acc[ft] = item.displayName;
      }
    }

    return acc;
  }, {} as Record<string, string>);
