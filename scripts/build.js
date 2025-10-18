#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const {
    parse,
    compileScript,
    compileTemplate,
    compileStyleAsync
} = require('@vue/compiler-sfc');

const projectRoot = process.cwd();
const srcDir = path.join(projectRoot, 'src');
const outDir = path.join(projectRoot, 'dist');
const assetDir = path.join(outDir, 'assets');

const compiledModules = new Map();
const moduleOrder = [];
const cssChunks = [];

const ensureDir = async (dir) => {
    await fs.mkdir(dir, {recursive: true});
};

const copyFile = async (from, to) => {
    await ensureDir(path.dirname(to));
    await fs.copyFile(from, to);
};

const cleanOutput = async () => {
    await fs.rm(outDir, {recursive: true, force: true});
};

const normaliseModuleId = (filePath) => `@/${path.relative(srcDir, filePath).replace(/\\/g, '/')}`;

const parseBindings = (raw) => {
    const trimmed = raw.trim();
    if (trimmed.startsWith('{')) {
        const inner = trimmed.slice(1, -1);
        const named = inner
            .split(',')
            .map((entry) => entry.trim())
            .filter(Boolean)
            .map((entry) => {
                const parts = entry.split(/\s+as\s+/i);
                const imported = parts[0].trim();
                const local = parts[1] ? parts[1].trim() : imported;
                return {imported, local};
            });
        return {named, defaultName: null};
    }
    if (trimmed.startsWith('* as ')) {
        const name = trimmed.replace('* as', '').trim();
        return {named: [], namespace: name};
    }
    return {named: [], defaultName: trimmed};
};

async function compileVueModule(filePath) {
    const absolutePath = path.resolve(filePath);
    if (compiledModules.has(absolutePath)) {
        return;
    }

    const source = await fs.readFile(absolutePath, 'utf8');
    const {descriptor} = parse(source, {filename: absolutePath});
    const moduleId = normaliseModuleId(absolutePath);
    const scopeHash = crypto.createHash('md5').update(moduleId).digest('hex');
    const hasScopedStyles = descriptor.styles.some((style) => style.scoped);
    const scopeId = hasScopedStyles ? `data-v-${scopeHash}` : null;

    const script = compileScript(descriptor, {
        id: scopeHash,
        genDefaultAs: '__sfc__'
    });

    const importRegex = /^import\s+([^;]+?)\s+from\s+['"](.+?)['"];?$/gm;
    const imports = [];
    let scriptBody = script.content.replace(importRegex, (match, bindings, specifier) => {
        imports.push({bindings: bindings.trim(), specifier});
        return '';
    });

    const vueDefaultNames = new Set();
    const vueNamespaces = new Set();
    const vueNamedImports = new Map();
    const moduleImportLines = [];

    for (const entry of imports) {
        const {bindings, specifier} = entry;
        const bindingInfo = parseBindings(bindings);

        if (specifier === 'vue') {
            if (bindingInfo.namespace) {
                vueNamespaces.add(bindingInfo.namespace);
            }
            if (bindingInfo.defaultName) {
                vueDefaultNames.add(bindingInfo.defaultName);
            }
            for (const entry of bindingInfo.named) {
                vueNamedImports.set(entry.imported, entry.local);
            }
            continue;
        }

        if (specifier.endsWith('.vue')) {
            const resolved = path.resolve(path.dirname(absolutePath), specifier);
            await compileVueModule(resolved);
            const dependencyId = normaliseModuleId(resolved);

            if (bindingInfo.namespace) {
                moduleImportLines.push(`const ${bindingInfo.namespace} = __require('${dependencyId}');`);
            }
            if (bindingInfo.defaultName) {
                moduleImportLines.push(`const ${bindingInfo.defaultName} = __require('${dependencyId}').default;`);
            }
            if (bindingInfo.named.length) {
                const destructured = bindingInfo.named
                    .map(({imported, local}) => imported === local ? imported : `${imported}: ${local}`)
                    .join(', ');
                moduleImportLines.push(
                    `const { ${destructured} } = __require('${dependencyId}');`
                );
            }
            continue;
        }

        moduleImportLines.push(`// Unsupported import "${specifier}" was skipped.`);
    }

    let moduleCode = scriptBody.trimEnd();

    if (descriptor.template) {
        const template = compileTemplate({
            id: scopeHash,
            filename: absolutePath,
            source: descriptor.template.content,
            scoped: hasScopedStyles,
            compilerOptions: hasScopedStyles ? {scopeId} : {}
        });
        const templateImports = [];
        let templateCode = template.code.replace(importRegex, (match, bindings, specifier) => {
            templateImports.push({bindings: bindings.trim(), specifier});
            return '';
        });

        for (const entry of templateImports) {
            const bindingInfo = parseBindings(entry.bindings);
            if (entry.specifier === 'vue') {
                if (bindingInfo.namespace) {
                    vueNamespaces.add(bindingInfo.namespace);
                }
                if (bindingInfo.defaultName) {
                    vueDefaultNames.add(bindingInfo.defaultName);
                }
                for (const entry of bindingInfo.named) {
                    vueNamedImports.set(entry.imported, entry.local);
                }
                continue;
            }

            moduleImportLines.push(`// Unsupported template import "${entry.specifier}" was skipped.`);
        }

        templateCode = templateCode.replace(/export\s+function\s+render/g, 'function render');
        moduleCode += `\n\n${templateCode}\n__sfc__.render = render;`;
    }

    if (scopeId) {
        moduleCode += `\n__sfc__.__scopeId = '${scopeId}';`;
    }

    for (const styleBlock of descriptor.styles) {
        const styleResult = await compileStyleAsync({
            id: scopeHash,
            filename: absolutePath,
            source: styleBlock.content,
            scoped: styleBlock.scoped,
            isProd: true
        });

        if (styleResult.errors?.length) {
            throw new Error(styleResult.errors.join('\n'));
        }

        cssChunks.push(styleResult.code);
    }

    moduleCode += `\nmodule.exports.default = __sfc__;\n`;

    const preambleLines = [];
    for (const name of vueNamespaces) {
        preambleLines.push(`const ${name} = window.Vue;`);
    }
    for (const name of vueDefaultNames) {
        preambleLines.push(`const ${name} = window.Vue;`);
    }
    if (vueNamedImports.size) {
        const destructuredVueImports = Array.from(vueNamedImports.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([imported, local]) => imported === local ? imported : `${imported}: ${local}`)
            .join(', ');
        preambleLines.push(`const { ${destructuredVueImports} } = window.Vue;`);
    }
    preambleLines.push(...moduleImportLines);

    if (preambleLines.length) {
        moduleCode = `${preambleLines.join('\n')}\n\n${moduleCode}`;
    }

    compiledModules.set(absolutePath, {id: moduleId, code: moduleCode});
    moduleOrder.push(absolutePath);
}

const createRuntime = () => {
    return `const __registry = Object.create(null);\n` +
        `function __define(id, factory) {\n  __registry[id] = { factory, exports: undefined };\n}\n` +
        `function __require(id) {\n  const record = __registry[id];\n  if (!record) {\n    throw new Error('Module "' + id + '" is not registered.');\n  }\n  if (record.exports === undefined) {\n    const module = { exports: {} };\n    const returned = record.factory(module, module.exports, __require);\n    record.exports = returned !== undefined ? returned : module.exports;\n  }\n  return record.exports;\n}\n`;
};

async function writeJavascriptBundle() {
    const entryPath = path.join(srcDir, 'Popup.vue');
    await compileVueModule(entryPath);

    const runtime = createRuntime();
    const definitions = moduleOrder
        .map((filePath) => {
            const module = compiledModules.get(filePath);
            return `__define('${module.id}', function(module, exports, __require) {\n${module.code}\n});`;
        })
        .join('\n\n');

    const bootstrap = `const { createApp } = window.Vue;\nconst app = createApp(__require('@/Popup.vue').default);\napp.mount('#app');\n`;

    const output = `'use strict';\n(function() {\n${runtime}\n${definitions}\n\n${bootstrap}})();\n`;

    await ensureDir(assetDir);
    await fs.writeFile(path.join(assetDir, 'popup.js'), output, 'utf8');
}

async function writeCssBundle() {
    const baseCssPath = path.join(srcDir, 'assets/css/popup.css');
    let baseCss = '';
    try {
        baseCss = await fs.readFile(baseCssPath, 'utf8');
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
    }

    const styles = [baseCss.trim(), ...cssChunks].filter(Boolean).join('\n\n');
    await ensureDir(assetDir);
    await fs.writeFile(path.join(assetDir, 'popup.css'), styles, 'utf8');
}

async function copyStaticAssets() {
    const targets = [
        ['manifest.json', 'manifest.json'],
        ['content.js', 'content.js'],
        ['background.js', 'background.js'],
        ['src/scripts/futbin-link.js', 'assets/futbin-link.js'],
        ['src/assets/img/target16.png', 'assets/target16.png'],
        ['src/assets/img/target48.png', 'assets/target48.png'],
        ['src/assets/img/SniperInForrest2.0.jpg', 'img/SniperInForrest2.0.jpg'],
        ['src/assets/sound/SniperHeadShot.MP3', 'assets/SniperHeadShot.MP3'],
        ['src/assets/sound/SniperMiss.MP3', 'assets/SniperMiss.MP3'],
        ['node_modules/vue/dist/vue.global.prod.js', 'assets/vue.global.prod.js']
    ];

    for (const [from, to] of targets) {
        const source = path.join(projectRoot, from);
        const destination = path.join(outDir, to);
        await copyFile(source, destination);
    }
}

async function copyPopupHtml() {
    const source = path.join(srcDir, 'popup.html');
    const destination = path.join(outDir, 'src/popup.html');
    await copyFile(source, destination);
}

async function main() {
    await cleanOutput();
    await writeJavascriptBundle();
    await writeCssBundle();
    await copyStaticAssets();
    await copyPopupHtml();
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
